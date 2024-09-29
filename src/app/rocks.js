import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let loaded = false;
let _rock1Mesh = null;
let _rock2Mesh = null;
let _rock3Mesh = null;

/**
 * 
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return;

  const gltfLoader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  gltfLoader.setDRACOLoader(dracoLoader);

  _rock1Mesh = (await gltfLoader.loadAsync('rock1.glb')).scene.children[0];
  _rock2Mesh = (await gltfLoader.loadAsync('rock2.glb')).scene.children[0];
  _rock3Mesh = (await gltfLoader.loadAsync('rock3.glb')).scene.children[0];

  loaded = true;
}

export class RockOptions {
  /**
   * Scale factor for the grass model
   */
  size = { x: 6, y: 4, z: 6 };

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 1, y: 1, z: 1 };
}

export class Rocks extends THREE.Group {
  constructor(options = new RockOptions()) {
    super();

    /**
     * @type {RockOptions}
     */
    this.options = options;

    fetchAssets().then(() => {

      this.add(this.generateInstances(_rock1Mesh));
      this.add(this.rock1Mesh);
    });
  }

  generateInstances(mesh) {
    const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, 100);

    const dummy = new THREE.Object3D();

    let count = 0;
    for (let i = 0; i < 100; i++) {
      // Set position randomly
      const p = new THREE.Vector3(
        2 * (Math.random() - 0.5) * 250,
        0,
        2 * (Math.random() - 0.5) * 250
      );

      dummy.position.copy(p);

      // Set rotation randomly
      dummy.rotation.set(
        0,
        2 * Math.PI * Math.random(),
        0
      );

      // Set scale randomly
      dummy.scale.set(
        this.options.sizeVariation.x * (2 * Math.random() - 1) + this.options.size.x,
        this.options.sizeVariation.y * (2 * Math.random() - 1) + this.options.size.y,
        this.options.sizeVariation.z * (2 * Math.random() - 1) + this.options.size.z
      );

      // Apply the transformation to the instance
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(count, dummy.matrix);
      count++;
    }
    instancedMesh.count = count;

    // Ensure the transformation is updated in the GPU
    instancedMesh.instanceMatrix.needsUpdate = true;

    return instancedMesh;
  }
}