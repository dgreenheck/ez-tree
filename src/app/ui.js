import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { BarkType, Billboard, LeafType, TreePreset, Tree, TreeType } from '@dgreenheck/ez-tree';
import { Environment } from './environment';

const exporter = new GLTFExporter();
let gui = new GUI();

/**
 * Setups the UI
 * @param {Tree} tree
 * @param {Environment} environment
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 */
export function setupUI(
  tree,
  environment,
  renderer,
  scene,
  camera,
  initialPreset = 'Ash Large') {

  gui.destroy();
  gui = new GUI();

  const guiData = {
    selectedPreset: initialPreset
  };

  const presetSelect = gui.add(guiData, 'selectedPreset', Object.keys(TreePreset)).name('Preset');
  presetSelect.onChange(() => {
    tree.loadPreset(guiData.selectedPreset);
    // Refresh the UI to reflect the preset options
    setupUI(tree, environment, renderer, scene, camera, guiData.selectedPreset);
  });

  gui.add(tree.options, 'seed', 0, 65536, 1).name('Seed');
  gui.add(tree.options, 'type', TreeType).name('Tree Type');

  const barkFolder = gui.addFolder('Bark').close();
  barkFolder.add(tree.options.bark, 'type', BarkType).name('Type');
  barkFolder.addColor(tree.options.bark, 'tint').name('Tint');
  barkFolder.add(tree.options.bark, 'flatShading').name('Flat Shading');
  barkFolder.add(tree.options.bark, 'textured').name('Textured');
  barkFolder.add(tree.options.bark.textureScale, 'x').name('Texture Scale X');
  barkFolder.add(tree.options.bark.textureScale, 'y').name('Texture Scale Y');

  const branchFolder = gui.addFolder('Branches').close();
  branchFolder.add(tree.options.branch, 'levels', 0, 3, 1).name('Levels');

  const branchAngleFolder = branchFolder.addFolder('Angle').close();
  branchAngleFolder
    .add(tree.options.branch.angle, '1', 0, 360, 1)
    .name('Level 1');
  branchAngleFolder
    .add(tree.options.branch.angle, '2', 0, 360, 1)
    .name('Level 2');
  branchAngleFolder
    .add(tree.options.branch.angle, '3', 0, 360, 1)
    .name('Level 3');

  const childrenFolder = branchFolder.addFolder('Children').close();
  childrenFolder
    .add(tree.options.branch.children, '0', 0, 100, 1)
    .name('Trunk');
  childrenFolder
    .add(tree.options.branch.children, '1', 0, 10, 1)
    .name('Level 1');
  childrenFolder
    .add(tree.options.branch.children, '2', 0, 5, 1)
    .name('Level 2');

  const gnarlinessFolder = branchFolder.addFolder('Gnarliness').close();
  gnarlinessFolder
    .add(tree.options.branch.gnarliness, '0', -0.5, 0.5, 0.01)
    .name('Trunk');
  gnarlinessFolder
    .add(tree.options.branch.gnarliness, '1', -0.5, 0.5, 0.01)
    .name('Level 1');
  gnarlinessFolder
    .add(tree.options.branch.gnarliness, '2', -0.5, 0.5, 0.01)
    .name('Level 2');
  gnarlinessFolder
    .add(tree.options.branch.gnarliness, '3', -0.5, 0.5, 0.01)
    .name('Level 3');

  const forceFolder = branchFolder.addFolder('Growth Direction').close();
  forceFolder.add(tree.options.branch.force.direction, 'x', -1, 1).name('X');
  forceFolder.add(tree.options.branch.force.direction, 'y', -1, 1).name('Y');
  forceFolder.add(tree.options.branch.force.direction, 'z', -1, 1).name('Z');
  forceFolder
    .add(tree.options.branch.force, 'strength', -0.1, 0.1)
    .name('Strength');

  const lengthFolder = branchFolder.addFolder('Length').close();
  lengthFolder
    .add(tree.options.branch.length, '0', 0.1, 100, 0.01)
    .name('Trunk');
  lengthFolder
    .add(tree.options.branch.length, '1', 0.1, 100, 0.01)
    .name('Level 1');
  lengthFolder
    .add(tree.options.branch.length, '2', 0.1, 100, 0.01)
    .name('Level 2');
  lengthFolder
    .add(tree.options.branch.length, '3', 0.1, 100, 0.01)
    .name('Level 3');

  const branchRadiusFolder = branchFolder.addFolder('Radius').close();
  branchRadiusFolder
    .add(tree.options.branch.radius, '0', 0.1, 5, 0.01)
    .name('Trunk');
  branchRadiusFolder
    .add(tree.options.branch.radius, '1', 0.1, 5, 0.01)
    .name('Level 1');
  branchRadiusFolder
    .add(tree.options.branch.radius, '2', 0.1, 5, 0.01)
    .name('Level 2');
  branchRadiusFolder
    .add(tree.options.branch.radius, '3', 0.1, 5, 0.01)
    .name('Level 3');

  const sectionsFolder = branchFolder.addFolder('Sections').close();
  sectionsFolder
    .add(tree.options.branch.sections, '0', 1, 20, 1)
    .name('Trunk');
  sectionsFolder
    .add(tree.options.branch.sections, '1', 1, 20, 1)
    .name('Level 1');
  sectionsFolder
    .add(tree.options.branch.sections, '2', 1, 20, 1)
    .name('Level 2');
  sectionsFolder
    .add(tree.options.branch.sections, '3', 1, 20, 1)
    .name('Level 3');

  const segmentsFolder = branchFolder.addFolder('Segments').close();
  segmentsFolder
    .add(tree.options.branch.segments, '0', 3, 16, 1)
    .name('Trunk');
  segmentsFolder
    .add(tree.options.branch.segments, '1', 3, 16, 1)
    .name('Level 1');
  segmentsFolder
    .add(tree.options.branch.segments, '2', 3, 16, 1)
    .name('Level 2');
  segmentsFolder
    .add(tree.options.branch.segments, '3', 3, 16, 1)
    .name('Level 3');

  const branchStartFolder = branchFolder.addFolder('Start').close();
  branchStartFolder
    .add(tree.options.branch.start, '1', 0, 1, 0.01)
    .name('Level 1');
  branchStartFolder
    .add(tree.options.branch.start, '2', 0, 1, 0.01)
    .name('Level 2');
  branchStartFolder
    .add(tree.options.branch.start, '3', 0, 1, 0.01)
    .name('Level 3');

  const taperFolder = branchFolder.addFolder('Taper').close();
  taperFolder
    .add(tree.options.branch.taper, '0', 0, 1, 0.01)
    .name('Trunk');
  taperFolder
    .add(tree.options.branch.taper, '1', 0, 1, 0.01)
    .name('Level 1');
  taperFolder
    .add(tree.options.branch.taper, '2', 0, 1, 0.01)
    .name('Level 2');
  taperFolder
    .add(tree.options.branch.taper, '3', 0, 1, 0.01)
    .name('Level 3');

  const twistFolder = branchFolder.addFolder('Twist').close();
  twistFolder
    .add(tree.options.branch.twist, '0', -0.5, 0.5, 0.01)
    .name('Trunk');
  twistFolder
    .add(tree.options.branch.twist, '1', -0.5, 0.5, 0.01)
    .name('Level 1');
  twistFolder
    .add(tree.options.branch.twist, '2', -0.5, 0.5, 0.01)
    .name('Level 2');
  twistFolder
    .add(tree.options.branch.twist, '3', -0.5, 0.5, 0.01)
    .name('Level 3');

  addLeavesControls(gui, tree);

  gui
    .add(
      {
        exportParams: () => {
          const link = document.getElementById('downloadLink');
          const json = JSON.stringify(tree.options, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          link.href = URL.createObjectURL(blob);
          link.download = 'tree.json';
          link.click();
        },
      },
      'exportParams',
    )
    .name('Save Preset');

  gui
    .add(
      {
        loadParams: () => {
          document.getElementById('fileInput').click();
        },
      },
      'loadParams',
    )
    .name('Load Preset');

  gui
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

  gui
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

function addLeavesControls(gui, tree) {
  const leavesFolder = gui.addFolder('Leaves').close();
  leavesFolder.add(tree.options.leaves, 'type', LeafType).name('Type');
  leavesFolder.addColor(tree.options.leaves, 'tint').name('Tint');
  leavesFolder
    .add(tree.options.leaves, 'billboard', Billboard)
    .name('Billboard');
  leavesFolder.add(tree.options.leaves, 'angle', 0, 100, 1).name('Angle');
  leavesFolder.add(tree.options.leaves, 'count', 0, 100, 1).name('Count');
  leavesFolder.add(tree.options.leaves, 'start', 0, 1).name('Start');
  leavesFolder.add(tree.options.leaves, 'size', 0, 5).name('Size');
  leavesFolder
    .add(tree.options.leaves, 'sizeVariance', 0, 1)
    .name('Size Variance');

  leavesFolder.add(tree.options.leaves, 'alphaTest', 0, 1).name('AlphaTest');
}
