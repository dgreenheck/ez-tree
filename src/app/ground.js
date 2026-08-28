import * as THREE from 'three/webgpu';
import {
  MeshStandardNodeMaterial,
  mix,
  normalMap,
  positionWorld,
  smoothstep,
  texture,
  uniform,
  vec2,
  vec4,
} from 'three/tsl';
import { GrassOptions } from './grass';
import { attachTslUniforms, simplex2d } from '../lib/tsl';

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

  _grassTexture = await textureLoader.loadAsync('/textures/ground/grass.jpg');
  _grassTexture.wrapS = THREE.RepeatWrapping;
  _grassTexture.wrapT = THREE.RepeatWrapping;
  _grassTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtTexture = await textureLoader.loadAsync('/textures/ground/dirt_color.jpg');
  _dirtTexture.wrapS = THREE.RepeatWrapping;
  _dirtTexture.wrapT = THREE.RepeatWrapping;
  _dirtTexture.colorSpace = THREE.SRGBColorSpace;

  _dirtNormal = await textureLoader.loadAsync('/textures/ground/dirt_normal.jpg');
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
      this.material = new MeshStandardNodeMaterial({
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.01,
        metalness: 0.0,
        roughness: 1.0
      });

      const uNoiseScale = uniform(this.options.scale).label('uNoiseScale');
      const uPatchiness = uniform(this.options.patchiness).label('uPatchiness');
      const worldUv = positionWorld.xz;
      const groundUv = worldUv.div(30);
      const noise = simplex2d(worldUv.div(uNoiseScale)).mul(0.5).add(0.5);
      const dirtAmount = smoothstep(
        uPatchiness.sub(0.1),
        uPatchiness.add(0.1),
        noise,
      );

      const grassColor = texture(_grassTexture, groundUv).rgb;
      const dirtColor = texture(_dirtTexture, groundUv).rgb;

      this.material.colorNode = vec4(
        mix(grassColor, dirtColor, dirtAmount),
        1,
      );
      this.material.normalNode = normalMap(texture(_dirtNormal, groundUv), vec2(1));
      attachTslUniforms(this.material, {
        uNoiseScale,
        uPatchiness,
      });

      this.geometry = new THREE.PlaneGeometry(2000, 2000);
      this.rotation.x = -Math.PI / 2;
      this.receiveShadow = true;
    });
  }
}
