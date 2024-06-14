import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Tree } from './tree';
import { setupUI } from './ui';

let clock = new THREE.Clock();


const stats = new Stats()
document.body.appendChild(stats.dom)

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// ---- CAMERA/LIGHTING -------

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight();
sunlight.intensity = 1;
sunlight.position.set(50, 50, 50);
sunlight.castShadow = true;
scene.add(sunlight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.intensity = 50000;
spotLight.position.set(40, 80, 40);
spotLight.distance = 150;
spotLight.castShadow = true;
spotLight.shadow.camera.left = -30;
spotLight.shadow.camera.right = 30;
spotLight.shadow.camera.top = 30;
spotLight.shadow.camera.bottom = -30;
spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
scene.add(spotLight);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 20, 0);
camera.position.set(70, 20, 0);

// ---- POST-PROCESSING -------

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.2, 0, 0.2);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const pixelRatio = renderer.getPixelRatio();
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.x = 1 / (renderer.domElement.offsetWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (renderer.domElement.offsetHeight * pixelRatio);
composer.addPass(fxaaPass);

// ----- TREE -----------

let treeParams = {
  seed: 33311,
  maturity: 1,
  animateGrowth: false,

  trunk: {
    color: 0xd59d63,       // Color of the tree trunk
    flatShading: false,    // Use face normals for shading instead of vertex normals
    textured: true,        // Apply texture to bark
    length: 20,            // Length of the trunk
    radius: 2.11,          // Starting radius of the trunk
    flare: 1.0             // Multipler for base of trunk
  },

  branch: {
    levels: 4,               // Number of branch recursions ( Keep under 5 )
    start: .6,               // Defines where child branches start forming on the parent branch. A value of 0.6 means the
    // child branches can start forming 60% of the way up the parent branch
    stop: .95,               // Defines where child branches stop forming on the parent branch. A value of 0.9 means the
    // child branches stop forming 90% of the way up the parent branch
    sweepAngle: 1.48,           // Max sweep of the branches (radians)
    minChildren: 3,          // Minimum number of child branches
    maxChildren: 9,          // Maximum number of child branches
    lengthVariance: 0.05,     // % variance in branch length
    lengthMultiplier: .7,    // Length of child branch relative to parent
    radiusMultiplier: .5,    // Radius of child branch relative to parent
    taper: .7,               // Radius of end of branch relative to the start of the branch
    gnarliness: 0.3,         // Max amplitude of random angle added to each section's orientation
    gnarliness1_R: 0.04,  // Same as above, but inversely proportional to the branch radius
    // The two terms can be used to balance gnarliness of trunk vs. branches
    twist: -0.1,
  },

  geometry: {
    sections: 10,             // Number of sections that make up this branch 
    segments: 12,           // Number of faces around the circumference of the branch
    lengthVariance: 0.1,   // % variance in the nominal section length
    radiusVariance: 0.1,   // % variance in the nominal section radius
    randomization: 0.1,    // Randomization factor applied to vertices
  },

  leaves: {
    style: 1,
    type: 0,
    minCount: 5,
    maxCount: 25,
    size: 1.375,
    sizeVariance: 0.7,
    color: 0x6b7f48,
    emissive: 0.02,
    opacity: 1,
    alphaTest: 0.5
  },

  sun: {
    direction: new THREE.Vector3(0, 1, 0),
    strength: 0.02
  }
}

const tree = new Tree(treeParams);
tree.castShadow = true;
tree.receiveShadow = true;
scene.add(tree);

document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        console.log(e.target.result);
        tree.params = JSON.parse(e.target.result);
        tree.generate();
        setupUI(tree, renderer, scene, camera, bloomPass);
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

// --- RENDER LOOP ------

let resetTimeout = null;
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();

  if (treeParams.animateGrowth) {
    const dt = clock.getDelta();
    tree.params.maturity = Math.min(1, tree.params.maturity + 0.2 * dt);

    if (tree.params.maturity >= 1 && !resetTimeout) {
      resetTimeout = setTimeout(() => {
        tree.params.seed = Math.random() * 60000;
        tree.params.maturity = 0.1;
        resetTimeout = null;
      }, 3000);
    }

    tree.generate();
  }

  composer.render();
}

// Events
window.addEventListener('resize', () => {
  // Resize camera aspect ratio and renderer size to the new window size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupUI(tree, renderer, scene, camera, bloomPass);
animate();