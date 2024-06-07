import * as THREE from 'three';
import RNG from './rng';

const loader = new THREE.TextureLoader();

function loadTexture(path) {
  return loader.load(path, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });
}
const barkTexture = loadTexture(`textures/bark/bark.png`);

const leafTextures = [
  loadTexture(`textures/leaves/ash.png`),
  loadTexture(`textures/leaves/aspen.png`),
  loadTexture(`textures/leaves/oak.png`)
];

export const LeafStyle = {
  Single: 0,
  Double: 1
};

export const LeafType = {
  Ash: 0,
  Aspen: 1,
  Oak: 2
};

export class Tree extends THREE.Group {

  constructor(params) {
    super();
    this.params = params;

    this.branchesMesh = new THREE.Mesh();
    this.leavesMesh = new THREE.Mesh();
    this.add(this.branchesMesh);
    this.add(this.leavesMesh);

    this.generate();
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

    const vertexCount = (this.branches.verts.length + this.leaves.verts.length) / 3;
    const triangleCount = (this.branches.indices.length + this.leaves.indices.length) / 3;
    document.getElementById('model-info').innerText = `Vertex Count: ${vertexCount} | Triangle Count: ${triangleCount}`;
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
      emissive: this.params.leaves.color,
      emissiveIntensity: this.params.leaves.emissive,
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

      // If creating trunk branch, flare the base of the trunk
      if (level === 1) {
        sectionRadius += this.params.trunk.flare / (i + 1);
      }

      // Taper the branch with each successive section based on the taper factor
      sectionRadius *= (1 - this.params.branch.taper * (i / this.params.geometry.sections));

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

        segmentRadius *= Math.pow(this.params.maturity, 2);

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
      sectionLength *= Math.min(1.0, sectionLength * (this.params.maturity));

      if (level > 1 && i < this.params.geometry.sections - 1) {
        sectionLength = Math.max(0, sectionLength * (this.params.maturity - 0.5) * 2.0)
      }

      sectionOrigin.add(new THREE.Vector3(0, sectionLength, 0).applyEuler(sectionOrientation));

      // Perturb the orientation of the next section randomly. The higher the
      // gnarliness, the larger potential perturbation
      const gnarliness = this.params.maturity * (this.params.branch.gnarliness + this.params.branch.gnarliness1_R / sectionRadius);
      sectionOrientation.x += rng.random(gnarliness, -gnarliness);
      sectionOrientation.z += rng.random(gnarliness, -gnarliness);

      // Apply sun force to the branch
      const qSection = new THREE.Quaternion().setFromEuler(sectionOrientation);
      const qTwist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.params.branch.twist);
      const qForce = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.params.sun.direction);
      qSection.multiply(qTwist);
      qSection.rotateTowards(qForce, this.params.sun.strength / sectionRadius);
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
    leafSize = Math.max(0, leafSize * (this.params.maturity - 0.75) * 4.0);

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
   * }} sections The parent branch's sections
   * @param {*} parentLength The length of the parent branch
   * @returns 
   */
  #generateChildBranches(rng, level, sections, parentLength) {
    if (level > this.params.branch.levels) return;

    // Randomly determine the number of child branches to sprout from this tree
    const minBranches = (level === this.params.branch.levels) ? this.params.leaves.minCount : this.params.branch.minChildren;
    const maxBranches = (level === this.params.branch.levels) ? this.params.leaves.maxCount : this.params.branch.maxChildren;
    const childBranchCount = Math.round(rng.random() * (maxBranches - minBranches)) + minBranches;

    // Calculate the separation angle between branches
    const branchSepAngle = this.params.branch.sweepAngle / (childBranchCount - 1);

    for (let i = 0; i < childBranchCount; i++) {
      // Figure out a random tree section to grow from
      let sectionIndex = 0;
      if (i < childBranchCount - 1) {
        let startIndex = this.params.geometry.sections * this.params.branch.start;
        let endIndex = this.params.geometry.sections * this.params.branch.stop;
        sectionIndex = Math.floor(rng.random() * (endIndex - startIndex) + startIndex);
      } else {
        // Force the last branch to always come out of the last ring
        sectionIndex = sections.length - 1;
      }

      // Parent section this child branch is sprouting from
      let section = sections[sectionIndex];

      // All but the last branches use the separation angle
      const offset = rng.random(2 * Math.PI);
      let childBranchRadius = section.radius;
      if (i < childBranchCount - 1) {
        const r1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.params.maturity * this.params.branch.sweepAngle / 2, 0, 0));
        const r2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, offset + i * branchSepAngle, 0));
        const r3 = new THREE.Quaternion().setFromEuler(section.orientation);

        // Branch X angle is half the angle sweep + the separation angle
        section.orientation = new THREE.Euler().setFromQuaternion(r3.multiply(r2.multiply(r1)));

        // Reduce the radius of the child branch so the starting end doesn't extend
        // outside the bounds of the parent branch
        childBranchRadius *= this.params.branch.radiusMultiplier
      }

      let childBranchLength = parentLength * (this.params.branch.lengthMultiplier +
        rng.random(this.params.branch.lengthVariance, -this.params.branch.lengthVariance));

      if (level === this.params.branch.levels) {
        this.#generateLeaf(
          rng,
          section.origin,
          section.orientation.clone()
        );

        if (this.params.leaves.style === LeafStyle.Double) {
          this.#generateLeaf(
            rng,
            section.origin,
            section.orientation.clone(),
            true
          );
        }
      } else {
        this.#generateBranch(
          rng,
          section.origin,
          section.orientation.clone(),
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