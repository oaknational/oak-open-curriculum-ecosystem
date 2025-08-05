# Pragmatic Naming Rationale

## Overview

Not everything in the codebase needs Greek nomenclature. The biological architecture applies to the living application (the organism), not to the tools and environment around it.

## What Stays Pragmatically Named

### 1. Utilities (`src/utils/`)

**What**: Helper functions and utilities

- `scrubbing.ts` - PII scrubbing functions

**Why**: These are tools used BY the organism, not parts OF the organism. Like surgical instruments or laboratory equipment.

**Future**: Will be injected as dependencies through psychon.ts

### 2. Type Definitions (`src/types/`)

**What**: Transitional type definitions

- `dependencies.ts` - Dependency interfaces
- `environment.ts` - Environment variable types

**Why**: These will be absorbed into chora/stroma during transformation. Keeping them temporarily named makes the migration clearer.

**Future**: Will move to `chora/stroma/types/`

### 3. Test Helpers (`src/test-helpers/`)

**What**: Testing utilities and factories

- `factories.ts` - Test data factories
- `notion-api-mocks.ts` - API response mocks
- `notion-mocks.ts` - Notion object mocks

**Why**: Testing infrastructure exists outside the organism boundary. Tests observe and validate the organism but aren't part of it.

**Future**: Remains external to the organism

### 4. Error Handling (`src/errors/`)

**What**: Global error handling utilities

- `error-handler.ts` - Error processing and formatting

**Why**: Ambiguous placement - could be part of chora/aither (error flows) or stay pragmatic as a utility.

**Decision**: Keep pragmatic for now, revisit after seeing how error flows work in the new architecture.

### 5. End-to-End Tests (`e2e-tests/`)

**What**: Full system integration tests

- `server.e2e.test.ts` - Complete server tests

**Why**: E2E tests run against the entire organism from outside. They're environmental tests, not organismal components.

**Future**: Remains external

### 6. Scripts (`scripts/`)

**What**: Build and analysis tools

- `analyze-modules.ts` - Architecture analysis
- `prevent-accidental-major-version.ts` - Git hooks

**Why**: Build tooling is part of the development environment, not the organism itself.

**Future**: Remains external

### 7. Configuration Files (Root)

**What**: Project configuration

- `tsconfig.json`, `eslint.config.ts`, `vitest.config.ts`, etc.
- `.env` files
- Git configuration (`.gitignore`, `.gitattributes`)
- CI/CD configuration (`.github/`)

**Why**: Environmental configuration that defines how the organism is built, tested, and deployed.

**Future**: Remains external

### 8. Entry Points

**What**: Application entry points

- `src/index.ts` - Main export
- `src/server.ts` - Server runner
- `src/server-setup.ts` - Server configuration

**Why**: These wire the organism to the external environment. They're the boundary between organism and environment.

**Future**: Will be updated to use psychon.ts but keep pragmatic names for clarity

## Philosophical Rationale

The biological architecture with Greek nomenclature applies to the **living system** - the application that has:

- Pervasive infrastructure (chorai) that flows through everything
- Discrete business logic (organa) with clear boundaries
- An animating whole (psychon) that brings it to life

Everything else is **environment**:

- Tools we use to build and test
- Configuration that shapes the environment
- Utilities that assist but aren't integral

This distinction maintains clarity:

- **Greek names** = Living parts of the organism
- **Pragmatic names** = Tools, tests, and environment

## Benefits

1. **Clear Boundaries**: Instantly know what's part of the organism vs environment
2. **Easier Onboarding**: Developers understand familiar names for familiar concepts
3. **Tool Compatibility**: Build tools expect standard names (package.json, tsconfig.json)
4. **Separation of Concerns**: Organism logic separate from environmental concerns

## Summary

The Greek nomenclature creates precision within the organism while pragmatic naming maintains clarity at the boundaries. This hybrid approach gives us the best of both worlds: philosophical clarity where it matters and practical familiarity where it helps.
