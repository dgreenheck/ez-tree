import * as THREE from 'three';
import RNG from './rng';

import barkSrc from './textures/bark/aspen.png';

// Leaf textures
import leavesAsh from './textures/leaves/ash.png';
import leavesAspen from './textures/leaves/aspen.png';
import leavesBeech from './textures/leaves/beech.png';
import leavesEvergreen from './textures/leaves/evergreen.png';
import leavesOak from './textures/leaves/oak.png';

export const Billboard = {
  Single: 'single',
  Double: 'double'
};

export const LeafType = {
  Ash: 'ash',
  Aspen: 'aspen',
  Beech: 'beech',
  Evergreen: 'evergreen',
  Oak: 'oak'
};

const loader = new THREE.TextureLoader();

function loadTexture(path) {
  return loader.load(path,
    /**
     * @param {THREE.Texture} tex 
     */
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    });
}
const barkTexture = loadTexture(barkSrc);

const leafTextures = {
  'ash': loadTexture(leavesAsh),
  'aspen': loadTexture(leavesAspen),
  'beech': loadTexture(leavesBeech),
  'evergreen': loadTexture(leavesEvergreen),
  'oak': loadTexture(leavesOak)
};

const TreeParams = {
  seed: 0,

  trunk: {
    color: 0xd59d63,       // Color of the tree trunk
    flatShading: false,    // Use face normals for shading instead of vertex normals
    textured: true,        // Apply texture to bark
    length: 20,            // Length of the trunk
    radius: 2,             // Starting radius of the trunk
  },

  branch: {
    levels: 3,               // Number of branch recursions ( Keep under 5 )
    children: 5,             // Number of child branches at each level
    start: .6,               // Defines where child branches start forming on the parent branch. A value of 0.6 means the
    // child branches can start forming 60% of the way up the parent branch
    stop: .95,               // Defines where child branches stop forming on the parent branch. A value of 0.9 means the
    // child branches stop forming 90% of the way up the parent branch
    angle: Math.PI / 3,      // Angle of the child branches relative to the parent branch (radians)
    angleVariance: 0.0,      // Random offset applied to angle
    lengthVariance: 0.0,     // % variance in branch length
    lengthMultiplier: .7,    // Length of child branch relative to parent
    radiusMultiplier: .5,    // Radius of child branch relative to parent
    taper: .7,               // Radius of end of branch relative to the start of the branch
    gnarliness: 0.3,         // Max amplitude of random angle added to each section's orientation
    twist: 0.2,
    force: {
      direction: new THREE.Vector3(0, 1, 0),
      strength: 0.0
    }
  },

  geometry: {
    sections: 10,             // Number of sections that make up this branch 
    segments: 12,           // Number of faces around the circumference of the branch
    lengthVariance: 0.1,   // % variance in the nominal section length
    radiusVariance: 0.1,   // % variance in the nominal section radius
    randomization: 0.1,    // Randomization factor applied to vertices
  },

  leaves: {
    billboard: 'double',
    type: 'ash',
    count: 20,
    start: 0,
    size: 1.375,
    sizeVariance: 0.7,
    color: 0x6b7f48,
    alphaTest: 0.5
  }
}

export class Tree extends THREE.Group {
  /**
   * @type {TreeParams}
   */
  params;

  /**
   * @param {TreeParams} params 
   */
  constructor(params = TreeParams) {
    super();
    this.params = params;
    this.branchesMesh = new THREE.Mesh();
    this.leavesMesh = new THREE.Mesh();
    this.add(this.branchesMesh);
    this.add(this.leavesMesh);
  }

  /**
   * Generate a new tree
   */
  generate() {
    // Clean up old geometry
    this.branches = {
      verts: [],
      normals: [],
      indices: [],
      uvs: []
    };

    this.leaves = {
      verts: [],
      normals: [],
      indices: [],
      uvs: []
    }

    const rng = new RNG(this.params.seed);

    // Create the trunk of the tree first
    this.trunk = this.#generateBranch(
      rng,
      new THREE.Vector3(),
      new THREE.Euler(),
      this.params.trunk.length,
      this.params.trunk.radius
    );

