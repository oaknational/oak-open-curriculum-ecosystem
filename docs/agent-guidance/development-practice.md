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

### Experimental Architecture Practices

- **Module boundaries over file organization** - Focus on interfaces, not folder structure
- **Heterogeneous patterns** - Different parts of the system can work differently if it's simpler
- **Events between domains** - Major components communicate through events/messages, not direct imports
- **Warnings as architecture insights** - The 103 relative import warnings show where boundaries naturally form
- **No forced consistency** - If a pattern works well in one place but adds complexity elsewhere, don't force it

Example of good module structure:

```typescript
// src/notion/search/index.ts - Public API
export { createSearchService } from './factory';
export type { SearchService, SearchResult } from './types';

// src/notion/search/factory.ts
export function createSearchService(deps: Dependencies): SearchService {
  // Create and wire up the service
}
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

## Related Documentation

- [Testing Strategy](./testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](./typescript-practice.md) - Type safety rules
- [Tooling](../development/tooling.md) - Development tools and versions
