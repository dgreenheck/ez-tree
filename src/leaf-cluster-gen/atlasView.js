import { CHANNELS } from './channelMaterials.js';

/**
 * Right-side atlas viewer. Holds the per-channel canvases produced by a bake
 * and switches the displayed one based on the channel <select>. Also paints
 * an overlay showing cluster cell boundaries.
 *
 * Pan + zoom: a `stage` element wraps the displayed canvas and the cell-
 * boundary overlay; CSS transform on the stage applies the user's zoom and
 * pan offset. Wheel zooms toward the cursor (so the point under the mouse
 * stays under the mouse), mouse drag pans.
 */
export class AtlasView {
  constructor(hostEl, infoEl, channelSelectEl) {
    this.host = hostEl;
    this.infoEl = infoEl;
    this.channelSelect = channelSelectEl;

    this.canvases = {};
    this.currentChannel = 'color';
    this.grid = { cols: 0, rows: 0, tileSize: 0 };

    // Zoom/pan state. Updated by wheel + drag handlers.
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;

    // Stage holds the active canvas + cell overlay. Transform is applied here.
    this.stage = document.createElement('div');
    this.stage.id = 'atlas-stage';
    this.stage.style.position = 'absolute';
    this.stage.style.left = '0';
    this.stage.style.top = '0';
    this.stage.style.transformOrigin = '0 0';
    this.host.appendChild(this.stage);

    this.gridOverlay = document.createElement('div');
    this.gridOverlay.id = 'atlas-grid-overlay-host';
    this.gridOverlay.style.position = 'absolute';
    this.gridOverlay.style.left = '0';
    this.gridOverlay.style.top = '0';
    this.gridOverlay.style.pointerEvents = 'none';
    this.stage.appendChild(this.gridOverlay);

    channelSelectEl.replaceChildren();
    for (const ch of CHANNELS) {
      const o = document.createElement('option');
      o.value = ch;
      o.textContent = ch;
      channelSelectEl.appendChild(o);
    }
    channelSelectEl.addEventListener('change', () => {
      this.setChannel(channelSelectEl.value);
    });

    this._installInputHandlers();
  }

  setBake(canvases, cols, rows, tileSize) {
    const isFirstBake = !this.canvases[this.currentChannel];
    this.canvases = canvases;
    this.grid = { cols, rows, tileSize };
    this._showCurrent();
    this.updateGrid();
    if (isFirstBake) this.fitToHost();
  }

  setChannel(name) {
    if (!CHANNELS.includes(name)) return;
    this.currentChannel = name;
    this.channelSelect.value = name;
    this._showCurrent();
    this.updateGrid();
  }

  getCurrentCanvas() {
    return this.canvases[this.currentChannel];
  }

  getCurrentChannel() {
    return this.currentChannel;
  }

  /**
   * Reset zoom + pan so the atlas fits inside the host with a small margin
   * and is centered. Called on first bake (auto) or via the toolbar button.
   */
  fitToHost() {
    const canvas = this.canvases[this.currentChannel];
    if (!canvas) return;
    const hostRect = this.host.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0) return;
    const margin = 24;
    const sx = (hostRect.width - margin * 2) / canvas.width;
    const sy = (hostRect.height - margin * 2) / canvas.height;
    this.zoom = Math.min(sx, sy);
    this.panX = (hostRect.width - canvas.width * this.zoom) * 0.5;
    this.panY = (hostRect.height - canvas.height * this.zoom) * 0.5;
    this._applyTransform();
  }

  _showCurrent() {
    const canvas = this.canvases[this.currentChannel];
    if (!canvas) return;
    // Detach any previously-displayed canvas before adopting the new one.
    for (const child of [...this.stage.children]) {
      if (child !== this.gridOverlay && child.tagName === 'CANVAS') child.remove();
    }
    // Canvas sits at the stage's native pixel size. CSS transform on the
    // stage does the scaling — we don't constrain max-width here.
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.display = 'block';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.maxWidth = 'none';
    canvas.style.maxHeight = 'none';
    canvas.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    this.stage.insertBefore(canvas, this.gridOverlay);
  }

  /**
   * Redraw the cell-boundary overlay so it matches the current grid. The
   * overlay sits inside the (transformed) stage and uses native pixel sizes;
   * the zoom transform handles visual scaling.
   */
  updateGrid() {
    while (this.gridOverlay.firstChild) {
      this.gridOverlay.removeChild(this.gridOverlay.firstChild);
    }
    const canvas = this.canvases[this.currentChannel];
    if (!canvas) return;

    this.gridOverlay.style.width = `${canvas.width}px`;
    this.gridOverlay.style.height = `${canvas.height}px`;

    const { cols, rows, tileSize } = this.grid;
    const cw = canvas.width / cols;
    const ch = canvas.height / rows;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cell = document.createElement('div');
        cell.style.position = 'absolute';
        cell.style.left = `${cx * cw}px`;
        cell.style.top = `${cy * ch}px`;
        cell.style.width = `${cw}px`;
        cell.style.height = `${ch}px`;
        // Stroke width compensated for the current zoom so it renders 1px
        // visually regardless of scale.
        const stroke = Math.max(0.5, 1 / Math.max(this.zoom, 0.01));
        cell.style.border = `${stroke}px solid rgba(255, 255, 255, 0.12)`;
        cell.style.boxSizing = 'border-box';
        this.gridOverlay.appendChild(cell);
      }
    }

    if (this.infoEl) {
      const zoomStr = `${(this.zoom * 100).toFixed(0)}%`;
      this.infoEl.textContent = `${cols} × ${rows} clusters · ${tileSize}px · ${zoomStr}`;
    }
  }

  _applyTransform() {
    this.stage.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    // Refresh the cell border stroke (it scales inversely with zoom).
    this.updateGrid();
  }

  _installInputHandlers() {
    // Wheel = zoom toward cursor.
    this.host.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.host.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newZoom = Math.max(0.05, Math.min(this.zoom * factor, 32));
      // Stage-local coordinates of the cursor before the zoom change.
      const localX = (cx - this.panX) / this.zoom;
      const localY = (cy - this.panY) / this.zoom;
      this.panX = cx - localX * newZoom;
      this.panY = cy - localY * newZoom;
      this.zoom = newZoom;
      this._applyTransform();
    }, { passive: false });

    // Mouse drag = pan.
    let dragging = false;
    let dragOffset = { x: 0, y: 0 };
    this.host.addEventListener('mousedown', (e) => {
      // Left button only.
      if (e.button !== 0) return;
      dragging = true;
      dragOffset.x = e.clientX - this.panX;
      dragOffset.y = e.clientY - this.panY;
      this.host.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      this.panX = e.clientX - dragOffset.x;
      this.panY = e.clientY - dragOffset.y;
      this._applyTransform();
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      this.host.style.cursor = '';
    });
    this.host.style.cursor = 'grab';

    // Re-fit on host resize so the atlas stays usable when the window
    // changes shape, but only if the user hasn't manually zoomed.
    let lastHostSize = null;
    new ResizeObserver(() => {
      const r = this.host.getBoundingClientRect();
      const sig = `${r.width.toFixed(0)}×${r.height.toFixed(0)}`;
      if (lastHostSize === null) {
        lastHostSize = sig;
        return;
      }
      // Only auto-fit when host size meaningfully changes. The user's
      // current pan/zoom is otherwise preserved.
      if (sig !== lastHostSize) {
        lastHostSize = sig;
        // No auto-refit — keep user's view stable.
      }
    }).observe(this.host);
  }
}
