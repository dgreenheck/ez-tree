import * as THREE from 'three';
import { GrassOptions } from './grass';

let loaded = false;
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

  _grassTexture = await textureLoader.loadAsync('grass.jpg');
  _grassTexture.wrapS = THREE.RepeatWrapping;
  _grassTexture.wrapT = THREE.RepeatWrapping;
  _grassTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtTexture = await textureLoader.loadAsync('dirt_color.jpg');
  _dirtTexture.wrapS = THREE.RepeatWrapping;
  _dirtTexture.wrapT = THREE.RepeatWrapping;
  _dirtTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtNormal = await textureLoader.loadAsync('dirt_normal.jpg');
  _dirtNormal.wrapS = THREE.RepeatWrapping;
  _dirtNormal.wrapT = THREE.RepeatWrapping;

  loaded = true;
}

export class Ground extends THREE.Mesh {
  constructor(options = new GrassOptions()) {
    super();

    /**
     * @type {GrassOptions}
     */
    this.options = options;

    fetchAssets().then(() => {
      // Ground plane with procedural grass/dirt texture
      this.material = new THREE.MeshPhongMaterial({
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.01,
        normalMap: _dirtNormal,
        shininess: 0.1
      });

      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uNoiseScale = { value: this.options.scale };
        shader.uniforms.uPatchiness = { value: this.options.patchiness };
        shader.uniforms.uGrassTexture = { value: _grassTexture };
        shader.uniforms.uDirtTexture = { value: _dirtTexture };

        // Add varyings and uniforms to vertex/fragment shaders
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

        // Add custom shader code for the ground
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
          float s = smoothstep(uPatchiness - 0.1 , uPatchiness + 0.1, n);

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

        this.material.userData.shader = shader;
      };

      this.geometry = new THREE.PlaneGeometry(2000, 2000);
      this.rotation.x = -Math.PI / 2;
      this.receiveShadow = true;
    });
  }
}