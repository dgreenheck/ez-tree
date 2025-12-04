import { FogExp2, Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Environment } from './environment';
import {Tree} from '../lib/tree'
import { treePreset } from '../lib/presets';

function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function paintUI() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Creates a new instance of the js scene
 * @param {WebGLRenderer} renderer 
 * @returns 
 */
export async function createScene(renderer: WebGLRenderer) {
  const scene = new Scene();
  scene.fog = new FogExp2(0x94b9f8, 0.0015);

  const environment = new Environment();
  scene.add(environment);

  const camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.position.set(100, 20, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.minPolarAngle = Math.PI / 2 - 0.2;
  controls.maxPolarAngle = Math.PI / 2 + 0.13;
  controls.minDistance = 10;
  controls.maxDistance = 150;
  controls.target.set(0, 25, 0);
  controls.update();

  const tree = new Tree();
  tree.loadPreset('Ash Medium');
  tree.generate();
  tree.castShadow = true;
  tree.receiveShadow = true;
  scene.add(tree);

  // Add a forest of trees in the background
  const forest = new Group();
  forest.name = 'Forest';

  const logoElement = document.getElementById('logo')!;
  const progressElement = document.getElementById('loading-text')!;

  logoElement.style.clipPath = `inset(100% 0% 0% 0%)`;
  progressElement.innerHTML = 'LOADING... 0%';

  const treeCount = 100;
  const minDistance = 175;
  const maxDistance = 500;

  function createTree() {
    const r = minDistance + Math.random() * maxDistance;
    const theta = 2 * Math.PI * Math.random();
    const presets = Object.keys(treePreset);
    const index = Math.floor(Math.random() * presets.length);

    const t = new Tree();
    t.position.set(r * Math.cos(theta), 0, r * Math.sin(theta));
    t.loadPreset(presets[index]);
    t.options.seed = 10000 * Math.random();
    t.generate();
    t.castShadow = true;
    t.receiveShadow = true;

    forest.add(t);
  }

  async function loadTrees(i: number) {
    while (i < treeCount) {
      createTree();

      const progress = Math.floor(100 * (i + 1) / treeCount);

      // Update progress UI
      logoElement.style.clipPath = `inset(${100 - progress}% 0% 0% 0%)`;
      progressElement.innerText = `LOADING... ${progress}%`;

      // Wait for the next animation frame to continue
      await paintUI();

      i++;
    }

    // All trees are loaded, hide loading screen
    await sleep(300);
    logoElement.style.clipPath = `inset(0% 0% 0% 0%)`;
    document.getElementById('loading-screen')!.style.display = 'none';
  }

  // Start the tree loading process
  await loadTrees(0);

  scene.add(forest);

  return {
    scene,
    environment,
    tree,
    camera,
    controls
  }
}