var O = Object.defineProperty;
var _ = (p, c, e) => c in p ? O(p, c, { enumerable: !0, configurable: !0, writable: !0, value: e }) : p[c] = e;
var b = (p, c, e) => (_(p, typeof c != "symbol" ? c + "" : c, e), e);
import * as t from "three";
class T {
  constructor(c) {
    b(this, "m_w", 123456789);
    b(this, "m_z", 987654321);
    b(this, "mask", 4294967295);
    this.m_w = 123456789 + c & this.mask, this.m_z = 987654321 - c & this.mask;
  }
  /**
   * Returns a random number between min and max
   */
  random(c = 1, e = 0) {
    this.m_z = 36969 * (this.m_z & 65535) + (this.m_z >> 16) & this.mask, this.m_w = 18e3 * (this.m_w & 65535) + (this.m_w >> 16) & this.mask;
    let n = (this.m_z << 16) + (this.m_w & 65535) >>> 0;
    return n /= 4294967296, (c - e) * n + e;
  }
}
class z {
  /**
   * Generates a new branch
   * @param {THREE.Vector3} origin The starting point of the branch
   * @param {THREE.Euler} orientation The starting orientation of the branch
   * @param {number} length The length of the branch
   * @param {number} radius The radius of the branch at its starting point
   */
  constructor(c = new t.Vector3(), e = new t.Euler(), n = 0, s = 0, u = 0, h = 0, l = 0) {
    this.origin = c.clone(), this.orientation = e.clone(), this.length = n, this.radius = s, this.level = u, this.sectionCount = h, this.segmentCount = l;
  }
}
const $ = {
  Birch: "birch",
  Oak: "oak",
  Pine: "pine",
  Willow: "willow"
}, S = {
  Single: "single",
  Double: "double"
}, C = {
  Ash: "ash",
  Aspen: "aspen",
  Pine: "pine",
  Oak: "oak"
}, k = {
  Ash: "ash",
  Aspen: "aspen",
  Pine: "pine",
  Oak: "oak"
}, A = {
  Deciduous: "deciduous",
  Evergreen: "evergreen"
};
class V {
  constructor() {
    this.seed = 0, this.type = A.Deciduous, this.bark = {
      // The bark texture
      type: $.Oak,
      // Tint of the tree trunk
      tint: 16777215,
      // Use face normals for shading instead of vertex normals
      flatShading: !1,
      // Apply texture to bark
      textured: !0,
      // Scale for the texture
      textureScale: { x: 1, y: 1 }
    }, this.branch = {
      // Number of branch recursion levels. 0 = trunk only
      levels: 3,
      // Angle of the child branches relative to the parent branch (degrees)
      angle: {
        1: 70,
        2: 60,
        3: 60
      },
      // Number of children per branch level
      children: {
        0: 7,
        1: 7,
        2: 5
      },
      // External force encouraging tree growth in a particular direction
      force: {
        direction: { x: 0, y: 1, z: 0 },
        strength: 0.01
      },
      // Amount of curling/twisting at each branch level
      gnarliness: {
        0: 0.15,
        1: 0.2,
        2: 0.3,
        3: 0.02
      },
      // Length of each branch level
      length: {
        0: 20,
        1: 20,
        2: 10,
        3: 1
      },
      // Radius of each branch level
      radius: {
        0: 1.5,
        1: 0.7,
        2: 0.7,
        3: 0.7
      },
      // Number of sections per branch level
      sections: {
        0: 12,
        1: 10,
        2: 8,
        3: 6
      },
      // Number of radial segments per branch level
      segments: {
        0: 8,
        1: 6,
        2: 4,
        3: 3
      },
      // Defines where child branches start forming on the parent branch
      start: {
        1: 0.4,
        2: 0.3,
        3: 0.3
      },
      // Taper at each branch level
      taper: {
        0: 0.7,
        1: 0.7,
        2: 0.7,
        3: 0.7
      },
      // Amount of twist at each branch level
      twist: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      }
    }, this.leaves = {
      // Leaf texture to use
      type: C.Oak,
      // Whether to use single or double/perpendicular billboards
      billboard: S.Double,
      // Angle of leaves relative to parent branch (degrees)
      angle: 10,
      // Number of leaves
      count: 1,
      // Where leaves start to grow on the length of the branch (0 to 1)
      start: 0,
      // Size of the leaves
      size: 2.5,
      // Variance in leaf size between each instance
      sizeVariance: 0.7,
      // Tint color for the leaves
      tint: 16777215,
      // Controls transparency of leaf texture
      alphaTest: 0.5
    };
  }
}
const L = 31701, q = "deciduous", P = {
  type: "oak",
  tint: 13552830,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 3
  }
}, I = {
  levels: 3,
  angle: {
    1: 48,
    2: 75,
    3: 60
  },
  children: {
    0: 7,
    1: 4,
    2: 3
  },
  force: {
    direction: {
      x: 0,
      y: 1,
      z: 0
    },
    strength: 0
  },
  gnarliness: {
    0: 0.18,
    1: 0.25,
    2: 0.2,
    3: 0.09
  },
  length: {
    0: 20,
    1: 18,
    2: 9.51,
    3: 4.6
  },
  radius: {
    0: 1.5,
    1: 0.63,
    2: 0.76,
    3: 0.7
  },
  sections: {
    0: 12,
    1: 10,
    2: 10,
    3: 10
  },
  segments: {
    0: 8,
    1: 6,
    2: 4,
    3: 3
  },
  start: {
    1: 0.12,
    2: 0.33,
    3: 0
  },
  taper: {
    0: 0.7,
    1: 0.7,
    2: 0.7,
    3: 0.7
  },
  twist: {
    0: 0.13,
    1: -0.07,
    2: 0,
    3: 0
  }
}, j = {
  type: "ash",
  billboard: "double",
  angle: 55,
  count: 6,
  start: 0,
  size: 2.665,
  sizeVariance: 0.717,
  tint: 16777215,
  alphaTest: 0.5
}, G = {
  seed: L,
  type: q,
  bark: P,
  branch: I,
  leaves: j
}, D = 18020, R = "deciduous", U = {
  type: "birch",
  tint: 16777215,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 1
  }
}, W = {
  levels: 2,
  angle: {
    1: 75,
    2: 32,
    3: 7
  },
  children: {
    0: 10,
    1: 3,
    2: 3
  },
  force: {
    direction: {
      x: 0,
      y: 1,
      z: 0
    },
    strength: 0.0148
  },
  gnarliness: {
    0: 0.05,
    1: 0.12,
    2: 0.12,
    3: 0.02
  },
  length: {
    0: 50,
    1: 6.07,
    2: 11.19,
    3: 1
  },
  radius: {
    0: 0.72,
    1: 0.41,
    2: 0.7,
    3: 0.7
  },
  sections: {
    0: 12,
    1: 10,
    2: 8,
    3: 6
  },
  segments: {
    0: 8,
    1: 6,
    2: 4,
    3: 3
  },
  start: {
    1: 0.59,
    2: 0.35,
    3: 0
  },
  taper: {
    0: 0.37,
    1: 0.13,
    2: 0.7,
    3: 0.7
  },
  twist: {
    0: 0,
    1: 0,
    2: 0,
    3: 0
  }
}, N = {
  type: "aspen",
  billboard: "double",
  angle: 30,
  count: 11,
  start: 0.124,
  size: 2.5,
  sizeVariance: 0.7,
  tint: 16775778,
  alphaTest: 0.5
}, H = {
  seed: D,
  type: R,
  bark: U,
  branch: W,
  leaves: N
}, J = 17124, K = "deciduous", X = {
  type: "oak",
  tint: 11902609,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 10
  }
}, Y = {
  levels: 3,
  angle: {
    1: 54,
    2: 48,
    3: 60
  },
  children: {
    0: 5,
    1: 7,
    2: 5
  },
  force: {
    direction: {
      x: 0,
      y: 1,
      z: 0
    },
    strength: 0
  },
  gnarliness: {
    0: -0.04,
    1: 0.32,
    2: 0.29,
    3: 0.02
  },
  length: {
    0: 15.59,
    1: 12.66,
    2: 11.93,
    3: 1
  },
  radius: {
    0: 2,
    1: 0.69,
    2: 0.41,
    3: 0.7
  },
  sections: {
    0: 16,
    1: 16,
    2: 8,
    3: 1
  },
  segments: {
    0: 8,
    1: 6,
    2: 4,
    3: 3
  },
  start: {
    1: 0.19,
    2: 0.21,
    3: 0.54
  },
  taper: {
    0: 0.49,
    1: 0.43,
    2: 0.7,
    3: 0.7
  },
  twist: {
    0: 0.06,
    1: -0.12,
    2: 0,
    3: 0
  }
}, Z = {
  type: "oak",
  billboard: "double",
  angle: 10,
  count: 3,
  start: 0,
  size: 2.125,
  sizeVariance: 0.7,
  tint: 10546069,
  alphaTest: 0.5
}, ee = {
  seed: J,
  type: K,
  bark: X,
  branch: Y,
  leaves: Z
}, te = 11744, se = "evergreen", ne = {
  type: "pine",
  tint: 16761758,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 1
  }
}, ie = {
  levels: 1,
  angle: {
    1: 117,
    2: 60,
    3: 60
  },
  children: {
    0: 91,
    1: 7,
    2: 5
  },
  force: {
    direction: {
      x: 0,
      y: 1,
      z: 0
    },
    strength: 0
  },
  gnarliness: {
    0: 0.05,
    1: 0.08,
    2: 0,
    3: 0
  },
  length: {
    0: 39.55,
    1: 12.12,
    2: 10,
    3: 1
  },
  radius: {
    0: 0.55,
    1: 0.41,
    2: 0.7,
    3: 0.7
  },
  sections: {
    0: 12,
    1: 10,
    2: 8,
    3: 6
  },
  segments: {
    0: 8,
    1: 6,
    2: 4,
    3: 3
  },
  start: {
    1: 0.16,
    2: 0.3,
    3: 0.3
  },
  taper: {
    0: 0.7,
    1: 0.7,
    2: 0.7,
    3: 0.7
  },
  twist: {
    0: 0,
    1: 0,
    2: 0,
    3: 0
  }
}, re = {
  type: "pine",
  billboard: "double",
  angle: 10,
  count: 21,
  start: 0,
  size: 0.965,
  sizeVariance: 0.7,
  tint: 16777215,
  alphaTest: 0.3
}, ae = {
  seed: te,
  type: se,
  bark: ne,
  branch: ie,
  leaves: re
};
function oe(p) {
  switch (p) {
    case k.Ash:
      return G;
    case k.Aspen:
      return H;
    case k.Oak:
      return ee;
    case k.Pine:
      return ae;
    default:
      return new V();
  }
}
const B = {}, le = new t.TextureLoader(), x = (p, c = { x: 1, y: 1 }, e = null) => {
  if (!B[p]) {
    const s = new URL("../src/textures/" + p, import.meta.url).href;
    B[p] = le.load(s);
  }
  const n = B[p];
  return n.wrapS = t.MirroredRepeatWrapping, n.wrapT = t.MirroredRepeatWrapping, n.repeat.x = c.x, n.repeat.y = 1 / c.y, e && (n.colorSpace = e), n;
};
class ce extends t.Group {
  /**
   * @param {TreeOptions} params
   */
  constructor(e = new V()) {
    super();
    /**
     * @type {RNG}
     */
    b(this, "rng");
    /**
     * @type {TreeOptions}
     */
    b(this, "options");
    /**
     * @type {Branch[]}
     */
    b(this, "branchQueue", []);
    this.branchesMesh = new t.Mesh(), this.leavesMesh = new t.Mesh(), this.add(this.branchesMesh), this.add(this.leavesMesh), this.options = e;
  }
  /**
   * Loads a preset tree from JSON 
   * @param {string} preset 
   */
  loadPreset(e) {
    this.options = oe(e), this.generate();
  }
  /**
   * Generate a new tree
   */
  generate() {
    for (this.branches = {
      verts: [],
      normals: [],
      indices: [],
      uvs: []
    }, this.leaves = {
      verts: [],
      normals: [],
      indices: [],
      uvs: []
    }, this.rng = new T(this.options.seed), this.branchQueue.push(
      new z(
        new t.Vector3(),
        new t.Euler(),
        this.options.branch.length[0],
        this.options.branch.radius[0],
        0,
        this.options.branch.sections[0],
        this.options.branch.segments[0]
      )
    ); this.branchQueue.length > 0; ) {
      const e = this.branchQueue.shift();
      this.generateBranch(e);
    }
    this.createBranchesGeometry(), this.createLeavesGeometry();
  }
  /**
   * Generates a new branch
   * @param {Branch} branch
   * @returns
   */
  generateBranch(e) {
    const n = this.branches.verts.length / 3;
    let s = e.orientation.clone(), u = e.origin.clone(), h = e.length / e.sectionCount / (this.options.type === "Deciduous" ? this.options.branch.levels - 1 : 1), l = [];
    for (let i = 0; i <= e.sectionCount; i++) {
      let o = e.radius;
      i === e.sectionCount && e.level === this.options.branch.levels ? o = 1e-3 : this.options.type === A.Deciduous ? o *= 1 - this.options.branch.taper[e.level] * (i / e.sectionCount) : this.options.type === A.Evergreen && (o *= 1 - i / e.sectionCount);
      let r;
      for (let g = 0; g < e.segmentCount; g++) {
        let m = 2 * Math.PI * g / e.segmentCount;
        const v = new t.Vector3(Math.cos(m), 0, Math.sin(m)).multiplyScalar(o).applyEuler(s).add(u), f = new t.Vector3(Math.cos(m), 0, Math.sin(m)).applyEuler(s).normalize(), M = new t.Vector2(
          g / e.segmentCount,
          i % 2 === 0 ? 0 : 1
        );
        this.branches.verts.push(...Object.values(v)), this.branches.normals.push(...Object.values(f)), this.branches.uvs.push(...Object.values(M)), g === 0 && (r = { vertex: v, normal: f, uv: M });
      }
      this.branches.verts.push(...Object.values(r.vertex)), this.branches.normals.push(...Object.values(r.normal)), this.branches.uvs.push(1, r.uv.y), l.push({
        origin: u.clone(),
        orientation: s.clone(),
        radius: o
      }), u.add(
        new t.Vector3(0, h, 0).applyEuler(s)
      );
      const a = Math.max(1, 1 / Math.sqrt(o)) * this.options.branch.gnarliness[e.level];
      s.x += this.rng.random(a, -a), s.z += this.rng.random(a, -a);
      const d = new t.Quaternion().setFromEuler(s), w = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        this.options.branch.twist[e.level]
      ), y = new t.Quaternion().setFromUnitVectors(
        new t.Vector3(0, 1, 0),
        new t.Vector3().copy(this.options.branch.force.direction)
      );
      d.multiply(w), d.rotateTowards(
        y,
        this.options.branch.force.strength / o
      ), s.setFromQuaternion(d);
    }
    if (this.generateBranchIndices(n, e), this.options.type === "deciduous") {
      const i = l[l.length - 1];
      e.level < this.options.branch.levels ? this.branchQueue.push(
        new z(
          i.origin,
          i.orientation,
          this.options.branch.length[e.level + 1],
          i.radius,
          e.level + 1,
          // Section count and segment count must be same as parent branch
          // since the child branch is growing from the end of the parent branch
          e.sectionCount,
          e.segmentCount
        )
      ) : this.generateLeaf(i.origin, i.orientation);
    }
    e.level === this.options.branch.levels ? this.generateLeaves(l) : e.level < this.options.branch.levels && this.generateChildBranches(
      this.options.branch.children[e.level],
      e.level + 1,
      l
    );
  }
  /**
   * Generate branches from a parent branch
   * @param {number} count The number of child branches to generate
   * @param {number} level The level of the child branches
   * @param {{
   *  origin: THREE.Vector3,
   *  orientation: THREE.Euler,
   *  radius: number
   * }[]} sections The parent branch's sections
   * @returns
   */
  generateChildBranches(e, n, s) {
    const u = this.rng.random();
    for (let h = 0; h < e; h++) {
      let l = this.rng.random(1, this.options.branch.start[n]);
      const i = Math.floor(l * (s.length - 1));
      let o, r;
      o = s[i], i === s.length - 1 ? r = o : r = s[i + 1];
      const a = (l - i / (s.length - 1)) / (1 / (s.length - 1)), d = new t.Vector3().lerpVectors(
        o.origin,
        r.origin,
        a
      ), w = this.options.branch.radius[n] * ((1 - a) * o.radius + a * r.radius), y = new t.Quaternion().setFromEuler(o.orientation), g = new t.Quaternion().setFromEuler(r.orientation), m = new t.Euler().setFromQuaternion(
        g.slerp(y, a)
      ), v = 2 * Math.PI * (u + h / e), f = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.options.branch.angle[n] / (180 / Math.PI)
      ), M = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        v
      ), E = new t.Quaternion().setFromEuler(m), F = new t.Euler().setFromQuaternion(
        E.multiply(M.multiply(f))
      );
      let Q = this.options.branch.length[n] * (this.options.type === A.Evergreen ? 1 - l : 1);
      this.branchQueue.push(
        new z(
          d,
          F,
          Q,
          w,
          n,
          this.options.branch.sections[n],
          this.options.branch.segments[n]
        )
      );
    }
  }
  /**
   * Logic for spawning child branches from a parent branch's section
   * @param {{
  *  origin: THREE.Vector3,
  *  orientation: THREE.Euler,
  *  radius: number
  * }[]} sections The parent branch's sections
  * @returns
  */
  generateLeaves(e) {
    const n = this.rng.random();
    for (let s = 0; s < this.options.leaves.count; s++) {
      let u = this.rng.random(1, this.options.leaves.start);
      const h = Math.floor(u * (e.length - 1));
      let l, i;
      l = e[h], h === e.length - 1 ? i = l : i = e[h + 1];
      const o = (u - h / (e.length - 1)) / (1 / (e.length - 1)), r = new t.Vector3().lerpVectors(
        l.origin,
        i.origin,
        o
      ), a = new t.Quaternion().setFromEuler(l.orientation), d = new t.Quaternion().setFromEuler(i.orientation), w = new t.Euler().setFromQuaternion(
        d.slerp(a, o)
      ), y = 2 * Math.PI * (n + s / this.options.leaves.count), g = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.options.leaves.angle / (180 / Math.PI)
      ), m = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        y
      ), v = new t.Quaternion().setFromEuler(w), f = new t.Euler().setFromQuaternion(
        v.multiply(m.multiply(g))
      );
      this.generateLeaf(r, f);
    }
  }
  /**
  * Generates a leaves
  * @param {THREE.Vector3} origin The starting point of the branch
  * @param {THREE.Euler} orientation The starting orientation of the branch
  */
  generateLeaf(e, n) {
    let s = this.leaves.verts.length / 3, u = this.options.leaves.size * (1 + this.rng.random(
      this.options.leaves.sizeVariance,
      -this.options.leaves.sizeVariance
    ));
    const h = u, l = 1.5 * u, i = (o) => {
      const r = [
        new t.Vector3(-h / 2, l, 0),
        new t.Vector3(-h / 2, 0, 0),
        new t.Vector3(h / 2, 0, 0),
        new t.Vector3(h / 2, l, 0)
      ].map(
        (d) => d.applyEuler(new t.Euler(0, o, 0)).applyEuler(n).add(e)
      );
      this.leaves.verts.push(
        r[0].x,
        r[0].y,
        r[0].z,
        r[1].x,
        r[1].y,
        r[1].z,
        r[2].x,
        r[2].y,
        r[2].z,
        r[3].x,
        r[3].y,
        r[3].z
      );
      const a = new t.Vector3(0, 0, 1).applyEuler(n);
      this.leaves.normals.push(
        a.x,
        a.y,
        a.z,
        a.x,
        a.y,
        a.z,
        a.x,
        a.y,
        a.z,
        a.x,
        a.y,
        a.z
      ), this.leaves.uvs.push(0, 1, 0, 0, 1, 0, 1, 1), this.leaves.indices.push(s, s + 1, s + 2, s, s + 2, s + 3), s += 4;
    };
    i(0), this.options.leaves.billboard === S.Double && i(Math.PI / 2);
  }
  /**
   * Generates the indices for branch geometry
   * @param {Branch} branch
   */
  generateBranchIndices(e, n) {
    let s, u, h, l;
    const i = n.segmentCount + 1;
    for (let o = 0; o < n.sectionCount; o++)
      for (let r = 0; r < n.segmentCount; r++)
        s = e + o * i + r, u = e + o * i + (r + 1), h = s + i, l = u + i, this.branches.indices.push(s, h, u, u, h, l);
  }
  /**
   * Generates the geometry for the branches
   */
  createBranchesGeometry() {
    const e = new t.BufferGeometry();
    e.setAttribute(
      "position",
      new t.BufferAttribute(new Float32Array(this.branches.verts), 3)
    ), e.setAttribute(
      "normal",
      new t.BufferAttribute(new Float32Array(this.branches.normals), 3)
    ), e.setAttribute(
      "uv",
      new t.BufferAttribute(new Float32Array(this.branches.uvs), 2)
    ), e.setIndex(
      new t.BufferAttribute(new Uint16Array(this.branches.indices), 1)
    ), e.computeBoundingSphere();
    const n = new t.MeshStandardMaterial({
      name: "branches",
      flatShading: this.options.bark.flatShading,
      color: this.options.bark.tint
    });
    if (this.branchesMesh.geometry.dispose(), this.branchesMesh.geometry = e, this.branchesMesh.material.dispose(), this.branchesMesh.material = n, this.branchesMesh.castShadow = !0, this.branchesMesh.receiveShadow = !0, this.options.bark.textured) {
      const s = this.options.bark.textureScale;
      this.branchesMesh.material.aoMap = x(`bark/${this.options.bark.type}_ao_1k.jpg`, s), this.branchesMesh.material.map = x(`bark/${this.options.bark.type}_color_1k.jpg`, s), this.branchesMesh.material.normalMap = x(`bark/${this.options.bark.type}_normal_1k.jpg`, s), this.branchesMesh.material.roughnessMap = x(`bark/${this.options.bark.type}_roughness_1k.jpg`, s);
    }
  }
  /**
   * Generates the geometry for the leaves
   */
  createLeavesGeometry() {
    const e = new t.BufferGeometry();
    e.setAttribute(
      "position",
      new t.BufferAttribute(new Float32Array(this.leaves.verts), 3)
    ), e.setAttribute(
      "uv",
      new t.BufferAttribute(new Float32Array(this.leaves.uvs), 2)
    ), e.setIndex(
      new t.BufferAttribute(new Uint16Array(this.leaves.indices), 1)
    ), e.computeVertexNormals(), e.computeBoundingSphere();
    const n = new t.MeshStandardMaterial({
      name: "leaves",
      color: this.options.leaves.tint,
      side: t.DoubleSide,
      alphaTest: this.options.leaves.alphaTest,
      premultipliedAlpha: !0
    });
    this.leavesMesh.geometry.dispose(), this.leavesMesh.geometry = e, this.leavesMesh.material.dispose(), this.leavesMesh.material = n, this.leavesMesh.material.map = x(
      `leaves/${this.options.leaves.type}_color.png`,
      new t.Vector2(1, 1),
      t.SRGBColorSpace
    ), this.leavesMesh.castShadow = !0, this.leavesMesh.receiveShadow = !0;
  }
}
export {
  $ as BarkType,
  S as Billboard,
  C as LeafType,
  k as Presets,
  ce as Tree,
  A as TreeType
};
//# sourceMappingURL=@dgreenheck-tree-js.es.js.map
