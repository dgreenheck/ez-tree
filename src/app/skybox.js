import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import fragmentShader from './shaders/skybox.frag?raw';
import vertexShader from './shaders/skybox.vert?raw';

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

    // Create the skybox material with the shaders
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSunAzimuth: { value: options.sunAzimuth },
        uSunElevation: { value: options.sunElevation },
        uSunColor: { value: options.sunColor },
        uSkyColorLow: { value: options.skyColorLow },
        uSkyColorHigh: { value: options.skyColorHigh },
        uSunSize: { value: options.sunSize }
      },
      side: THREE.BackSide
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
    return this.material.uniforms.uSunAzimuth.value;
  }

  set sunAzimuth(azimuth) {
    this.material.uniforms.uSunAzimuth.value = azimuth;
    this.updateSunPosition();
  }

  /**
   * @returns {number}
   */
  get sunElevation() {
    return this.material.uniforms.uSunElevation.value;
  }

  set sunElevation(elevation) {
    this.material.uniforms.uSunElevation.value = elevation;
    this.updateSunPosition();
  }

  /**
   * @returns {THREE.Color}
   */
  get sunColor() {
    return this.material.uniforms.uSunColor.value;
  }

  set sunColor(color) {
    this.material.uniforms.uSunColor.value = color;
    this.sun.color = color;
  }

  /**
   * @returns {THREE.Color}
   */
  get skyColorLow() {
    return this.material.uniforms.uSkyColorLow.value;
  }

  set skyColorLow(color) {
    this.material.uniforms.uSkyColorLow.value = color;
  }

  /**
    * @returns {THREE.Color}
    */
  get skyColorHigh() {
    return this.material.uniforms.uSkyColorHigh.value;
  }

  set skyColorHigh(color) {
    this.material.uniforms.uSkyColorHigh.value = color;
  }

  /**
   * @returns {number}
   */
  get sunSize() {
    return this.material.uniforms.uSunSize.value;
  }

  set sunSize(size) {
    this.material.uniforms.uSunSize.value = size;
  }
}