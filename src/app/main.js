import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Tree, TreePreset } from '@dgreenheck/tree-js';
import { setupUI } from './ui';
import { Environment } from './environment';

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.5;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const environment = new Environment(renderer);
scene.add(environment);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1200,
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minPolarAngle = 1.3;
controls.maxPolarAngle = 1.6;
controls.minDistance = 50;
controls.maxDistance = 150;
controls.target.set(0, 15, 0);
controls.update();

camera.position.set(80, 5, 0);

const tree = new Tree();
tree.loadPreset('Ash Large');
tree.generate();
tree.castShadow = true;
tree.receiveShadow = true;
scene.add(tree);

for (let i = 0; i < 100; i++) {
  const r = 150 + Math.random() * 100;
  const theta = 2 * Math.PI * Math.random();
  const presets = Object.keys(TreePreset);
  const index = Math.floor(Math.random() * presets.length);

  const t = new Tree();
  t.position.set(r * Math.cos(theta), 0, r * Math.sin(theta));
  t.loadPreset(presets[index]);
  t.options.seed = 10000 * Math.random();
  t.generate();
  t.castShadow = true;
  t.receiveShadow = true;
  scene.add(t);
}

// Display vertex and triangle count on UI
const vertexCount = (tree.branches.verts.length + tree.leaves.verts.length) / 3;
const triangleCount =
  (tree.branches.indices.length + tree.leaves.indices.length) / 3;
document.getElementById('model-info').innerText =
  `Vertex Count: ${vertexCount} | Triangle Count: ${triangleCount}`;

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
          setupUI(tree, renderer, scene, camera);
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

// Resize camera aspect ratio and renderer size to the new window size
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Post-processing setup
const composer = new EffectComposer(renderer);

// Render pass: Renders the scene normally as the first pass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// SMAA pass: Anti-aliasing
const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
composer.addPass(smaaPass);

// God rays pass: (Optional, requires additional setup for light shafts if needed)
// Add your custom god rays pass here if you have implemented it

const outputPass = new OutputPass();
composer.addPass(outputPass);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();
  composer.render();
}

setupUI(tree, environment, renderer, scene, camera, TreePreset.AshMedium);
animate();
