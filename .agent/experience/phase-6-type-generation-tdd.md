# Type Generation TDD — Early Foundation

_Date: 2025-08-10_
_Tags: tdd | types | architecture | discovery_

## What happened (brief)

- First implementation of type generation for the Oak Curriculum SDK — TDD-driven creation of TypeScript types and Zod validators from the OpenAPI schema. This was the seed of what became the two-pipeline codegen architecture.

## What it was like

The TDD cycle for code generation felt natural in a way that writing generators without tests does not. Writing the failing test first for a type transformer made the API surface explicit before the implementation existed. Pure functions — input schema, output TypeScript — were trivially testable and composable.

The test classification mistake was formative. An integration test that performed filesystem I/O was reclassified to E2E. The distinction between "testing code working together" and "testing a running system" sharpened permanently. Every subsequent session maintained this boundary.

## What emerged

The pure-function-first pattern for generators proved durable. Six months later, the same architecture (pure transformers coordinated by thin I/O facades) governs both the API pipeline and the bulk pipeline in `@oaknational/sdk-codegen`.

## Technical content

All applied technical patterns from this session have matured into permanent documentation:
- ESM module patterns → `distilled.md` (ESM Module System section)
- Test classification → `testing-strategy.md`
- Pure function architecture → `schema-first-execution.md`
- Function complexity management → `distilled.md` (Testing section)
- File structure has evolved significantly — see `packages/sdks/oak-sdk-codegen/README.md` for current layout
