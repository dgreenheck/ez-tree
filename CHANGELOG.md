# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Updated Dockerfile to Node 24 and removed the obsolete `version` attribute from `docker-compose.yml`.
- Use custom rounded normals for leaves for softer shading (#43).

### Fixed

- The growth force was not being applied correctly. Branches should now grow uniformly in the same world direction.

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
