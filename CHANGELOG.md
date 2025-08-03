# [2.0.0](https://github.com/oaknational/oak-notion-mcp/compare/v1.0.0...v2.0.0) (2025-08-03)


### Code Refactoring

* centralize environment validation with type-safe boundary ([01d9b16](https://github.com/oaknational/oak-notion-mcp/commit/01d9b16e34e5b1ff44c941b3d6990df74c291661))
* remove custom Notion type duplicates and fix complexity issues ([15eabfd](https://github.com/oaknational/oak-notion-mcp/commit/15eabfda4c72e1e800a2034ffa792e6bf8387aac))


### Features

* implement complete biological architecture with mathematical foundation ([6c4bc31](https://github.com/oaknational/oak-notion-mcp/commit/6c4bc31bcbcad7c9fe85536b10a6544928ad37d1))


### BREAKING CHANGES

* Major architectural restructuring to implement complete biological model

This commit represents a fundamental evolution of our architecture based on complex systems
theory and mathematical validation. The changes establish a complete biological model that
distinguishes between substrate (foundation), systems (pervasive infrastructure), and organs
(discrete business logic).

## Key Changes

### Architectural Evolution
- Implemented complete 8-level biological architecture
- Distinguished between pervasive systems and discrete organs
- Added substrate layer for types, contracts, and event schemas
- Created ADR-018 documenting the complete biological architecture

### Mathematical Foundation
- Integrated complex systems research (Meena 2023, Scheffer 2009, Beggs 2003)
- Validated architecture operates at criticality for optimal performance
- Reframed 103 import warnings as early warning signals
- Added cross-disciplinary validation

### Documentation Restructuring
- Reorganized docs into specialized directories
- Enhanced all ADRs with mathematical foundation references
- Updated README with complete biological architecture explanation
- Created comprehensive tissue and organ interface documentation

### Experience Records
- Documented key insights from the architectural evolution journey
- Recorded transformation from biological metaphor to mathematical implementation
- Captured the revelation about implementing universal principles

### Plan Updates
- Updated high-level plan with Phase 3 for biological architecture
- Added Phase 4 plan for oak-mcp-core extraction
- Incorporated early warning signals concept

This represents a paradigm shift in how we understand and implement software architecture,
grounded in mathematical principles that govern all complex systems.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
* Functions now use SDK types directly instead of custom type aliases
* Environment validation now happens on module load.
Invalid environment variables will cause immediate failure with
descriptive error messages.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

# [1.0.0](https://github.com/oaknational/oak-notion-mcp/compare/v0.4.0...v1.0.0) (2025-08-02)


### Bug Fixes

* resolve all TypeScript lint errors and improve type safety ([6f61547](https://github.com/oaknational/oak-notion-mcp/commit/6f615474897f65f9e65e7f46f8c08d35f55bb586))


### Features

* implement comprehensive logging framework for Phase 3 ([1bc0f57](https://github.com/oaknational/oak-notion-mcp/commit/1bc0f576a38f579f772d11d1d18753e454a2e7a7))


### BREAKING CHANGES

* None - all changes maintain existing API contracts

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

# [0.4.0](https://github.com/oaknational/oak-notion-mcp/compare/v0.3.0...v0.4.0) (2025-08-01)


### Features

* add early startup logging to improve MCP server debuggability ([69afbfa](https://github.com/oaknational/oak-notion-mcp/commit/69afbfa2af2d0ae8156536e7394cd9f3b7c72865))
* add file logging to Consola configuration and fix deprecated code ([660bbb3](https://github.com/oaknational/oak-notion-mcp/commit/660bbb3d52352a57492772081f0a4ab54938a955))

# [0.3.0](https://github.com/oaknational/oak-notion-mcp/compare/v0.2.0...v0.3.0) (2025-07-31)


### Features

* implement data scrubbing for PII protection ([bd25b0c](https://github.com/oaknational/oak-notion-mcp/commit/bd25b0cb0760bc94aa298bbc78c49abd97f474ab))
* implement E2E tests and improve development documentation ([6dbf0e5](https://github.com/oaknational/oak-notion-mcp/commit/6dbf0e57546fd1959448f61fc9307593f67c9e50))
* implement environment configuration module with TDD ([2132036](https://github.com/oaknational/oak-notion-mcp/commit/213203660a4767f8c0f5a72f4df6076b5a86e830))
* implement minimal working MCP server with Notion integration ([cd13620](https://github.com/oaknational/oak-notion-mcp/commit/cd136205fac53a8bde1c631c7c679b24ea36d67f))
* implement Phase 2 MCP server with type-safe resource and tool handlers ([a0d6d86](https://github.com/oaknational/oak-notion-mcp/commit/a0d6d8667bc6a286defedf113276ff843e73a2fd))
* prepare for npm package usage ([d8f3aef](https://github.com/oaknational/oak-notion-mcp/commit/d8f3aefd0eb716854cc27822197a5385a833562c))

# [0.2.0](https://github.com/oaknational/oak-notion-mcp/compare/v0.1.0...v0.2.0) (2025-07-29)


### Features

* complete phase 1 development environment setup ([2c29d6a](https://github.com/oaknational/oak-notion-mcp/commit/2c29d6a0a6554b7e82ddfe7612a46ea8322a88e8))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with TypeScript
- Quality gates configuration (ESLint, Prettier, TypeScript)
- Testing framework setup (Vitest)
- Build configuration (tsup)
- Git hooks with Husky and lint-staged
- Conventional commits with commitlint
- Basic MCP server skeleton with stdio transport
- ESM-only module configuration
- Automated versioning with semantic-release (GitHub releases only)
