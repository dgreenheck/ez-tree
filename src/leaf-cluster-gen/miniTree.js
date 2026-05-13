import { Tree, Billboard } from '@dgreenheck/ez-tree';

/**
 * Build a tiny single-branch "twig with leaves" using the existing Tree
 * library. The trunk acts as the branch the leaves attach to (branch.levels=0
 * means the trunk is also the leaf-bearing terminal level).
 *
 * Returns a generated Tree instance (extends THREE.Group). Caller is
 * responsible for adding it to a scene and disposing the geometries/materials
 * when done.
 *
 * @param {object} params
 * @param {number} params.seed          - RNG seed for reproducible variation
 * @param {object} params.branch        - branch.length / radius / etc
 * @param {object} params.leaves        - leaves.count / size / etc
 * @param {object} params.leafMaps      - { color, normal, roughness, ao, scattering } THREE.Textures
 * @param {object} params.leafAtlas     - { cols, rows, rotation }
 * @param {object} [params.barkMaps]    - bark textures (optional; falls back to tint)
 * @returns {Tree}
 */
export function createClusterMiniTree({
  seed,
  branch = {},
  leaves = {},
  leafMaps,
  leafAtlas,
  barkMaps,
}) {
  const tree = new Tree();

  tree.options.seed = seed;

  // When bark maps are supplied, light the cylinder with them (matching the
  // consumer tree). Otherwise fall back to a brown tint so the twig isn't
  // pure white in the cluster card.
  tree.options.bark.tint = branch.tint ?? 0xffffff;
  tree.options.bark.textured = Boolean(barkMaps);
  // Default texture wrap repeats over a small twig look too tightly — tone
  // down the Y scaling.
  tree.options.bark.textureScale = { x: 1, y: 1 };

  // Trunk-only tree. The trunk becomes the visible twig.
  tree.options.branch.levels = 0;
  tree.options.branch.length[0] = branch.length ?? 4;
  tree.options.branch.radius[0] = branch.radius ?? 0.08;
  tree.options.branch.sections[0] = branch.sections ?? 8;
  tree.options.branch.segments[0] = branch.segments ?? 5;
  tree.options.branch.taper[0] = branch.taper ?? 0.5;
  tree.options.branch.gnarliness[0] = branch.gnarliness ?? 0.15;
  tree.options.branch.twist[0] = branch.twist ?? 0;
  tree.options.branch.force.direction = { x: 0, y: 1, z: 0 };
  tree.options.branch.force.strength = branch.forceStrength ?? 0.01;

  tree.options.leaves.count = leaves.count ?? 10;
  tree.options.leaves.size = leaves.size ?? 0.9;
  tree.options.leaves.sizeVariance = leaves.sizeVariance ?? 0.3;
  tree.options.leaves.start = leaves.start ?? 0.0;
  tree.options.leaves.angle = leaves.angle ?? 40;
  // Single billboard during bake; the consumer can cross/triple them later
  // when stamping cluster cards onto a tree.
  tree.options.leaves.billboard = Billboard.Single;
  tree.options.leaves.roundedNormals = true;
  tree.options.leaves.alphaTest = 0.5;
  tree.options.leaves.tint = 0xffffff;

  if (leafMaps) Object.assign(tree.options.leaves.maps, leafMaps);
  if (leafAtlas) Object.assign(tree.options.leaves.atlas, leafAtlas);
  if (barkMaps) Object.assign(tree.options.bark.maps, barkMaps);

  tree.generate();
  return tree;
}
