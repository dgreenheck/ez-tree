import { Billboard, LeafType, TreeType } from './enums'

export const TreeParams = {
  seed: 0,
  type: TreeType.Deciduous,

  // Tint of the tree trunk
  tint: 0xd59d63,

  // Use face normals for shading instead of vertex normals
  flatShading: false,

  // Apply texture to bark
  textured: true,

  // Levels of recursion
  levels: 3,

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
      strength: 0.01,
    },

    // Amount of curling/twisting  at each branch level
    gnarliness: {
      0: 0.2,
      1: 0.2,
      2: 0.05,
      3: 0.02,
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
      3: 6,
    },

    // Number of radial segments per branch level
    segments: {
      0: 8,
      1: 6,
      2: 4,
      3: 3,
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
      3: 0.7,
    },

    // Amount of twist at each branch level
    twist: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    },
  },

  // Leaf parameters
  leaves: {
    // Leaf texture to use
    type: LeafType.Oak,

    // Whether to use single or double/perpendicular billboards
    billboard: Billboard.Double,

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
    tint: 0x8b8f68,

    // Controls transparency of leaf texture
    alphaTest: 0.5,
  },
};