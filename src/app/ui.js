import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { BarkType, Billboard, LeafType, TreePreset, Tree, TreeType } from '@dgreenheck/ez-tree';
import { Environment } from './environment';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { version } from '../../package.json';

const exporter = new GLTFExporter();

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
  toggle.innerHTML = `<span class="toggle-leaf">${value ? '🌿' : '🍂'}</span>`;

  toggle.addEventListener('click', () => {
    const newValue = !toggle.classList.contains('active');
    toggle.classList.toggle('active', newValue);
    toggle.innerHTML = `<span class="toggle-leaf">${newValue ? '🌿' : '🍂'}</span>`;
    onChange(newValue);
  });

  toggleWrapper.appendChild(toggle);
  container.appendChild(labelEl);
  container.appendChild(toggleWrapper);

  return {
    element: container,
    setValue: (v) => {
      toggle.classList.toggle('active', v);
      toggle.innerHTML = `<span class="toggle-leaf">${v ? '🌿' : '🍂'}</span>`;
    }
  };
}

/**
 * Creates a button
 */
function createButton(label, icon, onClick) {
  const button = document.createElement('button');
  button.className = 'panel-button';
  button.innerHTML = `<span class="button-icon">${icon}</span><span>${label}</span>`;
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
function createSection(title, icon, expanded = false) {
  const section = document.createElement('div');
  section.className = 'panel-section' + (expanded ? ' expanded' : '');

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <span class="section-icon">${icon}</span>
    <span class="section-title">${title}</span>
    <span class="section-arrow">›</span>
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
    <span class="subsection-arrow">›</span>
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

  // Panel header with drag handle for mobile
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `
    <div class="panel-drag-handle"></div>
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
      <span class="tab-icon">🌳</span>
      <span class="tab-label">Tree</span>
    </button>
    <button class="tab-button" data-tab="export">
      <span class="tab-icon">📦</span>
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
  const presetsSection = createSection('Presets', '🎨', true);

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

  const randomSeedBtn = createButton('Random Seed', '🎲', () => {
    tree.options.seed = Math.floor(Math.random() * 65536);
    seedSlider.setValue(tree.options.seed);
    onChange();
  });
  presetsSection.add(randomSeedBtn);

  parametersTab.appendChild(presetsSection.element);

  // ----- Bark Section -----
  const barkSection = createSection('Bark', '🪵', false);

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
  const branchSection = createSection('Branches', '🌿', false);

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
  const leavesSection = createSection('Leaves', '🍃', false);

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
  const cameraSection = createSection('Camera', '🎥', false);

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
  const environmentSection = createSection('Environment', '🌤️', false);

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
  const infoSection = createSection('Info', 'ℹ️', false);

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

  const exportSection = createSection('Save & Load', '💾', true);

  const savePresetBtn = createButton('Save Preset', '📄', () => {
    const link = document.getElementById('downloadLink');
    const json = JSON.stringify(tree.options, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    link.href = URL.createObjectURL(blob);
    link.download = 'tree.json';
    link.click();
  });
  exportSection.add(savePresetBtn);

  const loadPresetBtn = createButton('Load Preset', '📂', () => {
    document.getElementById('fileInput').click();
  });
  exportSection.add(loadPresetBtn);

  exportTab.appendChild(exportSection.element);

  const exportModelsSection = createSection('Export Models', '📦', true);

  const exportGlbBtn = createButton('Export GLB', '🎮', () => {
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

  const exportPngBtn = createButton('Export PNG', '🖼️', () => {
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

  // Mobile drag functionality
  setupMobileDrag(panel, header);
}

/**
 * Sets up mobile drag-to-expand functionality
 */
function setupMobileDrag(panel, header) {
  let startY = 0;
  let startHeight = 0;
  let isDragging = false;

  const dragHandle = header.querySelector('.panel-drag-handle');
  if (!dragHandle) return;

  dragHandle.addEventListener('touchstart', (e) => {
    if (window.innerWidth > 800) return;
    isDragging = true;
    startY = e.touches[0].clientY;
    startHeight = panel.offsetHeight;
    panel.style.transition = 'none';
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.touches[0].clientY;
    const newHeight = Math.min(Math.max(startHeight + deltaY, 200), window.innerHeight * 0.9);
    panel.style.height = newHeight + 'px';
  });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    panel.style.transition = '';

    // Snap to positions
    const currentHeight = panel.offsetHeight;
    const windowHeight = window.innerHeight;

    if (currentHeight < windowHeight * 0.3) {
      panel.style.height = '200px';
    } else if (currentHeight > windowHeight * 0.7) {
      panel.style.height = '90vh';
    } else {
      panel.style.height = '50vh';
    }
  });
}
