import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import {
  Fn,
  texture,
  uv,
  vec4,
} from 'three/tsl';
import { simplex2d } from './noise';
import { attachTslUniforms, createWindNode, toNodeMaterial } from '../lib/tsl';

let loaded = false;
let _grassMesh = null;
let _blueFlower = null;
let _whiteFlower = null;
let _yellowFlower = null;

function createAlphaShadowNode(map, alphaTest) {
  if (!map || alphaTest <= 0) return null;

  return Fn(() => {
    texture(map, uv()).a.lessThanEqual(alphaTest).discard();
    return vec4(0, 0, 0, 1);
  })();
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
   * Number of flowers to generate (per color)
   */
  flowerCount = 50;

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
  size = { x: 5, y: 4, z: 5 };

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 1, y: 2, z: 1 };

  /**
   * Strength of wind along each axis
   */
  windStrength = { x: 0.3, y: 0, z: 0.3 };

  /**
   * Oscillation frequency for wind movement
   */
  windFrequency = 1.0;

  /**
   * Controls how localized wind effects are
   */
  windScale = 400.0;
}

export class Grass extends THREE.Object3D {
  constructor(options = new GrassOptions()) {
    super();

    /**
     * @type {GrassOptions}
     */
    this.options = options;

    this.flowers = new THREE.Group();
    this.add(this.flowers);

    this.ready = this.fetchAssets().then(() => {
      this.generateGrass();
      this.generateFlowers(_whiteFlower);
      this.generateFlowers(_blueFlower);
      this.generateFlowers(_yellowFlower);

      return this;
    });
  }

  get instanceCount() {
    return this.grassMesh?.count ?? this.options.instanceCount;
  }

  set instanceCount(value) {
    this.grassMesh.count = value;
  }

  /**
   * 
   * @returns {Promise<THREE.Geometry>}
   */
  async fetchAssets() {
    if (loaded) return;

    const gltfLoader = new GLTFLoader();

    _grassMesh = (await gltfLoader.loadAsync('/models/grass.glb')).scene.children[0];
    _whiteFlower = (await gltfLoader.loadAsync('/models/flower_white.glb')).scene.children[0];
    _blueFlower = (await gltfLoader.loadAsync('/models/flower_blue.glb')).scene.children[0];
    _yellowFlower = (await gltfLoader.loadAsync('/models/flower_yellow.glb')).scene.children[0];

    // The flower is composed of multiple meshes with different materials. Add
    // the wind node to each material.
    [_whiteFlower, _blueFlower, _yellowFlower].forEach((mesh) => {
      mesh.traverse((o) => {
        if (o.isMesh && o.material) {
          const material = o.material.map
            ? new MeshStandardNodeMaterial({
              map: o.material.map,
              metalness: 0.0,
              roughness: 1.0,
            })
            : toNodeMaterial(o.material);
          o.material = material;
          material.shadowNode = createAlphaShadowNode(material.map, material.alphaTest);
          this.applyWindNode(material);
        }
      });
    });

    loaded = true;
  }

  update(elapsedTime) {
    this.traverse((o) => {
      const uniforms = o.isMesh && o.material?.userData?.tslUniforms;
      if (uniforms?.uTime) {
        uniforms.uTime.value = elapsedTime;
      }
    });
  }

  generateGrass() {
    const grassMaterial = new MeshStandardNodeMaterial({
      map: _grassMesh.material.map,
      // Add some emission so grass has some color when not lit
      emissive: new THREE.Color(0x308040),
      emissiveIntensity: 0.05,
      transparent: false,
      alphaTest: 0.5,
      depthTest: true,
      depthWrite: true,
      metalness: 0.0,
      roughness: 1.0,
      side: THREE.DoubleSide
    });

    // Keep transparent grass texels out of the shadow map. The shadow pass
    // does not inherit the visible material's map or alpha-test settings.
    grassMaterial.shadowNode = createAlphaShadowNode(
      grassMaterial.map,
      grassMaterial.alphaTest,
    );

    this.applyWindNode(grassMaterial, true);

    // Decrease grass brightness
    grassMaterial.color.multiplyScalar(0.6);

    this.grassMesh = new THREE.InstancedMesh(
      _grassMesh.geometry,
      grassMaterial,
      this.options.maxInstanceCount);

    this.generateGrassInstances();

    this.add(this.grassMesh);
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
        this.options.sizeVariation.x * Math.random() + this.options.size.x,
        this.options.sizeVariation.y * Math.random() + this.options.size.y,
        this.options.sizeVariation.z * Math.random() + this.options.size.z
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

  /**
   * 
   * @param {THREE.Mesh} flowerMesh 
   */
  generateFlowers(flowerMesh) {
    for (let i = 0; i < this.options.flowerCount; i++) {
      const r = 10 + Math.random() * 200;
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

      if (n > this.options.patchiness && Math.random() + 0.8 > this.options.patchiness) { continue; }

      const flower = flowerMesh.clone();
      flower.position.copy(p);
      flower.rotation.set(0, 2 * Math.PI * Math.random(), 0);
      const scale = 0.02 + 0.03 * Math.random();
      flower.scale.set(scale, scale, scale);

      this.flowers.add(flower);
    }
  }

  /**
   * 
   * @param {THREE.Material} material 
   */
  applyWindNode(material, instanced = false) {
    const wind = createWindNode({
      strength: this.options.windStrength,
      frequency: this.options.windFrequency,
      scale: this.options.windScale,
      mode: 'grass',
      heightScale: instanced ? 1 : 0.2,
    });

    material.positionNode = wind.positionNode;
    attachTslUniforms(material, wind.uniforms);
  }
}
