import * as THREE from 'three';

// Mirror of the registry in src/app/textures.js. Kept local so the loader can
// be a promise instead of fire-and-forget — necessary because baking has to
// know the source pixels are actually ready.
export const LEAF_ATLASES = {
  LeafSet004: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true, ao: true },
  LeafSet006: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true },
  LeafSet008: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true },
  LeafSet009: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet010: { cols: 2, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet014: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true },
  LeafSet017: { cols: 2, rows: 3, rotation: 0,   normal: true, roughness: true },
  LeafSet022: { cols: 3, rows: 2, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet023: { cols: 2, rows: 3, rotation: 90,  normal: true, roughness: true, scattering: true },
  LeafSet024: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true },
  LeafSet027: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet029: { cols: 3, rows: 3, rotation: 0,   normal: true, roughness: true, scattering: true },
  LeafSet030: { cols: 4, rows: 4, rotation: 270, normal: true, roughness: true, scattering: true },
};

export const LeafTypes = Object.keys(LEAF_ATLASES);

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load ${url}: ${e?.message || e}`));
    img.src = url;
  });
}

function loadLinearTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

// Compose color + opacity JPGs into a single RGBA CanvasTexture. Same
// background-bleed cleanup as the main app: pixels below alpha threshold get
// their RGB zeroed so bilinear filtering can't bleed the JPG's background
// color into the leaf silhouette.
function compositeColor(colorImg, opacityImg, size = 1024, threshold = 8) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  ctx.drawImage(colorImg, 0, 0, size, size);
  const out = ctx.getImageData(0, 0, size, size);

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(opacityImg, 0, 0, size, size);
  const opacity = ctx.getImageData(0, 0, size, size);

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

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Loads the source leaf atlas for the given type. Resolves once all maps are
 * actually ready to be sampled — so the bake doesn't run against blank canvases.
 * @param {string} type - key from LEAF_ATLASES
 * @returns {Promise<{ maps: object, atlas: { cols, rows, rotation } }>}
 */
export async function loadSourceAtlas(type) {
  const meta = LEAF_ATLASES[type];
  if (!meta) throw new Error(`Unknown leaf atlas: ${type}`);

  const dir = `${type}_1K-JPG`;
  const base = `/textures/leaves/${dir}/${dir}`;

  const [colorImg, opacityImg] = await Promise.all([
    loadImage(`${base}_Color.jpg`),
    loadImage(`${base}_Opacity.jpg`),
  ]);
  const color = compositeColor(colorImg, opacityImg);

  const sidecars = await Promise.all([
    meta.normal     ? loadLinearTexture(`${base}_NormalGL.jpg`)        : Promise.resolve(null),
    meta.roughness  ? loadLinearTexture(`${base}_Roughness.jpg`)       : Promise.resolve(null),
    meta.ao         ? loadLinearTexture(`${base}_AmbientOcclusion.jpg`): Promise.resolve(null),
    meta.scattering ? loadLinearTexture(`${base}_Scattering.jpg`)      : Promise.resolve(null),
  ]);

  return {
    maps: {
      color,
      normal: sidecars[0],
      roughness: sidecars[1],
      ao: sidecars[2],
      scattering: sidecars[3],
    },
    atlas: { cols: meta.cols, rows: meta.rows, rotation: meta.rotation },
  };
}
