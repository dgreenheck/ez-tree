import * as THREE from 'three';

function mod3(v) {
  return new THREE.Vector3(
    v.x - Math.floor(v.x / 289.0) * 289.0,
    v.y - Math.floor(v.y / 289.0) * 289.0,
    v.z - Math.floor(v.z / 289.0) * 289.0
  );
}

function permute3(v) {
  return mod3(new THREE.Vector3(
    ((v.x * 34.0) + 1.0) * v.x,
    ((v.y * 34.0) + 1.0) * v.y,
    ((v.z * 34.0) + 1.0) * v.z
  ));
}

/**
 * 
 * @param {THREE.Vector2} v 
 * @returns 
 */
export function simplex2d(v) {
  // Good
  const C = new THREE.Vector4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  // Good
  let i = new THREE.Vector2(
    Math.floor(v.x + C.y * (v.x + v.y)),
    Math.floor(v.y + C.y * (v.x + v.y))
  );

  // Good
  let x0 = new THREE.Vector2(
    v.x - i.x + C.x * (i.x + i.y),
    v.y - i.y + C.x * (i.x + i.y),
  );

  // Good
  let i1 = new THREE.Vector2(
    (x0.x > x0.y) ? 1.0 : 0.0,
    (x0.x > x0.y) ? 0.0 : 1.0
  );

  let x12 = new THREE.Vector4(
    x0.x + C.x - i1.x,
    x0.y + C.x - i1.y,
    x0.x + C.z,
    x0.y + C.z
  );

  i = new THREE.Vector2(
    i.x - Math.floor(i.x * (1.0 / 289.0)) * 289.0,
    i.y - Math.floor(i.y * (1.0 / 289.0)) * 289.0
  );

  let p = new THREE.Vector3(
    i.y,
    i.y + i1.y,
    i.y + 1.0
  );
  p = permute3(p);
  p = permute3(new THREE.Vector3(
    p.x + i.x,
    p.y + i.x + i1.x,
    p.z + i.x + 1.0
  ));

  let m = new THREE.Vector3(
    Math.max(0.0, 0.5 - x0.dot(x0)),
    Math.max(0.0, 0.5 - (x12.x * x12.x + x12.y * x12.y)),
    Math.max(0.0, 0.5 - (x12.z * x12.z + x12.w * x12.w))
  );
  m = new THREE.Vector3(
    m.x * m.x,
    m.y * m.y,
    m.z * m.z
  );
  m = new THREE.Vector3(
    m.x * m.x,
    m.y * m.y,
    m.z * m.z
  );


  let x = new THREE.Vector3(
    2.0 * ((p.x * C.w) - Math.floor(p.x * C.w)) - 1.0,
    2.0 * ((p.y * C.w) - Math.floor(p.y * C.w)) - 1.0,
    2.0 * ((p.z * C.w) - Math.floor(p.z * C.w)) - 1.0
  );

  let h = new THREE.Vector3(
    Math.abs(x.x) - 0.5,
    Math.abs(x.y) - 0.5,
    Math.abs(x.z) - 0.5
  )

  let ox = new THREE.Vector3(
    Math.floor(x.x + 0.5),
    Math.floor(x.y + 0.5),
    Math.floor(x.z + 0.5)
  );

  let a0 = new THREE.Vector3(
    x.x - ox.x,
    x.y - ox.y,
    x.z - ox.z
  );

  m = new THREE.Vector3(
    m.x * (1.79284291400159 - 0.85373472095314 * (a0.x * a0.x + h.x * h.x)),
    m.y * (1.79284291400159 - 0.85373472095314 * (a0.y * a0.y + h.y * h.y)),
    m.z * (1.79284291400159 - 0.85373472095314 * (a0.z * a0.z + h.z * h.z)),
  );

  let g = new THREE.Vector3(
    a0.x * x0.x + h.x * x0.y,
    a0.y * x12.x + h.y * x12.y,
    a0.z * x12.z + h.z * x12.w
  );

  const n = 130.0 * m.dot(g);

  return n;
}
