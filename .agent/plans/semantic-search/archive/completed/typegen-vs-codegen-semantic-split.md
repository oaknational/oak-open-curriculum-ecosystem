# Typegen vs Codegen Semantic Split

**Status**: ✅ COMPLETE (25 Feb 2026)
**Documentation**: Naming convention now in [oak-sdk-codegen README](../../../../packages/sdks/oak-sdk-codegen/README.md#typegen-vs-codegen-naming)

## Summary

Reverted type-focused modules from `codegen-*` to `typegen-*` so that:
- **typegen** = modules that extract and emit TypeScript types from the OpenAPI schema
- **codegen** = orchestration and modules that emit validators, MCP tools, fixtures, mappings

Files renamed: `typegen-extraction.ts`, `typegen-extraction-helpers.ts`, `typegen-path-groupings.ts`,
`typegen-writers.ts`, `typegen-interface-gen.ts` (plus corresponding test files).
Orchestration kept as `codegen.ts`, `codegen-core.ts`, etc.
