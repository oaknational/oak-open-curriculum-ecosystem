# Opportunities and Roadmap: ESLint Enhancements

## Strategic Goal

Transition from a "distributed config with shared helpers" model to a **"Plugin-First" architecture**. This encapsulates standards, rules, and configurations into a versioned, testable package.

## Roadmap

### Phase 1: Create `@oaknational/eslint-plugin-standards`

- **Action**: Convert `eslint-rules` from a directory into a proper workspace: `packages/libs/oak-eslint`.
- **Deliverables**:
  - A proper `package.json` with `eslint` peer dependency.
  - Exported **Configs**: `recommended`, `strict`, `react`, `next`.
  - Exported **Rules**: `no-export-trivial-type-aliases`, `boundary-rules` (as logic or rules).
- **Benefit**: Eliminates relative import fragility; allows standard versioning.

### Phase 2: Implement `max-files-per-dir`

- **Action**: Implement the research plan for `max-files-per-dir` within the new plugin.
- **Context**: Use the implementation details from `.agent/plans/quality-and-maintainability/eslint-max-files-per-dir.md`.
- **Benefit**: Enforces modularity structurally, preventing "junk drawer" directories (e.g., `utils/` with 50 files).

### Phase 3: Standardize "Strict Mode"

- **Action**: Extract the `no-restricted-properties` rules from `oak-curriculum-sdk` into a `strict` config in the plugin.
- **Benefit**: Allows other high-integrity packages (like `core` or `transport`) to opt-in to SDK-grade type safety without copy-pasting rules.

### Phase 4: Clean Up `semantic-search`

- **Action**: Replace the manual config in `apps/oak-open-curriculum-semantic-search` with `plugin:standards/next`.
- **Benefit**: Removes ~100 lines of config, centralizes React/Next.js best practices, and fixes the redundancy issues.

### Phase 5: Boilerplate Reduction

- **Action**: Create a configuration factory in the plugin (e.g., `createOakConfig({ type: 'lib' })`).
- **Benefit**: Drastically reduces the `eslint.config.ts` file size in every workspace, handling the `tsconfig` resolution and `__dirname` setup internally.

## Immediate Next Step

Refactor `eslint-rules` into `packages/libs/oak-eslint` and register the unused `no-export-trivial-type-aliases` rule.
