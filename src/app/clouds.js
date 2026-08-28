import * as THREE from 'three/webgpu';
import {
  MeshBasicNodeMaterial,
  length,
  positionWorld,
  smoothstep,
  uniform,
  uv,
  vec4,
} from 'three/tsl';
import { attachTslUniforms, simplex2d } from '../lib/tsl';

export class Clouds extends THREE.Mesh {
  constructor() {
    super();

    this.material = new MeshBasicNodeMaterial({
      transparent: true, // Allow alpha blending if needed
      opacity: 0.9,
      fog: true,
    });

    const uTime = uniform(0).label('uTime');
    const cloudNoise = simplex2d(uv().mul(5).add(uTime.div(40)))
      .add(simplex2d(uv().mul(10).add(uTime.div(30))));
    const cloud = smoothstep(0.2, 0.8, cloudNoise.mul(0.5).add(0.4));
    const distanceFade = length(positionWorld).mul(0.01);

    this.material.colorNode = vec4(
      1,
      1,
      1,
      cloud.div(distanceFade).clamp(0, 1),
    );
    attachTslUniforms(this.material, { uTime });

    // Create a quad to apply the cloud node graph to
    this.geometry = new THREE.PlaneGeometry(2000, 2000);
  }

  update(elapsedTime) {
    const uniforms = this.material.userData.tslUniforms;
    if (uniforms?.uTime) {
      uniforms.uTime.value = elapsedTime;
    }
  }
}
