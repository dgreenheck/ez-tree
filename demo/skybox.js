import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import fragmentShader from './shaders/skybox.frag?raw';
import vertexShader from './shaders/skybox.vert?raw';

const frag = `
precision mediump float;

varying vec3 vPosition;

uniform float uSunAzimuth; // Sun azimuth angle (in degrees)
uniform float uSunElevation; // Sun elevation angle (in degrees)
uniform vec3 uSunColor;
uniform vec3 uSkyColorLow;
uniform vec3 uSkyColorHigh;
uniform float uSunSize;

void main() {
    // Convert angles from degrees to radians
    float azimuth = radians(uSunAzimuth);
    float elevation = radians(uSunElevation);

    // Calculate the sun direction vector based on azimuth and elevation
    vec3 sunDirection = normalize(vec3(
        cos(elevation) * sin(azimuth),
        sin(elevation),
        cos(elevation) * cos(azimuth)
    ));

    // Normalize the fragment position
    vec3 direction = normalize(vPosition);

    // Gradient for the sky (simple blue gradient)
    float t = direction.y * 0.5 + 0.5;
    vec3 skyColor = mix(uSkyColorLow, uSkyColorHigh, t);

    // Compute sun appearance
    float sunIntensity = pow(max(dot(direction, sunDirection), 0.0), 1000.0 / uSunSize);
    vec3 sunColor = uSunColor * sunIntensity;

    // Combine sun and sky color
    vec3 color = skyColor + sunColor;

    gl_FragColor = vec4(color, 1.0);
}`;

const vert = `varying vec3 vPosition;

void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export class SkyboxOptions {
  constructor() {
    /**
     * Azimuth of the sun in degrees
     */
    this.sunAzimuth = 0;

    /**
     * Elevation of the sun in degrees
     */
    this.sunElevation = 45;

    /**
     * Color of the sun
     */
    this.sunColor = new THREE.Color(1.0, 0.9, 0.4);

    /**
     * Size of the sun in the sky
     */
    this.sunSize = 1;

    /**
     * Color of the sky in the lower part of the sky
     */
    this.skyColorLow = new THREE.Color(0.2, 0.4, 0.7);

    /**
     * Color of the sun in the higher part of the sky
     */
    this.skyColorHigh = new THREE.Color(0.5, 0.7, 1.0);
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

    // Create a box geometry and apply the skybox material
    this.geometry = new THREE.SphereGeometry(1000, 1000, 1000);

    // Create the skybox material with the shaders
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uSunAzimuth: { value: options.sunAzimuth },
        uSunElevation: { value: options.sunElevation },
        uSunColor: { value: options.sunColor },
        uSkyColorLow: { value: options.skyColorLow },
        uSkyColorHigh: { value: options.skyColorHigh },
        uSunSize: { value: options.sunSize }
      }
    });

    console.log(this.material.uniforms);

    this.sun = new THREE.DirectionalLight();
    this.sun.intensity = 2;
    this.sun.position.set(100, 100, 100);
    this.sun.castShadow = true;
    this.sun.color = options.sunColor;

    this.add(this.sun);
  }

  updateSunPosition() {
    const el = degToRad(this.sunElevation);
    const az = degToRad(this.sunAzimuth);

    this.sun.position.set(
      Math.cos(el) * Math.sin(az),
      Math.sin(el),
      Math.cos(el) * Math.cos(az)
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