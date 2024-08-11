var Q = Object.defineProperty;
var S = (p, c, e) => c in p ? Q(p, c, { enumerable: !0, configurable: !0, writable: !0, value: e }) : p[c] = e;
var d = (p, c, e) => (S(p, typeof c != "symbol" ? c + "" : c, e), e);
import * as t from "three";
class z {
  constructor(c) {
    d(this, "m_w", 123456789);
    d(this, "m_z", 987654321);
    d(this, "mask", 4294967295);
    this.m_w = 123456789 + c & this.mask, this.m_z = 987654321 - c & this.mask;
  }
  /**
   * Returns a random number between min and max
   */
  random(c = 1, e = 0) {
    this.m_z = 36969 * (this.m_z & 65535) + (this.m_z >> 16) & this.mask, this.m_w = 18e3 * (this.m_w & 65535) + (this.m_w >> 16) & this.mask;
    let r = (this.m_z << 16) + (this.m_w & 65535) >>> 0;
    return r /= 4294967296, (c - e) * r + e;
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
  constructor(c = new t.Vector3(), e = new t.Euler(), r = 0, s = 0, u = 0, l = 0, h = 0) {
    this.origin = c.clone(), this.orientation = e.clone(), this.length = r, this.radius = s, this.level = u, this.sectionCount = l, this.segmentCount = h;
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
}, O = {
  Ash: "ash",
  Aspen: "aspen",
  Beech: "beech",
  Evergreen: "evergreen",
  Oak: "oak"
}, M = {
  Deciduous: "deciduous",
  Evergreen: "evergreen"
}, L = {
  seed: 0,
  type: M.Deciduous,
  // Bark parameters
  bark: {
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
  },
  // Branch parameters
  branch: {
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
    // Amount of curling/twisting  at each branch level
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
  },
  // Leaf parameters
  leaves: {
    // Leaf texture to use
    type: O.Oak,
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
  }
}, _ = {
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
}, T = {
  ash: "../src/textures/leaves/ash.png",
  aspen: "../src/textures/leaves/aspen.png",
  beech: "../src/textures/leaves/beech.png",
  evergreen: "../src/textures/leaves/evergreen.png",
  oak: "../src/textures/leaves/oak.png"
}, B = {}, q = new t.TextureLoader(), x = (p, c = { x: 1, y: 1 }, e = null) => {
  if (!B[p]) {
    const s = new URL(p, import.meta.url).href;
    B[p] = q.load(s);
  }
  const r = B[p];
  return r.wrapS = t.MirroredRepeatWrapping, r.wrapT = t.MirroredRepeatWrapping, r.repeat.x = c.x, r.repeat.y = 1 / c.y, e && (r.colorSpace = e, r.premultiplyAlpha = !0), r;
};
class G extends t.Group {
  /**
   * @param {TreeParams} params
   */
  constructor(e = L) {
    super();
    /**
     * @type {RNG}
     */
    d(this, "rng");
    /**
     * @type {TreeParams}
     */
    d(this, "params");
    /**
     * @type {Branch[]}
     */
    d(this, "branchQueue", []);
    this.params = e, this.branchesMesh = new t.Mesh(), this.leavesMesh = new t.Mesh(), this.add(this.branchesMesh), this.add(this.leavesMesh);
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
    }, this.rng = new z(this.params.seed), this.branchQueue.push(
      new A(
        new t.Vector3(),
        new t.Euler(),
        this.params.branch.length[0],
        this.params.branch.radius[0],
        0,
        this.params.branch.sections[0],
        this.params.branch.segments[0]
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
    const r = this.branches.verts.length / 3;
    let s = e.orientation.clone(), u = e.origin.clone(), l = e.length / e.sectionCount / (this.params.type === "Deciduous" ? this.params.branch.levels - 1 : 1), h = [];
    for (let a = 0; a <= e.sectionCount; a++) {
      let o = e.radius;
      a === e.sectionCount && e.level === this.params.branch.levels ? o = 1e-3 : this.params.type === M.Deciduous ? o *= 1 - this.params.branch.taper[e.level] * (a / e.sectionCount) : this.params.type === M.Evergreen && (o *= 1 - a / e.sectionCount);
      let n;
      for (let g = 0; g < e.segmentCount; g++) {
        let w = 2 * Math.PI * g / e.segmentCount;
        const b = new t.Vector3(Math.cos(w), 0, Math.sin(w)).multiplyScalar(o).applyEuler(s).add(u), v = new t.Vector3(Math.cos(w), 0, Math.sin(w)).applyEuler(s).normalize(), y = new t.Vector2(
          g / e.segmentCount,
          a % 2 === 0 ? 0 : 1
        );
        this.branches.verts.push(...Object.values(b)), this.branches.normals.push(...Object.values(v)), this.branches.uvs.push(...Object.values(y)), g === 0 && (n = { vertex: b, normal: v, uv: y });
      }
      this.branches.verts.push(...Object.values(n.vertex)), this.branches.normals.push(...Object.values(n.normal)), this.branches.uvs.push(1, n.uv.y), h.push({
        origin: u.clone(),
        orientation: s.clone(),
        radius: o
      }), u.add(
        new t.Vector3(0, l, 0).applyEuler(s)
      );
      const i = Math.max(1, 1 / Math.sqrt(o)) * this.params.branch.gnarliness[e.level];
      s.x += this.rng.random(i, -i), s.z += this.rng.random(i, -i);
      const m = new t.Quaternion().setFromEuler(s), f = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        this.params.branch.twist[e.level]
      ), k = new t.Quaternion().setFromUnitVectors(
        new t.Vector3(0, 1, 0),
        new t.Vector3().copy(this.params.branch.force.direction)
      );
      m.multiply(f), m.rotateTowards(
        k,
        this.params.branch.force.strength / o
      ), s.setFromQuaternion(m);
    }
    if (this.generateBranchIndices(r, e), this.params.type === "deciduous") {
      const a = h[h.length - 1];
      e.level < this.params.branch.levels ? this.branchQueue.push(
        new A(
          a.origin,
          a.orientation,
          this.params.branch.length[e.level + 1],
          a.radius,
          e.level + 1,
          // Section count and segment count must be same as parent branch
          // since the child branch is growing from the end of the parent branch
          e.sectionCount,
          e.segmentCount
        )
      ) : this.generateLeaf(a.origin, a.orientation);
    }
    e.level === this.params.branch.levels ? this.generateLeaves(h) : e.level < this.params.branch.levels && this.generateChildBranches(
      this.params.branch.children[e.level],
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
  generateChildBranches(e, r, s) {
    const u = this.rng.random();
    for (let l = 0; l < e; l++) {
      let h = this.rng.random(1, this.params.branch.start[r]);
      const a = Math.floor(h * (s.length - 1));
      let o, n;
      o = s[a], a === s.length - 1 ? n = o : n = s[a + 1];
      const i = (h - a / (s.length - 1)) / (1 / (s.length - 1)), m = new t.Vector3().lerpVectors(
        o.origin,
        n.origin,
        i
      ), f = this.params.branch.radius[r] * ((1 - i) * o.radius + i * n.radius), k = new t.Quaternion().setFromEuler(o.orientation), g = new t.Quaternion().setFromEuler(n.orientation), w = new t.Euler().setFromQuaternion(
        g.slerp(k, i)
      ), b = 2 * Math.PI * (u + l / e), v = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.params.branch.angle[r] / (180 / Math.PI)
      ), y = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        b
      ), j = new t.Quaternion().setFromEuler(w), E = new t.Euler().setFromQuaternion(
        j.multiply(y.multiply(v))
      );
      let F = this.params.branch.length[r] * (this.params.type === M.Evergreen ? 1 - h : 1);
      this.branchQueue.push(
        new A(
          m,
          E,
          F,
          f,
          r,
          this.params.branch.sections[r],
          this.params.branch.segments[r]
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
    const r = this.rng.random();
    for (let s = 0; s < this.params.leaves.count; s++) {
      let u = this.rng.random(1, this.params.leaves.start);
      const l = Math.floor(u * (e.length - 1));
      let h, a;
      h = e[l], l === e.length - 1 ? a = h : a = e[l + 1];
      const o = (u - l / (e.length - 1)) / (1 / (e.length - 1)), n = new t.Vector3().lerpVectors(
        h.origin,
        a.origin,
        o
      ), i = new t.Quaternion().setFromEuler(h.orientation), m = new t.Quaternion().setFromEuler(a.orientation), f = new t.Euler().setFromQuaternion(
        m.slerp(i, o)
      ), k = 2 * Math.PI * (r + s / this.params.leaves.count), g = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.params.leaves.angle / (180 / Math.PI)
      ), w = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        k
      ), b = new t.Quaternion().setFromEuler(f), v = new t.Euler().setFromQuaternion(
        b.multiply(w.multiply(g))
      );
      this.generateLeaf(n, v);
    }
  }
  /**
  * Generates a leaves
  * @param {THREE.Vector3} origin The starting point of the branch
  * @param {THREE.Euler} orientation The starting orientation of the branch
  */
  generateLeaf(e, r) {
    let s = this.leaves.verts.length / 3, u = this.params.leaves.size * (1 + this.rng.random(
      this.params.leaves.sizeVariance,
      -this.params.leaves.sizeVariance
    ));
    const l = u, h = 1.5 * u, a = (o) => {
      const n = [
        new t.Vector3(-l / 2, h, 0),
        new t.Vector3(-l / 2, 0, 0),
        new t.Vector3(l / 2, 0, 0),
        new t.Vector3(l / 2, h, 0)
      ].map(
        (m) => m.applyEuler(new t.Euler(0, o, 0)).applyEuler(r).add(e)
      );
      this.leaves.verts.push(
        n[0].x,
        n[0].y,
        n[0].z,
        n[1].x,
        n[1].y,
        n[1].z,
        n[2].x,
        n[2].y,
        n[2].z,
        n[3].x,
        n[3].y,
        n[3].z
      );
      const i = new t.Vector3(0, 0, 1).applyEuler(r);
      this.leaves.normals.push(
        i.x,
        i.y,
        i.z,
        i.x,
        i.y,
        i.z,
        i.x,
        i.y,
        i.z,
        i.x,
        i.y,
        i.z
      ), this.leaves.uvs.push(0, 1, 0, 0, 1, 0, 1, 1), this.leaves.indices.push(s, s + 1, s + 2, s, s + 2, s + 3), s += 4;
    };
    a(0), this.params.leaves.billboard === V.Double && a(Math.PI / 2);
  }
  /**
   * Generates the indices for branch geometry
   * @param {Branch} branch
   */
  generateBranchIndices(e, r) {
    let s, u, l, h;
    const a = r.segmentCount + 1;
    for (let o = 0; o < r.sectionCount; o++)
      for (let n = 0; n < r.segmentCount; n++)
        s = e + o * a + n, u = e + o * a + (n + 1), l = s + a, h = u + a, this.branches.indices.push(s, l, u, u, l, h);
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
    const r = new t.MeshStandardMaterial({
      name: "branches",
      flatShading: this.params.bark.flatShading,
      color: this.params.bark.tint
    });
    if (this.branchesMesh.geometry.dispose(), this.branchesMesh.geometry = e, this.branchesMesh.material.dispose(), this.branchesMesh.material = r, this.branchesMesh.castShadow = !0, this.branchesMesh.receiveShadow = !0, this.params.bark.textured) {
      const s = this.params.bark.textureScale;
      this.branchesMesh.material.aoMap = x(_[this.params.bark.type].ao, s), this.branchesMesh.material.map = x(_[this.params.bark.type].color, s), this.branchesMesh.material.normalMap = x(_[this.params.bark.type].normal, s), this.branchesMesh.material.roughnessMap = x(_[this.params.bark.type].roughness, s);
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
    const r = new t.MeshStandardMaterial({
      name: "leaves",
      color: this.params.leaves.tint,
      side: t.DoubleSide,
      alphaTest: this.params.leaves.alphaTest
    });
    this.leavesMesh.geometry.dispose(), this.leavesMesh.geometry = e, this.leavesMesh.material.dispose(), this.leavesMesh.material = r, this.leavesMesh.material.map = x(
      T[this.params.leaves.type],
      new t.Vector2(1, 1),
      t.SRGBColorSpace
    ), this.leavesMesh.castShadow = !0, this.leavesMesh.receiveShadow = !0;
  }
}
export {
  C as BarkType,
  V as Billboard,
  O as LeafType,
  G as Tree,
  M as TreeType
};
//# sourceMappingURL=@dgreenheck-tree-js.es.js.map
