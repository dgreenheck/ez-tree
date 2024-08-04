import * as THREE from 'three';
import RNG from './rng';
import { Branch } from './branch';

import barkSrc from './textures/bark/aspen.png';

// Leaf textures
import leavesAsh from './textures/leaves/ash.png';
import leavesAspen from './textures/leaves/aspen.png';
import leavesBeech from './textures/leaves/beech.png';
import leavesEvergreen from './textures/leaves/evergreen.png';
import leavesOak from './textures/leaves/oak.png';

export const Billboard = {
  Single: 'single',
  Double: 'double',
};

export const LeafType = {
  Ash: 'ash',
  Aspen: 'aspen',
  Beech: 'beech',
  Evergreen: 'evergreen',
  Oak: 'oak',
};

export const TreeType = {
  Deciduous: 'deciduous',
  Evergreen: 'evergreen',
};

const loader = new THREE.TextureLoader();

function loadTexture(path) {
  return loader.load(
    path,
    /**
     * @param {THREE.Texture} tex
     */
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    },
  );
}
const barkTexture = loadTexture(barkSrc);

const leafTextures = {
  ash: loadTexture(leavesAsh),
  aspen: loadTexture(leavesAspen),
  beech: loadTexture(leavesBeech),
  evergreen: loadTexture(leavesEvergreen),
  oak: loadTexture(leavesOak),
};

const TreeParams = {
  seed: 49424,
  type: TreeType.Deciduous,

  trunk: {
    color: 0xd59d63, // Color of the tree trunk
    flatShading: false, // Use face normals for shading instead of vertex normals
    textured: true, // Apply texture to bark
    length: 25, // Length of the trunk
    radius: 1, // Starting radius of the trunk
  },

  branch: {
    sections: {
      // Number of sections per branch level
      1: 8,
      2: 6,
      3: 4,
      4: 2,
    },
    segments: {
      // Number of radial segments per branch level (min 3)
      1: 8,
      2: 6,
      3: 4,
      4: 3,
    },
    levels: 3, // Number of branch recursions
    children: 5, // Number of child branches at each level
    start: 0.3, // Defines where child branches start forming on the parent branch
    angle: Math.PI / 3, // Angle of the child branches relative to the parent branch (radians)
    lengthMultiplier: 0.7, // Length of child branch relative to parent
    radiusMultiplier: 0.5, // Radius of child branch relative to parent
    taper: 0.6, // Radius of end of branch relative to the start of the branch
    gnarliness: 0.2, // Max amplitude of random angle added to each section's orientation
    twist: 0.2,
    force: {
      direction: new THREE.Vector3(0, 1, 0),
      strength: 0.02,
    },
  },

  leaves: {
    billboard: Billboard.Double,
    type: LeafType.Oak,
    count: 30,
    start: 0,
    size: 1.75,
    sizeVariance: 0.7,
    color: 0x8b8f68,
    alphaTest: 0.5,
  },
};

export class Tree extends THREE.Group {
  /**
   * @type {RNG}
   */
  rng;

  /**
   * @type {TreeParams}
   */
  params;

