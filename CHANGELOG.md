# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `Tree.generateLODs(levels)` generates the tree at multiple levels of detail hosted in a `THREE.LOD` inside the tree group, with automatic distance-based switching. All levels are meshed from a single skeleton (identical silhouette, no popping) and share one bark and one leaf material so `update()` animates wind at every level. Default levels (`Tree.defaultLODLevels`) reduce to ~40% and ~20% of the full triangle count at 100 and 250 units.
- `Tree.createGeometry(detail)` returns raw `{ branches, leaves }` `BufferGeometry` pairs at any detail level (`sectionStride`, `segmentFactor`, `leafStride`, `leafScale`, `billboard`) for external instancing or custom LOD systems.
- The demo app's background forest now uses `generateLODs()`.
- Demo app: viewport stats overlay showing live triangle/vertex counts with buttons to preview each LOD level on the hero tree, an "Export LODs (ZIP)" button that downloads one GLB per LOD level, and the GLB export button now always exports full detail regardless of the active LOD preview.
- `bark.maps = { color, ao, normal, roughness }` and `leaves.map` slots on `TreeOptions` accept caller-supplied `THREE.Texture` instances; the library no longer bundles any textures.
- `npm run dev` script and Vite mode-based alias so the dev server resolves `@dgreenheck/ez-tree` directly to `src/lib/` source — instant HMR with no rebuild step.
- Git LFS tracking for `src/app/public/textures/**/*.{jpg,png,jpeg}`.
- Demo app ships with 11 CC0 bark variants from ambientcg.com under `src/app/public/textures/bark/` with attribution in `src/app/public/textures/LICENSE.md`.

### Changed

- Tree generation is now split into a skeleton pass (all randomness) and a meshing pass (geometry emission). Output for a given seed is bit-identical to before; the undocumented internals `generateBranch`, `generateLeaf`, and `generateBranchIndices` were replaced by private methods.
- **Breaking:** removed `BarkType` and `LeafType` enums and the bundled-texture lookup. Callers must now load `THREE.Texture` instances themselves and assign them to `options.bark.maps` / `options.leaves.map`. `bark.type` / `leaves.type` strings are still carried through presets but are now purely informational identifiers the host app can use to resolve textures.
- Bark UVs now scale with `branch.radius` (integer-rounded per branch) so bark feature size stays consistent across thick trunks and thin twigs; `bark.textureScale.x` now means "wraps per unit radius" rather than "wraps per branch" (existing preset values may need re-tuning).
- Reorganized `src/app/public/` into `audio/`, `fonts/`, `images/`, `icons/`, `models/`, `textures/{bark,ground,leaves}/`; browser/SEO well-known files remain at the root.
- Updated Dockerfile to Node 24 and removed the obsolete `version` attribute from `docker-compose.yml`.
- Use custom rounded normals for leaves for softer shading (#43).

### Fixed

- The growth force was not being applied correctly. Branches should now grow uniformly in the same world direction.
- Child branches and leaves are now placed with stratified sampling (with a permuted slot assignment) instead of fixed angular spacing, eliminating visible spirals and one-sided clumping.

## [1.1.0] - 2026-01-14

### Added

- Trellis system with force attraction for branch growth, enabling guided/structured tree shapes (#35).

### Changed

- Disabled the trellis system on presets where it isn't applicable.

## [1.0.1] - 2026-01-14

### Changed

- Redesigned the application UI (#34).
- Reduced bundled asset sizes by more than 50%.
- Updated CI/publish workflow dependencies.

## [1.0.0] - 2024-10-18

Initial 1.0 release of the procedural tree generator and demo application.

[Unreleased]: https://github.com/dgreenheck/ez-tree/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/dgreenheck/ez-tree/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/dgreenheck/ez-tree/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dgreenheck/ez-tree/releases/tag/v1.0.0
