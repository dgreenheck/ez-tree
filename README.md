# Tree.js

<p align="center">
<img src="https://github.com/dgreenheck/tree-js/assets/3814912/d42076c3-06ad-469d-bca1-f84a1a5eb2cb" width="400">
</p>

A procedural tree generator built with Three.js. Over 30 tunable parameters and support for exporting to .glb.

# Installation

The tree generation code is published as an npm package and can be imported into your own project.

```js
npm i @dgreenheck/tree-js
```

# Usage

```js
// Create new instance
const tree = new Tree();

// Set parameters
tree.options.trunk.length = 20;
tree.options.branch.levels = 3;

// Generate tree and add to scene
tree.generate();
scene.add(tree);
```

Any time the tree parametes are changed, you must call `generate()` to regenerate the geometry.

For more info, see the demo app for an example on how to create a tree.

# Demo

The demo application is a Three.js app which allows you to tune the parameters of the tree in real-time. It also has options for exporting the generated mesh to a `.glb` file, as well as a `.png` export of the current view for 2D applications.

## Live Demo

https://dgreenheck.github.io/tree-js/

## Running Demo Locally

```bash
npm install
npm run build:npm
npm run demo
```

## Running Demo with Docker

```bash
docker compose build
docker compose up -d
```

# Parameters

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
