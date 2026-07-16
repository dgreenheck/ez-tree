import * as THREE from 'three';
import { TreePreset } from '@dgreenheck/ez-tree';

// Bark keys map 1:1 to ambientcg directories under /textures/bark/.
// Add or remove entries to expose more variants in the UI dropdown.
export const BarkType = {
  Bark001: 'Bark001',
  Bark002: 'Bark002',
  Bark003: 'Bark003',
  Bark004: 'Bark004',
  Bark006: 'Bark006',
  Bark007: 'Bark007',
  Bark008: 'Bark008',
  Bark012: 'Bark012',
  Bark013: 'Bark013',
  Bark014: 'Bark014',
  Bark015: 'Bark015',
};

export const LeafType = {
  Ash: 'ash',
  Aspen: 'aspen',
  Oak: 'oak',
  Pine: 'pine',
};

const textureLoader = new THREE.TextureLoader();
const barkCache = new Map();
const leafCache = new Map();

// The onError callbacks below matter: a texture whose file is missing keeps
// an undefined image forever (the dev server masks the 404 by serving
// index.html). That renders harmlessly but breaks GLTF export, so a failed
// load must remove the map from the cache entirely.

function loadColor(url, onError) {
  const t = textureLoader.load(url, undefined, undefined, onError);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function loadLinear(url, onError) {
  return textureLoader.load(url, undefined, undefined, onError);
}

/**
 * Returns a cached set of THREE.Texture maps for the given bark type.
 * @param {string} type - one of BarkType values
 * @returns {{ color: THREE.Texture, normal: THREE.Texture, roughness: THREE.Texture } | null}
 */
export function getBarkMaps(type) {
  if (!BarkType[type]) return null;
  if (barkCache.has(type)) return barkCache.get(type);

  const dir = `${type}_1K-JPG`;
  const base = `/textures/bark/${dir}/${dir}`;
  const maps = {};
  const drop = (key) => () => {
    console.warn(`Missing bark texture: ${base}_… (${key}); skipping this map.`);
    maps[key] = null;
  };
  maps.color = loadColor(`${base}_Color.jpg`, drop('color'));
  maps.normal = loadLinear(`${base}_NormalGL.jpg`, drop('normal'));
  maps.roughness = loadLinear(`${base}_Roughness.jpg`, drop('roughness'));
  barkCache.set(type, maps);
  return maps;
}

/**
 * Returns a cached leaf color texture for the given leaf type.
 * @param {string} type - one of LeafType values
 * @returns {THREE.Texture | null}
 */
export function getLeafMap(type) {
  if (leafCache.has(type)) return leafCache.get(type);
  const texture = loadColor(`/textures/leaves/${type}.png`, () => {
    console.warn(`Missing leaf texture: /textures/leaves/${type}.png; skipping.`);
    leafCache.set(type, null);
  });
  texture.premultiplyAlpha = true;
  leafCache.set(type, texture);
  return texture;
}

/**
 * Assigns bark + leaf textures onto the tree's options based on its current
 * `bark.type` and `leaves.type` identifiers. Call this before `tree.generate()`
 * whenever the type strings change.
 * @param {import('@dgreenheck/ez-tree').Tree} tree
 */
export function applyTreeTextures(tree) {
  const barkMaps = getBarkMaps(tree.options.bark.type);
  if (barkMaps) {
    tree.options.bark.maps.color = barkMaps.color;
    tree.options.bark.maps.normal = barkMaps.normal;
    tree.options.bark.maps.roughness = barkMaps.roughness;
  }
  tree.options.leaves.map = getLeafMap(tree.options.leaves.type);
}

/**
 * Loads a named preset onto the tree, applying the matching texture set in
 * the same step so the first generate sees the textures.
 * @param {import('@dgreenheck/ez-tree').Tree} tree
 * @param {string} name - key into TreePreset registry
 * @param {boolean} generate - set false to skip the generate step when the
 * caller will generate the tree itself (e.g. via generateLODs)
 */
export function loadPresetWithTextures(tree, name, generate = true) {
  const json = structuredClone(TreePreset[name]);
  if (!json) return;
  tree.options.copy(json);
  applyTreeTextures(tree);
  if (generate) {
    tree.generate();
  }
}
