import * as THREE from 'three';
import RNG from './rng';
import { Branch } from './branch';
import { Billboard, TreeType } from './enums';
import TreeOptions from './options';
import { loadPreset } from './presets/index';
import { getBarkTexture, getLeafTexture } from './textures';

export class Tree extends THREE.Group {
  /**
   * @type {RNG}
   */
  rng;

  /**
   * @type {TreeOptions}
   */
  options;

  /**
   * @type {Branch[]}
   */
  branchQueue = [];

  /**
   * @param {TreeOptions} params
   */
  constructor(options = new TreeOptions()) {
    super();
    this.name = 'Tree';
    this.branchesMesh = new THREE.Mesh();
    this.leavesMesh = new THREE.Mesh();
    this.add(this.branchesMesh);
    this.add(this.leavesMesh);
    this.options = options;
  }

  update(elapsedTime) {
    const leafShader = this.leavesMesh.material.userData.shader;
    if (leafShader) {
      leafShader.uniforms.uTime.value = elapsedTime;
    }
  }

  /**
   * Loads a preset tree from JSON 
   * @param {string} preset 
   */
  loadPreset(name) {
    const json = loadPreset(name);
    this.loadFromJson(json);
  }

  /**
   * Loads a tree from JSON
   * @param {TreeOptions} json 
   */
  loadFromJson(json) {
    this.options.copy(json);
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
      uvs: [],
      windFactor: []
    };

    this.leaves = {
      verts: [],
      normals: [],
      indices: [],
      uvs: [],
    };

    this.rng = new RNG(this.options.seed);

    // Create the trunk of the tree first
    this.branchQueue.push(
      new Branch(
        new THREE.Vector3(),
        new THREE.Euler(),
        this.options.branch.length[0],
        this.options.branch.radius[0],
        0,
        this.options.branch.sections[0],
        this.options.branch.segments[0],
      ),
    );

    while (this.branchQueue.length > 0) {
      const branch = this.branchQueue.shift();
      this.generateBranch(branch);
    }

