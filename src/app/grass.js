import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { simplex2d } from './noise';

let loaded = false;
let _grassMesh = null;

/**
 * 
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return;

  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync('grass.glb');
  _grassMesh = gltf.scene.children[0];

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
  size = { x: 5, y: 4, z: 5 };

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 1, y: 2, z: 1 };

  /**
   * Strength of wind along each axis
   */
  windStrength = { x: 0.6, y: 0, z: 0.6 };

  /**
   * Oscillation frequency for wind movement
   */
  windFrequency = 1;

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

    fetchAssets().then(() => {
      // Ground plane with procedural grass/dirt texture
      const material = new THREE.MeshPhongMaterial({
        map: _grassMesh.material.map,
        // Add some emission so grass has some color when not lit
        emissive: new THREE.Color(0x308040),
        emissiveIntensity: 0.05,
        transparent: false,
        alphaTest: 0.5,
        depthTest: true,
        depthWrite: true,
        side: THREE.DoubleSide
      });

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uWindStrength = { value: this.options.windStrength };
        shader.uniforms.uWindFrequency = { value: this.options.windFrequency };
        shader.uniforms.uWindScale = { value: this.options.windScale };

        shader.vertexShader = `
        uniform float uTime;
        uniform vec3 uWindStrength;
        uniform float uWindFrequency;
        uniform float uWindScale;
        ` + shader.vertexShader;

        // Add code for simplex noise
        shader.vertexShader = shader.vertexShader.replace(
          `void main() {`,
          `
          vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec2 mod289(vec2 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec3 permute(vec3 x) {
            return mod289(((x * 34.0) + 1.0) * x);
          }

          float simplex2d(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;

            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m * m;
            m = m * m;

            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;

            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }
          
          void main() {`,
        );

        // worldPosition = modelMatrix * instanceMatrix * position;
        // worldWindDirection = model
        shader.vertexShader = shader.vertexShader.replace(
          `#include <project_vertex>`,
          `
          vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);

          float windOffset = 2.0 * 3.14 * simplex2d((modelMatrix * mvPosition).xz / uWindScale);
          vec3 windSway = position.y * uWindStrength * 
            sin(uTime * uWindFrequency + windOffset) *
            sin(uTime * 1.4 * uWindFrequency + windOffset);


          mvPosition.xyz += windSway;

          mvPosition = modelViewMatrix * mvPosition;

          gl_Position = projectionMatrix * mvPosition;
          `
        );

        shader.fragmentShader = `
          varying vec3 vWorldPosition;
          uniform float uNoiseScale;
          uniform float uPatchiness;
          uniform sampler2D uGrassTexture;
          uniform sampler2D uDirtTexture;
          ` + shader.fragmentShader;

        material.userData.shader = shader;
      };

      // Decrease grass brightness
      material.color.multiplyScalar(0.6);

      this.grassMesh = new THREE.InstancedMesh(
        _grassMesh.geometry,
        material,
        this.options.maxInstanceCount);

      this.generateGrassInstances();

      this.add(this.grassMesh);
    });
  }

  get instanceCount() {
    return this.grassMesh?.count ?? this.options.instanceCount;
  }

  set instanceCount(value) {
    this.grassMesh.count = value;
  }

  update(elapsedTime) {
    const shader = this.grassMesh?.material.userData.shader;
    if (shader) {
      shader.uniforms.uTime.value = elapsedTime;
    }
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
}