import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
import { Skybox, SkyboxOptions } from './skybox';

const simplex = new SimplexNoise();
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

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
   * Number of samples to take when creating grass
   */
  samples = 25000;

  /**
   * Size of the grass patches
   */
  scale = 50;

  /**
   * Density of the grass
   */
  density = 0.5;
}

export class EnvironmentOptions {
  skybox = new SkyboxOptions();
  grass = new GrassOptions();
}

export class Environment extends THREE.Object3D {
  constructor(options = new EnvironmentOptions()) {
    super();

    this.options = options;

    // Grass texture for ground plane
    const grass = textureLoader.load('grass.jpg');
    grass.repeat = new THREE.Vector2(200, 200);
    grass.wrapS = THREE.MirroredRepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;

    // Ground plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({ map: grass })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.add(plane);

    // Skybox
    this.skybox = new Skybox(this.options.skybox);
    this.add(this.skybox);

    this.createGrass();
  }

  createGrass() {
    if (!this.grassMesh) {
      fetchGrassGeometry().then((geometry) => {
        this.grassMesh = new THREE.InstancedMesh(geometry, grassMaterial, 25000);
        this.grassMesh.castShadow = true;
        this.add(this.grassMesh);

        this.createGrassHelper();
      });
    } else {
      this.createGrassHelper();
    }
  }

  createGrassHelper() {
    const dummy = new THREE.Object3D();

    let count = 0;
    for (let i = 0; i < this.options.grass.samples; i++) {

      // Set position randomly
      const p = new THREE.Vector3(
        2 * (Math.random() - 0.5) * 150,
        0,
        2 * (Math.random() - 0.5) * 150
      );

      const n = 0.5 + 0.5 * simplex.noise3d(
        p.x / this.options.grass.scale,
        p.y / this.options.grass.scale,
        p.z / this.options.grass.scale);

      if (n > this.options.grass.density) { continue; }
      count++;

      dummy.position.copy(p);

      // Set rotation randomly
      dummy.rotation.set(
        0,
        2 * Math.PI * Math.random(),
        0
      );

      // Set scale randomly
      dummy.scale.set(
        3 * Math.random() + 1,
        4 * Math.random() + 1,
        3 * Math.random() + 1
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
    }
    this.grassMesh.count = count;

    console.log(count);

    // Ensure the transformation is updated in the GPU
    this.grassMesh.instanceMatrix.needsUpdate = true;
  }
}