  /**
   * @type {Branch[]}
   */
  branchQueue = [];

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
      uvs: [],
    };

    this.leaves = {
      verts: [],
      normals: [],
      indices: [],
      uvs: [],
    };

    this.rng = new RNG(this.params.seed);

    // Create the trunk of the tree first
    this.branchQueue.push(
      new Branch(
        new THREE.Vector3(),
        new THREE.Euler(),
        this.params.trunk.length,
        this.params.trunk.radius,
        1,
        this.params.branch.sections[1],
        this.params.branch.segments[1],
      ),
    );

    while (this.branchQueue.length > 0) {
      const branch = this.branchQueue.shift();
      this.#generateBranch(branch);
    }

    this.#createBranchesGeometry();
    this.#createLeavesGeometry();
  }

  /**
   * Generates a new branch
   * @param {Branch} branch
   * @returns
   */
  #generateBranch(branch) {

    if (branch.level > this.params.branch.levels) return;

    // Used later for geometry index generation
    const indexOffset = this.branches.verts.length / 3;

    let sectionOrientation = branch.orientation.clone();
    let sectionOrigin = branch.origin.clone();

    // This information is used for generating child branches after the branch
    // geometry has been constructed
    let sections = [];

    for (let i = 0; i <= branch.sectionCount; i++) {
      let sectionRadius = branch.radius;

      // If final section of final level, set radius to effecively zero
      if (
        i === branch.sectionCount &&
        branch.level === this.params.branch.levels
      ) {
        sectionRadius = 0.01;
      } else {
        // Taper the branch with each successive section based on the taper factor
        sectionRadius *=
          1 - this.params.branch.taper * (i / branch.sectionCount);
      }

      // Create the segments that make up this section.
      let first;
      for (let j = 0; j < branch.segmentCount; j++) {
        let angle = (2.0 * Math.PI * j) / branch.segmentCount;

        // Create the segment vertex
        const vertex = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .multiplyScalar(sectionRadius)
          .applyEuler(sectionOrientation)
          .add(sectionOrigin);

        const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .applyEuler(sectionOrientation)
          .normalize();

        const uv = new THREE.Vector2(
          j / branch.segmentCount,
          i / branch.sectionCount,
        );

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
        radius: sectionRadius,
      });

      // Move to origin to the next section's origin
      let sectionLength =
        branch.length /
        branch.sectionCount /
        (this.params.type === 'Deciduous' ? this.params.branch.levels - 1 : 1);

      sectionOrigin.add(
        new THREE.Vector3(0, sectionLength, 0).applyEuler(sectionOrientation),
      );

      // Perturb the orientation of the next section randomly. The higher the
      // gnarliness, the larger potential perturbation
      const gnarliness =
        Math.max(1, 1 / Math.sqrt(sectionRadius)) *
        this.params.branch.gnarliness;

      sectionOrientation.x += this.rng.random(gnarliness, -gnarliness);
      sectionOrientation.z += this.rng.random(gnarliness, -gnarliness);

      // Apply growth force to the branch
      const qSection = new THREE.Quaternion().setFromEuler(sectionOrientation);

      const qTwist = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.params.branch.twist,
      );

      const qForce = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        this.params.branch.force.direction,
      );

      qSection.multiply(qTwist);
      qSection.rotateTowards(
        qForce,
        this.params.branch.force.strength / sectionRadius,
      );

      sectionOrientation.setFromQuaternion(qSection);
    }

    this.#generateBranchIndices(indexOffset, branch);

    if (this.params.type === 'deciduous') {
      const lastSection = sections[sections.length - 1];

      if (branch.level < this.params.branch.levels) {
        this.branchQueue.push(
          new Branch(
            lastSection.origin,
            lastSection.orientation,
            this.params.branch.lengthMultiplier * branch.length,
            lastSection.radius,
            branch.level + 1,
            // Section count and segment count must be same as parent branch
            // since the child branch is growing from the end of the parent branch
            branch.sectionCount,
            branch.segmentCount,
          ),
        );
      } else {
        this.#generateLeaf(lastSection.origin, lastSection.orientation);
      }
    }

    this.#generateChildBranches(branch.level, sections, branch.length);
  }

  /**
   * Generates a leaves
   * @param {THREE.Vector3} origin The starting point of the branch
   * @param {THREE.Euler} orientation The starting orientation of the branch
   */
  #generateLeaf(origin, orientation) {
    let i = this.leaves.verts.length / 3;

    // Width and length of the leaf quad
    let leafSize =
      this.params.leaves.size *
      (1 +
        this.rng.random(
          this.params.leaves.sizeVariance,
          -this.params.leaves.sizeVariance,
        ));

    const W = leafSize;
    const L = 1.5 * leafSize;

    const createLeaf = (rotation) => {
      // Create quad vertices
      const v = [
        new THREE.Vector3(-W / 2, L, 0),
        new THREE.Vector3(-W / 2, 0, 0),
        new THREE.Vector3(W / 2, 0, 0),
        new THREE.Vector3(W / 2, L, 0),
      ].map((v) =>
        v
          .applyEuler(new THREE.Euler(0, rotation, 0))
          .applyEuler(orientation)
          .add(origin),
      );

      this.leaves.verts.push(
        v[0].x,
        v[0].y,
        v[0].z,
        v[1].x,
        v[1].y,
        v[1].z,
        v[2].x,
        v[2].y,
        v[2].z,
        v[3].x,
        v[3].y,
        v[3].z,
      );

      const n = new THREE.Vector3(0, 0, 1).applyEuler(orientation);
      this.leaves.normals.push(
        n.x,
        n.y,
        n.z,
        n.x,
        n.y,
        n.z,
        n.x,
        n.y,
        n.z,
        n.x,
        n.y,
        n.z,
      );
      this.leaves.uvs.push(0, 1, 0, 0, 1, 0, 1, 1);
      this.leaves.indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
      i += 4;
    };

    createLeaf(0);
    if (this.params.leaves.billboard === Billboard.Double) {
      createLeaf(Math.PI / 2);
    }
  }

  /**
   * Logic for spawning child branches from a parent branch's section
   * @param {number} level The level of the parent branch
   * @param {{
   *  origin: THREE.Vector3,
   *  orientation: THREE.Euler,
   *  radius: number
   * }[]} sections The parent branch's sections
   * @param {number} parentLength The length of the parent branch
   * @returns
   */
  #generateChildBranches(level, sections, parentLength) {
    // Randomly determine the number of child branches to sprout from this tree
    const childBranchCount =
      level === this.params.branch.levels
        ? this.params.leaves.count
        : // One of the child branches is used to cap the parent branch
        this.params.branch.children - 1;

    const radialOffset = this.rng.random();

    for (let i = 0; i < childBranchCount; i++) {
      // Determine how far along the length of the parent branch the child
      // branch should originate from (0 to 1)
      let childBranchStart;

      if (level === this.params.branch.levels) {
        childBranchStart = this.rng.random(1.0, this.params.leaves.start);
      } else {
        childBranchStart = this.rng.random(1.0, this.params.branch.start);
      }

      // Find which sections are on either side of the child branch origin point
      // so we can determine the origin, orientation and radius of the branch
      const sectionIndex = Math.floor(childBranchStart * (sections.length - 1));
      let sectionA, sectionB;
      sectionA = sections[sectionIndex];
      if (sectionIndex === sections.length - 1) {
        sectionB = sectionA;
      } else {
        sectionB = sections[sectionIndex + 1];
      }

      // Find normalized distance from section A to section B (0 to 1)
      const alpha =
        (childBranchStart - sectionIndex / (sections.length - 1)) /
        (1 / (sections.length - 1));

      // Linearly interpolate origin from section A to section B
      const childBranchOrigin = new THREE.Vector3().lerpVectors(
        sectionA.origin,
        sectionB.origin,
        alpha,
      );

      // Linearly interpolate radius
      const childBranchRadius =
        this.params.branch.radiusMultiplier *
        ((1 - alpha) * sectionA.radius + alpha * sectionB.radius);

      // Linearlly interpolate the orientation
      const qA = new THREE.Quaternion().setFromEuler(sectionA.orientation);
      const qB = new THREE.Quaternion().setFromEuler(sectionB.orientation);
      const parentOrientation = new THREE.Euler().setFromQuaternion(
        qB.slerp(qA, alpha),
      );

      // Calculate the angle offset from the parent branch and the radial angle
      const radialAngle = 2.0 * Math.PI * (radialOffset + i / childBranchCount);
      const q1 = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        this.params.branch.angle,
      );
      const q2 = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        radialAngle,
      );
      const q3 = new THREE.Quaternion().setFromEuler(parentOrientation);

      const childBranchOrientation = new THREE.Euler().setFromQuaternion(
        q3.multiply(q2.multiply(q1)),
      );

      let childBranchLength =
        this.params.branch.lengthMultiplier *
        parentLength *
        (this.params.type === TreeType.Evergreen
          ? 1.0 - childBranchStart
          : 1.0);

      if (level === this.params.branch.levels) {
        this.#generateLeaf(childBranchOrigin, childBranchOrientation);
      } else {
        this.branchQueue.push(
          new Branch(
            childBranchOrigin,
            childBranchOrientation,
            childBranchLength,
            childBranchRadius,
            level + 1,
            this.params.branch.sections[level + 1],
            this.params.branch.segments[level + 1],
          ),
        );
      }
    }
  }

  /**
   * Generates the indices for branch geometry
   * @param {Branch} branch
   */
  #generateBranchIndices(indexOffset, branch) {
    // Build geometry each section of the branch (cylinder without end caps)
    let v1, v2, v3, v4;
    const N = branch.segmentCount + 1;
    for (let i = 0; i < branch.sectionCount; i++) {
      // Build the quad for each segment of the section
      for (let j = 0; j < branch.segmentCount; j++) {
        v1 = indexOffset + i * N + j;
        // The last segment wraps around back to the starting segment, so omit j + 1 term
        v2 = indexOffset + i * N + (j + 1);
        v3 = v1 + N;
        v4 = v2 + N;
        this.branches.indices.push(v1, v3, v2, v2, v3, v4);
      }
    }
  }

  /**
   * Generates the geometry for the branches
   */
  #createBranchesGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.branches.verts), 3),
    );
    g.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(this.branches.normals), 3),
    );
    g.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(this.branches.uvs), 2),
    );
    g.setIndex(
      new THREE.BufferAttribute(new Uint16Array(this.branches.indices), 1),
    );
    g.computeBoundingSphere();

    const mat = new THREE.MeshLambertMaterial({
      name: 'branches',
      flatShading: this.params.trunk.flatShading,
      color: this.params.trunk.color,
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
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.leaves.verts), 3),
    );
    g.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(this.leaves.uvs), 2),
    );
    g.setIndex(
      new THREE.BufferAttribute(new Uint16Array(this.leaves.indices), 1),
    );
    g.computeVertexNormals();
    g.computeBoundingSphere();

    const mat = new THREE.MeshLambertMaterial({
      name: 'leaves',
      color: this.params.leaves.color,
      side: THREE.DoubleSide,
      map: leafTextures[this.params.leaves.type],
      transparent: true,
      alphaTest: this.params.leaves.alphaTest,
    });

    this.leavesMesh.geometry.dispose();
    this.leavesMesh.geometry = g;
    this.leavesMesh.material.dispose();
    this.leavesMesh.material = mat;
    this.leavesMesh.castShadow = true;
    this.leavesMesh.receiveShadow = true;
  }
}
