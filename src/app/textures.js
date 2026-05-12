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

function loadColor(url) {
  const t = textureLoader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function loadLinear(url) {
  return textureLoader.load(url);
}

/**
 * Returns a cached set of THREE.Texture maps for the given bark type.
 * @param {string} type - one of BarkType values
 * @returns {{ color: THREE.Texture, ao: THREE.Texture, normal: THREE.Texture, roughness: THREE.Texture } | null}
 */
export function getBarkMaps(type) {
  if (!BarkType[type]) return null;
  if (barkCache.has(type)) return barkCache.get(type);

  const dir = `${type}_1K-JPG`;
  const base = `/textures/bark/${dir}/${dir}`;
  const maps = {
    color: loadColor(`${base}_Color.jpg`),
    ao: loadLinear(`${base}_AmbientOcclusion.jpg`),
    normal: loadLinear(`${base}_NormalGL.jpg`),
    roughness: loadLinear(`${base}_Roughness.jpg`),
  };
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
  const texture = loadColor(`/textures/leaves/${type}.png`);
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
    tree.options.bark.maps.ao = barkMaps.ao;
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
 */
export function loadPresetWithTextures(tree, name) {
  const json = structuredClone(TreePreset[name]);
  if (!json) return;
  tree.options.copy(json);
  applyTreeTextures(tree);
  tree.generate();
}
