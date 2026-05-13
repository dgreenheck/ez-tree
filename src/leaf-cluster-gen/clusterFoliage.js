import * as THREE from 'three';

/**
 * Replace the lib's leaf placement with an alternating left/right layout
 * along the branch, attach each leaf to its branch section via a small
 * tapered petiole, and store the petiole geometry on tree.petiolesMesh so
 * the bake can render it with the same bark material as the branch.
 *
 * Centerline-aware: each leaf's branch surface point is sampled from the
 * actual branch geometry (ring centers averaged), and the leaf's outward
 * direction is perpendicular to the local branch tangent. So curving
 * branches keep their leaves properly attached and rotated along the curve.
 *
 * The lib's leaf vertex buffer is REUSED — each leaf's UVs (i.e. which atlas
 * tile it samples) are preserved while its position/orientation is rewritten.
 * Leaves are sorted by their original Y (branch height) so size and petiole
 * length scaling can apply from base to tip.
 *
 * @param {THREE.Group} tree                       - Result of createClusterMiniTree
 * @param {object} opts
 * @param {number} opts.petioleLengthBase          - Petiole length at branch base
 * @param {number} opts.petioleLengthTip           - Petiole length at branch tip
 * @param {number} opts.petioleWidth               - Petiole width at branch end
 * @param {number} opts.petioleTipScale            - Fraction of petioleWidth at leaf end (taper)
 * @param {number} opts.stemInset                  - Fraction of leaf H that the petiole extends into the leaf (default 0.12) so the petiole visually meets the texture's stem, which usually sits a little inside the quad's BL/BR edge.
 * @param {number} opts.leafTilt                   - Degrees, leaf direction tilt from pure-perpendicular toward branch tangent
 * @param {number} opts.branchSections             - Branch section count (lib option)
 * @param {number} opts.branchSegments             - Branch segment count (lib option)
 */
