import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { Pane } from 'tweakpane';
import { BarkType, Billboard, LeafType, TreePreset, Tree, TreeType } from '@dgreenheck/ez-tree';
import { Environment } from './environment';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { version } from '../../package.json';

const exporter = new GLTFExporter();
let pane = null;

/**
 * Setups the UI
 * @param {Tree} tree
 * @param {Environment} environment
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {OrbitControls} controls
 * @param {String} initialPreset
 */
export function setupUI(tree, environment, renderer, scene, camera, controls, initialPreset) {

  // Remove old event listener and dispose old pane
  pane?.off('change');
  pane?.dispose();

  pane = new Pane({ container: document.getElementById('ui-container'), title: 'EZ Tree' });

  const onChange = () => {
    tree.generate();
    tree.traverse((o) => {
      if (o.material) {
        o.material.needsUpdate = true;
      }
    });
  };


  const tab = pane.addTab({
    pages: [
      { title: 'Parameters' },
      { title: 'Import/Export' }
    ]
  });

  const treeFolder = tab.pages[0].addFolder({ title: 'Tree', expanded: true });

  // Update tree and material on change
  treeFolder.on('change', onChange);

  // Preset dropdown
  treeFolder.addBlade({
    view: 'list',
    label: 'preset',
    options: Object.keys(TreePreset).map(p => ({ text: p, value: p })),
    value: initialPreset
  }).on('change', (e) => {
    tree.loadPreset(e.value)
    pane.refresh();
  });

  treeFolder.addBinding(tree.options, 'seed', { min: 0, max: 65536, step: 1 });

  // Bark folder
  const barkFolder = treeFolder.addFolder({ title: 'Bark', expanded: false });
  barkFolder.addBinding(tree.options.bark, 'type', { options: BarkType });
  barkFolder.addBinding(tree.options.bark, 'tint', { view: 'color' });
  barkFolder.addBinding(tree.options.bark, 'flatShading');
  barkFolder.addBinding(tree.options.bark, 'textured');
  barkFolder.addBinding(tree.options.bark.textureScale, 'x', { min: 0.5, max: 5 });
  barkFolder.addBinding(tree.options.bark.textureScale, 'y', { min: 0.5, max: 5 });

  // Branch folder
  const branchFolder = treeFolder.addFolder({ title: 'Branches', expanded: false });

  branchFolder.addBinding(tree.options, 'type', { options: TreeType });
  branchFolder.addBinding(tree.options.branch, 'levels', { min: 0, max: 3, step: 1 });

  const branchAngleFolder = branchFolder.addFolder({ title: 'Angle', expanded: false });
  branchAngleFolder.addBinding(tree.options.branch.angle, '1', { min: 0, max: 180 });
  branchAngleFolder.addBinding(tree.options.branch.angle, '2', { min: 0, max: 180 });
  branchAngleFolder.addBinding(tree.options.branch.angle, '3', { min: 0, max: 180 });

  const childrenFolder = branchFolder.addFolder({ title: 'Children', expanded: false });
  childrenFolder.addBinding(tree.options.branch.children, '0', { min: 0, max: 100, step: 1 });
  childrenFolder.addBinding(tree.options.branch.children, '1', { min: 0, max: 10, step: 1 });
  childrenFolder.addBinding(tree.options.branch.children, '2', { min: 0, max: 5, step: 1 });

  const gnarlinessFolder = branchFolder.addFolder({ title: 'Gnarliness', expanded: false });
  gnarlinessFolder.addBinding(tree.options.branch.gnarliness, '0', { min: -0.5, max: 0.5 });
  gnarlinessFolder.addBinding(tree.options.branch.gnarliness, '1', { min: -0.5, max: 0.5 });
  gnarlinessFolder.addBinding(tree.options.branch.gnarliness, '2', { min: -0.5, max: 0.5 });
  gnarlinessFolder.addBinding(tree.options.branch.gnarliness, '3', { min: -0.5, max: 0.5 });

  const forceFolder = branchFolder.addFolder({ title: 'Growth Direction', expanded: false });
  forceFolder.addBinding(tree.options.branch.force.direction, 'x', { min: -1, max: 1 });
  forceFolder.addBinding(tree.options.branch.force.direction, 'y', { min: -1, max: 1 });
  forceFolder.addBinding(tree.options.branch.force.direction, 'z', { min: -1, max: 1 });
  forceFolder.addBinding(tree.options.branch.force, 'strength', { min: -0.1, max: 0.1, step: 0.001 });

  const lengthFolder = branchFolder.addFolder({ title: 'Length', expanded: false });
  lengthFolder.addBinding(tree.options.branch.length, '0', { min: 0.1, max: 100 });
  lengthFolder.addBinding(tree.options.branch.length, '1', { min: 0.1, max: 100 });
  lengthFolder.addBinding(tree.options.branch.length, '2', { min: 0.1, max: 100 });
  lengthFolder.addBinding(tree.options.branch.length, '3', { min: 0.1, max: 100 });

  const branchRadiusFolder = branchFolder.addFolder({ title: 'Radius', expanded: false });
  branchRadiusFolder.addBinding(tree.options.branch.radius, '0', { min: 0.1, max: 5 });
  branchRadiusFolder.addBinding(tree.options.branch.radius, '1', { min: 0.1, max: 5 });
  branchRadiusFolder.addBinding(tree.options.branch.radius, '2', { min: 0.1, max: 5 });
  branchRadiusFolder.addBinding(tree.options.branch.radius, '3', { min: 0.1, max: 5 });

  const sectionsFolder = branchFolder.addFolder({ title: 'Sections', expanded: false });
  sectionsFolder.addBinding(tree.options.branch.sections, '0', { min: 1, max: 20, step: 1 });
  sectionsFolder.addBinding(tree.options.branch.sections, '1', { min: 1, max: 20, step: 1 });
  sectionsFolder.addBinding(tree.options.branch.sections, '2', { min: 1, max: 20, step: 1 });
  sectionsFolder.addBinding(tree.options.branch.sections, '3', { min: 1, max: 20, step: 1 });

  const segmentsFolder = branchFolder.addFolder({ title: 'Segments', expanded: false });
  segmentsFolder.addBinding(tree.options.branch.segments, '0', { min: 3, max: 16, step: 1 });
  segmentsFolder.addBinding(tree.options.branch.segments, '1', { min: 3, max: 16, step: 1 });
  segmentsFolder.addBinding(tree.options.branch.segments, '2', { min: 3, max: 16, step: 1 });
  segmentsFolder.addBinding(tree.options.branch.segments, '3', { min: 3, max: 16, step: 1 });

  const branchStartFolder = branchFolder.addFolder({ title: 'Start', expanded: false });
  branchStartFolder.addBinding(tree.options.branch.start, '1', { min: 0, max: 1 });
  branchStartFolder.addBinding(tree.options.branch.start, '2', { min: 0, max: 1 });
  branchStartFolder.addBinding(tree.options.branch.start, '3', { min: 0, max: 1 });

  const taperFolder = branchFolder.addFolder({ title: 'Taper', expanded: false });
  taperFolder.addBinding(tree.options.branch.taper, '0', { min: 0, max: 1 });
  taperFolder.addBinding(tree.options.branch.taper, '1', { min: 0, max: 1 });
  taperFolder.addBinding(tree.options.branch.taper, '2', { min: 0, max: 1 });
  taperFolder.addBinding(tree.options.branch.taper, '3', { min: 0, max: 1 });

  const twistFolder = branchFolder.addFolder({ title: 'Twist', expanded: false });
  twistFolder.addBinding(tree.options.branch.twist, '0', { min: -0.5, max: 0.5 });
  twistFolder.addBinding(tree.options.branch.twist, '1', { min: -0.5, max: 0.5 });
  twistFolder.addBinding(tree.options.branch.twist, '2', { min: -0.5, max: 0.5 });
  twistFolder.addBinding(tree.options.branch.twist, '3', { min: -0.5, max: 0.5 });

  const leavesFolder = treeFolder.addFolder({ title: 'Leaves', expanded: false });
  leavesFolder.addBinding(tree.options.leaves, 'type', { options: LeafType });
  leavesFolder.addBinding(tree.options.leaves, 'tint', { view: 'color' });
  leavesFolder.addBinding(tree.options.leaves, 'billboard', { options: Billboard });
  leavesFolder.addBinding(tree.options.leaves, 'angle', { min: 0, max: 100, step: 1 });
  leavesFolder.addBinding(tree.options.leaves, 'count', { min: 0, max: 100, step: 1 });
  leavesFolder.addBinding(tree.options.leaves, 'start', { min: 0, max: 1 });
  leavesFolder.addBinding(tree.options.leaves, 'size', { min: 0, max: 10 });
  leavesFolder.addBinding(tree.options.leaves, 'sizeVariance', { min: 0, max: 1 });
  leavesFolder.addBinding(tree.options.leaves, 'alphaTest', { min: 0, max: 1 });

  /** CAMERA  */
  const cameraFolder = tab.pages[0].addFolder({ title: 'Camera', expanded: false });
  cameraFolder.addBinding(controls, 'autoRotate');
  cameraFolder.addBinding(controls, 'autoRotateSpeed', { min: 0, max: 2 });

  /** ENVIRONMENT */

  const environmentFolder = tab.pages[0].addFolder({ title: 'Environment', expanded: false });
  environmentFolder.addBinding(environment.skybox, 'sunAzimuth', { label: 'sunAngle', min: 0, max: 360 });
  environmentFolder.addBinding(environment.grass, 'instanceCount', { label: 'grassCount', min: 0, max: 25000, step: 1 });

  /** INFO  */

  const infoFolder = tab.pages[0].addFolder({ title: 'Info', expanded: false });

  infoFolder.addBinding(tree, 'vertexCount', {
    label: 'vertices',
    format: (v) => v.toFixed(0),
    readonly: true,
  });

  infoFolder.addBinding(tree, 'triangleCount', {
    label: 'triangles',
    format: (v) => v.toFixed(0),
    readonly: true,
  });

  infoFolder.addBlade({
    view: 'text',
    label: 'version',
    parse: (v) => String(v),
    value: version,
  });

  /** Export **/

  tab.pages[1].addButton({ title: 'Save Preset' }).on('click', () => {
    const link = document.getElementById('downloadLink');
    const json = JSON.stringify(tree.options, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    link.href = URL.createObjectURL(blob);
    link.download = 'tree.json';
    link.click();
  });

  tab.pages[1].addButton({ title: 'Load Preset' }).on('click', () => {
    document.getElementById('fileInput').click();
  });

  tab.pages[1].addButton({ title: 'Export GLB' }).on('click', () => {
    exporter.parse(
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
    );
  });

  tab.pages[1].addButton({ title: 'Export PNG' }).on('click', () => {
    renderer.setClearColor(0, 0); // Set background to transparent

    // Disable fog
    const fog = scene.fog;
    scene.fog = null;

    // Hide all objects in the scene except for the tree
    scene.traverse((o) => {
      if (o.name === 'Skybox') {
        // Temporarily flip the skybox so it doesn't render
        o.material.side = THREE.FrontSide;
      } else if (o.isMesh) {
        o.visible = false
      }
    });
    tree.traverse((o) => o.visible = true);

    // Render the scene to texture
    renderer.render(scene, camera);

    const link = document.getElementById('downloadLink');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = 'tree.png';
    link.click();

    // Restore defaults
    renderer.setClearColor(0);
    scene.fog = fog;
    scene.traverse((o) => {
      if (o.name === 'Skybox') {
        o.material.side = THREE.BackSide;
      }
      o.visible = true;
    });
  });

  // Read tree parameters from JSON
  document
    .getElementById('fileInput')
    .addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            tree.options = JSON.parse(e.target.result);
            tree.generate();
            setupUI(tree, environment, renderer, scene, camera, controls, initialPreset)
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };
        reader.onerror = function (e) {
          console.error('Error reading file:', e);
        };
        reader.readAsText(file);
      }
    });
}
