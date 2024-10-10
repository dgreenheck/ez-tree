import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { simplex2d } from './noise';

let loaded = false;
let _grassMesh = null;
let _grassTexture = null;
let _dirtTexture = null;
let _dirtNormal = null;

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

  _dirtTexture = await textureLoader.loadAsync('dirt_color.png');
  _dirtTexture.wrapS = THREE.RepeatWrapping;
  _dirtTexture.wrapT = THREE.RepeatWrapping;
  _dirtTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtNormal = await textureLoader.loadAsync('dirt_normal.png');
  _dirtNormal.wrapS = THREE.RepeatWrapping;
  _dirtNormal.wrapT = THREE.RepeatWrapping;

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
      // Ground plane with procedural grass/dirt texture
      const groundMaterial = new THREE.MeshPhongMaterial({
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.01,
        normalMap: _dirtNormal,
        shininess: 0.1
      });

      groundMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uNoiseScale = { value: this.options.scale };
        shader.uniforms.uPatchiness = { value: this.options.patchiness };
        shader.uniforms.uGrassTexture = { value: _grassTexture };
        shader.uniforms.uDirtTexture = { value: _dirtTexture };

        shader.vertexShader = `
          varying vec3 vWorldPosition;
          ` + shader.vertexShader;

        shader.fragmentShader = `
          varying vec3 vWorldPosition;
          uniform float uNoiseScale;
          uniform float uPatchiness;
          uniform sampler2D uGrassTexture;
          uniform sampler2D uDirtTexture;
          ` + shader.fragmentShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <worldpos_vertex>',
          `#include <worldpos_vertex>
            vWorldPosition = worldPosition.xyz;
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
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

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
          vec2 uv = vec2(vWorldPosition.x, vWorldPosition.z);
          vec3 grassColor = texture2D(uGrassTexture, uv / 30.0).rgb;
          vec3 dirtColor = texture2D(uDirtTexture, uv / 30.0).rgb;

          // Generate base noise for the texture
          float n = 0.5 + 0.5 * simplex2d(uv / uNoiseScale);
          float s = smoothstep(uPatchiness - 0.2, uPatchiness + 0.2, n);

          // Blend between grass and dirt based on the noise value
          vec4 sampledDiffuseColor = vec4(mix(grassColor, dirtColor, s), 1.0);
          diffuseColor *= sampledDiffuseColor;
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_maps>',
          `
          vec3 mapN = texture2D( normalMap, uv / 30.0 ).xyz * 2.0 - 1.0;
          mapN.xy *= normalScale;

          normal = normalize( tbn * mapN );
          `
        );

        groundMaterial.userData.shader = shader;
      };

      this.ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        groundMaterial
      );
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.receiveShadow = true;
      this.add(this.ground);

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

      this.update();
    });


  }

  get instanceCount() {
    return this.grassMesh?.count ?? this.options.instanceCount;
  }

  set instanceCount(value) {
    this.grassMesh.count = value;
  }

  update() {
    this.generateGrassInstances();

    const shader = this.ground.material.userData.shader;
    if (shader) {
      shader.uniforms.uNoiseScale.value = this.options.scale;
      shader.uniforms.uPatchiness.value = this.options.patchiness;
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