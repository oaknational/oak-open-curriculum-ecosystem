# Development Practice

NEVER disable checks of any kind, ever.

## Quality Gates

The quality gates must be run after all major changes, and before each commit:

- `pnpm format` - Code formatting (Prettier)
- `pnpm type-check` - Type checking (TypeScript strict mode)
- `pnpm lint` - Linting (ESLint)
- `pnpm test` - Testing (Vitest - excludes E2E tests)
- `pnpm build` - Build verification (tsup)

Where the quality gates reveal an issue, the issue must be fixed, regardless of the location or cause. There is no such thing as an acceptable failure, ever.

NEVER disable any quality gates or Git hooks.

## Design Principles

### Code Level

- **Prefer PURE functions** - almost all code should be pure functions with NO SIDE EFFECTS
- **DRY, KISS, and YAGNI** - Avoid duplication, keep it simple, build only what's needed
- **Mockable IO** - All external interactions must be injectable/mockable
- **No duplication** - NEVER create duplicate interfaces, types, classes, or functions
- **No unnecessary wrappers** - Use functions directly rather than wrapping them

### Error Handling

- **Fail FAST** - Detect and report errors immediately
- **Fail hard** - Crash with instructive, helpful error messages
- **Do not fail open** - Never continue with potentially invalid state
- **Do not fail silently** - Every error must be visible
- **Never swallow errors** - All errors must propagate or be handled explicitly
- **No "sensible defaults"** - If a required argument is missing, throw an error

### Architecture Level

- **SOLID principles** (loosely) - Focus on single responsibility and dependency inversion
- **Clean Architecture** (loosely) - Separate concerns into layers
- **Strict boundaries** - Clear interfaces between modules, no leaky abstractions
- **Single responsibility** - Each module/class/function does one thing well
- **TypeScript best practices** - See [TypeScript Practice](./typescript-practice.md)

### Biological Architecture Practices

- **Module boundaries over file organization** - Focus on interfaces, not folder structure
- **Heterogeneous patterns** - Different parts of the system can work differently if it's simpler
- **Dependency injection between organa** - Organs receive dependencies, never import from other organs
- **Warnings as architecture insights** - The 91 relative import warnings show where boundaries naturally form
- **No forced consistency** - If a pattern works well in one place but adds complexity elsewhere, don't force it
- **Chorai are pervasive** - Infrastructure (logging, events, config) flows through everything
- **Organa are discrete** - Business logic organs have clear boundaries with no cross-imports

Example of good module structure following biological architecture:

```typescript
// src/organa/notion/search/index.ts - Public API (cell membrane)
export { createSearchService } from './factory';
export type { SearchService, SearchResult } from './types';

// src/organa/notion/search/factory.ts - Cell assembly
export function createSearchService(deps: Dependencies): SearchService {
  // Dependencies include chorai (logger, config) and other services
  // but NEVER direct imports from other organa
}

// src/chora/aither/logging/index.ts - Chora public API
export { createLogger } from './logger';
export type { Logger } from './types';
```

## Refactoring Principles

- **Replace, don't layer** - NEVER create compatibility layers, replace old code with new code
- **No backward compatibility** - We have versioning for that; keep the system correct and functional
- **Break down complexity** - Long functions/files indicate multiple responsibilities
- **Domain boundaries** - Create folders with index.ts as the public API when splitting files
- **Question architecture** - If DIP causes complexity, the architecture may need refactoring
- **Single source of truth** - One responsibility, one reason to change, one place for each concept

## Git Workflow

### Branching Strategy

- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) - feature branches merge to main
- All changes via pull requests
- Main branch must always be deployable

### Commit Messages

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Enforced by `commitlint` pre-commit hook
- Examples: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

### Import Guidelines for Biological Architecture

**Allowed imports:**

- ✅ Chorai can import from other chorai (within same field)
- ✅ Organa can import from chorai (infrastructure flows everywhere)
- ✅ Everything can import from stroma (types/contracts)
- ✅ Psychon can import from all layers (it wires everything)

**Forbidden imports:**

- ❌ Cross-organ imports (organa/notion → organa/mcp)
- ❌ Upward imports (../)
- ❌ Deep imports into internal modules (use public APIs)

## Related Documentation

- [Biological Architecture Guide](./architecture.md) - THE authoritative reference
- [Testing Strategy](./testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](./typescript-practice.md) - Type safety rules
- [Tooling](../development/tooling.md) - Development tools and versions
