import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Tree } from '@dgreenheck/tree-js';
import { setupUI } from './ui';

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight();
sunlight.intensity = 1;
sunlight.position.set(50, 50, 50);
sunlight.castShadow = true;
scene.add(sunlight);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.target.set(0, 15, 0);
controls.update();

camera.position.set(40, 15, 0);

const tree = new Tree();
tree.generate();
tree.castShadow = true;
tree.receiveShadow = true;
scene.add(tree);

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
          tree.params = JSON.parse(e.target.result);
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

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

setupUI(tree, renderer, scene, camera);
animate();
