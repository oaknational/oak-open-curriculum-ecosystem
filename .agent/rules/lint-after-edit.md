# Lint After Edit

After editing TypeScript files, check lint for file/function length violations. Run lint on the changed files or run `pnpm lint:fix`. Catch violations early — don't accumulate them.

Key ESLint thresholds that bite during refactoring:

- `max-lines`: 250 lines per file
- `max-lines-per-function`: 50 lines per function
- `complexity`: ESLint counts `??` and `?.` as branches

When a violation appears, follow the refactoring rules in `.agent/directives/principles.md`:

- **File too long**: split by groupings of responsibility; for very long files, turn into a directory with an index.ts integration point.
- **Function too long**: extract named helpers as pure functions with unit tests.
- **Too complex**: extract branch-heavy expressions into pure-function helpers with unit tests.
