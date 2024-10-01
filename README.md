# EZ-Tree

<p align="center">
<img src="https://github.com/user-attachments/assets/4ed61044-48f8-4f43-be0c-96ce90416a7f">
</p>

EZ-Tree is a procedural tree generator with dozens of tunable parameters. The standalone tree generation code is published as a library and can be imported into your own application for dynamically generating trees on demand. Additionally, there is a [standalone web app](https://eztree.dev) which allows you to create trees within the browser and export as .PNG or .GLB files.

# Installation

```js
npm i @dgreenheck/ez-tree
```

# Usage

```js
// Create new instance
const tree = new Tree();

// Set parameters
tree.options.seed = 12345;
tree.options.trunk.length = 20;
tree.options.branch.levels = 3;

// Generate tree and add to your Three.js scene
tree.generate();
scene.add(tree);
```

Any time the tree parameters are changed, you must call `generate()` to regenerate the geometry.

# Running Standalone App Locally

To run the standalone app locally, you first need to build the EZ-Tree library before running the app.

```bash
npm install
npm run build:lib
npm run app
```

# Running App with Docker

```bash
docker compose build
docker compose up -d
```

# Tree Parameters

- `seed` - Seed for RNG

## Trunk

- `color` - Color of the tree trunk
- `flatShading` - Use face normals for shading instead of vertex normals
- `length` - Length of the base trunk
- `radius` - Starting radius of the trunk

## Branches

- `levels` - Number of branch recursions ( Keep under 5 )
- `children` - Number of child branches
- `start` - Defines where child branches start forming on the parent branch. A value of 0.6 means the child branches can start forming 60% of the way up the parent branch
- `stop` - Defines where child branches stop forming on the parent branch. A value of 0.9 means the child branches stop forming 90% of the way up the parent branch
- `angle` - Angle between child branch and parent branch (radians)
- `angleVariance` - Variation in `angle` (radians)
- `lengthVariance` - Variation in branch length
- `lengthMultiplier` - Length of child branch relative to parent
- `radiusMultiplier` - Radius of child branch relative to parent
- `taper` - Radius of end of branch relative to the start of the branch
- `gnarliness` - Max amplitude of random angle added to each section's orientation
- `twist` - Amount of twisting about the vertical axis

## External Force

- `direction` - Influences the direction the tree grows towards
- `strength` - Strength of the sun influence

## Geometry

- `sections` - Number of sections that make up this branch
- `segments` - Number of faces around the circumference of the branch
- `lengthVariance` - % variance in the nominal section length
- `radiusVariance` - % variance in the nominal section radius
- `randomization` - Randomization factor applied to vertices

## Leaves

- `style` - Leaf billboard style (single or double)
- `type` - Leaf type (Ash, Aspen or Oak)
- `color` - Leaf color
- `count` - Number of leaves per branch
- `size` - Size of leaf texture
- `sizeVariance` - Variance in leaf size between branches
