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

// Leaf atlas registry. Each entry describes an ambientcg LeafSet:
//   cols/rows:   the tile grid layout
//   rotation:    0/90/180/270 — degrees needed to rotate a tile so the stem
//                lands at the bottom of the mesh quad (stem-at-bottom is the
//                library's convention for the leaf quad)
//   normal/roughness/ao/scattering: whether the sidecar JPGs are present
//
// LeafSet019 (non-uniform conifer sprigs) is registered so the pine preset has
// a sensible target, but is not exposed in the UI dropdown via LeafType below.
const LEAF_ATLASES = {
  LeafSet004: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true, ao: true },
  LeafSet006: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true },
  LeafSet008: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true },
  LeafSet009: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet010: { cols: 2, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet014: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet017: { cols: 2, rows: 3, rotation: 0,   normal: true, roughness: true },
  LeafSet019: { cols: 1, rows: 3, rotation: 270, normal: true, roughness: true },
  LeafSet022: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet023: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true, scattering: true },
  LeafSet024: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true },
  LeafSet027: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet029: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet030: { cols: 4, rows: 4, rotation: 270, normal: true, roughness: true, scattering: true },
};

// Subset of atlases exposed in the UI. LeafSet019 is omitted (non-uniform
// layout); presets that target it still load fine.
export const LeafType = {
  LeafSet004: 'LeafSet004',
  LeafSet006: 'LeafSet006',
  LeafSet008: 'LeafSet008',
  LeafSet009: 'LeafSet009',
  LeafSet010: 'LeafSet010',
  LeafSet014: 'LeafSet014',
  LeafSet017: 'LeafSet017',
  LeafSet022: 'LeafSet022',
  LeafSet023: 'LeafSet023',
  LeafSet024: 'LeafSet024',
  LeafSet027: 'LeafSet027',
  LeafSet029: 'LeafSet029',
  LeafSet030: 'LeafSet030',
};

// Legacy preset values that predate the atlas registry.
const LEGACY_LEAF_REMAP = {
  ash: 'LeafSet014',
  aspen: 'LeafSet022',
  oak: 'LeafSet024',
  pine: 'LeafSet019',
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
 * Loads color + opacity JPGs and composites them into a single RGBA
 * CanvasTexture. Pixels whose opacity falls below `threshold` get their RGB
 * zeroed too, so bilinear filtering can't pull the JPG's opaque background
 * (green/white/brown) into leaf silhouettes. The resulting texture serializes
 * cleanly through GLTFExporter as a baseColor with alpha (alphaMode: MASK).
 *
 * @param {string} colorURL
 * @param {string} opacityURL
 * @param {number} threshold - 0..255 cutoff used to kill background bleed
 * @returns {THREE.CanvasTexture}
 */
function loadCompositeColor(colorURL, opacityURL, size = 1024, threshold = 8) {
  // Canvas size is fixed up front so we never resize a CanvasTexture that has
  // already been uploaded to the GPU at a smaller dimension (which would
  // trigger texSubImage2D offset-overflow errors on the first paint).
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const colorImg = new Image();
  const opacityImg = new Image();
  let loaded = 0;

  const composite = () => {
    if (loaded < 2) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    ctx.drawImage(colorImg, 0, 0, canvas.width, canvas.height);
    const out = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(opacityImg, 0, 0, canvas.width, canvas.height);
    const opacity = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = out.data;
    const op = opacity.data;
    for (let i = 0; i < data.length; i += 4) {
      const a = op[i];
      if (a < threshold) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      } else {
        data[i + 3] = a;
      }
    }
    ctx.putImageData(out, 0, 0);
    texture.needsUpdate = true;
  };

  colorImg.onload = () => { loaded++; composite(); };
  opacityImg.onload = () => { loaded++; composite(); };
  colorImg.src = colorURL;
  opacityImg.src = opacityURL;
  return texture;
}

/**
 * Returns the cached map set + atlas descriptor for a leaf type.
 * @param {string} type
 * @returns {{ maps: object, atlas: { cols: number, rows: number, rotation: number } } | null}
 */
export function getLeafMaps(type) {
  const resolved = LEAF_ATLASES[type] ? type : LEGACY_LEAF_REMAP[type];
  if (!resolved) return null;
  if (leafCache.has(resolved)) return leafCache.get(resolved);

  const meta = LEAF_ATLASES[resolved];
  const dir = `${resolved}_1K-JPG`;
  const base = `/textures/leaves/${dir}/${dir}`;
  const maps = {
    color: loadCompositeColor(`${base}_Color.jpg`, `${base}_Opacity.jpg`),
    normal: meta.normal ? loadLinear(`${base}_NormalGL.jpg`) : null,
    roughness: meta.roughness ? loadLinear(`${base}_Roughness.jpg`) : null,
    ao: meta.ao ? loadLinear(`${base}_AmbientOcclusion.jpg`) : null,
    scattering: meta.scattering ? loadLinear(`${base}_Scattering.jpg`) : null,
  };
  const entry = {
    maps,
    atlas: { cols: meta.cols, rows: meta.rows, rotation: meta.rotation },
  };
  leafCache.set(resolved, entry);
  return entry;
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

  // Normalize legacy preset values (e.g. 'oak') to the new atlas keys so the
  // UI dropdown reflects what's actually applied.
  if (LEGACY_LEAF_REMAP[tree.options.leaves.type]) {
    tree.options.leaves.type = LEGACY_LEAF_REMAP[tree.options.leaves.type];
  }

  const leafEntry = getLeafMaps(tree.options.leaves.type);
  if (leafEntry) {
    Object.assign(tree.options.leaves.maps, leafEntry.maps);
    Object.assign(tree.options.leaves.atlas, leafEntry.atlas);
  }
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
