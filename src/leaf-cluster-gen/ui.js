import { TreePreset } from '@dgreenheck/ez-tree';
import { LeafTypes } from './sourceAtlas.js';
import { BARK_TYPES } from './sourceBark.js';

const PRESET_NAMES = Object.keys(TreePreset).filter((n) => n !== 'Trellis');

// Each control descriptor declares its UI shape, where it writes in the
// params tree, and which group it belongs to. The change handler in main.js
// reads `group` to decide whether a change requires a full atlas rebake
// (Atlas-* groups) or just a preview rebuild (Preview group).
const CONTROLS = [
  { group: 'Atlas — Source', label: 'leaf type', type: 'select', path: 'source.leafType', options: LeafTypes, default: 'LeafSet024' },
  { group: 'Atlas — Source', label: 'bark type', type: 'select', path: 'source.barkType', options: BARK_TYPES, default: 'Bark001' },

  { group: 'Atlas — Output', label: 'cols',      type: 'int',    path: 'output.cols', min: 1, max: 4, default: 2 },
  { group: 'Atlas — Output', label: 'rows',      type: 'int',    path: 'output.rows', min: 1, max: 4, default: 2 },
  { group: 'Atlas — Output', label: 'tile px',   type: 'select', path: 'output.tileSize', options: [256, 512, 1024], default: 512, parse: Number },

  { group: 'Atlas — Branch', label: 'length',     type: 'range', path: 'miniTree.branch.length',     min: 1,    max: 8,    step: 0.1, default: 4 },
  { group: 'Atlas — Branch', label: 'radius',     type: 'range', path: 'miniTree.branch.radius',     min: 0.02, max: 0.3,  step: 0.01, default: 0.08 },
  { group: 'Atlas — Branch', label: 'sections',   type: 'int',   path: 'miniTree.branch.sections',   min: 3,    max: 16,   default: 8 },
  { group: 'Atlas — Branch', label: 'taper',      type: 'range', path: 'miniTree.branch.taper',      min: 0.1,  max: 1.0,  step: 0.05, default: 0.5 },
  { group: 'Atlas — Branch', label: 'gnarliness', type: 'range', path: 'miniTree.branch.gnarliness', min: 0.0,  max: 0.6,  step: 0.01, default: 0.18 },

  { group: 'Atlas — Leaves', label: 'count',     type: 'int',   path: 'miniTree.leaves.count',        min: 1,   max: 30,  default: 10 },
  { group: 'Atlas — Leaves', label: 'size',      type: 'range', path: 'miniTree.leaves.size',         min: 0.2, max: 2.5, step: 0.05, default: 0.9 },
  { group: 'Atlas — Leaves', label: 'size var.', type: 'range', path: 'miniTree.leaves.sizeVariance', min: 0,   max: 1,   step: 0.05, default: 0.3 },
  { group: 'Atlas — Leaves', label: 'start',     type: 'range', path: 'miniTree.leaves.start',        min: 0,   max: 0.9, step: 0.05, default: 0.0 },
  { group: 'Atlas — Leaves', label: 'tilt',         type: 'range', path: 'miniTree.foliage.leafTilt',         min: 0,    max: 80,  step: 1,    default: 25 },
  { group: 'Atlas — Leaves', label: 'petiole base', type: 'range', path: 'miniTree.foliage.petioleLengthBase', min: 0,    max: 1.0, step: 0.01, default: 0.3 },
  { group: 'Atlas — Leaves', label: 'petiole tip',  type: 'range', path: 'miniTree.foliage.petioleLengthTip',  min: 0,    max: 1.0, step: 0.01, default: 0.08 },
  { group: 'Atlas — Leaves', label: 'petiole width', type: 'range', path: 'miniTree.foliage.petioleWidth',     min: 0.01, max: 0.2, step: 0.005, default: 0.05 },
  { group: 'Atlas — Leaves', label: 'stem inset',   type: 'range', path: 'miniTree.foliage.stemInset',         min: 0,    max: 0.5, step: 0.01, default: 0.12 },

  { group: 'Atlas — Seed', label: 'base seed', type: 'int', path: 'seed', min: 0, max: 99999, default: 42 },

  // Preview group: these change ONLY the 3D tree using the (already-baked)
  // cluster atlas. Editing any of these triggers a preview rebuild but skips
  // the (more expensive) 5-channel atlas rebake. Bark type lives in the
  // Atlas — Source group because the cluster card itself contains a twig
  // rendered with the consumer tree's bark, so changing bark requires
  // rebaking the atlas.
  { group: 'Preview', label: 'preset',     type: 'select', path: 'preview.preset',    options: PRESET_NAMES, default: 'Ash Medium' },
  { group: 'Preview', label: 'billboard',  type: 'select', path: 'preview.billboard', options: ['single', 'double'], default: 'single' },
  { group: 'Preview', label: 'cluster ct', type: 'int',    path: 'preview.count',     min: 1,  max: 30, default: 5 },
  { group: 'Preview', label: 'cluster sz', type: 'range',  path: 'preview.size',      min: 1,  max: 10, step: 0.1, default: 4.5 },
  { group: 'Preview', label: 'seed',       type: 'int',    path: 'preview.seed',      min: 0,  max: 99999, default: 1234 },
];

