# Development Practice

## Quality Gates

The quality gates are

- `pnpm format` - Prettier
- `pnpm type-check` - TypeScript
- `pnpm lint` - ESLint
- `pnpm test` - Jest
- `pnpm build` - tsup

The quality gates must be run after all major changes, and before each commit.

## Branching Strategy

- We use the [Github flow branching strategy](https://docs.github.com/en/get-started/using-github/github-flow).
- All changes must be made in feature branches, and merged into the main branch.

## Commit Messages

- We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format, enforced with `commitlint`.
