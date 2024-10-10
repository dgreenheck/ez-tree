import * as THREE from 'three';

export class Clouds extends THREE.Mesh {
  constructor() {
    super();

    this.material = new THREE.MeshBasicMaterial({
      transparent: true, // Allow alpha blending if needed
      opacity: 0.9,
      fog: true,
    });

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0.0 };

      shader.vertexShader = `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        ` + shader.vertexShader;

      shader.fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        ` + shader.fragmentShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
         vUv = uv;
         vWorldPosition = worldPosition.xyz;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `void main() {`,
        `// 2D Simplex noise function
        vec3 permute(vec3 x) {
          return mod(((x*34.0)+1.0)*x, 289.0);
        }

        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {`,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        float n = snoise(vUv * 5.0 + uTime / 40.0) + snoise(vUv * 10.0 + uTime / 30.0); 
        float cloud = smoothstep(0.2, 0.8, 0.5 * n + 0.4);
        vec4 cloudColor = vec4(1.0, 1.0, 1.0, 1.0); 
        diffuseColor = vec4(1.0, 1.0, 1.0, cloud * opacity / (0.01 * length(vWorldPosition)));
        `
      );

      this.material.userData.shader = shader;
    };

    // Create a quad to apply the cloud shader to
    this.geometry = new THREE.PlaneGeometry(2000, 2000);
  }

  update(elapsedTime) {
    const shader = this.material.userData.shader;
    if (shader) {
      shader.uniforms.uTime.value = elapsedTime;
    }
  }
}