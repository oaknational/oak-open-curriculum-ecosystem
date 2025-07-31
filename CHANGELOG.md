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
