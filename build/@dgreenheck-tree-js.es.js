var F = Object.defineProperty;
var Q = (p, c, e) => c in p ? F(p, c, { enumerable: !0, configurable: !0, writable: !0, value: e }) : p[c] = e;
var m = (p, c, e) => (Q(p, typeof c != "symbol" ? c + "" : c, e), e);
import * as t from "three";
class O {
  constructor(c) {
    m(this, "m_w", 123456789);
    m(this, "m_z", 987654321);
    m(this, "mask", 4294967295);
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
class A {
  /**
   * Generates a new branch
   * @param {THREE.Vector3} origin The starting point of the branch
   * @param {THREE.Euler} orientation The starting orientation of the branch
   * @param {number} length The length of the branch
   * @param {number} radius The radius of the branch at its starting point
   */
  constructor(c = new t.Vector3(), e = new t.Euler(), n = 0, s = 0, u = 0, l = 0, h = 0) {
    this.origin = c.clone(), this.orientation = e.clone(), this.length = n, this.radius = s, this.level = u, this.sectionCount = l, this.segmentCount = h;
  }
}
const C = {
  Birch: "birch",
  Oak: "oak",
  Pine: "pine",
  Willow: "willow"
}, V = {
  Single: "single",
  Double: "double"
}, T = {
  Ash: "ash",
  Aspen: "aspen",
  Beech: "beech",
  Evergreen: "evergreen",
  Oak: "oak"
}, B = {
  Ash: "ash",
  Aspen: "aspen",
  Beech: "beech",
  Pine: "pine",
  Oak: "oak"
}, M = {
  Deciduous: "deciduous",
  Evergreen: "evergreen"
};
class L {
  constructor() {
    this.seed = 0, this.type = M.Deciduous, this.bark = {
      // The bark texture
      type: C.Oak,
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
      type: T.Oak,
      // Whether to use single or double/perpendicular billboards
      billboard: V.Double,
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
const x = {
  bark: {
    birch: {
      ao: "../src/textures/bark/birch_ao_1k.jpg",
      color: "../src/textures/bark/birch_color_1k.jpg",
      height: "../src/textures/bark/birch_height_1k.jpg",
      normal: "../src/textures/bark/birch_normal_1k.jpg",
      roughness: "../src/textures/bark/birch_roughness_1k.jpg"
    },
    oak: {
      ao: "../src/textures/bark/oak_ao_1k.jpg",
      color: "../src/textures/bark/oak_color_1k.jpg",
      height: "../src/textures/bark/oak_height_1k.jpg",
      normal: "../src/textures/bark/oak_normal_1k.jpg",
      roughness: "../src/textures/bark/oak_roughness_1k.jpg"
    },
    pine: {
      ao: "../src/textures/bark/pine_ao_1k.jpg",
      color: "../src/textures/bark/pine_color_1k.jpg",
      height: "../src/textures/bark/pine_height_1k.jpg",
      normal: "../src/textures/bark/pine_normal_1k.jpg",
      roughness: "../src/textures/bark/pine_roughness_1k.jpg"
    },
    willow: {
      ao: "../src/textures/bark/willow_ao_1k.jpg",
      color: "../src/textures/bark/willow_color_1k.jpg",
      height: "../src/textures/bark/willow_height_1k.jpg",
      normal: "../src/textures/bark/willow_normal_1k.jpg",
      roughness: "../src/textures/bark/willow_roughness_1k.jpg"
    }
  },
  leaves: {
    ash: "../src/textures/leaves/ash.png",
    aspen: "../src/textures/leaves/aspen.png",
    beech: "../src/textures/leaves/beech.png",
    evergreen: "../src/textures/leaves/evergreen.png",
    oak: "../src/textures/leaves/oak.png"
  }
}, q = 31701, P = "deciduous", I = {
  type: "oak",
  tint: 13552830,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 3
  }
}, $ = {
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
}, G = {
  type: "ash",
  billboard: "double",
  angle: 55,
  count: 6,
  start: 0,
  size: 2.665,
  sizeVariance: 0.717,
  tint: 16777215,
  alphaTest: 0.5
}, D = {
  seed: q,
  type: P,
  bark: I,
  branch: $,
  leaves: G
}, R = 17124, U = "deciduous", W = {
  type: "oak",
  tint: 11902609,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 10
  }
}, N = {
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
}, H = {
  type: "oak",
  billboard: "double",
  angle: 10,
  count: 3,
  start: 0,
  size: 2.125,
  sizeVariance: 0.7,
  tint: 10546069,
  alphaTest: 0.5
}, J = {
  seed: R,
  type: U,
  bark: W,
  branch: N,
  leaves: H
}, K = 11744, X = "evergreen", Y = {
  type: "pine",
  tint: 16761758,
  flatShading: !1,
  textured: !0,
  textureScale: {
    x: 1,
    y: 1
  }
}, Z = {
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
}, ee = {
  type: "evergreen",
  billboard: "double",
  angle: 10,
  count: 21,
  start: 0,
  size: 0.965,
  sizeVariance: 0.7,
  tint: 16777215,
  alphaTest: 0.5
}, te = {
  seed: K,
  type: X,
  bark: Y,
  branch: Z,
  leaves: ee
};
function se(p) {
  switch (p) {
    case B.Ash:
      return D;
    case B.Oak:
      return J;
    case B.Pine:
      return te;
    default:
      return null;
  }
}
const z = {}, ne = new t.TextureLoader(), y = (p, c = { x: 1, y: 1 }, e = null) => {
  if (!z[p]) {
    const s = new URL(p, import.meta.url).href;
    z[p] = ne.load(s);
  }
  const n = z[p];
  return n.wrapS = t.MirroredRepeatWrapping, n.wrapT = t.MirroredRepeatWrapping, n.repeat.x = c.x, n.repeat.y = 1 / c.y, e && (n.colorSpace = e, n.premultiplyAlpha = !0), n;
};
class ie extends t.Group {
  /**
   * @param {TreeOptions} params
   */
  constructor(e = new L()) {
    super();
    /**
     * @type {RNG}
     */
    m(this, "rng");
    /**
     * @type {TreeOptions}
     */
    m(this, "options");
    /**
     * @type {Branch[]}
     */
    m(this, "branchQueue", []);
    this.branchesMesh = new t.Mesh(), this.leavesMesh = new t.Mesh(), this.add(this.branchesMesh), this.add(this.leavesMesh), this.options = e;
  }
  /**
   * Loads a preset tree from JSON 
   * @param {string} preset 
   */
  loadPreset(e) {
    this.options = se(e), this.generate();
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
    }, this.rng = new O(this.options.seed), this.branchQueue.push(
      new A(
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
    let s = e.orientation.clone(), u = e.origin.clone(), l = e.length / e.sectionCount / (this.options.type === "Deciduous" ? this.options.branch.levels - 1 : 1), h = [];
    for (let r = 0; r <= e.sectionCount; r++) {
      let a = e.radius;
      r === e.sectionCount && e.level === this.options.branch.levels ? a = 1e-3 : this.options.type === M.Deciduous ? a *= 1 - this.options.branch.taper[e.level] * (r / e.sectionCount) : this.options.type === M.Evergreen && (a *= 1 - r / e.sectionCount);
      let i;
      for (let d = 0; d < e.segmentCount; d++) {
        let b = 2 * Math.PI * d / e.segmentCount;
        const v = new t.Vector3(Math.cos(b), 0, Math.sin(b)).multiplyScalar(a).applyEuler(s).add(u), w = new t.Vector3(Math.cos(b), 0, Math.sin(b)).applyEuler(s).normalize(), _ = new t.Vector2(
          d / e.segmentCount,
          r % 2 === 0 ? 0 : 1
        );
        this.branches.verts.push(...Object.values(v)), this.branches.normals.push(...Object.values(w)), this.branches.uvs.push(...Object.values(_)), d === 0 && (i = { vertex: v, normal: w, uv: _ });
      }
      this.branches.verts.push(...Object.values(i.vertex)), this.branches.normals.push(...Object.values(i.normal)), this.branches.uvs.push(1, i.uv.y), h.push({
        origin: u.clone(),
        orientation: s.clone(),
        radius: a
      }), u.add(
        new t.Vector3(0, l, 0).applyEuler(s)
      );
      const o = Math.max(1, 1 / Math.sqrt(a)) * this.options.branch.gnarliness[e.level];
      s.x += this.rng.random(o, -o), s.z += this.rng.random(o, -o);
      const g = new t.Quaternion().setFromEuler(s), f = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        this.options.branch.twist[e.level]
      ), k = new t.Quaternion().setFromUnitVectors(
        new t.Vector3(0, 1, 0),
        new t.Vector3().copy(this.options.branch.force.direction)
      );
      g.multiply(f), g.rotateTowards(
        k,
        this.options.branch.force.strength / a
      ), s.setFromQuaternion(g);
    }
    if (this.generateBranchIndices(n, e), this.options.type === "deciduous") {
      const r = h[h.length - 1];
      e.level < this.options.branch.levels ? this.branchQueue.push(
        new A(
          r.origin,
          r.orientation,
          this.options.branch.length[e.level + 1],
          r.radius,
          e.level + 1,
          // Section count and segment count must be same as parent branch
          // since the child branch is growing from the end of the parent branch
          e.sectionCount,
          e.segmentCount
        )
      ) : this.generateLeaf(r.origin, r.orientation);
    }
    e.level === this.options.branch.levels ? this.generateLeaves(h) : e.level < this.options.branch.levels && this.generateChildBranches(
      this.options.branch.children[e.level],
      e.level + 1,
      h
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
    for (let l = 0; l < e; l++) {
      let h = this.rng.random(1, this.options.branch.start[n]);
      const r = Math.floor(h * (s.length - 1));
      let a, i;
      a = s[r], r === s.length - 1 ? i = a : i = s[r + 1];
      const o = (h - r / (s.length - 1)) / (1 / (s.length - 1)), g = new t.Vector3().lerpVectors(
        a.origin,
        i.origin,
        o
      ), f = this.options.branch.radius[n] * ((1 - o) * a.radius + o * i.radius), k = new t.Quaternion().setFromEuler(a.orientation), d = new t.Quaternion().setFromEuler(i.orientation), b = new t.Euler().setFromQuaternion(
        d.slerp(k, o)
      ), v = 2 * Math.PI * (u + l / e), w = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.options.branch.angle[n] / (180 / Math.PI)
      ), _ = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        v
      ), S = new t.Quaternion().setFromEuler(b), j = new t.Euler().setFromQuaternion(
        S.multiply(_.multiply(w))
      );
      let E = this.options.branch.length[n] * (this.options.type === M.Evergreen ? 1 - h : 1);
      this.branchQueue.push(
        new A(
          g,
          j,
          E,
          f,
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
      const l = Math.floor(u * (e.length - 1));
      let h, r;
      h = e[l], l === e.length - 1 ? r = h : r = e[l + 1];
      const a = (u - l / (e.length - 1)) / (1 / (e.length - 1)), i = new t.Vector3().lerpVectors(
        h.origin,
        r.origin,
        a
      ), o = new t.Quaternion().setFromEuler(h.orientation), g = new t.Quaternion().setFromEuler(r.orientation), f = new t.Euler().setFromQuaternion(
        g.slerp(o, a)
      ), k = 2 * Math.PI * (n + s / this.options.leaves.count), d = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.options.leaves.angle / (180 / Math.PI)
      ), b = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        k
      ), v = new t.Quaternion().setFromEuler(f), w = new t.Euler().setFromQuaternion(
        v.multiply(b.multiply(d))
      );
      this.generateLeaf(i, w);
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
    const l = u, h = 1.5 * u, r = (a) => {
      const i = [
        new t.Vector3(-l / 2, h, 0),
        new t.Vector3(-l / 2, 0, 0),
        new t.Vector3(l / 2, 0, 0),
        new t.Vector3(l / 2, h, 0)
      ].map(
        (g) => g.applyEuler(new t.Euler(0, a, 0)).applyEuler(n).add(e)
      );
      this.leaves.verts.push(
        i[0].x,
        i[0].y,
        i[0].z,
        i[1].x,
        i[1].y,
        i[1].z,
        i[2].x,
        i[2].y,
        i[2].z,
        i[3].x,
        i[3].y,
        i[3].z
      );
      const o = new t.Vector3(0, 0, 1).applyEuler(n);
      this.leaves.normals.push(
        o.x,
        o.y,
        o.z,
        o.x,
        o.y,
        o.z,
        o.x,
        o.y,
        o.z,
        o.x,
        o.y,
        o.z
      ), this.leaves.uvs.push(0, 1, 0, 0, 1, 0, 1, 1), this.leaves.indices.push(s, s + 1, s + 2, s, s + 2, s + 3), s += 4;
    };
    r(0), this.options.leaves.billboard === V.Double && r(Math.PI / 2);
  }
  /**
   * Generates the indices for branch geometry
   * @param {Branch} branch
   */
  generateBranchIndices(e, n) {
    let s, u, l, h;
    const r = n.segmentCount + 1;
    for (let a = 0; a < n.sectionCount; a++)
      for (let i = 0; i < n.segmentCount; i++)
        s = e + a * r + i, u = e + a * r + (i + 1), l = s + r, h = u + r, this.branches.indices.push(s, l, u, u, l, h);
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
      this.branchesMesh.material.aoMap = y(x.bark[this.options.bark.type].ao, s), this.branchesMesh.material.map = y(x.bark[this.options.bark.type].color, s), this.branchesMesh.material.normalMap = y(x.bark[this.options.bark.type].normal, s), this.branchesMesh.material.roughnessMap = y(x.bark[this.options.bark.type].roughness, s);
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
      alphaTest: this.options.leaves.alphaTest
    });
    this.leavesMesh.geometry.dispose(), this.leavesMesh.geometry = e, this.leavesMesh.material.dispose(), this.leavesMesh.material = n, this.leavesMesh.material.map = y(
      x.leaves[this.options.leaves.type],
      new t.Vector2(1, 1),
      t.SRGBColorSpace
    ), this.leavesMesh.castShadow = !0, this.leavesMesh.receiveShadow = !0;
  }
}
export {
  C as BarkType,
  V as Billboard,
  T as LeafType,
  B as Presets,
  ie as Tree,
  M as TreeType
};
//# sourceMappingURL=@dgreenheck-tree-js.es.js.map
