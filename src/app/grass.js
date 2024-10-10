import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { simplex2d } from './noise';

let loaded = false;
let _grassMesh = null;
let _grassTexture = null;

/**
 * 
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return;

  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync('grass.glb');
  _grassMesh = gltf.scene.children[0];
  _grassMesh.material.map.colorSpace = THREE.SRGBColorSpace;
  _grassMesh.material.map.premultiplyAlpha = true;
  _grassMesh.material.transparent = false;
  _grassMesh.material.alphaTest = 0.5;
  _grassMesh.material.depthTest = true;
  _grassMesh.material.depthWrite = true;

  loaded = true;
}

export class GrassOptions {
  /**
   * Number of grass instances
   */
  instanceCount = 5000;

  /**
   * Maximum number of grass instances
   */
  maxInstanceCount = 25000;

  /**
   * Size of the grass patches
   */
  scale = 100;

  /**
   * Patchiness of the grass
   */
  patchiness = 0.7;

  /**
   * Scale factor for the grass model
   */
  size = { x: 6, y: 4, z: 6 };

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 1, y: 1, z: 1 };
}

export class Grass extends THREE.Object3D {
  constructor(options = new GrassOptions()) {
    super();

    /**
     * @type {GrassOptions}
     */
    this.options = options;

    fetchAssets().then(() => {
      this.grassMesh = new THREE.InstancedMesh(
        _grassMesh.geometry,
        _grassMesh.material,
        this.options.maxInstanceCount);

      // Decrease grass brightness
      _grassMesh.material.color.multiplyScalar(0.6);

      // Add some emission so grass has some color when not lit
      _grassMesh.material.emissive = new THREE.Color(0x308040);
      _grassMesh.material.emissiveIntensity = 0.05;

      this.add(this.grassMesh);

      this.generateGrassInstances();
    });
  }

  get instanceCount() {
    return this.grassMesh?.count ?? this.options.instanceCount;
  }

  set instanceCount(value) {
    this.grassMesh.count = value;
  }

  generateGrassInstances() {
    const dummy = new THREE.Object3D();

    let count = 0;
    for (let i = 0; i < this.options.maxInstanceCount; i++) {
      const r = 10 + Math.random() * 500;
      const theta = Math.random() * 2.0 * Math.PI;

      // Set position randomly
      const p = new THREE.Vector3(
        r * Math.cos(theta),
        0,
        r * Math.sin(theta)
      );

      const n = 0.5 + 0.5 * simplex2d(new THREE.Vector2(
        p.x / this.options.scale,
        p.z / this.options.scale
      ));

      if (n > this.options.patchiness && Math.random() + 0.6 > this.options.patchiness) { continue; }

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

      const color = new THREE.Color(
        0.25 + Math.random() * 0.1,
        0.3 + Math.random() * 0.3,
        0.1);

      this.grassMesh.setMatrixAt(count, dummy.matrix);
      this.grassMesh.setColorAt(count, color);
      count++;
    }

    // Set count to only show up to `instanceCount` instances
    this.grassMesh.count = this.options.instanceCount;

    this.grassMesh.receiveShadow = true;
    this.grassMesh.castShadow = true;

    // Ensure the transformation is updated in the GPU
    this.grassMesh.instanceMatrix.needsUpdate = true;
    this.grassMesh.instanceColor.needsUpdate = true;
  }
}