import * as THREE from 'three';

// Mirrors the BarkType list from src/app/textures.js. Kept local so the
// loader can be async and the bake can wait for textures to be ready before
// rendering.
export const BARK_TYPES = [
  'Bark001', 'Bark002', 'Bark003', 'Bark004', 'Bark006', 'Bark007',
  'Bark008', 'Bark012', 'Bark013', 'Bark014', 'Bark015',
];

function loadLinearTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

function loadColorTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      resolve(t);
    }, undefined, reject);
  });
}

// Treat 404s as null instead of a hard error. Some bark sets don't ship every
// sidecar (e.g. Bark001 has no AmbientOcclusion).
function tryLoadLinear(url) {
  return loadLinearTexture(url).catch(() => null);
}

/**
 * Loads the bark texture set for the given type. Resolves once every map is
 * actually ready to be sampled (or null when a sidecar is missing).
 * @param {string} type
 * @returns {Promise<{ color, ao, normal, roughness }>}
 */
export async function loadSourceBark(type) {
  if (!BARK_TYPES.includes(type)) throw new Error(`Unknown bark type: ${type}`);

  const dir = `${type}_1K-JPG`;
  const base = `/textures/bark/${dir}/${dir}`;

  const [color, ao, normal, roughness] = await Promise.all([
    loadColorTexture(`${base}_Color.jpg`),
    tryLoadLinear(`${base}_AmbientOcclusion.jpg`),
    tryLoadLinear(`${base}_NormalGL.jpg`),
    tryLoadLinear(`${base}_Roughness.jpg`),
  ]);

  return { color, ao, normal, roughness };
}
