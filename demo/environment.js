import * as THREE from 'three';
import { Skybox, SkyboxOptions } from './skybox';
import { Grass, GrassOptions } from './grass';

export class EnvironmentOptions {
  skybox = new SkyboxOptions();
  grass = new GrassOptions();
}

export class Environment extends THREE.Object3D {
  constructor(options = new EnvironmentOptions()) {
    super();

    this.options = options;

    // Grass texture for ground plane
    this.grass = new Grass(this.options.grass);
    this.add(this.grass);

    // Skybox
    this.skybox = new Skybox(this.options.skybox);
    this.add(this.skybox);
  }
}