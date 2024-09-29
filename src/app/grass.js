import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { simplex2d } from './noise';
import fragmentShader from './shaders/grass.frag?raw';
import vertexShader from './shaders/grass.vert?raw'

let loaded = false;
let _grassMesh = null;
let _grassTexture = null;
let _dirtTexture = null;

/**
 * 
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return;

  const textureLoader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync('grass.glb');
  _grassMesh = gltf.scene.children[0];
  _grassMesh.material.map.colorSpace = THREE.SRGBColorSpace;
  _grassMesh.material.map.premultiplyAlpha = true;
  _grassMesh.material.transparent = false;
  _grassMesh.material.alphaTest = 0.5;
  _grassMesh.material.depthTest = true;
  _grassMesh.material.depthWrite = true;

  _grassTexture = await textureLoader.loadAsync('grass.png');
  _grassTexture.wrapS = THREE.RepeatWrapping;
  _grassTexture.wrapT = THREE.RepeatWrapping;
  _grassTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtTexture = await textureLoader.loadAsync('dirt.png');
  _dirtTexture.wrapS = THREE.RepeatWrapping;
  _dirtTexture.wrapT = THREE.RepeatWrapping;
  _dirtTexture.colorSpace = THREE.SRGBColorSpace;

  loaded = true;
}

export class GrassOptions {
  /**
   * Number of samples to take when creating grass
   */
  samples = 15000;

  /**
   * Size of the grass patches
   */
  scale = 60;

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

    /**
     * Maximum number of instances of grass
     */
    this.maxInstanceCount = 25000;

    fetchAssets().then(() => {
      // Ground plane with procedural grass/dirt texture
      const groundMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uNoiseScale: { value: this.options.scale },
          uPatchiness: { value: this.options.patchiness },
          uGrassTexture: { value: _grassTexture },
          uDirtTexture: { value: _dirtTexture }
        },
        shadowSide: THREE.DoubleSide
      });

      this.ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        groundMaterial
      );
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.receiveShadow = true;
      this.add(this.ground);

      console.log(_grassMesh.material);

      this.grassMesh = new THREE.InstancedMesh(_grassMesh.geometry, _grassMesh.material, this.maxInstanceCount);
      this.add(this.grassMesh);
      this.update();
    });
  }

  update() {
    this.generateGrassInstances();
    this.ground.material.uniforms.uNoiseScale.value = this.options.scale;
    this.ground.material.uniforms.uPatchiness.value = this.options.patchiness;
  }

  generateGrassInstances() {
    const dummy = new THREE.Object3D();

    let count = 0;
    for (let i = 0; i < this.options.samples; i++) {
      // Set position randomly
      const p = new THREE.Vector3(
        2 * (Math.random() - 0.5) * 250,
        0,
        2 * (Math.random() - 0.5) * 250
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
        0.2 + Math.random() * 0.1,
        0.4 + Math.random() * 0.1,
        0.1);

      this.grassMesh.setMatrixAt(count, dummy.matrix);
      this.grassMesh.setColorAt(count, color);
      count++;
    }
    this.grassMesh.count = count;

    // Ensure the transformation is updated in the GPU
    this.grassMesh.instanceMatrix.needsUpdate = true;
    this.grassMesh.instanceColor.needsUpdate = true;
  }
}