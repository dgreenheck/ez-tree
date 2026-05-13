import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Tree, TreePreset, Billboard } from '@dgreenheck/ez-tree';

const BILLBOARD = { single: Billboard.Single, double: Billboard.Double };

/**
 * Standalone 3D viewport showing a full tree (selectable preset + bark) using
 * the baked cluster atlas as its leaf texture. Rebuilds when either the
 * cluster atlas or the tree-side params change.
 *
 * The tree-side params (preset, bark, billboard, cluster count/size, seed)
 * change only the preview — they don't trigger an atlas rebake. Conversely,
 * an atlas rebake re-applies the latest tree-side params automatically.
 */
export class Preview3D {
  constructor(hostEl) {
    this.host = hostEl;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x141820);
    hostEl.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xb8d4ff, 0x3a3025, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 3.0);
    sun.position.set(30, 50, 20);
    this.scene.add(sun);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 1000);
    this.camera.position.set(60, 45, 60);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 25, 0);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 300;
    this.controls.update();

    // Geometry counter overlay (top-right of preview).
    this.statsEl = document.createElement('div');
    this.statsEl.className = 'preview-stats';
    this.statsEl.style.cssText = [
      'position: absolute',
      'top: 8px',
      'right: 12px',
      'padding: 4px 8px',
      'background: rgba(0, 0, 0, 0.55)',
      'color: #e8eaed',
      'font: 11px ui-monospace, Menlo, monospace',
      'border-radius: 4px',
      'pointer-events: none',
      'font-variant-numeric: tabular-nums',
    ].join(';');
    this.statsEl.textContent = '— verts · — tris';
    this.host.appendChild(this.statsEl);

    this.tree = null;
    this.atlasTexture = null;
    this._cluster = null;
    this._bark = null;
    this._treeOpts = null;

    this._resize();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this.host);

    this._tick = this._tick.bind(this);
    this._tick();
  }

  _resize() {
    const r = this.host.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    this.renderer.setSize(r.width, r.height, false);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
  }

  _tick() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._tick);
  }

  /**
   * @param {object} opts
   * @param {object} [opts.cluster] - { canvas, cols, rows } from latest bake
   * @param {object} [opts.bark]    - { type, maps } from same source as the bake
   * @param {object} [opts.tree]    - { preset, billboard, count, size, seed }
   */
  update(opts) {
    if (opts.cluster) {
      this._cluster = opts.cluster;
      if (this.atlasTexture) this.atlasTexture.dispose();
      this.atlasTexture = new THREE.CanvasTexture(opts.cluster.canvas);
      this.atlasTexture.colorSpace = THREE.SRGBColorSpace;
      this.atlasTexture.anisotropy = 4;
      this.atlasTexture.needsUpdate = true;
    }
    if (opts.bark) {
      this._bark = opts.bark;
    }
    if (opts.tree) {
      this._treeOpts = opts.tree;
    }
    if (this._cluster && this._bark && this._treeOpts) {
      this._rebuild();
    }
  }

  _rebuild() {
    if (this.tree) {
      this.scene.remove(this.tree);
      this._disposeTree(this.tree);
      this.tree = null;
    }

    const { preset, billboard, count, size, seed } = this._treeOpts;
    const presetJson = TreePreset[preset];
    const tree = new Tree();
    if (presetJson) tree.options.copy(structuredClone(presetJson));

    tree.options.seed = seed;

    // Bark textures supplied by the caller (same source the bake used, so
    // the cluster card's baked twig matches the consumer tree's branches).
    if (this._bark?.maps) {
      tree.options.bark.type = this._bark.type;
      tree.options.bark.textured = true;
      tree.options.bark.maps.color = this._bark.maps.color;
      tree.options.bark.maps.ao = this._bark.maps.ao;
      tree.options.bark.maps.normal = this._bark.maps.normal;
      tree.options.bark.maps.roughness = this._bark.maps.roughness;
    }

    // Replace whatever the preset declared for leaves with the baked cluster
    // atlas. Lower the count and bump the size — each leaf instance now
    // represents a clump of N leaves rather than a single leaf.
    tree.options.leaves.maps.color = this.atlasTexture;
    tree.options.leaves.maps.normal = null;
    tree.options.leaves.maps.roughness = null;
    tree.options.leaves.maps.ao = null;
    tree.options.leaves.maps.scattering = null;
    tree.options.leaves.atlas = {
      cols: this._cluster.cols,
      rows: this._cluster.rows,
      rotation: 0,
    };
    tree.options.leaves.billboard = BILLBOARD[billboard] ?? Billboard.Single;
    tree.options.leaves.count = count;
    tree.options.leaves.size = size;
    tree.options.leaves.alphaTest = 0.5;
    tree.options.leaves.tint = 0xffffff;
    tree.options.leaves.roundedNormals = true;

    tree.generate();
    this.scene.add(tree);
    this.tree = tree;

    const { verts, tris } = countGeometry(tree);
    this.statsEl.textContent = `${verts.toLocaleString()} verts · ${tris.toLocaleString()} tris`;
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
}

/**
 * Walk a tree and tally total vertex + triangle counts across every Mesh
 * geometry. Triangle count comes from the index buffer (length / 3) when
 * present, otherwise from the position count (assumes non-indexed triangles).
 */
function countGeometry(tree) {
  let verts = 0;
  let tris = 0;
  tree.traverse((obj) => {
    const g = obj.geometry;
    if (!g) return;
    const pos = g.getAttribute && g.getAttribute('position');
    if (pos) verts += pos.count;
    const idx = g.getIndex && g.getIndex();
    if (idx) tris += idx.count / 3;
    else if (pos) tris += pos.count / 3;
  });
  return { verts, tris };
}

