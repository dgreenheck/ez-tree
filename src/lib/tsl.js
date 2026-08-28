import {
  abs,
  faceDirection,
  float,
  floor,
  modelWorldMatrix,
  normalView,
  positionGeometry,
  positionLocal,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
  Vector3,
  step,
  tslFn,
} from 'three/tsl';
import { NodeMaterial } from 'three/tsl';

const mod289Vec2 = tslFn(([value]) =>
  value.sub(floor(value.mul(1 / 289)).mul(289)),
);

const mod289Vec3 = tslFn(([value]) =>
  value.sub(floor(value.mul(1 / 289)).mul(289)),
);

const mod289Vec4 = tslFn(([value]) =>
  value.sub(floor(value.mul(1 / 289)).mul(289)),
);

const permuteVec3 = tslFn(([value]) =>
  mod289Vec3(value.mul(34).add(1).mul(value)),
);

const permuteVec4 = tslFn(([value]) =>
  mod289Vec4(value.mul(34).add(1).mul(value)),
);

/**
 * 2D simplex noise expressed as a TSL function for use in material graphs.
 */
export const simplex2d = tslFn(([value]) => {
  const C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439,
  );

  const i = floor(value.add(value.x.add(value.y).mul(C.y)));
  const x0 = value.sub(i).add(i.x.add(i.y).mul(C.x));
  const i1x = step(x0.y, x0.x);
  const i1 = vec2(i1x, i1x.oneMinus());

  const x12 = vec4(
    x0.x.add(C.x).sub(i1.x),
    x0.y.add(C.x).sub(i1.y),
    x0.x.add(C.z),
    x0.y.add(C.z),
  );

  const iMod = mod289Vec2(i);

  const p = permuteVec3(
    permuteVec3(iMod.y.add(vec3(0, i1.y, 1)))
      .add(iMod.x)
      .add(vec3(0, i1.x, 1)),
  );

  // Keep the three corner distances in separate nodes. This avoids relying
  // on vector construction overloads that differ between TSL releases.
  const x0Length = x0.dot(x0);
  const x12xy = x12.xy;
  const x12zw = x12.zw;
  const m = vec3(
    float(0.5).sub(x0Length).max(0),
    float(0.5).sub(x12xy.dot(x12xy)).max(0),
    float(0.5).sub(x12zw.dot(x12zw)).max(0),
  ).toVar();
  m.mulAssign(m);
  m.mulAssign(m);

  const x = p.mul(C.www).fract().mul(2).sub(1);
  const h = abs(x).sub(0.5);
  const a0 = x.sub(floor(x.add(0.5)));

  m.mulAssign(
    vec3(
      float(1.79284291400159).sub(
        a0.x.mul(a0.x).add(h.x.mul(h.x)).mul(0.85373472095314),
      ),
      float(1.79284291400159).sub(
        a0.y.mul(a0.y).add(h.y.mul(h.y)).mul(0.85373472095314),
      ),
      float(1.79284291400159).sub(
        a0.z.mul(a0.z).add(h.z.mul(h.z)).mul(0.85373472095314),
      ),
    ),
  );

  const g = vec3(
    a0.x.mul(x0.x).add(h.x.mul(x0.y)),
    a0.y.mul(x12.x).add(h.y.mul(x12.y)),
    a0.z.mul(x12.z).add(h.z.mul(x12.w)),
  );

  return m.dot(g).mul(130);
});

simplex2d.setLayout({
  name: 'ezSimplex2D',
  type: 'float',
  inputs: [{ name: 'value', type: 'vec2' }],
});

/**
 * 3D simplex noise expressed as a TSL function for use in material graphs.
 */
