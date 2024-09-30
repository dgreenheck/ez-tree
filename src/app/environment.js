import * as THREE from 'three';
import { Skybox } from './skybox';
import { Grass } from './grass';
import { Rocks } from './rocks';

export class Environment extends THREE.Object3D {
  constructor() {
    super();

    // Grass texture for ground plane
    this.grass = new Grass();
    this.add(this.grass);

    // Skybox
    this.skybox = new Skybox();
    this.add(this.skybox);

    this.rocks = new Rocks();
    this.add(this.rocks);
  }
}