    this.#createBranchesGeometry();
    this.#createLeavesGeometry();
  }

  /**
   * Generates the geometry for the branches
   */
  #createBranchesGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.branches.verts), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.branches.normals), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.branches.uvs), 2));
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(this.branches.indices), 1));
    g.computeBoundingSphere();

    const mat = new THREE.MeshLambertMaterial({
      name: 'branches',
      flatShading: this.params.trunk.flatShading,
      color: this.params.trunk.color
    });

    if (this.params.trunk.textured) {
      mat.map = barkTexture;
    }

    this.branchesMesh.geometry.dispose();
    this.branchesMesh.geometry = g;
    this.branchesMesh.material.dispose();
    this.branchesMesh.material = mat;
    this.branchesMesh.castShadow = true;
    this.branchesMesh.receiveShadow = true;
  }

  /**
   * Generates the geometry for the leaves
   */
  #createLeavesGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.leaves.verts), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.leaves.uvs), 2));
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(this.leaves.indices), 1));
    g.computeVertexNormals();
    g.computeBoundingSphere();

    const mat = new THREE.MeshLambertMaterial({
      name: 'leaves',
      color: this.params.leaves.color,
      side: THREE.DoubleSide,
      map: leafTextures[this.params.leaves.type],
      transparent: true,
      opacity: this.params.leaves.opacity,
      alphaTest: this.params.leaves.alphaTest
    });

    this.leavesMesh.geometry.dispose();
    this.leavesMesh.geometry = g;
    this.leavesMesh.material.dispose();
    this.leavesMesh.material = mat;
    this.leavesMesh.castShadow = true;
    this.leavesMesh.receiveShadow = true;
  }

  /**
   * Generates a new branch
   * @param {RNG} rng Instance of a random number generator
   * @param {THREE.Vector3} origin The starting point of the branch
   * @param {THREE.Euler} orientation The starting orientation of the branch
   * @param {number} length The length of the branch
   * @param {number} radius The radius of the branch at its starting point
   */
  #generateBranch(rng, origin, orientation, length, radius, level = 1) {
    // Used later for geometry index generation
    const indexOffset = (this.branches.verts.length / 3);

    // Clone the orientation since we will be modifying it later on
    let sectionOrientation = orientation.clone();

    // This information is used for generating child branches after the branch
    // geometry has been constructed
    let sections = [];

    // Compute the vertices for each section of the branch.
    // A branch is a bunch of interconnected cylinders, so we build it one ring of vertices at a time
    let sectionOrigin = origin.clone();
    for (let i = 0; i <= this.params.geometry.sections; i++) {
      let sectionRadius = radius;

      // If final section of final level, set radius to effecively zero
      if (level === this.params.branch.levels && i === this.params.geometry.sections) {
        sectionRadius = 0.01;
      } else {
        // Taper the branch with each successive section based on the taper factor
        sectionRadius *= (1 - this.params.branch.taper * (i / this.params.geometry.sections));
      }

      // Create the segments that make up this section.
      let first;
      for (let j = 0; j < this.params.geometry.segments; j++) {
        let angle = (2.0 * Math.PI * j) / this.params.geometry.segments;

        // Randomize the vertices a bit to make the triangles more irregular
        // Don't modify the vertices in the last section or the final child branch won't line up
        if (i > 0 && i < this.params.geometry.sections) {
          angle += rng.random(this.params.geometry.randomization, -this.params.geometry.randomization);
        }

        // Vary the section radius by a random amount to give some variance in the tree diameter
        // Don't modify the vertices in the last section or the final child branch won't line up
        let segmentRadius = sectionRadius;
        if (i > 0 && i < this.params.geometry.sections) {
          segmentRadius *= (1 + rng.random(this.params.geometry.radiusVariance, -this.params.geometry.radiusVariance));
        }

        // Create the segment vertex
        const vertex = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .multiplyScalar(segmentRadius)
          .applyEuler(sectionOrientation)
          .add(sectionOrigin);

        const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .applyEuler(sectionOrientation)
          .normalize();

        const uv = new THREE.Vector2(
          j / this.params.geometry.segments,
          i / this.params.geometry.sections);

        this.branches.verts.push(...Object.values(vertex));
        this.branches.normals.push(...Object.values(normal));
        this.branches.uvs.push(...Object.values(uv));

        if (j === 0) {
          first = { vertex, normal, uv };
        }
      }

      // Duplicate the first vertex so there is continuity in the UV mapping
      this.branches.verts.push(...Object.values(first.vertex));
      this.branches.normals.push(...Object.values(first.normal));
      this.branches.uvs.push(1, first.uv.y);

      // Use this information later on when generating child branches
      sections.push({
        origin: sectionOrigin.clone(),
        orientation: sectionOrientation.clone(),
        radius: sectionRadius
      });

      // Move to origin to the next section's origin
      let sectionLength = (length / this.params.geometry.sections) *
        (1 + rng.random(this.params.geometry.lengthVariance, -this.params.geometry.lengthVariance));

      sectionOrigin.add(new THREE.Vector3(0, sectionLength, 0).applyEuler(sectionOrientation));

      // Perturb the orientation of the next section randomly. The higher the
      // gnarliness, the larger potential perturbation
      const gnarliness = this.params.branch.gnarliness;
      sectionOrientation.x += rng.random(gnarliness, -gnarliness);
      sectionOrientation.z += rng.random(gnarliness, -gnarliness);

      // Apply growth force to the branch
      const qSection = new THREE.Quaternion().setFromEuler(sectionOrientation);
      const qTwist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.params.branch.twist);
      const qForce = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.params.branch.force.direction);
      qSection.multiply(qTwist);
      qSection.rotateTowards(qForce, this.params.branch.force.strength / sectionRadius);
      sectionOrientation.setFromQuaternion(qSection);
    }

    this.#generateChildBranches(rng, level, sections, length);
    this.#generateBranchIndices(indexOffset);
  }

  /**
   * Generates a leaves 
   * @param {RNG} rng Instance of a random number generator
   * @param {THREE.Vector3} origin The starting point of the branch
   * @param {THREE.Euler} orientation The starting orientation of the branch
   */
  #generateLeaf(rng, origin, orientation, rotate90 = false) {
    const i = this.leaves.verts.length / 3;

    // Width and length of the leaf quad
    let leafSize = this.params.leaves.size *
      (1 + rng.random(this.params.leaves.sizeVariance, -this.params.leaves.sizeVariance));

    const W = leafSize;
    const L = 1.5 * leafSize;

    const localRotation = new THREE.Euler(0, rotate90 ? Math.PI / 2 : 0, 0);

    // Create quad vertices
    const v = [
      new THREE.Vector3(-W / 2, L, 0),
      new THREE.Vector3(-W / 2, 0, 0),
      new THREE.Vector3(W / 2, 0, 0),
      new THREE.Vector3(W / 2, L, 0)
    ].map(v => v.applyEuler(localRotation).applyEuler(orientation).add(origin));

    this.leaves.verts.push(
      v[0].x, v[0].y, v[0].z,
      v[1].x, v[1].y, v[1].z,
      v[2].x, v[2].y, v[2].z,
      v[3].x, v[3].y, v[3].z
    );

    const n = new THREE.Vector3(0, 0, 1).applyEuler(orientation);
    this.leaves.normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
    this.leaves.uvs.push(0, 1, 0, 0, 1, 0, 1, 1);
    this.leaves.indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }

  /**
   * Logic for spawning child branches from a parent branch's section
   * @param {RNG} rng
   * @param {number} level The level of the parent branch
   * @param {{
   *  origin: THREE.Vector3,
   *  orientation: THREE.Euler,
   *  radius: number
   * }[]} sections The parent branch's sections
   * @param {number} parentLength The length of the parent branch
   * @returns 
   */
  #generateChildBranches(rng, level, sections, parentLength) {
    if (level > this.params.branch.levels) return;

    // Randomly determine the number of child branches to sprout from this tree
    const childBranchCount = (level === this.params.branch.levels)
      ? this.params.leaves.count
      // One of the child branches is used to cap the parent branch
      : this.params.branch.children - 1;

    const radialOffset = rng.random();

    for (let i = 0; i <= childBranchCount; i++) {
      let childBranchOrigin;
      let childBranchOrientation;
      let childBranchRadius;
      if (i < childBranchCount) {
        // Determine how far along the length of the parent branch the child
        // branch should originate from (0 to 1)
        let childBranchStart;
        if (level === this.params.branch.levels) {
          childBranchStart = rng.random(1.0, this.params.leaves.start);
        } else {
          childBranchStart = rng.random(this.params.branch.stop, this.params.branch.start);
        }

        // Find which sections are on either side of the child branch origin point
        // so we can determine the origin, orientation and radius of the branch
        let sectionIndex = Math.floor(childBranchStart * (sections.length - 1));
        let sectionA, sectionB;
        sectionA = sections[sectionIndex]
        if (sectionIndex === sections.length - 1) {
          sectionB = sectionA;
        } else {
          sectionB = sections[sectionIndex + 1];
        }

        // Find normalized distance from section A to section B (0 to 1)
        let alpha = (childBranchStart - (sectionIndex / (sections.length - 1))) / (1 / (sections.length - 1));

        // Linearly interpolate origin from section A to section B
        childBranchOrigin = new THREE.Vector3().lerpVectors(sectionA.origin, sectionB.origin, alpha);

        // Linearly interpolate radius
        childBranchRadius = this.params.branch.radiusMultiplier *
          ((1 - alpha) * sectionA.radius + alpha * sectionB.radius);

        // Linearlly interpolate the orientation
        let qA = new THREE.Quaternion().setFromEuler(sectionA.orientation);
        let qB = new THREE.Quaternion().setFromEuler(sectionB.orientation);
        childBranchOrientation = new THREE.Euler().setFromQuaternion(qB.slerp(qA, alpha));

        // Calculate the angle offset from the parent branch and the radial angle
        const angleOffset = rng.random(this.params.branch.angleVariance, -this.params.branch.angleVariance);
        const radialAngle = 2.0 * Math.PI * (radialOffset + (i / childBranchCount));
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.params.branch.angle + angleOffset);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radialAngle);
        const q3 = new THREE.Quaternion().setFromEuler(childBranchOrientation);

        childBranchOrientation = new THREE.Euler().setFromQuaternion(q3.multiply(q2.multiply(q1)));
      } else {
        // Parent section this child branch is sprouting from
        let sectionIndex = sections.length - 1;
        let section = sections[sectionIndex];
        childBranchOrigin = section.origin.clone();
        childBranchOrientation = section.orientation.clone();
        childBranchRadius = section.radius;
      }

      let childBranchLength = parentLength * (this.params.branch.lengthMultiplier +
        rng.random(this.params.branch.lengthVariance, -this.params.branch.lengthVariance));

      if (level === this.params.branch.levels) {
        this.#generateLeaf(
          rng,
          childBranchOrigin,
          childBranchOrientation
        );

        if (this.params.leaves.billboard === Billboard.Double) {
          this.#generateLeaf(
            rng,
            childBranchOrigin,
            childBranchOrientation,
            true
          );
        }
      } else {
        this.#generateBranch(
          rng,
          childBranchOrigin,
          childBranchOrientation,
          childBranchLength,
          childBranchRadius,
          level + 1
        );
      }
    }
  }

  /**
   * Generates the indexes for the geometry of the most recently created branch
   * @param {number} indexOffset 
   */
  #generateBranchIndices(indexOffset) {
    // Build geometry each section of the branch (cylinder without end caps)
    let v1, v2, v3, v4;
    const N = this.params.geometry.segments + 1;
    for (let i = 0; i < this.params.geometry.sections; i++) {
      // Build the quad for each segment of the section
      for (let j = 0; j < this.params.geometry.segments; j++) {
        v1 = indexOffset + (i * N) + j;
        // The last segment wraps around back to the starting segment, so omit j + 1 term
        v2 = indexOffset + (i * N) + (j + 1);
        v3 = v1 + N;
        v4 = v2 + N;
        this.branches.indices.push(v1, v3, v2, v2, v3, v4);
      }
    }
  }
}