    this.createBranchesGeometry();
    this.createLeavesGeometry();
  }

  /**
   * Generates a new branch
   * @param {Branch} branch
   * @returns
   */
  generateBranch(branch) {
    // Used later for geometry index generation
    const indexOffset = this.branches.verts.length / 3;

    let sectionOrientation = branch.orientation.clone();
    let sectionOrigin = branch.origin.clone();
    let sectionLength =
      branch.length /
      branch.sectionCount /
      (this.options.type === 'Deciduous' ? this.options.branch.levels - 1 : 1);

    // This information is used for generating child branches after the branch
    // geometry has been constructed
    let sections = [];

    for (let i = 0; i <= branch.sectionCount; i++) {
      let sectionRadius = branch.radius;

      // If final section of final level, set radius to effecively zero
      if (
        i === branch.sectionCount &&
        branch.level === this.options.branch.levels
      ) {
        sectionRadius = 0.001;
      } else if (this.options.type === TreeType.Deciduous) {
        sectionRadius *=
          1 - this.options.branch.taper[branch.level] * (i / branch.sectionCount);
      } else if (this.options.type === TreeType.Evergreen) {
        // Evergreens do not have a terminal branch so they have a taper of 1
        sectionRadius *= 1 - (i / branch.sectionCount);
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
          (i % 2 === 0) ? 0 : 1,
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

      sectionOrigin.add(
        new THREE.Vector3(0, sectionLength, 0).applyEuler(sectionOrientation),
      );

      // Perturb the orientation of the next section randomly. The higher the
      // gnarliness, the larger potential perturbation
      const gnarliness =
        Math.max(1, 1 / Math.sqrt(sectionRadius)) *
        this.options.branch.gnarliness[branch.level];

      sectionOrientation.x += this.rng.random(gnarliness, -gnarliness);
      sectionOrientation.z += this.rng.random(gnarliness, -gnarliness);

      // Apply growth force to the branch
      const qSection = new THREE.Quaternion().setFromEuler(sectionOrientation);

      const qTwist = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.options.branch.twist[branch.level],
      );

      const qForce = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().copy(this.options.branch.force.direction),
      );

      qSection.multiply(qTwist);
      qSection.rotateTowards(
        qForce,
        this.options.branch.force.strength / sectionRadius,
      );

      sectionOrientation.setFromQuaternion(qSection);
    }

    this.generateBranchIndices(indexOffset, branch);

    // Deciduous trees have a terminal branch that grows out of the
    // end of the parent branch
    if (this.options.type === 'deciduous') {
      const lastSection = sections[sections.length - 1];

      if (branch.level < this.options.branch.levels) {
        this.branchQueue.push(
          new Branch(
            lastSection.origin,
            lastSection.orientation,
            this.options.branch.length[branch.level + 1],
            lastSection.radius,
            branch.level + 1,
            // Section count and segment count must be same as parent branch
            // since the child branch is growing from the end of the parent branch
            branch.sectionCount,
            branch.segmentCount,
          ),
        );
      } else {
        this.generateLeaf(lastSection.origin, lastSection.orientation);
      }
    }

    // If we are on the last branch level, generate leaves
    if (branch.level === this.options.branch.levels) {
      this.generateLeaves(sections);
    } else if (branch.level < this.options.branch.levels) {
      this.generateChildBranches(
        this.options.branch.children[branch.level],
        branch.level + 1,
        sections);
    }
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
  generateChildBranches(count, level, sections) {
    const radialOffset = this.rng.random();

    for (let i = 0; i < count; i++) {
      // Determine how far along the length of the parent branch the child
      // branch should originate from (0 to 1)
      let childBranchStart = this.rng.random(1.0, this.options.branch.start[level]);

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
        this.options.branch.radius[level] *
        ((1 - alpha) * sectionA.radius + alpha * sectionB.radius);

      // Linearlly interpolate the orientation
      const qA = new THREE.Quaternion().setFromEuler(sectionA.orientation);
      const qB = new THREE.Quaternion().setFromEuler(sectionB.orientation);
      const parentOrientation = new THREE.Euler().setFromQuaternion(
        qB.slerp(qA, alpha),
      );

      // Calculate the angle offset from the parent branch and the radial angle
      const radialAngle = 2.0 * Math.PI * (radialOffset + i / count);
      const q1 = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        this.options.branch.angle[level] / (180 / Math.PI),
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
        this.options.branch.length[level] *
        (this.options.type === TreeType.Evergreen
          ? 1.0 - childBranchStart
          : 1.0);

      this.branchQueue.push(
        new Branch(
          childBranchOrigin,
          childBranchOrientation,
          childBranchLength,
          childBranchRadius,
          level,
          this.options.branch.sections[level],
          this.options.branch.segments[level],
        ),
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
  generateLeaves(sections) {
    const radialOffset = this.rng.random();

    for (let i = 0; i < this.options.leaves.count; i++) {
      // Determine how far along the length of the parent
      // branch the leaf should originate from (0 to 1)
      let leafStart = this.rng.random(1.0, this.options.leaves.start);

      // Find which sections are on either side of the child branch origin point
      // so we can determine the origin, orientation and radius of the branch
      const sectionIndex = Math.floor(leafStart * (sections.length - 1));
      let sectionA, sectionB;
      sectionA = sections[sectionIndex];
      if (sectionIndex === sections.length - 1) {
        sectionB = sectionA;
      } else {
        sectionB = sections[sectionIndex + 1];
      }

      // Find normalized distance from section A to section B (0 to 1)
      const alpha =
        (leafStart - sectionIndex / (sections.length - 1)) /
        (1 / (sections.length - 1));

      // Linearly interpolate origin from section A to section B
      const leafOrigin = new THREE.Vector3().lerpVectors(
        sectionA.origin,
        sectionB.origin,
        alpha,
      );

      // Linearlly interpolate the orientation
      const qA = new THREE.Quaternion().setFromEuler(sectionA.orientation);
      const qB = new THREE.Quaternion().setFromEuler(sectionB.orientation);
      const parentOrientation = new THREE.Euler().setFromQuaternion(
        qB.slerp(qA, alpha),
      );

      // Calculate the angle offset from the parent branch and the radial angle
      const radialAngle = 2.0 * Math.PI * (radialOffset + i / this.options.leaves.count);
      const q1 = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        this.options.leaves.angle / (180 / Math.PI),
      );
      const q2 = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        radialAngle,
      );
      const q3 = new THREE.Quaternion().setFromEuler(parentOrientation);

      const leafOrientation = new THREE.Euler().setFromQuaternion(
        q3.multiply(q2.multiply(q1)),
      );

      this.generateLeaf(leafOrigin, leafOrientation);
    }
  }

  /**
  * Generates a leaves
  * @param {THREE.Vector3} origin The starting point of the branch
  * @param {THREE.Euler} orientation The starting orientation of the branch
  */
  generateLeaf(origin, orientation) {
    let i = this.leaves.verts.length / 3;

    // Width and length of the leaf quad
    let leafSize =
      this.options.leaves.size *
      (1 +
        this.rng.random(
          this.options.leaves.sizeVariance,
          -this.options.leaves.sizeVariance,
        ));

    const W = leafSize;
    const L = leafSize;

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
    if (this.options.leaves.billboard === Billboard.Double) {
      createLeaf(Math.PI / 2);
    }
  }

  /**
   * Generates the indices for branch geometry
   * @param {Branch} branch
   */
  generateBranchIndices(indexOffset, branch) {
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
  createBranchesGeometry() {
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

    const mat = new THREE.MeshPhongMaterial({
      name: 'branches',
      flatShading: this.options.bark.flatShading,
      color: new THREE.Color(this.options.bark.tint),
    });

    if (this.options.bark.textured) {
      mat.aoMap = getBarkTexture(this.options.bark.type, 'ao', this.options.bark.textureScale);
      mat.map = getBarkTexture(this.options.bark.type, 'color', this.options.bark.textureScale);
      mat.normalMap = getBarkTexture(this.options.bark.type, 'normal', this.options.bark.textureScale);
      mat.roughnessMap = getBarkTexture(this.options.bark.type, 'roughness', this.options.bark.textureScale);
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
  createLeavesGeometry() {
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

    const mat = new THREE.MeshPhongMaterial({
      name: 'leaves',
      map: getLeafTexture(this.options.leaves.type),
      color: new THREE.Color(this.options.leaves.tint),
      side: THREE.DoubleSide,
      alphaTest: this.options.leaves.alphaTest,
      dithering: true
    });

    // Add custom shader code for branch swaying
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWindStrength = { value: new THREE.Vector3(0.5, 0, 0.5) };
      shader.uniforms.uWindFrequency = { value: 0.5 };
      shader.uniforms.uWindScale = { value: 70 };

      shader.vertexShader = `
        uniform float uTime;
        uniform vec3 uWindStrength;
        uniform float uWindFrequency;
        uniform float uWindScale;
        ` + shader.vertexShader;

      // Add code for simplex noise
      shader.vertexShader = shader.vertexShader.replace(
        `void main() {`,
        `
        // GLSL Simplex Noise 3D
        // Source: https://github.com/ashima/webgl-noise

        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
            return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Classic Simplex Noise 3D
        float simplex3(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0);
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx);

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //  x0 = x0 - 0. + 0.0 * C 
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0 * C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0 * C.x = -0.5

            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute( 
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to the mapping's singularity.
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 g0 = vec3(a0.xy,h.x);
            vec3 g1 = vec3(a0.zw,h.y);
            vec3 g2 = vec3(a1.xy,h.z);
            vec3 g3 = vec3(a1.zw,h.w);

            // Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(g0,g0), dot(g1,g1), dot(g2,g2), dot(g3,g3)));
            g0 *= norm.x;
            g1 *= norm.y;
            g2 *= norm.z;
            g3 *= norm.w;

            // Mix contributions from the four corners
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(g0,x0), dot(g1,x1), 
                                          dot(g2,x2), dot(g3,x3) ) );
        }
          
        void main() {`,
      );

      shader.vertexShader = shader.vertexShader.replace(
        `#include <project_vertex>`,
        `
        vec4 mvPosition = vec4(transformed, 1.0);

        float windOffset = 2.0 * 3.14 * simplex3(mvPosition.xyz / uWindScale);
        vec3 windSway = uv.y * uWindStrength * (
          0.5 * sin(uTime * uWindFrequency + windOffset) +
          0.3 * sin(2.0 * uTime * uWindFrequency + 1.3 * windOffset) +
          0.2 * sin(5.0 * uTime * uWindFrequency + 1.5 * windOffset)
        );
        mvPosition.xyz += windSway;

        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
        `
      );

      mat.userData.shader = shader;
    };

    this.leavesMesh.geometry.dispose();
    this.leavesMesh.geometry = g;
    this.leavesMesh.material.dispose();

    this.leavesMesh.material = mat;

    this.leavesMesh.castShadow = true;
    this.leavesMesh.receiveShadow = true;
  }

  get vertexCount() {
    return (this.branches.verts.length + this.leaves.verts.length) / 3;
  }

  get triangleCount() {
    return (this.branches.indices.length + this.leaves.indices.length) / 3;
  }
}
