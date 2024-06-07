# Tree.js

<p align="center">
<img src="https://github.com/dgreenheck/tree-js/assets/3814912/d42076c3-06ad-469d-bca1-f84a1a5eb2cb" width="400">
</p>

A procedural tree generator built with Three.js. Over 30 tunable parameters and support for exporting to .glb.

# Live Demo

https://dgreenheck.github.io/tree-js/

# Running Code Locally

```bash
npm install
npm run dev
```

# Parameters

## Trunk

- `color` - Color of the tree trunk
- `flare` - Multipler for base of trunk
- `flatShading` - Use face normals for shading instead of vertex normals
- `length` - Length of the base trunk
- `maturity`: Growth stage of tree
- `radius` - Starting radius of the trunk
- `textured` - Apply bark texture

## Branches

- `gnarliness` - Max amplitude of random angle added to each section's orientation
- `gnarliness1_R` - Same as above, but inversely proportional to the branch radius. The two terms can be used to balance gnarliness of trunk vs. branches
- `lengthVariance` - % variance in branch length
- `lengthMultiplier` - Length of child branch relative to parent
- `levels` - Number of branch recursions ( Keep under 5 )
- `minChildren` - Minimum number of child branches
- `maxChildren` - Maximum number of child branches
- `radiusMultiplier` - Radius of child branch relative to parent
- `start` - Defines where child branches start forming on the parent branch. A value of 0.6 means the child branches can start forming 60% of the way up the parent branch
- `stop` - Defines where child branches stop forming on the parent branch. A value of 0.9 means the child branches stop forming 90% of the way up the parent branch
- `sweepAngle` - Max sweep of the branches (radians)
- `taper` - Radius of end of branch relative to the start of the branch
- `twist` - Amount of twisting about the vertical axisq

## Geometry

- `lengthVariance` - % variance in the nominal section length
- `radiusVariance` - % variance in the nominal section radius
- `randomization` - Randomization factor applied to vertices
- `sections` - Number of sections that make up this branch 
- `segments` - Number of faces around the circumference of the branch

## Leaves
- `color` - Leaf color
- `maxCount` - Max number of leaves per branch
- `minCount` - Min number of leaves per branch
- `size` - Size of leaf texture 
- `sizeVariance` - Variance in leaf size between branches
- `style` - Leaf billboard style (single or double)
- `type` - Leaf type (Ash, Aspen or Oak)

## Sun
- `direction` - Influences the direction the tree grows towards
- `strength` - Strength of the sun influence
