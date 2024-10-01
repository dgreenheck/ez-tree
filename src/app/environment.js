import * as THREE from 'three';
import { Skybox } from './skybox';
import { Grass } from './grass';
import { Rocks } from './rocks';
import { Clouds } from './clouds';

export class Environment extends THREE.Object3D {
  constructor() {
    super();

    this.grass = new Grass();
    this.add(this.grass);

    this.skybox = new Skybox();
    this.add(this.skybox);

    this.rocks = new Rocks();
    this.add(this.rocks);

    this.clouds = new Clouds();
    this.clouds.position.set(0, 100, 0);
    this.clouds.rotation.x = Math.PI / 2;
    this.add(this.clouds);
  }
}