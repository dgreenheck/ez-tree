import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Billboard, LeafType, Tree } from '@dgreenheck/tree-js';

const exporter = new GLTFExporter();

/**
 * Setups the UI
 * @param {Tree} tree 
 * @param {*} bloomPass 
 */
export function setupUI(tree, renderer, scene, camera, bloomPass) {
  const gui = new GUI();

  gui.add(tree.params, 'seed', 0, 65536, 1).name('Seed');

  const trunkFolder = gui.addFolder('Trunk').close();
  trunkFolder.addColor(tree.params.trunk, 'color').name('Color');
  trunkFolder.add(tree.params.trunk, 'flatShading').name('Flat Shading');
  trunkFolder.add(tree.params.trunk, 'length', 0, 50).name('Length');
  trunkFolder.add(tree.params.trunk, 'radius', 0, 5).name('Radius');

  const branchFolder = gui.addFolder('Branches').close();

  const forceFolder = branchFolder.addFolder('External Force').close();
  forceFolder.add(tree.params.branch.force.direction, 'x', -1, 1).name('X');
  forceFolder.add(tree.params.branch.force.direction, 'y', -1, 1).name('Y');
  forceFolder.add(tree.params.branch.force.direction, 'z', -1, 1).name('Z');
  forceFolder.add(tree.params.branch.force, 'strength', -0.1, 0.1).name('Strength');

  branchFolder.add(tree.params.branch, 'levels', 1, 4, 1).name('Levels');
  branchFolder.add(tree.params.branch, 'children', 1, 5, 1).name('Child Count');
  branchFolder.add(tree.params.branch, 'start', 0, 1).name('Start');
  branchFolder.add(tree.params.branch, 'stop', 0, 1).name('Stop');
  branchFolder.add(tree.params.branch, 'angle', 0, Math.PI).name('Angle');
  branchFolder.add(tree.params.branch, 'angleVariance', 0, Math.PI).name('Angle Variance');
  branchFolder.add(tree.params.branch, 'lengthVariance', 0, 1).name('Length Variance');
  branchFolder.add(tree.params.branch, 'lengthMultiplier', 0, 1).name('Length Multiplier');
  branchFolder.add(tree.params.branch, 'radiusMultiplier', 0, 1).name('Radius Multiplier');
  branchFolder.add(tree.params.branch, 'taper', 0.5, 1).name('Taper');
  branchFolder.add(tree.params.branch, 'gnarliness', 0, 0.5).name('Gnarliness (1)');
  branchFolder.add(tree.params.branch, 'twist', -0.25, 0.25, 0.01).name('Twist Strength');

  const geometryFolder = gui.addFolder('Geometry').close();
  geometryFolder.add(tree.params.geometry, 'sections', 1, 20, 1).name('Section Count');
  geometryFolder.add(tree.params.geometry, 'lengthVariance', 0, 1).name('Section Length Variance');
  geometryFolder.add(tree.params.geometry, 'radiusVariance', 0, 1).name('Section Radius Variance');
  geometryFolder.add(tree.params.geometry, 'segments', 3, 32, 1).name('Radial Segment Count');
  geometryFolder.add(tree.params.geometry, 'randomization', 0, 0.5).name('Vertex Randomization');

  const leavesFolder = gui.addFolder('Leaves').close();

  leavesFolder.add(tree.params.leaves, 'type', LeafType);
  leavesFolder.add(tree.params.leaves, 'billboard', Billboard).name('Billboard');
  leavesFolder.add(tree.params.leaves, 'count', 0, 100, 1).name('Count');
  leavesFolder.add(tree.params.leaves, 'size', 0, 5).name('Size');
  leavesFolder.add(tree.params.leaves, 'sizeVariance', 0, 1).name('Size Variance');
  leavesFolder.addColor(tree.params.leaves, 'color').name('Color');
  leavesFolder.add(tree.params.leaves, 'emissive', 0, 1).name('Emissive');
  leavesFolder.add(tree.params.leaves, 'opacity', 0, 1).name('Opacity');
  leavesFolder.add(tree.params.leaves, 'alphaTest', 0, 1).name('AlphaTest');

  const exportFolder = gui.addFolder('Export').close();
  exportFolder.add({
    exportGlb: () => exporter.parse(
      tree,
      (glb) => {
        const blob = new Blob([glb], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.getElementById('downloadLink');
        link.href = url;
        link.download = 'tree.glb';
        link.click();
      },
      (err) => {
        console.error(err);
      },
      { binary: true }
    )
  }, 'exportGlb').name('Export GLB');

  exportFolder.add({
    exportPng: () => {
      renderer.setClearColor(0x000000, 0); // Set background to transparent
      renderer.render(scene, camera);

      const link = document.getElementById('downloadLink');
      link.href = renderer.domElement.toDataURL('image/png');
      link.download = 'tree.png';
      link.click();

      renderer.setClearColor(0); // Restore original background color
    }
  }, 'exportPng').name('Export PNG');

  exportFolder.add({
    exportParams: () => {
      const link = document.getElementById('downloadLink');
      const json = JSON.stringify(tree.params, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      link.href = URL.createObjectURL(blob);
      link.download = 'tree.json';
      link.click();
    }
  }, 'exportParams').name('Save Parameters');

  exportFolder.add({
    loadParams: () => {
      document.getElementById('fileInput').click();
    }
  }, 'loadParams').name('Load Parameters');

  gui.onChange(() => {
    tree.generate();
    tree.traverse(o => {
      if (o.material) {
        o.material.needsUpdate = true;
      }
    });

    const vertexCount = (tree.branches.verts.length + tree.leaves.verts.length) / 3;
    const triangleCount = (tree.branches.indices.length + tree.leaves.indices.length) / 3;
    document.getElementById('model-info').innerText = `Vertex Count: ${vertexCount} | Triangle Count: ${triangleCount}`;
  });
}