export function clusterizeLeaves(tree, opts) {
  const geo = tree.leavesMesh.geometry;
  const posAttr = geo.getAttribute('position');
  const uvAttr = geo.getAttribute('uv');
  const normAttr = geo.getAttribute('normal');
  if (!posAttr || !uvAttr || !normAttr) return;

  const positions = posAttr.array;
  const uvs = uvAttr.array;
  const normals = normAttr.array;
  const leafCount = positions.length / 12;

  if (leafCount === 0) {
    tree.petiolesMesh = makePetiolesMesh(emptyAttrs());
    tree.add(tree.petiolesMesh);
    return;
  }

  // Sample the actual branch centerline (and tangent at each ring) so the
  // leaves follow whatever curvature the lib produced.
  const sections = opts.branchSections ?? 8;
  const segments = opts.branchSegments ?? 5;
  const centerline = extractBranchCenterline(tree.branchesMesh, sections + 1, segments);

  // Snapshot each leaf's stem Y + size + original UVs so we can sort by Y
  // and rewrite in place.
  const leaves = [];
  for (let i = 0; i < leafCount; i++) {
    const p = i * 12;
    const tlX = positions[p],     tlY = positions[p + 1],  tlZ = positions[p + 2];
    const blX = positions[p + 3], blY = positions[p + 4],  blZ = positions[p + 5];
    const brX = positions[p + 6], brY = positions[p + 7],  brZ = positions[p + 8];
    const stemY = (blY + brY) * 0.5;
    const W = Math.hypot(brX - blX, brY - blY, brZ - blZ);
    const H = Math.hypot(tlX - blX, tlY - blY, tlZ - blZ);
    const uvSrc = i * 8;
    leaves.push({
      stemY,
      W, H,
      uvTuple: uvs.slice(uvSrc, uvSrc + 8),
    });
  }

  leaves.sort((a, b) => a.stemY - b.stemY);

  const tiltRad = (opts.leafTilt ?? 25) * Math.PI / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  const pBase = opts.petioleLengthBase ?? 0.35;
  const pTip = opts.petioleLengthTip ?? 0.1;
  const pWidth = opts.petioleWidth ?? 0.06;
  const pTipScale = opts.petioleTipScale ?? 0.35;
  const stemInset = opts.stemInset ?? 0.12;

  // Petiole geometry accumulators (camera-facing tapered quads).
  const pp = [];
  const pn = [];
  const pu = [];
  const pi = [];

  // Pre-extract the branch tip + tangent so the last (terminal) leaf can
  // anchor there rather than at its lib-assigned section.
  const tipIdx = centerline.length - 1;
  const tipPos = centerline[tipIdx];
  const prevTip = centerline[Math.max(tipIdx - 1, 0)];
  const tipTan = { x: tipPos.x - prevTip.x, y: tipPos.y - prevTip.y, z: tipPos.z - prevTip.z };
  normalize3(tipTan);
  const tipRadius = sampleBranchRadiusAtY(centerline, tree.branchesMesh, sections + 1, segments, tipPos.y) ?? 0.04;

  for (let i = 0; i < leaves.length; i++) {
    const t = leaves.length === 1 ? 0.5 : i / (leaves.length - 1);
    const data = leaves[i];
    // The highest leaf (last after sorting by Y) is forced to sit AT the
    // branch tip, with its petiole continuing along the branch tangent.
    // This makes the branch visibly end in petiole → leaf instead of just
    // tapering into a stub.
    const isTerminal = (i === leaves.length - 1);

    let bx, by, bz, tnx, tny, radiusHere;
    if (isTerminal) {
      bx = tipPos.x;
      by = tipPos.y;
      bz = tipPos.z;
      tnx = tipTan.x;
      tny = tipTan.y;
      radiusHere = tipRadius;
    } else {
      const sampled = sampleCenterlineAtY(centerline, data.stemY);
      bx = sampled.pos.x;
      by = sampled.pos.y;
      bz = sampled.pos.z;
      tnx = sampled.tan.x;
      tny = sampled.tan.y;
      radiusHere = sampleBranchRadiusAtY(centerline, tree.branchesMesh, sections + 1, segments, data.stemY) ?? 0.05;
    }

    // Project the branch tangent onto the camera plane (screen XY).
    const tnMag = Math.hypot(tnx, tny);
    if (tnMag < 1e-6) {
      tnx = 0;
      tny = 1;
    } else {
      tnx /= tnMag;
      tny /= tnMag;
    }

    let upX, upY;
    if (isTerminal) {
      // Terminal leaf grows straight along the branch tangent — no side
      // offset, no tilt. The branch flows directly into the petiole and
      // then the leaf.
      upX = tnx;
      upY = tny;
    } else {
      // Side leaf: alternate left/right, leaf direction perpendicular to
      // tangent with a tilt back toward the tangent.
      const side = (i % 2 === 0) ? -1 : 1;
      const outX = side * tny;
      const outY = side * -tnx;
      upX = cosT * outX + sinT * tnx;
      upY = cosT * outY + sinT * tny;
    }

    // Petiole length: linearly shrinks base→tip. The terminal leaf uses
    // pTip explicitly so the final petiole is the smallest in the chain.
    const petLen = isTerminal ? pTip : lerp(pBase, pTip, t);

    // Branch attachment point: in the leaf's growth direction at distance
    // radiusHere (so petiole and leaf are collinear).
    const surfX = bx + upX * radiusHere;
    const surfY = by + upY * radiusHere;
    const surfZ = bz;

    const stemX = bx + upX * (radiusHere + petLen);
    const stemY = by + upY * (radiusHere + petLen);
    const stemZ = bz;

    // Right = up rotated 90° CW in screen plane.
    const rightX = upY;
    const rightY = -upX;

    const W = data.W;
    const H = data.H;
    const halfW = W * 0.5;

    // Quad with BL/BR midpoint at the petiole end (leaf attachment).
    const p = i * 12;
    positions[p]      = stemX - halfW * rightX + H * upX; // TL
    positions[p + 1]  = stemY - halfW * rightY + H * upY;
    positions[p + 2]  = stemZ;
    positions[p + 3]  = stemX - halfW * rightX;           // BL
    positions[p + 4]  = stemY - halfW * rightY;
    positions[p + 5]  = stemZ;
    positions[p + 6]  = stemX + halfW * rightX;           // BR
    positions[p + 7]  = stemY + halfW * rightY;
    positions[p + 8]  = stemZ;
    positions[p + 9]  = stemX + halfW * rightX + H * upX; // TR
    positions[p + 10] = stemY + halfW * rightY + H * upY;
    positions[p + 11] = stemZ;

    // Preserve original UVs (sort reordered the leaf array).
    const uvDst = i * 8;
    for (let k = 0; k < 8; k++) uvs[uvDst + k] = data.uvTuple[k];

    for (let j = 0; j < 4; j++) {
      const n = p + j * 3;
      normals[n] = 0; normals[n + 1] = 0; normals[n + 2] = 1;
    }

    // Petiole tip lands stemInset * H *inside* the leaf — the texture's
    // visible stem usually sits a little above the BL/BR edge of the quad,
    // so this makes the petiole appear to physically touch the leaf body.
    const tipX = stemX + upX * stemInset * H;
    const tipY = stemY + upY * stemInset * H;
    const tipZ = stemZ;

    const widthScale = 1 - t * 0.6;
    appendPetiole(
      pp, pn, pu, pi,
      surfX, surfY, surfZ,
      tipX, tipY, tipZ,
      pWidth * widthScale,
      pWidth * widthScale * pTipScale,
    );
  }

  posAttr.needsUpdate = true;
  uvAttr.needsUpdate = true;
  normAttr.needsUpdate = true;
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  if (tree.petiolesMesh) {
    tree.remove(tree.petiolesMesh);
    tree.petiolesMesh.geometry.dispose();
    if (tree.petiolesMesh.material) tree.petiolesMesh.material.dispose();
  }
  tree.petiolesMesh = makePetiolesMesh({ positions: pp, normals: pn, uvs: pu, indices: pi });
  tree.add(tree.petiolesMesh);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function emptyAttrs() {
  return { positions: [], normals: [], uvs: [], indices: [] };
}

function makePetiolesMesh({ positions, normals, uvs, indices }) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  g.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
  g.computeBoundingSphere();
  return new THREE.Mesh(g, null);
}

