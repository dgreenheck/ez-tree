import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { BarkType, Billboard, LeafType, TreePreset, Tree, TreeType } from '@dgreenheck/ez-tree';
import { Environment } from './environment';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { version } from '../../package.json';

const exporter = new GLTFExporter();

// ============================================================================
// Heroicons (outline style)
// ============================================================================

const icons = {
  // Tab icons
  tree: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-6m0 0l-3-3m3 3l3-3m-3-3V3m0 9l-4-4m4 4l4-4" />
  </svg>`,

  archive: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>`,

  // Section icons
  swatch: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
  </svg>`,

  cube: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>`,

  share: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>`,

  sparkles: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>`,

  videoCamera: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>`,

  sun: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>`,

  info: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>`,

  folder: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>`,

  cubeTransparent: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3-2.25-1.313M12 12.75l2.25-1.313M12 12.75V15m0 6.75-2.25-1.313M12 21.75V19.5m0 2.25 2.25-1.313m0-16.875L12 2.25l-2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  </svg>`,

  // Button icons
  dice: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
  </svg>`,

  document: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>`,

  folderOpen: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
  </svg>`,

  download: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>`,

  photo: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>`,

  // Arrow icon for sections
  chevronRight: `<svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>`,

  chevronRightSmall: `<svg class="subsection-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>`,

  chevronUp: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>`,
};

// ============================================================================
// UI Component System
// ============================================================================

/**
 * Creates a slider control with label
 */
function createSlider(label, value, min, max, step, onChange) {
  const container = document.createElement('div');
  container.className = 'control-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'control-label';
  labelEl.textContent = label;

  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'slider-wrapper';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'slider';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = value;

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'slider-value';
  valueDisplay.textContent = formatValue(value, step);

  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valueDisplay.textContent = formatValue(val, step);
    onChange(val);
  });

  sliderWrapper.appendChild(slider);
  sliderWrapper.appendChild(valueDisplay);
  container.appendChild(labelEl);
  container.appendChild(sliderWrapper);

  return {
    element: container,
    setValue: (v) => {
      slider.value = v;
      valueDisplay.textContent = formatValue(v, step);
    }
  };
}

function formatValue(value, step) {
  if (step >= 1) return Math.round(value).toString();
  const decimals = step.toString().split('.')[1]?.length || 2;
  return value.toFixed(Math.min(decimals, 3));
}

/**
 * Creates a color picker control
 */
function createColorPicker(label, value, onChange) {
  const container = document.createElement('div');
  container.className = 'control-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'control-label';
  labelEl.textContent = label;

  const pickerWrapper = document.createElement('div');
  pickerWrapper.className = 'color-picker-wrapper';

  const colorPreview = document.createElement('div');
  colorPreview.className = 'color-preview';
  colorPreview.style.backgroundColor = '#' + value.toString(16).padStart(6, '0');

  const picker = document.createElement('input');
  picker.type = 'color';
  picker.className = 'color-picker';
  picker.value = '#' + value.toString(16).padStart(6, '0');

  picker.addEventListener('input', (e) => {
    const hex = parseInt(e.target.value.slice(1), 16);
    colorPreview.style.backgroundColor = e.target.value;
    onChange(hex);
  });

  pickerWrapper.appendChild(colorPreview);
  pickerWrapper.appendChild(picker);
  container.appendChild(labelEl);
  container.appendChild(pickerWrapper);

  return {
    element: container,
    setValue: (v) => {
      const hexStr = '#' + v.toString(16).padStart(6, '0');
      picker.value = hexStr;
      colorPreview.style.backgroundColor = hexStr;
    }
  };
}

/**
 * Creates a dropdown select control
 */
function createSelect(label, options, value, onChange) {
  const container = document.createElement('div');
  container.className = 'control-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'control-label';
  labelEl.textContent = label;

  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'select-wrapper';

  const select = document.createElement('select');
  select.className = 'select';

  Object.entries(options).forEach(([key, val]) => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = key;
    if (val === value) option.selected = true;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    onChange(e.target.value);
  });

  selectWrapper.appendChild(select);
  container.appendChild(labelEl);
  container.appendChild(selectWrapper);

  return {
    element: container,
    setValue: (v) => { select.value = v; }
  };
}

/**
 * Creates a checkbox/toggle control
 */
function createToggle(label, value, onChange) {
  const container = document.createElement('div');
  container.className = 'control-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'control-label';
  labelEl.textContent = label;

  const toggleWrapper = document.createElement('div');
  toggleWrapper.className = 'toggle-wrapper';

  const toggle = document.createElement('button');
  toggle.className = 'toggle' + (value ? ' active' : '');
  toggle.innerHTML = '<span class="toggle-knob"></span>';

  toggle.addEventListener('click', () => {
    const newValue = !toggle.classList.contains('active');
    toggle.classList.toggle('active', newValue);
    onChange(newValue);
  });

  toggleWrapper.appendChild(toggle);
  container.appendChild(labelEl);
  container.appendChild(toggleWrapper);

  return {
    element: container,
    setValue: (v) => {
      toggle.classList.toggle('active', v);
    }
  };
}

/**
 * Creates a button
 */
function createButton(label, iconKey, onClick) {
  const button = document.createElement('button');
  button.className = 'panel-button';
  button.innerHTML = `${icons[iconKey] || ''}<span>${label}</span>`;
  button.addEventListener('click', onClick);
  return { element: button };
}

/**
 * Creates a read-only display
 */
function createDisplay(label, value, formatter = (v) => v) {
  const container = document.createElement('div');
  container.className = 'control-row display-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'control-label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'display-value';
  valueEl.textContent = formatter(value);

  container.appendChild(labelEl);
  container.appendChild(valueEl);

  return {
    element: container,
    setValue: (v) => { valueEl.textContent = formatter(v); }
  };
}

/**
 * Creates a collapsible section
 */
function createSection(title, iconKey, expanded = false) {
  const section = document.createElement('div');
  section.className = 'panel-section' + (expanded ? ' expanded' : '');

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    ${icons[iconKey] || ''}
    <span class="section-title">${title}</span>
    ${icons.chevronRight}
  `;

  const content = document.createElement('div');
  content.className = 'section-content';

  header.addEventListener('click', () => {
    section.classList.toggle('expanded');
  });

  section.appendChild(header);
  section.appendChild(content);

  return {
    element: section,
    content: content,
    add: (control) => content.appendChild(control.element || control),
    setExpanded: (exp) => section.classList.toggle('expanded', exp)
  };
}

