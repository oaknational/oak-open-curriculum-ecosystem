# Roadmap Phases

## Phase 1: Create `@oaknational/eslint-plugin-standards`

- **Action**: Maintain the plugin workspace at `packages/core/oak-eslint` and centralise rule/config exports there.
- **Deliverables**:
  - A proper `package.json` with `eslint` peer dependency.
  - Exported configs: `recommended`, `strict`, `react`, `next`.
  - Exported rules: `no-export-trivial-type-aliases`, `boundary-rules` (as logic or rules).
- **Benefit**: Eliminates relative import fragility and enables standard versioning.

## Phase 2: Implement `max-files-per-dir`

- **Action**: Implement the research plan for `max-files-per-dir` within the new plugin.
- **Context**: Use the implementation details from `.agent/plans/quality-and-maintainability/eslint/eslint-max-files-per-dir.md`.
- **Benefit**: Enforces modularity structurally, preventing "junk drawer" directories (for example, `utils/` with 50 files).

## Phase 3: Standardise "Strict Mode"

- **Action**: Extract the `no-restricted-properties` rules from `oak-curriculum-sdk` into a `strict` config in the plugin.
- **Benefit**: Lets other high-integrity packages (like `core` or `transport`) opt into SDK-grade type safety without copy-pasting rules.

## Phase 4: Clean Up `semantic-search`

- **Action**: Replace the manual config in `apps/oak-search-cli` with the shared flat config from `@oaknational/eslint-plugin-standards`.
- **Benefit**: Removes about 100 lines of config, centralises React/Next.js best practices, and fixes redundancy issues.

## Phase 5: Boilerplate Reduction

- **Action**: Create a configuration factory in the plugin (for example, `createOakConfig({ type: 'lib' })`).
- **Benefit**: Drastically reduces `eslint.config.ts` file size in every workspace, handling `tsconfig` resolution and `__dirname` setup internally.