/**
 * Pull ring centers from the branch mesh. Library lays out branch vertices
 * as `(segments+1)` verts per ring × `(sections+1)` rings, with the last
 * segment-vertex of each ring being a seam duplicate of the first — so we
 * sum the first `segments` of each ring for the center.
 */
function extractBranchCenterline(branchesMesh, ringCount, segmentCount) {
  const positions = branchesMesh.geometry.getAttribute('position').array;
  const ringStride = (segmentCount + 1) * 3;
  const out = [];
  for (let r = 0; r < ringCount; r++) {
    let sx = 0, sy = 0, sz = 0;
    for (let s = 0; s < segmentCount; s++) {
      const i = r * ringStride + s * 3;
      sx += positions[i];
      sy += positions[i + 1];
      sz += positions[i + 2];
    }
    out.push({
      x: sx / segmentCount,
      y: sy / segmentCount,
      z: sz / segmentCount,
    });
  }
  return out;
}

/**
 * Locate the centerline segment that brackets Y=y and return the
 * interpolated position + the local tangent (from the bracketing pair).
 */
function sampleCenterlineAtY(centers, y) {
  const last = centers.length - 1;
  if (y <= centers[0].y) {
    const tan = subtract(centers[Math.min(1, last)], centers[0]);
    normalize3(tan);
    return { pos: { ...centers[0] }, tan };
  }
  if (y >= centers[last].y) {
    const tan = subtract(centers[last], centers[Math.max(last - 1, 0)]);
    normalize3(tan);
    return { pos: { ...centers[last] }, tan };
  }
  for (let i = 0; i < last; i++) {
    const a = centers[i];
    const b = centers[i + 1];
    if (a.y <= y && y <= b.y) {
      const dy = b.y - a.y;
      const t = dy > 1e-6 ? (y - a.y) / dy : 0;
      const pos = {
        x: a.x + t * (b.x - a.x),
        y,
        z: a.z + t * (b.z - a.z),
      };
      const tan = subtract(b, a);
      normalize3(tan);
      return { pos, tan };
    }
  }
  // Shouldn't reach here, but guard anyway.
  return { pos: { ...centers[last] }, tan: { x: 0, y: 1, z: 0 } };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function normalize3(v) {
  const m = Math.hypot(v.x, v.y, v.z);
  if (m < 1e-6) { v.x = 0; v.y = 1; v.z = 0; return; }
  v.x /= m; v.y /= m; v.z /= m;
}

/**
 * Distance from the ring center to its first segment vertex — a faithful
 * read of the branch's actual radius at that ring. Linearly interp across
 * adjacent rings to get the radius at any Y.
 */
function sampleBranchRadiusAtY(centerline, branchesMesh, ringCount, segmentCount, y) {
  const positions = branchesMesh.geometry.getAttribute('position').array;
  const ringStride = (segmentCount + 1) * 3;
  // Per-ring radius lookup.
  const radii = [];
  for (let r = 0; r < ringCount; r++) {
    const c = centerline[r];
    const i = r * ringStride; // first segment vertex
    const dx = positions[i] - c.x;
    const dy = positions[i + 1] - c.y;
    const dz = positions[i + 2] - c.z;
    radii.push(Math.hypot(dx, dy, dz));
  }
  const last = ringCount - 1;
  if (y <= centerline[0].y) return radii[0];
  if (y >= centerline[last].y) return radii[last];
  for (let i = 0; i < last; i++) {
    const a = centerline[i];
    const b = centerline[i + 1];
    if (a.y <= y && y <= b.y) {
      const dy = b.y - a.y;
      const t = dy > 1e-6 ? (y - a.y) / dy : 0;
      return radii[i] + t * (radii[i + 1] - radii[i]);
    }
  }
  return radii[last];
}

/**
 * Append a tapered camera-facing petiole quad. Width tapers from w0 at the
 * branch end to w1 at the leaf end.
 */
function appendPetiole(pp, pn, pu, pi, x0, y0, z0, x1, y1, z1, w0, w1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;

  const nx = -dy / len;
  const ny = dx / len;
  const z = (z0 + z1) * 0.5;

  const base = pp.length / 3;
  pp.push(
    x0 - nx * w0 * 0.5, y0 - ny * w0 * 0.5, z,
    x0 + nx * w0 * 0.5, y0 + ny * w0 * 0.5, z,
    x1 - nx * w1 * 0.5, y1 - ny * w1 * 0.5, z,
    x1 + nx * w1 * 0.5, y1 + ny * w1 * 0.5, z,
  );
  for (let i = 0; i < 4; i++) {
    pn.push(0, 0, 1);
    pu.push(0.5, 0.5);
  }
  pi.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
}