const ATLAS_GROUP_PREFIX = 'Atlas';
export function isAtlasGroup(group) {
  return group.startsWith(ATLAS_GROUP_PREFIX);
}

function setAt(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * Builds the left-panel UI inside the given host element.
 * @param {HTMLElement} host
 * @returns {{
 *   params: object,
 *   snapshot: () => object,
 *   onChange: (cb: (ctl: object) => void) => void,
 * }}
 */
export function buildControls(host) {
  const params = {};
  const listeners = new Set();
  const emit = (ctl) => listeners.forEach((cb) => cb(ctl));

  let currentGroup = null;
  let groupEl = null;

  for (const ctl of CONTROLS) {
    if (ctl.group !== currentGroup) {
      currentGroup = ctl.group;
      groupEl = document.createElement('div');
      groupEl.className = 'group';
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = ctl.group;
      groupEl.appendChild(title);
      host.appendChild(groupEl);
    }

    setAt(params, ctl.path, ctl.default);

    const row = document.createElement('div');
    row.className = 'row';

    const labelEl = document.createElement('label');
    labelEl.textContent = ctl.label;
    row.appendChild(labelEl);

    if (ctl.type === 'select') {
      const sel = document.createElement('select');
      for (const opt of ctl.options) {
        const o = document.createElement('option');
        o.value = String(opt);
        o.textContent = String(opt);
        if (opt === ctl.default) o.selected = true;
        sel.appendChild(o);
      }
      sel.addEventListener('change', () => {
        const v = ctl.parse ? ctl.parse(sel.value) : sel.value;
        setAt(params, ctl.path, v);
        emit(ctl);
      });
      row.appendChild(sel);
    } else if (ctl.type === 'int') {
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.value = String(ctl.default);
      if (ctl.min != null) inp.min = String(ctl.min);
      if (ctl.max != null) inp.max = String(ctl.max);
      inp.step = '1';
      inp.addEventListener('change', () => {
        const v = Math.round(Number(inp.value));
        setAt(params, ctl.path, v);
        emit(ctl);
      });
      row.appendChild(inp);
    } else {
      // range
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = String(ctl.min);
      inp.max = String(ctl.max);
      inp.step = String(ctl.step ?? 0.01);
      inp.value = String(ctl.default);
      const val = document.createElement('span');
      val.className = 'value';
      val.textContent = String(ctl.default);
      inp.addEventListener('input', () => {
        const v = Number(inp.value);
        val.textContent = v.toFixed(2).replace(/\.?0+$/, '');
        setAt(params, ctl.path, v);
      });
      inp.addEventListener('change', () => emit(ctl));
      row.appendChild(inp);
      row.appendChild(val);
    }

    groupEl.appendChild(row);
  }

  return {
    params,
    snapshot: () => structuredClone(params),
    onChange: (cb) => { listeners.add(cb); },
  };
}
