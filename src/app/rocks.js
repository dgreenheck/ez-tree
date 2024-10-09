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
   * Scale factor 
   */
  size = { x: 2, y: 2, z: 2 };

  /**
   * Maximum variation in the rock size
   */
  sizeVariation = { x: 3, y: 3, z: 3 };
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
      this.add(this.generateInstances(_rock2Mesh));
      this.add(this.generateInstances(_rock3Mesh));
    });
  }

  generateInstances(mesh) {
    const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, 200);

    const dummy = new THREE.Object3D();

    let count = 0;
    for (let i = 0; i < 50; i++) {
      // Set position randomly
      const p = new THREE.Vector3(
        2 * (Math.random() - 0.5) * 250,
        0.3,
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
        this.options.sizeVariation.x * Math.random() + this.options.size.x,
        this.options.sizeVariation.y * Math.random() + this.options.size.y,
        this.options.sizeVariation.z * Math.random() + this.options.size.z
      );

      // Apply the transformation to the instance
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(count, dummy.matrix);
      count++;
    }
    instancedMesh.count = count;

    // Ensure the transformation is updated in the GPU
    instancedMesh.instanceMatrix.needsUpdate = true;

    instancedMesh.castShadow = true;

    return instancedMesh;
  }
}