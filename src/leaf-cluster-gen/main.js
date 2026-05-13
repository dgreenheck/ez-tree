import { buildControls, isAtlasGroup } from './ui.js';
import { loadSourceAtlas } from './sourceAtlas.js';
import { loadSourceBark } from './sourceBark.js';
import { ClusterBaker } from './bakeClusterAtlas.js';
import { AtlasView } from './atlasView.js';
import { Preview3D } from './preview3d.js';

const controlsHost = document.getElementById('control-panel');
const atlasHost = document.getElementById('atlas-host');
const previewHost = document.getElementById('preview-host');
const channelSelect = document.getElementById('channel');
const gridInfoEl = document.getElementById('grid-info');
const rebakeBtn = document.getElementById('rebake');
const downloadBtn = document.getElementById('download');

const controls = buildControls(controlsHost);
const baker = new ClusterBaker();
const view = new AtlasView(atlasHost, gridInfoEl, channelSelect);
const preview = new Preview3D(previewHost);

const leafCache = new Map();
const barkCache = new Map();
async function getLeafSource(type) {
  if (!leafCache.has(type)) leafCache.set(type, loadSourceAtlas(type));
  return leafCache.get(type);
}
async function getBarkSource(type) {
  if (!barkCache.has(type)) barkCache.set(type, loadSourceBark(type));
  return barkCache.get(type);
}

// Latest baked atlas + bark info, so preview-only updates can re-apply both
// without rebaking.
let lastBake = null;
let lastBark = null;

async function rebakeAtlas() {
  const params = controls.snapshot();
  try {
    const [leafSource, barkMaps] = await Promise.all([
      getLeafSource(params.source.leafType),
      getBarkSource(params.source.barkType),
    ]);
    const canvases = baker.bake({
      cols: params.output.cols,
      rows: params.output.rows,
      tileSize: params.output.tileSize,
      seed: params.seed,
      leafSource,
      barkMaps,
      miniTree: params.miniTree,
    });
    view.setBake(canvases, params.output.cols, params.output.rows, params.output.tileSize);
    lastBake = {
      canvas: canvases.color,
      cols: params.output.cols,
      rows: params.output.rows,
    };
    lastBark = { type: params.source.barkType, maps: barkMaps };
    preview.update({ cluster: lastBake, bark: lastBark, tree: params.preview });
  } catch (err) {
    console.error('[leaf-cluster-gen] bake failed:', err);
  }
}

function rebuildPreview() {
  if (!lastBake) return;
  const params = controls.snapshot();
  preview.update({ tree: params.preview });
}

let atlasTimer = null;
let previewTimer = null;
controls.onChange((ctl) => {
  if (isAtlasGroup(ctl.group)) {
    if (atlasTimer) clearTimeout(atlasTimer);
    atlasTimer = setTimeout(rebakeAtlas, 50);
  } else {
    if (previewTimer) clearTimeout(previewTimer);
    previewTimer = setTimeout(rebuildPreview, 50);
  }
});

rebakeBtn.addEventListener('click', () => rebakeAtlas());

downloadBtn.addEventListener('click', () => {
  const canvas = view.getCurrentCanvas();
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const params = controls.snapshot();
    const ch = view.getCurrentChannel();
    a.href = url;
    a.download = `cluster_${params.source.leafType}_${params.source.barkType}_${ch}_${params.output.cols}x${params.output.rows}_${params.output.tileSize}_s${params.seed}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
});

window.addEventListener('resize', () => view.updateGrid());

rebakeAtlas();
