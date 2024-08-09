var Q = Object.defineProperty;
var z = (p, u, e) => u in p ? Q(p, u, { enumerable: !0, configurable: !0, writable: !0, value: e }) : p[u] = e;
var d = (p, u, e) => (z(p, typeof u != "symbol" ? u + "" : u, e), e);
import * as t from "three";
class S {
  constructor(u) {
    d(this, "m_w", 123456789);
    d(this, "m_z", 987654321);
    d(this, "mask", 4294967295);
    this.m_w = 123456789 + u & this.mask, this.m_z = 987654321 - u & this.mask;
  }
  /**
   * Returns a random number between min and max
   */
  random(u = 1, e = 0) {
    this.m_z = 36969 * (this.m_z & 65535) + (this.m_z >> 16) & this.mask, this.m_w = 18e3 * (this.m_w & 65535) + (this.m_w >> 16) & this.mask;
    let r = (this.m_z << 16) + (this.m_w & 65535) >>> 0;
    return r /= 4294967296, (u - e) * r + e;
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
  constructor(u = new t.Vector3(), e = new t.Euler(), r = 0, s = 0, c = 0, l = 0, h = 0) {
    this.origin = u.clone(), this.orientation = e.clone(), this.length = r, this.radius = s, this.level = c, this.sectionCount = l, this.segmentCount = h;
  }
}
const I = {
  Birch: "birch",
  Oak: "oak",
  Pine: "pine",
  Willow: "willow"
}, V = {
  Single: "single",
  Double: "double"
}, C = {
  Ash: "ash",
  Aspen: "aspen",
  Beech: "beech",
  Evergreen: "evergreen",
  Oak: "oak"
}, M = {
  Deciduous: "deciduous",
  Evergreen: "evergreen"
}, O = {
  seed: 0,
  type: M.Deciduous,
  // Tint of the tree trunk
  tint: 16777215,
  // Use face normals for shading instead of vertex normals
  flatShading: !1,
  // Apply texture to bark
  textured: !0,
  // Number of branch recursion levels. 0 = trunk only
  levels: 3,
  // Bark parameters
  bark: {
    // The bark texture
    type: "oak",
    // Texture scale
    scale: 1
  },
  // Branch parameters
  branch: {
    // Angle of the child branches relative to the parent branch (degrees)
    angle: {
      1: 60,
      2: 60,
      3: 60
    },
    // Number of children per branch level
    children: {
      0: 7,
      1: 4,
      2: 4
    },
    // External force encouraging tree growth in a particular direction
    force: {
      direction: { x: 0, y: 1, z: 0 },
      strength: 0.01
    },
    // Amount of curling/twisting  at each branch level
    gnarliness: {
      0: 0.2,
      1: 0.2,
      2: 0.05,
      3: 0.02
    },
    // Length of each branch level
    length: {
      0: 20,
      1: 15,
      2: 5,
      3: 1
    },
    // Radius of each branch level
    radius: {
      0: 0.7,
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
      1: 0.5,
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
    type: C.Oak,
    // Whether to use single or double/perpendicular billboards
    billboard: V.Double,
    // Angle of leaves relative to parent branch (degrees)
    angle: 30,
    // Number of leaves
    count: 3,
    // Where leaves start to grow on the length of the branch (0 to 1)
    start: 0,
    // Size of the leaves
    size: 1.75,
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
}, L = {
  ash: "../src/textures/leaves/ash.png",
  aspen: "../src/textures/leaves/aspen.png",
  beech: "../src/textures/leaves/beech.png",
  evergreen: "../src/textures/leaves/evergreen.png",
  oak: "../src/textures/leaves/oak.png"
}, B = {}, T = new t.TextureLoader(), x = (p, u = new t.Vector2(1, 1)) => {
  if (B[p]) {
    const e = B[p];
    return e.wrapS = t.MirroredRepeatWrapping, e.wrapT = t.MirroredRepeatWrapping, e;
  } else {
    const e = new URL(p, import.meta.url).href, r = T.load(e);
    return B[p] = r, r;
  }
};
class D extends t.Group {
  /**
   * @param {TreeParams} params
   */
  constructor(e = O) {
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
  async generate() {
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
    }, this.rng = new S(this.params.seed), this.branchQueue.push(
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
    let s = e.orientation.clone(), c = e.origin.clone(), l = e.length / e.sectionCount / (this.params.type === "Deciduous" ? this.params.levels - 1 : 1), h = [];
    for (let a = 0; a <= e.sectionCount; a++) {
      let o = e.radius;
      a === e.sectionCount && e.level === this.params.levels ? o = 1e-3 : this.params.type === M.Deciduous ? o *= 1 - this.params.branch.taper[e.level] * (a / e.sectionCount) : this.params.type === M.Evergreen && (o *= 1 - a / e.sectionCount);
      let n;
      for (let g = 0; g < e.segmentCount; g++) {
        let w = 2 * Math.PI * g / e.segmentCount;
        const v = new t.Vector3(Math.cos(w), 0, Math.sin(w)).multiplyScalar(o).applyEuler(s).add(c), b = new t.Vector3(Math.cos(w), 0, Math.sin(w)).applyEuler(s).normalize(), y = new t.Vector2(
          g / e.segmentCount,
          a % 2 === 0 ? 0 : 1
        );
        this.branches.verts.push(...Object.values(v)), this.branches.normals.push(...Object.values(b)), this.branches.uvs.push(...Object.values(y)), g === 0 && (n = { vertex: v, normal: b, uv: y });
      }
      this.branches.verts.push(...Object.values(n.vertex)), this.branches.normals.push(...Object.values(n.normal)), this.branches.uvs.push(1, n.uv.y), h.push({
        origin: c.clone(),
        orientation: s.clone(),
        radius: o
      }), c.add(
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
      e.level < this.params.levels ? this.branchQueue.push(
        new A(
          a.origin,
          a.orientation,
          this.params.branch.length[e.level + 1] / 2,
          a.radius,
          e.level + 1,
          // Section count and segment count must be same as parent branch
          // since the child branch is growing from the end of the parent branch
          e.sectionCount,
          e.segmentCount
        )
      ) : this.generateLeaf(a.origin, a.orientation);
    }
    e.level === this.params.levels ? this.generateLeaves(h) : e.level < this.params.levels && this.generateChildBranches(
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
    const c = this.rng.random();
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
      ), v = 2 * Math.PI * (c + l / e), b = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(1, 0, 0),
        this.params.branch.angle[r] / (180 / Math.PI)
      ), y = new t.Quaternion().setFromAxisAngle(
        new t.Vector3(0, 1, 0),
        v
      ), j = new t.Quaternion().setFromEuler(w), E = new t.Euler().setFromQuaternion(
        j.multiply(y.multiply(b))
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
      let c = this.rng.random(1, this.params.leaves.start);
      const l = Math.floor(c * (e.length - 1));
      let h, a;
      h = e[l], l === e.length - 1 ? a = h : a = e[l + 1];
      const o = (c - l / (e.length - 1)) / (1 / (e.length - 1)), n = new t.Vector3().lerpVectors(
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
      ), v = new t.Quaternion().setFromEuler(f), b = new t.Euler().setFromQuaternion(
        v.multiply(w.multiply(g))
      );
      this.generateLeaf(n, b);
    }
  }
  /**
  * Generates a leaves
  * @param {THREE.Vector3} origin The starting point of the branch
  * @param {THREE.Euler} orientation The starting orientation of the branch
  */
  generateLeaf(e, r) {
    let s = this.leaves.verts.length / 3, c = this.params.leaves.size * (1 + this.rng.random(
      this.params.leaves.sizeVariance,
      -this.params.leaves.sizeVariance
    ));
    const l = c, h = 1.5 * c, a = (o) => {
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
    let s, c, l, h;
    const a = r.segmentCount + 1;
    for (let o = 0; o < r.sectionCount; o++)
      for (let n = 0; n < r.segmentCount; n++)
        s = e + o * a + n, c = e + o * a + (n + 1), l = s + a, h = c + a, this.branches.indices.push(s, l, c, c, l, h);
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
      flatShading: this.params.flatShading,
      color: this.params.tint
    });
    this.branchesMesh.geometry.dispose(), this.branchesMesh.geometry = e, this.branchesMesh.material.dispose(), this.branchesMesh.material = r, this.branchesMesh.castShadow = !0, this.branchesMesh.receiveShadow = !0, this.params.textured && (this.branchesMesh.material.aoMap = x(_[this.params.bark.type].ao, this.params.bark.scale), this.branchesMesh.material.map = x(_[this.params.bark.type].color, this.params.bark.scale), this.branchesMesh.material.normalMap = x(_[this.params.bark.type].normal, this.params.bark.scale), this.branchesMesh.material.roughnessMap = x(_[this.params.bark.type].roughness, this.params.bark.scale));
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
    this.leavesMesh.geometry.dispose(), this.leavesMesh.geometry = e, this.leavesMesh.material.dispose(), this.leavesMesh.material = r, this.leavesMesh.material.map = x(L[this.params.leaves.type]), this.leavesMesh.castShadow = !0, this.leavesMesh.receiveShadow = !0;
  }
}
export {
  I as BarkType,
  V as Billboard,
  C as LeafType,
  D as Tree,
  M as TreeType
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGRncmVlbmhlY2stdHJlZS1qcy5lcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3JuZy5qcyIsIi4uL3NyYy9icmFuY2guanMiLCIuLi9zcmMvZW51bXMuanMiLCIuLi9zcmMvdHJlZVBhcmFtcy5qcyIsIi4uL3NyYy90cmVlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJORyB7XG4gIG1fdyA9IDEyMzQ1Njc4OTtcbiAgbV96ID0gOTg3NjU0MzIxO1xuICBtYXNrID0gMHhmZmZmZmZmZjtcblxuICBjb25zdHJ1Y3RvcihzZWVkKSB7XG4gICAgdGhpcy5tX3cgPSAoMTIzNDU2Nzg5ICsgc2VlZCkgJiB0aGlzLm1hc2s7XG4gICAgdGhpcy5tX3ogPSAoOTg3NjU0MzIxIC0gc2VlZCkgJiB0aGlzLm1hc2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiBtaW4gYW5kIG1heFxuICAgKi9cbiAgcmFuZG9tKG1heCA9IDEsIG1pbiA9IDApIHtcbiAgICB0aGlzLm1feiA9ICgzNjk2OSAqICh0aGlzLm1feiAmIDY1NTM1KSArICh0aGlzLm1feiA+PiAxNikpICYgdGhpcy5tYXNrO1xuICAgIHRoaXMubV93ID0gKDE4MDAwICogKHRoaXMubV93ICYgNjU1MzUpICsgKHRoaXMubV93ID4+IDE2KSkgJiB0aGlzLm1hc2s7XG4gICAgbGV0IHJlc3VsdCA9ICgodGhpcy5tX3ogPDwgMTYpICsgKHRoaXMubV93ICYgNjU1MzUpKSA+Pj4gMDtcbiAgICByZXN1bHQgLz0gNDI5NDk2NzI5NjtcblxuICAgIHJldHVybiAobWF4IC0gbWluKSAqIHJlc3VsdCArIG1pbjtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuXG5leHBvcnQgY2xhc3MgQnJhbmNoIHtcbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIG5ldyBicmFuY2hcbiAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IzfSBvcmlnaW4gVGhlIHN0YXJ0aW5nIHBvaW50IG9mIHRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtUSFJFRS5FdWxlcn0gb3JpZW50YXRpb24gVGhlIHN0YXJ0aW5nIG9yaWVudGF0aW9uIG9mIHRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyBUaGUgcmFkaXVzIG9mIHRoZSBicmFuY2ggYXQgaXRzIHN0YXJ0aW5nIHBvaW50XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBvcmlnaW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuICAgIG9yaWVudGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCksXG4gICAgbGVuZ3RoID0gMCxcbiAgICByYWRpdXMgPSAwLFxuICAgIGxldmVsID0gMCxcbiAgICBzZWN0aW9uQ291bnQgPSAwLFxuICAgIHNlZ21lbnRDb3VudCA9IDAsXG4gICkge1xuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luLmNsb25lKCk7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uLmNsb25lKCk7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMuc2VjdGlvbkNvdW50ID0gc2VjdGlvbkNvdW50O1xuICAgIHRoaXMuc2VnbWVudENvdW50ID0gc2VnbWVudENvdW50O1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgQmFya1R5cGUgPSB7XG4gIEJpcmNoOiAnYmlyY2gnLFxuICBPYWs6ICdvYWsnLFxuICBQaW5lOiAncGluZScsXG4gIFdpbGxvdzogJ3dpbGxvdydcbn07XG5cbmV4cG9ydCBjb25zdCBCaWxsYm9hcmQgPSB7XG4gIFNpbmdsZTogJ3NpbmdsZScsXG4gIERvdWJsZTogJ2RvdWJsZScsXG59O1xuXG5leHBvcnQgY29uc3QgTGVhZlR5cGUgPSB7XG4gIEFzaDogJ2FzaCcsXG4gIEFzcGVuOiAnYXNwZW4nLFxuICBCZWVjaDogJ2JlZWNoJyxcbiAgRXZlcmdyZWVuOiAnZXZlcmdyZWVuJyxcbiAgT2FrOiAnb2FrJyxcbn07XG5cbmV4cG9ydCBjb25zdCBUcmVlVHlwZSA9IHtcbiAgRGVjaWR1b3VzOiAnZGVjaWR1b3VzJyxcbiAgRXZlcmdyZWVuOiAnZXZlcmdyZWVuJyxcbn07IiwiaW1wb3J0IHsgQmlsbGJvYXJkLCBMZWFmVHlwZSwgVHJlZVR5cGUgfSBmcm9tICcuL2VudW1zJ1xuXG5leHBvcnQgY29uc3QgVHJlZVBhcmFtcyA9IHtcbiAgc2VlZDogMCxcbiAgdHlwZTogVHJlZVR5cGUuRGVjaWR1b3VzLFxuXG4gIC8vIFRpbnQgb2YgdGhlIHRyZWUgdHJ1bmtcbiAgdGludDogMHhmZmZmZmYsXG5cbiAgLy8gVXNlIGZhY2Ugbm9ybWFscyBmb3Igc2hhZGluZyBpbnN0ZWFkIG9mIHZlcnRleCBub3JtYWxzXG4gIGZsYXRTaGFkaW5nOiBmYWxzZSxcblxuICAvLyBBcHBseSB0ZXh0dXJlIHRvIGJhcmtcbiAgdGV4dHVyZWQ6IHRydWUsXG5cbiAgLy8gTnVtYmVyIG9mIGJyYW5jaCByZWN1cnNpb24gbGV2ZWxzLiAwID0gdHJ1bmsgb25seVxuICBsZXZlbHM6IDMsXG5cbiAgLy8gQmFyayBwYXJhbWV0ZXJzXG4gIGJhcms6IHtcbiAgICAvLyBUaGUgYmFyayB0ZXh0dXJlXG4gICAgdHlwZTogJ29haycsXG5cbiAgICAvLyBUZXh0dXJlIHNjYWxlXG4gICAgc2NhbGU6IDFcbiAgfSxcblxuICAvLyBCcmFuY2ggcGFyYW1ldGVyc1xuICBicmFuY2g6IHtcblxuICAgIC8vIEFuZ2xlIG9mIHRoZSBjaGlsZCBicmFuY2hlcyByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGJyYW5jaCAoZGVncmVlcylcbiAgICBhbmdsZToge1xuICAgICAgMTogNjAsXG4gICAgICAyOiA2MCxcbiAgICAgIDM6IDYwXG4gICAgfSxcblxuICAgIC8vIE51bWJlciBvZiBjaGlsZHJlbiBwZXIgYnJhbmNoIGxldmVsXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIDA6IDcsXG4gICAgICAxOiA0LFxuICAgICAgMjogNFxuICAgIH0sXG5cbiAgICAvLyBFeHRlcm5hbCBmb3JjZSBlbmNvdXJhZ2luZyB0cmVlIGdyb3d0aCBpbiBhIHBhcnRpY3VsYXIgZGlyZWN0aW9uXG4gICAgZm9yY2U6IHtcbiAgICAgIGRpcmVjdGlvbjogeyB4OiAwLCB5OiAxLCB6OiAwIH0sXG4gICAgICBzdHJlbmd0aDogMC4wMSxcbiAgICB9LFxuXG4gICAgLy8gQW1vdW50IG9mIGN1cmxpbmcvdHdpc3RpbmcgIGF0IGVhY2ggYnJhbmNoIGxldmVsXG4gICAgZ25hcmxpbmVzczoge1xuICAgICAgMDogMC4yLFxuICAgICAgMTogMC4yLFxuICAgICAgMjogMC4wNSxcbiAgICAgIDM6IDAuMDIsXG4gICAgfSxcblxuICAgIC8vIExlbmd0aCBvZiBlYWNoIGJyYW5jaCBsZXZlbFxuICAgIGxlbmd0aDoge1xuICAgICAgMDogMjAsXG4gICAgICAxOiAxNSxcbiAgICAgIDI6IDUsXG4gICAgICAzOiAxXG4gICAgfSxcblxuICAgIC8vIFJhZGl1cyBvZiBlYWNoIGJyYW5jaCBsZXZlbFxuICAgIHJhZGl1czoge1xuICAgICAgMDogMC43LFxuICAgICAgMTogMC43LFxuICAgICAgMjogMC43LFxuICAgICAgMzogMC43XG4gICAgfSxcblxuICAgIC8vIE51bWJlciBvZiBzZWN0aW9ucyBwZXIgYnJhbmNoIGxldmVsXG4gICAgc2VjdGlvbnM6IHtcbiAgICAgIDA6IDEyLFxuICAgICAgMTogMTAsXG4gICAgICAyOiA4LFxuICAgICAgMzogNixcbiAgICB9LFxuXG4gICAgLy8gTnVtYmVyIG9mIHJhZGlhbCBzZWdtZW50cyBwZXIgYnJhbmNoIGxldmVsXG4gICAgc2VnbWVudHM6IHtcbiAgICAgIDA6IDgsXG4gICAgICAxOiA2LFxuICAgICAgMjogNCxcbiAgICAgIDM6IDMsXG4gICAgfSxcblxuICAgIC8vIERlZmluZXMgd2hlcmUgY2hpbGQgYnJhbmNoZXMgc3RhcnQgZm9ybWluZyBvbiB0aGUgcGFyZW50IGJyYW5jaFxuICAgIHN0YXJ0OiB7XG4gICAgICAxOiAwLjUsXG4gICAgICAyOiAwLjMsXG4gICAgICAzOiAwLjNcbiAgICB9LFxuXG4gICAgLy8gVGFwZXIgYXQgZWFjaCBicmFuY2ggbGV2ZWxcbiAgICB0YXBlcjoge1xuICAgICAgMDogMC43LFxuICAgICAgMTogMC43LFxuICAgICAgMjogMC43LFxuICAgICAgMzogMC43LFxuICAgIH0sXG5cbiAgICAvLyBBbW91bnQgb2YgdHdpc3QgYXQgZWFjaCBicmFuY2ggbGV2ZWxcbiAgICB0d2lzdDoge1xuICAgICAgMDogMCxcbiAgICAgIDE6IDAsXG4gICAgICAyOiAwLFxuICAgICAgMzogMCxcbiAgICB9LFxuICB9LFxuXG4gIC8vIExlYWYgcGFyYW1ldGVyc1xuICBsZWF2ZXM6IHtcbiAgICAvLyBMZWFmIHRleHR1cmUgdG8gdXNlXG4gICAgdHlwZTogTGVhZlR5cGUuT2FrLFxuXG4gICAgLy8gV2hldGhlciB0byB1c2Ugc2luZ2xlIG9yIGRvdWJsZS9wZXJwZW5kaWN1bGFyIGJpbGxib2FyZHNcbiAgICBiaWxsYm9hcmQ6IEJpbGxib2FyZC5Eb3VibGUsXG5cbiAgICAvLyBBbmdsZSBvZiBsZWF2ZXMgcmVsYXRpdmUgdG8gcGFyZW50IGJyYW5jaCAoZGVncmVlcylcbiAgICBhbmdsZTogMzAsXG5cbiAgICAvLyBOdW1iZXIgb2YgbGVhdmVzXG4gICAgY291bnQ6IDMsXG5cbiAgICAvLyBXaGVyZSBsZWF2ZXMgc3RhcnQgdG8gZ3JvdyBvbiB0aGUgbGVuZ3RoIG9mIHRoZSBicmFuY2ggKDAgdG8gMSlcbiAgICBzdGFydDogMCxcblxuICAgIC8vIFNpemUgb2YgdGhlIGxlYXZlc1xuICAgIHNpemU6IDEuNzUsXG5cbiAgICAvLyBWYXJpYW5jZSBpbiBsZWFmIHNpemUgYmV0d2VlbiBlYWNoIGluc3RhbmNlXG4gICAgc2l6ZVZhcmlhbmNlOiAwLjcsXG5cbiAgICAvLyBUaW50IGNvbG9yIGZvciB0aGUgbGVhdmVzXG4gICAgdGludDogMHhmZmZmZmYsXG5cbiAgICAvLyBDb250cm9scyB0cmFuc3BhcmVuY3kgb2YgbGVhZiB0ZXh0dXJlXG4gICAgYWxwaGFUZXN0OiAwLjUsXG4gIH0sXG59OyIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCBSTkcgZnJvbSAnLi9ybmcnO1xuaW1wb3J0IHsgQnJhbmNoIH0gZnJvbSAnLi9icmFuY2gnO1xuaW1wb3J0IHsgQmlsbGJvYXJkLCBUcmVlVHlwZSB9IGZyb20gJy4vZW51bXMnO1xuaW1wb3J0IHsgVHJlZVBhcmFtcyB9IGZyb20gJy4vdHJlZVBhcmFtcyc7XG5pbXBvcnQgKiBhcyB0ZXh0dXJlcyBmcm9tICcuL3RleHR1cmVzL2luZGV4Lmpzb24nO1xuXG5jb25zdCB0ZXh0dXJlQ2FjaGUgPSB7fTtcblxuY29uc3QgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG5jb25zdCBsb2FkVGV4dHVyZSA9IChwYXRoLCBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpKSA9PiB7XG4gIGlmICh0ZXh0dXJlQ2FjaGVbcGF0aF0pIHtcbiAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUNhY2hlW3BhdGhdO1xuICAgIHRleHR1cmUud3JhcFMgPSBUSFJFRS5NaXJyb3JlZFJlcGVhdFdyYXBwaW5nO1xuICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5NaXJyb3JlZFJlcGVhdFdyYXBwaW5nO1xuICAgIHJldHVybiB0ZXh0dXJlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGF0aCwgaW1wb3J0Lm1ldGEudXJsKS5ocmVmO1xuICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQodXJsKTtcbiAgICB0ZXh0dXJlQ2FjaGVbcGF0aF0gPSB0ZXh0dXJlO1xuICAgIHJldHVybiB0ZXh0dXJlO1xuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgVHJlZSBleHRlbmRzIFRIUkVFLkdyb3VwIHtcbiAgLyoqXG4gICAqIEB0eXBlIHtSTkd9XG4gICAqL1xuICBybmc7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtUcmVlUGFyYW1zfVxuICAgKi9cbiAgcGFyYW1zO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QnJhbmNoW119XG4gICAqL1xuICBicmFuY2hRdWV1ZSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1RyZWVQYXJhbXN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0gVHJlZVBhcmFtcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgdGhpcy5icmFuY2hlc01lc2ggPSBuZXcgVEhSRUUuTWVzaCgpO1xuICAgIHRoaXMubGVhdmVzTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCk7XG4gICAgdGhpcy5hZGQodGhpcy5icmFuY2hlc01lc2gpO1xuICAgIHRoaXMuYWRkKHRoaXMubGVhdmVzTWVzaCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBuZXcgdHJlZVxuICAgKi9cbiAgYXN5bmMgZ2VuZXJhdGUoKSB7XG4gICAgLy8gQ2xlYW4gdXAgb2xkIGdlb21ldHJ5XG4gICAgdGhpcy5icmFuY2hlcyA9IHtcbiAgICAgIHZlcnRzOiBbXSxcbiAgICAgIG5vcm1hbHM6IFtdLFxuICAgICAgaW5kaWNlczogW10sXG4gICAgICB1dnM6IFtdLFxuICAgIH07XG5cbiAgICB0aGlzLmxlYXZlcyA9IHtcbiAgICAgIHZlcnRzOiBbXSxcbiAgICAgIG5vcm1hbHM6IFtdLFxuICAgICAgaW5kaWNlczogW10sXG4gICAgICB1dnM6IFtdLFxuICAgIH07XG5cbiAgICB0aGlzLnJuZyA9IG5ldyBSTkcodGhpcy5wYXJhbXMuc2VlZCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHRydW5rIG9mIHRoZSB0cmVlIGZpcnN0XG4gICAgdGhpcy5icmFuY2hRdWV1ZS5wdXNoKFxuICAgICAgbmV3IEJyYW5jaChcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoKSxcbiAgICAgICAgbmV3IFRIUkVFLkV1bGVyKCksXG4gICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC5sZW5ndGhbMF0sXG4gICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC5yYWRpdXNbMF0sXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC5zZWN0aW9uc1swXSxcbiAgICAgICAgdGhpcy5wYXJhbXMuYnJhbmNoLnNlZ21lbnRzWzBdLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgd2hpbGUgKHRoaXMuYnJhbmNoUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgYnJhbmNoID0gdGhpcy5icmFuY2hRdWV1ZS5zaGlmdCgpO1xuICAgICAgdGhpcy5nZW5lcmF0ZUJyYW5jaChicmFuY2gpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlQnJhbmNoZXNHZW9tZXRyeSgpO1xuICAgIHRoaXMuY3JlYXRlTGVhdmVzR2VvbWV0cnkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBuZXcgYnJhbmNoXG4gICAqIEBwYXJhbSB7QnJhbmNofSBicmFuY2hcbiAgICogQHJldHVybnNcbiAgICovXG4gIGdlbmVyYXRlQnJhbmNoKGJyYW5jaCkge1xuICAgIC8vIFVzZWQgbGF0ZXIgZm9yIGdlb21ldHJ5IGluZGV4IGdlbmVyYXRpb25cbiAgICBjb25zdCBpbmRleE9mZnNldCA9IHRoaXMuYnJhbmNoZXMudmVydHMubGVuZ3RoIC8gMztcblxuICAgIGxldCBzZWN0aW9uT3JpZW50YXRpb24gPSBicmFuY2gub3JpZW50YXRpb24uY2xvbmUoKTtcbiAgICBsZXQgc2VjdGlvbk9yaWdpbiA9IGJyYW5jaC5vcmlnaW4uY2xvbmUoKTtcbiAgICBsZXQgc2VjdGlvbkxlbmd0aCA9XG4gICAgICBicmFuY2gubGVuZ3RoIC9cbiAgICAgIGJyYW5jaC5zZWN0aW9uQ291bnQgL1xuICAgICAgKHRoaXMucGFyYW1zLnR5cGUgPT09ICdEZWNpZHVvdXMnID8gdGhpcy5wYXJhbXMubGV2ZWxzIC0gMSA6IDEpO1xuXG4gICAgLy8gVGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIGZvciBnZW5lcmF0aW5nIGNoaWxkIGJyYW5jaGVzIGFmdGVyIHRoZSBicmFuY2hcbiAgICAvLyBnZW9tZXRyeSBoYXMgYmVlbiBjb25zdHJ1Y3RlZFxuICAgIGxldCBzZWN0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gYnJhbmNoLnNlY3Rpb25Db3VudDsgaSsrKSB7XG4gICAgICBsZXQgc2VjdGlvblJhZGl1cyA9IGJyYW5jaC5yYWRpdXM7XG5cbiAgICAgIC8vIElmIGZpbmFsIHNlY3Rpb24gb2YgZmluYWwgbGV2ZWwsIHNldCByYWRpdXMgdG8gZWZmZWNpdmVseSB6ZXJvXG4gICAgICBpZiAoXG4gICAgICAgIGkgPT09IGJyYW5jaC5zZWN0aW9uQ291bnQgJiZcbiAgICAgICAgYnJhbmNoLmxldmVsID09PSB0aGlzLnBhcmFtcy5sZXZlbHNcbiAgICAgICkge1xuICAgICAgICBzZWN0aW9uUmFkaXVzID0gMC4wMDE7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09IFRyZWVUeXBlLkRlY2lkdW91cykge1xuICAgICAgICBzZWN0aW9uUmFkaXVzICo9XG4gICAgICAgICAgMSAtIHRoaXMucGFyYW1zLmJyYW5jaC50YXBlclticmFuY2gubGV2ZWxdICogKGkgLyBicmFuY2guc2VjdGlvbkNvdW50KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMudHlwZSA9PT0gVHJlZVR5cGUuRXZlcmdyZWVuKSB7XG4gICAgICAgIC8vIEV2ZXJncmVlbnMgZG8gbm90IGhhdmUgYSB0ZXJtaW5hbCBicmFuY2ggc28gdGhleSBoYXZlIGEgdGFwZXIgb2YgMVxuICAgICAgICBzZWN0aW9uUmFkaXVzICo9IDEgLSAoaSAvIGJyYW5jaC5zZWN0aW9uQ291bnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgdGhlIHNlZ21lbnRzIHRoYXQgbWFrZSB1cCB0aGlzIHNlY3Rpb24uXG4gICAgICBsZXQgZmlyc3Q7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJyYW5jaC5zZWdtZW50Q291bnQ7IGorKykge1xuICAgICAgICBsZXQgYW5nbGUgPSAoMi4wICogTWF0aC5QSSAqIGopIC8gYnJhbmNoLnNlZ21lbnRDb3VudDtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHNlZ21lbnQgdmVydGV4XG4gICAgICAgIGNvbnN0IHZlcnRleCA9IG5ldyBUSFJFRS5WZWN0b3IzKE1hdGguY29zKGFuZ2xlKSwgMCwgTWF0aC5zaW4oYW5nbGUpKVxuICAgICAgICAgIC5tdWx0aXBseVNjYWxhcihzZWN0aW9uUmFkaXVzKVxuICAgICAgICAgIC5hcHBseUV1bGVyKHNlY3Rpb25PcmllbnRhdGlvbilcbiAgICAgICAgICAuYWRkKHNlY3Rpb25PcmlnaW4pO1xuXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IG5ldyBUSFJFRS5WZWN0b3IzKE1hdGguY29zKGFuZ2xlKSwgMCwgTWF0aC5zaW4oYW5nbGUpKVxuICAgICAgICAgIC5hcHBseUV1bGVyKHNlY3Rpb25PcmllbnRhdGlvbilcbiAgICAgICAgICAubm9ybWFsaXplKCk7XG5cbiAgICAgICAgY29uc3QgdXYgPSBuZXcgVEhSRUUuVmVjdG9yMihcbiAgICAgICAgICBqIC8gYnJhbmNoLnNlZ21lbnRDb3VudCxcbiAgICAgICAgICAoaSAlIDIgPT09IDApID8gMCA6IDEsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5icmFuY2hlcy52ZXJ0cy5wdXNoKC4uLk9iamVjdC52YWx1ZXModmVydGV4KSk7XG4gICAgICAgIHRoaXMuYnJhbmNoZXMubm9ybWFscy5wdXNoKC4uLk9iamVjdC52YWx1ZXMobm9ybWFsKSk7XG4gICAgICAgIHRoaXMuYnJhbmNoZXMudXZzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyh1dikpO1xuXG4gICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgZmlyc3QgPSB7IHZlcnRleCwgbm9ybWFsLCB1diB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIER1cGxpY2F0ZSB0aGUgZmlyc3QgdmVydGV4IHNvIHRoZXJlIGlzIGNvbnRpbnVpdHkgaW4gdGhlIFVWIG1hcHBpbmdcbiAgICAgIHRoaXMuYnJhbmNoZXMudmVydHMucHVzaCguLi5PYmplY3QudmFsdWVzKGZpcnN0LnZlcnRleCkpO1xuICAgICAgdGhpcy5icmFuY2hlcy5ub3JtYWxzLnB1c2goLi4uT2JqZWN0LnZhbHVlcyhmaXJzdC5ub3JtYWwpKTtcbiAgICAgIHRoaXMuYnJhbmNoZXMudXZzLnB1c2goMSwgZmlyc3QudXYueSk7XG5cbiAgICAgIC8vIFVzZSB0aGlzIGluZm9ybWF0aW9uIGxhdGVyIG9uIHdoZW4gZ2VuZXJhdGluZyBjaGlsZCBicmFuY2hlc1xuICAgICAgc2VjdGlvbnMucHVzaCh7XG4gICAgICAgIG9yaWdpbjogc2VjdGlvbk9yaWdpbi5jbG9uZSgpLFxuICAgICAgICBvcmllbnRhdGlvbjogc2VjdGlvbk9yaWVudGF0aW9uLmNsb25lKCksXG4gICAgICAgIHJhZGl1czogc2VjdGlvblJhZGl1cyxcbiAgICAgIH0pO1xuXG4gICAgICBzZWN0aW9uT3JpZ2luLmFkZChcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMCwgc2VjdGlvbkxlbmd0aCwgMCkuYXBwbHlFdWxlcihzZWN0aW9uT3JpZW50YXRpb24pLFxuICAgICAgKTtcblxuICAgICAgLy8gUGVydHVyYiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5leHQgc2VjdGlvbiByYW5kb21seS4gVGhlIGhpZ2hlciB0aGVcbiAgICAgIC8vIGduYXJsaW5lc3MsIHRoZSBsYXJnZXIgcG90ZW50aWFsIHBlcnR1cmJhdGlvblxuICAgICAgY29uc3QgZ25hcmxpbmVzcyA9XG4gICAgICAgIE1hdGgubWF4KDEsIDEgLyBNYXRoLnNxcnQoc2VjdGlvblJhZGl1cykpICpcbiAgICAgICAgdGhpcy5wYXJhbXMuYnJhbmNoLmduYXJsaW5lc3NbYnJhbmNoLmxldmVsXTtcblxuICAgICAgc2VjdGlvbk9yaWVudGF0aW9uLnggKz0gdGhpcy5ybmcucmFuZG9tKGduYXJsaW5lc3MsIC1nbmFybGluZXNzKTtcbiAgICAgIHNlY3Rpb25PcmllbnRhdGlvbi56ICs9IHRoaXMucm5nLnJhbmRvbShnbmFybGluZXNzLCAtZ25hcmxpbmVzcyk7XG5cbiAgICAgIC8vIEFwcGx5IGdyb3d0aCBmb3JjZSB0byB0aGUgYnJhbmNoXG4gICAgICBjb25zdCBxU2VjdGlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyKHNlY3Rpb25PcmllbnRhdGlvbik7XG5cbiAgICAgIGNvbnN0IHFUd2lzdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC50d2lzdFticmFuY2gubGV2ZWxdLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgcUZvcmNlID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnMoXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygpLmNvcHkodGhpcy5wYXJhbXMuYnJhbmNoLmZvcmNlLmRpcmVjdGlvbiksXG4gICAgICApO1xuXG4gICAgICBxU2VjdGlvbi5tdWx0aXBseShxVHdpc3QpO1xuICAgICAgcVNlY3Rpb24ucm90YXRlVG93YXJkcyhcbiAgICAgICAgcUZvcmNlLFxuICAgICAgICB0aGlzLnBhcmFtcy5icmFuY2guZm9yY2Uuc3RyZW5ndGggLyBzZWN0aW9uUmFkaXVzLFxuICAgICAgKTtcblxuICAgICAgc2VjdGlvbk9yaWVudGF0aW9uLnNldEZyb21RdWF0ZXJuaW9uKHFTZWN0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLmdlbmVyYXRlQnJhbmNoSW5kaWNlcyhpbmRleE9mZnNldCwgYnJhbmNoKTtcblxuICAgIC8vIERlY2lkdW91cyB0cmVlcyBoYXZlIGEgdGVybWluYWwgYnJhbmNoIHRoYXQgZ3Jvd3Mgb3V0IG9mIHRoZVxuICAgIC8vIGVuZCBvZiB0aGUgcGFyZW50IGJyYW5jaFxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAnZGVjaWR1b3VzJykge1xuICAgICAgY29uc3QgbGFzdFNlY3Rpb24gPSBzZWN0aW9uc1tzZWN0aW9ucy5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKGJyYW5jaC5sZXZlbCA8IHRoaXMucGFyYW1zLmxldmVscykge1xuICAgICAgICB0aGlzLmJyYW5jaFF1ZXVlLnB1c2goXG4gICAgICAgICAgbmV3IEJyYW5jaChcbiAgICAgICAgICAgIGxhc3RTZWN0aW9uLm9yaWdpbixcbiAgICAgICAgICAgIGxhc3RTZWN0aW9uLm9yaWVudGF0aW9uLFxuICAgICAgICAgICAgdGhpcy5wYXJhbXMuYnJhbmNoLmxlbmd0aFticmFuY2gubGV2ZWwgKyAxXSAvIDIsXG4gICAgICAgICAgICBsYXN0U2VjdGlvbi5yYWRpdXMsXG4gICAgICAgICAgICBicmFuY2gubGV2ZWwgKyAxLFxuICAgICAgICAgICAgLy8gU2VjdGlvbiBjb3VudCBhbmQgc2VnbWVudCBjb3VudCBtdXN0IGJlIHNhbWUgYXMgcGFyZW50IGJyYW5jaFxuICAgICAgICAgICAgLy8gc2luY2UgdGhlIGNoaWxkIGJyYW5jaCBpcyBncm93aW5nIGZyb20gdGhlIGVuZCBvZiB0aGUgcGFyZW50IGJyYW5jaFxuICAgICAgICAgICAgYnJhbmNoLnNlY3Rpb25Db3VudCxcbiAgICAgICAgICAgIGJyYW5jaC5zZWdtZW50Q291bnQsXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVMZWFmKGxhc3RTZWN0aW9uLm9yaWdpbiwgbGFzdFNlY3Rpb24ub3JpZW50YXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIGFyZSBvbiB0aGUgbGFzdCBicmFuY2ggbGV2ZWwsIGdlbmVyYXRlIGxlYXZlc1xuICAgIGlmIChicmFuY2gubGV2ZWwgPT09IHRoaXMucGFyYW1zLmxldmVscykge1xuICAgICAgdGhpcy5nZW5lcmF0ZUxlYXZlcyhzZWN0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChicmFuY2gubGV2ZWwgPCB0aGlzLnBhcmFtcy5sZXZlbHMpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVDaGlsZEJyYW5jaGVzKFxuICAgICAgICB0aGlzLnBhcmFtcy5icmFuY2guY2hpbGRyZW5bYnJhbmNoLmxldmVsXSxcbiAgICAgICAgYnJhbmNoLmxldmVsICsgMSxcbiAgICAgICAgc2VjdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBicmFuY2hlcyBmcm9tIGEgcGFyZW50IGJyYW5jaFxuICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgVGhlIG51bWJlciBvZiBjaGlsZCBicmFuY2hlcyB0byBnZW5lcmF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gbGV2ZWwgVGhlIGxldmVsIG9mIHRoZSBjaGlsZCBicmFuY2hlc1xuICAgKiBAcGFyYW0ge3tcbiAgICogIG9yaWdpbjogVEhSRUUuVmVjdG9yMyxcbiAgICogIG9yaWVudGF0aW9uOiBUSFJFRS5FdWxlcixcbiAgICogIHJhZGl1czogbnVtYmVyXG4gICAqIH1bXX0gc2VjdGlvbnMgVGhlIHBhcmVudCBicmFuY2gncyBzZWN0aW9uc1xuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZ2VuZXJhdGVDaGlsZEJyYW5jaGVzKGNvdW50LCBsZXZlbCwgc2VjdGlvbnMpIHtcbiAgICBjb25zdCByYWRpYWxPZmZzZXQgPSB0aGlzLnJuZy5yYW5kb20oKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgLy8gRGV0ZXJtaW5lIGhvdyBmYXIgYWxvbmcgdGhlIGxlbmd0aCBvZiB0aGUgcGFyZW50IGJyYW5jaCB0aGUgY2hpbGRcbiAgICAgIC8vIGJyYW5jaCBzaG91bGQgb3JpZ2luYXRlIGZyb20gKDAgdG8gMSlcbiAgICAgIGxldCBjaGlsZEJyYW5jaFN0YXJ0ID0gdGhpcy5ybmcucmFuZG9tKDEuMCwgdGhpcy5wYXJhbXMuYnJhbmNoLnN0YXJ0W2xldmVsXSk7XG5cbiAgICAgIC8vIEZpbmQgd2hpY2ggc2VjdGlvbnMgYXJlIG9uIGVpdGhlciBzaWRlIG9mIHRoZSBjaGlsZCBicmFuY2ggb3JpZ2luIHBvaW50XG4gICAgICAvLyBzbyB3ZSBjYW4gZGV0ZXJtaW5lIHRoZSBvcmlnaW4sIG9yaWVudGF0aW9uIGFuZCByYWRpdXMgb2YgdGhlIGJyYW5jaFxuICAgICAgY29uc3Qgc2VjdGlvbkluZGV4ID0gTWF0aC5mbG9vcihjaGlsZEJyYW5jaFN0YXJ0ICogKHNlY3Rpb25zLmxlbmd0aCAtIDEpKTtcbiAgICAgIGxldCBzZWN0aW9uQSwgc2VjdGlvbkI7XG4gICAgICBzZWN0aW9uQSA9IHNlY3Rpb25zW3NlY3Rpb25JbmRleF07XG4gICAgICBpZiAoc2VjdGlvbkluZGV4ID09PSBzZWN0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHNlY3Rpb25CID0gc2VjdGlvbkE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWN0aW9uQiA9IHNlY3Rpb25zW3NlY3Rpb25JbmRleCArIDFdO1xuICAgICAgfVxuXG4gICAgICAvLyBGaW5kIG5vcm1hbGl6ZWQgZGlzdGFuY2UgZnJvbSBzZWN0aW9uIEEgdG8gc2VjdGlvbiBCICgwIHRvIDEpXG4gICAgICBjb25zdCBhbHBoYSA9XG4gICAgICAgIChjaGlsZEJyYW5jaFN0YXJ0IC0gc2VjdGlvbkluZGV4IC8gKHNlY3Rpb25zLmxlbmd0aCAtIDEpKSAvXG4gICAgICAgICgxIC8gKHNlY3Rpb25zLmxlbmd0aCAtIDEpKTtcblxuICAgICAgLy8gTGluZWFybHkgaW50ZXJwb2xhdGUgb3JpZ2luIGZyb20gc2VjdGlvbiBBIHRvIHNlY3Rpb24gQlxuICAgICAgY29uc3QgY2hpbGRCcmFuY2hPcmlnaW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpLmxlcnBWZWN0b3JzKFxuICAgICAgICBzZWN0aW9uQS5vcmlnaW4sXG4gICAgICAgIHNlY3Rpb25CLm9yaWdpbixcbiAgICAgICAgYWxwaGEsXG4gICAgICApO1xuXG4gICAgICAvLyBMaW5lYXJseSBpbnRlcnBvbGF0ZSByYWRpdXNcbiAgICAgIGNvbnN0IGNoaWxkQnJhbmNoUmFkaXVzID1cbiAgICAgICAgdGhpcy5wYXJhbXMuYnJhbmNoLnJhZGl1c1tsZXZlbF0gKlxuICAgICAgICAoKDEgLSBhbHBoYSkgKiBzZWN0aW9uQS5yYWRpdXMgKyBhbHBoYSAqIHNlY3Rpb25CLnJhZGl1cyk7XG5cbiAgICAgIC8vIExpbmVhcmxseSBpbnRlcnBvbGF0ZSB0aGUgb3JpZW50YXRpb25cbiAgICAgIGNvbnN0IHFBID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoc2VjdGlvbkEub3JpZW50YXRpb24pO1xuICAgICAgY29uc3QgcUIgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlcihzZWN0aW9uQi5vcmllbnRhdGlvbik7XG4gICAgICBjb25zdCBwYXJlbnRPcmllbnRhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpLnNldEZyb21RdWF0ZXJuaW9uKFxuICAgICAgICBxQi5zbGVycChxQSwgYWxwaGEpLFxuICAgICAgKTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhbmdsZSBvZmZzZXQgZnJvbSB0aGUgcGFyZW50IGJyYW5jaCBhbmQgdGhlIHJhZGlhbCBhbmdsZVxuICAgICAgY29uc3QgcmFkaWFsQW5nbGUgPSAyLjAgKiBNYXRoLlBJICogKHJhZGlhbE9mZnNldCArIGkgLyBjb3VudCk7XG4gICAgICBjb25zdCBxMSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksXG4gICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC5hbmdsZVtsZXZlbF0gLyAoMTgwIC8gTWF0aC5QSSksXG4gICAgICApO1xuICAgICAgY29uc3QgcTIgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICByYWRpYWxBbmdsZSxcbiAgICAgICk7XG4gICAgICBjb25zdCBxMyA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyKHBhcmVudE9yaWVudGF0aW9uKTtcblxuICAgICAgY29uc3QgY2hpbGRCcmFuY2hPcmllbnRhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpLnNldEZyb21RdWF0ZXJuaW9uKFxuICAgICAgICBxMy5tdWx0aXBseShxMi5tdWx0aXBseShxMSkpLFxuICAgICAgKTtcblxuICAgICAgbGV0IGNoaWxkQnJhbmNoTGVuZ3RoID1cbiAgICAgICAgdGhpcy5wYXJhbXMuYnJhbmNoLmxlbmd0aFtsZXZlbF0gKlxuICAgICAgICAodGhpcy5wYXJhbXMudHlwZSA9PT0gVHJlZVR5cGUuRXZlcmdyZWVuXG4gICAgICAgICAgPyAxLjAgLSBjaGlsZEJyYW5jaFN0YXJ0XG4gICAgICAgICAgOiAxLjApO1xuXG4gICAgICB0aGlzLmJyYW5jaFF1ZXVlLnB1c2goXG4gICAgICAgIG5ldyBCcmFuY2goXG4gICAgICAgICAgY2hpbGRCcmFuY2hPcmlnaW4sXG4gICAgICAgICAgY2hpbGRCcmFuY2hPcmllbnRhdGlvbixcbiAgICAgICAgICBjaGlsZEJyYW5jaExlbmd0aCxcbiAgICAgICAgICBjaGlsZEJyYW5jaFJhZGl1cyxcbiAgICAgICAgICBsZXZlbCxcbiAgICAgICAgICB0aGlzLnBhcmFtcy5icmFuY2guc2VjdGlvbnNbbGV2ZWxdLFxuICAgICAgICAgIHRoaXMucGFyYW1zLmJyYW5jaC5zZWdtZW50c1tsZXZlbF0sXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dpYyBmb3Igc3Bhd25pbmcgY2hpbGQgYnJhbmNoZXMgZnJvbSBhIHBhcmVudCBicmFuY2gncyBzZWN0aW9uXG4gICAqIEBwYXJhbSB7e1xuICAqICBvcmlnaW46IFRIUkVFLlZlY3RvcjMsXG4gICogIG9yaWVudGF0aW9uOiBUSFJFRS5FdWxlcixcbiAgKiAgcmFkaXVzOiBudW1iZXJcbiAgKiB9W119IHNlY3Rpb25zIFRoZSBwYXJlbnQgYnJhbmNoJ3Mgc2VjdGlvbnNcbiAgKiBAcmV0dXJuc1xuICAqL1xuICBnZW5lcmF0ZUxlYXZlcyhzZWN0aW9ucykge1xuICAgIGNvbnN0IHJhZGlhbE9mZnNldCA9IHRoaXMucm5nLnJhbmRvbSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhcmFtcy5sZWF2ZXMuY291bnQ7IGkrKykge1xuICAgICAgLy8gRGV0ZXJtaW5lIGhvdyBmYXIgYWxvbmcgdGhlIGxlbmd0aCBvZiB0aGUgcGFyZW50XG4gICAgICAvLyBicmFuY2ggdGhlIGxlYWYgc2hvdWxkIG9yaWdpbmF0ZSBmcm9tICgwIHRvIDEpXG4gICAgICBsZXQgbGVhZlN0YXJ0ID0gdGhpcy5ybmcucmFuZG9tKDEuMCwgdGhpcy5wYXJhbXMubGVhdmVzLnN0YXJ0KTtcblxuICAgICAgLy8gRmluZCB3aGljaCBzZWN0aW9ucyBhcmUgb24gZWl0aGVyIHNpZGUgb2YgdGhlIGNoaWxkIGJyYW5jaCBvcmlnaW4gcG9pbnRcbiAgICAgIC8vIHNvIHdlIGNhbiBkZXRlcm1pbmUgdGhlIG9yaWdpbiwgb3JpZW50YXRpb24gYW5kIHJhZGl1cyBvZiB0aGUgYnJhbmNoXG4gICAgICBjb25zdCBzZWN0aW9uSW5kZXggPSBNYXRoLmZsb29yKGxlYWZTdGFydCAqIChzZWN0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgICBsZXQgc2VjdGlvbkEsIHNlY3Rpb25CO1xuICAgICAgc2VjdGlvbkEgPSBzZWN0aW9uc1tzZWN0aW9uSW5kZXhdO1xuICAgICAgaWYgKHNlY3Rpb25JbmRleCA9PT0gc2VjdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICBzZWN0aW9uQiA9IHNlY3Rpb25BO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VjdGlvbkIgPSBzZWN0aW9uc1tzZWN0aW9uSW5kZXggKyAxXTtcbiAgICAgIH1cblxuICAgICAgLy8gRmluZCBub3JtYWxpemVkIGRpc3RhbmNlIGZyb20gc2VjdGlvbiBBIHRvIHNlY3Rpb24gQiAoMCB0byAxKVxuICAgICAgY29uc3QgYWxwaGEgPVxuICAgICAgICAobGVhZlN0YXJ0IC0gc2VjdGlvbkluZGV4IC8gKHNlY3Rpb25zLmxlbmd0aCAtIDEpKSAvXG4gICAgICAgICgxIC8gKHNlY3Rpb25zLmxlbmd0aCAtIDEpKTtcblxuICAgICAgLy8gTGluZWFybHkgaW50ZXJwb2xhdGUgb3JpZ2luIGZyb20gc2VjdGlvbiBBIHRvIHNlY3Rpb24gQlxuICAgICAgY29uc3QgbGVhZk9yaWdpbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkubGVycFZlY3RvcnMoXG4gICAgICAgIHNlY3Rpb25BLm9yaWdpbixcbiAgICAgICAgc2VjdGlvbkIub3JpZ2luLFxuICAgICAgICBhbHBoYSxcbiAgICAgICk7XG5cbiAgICAgIC8vIExpbmVhcmxseSBpbnRlcnBvbGF0ZSB0aGUgb3JpZW50YXRpb25cbiAgICAgIGNvbnN0IHFBID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoc2VjdGlvbkEub3JpZW50YXRpb24pO1xuICAgICAgY29uc3QgcUIgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlcihzZWN0aW9uQi5vcmllbnRhdGlvbik7XG4gICAgICBjb25zdCBwYXJlbnRPcmllbnRhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpLnNldEZyb21RdWF0ZXJuaW9uKFxuICAgICAgICBxQi5zbGVycChxQSwgYWxwaGEpLFxuICAgICAgKTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhbmdsZSBvZmZzZXQgZnJvbSB0aGUgcGFyZW50IGJyYW5jaCBhbmQgdGhlIHJhZGlhbCBhbmdsZVxuICAgICAgY29uc3QgcmFkaWFsQW5nbGUgPSAyLjAgKiBNYXRoLlBJICogKHJhZGlhbE9mZnNldCArIGkgLyB0aGlzLnBhcmFtcy5sZWF2ZXMuY291bnQpO1xuICAgICAgY29uc3QgcTEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApLFxuICAgICAgICB0aGlzLnBhcmFtcy5sZWF2ZXMuYW5nbGUgLyAoMTgwIC8gTWF0aC5QSSksXG4gICAgICApO1xuICAgICAgY29uc3QgcTIgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICByYWRpYWxBbmdsZSxcbiAgICAgICk7XG4gICAgICBjb25zdCBxMyA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyKHBhcmVudE9yaWVudGF0aW9uKTtcblxuICAgICAgY29uc3QgbGVhZk9yaWVudGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCkuc2V0RnJvbVF1YXRlcm5pb24oXG4gICAgICAgIHEzLm11bHRpcGx5KHEyLm11bHRpcGx5KHExKSksXG4gICAgICApO1xuXG4gICAgICB0aGlzLmdlbmVyYXRlTGVhZihsZWFmT3JpZ2luLCBsZWFmT3JpZW50YXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICogR2VuZXJhdGVzIGEgbGVhdmVzXG4gKiBAcGFyYW0ge1RIUkVFLlZlY3RvcjN9IG9yaWdpbiBUaGUgc3RhcnRpbmcgcG9pbnQgb2YgdGhlIGJyYW5jaFxuICogQHBhcmFtIHtUSFJFRS5FdWxlcn0gb3JpZW50YXRpb24gVGhlIHN0YXJ0aW5nIG9yaWVudGF0aW9uIG9mIHRoZSBicmFuY2hcbiAqL1xuICBnZW5lcmF0ZUxlYWYob3JpZ2luLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBpID0gdGhpcy5sZWF2ZXMudmVydHMubGVuZ3RoIC8gMztcblxuICAgIC8vIFdpZHRoIGFuZCBsZW5ndGggb2YgdGhlIGxlYWYgcXVhZFxuICAgIGxldCBsZWFmU2l6ZSA9XG4gICAgICB0aGlzLnBhcmFtcy5sZWF2ZXMuc2l6ZSAqXG4gICAgICAoMSArXG4gICAgICAgIHRoaXMucm5nLnJhbmRvbShcbiAgICAgICAgICB0aGlzLnBhcmFtcy5sZWF2ZXMuc2l6ZVZhcmlhbmNlLFxuICAgICAgICAgIC10aGlzLnBhcmFtcy5sZWF2ZXMuc2l6ZVZhcmlhbmNlLFxuICAgICAgICApKTtcblxuICAgIGNvbnN0IFcgPSBsZWFmU2l6ZTtcbiAgICBjb25zdCBMID0gMS41ICogbGVhZlNpemU7XG5cbiAgICBjb25zdCBjcmVhdGVMZWFmID0gKHJvdGF0aW9uKSA9PiB7XG4gICAgICAvLyBDcmVhdGUgcXVhZCB2ZXJ0aWNlc1xuICAgICAgY29uc3QgdiA9IFtcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLVcgLyAyLCBMLCAwKSxcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLVcgLyAyLCAwLCAwKSxcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoVyAvIDIsIDAsIDApLFxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMyhXIC8gMiwgTCwgMCksXG4gICAgICBdLm1hcCgodikgPT5cbiAgICAgICAgdlxuICAgICAgICAgIC5hcHBseUV1bGVyKG5ldyBUSFJFRS5FdWxlcigwLCByb3RhdGlvbiwgMCkpXG4gICAgICAgICAgLmFwcGx5RXVsZXIob3JpZW50YXRpb24pXG4gICAgICAgICAgLmFkZChvcmlnaW4pLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5sZWF2ZXMudmVydHMucHVzaChcbiAgICAgICAgdlswXS54LFxuICAgICAgICB2WzBdLnksXG4gICAgICAgIHZbMF0ueixcbiAgICAgICAgdlsxXS54LFxuICAgICAgICB2WzFdLnksXG4gICAgICAgIHZbMV0ueixcbiAgICAgICAgdlsyXS54LFxuICAgICAgICB2WzJdLnksXG4gICAgICAgIHZbMl0ueixcbiAgICAgICAgdlszXS54LFxuICAgICAgICB2WzNdLnksXG4gICAgICAgIHZbM10ueixcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IG4gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKS5hcHBseUV1bGVyKG9yaWVudGF0aW9uKTtcbiAgICAgIHRoaXMubGVhdmVzLm5vcm1hbHMucHVzaChcbiAgICAgICAgbi54LFxuICAgICAgICBuLnksXG4gICAgICAgIG4ueixcbiAgICAgICAgbi54LFxuICAgICAgICBuLnksXG4gICAgICAgIG4ueixcbiAgICAgICAgbi54LFxuICAgICAgICBuLnksXG4gICAgICAgIG4ueixcbiAgICAgICAgbi54LFxuICAgICAgICBuLnksXG4gICAgICAgIG4ueixcbiAgICAgICk7XG4gICAgICB0aGlzLmxlYXZlcy51dnMucHVzaCgwLCAxLCAwLCAwLCAxLCAwLCAxLCAxKTtcbiAgICAgIHRoaXMubGVhdmVzLmluZGljZXMucHVzaChpLCBpICsgMSwgaSArIDIsIGksIGkgKyAyLCBpICsgMyk7XG4gICAgICBpICs9IDQ7XG4gICAgfTtcblxuICAgIGNyZWF0ZUxlYWYoMCk7XG4gICAgaWYgKHRoaXMucGFyYW1zLmxlYXZlcy5iaWxsYm9hcmQgPT09IEJpbGxib2FyZC5Eb3VibGUpIHtcbiAgICAgIGNyZWF0ZUxlYWYoTWF0aC5QSSAvIDIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGluZGljZXMgZm9yIGJyYW5jaCBnZW9tZXRyeVxuICAgKiBAcGFyYW0ge0JyYW5jaH0gYnJhbmNoXG4gICAqL1xuICBnZW5lcmF0ZUJyYW5jaEluZGljZXMoaW5kZXhPZmZzZXQsIGJyYW5jaCkge1xuICAgIC8vIEJ1aWxkIGdlb21ldHJ5IGVhY2ggc2VjdGlvbiBvZiB0aGUgYnJhbmNoIChjeWxpbmRlciB3aXRob3V0IGVuZCBjYXBzKVxuICAgIGxldCB2MSwgdjIsIHYzLCB2NDtcbiAgICBjb25zdCBOID0gYnJhbmNoLnNlZ21lbnRDb3VudCArIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmFuY2guc2VjdGlvbkNvdW50OyBpKyspIHtcbiAgICAgIC8vIEJ1aWxkIHRoZSBxdWFkIGZvciBlYWNoIHNlZ21lbnQgb2YgdGhlIHNlY3Rpb25cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnJhbmNoLnNlZ21lbnRDb3VudDsgaisrKSB7XG4gICAgICAgIHYxID0gaW5kZXhPZmZzZXQgKyBpICogTiArIGo7XG4gICAgICAgIC8vIFRoZSBsYXN0IHNlZ21lbnQgd3JhcHMgYXJvdW5kIGJhY2sgdG8gdGhlIHN0YXJ0aW5nIHNlZ21lbnQsIHNvIG9taXQgaiArIDEgdGVybVxuICAgICAgICB2MiA9IGluZGV4T2Zmc2V0ICsgaSAqIE4gKyAoaiArIDEpO1xuICAgICAgICB2MyA9IHYxICsgTjtcbiAgICAgICAgdjQgPSB2MiArIE47XG4gICAgICAgIHRoaXMuYnJhbmNoZXMuaW5kaWNlcy5wdXNoKHYxLCB2MywgdjIsIHYyLCB2MywgdjQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGdlb21ldHJ5IGZvciB0aGUgYnJhbmNoZXNcbiAgICovXG4gIGNyZWF0ZUJyYW5jaGVzR2VvbWV0cnkoKSB7XG4gICAgY29uc3QgZyA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgIGcuc2V0QXR0cmlidXRlKFxuICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheSh0aGlzLmJyYW5jaGVzLnZlcnRzKSwgMyksXG4gICAgKTtcbiAgICBnLnNldEF0dHJpYnV0ZShcbiAgICAgICdub3JtYWwnLFxuICAgICAgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KHRoaXMuYnJhbmNoZXMubm9ybWFscyksIDMpLFxuICAgICk7XG4gICAgZy5zZXRBdHRyaWJ1dGUoXG4gICAgICAndXYnLFxuICAgICAgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KHRoaXMuYnJhbmNoZXMudXZzKSwgMiksXG4gICAgKTtcbiAgICBnLnNldEluZGV4KFxuICAgICAgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgVWludDE2QXJyYXkodGhpcy5icmFuY2hlcy5pbmRpY2VzKSwgMSksXG4gICAgKTtcbiAgICBnLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xuXG4gICAgY29uc3QgbWF0ID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgIG5hbWU6ICdicmFuY2hlcycsXG4gICAgICBmbGF0U2hhZGluZzogdGhpcy5wYXJhbXMuZmxhdFNoYWRpbmcsXG4gICAgICBjb2xvcjogdGhpcy5wYXJhbXMudGludCxcbiAgICB9KTtcblxuICAgIHRoaXMuYnJhbmNoZXNNZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICB0aGlzLmJyYW5jaGVzTWVzaC5nZW9tZXRyeSA9IGc7XG4gICAgdGhpcy5icmFuY2hlc01lc2gubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMuYnJhbmNoZXNNZXNoLm1hdGVyaWFsID0gbWF0O1xuICAgIHRoaXMuYnJhbmNoZXNNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgIHRoaXMuYnJhbmNoZXNNZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLnRleHR1cmVkKSB7XG4gICAgICB0aGlzLmJyYW5jaGVzTWVzaC5tYXRlcmlhbC5hb01hcCA9IGxvYWRUZXh0dXJlKHRleHR1cmVzLmJhcmtbdGhpcy5wYXJhbXMuYmFyay50eXBlXS5hbywgdGhpcy5wYXJhbXMuYmFyay5zY2FsZSk7XG4gICAgICB0aGlzLmJyYW5jaGVzTWVzaC5tYXRlcmlhbC5tYXAgPSBsb2FkVGV4dHVyZSh0ZXh0dXJlcy5iYXJrW3RoaXMucGFyYW1zLmJhcmsudHlwZV0uY29sb3IsIHRoaXMucGFyYW1zLmJhcmsuc2NhbGUpO1xuICAgICAgdGhpcy5icmFuY2hlc01lc2gubWF0ZXJpYWwubm9ybWFsTWFwID0gbG9hZFRleHR1cmUodGV4dHVyZXMuYmFya1t0aGlzLnBhcmFtcy5iYXJrLnR5cGVdLm5vcm1hbCwgdGhpcy5wYXJhbXMuYmFyay5zY2FsZSk7XG4gICAgICB0aGlzLmJyYW5jaGVzTWVzaC5tYXRlcmlhbC5yb3VnaG5lc3NNYXAgPSBsb2FkVGV4dHVyZSh0ZXh0dXJlcy5iYXJrW3RoaXMucGFyYW1zLmJhcmsudHlwZV0ucm91Z2huZXNzLCB0aGlzLnBhcmFtcy5iYXJrLnNjYWxlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBnZW9tZXRyeSBmb3IgdGhlIGxlYXZlc1xuICAgKi9cbiAgY3JlYXRlTGVhdmVzR2VvbWV0cnkoKSB7XG4gICAgY29uc3QgZyA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgIGcuc2V0QXR0cmlidXRlKFxuICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheSh0aGlzLmxlYXZlcy52ZXJ0cyksIDMpLFxuICAgICk7XG4gICAgZy5zZXRBdHRyaWJ1dGUoXG4gICAgICAndXYnLFxuICAgICAgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KHRoaXMubGVhdmVzLnV2cyksIDIpLFxuICAgICk7XG4gICAgZy5zZXRJbmRleChcbiAgICAgIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IFVpbnQxNkFycmF5KHRoaXMubGVhdmVzLmluZGljZXMpLCAxKSxcbiAgICApO1xuICAgIGcuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcbiAgICBnLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xuXG4gICAgY29uc3QgbWF0ID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgIG5hbWU6ICdsZWF2ZXMnLFxuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmxlYXZlcy50aW50LFxuICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgIGFscGhhVGVzdDogdGhpcy5wYXJhbXMubGVhdmVzLmFscGhhVGVzdCxcbiAgICB9KTtcblxuICAgIHRoaXMubGVhdmVzTWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG4gICAgdGhpcy5sZWF2ZXNNZXNoLmdlb21ldHJ5ID0gZztcbiAgICB0aGlzLmxlYXZlc01lc2gubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMubGVhdmVzTWVzaC5tYXRlcmlhbCA9IG1hdDtcbiAgICB0aGlzLmxlYXZlc01lc2gubWF0ZXJpYWwubWFwID0gbG9hZFRleHR1cmUodGV4dHVyZXMubGVhdmVzW3RoaXMucGFyYW1zLmxlYXZlcy50eXBlXSk7XG4gICAgdGhpcy5sZWF2ZXNNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgIHRoaXMubGVhdmVzTWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIlJORyIsInNlZWQiLCJfX3B1YmxpY0ZpZWxkIiwibWF4IiwibWluIiwicmVzdWx0IiwiQnJhbmNoIiwib3JpZ2luIiwiVEhSRUUiLCJvcmllbnRhdGlvbiIsImxlbmd0aCIsInJhZGl1cyIsImxldmVsIiwic2VjdGlvbkNvdW50Iiwic2VnbWVudENvdW50IiwiQmFya1R5cGUiLCJCaWxsYm9hcmQiLCJMZWFmVHlwZSIsIlRyZWVUeXBlIiwiVHJlZVBhcmFtcyIsInRleHR1cmVDYWNoZSIsInRleHR1cmVMb2FkZXIiLCJsb2FkVGV4dHVyZSIsInBhdGgiLCJzY2FsZSIsInRleHR1cmUiLCJ1cmwiLCJUcmVlIiwicGFyYW1zIiwiYnJhbmNoIiwiaW5kZXhPZmZzZXQiLCJzZWN0aW9uT3JpZW50YXRpb24iLCJzZWN0aW9uT3JpZ2luIiwic2VjdGlvbkxlbmd0aCIsInNlY3Rpb25zIiwiaSIsInNlY3Rpb25SYWRpdXMiLCJmaXJzdCIsImoiLCJhbmdsZSIsInZlcnRleCIsIm5vcm1hbCIsInV2IiwiZ25hcmxpbmVzcyIsInFTZWN0aW9uIiwicVR3aXN0IiwicUZvcmNlIiwibGFzdFNlY3Rpb24iLCJjb3VudCIsInJhZGlhbE9mZnNldCIsImNoaWxkQnJhbmNoU3RhcnQiLCJzZWN0aW9uSW5kZXgiLCJzZWN0aW9uQSIsInNlY3Rpb25CIiwiYWxwaGEiLCJjaGlsZEJyYW5jaE9yaWdpbiIsImNoaWxkQnJhbmNoUmFkaXVzIiwicUEiLCJxQiIsInBhcmVudE9yaWVudGF0aW9uIiwicmFkaWFsQW5nbGUiLCJxMSIsInEyIiwicTMiLCJjaGlsZEJyYW5jaE9yaWVudGF0aW9uIiwiY2hpbGRCcmFuY2hMZW5ndGgiLCJsZWFmU3RhcnQiLCJsZWFmT3JpZ2luIiwibGVhZk9yaWVudGF0aW9uIiwibGVhZlNpemUiLCJXIiwiTCIsImNyZWF0ZUxlYWYiLCJyb3RhdGlvbiIsInYiLCJuIiwidjEiLCJ2MiIsInYzIiwidjQiLCJOIiwiZyIsIm1hdCIsInRleHR1cmVzLmJhcmsiLCJ0ZXh0dXJlcy5sZWF2ZXMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBZSxNQUFNQSxFQUFJO0FBQUEsRUFLdkIsWUFBWUMsR0FBTTtBQUpsQixJQUFBQyxFQUFBLGFBQU07QUFDTixJQUFBQSxFQUFBLGFBQU07QUFDTixJQUFBQSxFQUFBLGNBQU87QUFHTCxTQUFLLE1BQU8sWUFBWUQsSUFBUSxLQUFLLE1BQ3JDLEtBQUssTUFBTyxZQUFZQSxJQUFRLEtBQUs7QUFBQSxFQUN0QztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0QsT0FBT0UsSUFBTSxHQUFHQyxJQUFNLEdBQUc7QUFDdkIsU0FBSyxNQUFPLFNBQVMsS0FBSyxNQUFNLFVBQVUsS0FBSyxPQUFPLE1BQU8sS0FBSyxNQUNsRSxLQUFLLE1BQU8sUUFBUyxLQUFLLE1BQU0sVUFBVSxLQUFLLE9BQU8sTUFBTyxLQUFLO0FBQ2xFLFFBQUlDLEtBQVcsS0FBSyxPQUFPLE9BQU8sS0FBSyxNQUFNLFdBQVk7QUFDekQsV0FBQUEsS0FBVSxhQUVGRixJQUFNQyxLQUFPQyxJQUFTRDtBQUFBLEVBQy9CO0FBQ0g7QUNuQk8sTUFBTUUsRUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRbEIsWUFDRUMsSUFBUyxJQUFJQyxFQUFNLFFBQVMsR0FDNUJDLElBQWMsSUFBSUQsRUFBTSxNQUFPLEdBQy9CRSxJQUFTLEdBQ1RDLElBQVMsR0FDVEMsSUFBUSxHQUNSQyxJQUFlLEdBQ2ZDLElBQWUsR0FDZjtBQUNBLFNBQUssU0FBU1AsRUFBTyxTQUNyQixLQUFLLGNBQWNFLEVBQVksU0FDL0IsS0FBSyxTQUFTQyxHQUNkLEtBQUssU0FBU0MsR0FDZCxLQUFLLFFBQVFDLEdBQ2IsS0FBSyxlQUFlQyxHQUNwQixLQUFLLGVBQWVDO0FBQUEsRUFDckI7QUFDSDtBQzNCWSxNQUFDQyxJQUFXO0FBQUEsRUFDdEIsT0FBTztBQUFBLEVBQ1AsS0FBSztBQUFBLEVBQ0wsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUNWLEdBRWFDLElBQVk7QUFBQSxFQUN2QixRQUFRO0FBQUEsRUFDUixRQUFRO0FBQ1YsR0FFYUMsSUFBVztBQUFBLEVBQ3RCLEtBQUs7QUFBQSxFQUNMLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLEtBQUs7QUFDUCxHQUVhQyxJQUFXO0FBQUEsRUFDdEIsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUNiLEdDckJhQyxJQUFhO0FBQUEsRUFDeEIsTUFBTTtBQUFBLEVBQ04sTUFBTUQsRUFBUztBQUFBO0FBQUEsRUFHZixNQUFNO0FBQUE7QUFBQSxFQUdOLGFBQWE7QUFBQTtBQUFBLEVBR2IsVUFBVTtBQUFBO0FBQUEsRUFHVixRQUFRO0FBQUE7QUFBQSxFQUdSLE1BQU07QUFBQTtBQUFBLElBRUosTUFBTTtBQUFBO0FBQUEsSUFHTixPQUFPO0FBQUEsRUFDUjtBQUFBO0FBQUEsRUFHRCxRQUFRO0FBQUE7QUFBQSxJQUdOLE9BQU87QUFBQSxNQUNMLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELFVBQVU7QUFBQSxNQUNSLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELE9BQU87QUFBQSxNQUNMLFdBQVcsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRztBQUFBLE1BQy9CLFVBQVU7QUFBQSxJQUNYO0FBQUE7QUFBQSxJQUdELFlBQVk7QUFBQSxNQUNWLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELFFBQVE7QUFBQSxNQUNOLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELFFBQVE7QUFBQSxNQUNOLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELFVBQVU7QUFBQSxNQUNSLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELFVBQVU7QUFBQSxNQUNSLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELE9BQU87QUFBQSxNQUNMLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELE9BQU87QUFBQSxNQUNMLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdELE9BQU87QUFBQSxNQUNMLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNKO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHRCxRQUFRO0FB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
