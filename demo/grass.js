import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { simplex2d } from './noise';
import fragmentShader from './shaders/grass.frag?raw';
import vertexShader from './shaders/grass.vert?raw'

const gltfLoader = new GLTFLoader();

let _grassGeometry = null;
const grassMaterial = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide
});

/**
 * 
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchGrassGeometry() {
  if (_grassGeometry) return _grassGeometry;

  const gltf = await gltfLoader.loadAsync('grass.glb');
  _grassGeometry = gltf.scene.children[0].geometry;
  _grassGeometry.applyMatrix4(gltf.scene.children[0].matrix);

  return _grassGeometry;
}

export class GrassOptions {
  /**
   * Color of the dirt
   */
  dirtColor = new THREE.Color(0x693712).convertLinearToSRGB();

  /**
   * Color of the grass
   */
  grassColor = new THREE.Color(0x0d1809).convertLinearToSRGB();

  /**
   * Number of samples to take when creating grass
   */
  samples = 20000;

  /**
   * Size of the grass patches
   */
  scale = 50;

  /**
   * Patchiness of the grass
   */
  patchiness = 0.4;

  /**
   * Scale factor for the grass model
   */
  size = { x: 3, y: 3, z: 3 };

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 3, y: 3, z: 3 };
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

    // Ground plane with procedural grass/dirt texture
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uNoiseScale: { value: this.options.scale },
        uPatchiness: { value: this.options.patchiness },
        uGrassColor: { value: this.options.grassColor },
        uDirtColor: { value: this.options.dirtColor }
      }
    });

    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      material
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.add(this.ground);

    fetchGrassGeometry().then((geometry) => {
      this.grassMesh = new THREE.InstancedMesh(geometry, grassMaterial, this.maxInstanceCount);
      this.grassMesh.castShadow = true;
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

      console.log(n);

      if (n > this.options.patchiness) { continue; }

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
        0.3 + 0.1 * Math.random(),
        0.5 + 0.1 * Math.random(),
        0.2
      );

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