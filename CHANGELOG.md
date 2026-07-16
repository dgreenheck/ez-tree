# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Levels of Detail

- **`Tree.generateLODs(levels)`** builds the tree at multiple levels of detail hosted in a `THREE.LOD` inside the tree group, with automatic distance-based switching.
  - All levels are meshed from a single skeleton, so the silhouette is identical across levels and switches don't pop.
  - All levels share one bark and one leaf material, so `update()` animates wind at every level.
  - Default levels (`Tree.defaultLODLevels`) reduce to ~40% of the full triangle count at 100 units and ~20% at 250 units.
- **`Tree.createGeometry(detail)`** returns raw `{ branches, leaves }` `BufferGeometry` pairs at any detail level (`sectionStride`, `segmentFactor`, `leafStride`, `leafScale`, `billboard`) for external instancing or custom LOD systems.
- Internally, tree generation is now split into a skeleton pass (all randomness) and a meshing pass (geometry emission). Output for a given seed is bit-identical to before; the undocumented internals `generateBranch`, `generateLeaf`, and `generateBranchIndices` were replaced by private methods.
- Demo app:
  - The background forest generates with LODs.
  - New viewport stats overlay shows live triangle/vertex counts, with buttons to preview each LOD level on the hero tree.
  - New "Export LODs (ZIP)" button downloads one GLB per LOD level; "Export GLB (Full Detail)" always exports full detail regardless of the active LOD preview.

### Texture System (breaking)

- The library no longer bundles any textures. `bark.maps = { color, ao, normal, roughness }` and `leaves.map` slots on `TreeOptions` accept caller-supplied `THREE.Texture` instances.
- **Breaking:** removed `BarkType` and `LeafType` enums and the bundled-texture lookup. Callers must now load `THREE.Texture` instances themselves and assign them to `options.bark.maps` / `options.leaves.map`. `bark.type` / `leaves.type` strings are still carried through presets but are now purely informational identifiers the host app can use to resolve textures.
- Bark UVs now scale with `branch.radius` (integer-rounded per branch) so bark feature size stays consistent across thick trunks and thin twigs; `bark.textureScale.x` now means "wraps per unit radius" rather than "wraps per branch" (existing preset values may need re-tuning).
- Demo app ships with 11 CC0 bark variants from ambientcg.com under `src/app/public/textures/bark/` with attribution in `src/app/public/textures/LICENSE.md`, tracked via Git LFS.
- Trimmed the bark texture sets to the maps the demo actually uses (color, GL normal, roughness) — removed the ambient-occlusion, displacement, and DirectX normal variants (~15 MB). The library still applies an `ao` map when a caller supplies one.

### Rendering Improvements

- Bark, leaf, ground, and grass materials switched from `MeshPhongMaterial` to `MeshStandardMaterial` (PBR). Bark roughness maps now actually affect shading, and GLB exports round-trip cleanly without the exporter's Phong-conversion warnings.
- Leaves use custom rounded normals for softer, canopy-shaped shading (#43).

### Bug Fixes

- GLB export silently failed for trees using the default bark: the Bark001 texture set has no ambient-occlusion file, the dev server masks the 404 by serving `index.html`, and GLTFExporter aborts on the resulting never-loaded texture. Texture loading now drops missing maps from the cache, and exports strip any never-loaded textures from materials for the duration of the export.
- The growth force was not being applied correctly. Branches now grow uniformly in the same world direction.
- Child branches and leaves are now placed with stratified sampling (with a permuted slot assignment) instead of fixed angular spacing, eliminating visible spirals and one-sided clumping.

### Development & Tooling

- `npm run dev` script and Vite mode-based alias so the dev server resolves `@dgreenheck/ez-tree` directly to `src/lib/` source — instant HMR with no rebuild step.
- Reorganized `src/app/public/` into `audio/`, `fonts/`, `images/`, `icons/`, `models/`, `textures/{bark,ground,leaves}/`; browser/SEO well-known files remain at the root.
- Updated Dockerfile to Node 24 and removed the obsolete `version` attribute from `docker-compose.yml`.

## [1.1.0] - 2026-01-14

- Trellis system with force attraction for branch growth, enabling guided/structured tree shapes (#35).
- Disabled the trellis system on presets where it isn't applicable.

## [1.0.1] - 2026-01-14

- Redesigned the application UI (#34).
- Reduced bundled asset sizes by more than 50%.
- Updated CI/publish workflow dependencies.

## [1.0.0] - 2024-10-18

Initial 1.0 release of the procedural tree generator and demo application.

[Unreleased]: https://github.com/dgreenheck/ez-tree/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/dgreenheck/ez-tree/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/dgreenheck/ez-tree/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dgreenheck/ez-tree/releases/tag/v1.0.0