export const simplex3d = tslFn(([value]) => {
  const C = vec2(1 / 6, 1 / 3);
  const D = vec4(0, 0.5, 1, 2);

  const i = floor(value.add(value.x.add(value.y).add(value.z).mul(C.y)));
  const x0 = value.sub(i).add(i.x.add(i.y).add(i.z).mul(C.x));

  const g = step(x0.yzx, x0.xyz);
  const l = g.oneMinus();
  const i1 = g.min(l.zxy);
  const i2 = g.max(l.zxy);

  const x1 = x0.sub(i1).add(C.x);
  const x2 = x0.sub(i2).add(C.y);
  const x3 = x0.sub(D.y);

  const iMod = mod289Vec3(i);
  const p = permuteVec4(
    permuteVec4(
      permuteVec4(iMod.z.add(vec4(0, i1.z, i2.z, 1)))
        .add(iMod.y)
        .add(vec4(0, i1.y, i2.y, 1)),
    )
      .add(iMod.x)
      .add(vec4(0, i1.x, i2.x, 1)),
  );

  const n = 1 / 7;
  const ns = vec3(n).mul(D.wyz).sub(D.xzx);
  const j = p.sub(floor(p.mul(ns.z.mul(ns.z))).mul(49));
  const x_ = floor(j.mul(ns.z));
  const y_ = floor(j.sub(x_.mul(7)));

  const x = x_.mul(ns.x).add(ns.yyyy);
  const y = y_.mul(ns.x).add(ns.yyyy);
  const h = vec4(1).sub(abs(x)).sub(abs(y));

  const b0 = vec4(x.xy, y.xy);
  const b1 = vec4(x.zw, y.zw);
  const s0 = floor(b0).mul(2).add(1);
  const s1 = floor(b1).mul(2).add(1);
  const sh = step(h, vec4(0)).negate();

  const a0 = b0.xzyw.add(s0.xzyw.mul(sh.xxyy));
  const a1 = b1.xzyw.add(s1.xzyw.mul(sh.zzww));

  const g0 = vec3(a0.xy, h.x);
  const g1 = vec3(a0.zw, h.y);
  const g2 = vec3(a1.xy, h.z);
  const g3 = vec3(a1.zw, h.w);

  const norm = vec4(1.79284291400159).sub(
    vec4(g0.dot(g0), g1.dot(g1), g2.dot(g2), g3.dot(g3)).mul(0.85373472095314),
  );

  const m = vec4(
    float(0.6).sub(x0.dot(x0)).max(0),
    float(0.6).sub(x1.dot(x1)).max(0),
    float(0.6).sub(x2.dot(x2)).max(0),
    float(0.6).sub(x3.dot(x3)).max(0),
  ).toVar();
  m.mulAssign(m);

  return m
    .mul(m)
    .dot(
      vec4(
        g0.mul(norm.x).dot(x0),
        g1.mul(norm.y).dot(x1),
        g2.mul(norm.z).dot(x2),
        g3.mul(norm.w).dot(x3),
      ),
    )
    .mul(42);
});

simplex3d.setLayout({
  name: 'ezSimplex3D',
  type: 'float',
  inputs: [{ name: 'value', type: 'vec3' }],
});

/**
 * Creates the position node and live uniform handles for a wind-deformed
 * material. Grass and flowers use a product wave, while leaves use three
 * layered sine waves.
 *
 * @param {Object} options
 * @param {{x:number,y:number,z:number}} options.strength
 * @param {number} options.frequency
 * @param {number} options.scale
 * @param {'grass'|'leaves'} options.mode
 * @param {number} [options.heightScale=1]
 * @returns {{positionNode: import('three/tsl').Node, uniforms: Object}}
 */
export function createWindNode({
  strength,
  frequency,
  scale,
  mode,
  heightScale = 1,
}) {
  const uTime = uniform(0).label('uTime');
  const uWindStrength = uniform(
    new Vector3(strength.x, strength.y, strength.z),
  ).label('uWindStrength');
  const uWindFrequency = uniform(frequency).label('uWindFrequency');
  const uWindScale = uniform(scale).label('uWindScale');

  // positionLocal includes the instance transform for InstancedMesh objects.
  // positionGeometry remains the unscaled vertex attribute for height-based
  // displacement.
  const worldPosition = modelWorldMatrix.mul(vec4(positionLocal, 1)).xyz;
  const windPosition = mode === 'leaves' ? positionLocal : worldPosition;
  const windOffset = (
    mode === 'leaves'
      ? simplex3d(windPosition.div(uWindScale))
      : simplex2d(windPosition.xz.div(uWindScale))
  ).mul(2 * Math.PI);

  const phase = uTime.mul(uWindFrequency);
  let wave;

  if (mode === 'leaves') {
    wave = phase
      .add(windOffset)
      .sin()
      .mul(0.5)
      .add(phase.mul(2).add(windOffset.mul(1.3)).sin().mul(0.3))
      .add(phase.mul(5).add(windOffset.mul(1.5)).sin().mul(0.2));
    wave = wave.mul(uv().y);
  } else {
    wave = phase
      .add(windOffset)
      .sin()
      .mul(phase.mul(1.4).add(windOffset).cos())
      .mul(positionGeometry.y)
      .mul(heightScale);
  }

  const positionNode = positionLocal.add(uWindStrength.mul(wave));

  return {
    positionNode,
    uniforms: {
      uTime,
      uWindStrength,
      uWindFrequency,
      uWindScale,
    },
  };
}

/**
 * Converts a classic Three.js material to its node-material counterpart.
 * This is needed for assets loaded through GLTFLoader before they are handed
 * to WebGPURenderer.
 */
export function toNodeMaterial(material) {
  return material?.isNodeMaterial
    ? material
    : NodeMaterial.fromMaterial(material);
}

/**
 * Keeps live TSL uniform nodes out of material userData serialization while
 * leaving them available to animation/update loops.
 */
export function attachTslUniforms(material, uniforms) {
  Object.defineProperty(material.userData, 'tslUniforms', {
    value: uniforms,
    configurable: true,
    enumerable: false,
  });
  return uniforms;
}

/**
 * Returns the view-space normal with the back-face correction expected by a
 * standard node material. Rounded leaf normals intentionally cancel the
 * normal flip for double-sided foliage.
 */
export function leafNormalNode(roundedNormals) {
  return roundedNormals ? normalView.mul(faceDirection) : normalView;
}
