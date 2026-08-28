import * as THREE from 'three/webgpu';
import { degToRad } from 'three/src/math/MathUtils.js';
import {
  MeshBasicNodeMaterial,
  mix,
  positionLocal,
  uniform,
  vec3,
  vec4,
} from 'three/tsl';

export class SkyboxOptions {
  constructor() {
    /**
     * Azimuth of the sun in degrees
     */
    this.sunAzimuth = 90;

    /**
     * Elevation of the sun in degrees
     */
    this.sunElevation = 30;

    /**
     * Color of the sun
     */
    this.sunColor = new THREE.Color(0xffe5b0).convertLinearToSRGB();

    /**
     * Size of the sun in the sky
     */
    this.sunSize = 1;

    /**
     * Color of the sky in the lower part of the sky
     */
    this.skyColorLow = new THREE.Color(0x6fa2ef).convertLinearToSRGB();

    /**
     * Color of the sun in the higher part of the sky
     */
    this.skyColorHigh = new THREE.Color(0x2053ff).convertLinearToSRGB();
  }
}

/**
 * Configurable skybox with sun and built-in lighting
 */
export class Skybox extends THREE.Mesh {
  /**
   * 
   * @param {SkyboxOptions} options 
   */
  constructor(options = new SkyboxOptions()) {
    super();

    this.name = 'Skybox';

    // Create a box geometry and apply the skybox material
    this.geometry = new THREE.SphereGeometry(900, 900, 900);

    // Build the sky gradient and sun disc as a TSL color graph. The node
    // material emits this graph as WGSL or GLSL for the active backend.
    this.material = new MeshBasicNodeMaterial({
      side: THREE.BackSide
    });

    this._uniforms = {
      uSunAzimuth: uniform(options.sunAzimuth).label('uSunAzimuth'),
      uSunElevation: uniform(options.sunElevation).label('uSunElevation'),
      uSunColor: uniform(options.sunColor).label('uSunColor'),
      uSkyColorLow: uniform(options.skyColorLow).label('uSkyColorLow'),
      uSkyColorHigh: uniform(options.skyColorHigh).label('uSkyColorHigh'),
      uSunSize: uniform(options.sunSize).label('uSunSize'),
    };

    const azimuth = this._uniforms.uSunAzimuth.radians();
    const elevation = this._uniforms.uSunElevation.radians();
    const sunDirection = vec3(
      elevation.cos().mul(azimuth.sin()),
      elevation.sin(),
      elevation.cos().mul(azimuth.cos()),
    ).normalize();
    const direction = positionLocal.normalize();
    const skyMix = direction.y.mul(0.5).add(0.5);
    const skyColor = mix(
      this._uniforms.uSkyColorLow,
      this._uniforms.uSkyColorHigh,
      skyMix,
    );
    const sunIntensity = direction.dot(sunDirection).max(0)
      .pow(this._uniforms.uSunSize.reciprocal().mul(1000));

    this.material.colorNode = vec4(
      skyColor.add(this._uniforms.uSunColor.mul(sunIntensity)),
      1,
    );
    this.material.fog = false;
    Object.defineProperty(this.material.userData, 'tslUniforms', {
      value: this._uniforms,
      configurable: true,
      enumerable: false,
    });

    this.sun = new THREE.DirectionalLight();
    this.sun.intensity = 5;
    this.sun.color = options.sunColor;
    this.sun.position.set(50, 100, 50);
    this.sun.castShadow = true;
    this.sun.shadow.camera.left = -100;
    this.sun.shadow.camera.right = 100;
    this.sun.shadow.camera.top = 100;
    this.sun.shadow.camera.bottom = -100;
    this.sun.shadow.mapSize = new THREE.Vector2(512, 512);
    this.sun.shadow.bias = -0.001;
    this.sun.shadow.normalBias = 0.2;
    this.add(this.sun);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.add(ambientLight);

    this.updateSunPosition();
  }

  updateSunPosition() {
    const el = degToRad(this.sunElevation);
    const az = degToRad(this.sunAzimuth);

    this.sun.position.set(
      100 * Math.cos(el) * Math.sin(az),
      100 * Math.sin(el),
      100 * Math.cos(el) * Math.cos(az)
    );
  }

  /**
   * @returns {number}
   */
  get sunAzimuth() {
    return this._uniforms.uSunAzimuth.value;
  }

  set sunAzimuth(azimuth) {
    this._uniforms.uSunAzimuth.value = azimuth;
    this.updateSunPosition();
  }

  /**
   * @returns {number}
   */
  get sunElevation() {
    return this._uniforms.uSunElevation.value;
  }

  set sunElevation(elevation) {
    this._uniforms.uSunElevation.value = elevation;
    this.updateSunPosition();
  }

  /**
   * @returns {THREE.Color}
   */
  get sunColor() {
    return this._uniforms.uSunColor.value;
  }

  set sunColor(color) {
    this._uniforms.uSunColor.value = color;
    this.sun.color = color;
  }

  /**
   * @returns {THREE.Color}
   */
  get skyColorLow() {
    return this._uniforms.uSkyColorLow.value;
  }

  set skyColorLow(color) {
    this._uniforms.uSkyColorLow.value = color;
  }

  /**
    * @returns {THREE.Color}
    */
  get skyColorHigh() {
    return this._uniforms.uSkyColorHigh.value;
  }

  set skyColorHigh(color) {
    this._uniforms.uSkyColorHigh.value = color;
  }

  /**
   * @returns {number}
   */
  get sunSize() {
    return this._uniforms.uSunSize.value;
  }

  set sunSize(size) {
    this._uniforms.uSunSize.value = size;
  }
}
