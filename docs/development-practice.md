# Development Practice

## Quality Gates

The quality gates are

- `pnpm format` - Prettier
- `pnpm type-check` - TypeScript
- `pnpm lint` - ESLint
- `pnpm test` - Jest
- `pnpm build` - tsup

The quality gates must be run after all major changes, and before each commit.