/**
 * Creates a sub-section (nested within a section)
 */
function createSubSection(title, expanded = false) {
  const section = document.createElement('div');
  section.className = 'panel-subsection' + (expanded ? ' expanded' : '');

  const header = document.createElement('div');
  header.className = 'subsection-header';
  header.innerHTML = `
    <span class="subsection-title">${title}</span>
    ${icons.chevronRightSmall}
  `;

  const content = document.createElement('div');
  content.className = 'subsection-content';

  header.addEventListener('click', (e) => {
    e.stopPropagation();
    section.classList.toggle('expanded');
  });

  section.appendChild(header);
  section.appendChild(content);

  return {
    element: section,
    content: content,
    add: (control) => content.appendChild(control.element || control)
  };
}

// ============================================================================
// Main UI Setup
// ============================================================================

let controls = [];

/**
 * Setups the UI
 * @param {Tree} tree
 * @param {Environment} environment
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {OrbitControls} orbitControls
 * @param {String} initialPreset
 */
export function setupUI(tree, environment, renderer, scene, camera, orbitControls, initialPreset) {
  const container = document.getElementById('ui-container');
  container.innerHTML = '';
  controls = [];

  // Create main panel
  const panel = document.createElement('div');
  panel.className = 'custom-panel';
  panel.id = 'custom-panel';

  // Panel header with mobile toggle
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `
    <button class="panel-mobile-toggle" aria-label="Toggle panel">
      ${icons.chevronUp}
    </button>
    <h1 class="panel-title">EZ Tree</h1>
    <p class="panel-subtitle">Procedural Tree Generator</p>
  `;
  panel.appendChild(header);

  // Scrollable content area
  const scrollArea = document.createElement('div');
  scrollArea.className = 'panel-scroll-area';
  panel.appendChild(scrollArea);

  // Tab navigation
  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav';
  tabNav.innerHTML = `
    <button class="tab-button active" data-tab="parameters">
      ${icons.tree}
      <span class="tab-label">Tree</span>
    </button>
    <button class="tab-button" data-tab="export">
      ${icons.archive}
      <span class="tab-label">Export</span>
    </button>
  `;
  scrollArea.appendChild(tabNav);

  const tabButtons = tabNav.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // Parameters tab
  const parametersTab = document.createElement('div');
  parametersTab.className = 'tab-content active';
  parametersTab.id = 'tab-parameters';
  scrollArea.appendChild(parametersTab);

  // Export tab
  const exportTab = document.createElement('div');
  exportTab.className = 'tab-content';
  exportTab.id = 'tab-export';
  scrollArea.appendChild(exportTab);

  // ============================================================================
  // Parameters Tab Content
  // ============================================================================

  const onChange = () => {
    tree.generate();
    tree.traverse((o) => {
      if (o.material) {
        o.material.needsUpdate = true;
      }
    });
    // Update info displays
    updateInfoDisplays();
  };

  // ----- Presets Section -----
  const presetsSection = createSection('Presets', 'swatch', true);

  const presetSelect = createSelect('Preset',
    Object.fromEntries(Object.keys(TreePreset).map(p => [p, p])),
    initialPreset,
    (val) => {
      tree.loadPreset(val);
      refreshAllControls();
    }
  );
  presetsSection.add(presetSelect);
  controls.push({ control: presetSelect, update: () => {} });

  const seedSlider = createSlider('Seed', tree.options.seed, 0, 65536, 1, (val) => {
    tree.options.seed = val;
    onChange();
  });
  presetsSection.add(seedSlider);
  controls.push({ control: seedSlider, update: () => seedSlider.setValue(tree.options.seed) });

  const randomSeedBtn = createButton('Random Seed', 'dice', () => {
    tree.options.seed = Math.floor(Math.random() * 65536);
    seedSlider.setValue(tree.options.seed);
    onChange();
  });
  presetsSection.add(randomSeedBtn);

  parametersTab.appendChild(presetsSection.element);

  // ----- Bark Section -----
  const barkSection = createSection('Bark', 'cube', false);

  const barkTypeSelect = createSelect('Type', BarkType, tree.options.bark.type, (val) => {
    tree.options.bark.type = val;
    onChange();
  });
  barkSection.add(barkTypeSelect);
  controls.push({ control: barkTypeSelect, update: () => barkTypeSelect.setValue(tree.options.bark.type) });

  const barkTintPicker = createColorPicker('Tint', tree.options.bark.tint, (val) => {
    tree.options.bark.tint = val;
    onChange();
  });
  barkSection.add(barkTintPicker);
  controls.push({ control: barkTintPicker, update: () => barkTintPicker.setValue(tree.options.bark.tint) });

  const flatShadingToggle = createToggle('Flat Shading', tree.options.bark.flatShading, (val) => {
    tree.options.bark.flatShading = val;
    onChange();
  });
  barkSection.add(flatShadingToggle);
  controls.push({ control: flatShadingToggle, update: () => flatShadingToggle.setValue(tree.options.bark.flatShading) });

  const texturedToggle = createToggle('Textured', tree.options.bark.textured, (val) => {
    tree.options.bark.textured = val;
    onChange();
  });
  barkSection.add(texturedToggle);
  controls.push({ control: texturedToggle, update: () => texturedToggle.setValue(tree.options.bark.textured) });

  const texScaleXSlider = createSlider('Texture Scale X', tree.options.bark.textureScale.x, 0.5, 5, 0.1, (val) => {
    tree.options.bark.textureScale.x = val;
    onChange();
  });
  barkSection.add(texScaleXSlider);
  controls.push({ control: texScaleXSlider, update: () => texScaleXSlider.setValue(tree.options.bark.textureScale.x) });

  const texScaleYSlider = createSlider('Texture Scale Y', tree.options.bark.textureScale.y, 0.5, 5, 0.1, (val) => {
    tree.options.bark.textureScale.y = val;
    onChange();
  });
  barkSection.add(texScaleYSlider);
  controls.push({ control: texScaleYSlider, update: () => texScaleYSlider.setValue(tree.options.bark.textureScale.y) });

  parametersTab.appendChild(barkSection.element);

  // ----- Branches Section -----
  const branchSection = createSection('Branches', 'share', false);

  const treeTypeSelect = createSelect('Tree Type', TreeType, tree.options.type, (val) => {
    tree.options.type = val;
    onChange();
  });
  branchSection.add(treeTypeSelect);
  controls.push({ control: treeTypeSelect, update: () => treeTypeSelect.setValue(tree.options.type) });

  const levelsSlider = createSlider('Levels', tree.options.branch.levels, 0, 3, 1, (val) => {
    tree.options.branch.levels = val;
    onChange();
  });
  branchSection.add(levelsSlider);
  controls.push({ control: levelsSlider, update: () => levelsSlider.setValue(tree.options.branch.levels) });

  // Angle subsection
  const angleSubsection = createSubSection('Angle');
  for (let i = 1; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.angle[i], 0, 180, 1, (val) => {
      tree.options.branch.angle[i] = val;
      onChange();
    });
    angleSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.angle[i]) });
  }
  branchSection.add(angleSubsection);

  // Children subsection
  const childrenSubsection = createSubSection('Children');
  const childrenRanges = [[0, 100], [1, 10], [2, 5]];
  childrenRanges.forEach(([level, max]) => {
    const slider = createSlider(`Level ${level}`, tree.options.branch.children[level], 0, max, 1, (val) => {
      tree.options.branch.children[level] = val;
      onChange();
    });
    childrenSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.children[level]) });
  });
  branchSection.add(childrenSubsection);

  // Gnarliness subsection
  const gnarlinessSubsection = createSubSection('Gnarliness');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.gnarliness[i], -0.5, 0.5, 0.01, (val) => {
      tree.options.branch.gnarliness[i] = val;
      onChange();
    });
    gnarlinessSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.gnarliness[i]) });
  }
  branchSection.add(gnarlinessSubsection);

  // Growth Direction subsection
  const forceSubsection = createSubSection('Growth Direction');
  ['x', 'y', 'z'].forEach(axis => {
    const slider = createSlider(`Direction ${axis.toUpperCase()}`, tree.options.branch.force.direction[axis], -1, 1, 0.01, (val) => {
      tree.options.branch.force.direction[axis] = val;
      onChange();
    });
    forceSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.force.direction[axis]) });
  });
  const strengthSlider = createSlider('Strength', tree.options.branch.force.strength, -0.1, 0.1, 0.001, (val) => {
    tree.options.branch.force.strength = val;
    onChange();
  });
  forceSubsection.add(strengthSlider);
  controls.push({ control: strengthSlider, update: () => strengthSlider.setValue(tree.options.branch.force.strength) });
  branchSection.add(forceSubsection);

  // Length subsection
  const lengthSubsection = createSubSection('Length');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.length[i], 0.1, 100, 0.1, (val) => {
      tree.options.branch.length[i] = val;
      onChange();
    });
    lengthSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.length[i]) });
  }
  branchSection.add(lengthSubsection);

  // Radius subsection
  const radiusSubsection = createSubSection('Radius');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.radius[i], 0.1, 5, 0.01, (val) => {
      tree.options.branch.radius[i] = val;
      onChange();
    });
    radiusSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.radius[i]) });
  }
  branchSection.add(radiusSubsection);

  // Sections subsection
  const sectionsSubsection = createSubSection('Sections');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.sections[i], 1, 20, 1, (val) => {
      tree.options.branch.sections[i] = val;
      onChange();
    });
    sectionsSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.sections[i]) });
  }
  branchSection.add(sectionsSubsection);

  // Segments subsection
  const segmentsSubsection = createSubSection('Segments');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.segments[i], 3, 16, 1, (val) => {
      tree.options.branch.segments[i] = val;
      onChange();
    });
    segmentsSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.segments[i]) });
  }
  branchSection.add(segmentsSubsection);

  // Start subsection
  const startSubsection = createSubSection('Start Position');
  for (let i = 1; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.start[i], 0, 1, 0.01, (val) => {
      tree.options.branch.start[i] = val;
      onChange();
    });
    startSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.start[i]) });
  }
  branchSection.add(startSubsection);

  // Taper subsection
  const taperSubsection = createSubSection('Taper');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.taper[i], 0, 1, 0.01, (val) => {
      tree.options.branch.taper[i] = val;
      onChange();
    });
    taperSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.taper[i]) });
  }
  branchSection.add(taperSubsection);

  // Twist subsection
  const twistSubsection = createSubSection('Twist');
  for (let i = 0; i <= 3; i++) {
    const slider = createSlider(`Level ${i}`, tree.options.branch.twist[i], -0.5, 0.5, 0.01, (val) => {
      tree.options.branch.twist[i] = val;
      onChange();
    });
    twistSubsection.add(slider);
    controls.push({ control: slider, update: () => slider.setValue(tree.options.branch.twist[i]) });
  }
  branchSection.add(twistSubsection);

  parametersTab.appendChild(branchSection.element);

  // ----- Leaves Section -----
  const leavesSection = createSection('Leaves', 'sparkles', false);

  const leafTypeSelect = createSelect('Type', LeafType, tree.options.leaves.type, (val) => {
    tree.options.leaves.type = val;
    onChange();
  });
  leavesSection.add(leafTypeSelect);
  controls.push({ control: leafTypeSelect, update: () => leafTypeSelect.setValue(tree.options.leaves.type) });

  const leafTintPicker = createColorPicker('Tint', tree.options.leaves.tint, (val) => {
    tree.options.leaves.tint = val;
    onChange();
  });
  leavesSection.add(leafTintPicker);
  controls.push({ control: leafTintPicker, update: () => leafTintPicker.setValue(tree.options.leaves.tint) });

  const billboardSelect = createSelect('Billboard', Billboard, tree.options.leaves.billboard, (val) => {
    tree.options.leaves.billboard = val;
    onChange();
  });
  leavesSection.add(billboardSelect);
  controls.push({ control: billboardSelect, update: () => billboardSelect.setValue(tree.options.leaves.billboard) });

  const leafAngleSlider = createSlider('Angle', tree.options.leaves.angle, 0, 100, 1, (val) => {
    tree.options.leaves.angle = val;
    onChange();
  });
  leavesSection.add(leafAngleSlider);
  controls.push({ control: leafAngleSlider, update: () => leafAngleSlider.setValue(tree.options.leaves.angle) });

  const leafCountSlider = createSlider('Count', tree.options.leaves.count, 0, 100, 1, (val) => {
    tree.options.leaves.count = val;
    onChange();
  });
  leavesSection.add(leafCountSlider);
  controls.push({ control: leafCountSlider, update: () => leafCountSlider.setValue(tree.options.leaves.count) });

  const leafStartSlider = createSlider('Start', tree.options.leaves.start, 0, 1, 0.01, (val) => {
    tree.options.leaves.start = val;
    onChange();
  });
  leavesSection.add(leafStartSlider);
  controls.push({ control: leafStartSlider, update: () => leafStartSlider.setValue(tree.options.leaves.start) });

  const leafSizeSlider = createSlider('Size', tree.options.leaves.size, 0, 10, 0.1, (val) => {
    tree.options.leaves.size = val;
    onChange();
  });
  leavesSection.add(leafSizeSlider);
  controls.push({ control: leafSizeSlider, update: () => leafSizeSlider.setValue(tree.options.leaves.size) });

  const leafVarianceSlider = createSlider('Size Variance', tree.options.leaves.sizeVariance, 0, 1, 0.01, (val) => {
    tree.options.leaves.sizeVariance = val;
    onChange();
  });
  leavesSection.add(leafVarianceSlider);
  controls.push({ control: leafVarianceSlider, update: () => leafVarianceSlider.setValue(tree.options.leaves.sizeVariance) });

  const alphaTestSlider = createSlider('Alpha Test', tree.options.leaves.alphaTest, 0, 1, 0.01, (val) => {
    tree.options.leaves.alphaTest = val;
    onChange();
  });
  leavesSection.add(alphaTestSlider);
  controls.push({ control: alphaTestSlider, update: () => alphaTestSlider.setValue(tree.options.leaves.alphaTest) });

  parametersTab.appendChild(leavesSection.element);

  // ----- Camera Section -----
  const cameraSection = createSection('Camera', 'videoCamera', false);

  const autoRotateToggle = createToggle('Auto Rotate', orbitControls.autoRotate, (val) => {
    orbitControls.autoRotate = val;
  });
  cameraSection.add(autoRotateToggle);
  controls.push({ control: autoRotateToggle, update: () => autoRotateToggle.setValue(orbitControls.autoRotate) });

  const rotateSpeedSlider = createSlider('Rotate Speed', orbitControls.autoRotateSpeed, 0, 2, 0.1, (val) => {
    orbitControls.autoRotateSpeed = val;
  });
  cameraSection.add(rotateSpeedSlider);
  controls.push({ control: rotateSpeedSlider, update: () => rotateSpeedSlider.setValue(orbitControls.autoRotateSpeed) });

  parametersTab.appendChild(cameraSection.element);

  // ----- Environment Section -----
  const environmentSection = createSection('Environment', 'sun', false);

  const sunAzimuthSlider = createSlider('Sun Angle', environment.skybox.sunAzimuth, 0, 360, 1, (val) => {
    environment.skybox.sunAzimuth = val;
  });
  environmentSection.add(sunAzimuthSlider);
  controls.push({ control: sunAzimuthSlider, update: () => sunAzimuthSlider.setValue(environment.skybox.sunAzimuth) });

  const grassCountSlider = createSlider('Grass Count', environment.grass.instanceCount, 0, 25000, 100, (val) => {
    environment.grass.instanceCount = val;
  });
  environmentSection.add(grassCountSlider);
  controls.push({ control: grassCountSlider, update: () => grassCountSlider.setValue(environment.grass.instanceCount) });

  parametersTab.appendChild(environmentSection.element);

  // ----- Info Section -----
  const infoSection = createSection('Info', 'info', false);

  const vertexDisplay = createDisplay('Vertices', tree.vertexCount, (v) => Math.round(v).toLocaleString());
  infoSection.add(vertexDisplay);

  const triangleDisplay = createDisplay('Triangles', tree.triangleCount, (v) => Math.round(v).toLocaleString());
  infoSection.add(triangleDisplay);

  const versionDisplay = createDisplay('Version', version);
  infoSection.add(versionDisplay);

  parametersTab.appendChild(infoSection.element);

  function updateInfoDisplays() {
    vertexDisplay.setValue(tree.vertexCount);
    triangleDisplay.setValue(tree.triangleCount);
  }

  // ============================================================================
  // Export Tab Content
  // ============================================================================

  const exportSection = createSection('Save & Load', 'folder', true);

  const savePresetBtn = createButton('Save Preset', 'document', () => {
    const link = document.getElementById('downloadLink');
    const json = JSON.stringify(tree.options, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    link.href = URL.createObjectURL(blob);
    link.download = 'tree.json';
    link.click();
  });
  exportSection.add(savePresetBtn);

  const loadPresetBtn = createButton('Load Preset', 'folderOpen', () => {
    document.getElementById('fileInput').click();
  });
  exportSection.add(loadPresetBtn);

  exportTab.appendChild(exportSection.element);

  const exportModelsSection = createSection('Export Models', 'cubeTransparent', true);

  const exportGlbBtn = createButton('Export GLB', 'download', () => {
    exporter.parse(
      tree,
      (glb) => {
        const blob = new Blob([glb], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.getElementById('downloadLink');
        link.href = url;
        link.download = 'tree.glb';
        link.click();
      },
      (err) => {
        console.error(err);
      },
      { binary: true }
    );
  });
  exportModelsSection.add(exportGlbBtn);

  const exportPngBtn = createButton('Export PNG', 'photo', () => {
    renderer.setClearColor(0, 0);
    const fog = scene.fog;
    scene.fog = null;

    scene.traverse((o) => {
      if (o.name === 'Skybox') {
        o.material.side = THREE.FrontSide;
      } else if (o.isMesh) {
        o.visible = false;
      }
    });
    tree.traverse((o) => o.visible = true);

    renderer.render(scene, camera);

    const link = document.getElementById('downloadLink');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = 'tree.png';
    link.click();

    renderer.setClearColor(0);
    scene.fog = fog;
    scene.traverse((o) => {
      if (o.name === 'Skybox') {
        o.material.side = THREE.BackSide;
      }
      o.visible = true;
    });
  });
  exportModelsSection.add(exportPngBtn);

  exportTab.appendChild(exportModelsSection.element);

  // Add panel to container
  container.appendChild(panel);

  // File input handler
  const fileInput = document.getElementById('fileInput');
  const newFileInput = fileInput.cloneNode(true);
  fileInput.parentNode.replaceChild(newFileInput, fileInput);

  newFileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          tree.options = JSON.parse(e.target.result);
          tree.generate();
          refreshAllControls();
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.onerror = function (e) {
        console.error('Error reading file:', e);
      };
      reader.readAsText(file);
    }
    // Reset file input
    newFileInput.value = '';
  });

  // Refresh all controls to match current tree options
  function refreshAllControls() {
    controls.forEach(({ update }) => update());
    updateInfoDisplays();
  }

  // Mobile expand/collapse functionality
  setupMobileToggle(panel, header);
}

/**
 * Sets up mobile expand/collapse toggle
 */
function setupMobileToggle(panel, header) {
  const toggleBtn = header.querySelector('.panel-mobile-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    // Trigger resize event so canvas can adjust
    window.dispatchEvent(new Event('resize'));
  });
}
