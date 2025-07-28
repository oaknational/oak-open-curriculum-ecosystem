# Development Practice

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

### Architecture Level

- **SOLID principles** (loosely) - Focus on single responsibility and dependency inversion
- **Clean Architecture** (loosely) - Separate concerns into layers
- **Strict boundaries** - Clear interfaces between modules, no leaky abstractions
- **Single responsibility** - Each module/class/function does one thing well
- **TypeScript best practices** - See [TypeScript Practice](typescript-practice.md)

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

- [Testing Strategy](testing-and-development-strategy.md) - TDD/BDD approach
- [TypeScript Practice](typescript-practice.md) - Type safety rules
- [Tooling](tooling.md) - Development tools and versions
