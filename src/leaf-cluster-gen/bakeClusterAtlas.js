import * as THREE from 'three';
import { createClusterMiniTree } from './miniTree.js';
import { CHANNELS, makeLeafMaterial, makeBranchMaterial } from './channelMaterials.js';
import { clusterizeLeaves } from './clusterFoliage.js';

/**
 * Renders an N×M grid of leaf-cluster cards onto a set of per-channel canvases
 * by running a tiny Three.js scene per cell. Each cell contains one mini-tree
 * (short branch + leaves) framed by an OrthographicCamera fitted to its
 * bounding box.
 *
 * The bake runs one pass per atlas channel (color/normal/roughness/ao/
 * scattering). For each pass we walk every cell, swap the tree's materials to
 * the channel-specific ones, render, then copy the renderer's framebuffer
 * into that channel's output canvas. This means N_channels × N_cells render
 * calls per bake — still cheap for the grid sizes we use here.
 */
export class ClusterBaker {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true, // needed so drawImage can read it back
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    // Lighting only matters for the color pass (the other channel materials
    // are unlit). Strong ambient so the diffuse texture dominates; a gentle
    // directional adds shape to the branch cylinder.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(0.4, 1, 0.8);
    this.scene.add(dir);

    // Per-channel output canvases. Lazily resized inside bake().
    this._outputs = Object.fromEntries(CHANNELS.map((ch) => [ch, document.createElement('canvas')]));
  }

  /**
   * @param {object} opts
   * @param {number} opts.cols
   * @param {number} opts.rows
   * @param {number} opts.tileSize
   * @param {number} opts.seed
   * @param {object} opts.leafSource - { maps, atlas } from loadSourceAtlas
   * @param {object} opts.miniTree   - mini-tree params (branch/leaves blocks)
   * @returns {{[channel: string]: HTMLCanvasElement}}
   */
  bake(opts) {
    const { cols, rows, tileSize, seed, leafSource, miniTree } = opts;
    const w = cols * tileSize;
    const h = rows * tileSize;

    this.renderer.setSize(w, h, false);
    for (const ch of CHANNELS) {
      const c = this._outputs[ch];
      c.width = w;
      c.height = h;
    }

    for (const channel of CHANNELS) {
      this._bakeChannel(channel, opts, w, h);
      const ctx = this._outputs[channel].getContext('2d');
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(this.renderer.domElement, 0, 0);
    }

    return this._outputs;
  }

  _bakeChannel(channel, opts, w, h) {
    const { cols, rows, tileSize, seed, leafSource, barkMaps, miniTree } = opts;

    // Clear the full framebuffer once before drawing cells. Scissor is enabled
    // for cell renders so neighbors aren't disturbed.
    this.renderer.setViewport(0, 0, w, h);
    this.renderer.setScissor(0, 0, w, h);
    this.renderer.setScissorTest(false);
    this.renderer.clear(true, true, true);
    this.renderer.setScissorTest(true);

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cellSeed = (seed * 1000 + cy * cols + cx) | 0;
        const tree = createClusterMiniTree({
          seed: cellSeed,
          branch: miniTree.branch,
          leaves: miniTree.leaves,
          leafMaps: leafSource.maps,
          leafAtlas: leafSource.atlas,
          barkMaps,
        });
        // Replace the lib's radial leaf placement with an alternating
        // left/right layout, attach each leaf to a tapered petiole, and
        // splat all leaves camera-facing.
        clusterizeLeaves(tree, {
          ...miniTree.foliage,
          branchSections: miniTree.branch?.sections,
          branchSegments: miniTree.branch?.segments,
        });
        this._applyChannelMaterials(tree, channel, leafSource, barkMaps);
        this.scene.add(tree);

        const camera = this._frameTree(tree);

        const vx = cx * tileSize;
        const vy = (rows - 1 - cy) * tileSize; // gl viewport origin is bottom-left
        this.renderer.setViewport(vx, vy, tileSize, tileSize);
        this.renderer.setScissor(vx, vy, tileSize, tileSize);
        this.renderer.clear(true, true, true);
        this.renderer.render(this.scene, camera);

        this.scene.remove(tree);
        this._disposeTree(tree);
      }
    }

    this.renderer.setScissorTest(false);
  }

  _applyChannelMaterials(tree, channel, leafSource, barkMaps) {
    const alphaTest = 0.5;

    const leafMat = makeLeafMaterial(channel, leafSource.maps, alphaTest);
    const branchMat = makeBranchMaterial(channel, barkMaps);

    if (tree.leavesMesh.material) tree.leavesMesh.material.dispose();
    tree.leavesMesh.material = leafMat;

    if (tree.branchesMesh.material) tree.branchesMesh.material.dispose();
    tree.branchesMesh.material = branchMat;

    if (tree.petiolesMesh) {
      if (tree.petiolesMesh.material) tree.petiolesMesh.material.dispose();
      // Petioles share the bark material — a separate instance because
      // disposal walks each mesh independently.
      tree.petiolesMesh.material = makeBranchMaterial(channel, barkMaps);
    }
  }

  _frameTree(tree) {
    // Anchor the cell so the branch root (world origin in the mini-tree
    // convention — force.direction = +Y starting at (0,0,0)) lands at the
    // bottom-middle of the cell, and the branch extends upward into the
    // frame from there.
    tree.updateMatrixWorld(true);
    const fullBox = new THREE.Box3().setFromObject(tree);
    if (fullBox.isEmpty()) {
      fullBox.setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(1, 1, 1));
    }

    const originX = 0;
    const originY = 0;

    // Vertical span: from the root (y=0) up to the top of the highest leaf.
    // Horizontal span: whichever side of the root the leaves stretch farther.
    const padY = Math.max(fullBox.max.y - originY, 0);
    const padX = Math.max(
      Math.abs(fullBox.max.x - originX),
      Math.abs(originX - fullBox.min.x),
    );
    // Square frustum (so the cell is undistorted), sized to the larger of
    // the two extents.
    const halfSpan = Math.max(padX, padY * 0.5, 0.001) * 1.1;

    // Camera target sits halfSpan above the root on the Y axis. With a
    // [-halfSpan, halfSpan] ortho frustum centered on the target, the root
    // lands at the frame's bottom edge and the top of the canopy lands at
    // (or below) the frame's top edge.
    const targetY = originY + halfSpan;

    const depthExtent = Math.max(fullBox.max.z - fullBox.min.z, 1);
    const cameraPushBack = depthExtent * 4 + 10;

    const cam = new THREE.OrthographicCamera(
      -halfSpan, halfSpan,
       halfSpan, -halfSpan,
       0.1, cameraPushBack * 2,
    );
    cam.position.set(originX, targetY, cameraPushBack);
    cam.lookAt(originX, targetY, 0);
    return cam;
  }

  _disposeTree(tree) {
    tree.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m.dispose();
      }
    });
  }

  dispose() {
    this.renderer.dispose();
  }
}
