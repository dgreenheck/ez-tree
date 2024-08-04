import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Billboard, LeafType, Tree, TreeType } from '@dgreenheck/tree-js';

const exporter = new GLTFExporter();
let gui = new GUI();

/**
 * Setups the UI
 * @param {Tree} tree
 */
export function setupUI(tree, renderer, scene, camera) {
  gui.destroy();
  gui = new GUI();

  gui.add(tree.params, 'seed', 0, 65536, 1).name('Seed');
  gui.add(tree.params, 'type', TreeType).name('Tree Type');
  gui
    .add(
      {
        exportParams: () => {
          const link = document.getElementById('downloadLink');
          const json = JSON.stringify(tree.params, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          link.href = URL.createObjectURL(blob);
          link.download = 'tree.json';
          link.click();
        },
      },
      'exportParams',
    )
    .name('Save Parameters');

  gui
    .add(
      {
        loadParams: () => {
          document.getElementById('fileInput').click();
        },
      },
      'loadParams',
    )
    .name('Load Parameters');

  const branchFolder = gui.addFolder('Branches').close();

  const sectionsFolder = branchFolder.addFolder('Sections');
  sectionsFolder
    .add(tree.params.branch.sections, '1', 1, 20, 1)
    .name('Level 1');
  sectionsFolder
    .add(tree.params.branch.sections, '2', 1, 20, 1)
    .name('Level 2');
  sectionsFolder
    .add(tree.params.branch.sections, '3', 1, 20, 1)
    .name('Level 3');
  sectionsFolder
    .add(tree.params.branch.sections, '4', 1, 20, 1)
    .name('Level 4');

  const segmentsFolder = branchFolder.addFolder('Segments');
  segmentsFolder
    .add(tree.params.branch.segments, '1', 3, 16, 1)
    .name('Level 1');
  segmentsFolder
    .add(tree.params.branch.segments, '2', 3, 16, 1)
    .name('Level 2');
  segmentsFolder
    .add(tree.params.branch.segments, '3', 3, 16, 1)
    .name('Level 3');
  segmentsFolder
    .add(tree.params.branch.segments, '4', 3, 16, 1)
    .name('Level 4');

  branchFolder.add(tree.params.branch, 'levels', 1, 4, 1).name('Levels');
  branchFolder
    .add(tree.params.branch, 'children', 0, 100, 1)
    .name('Child Count');
  branchFolder.add(tree.params.branch, 'start', 0, 1).name('Start');
  branchFolder.add(tree.params.branch, 'angle', 0, Math.PI).name('Angle');
  branchFolder.add(tree.params.branch, 'lengthMultiplier', 0, 1).name('Length');
  branchFolder.add(tree.params.branch, 'radiusMultiplier', 0, 1).name('Radius');
  branchFolder.add(tree.params.branch, 'taper', 0.1, 1).name('Taper');
  branchFolder
    .add(tree.params.branch, 'gnarliness', -0.5, 0.5)
    .name('Gnarliness');
  branchFolder
    .add(tree.params.branch, 'twist', -0.25, 0.25, 0.01)
    .name('Twist');

  const forceFolder = branchFolder.addFolder('External Force').close();
  forceFolder.add(tree.params.branch.force.direction, 'x', -1, 1).name('X');
  forceFolder.add(tree.params.branch.force.direction, 'y', -1, 1).name('Y');
  forceFolder.add(tree.params.branch.force.direction, 'z', -1, 1).name('Z');
  forceFolder
    .add(tree.params.branch.force, 'strength', -0.1, 0.1)
    .name('Strength');

  const leavesFolder = gui.addFolder('Leaves').close();

  leavesFolder.add(tree.params.leaves, 'type', LeafType);
  leavesFolder
    .add(tree.params.leaves, 'billboard', Billboard)
    .name('Billboard');
  leavesFolder.add(tree.params.leaves, 'count', 0, 100, 1).name('Count');
  leavesFolder.add(tree.params.leaves, 'start', 0, 1).name('Start');
  leavesFolder.add(tree.params.leaves, 'size', 0, 5).name('Size');
  leavesFolder
    .add(tree.params.leaves, 'sizeVariance', 0, 1)
    .name('Size Variance');
  leavesFolder.addColor(tree.params.leaves, 'color').name('Color');
  leavesFolder.add(tree.params.leaves, 'alphaTest', 0, 1).name('AlphaTest');

  const trunkFolder = gui.addFolder('Trunk').close();
  trunkFolder.addColor(tree.params.trunk, 'color').name('Color');
  trunkFolder.add(tree.params.trunk, 'flatShading').name('Flat Shading');
  trunkFolder.add(tree.params.trunk, 'length', 0, 50).name('Length');
  trunkFolder.add(tree.params.trunk, 'radius', 0, 5).name('Radius');

  const exportFolder = gui.addFolder('Export').close();
  exportFolder
    .add(
      {
        exportGlb: () =>
          exporter.parse(
            tree,
            (glb) => {
              const blob = new Blob([glb], {
                type: 'application/octet-stream',
              });
              const url = window.URL.createObjectURL(blob);
              const link = document.getElementById('downloadLink');
              link.href = url;
              link.download = 'tree.glb';
              link.click();
            },
            (err) => {
              console.error(err);
            },
            { binary: true },
          ),
      },
      'exportGlb',
    )
    .name('Export GLB');

  exportFolder
    .add(
      {
        exportPng: () => {
          renderer.setClearColor(0x000000, 0); // Set background to transparent
          renderer.render(scene, camera);

          const link = document.getElementById('downloadLink');
          link.href = renderer.domElement.toDataURL('image/png');
          link.download = 'tree.png';
          link.click();

          renderer.setClearColor(0); // Restore original background color
        },
      },
      'exportPng',
    )
    .name('Export PNG');

  gui.onChange(() => {
    tree.generate();
    tree.traverse((o) => {
      if (o.material) {
        o.material.needsUpdate = true;
      }
    });

    const vertexCount =
      (tree.branches.verts.length + tree.leaves.verts.length) / 3;
    const triangleCount =
      (tree.branches.indices.length + tree.leaves.indices.length) / 3;
    document.getElementById('model-info').innerText =
      `Vertex Count: ${vertexCount} | Triangle Count: ${triangleCount}`;
  });
}
