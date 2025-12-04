# Implementation Plan: ESLint Centralization & Strictness

## Goal Description

Centralize all ESLint configuration into a single, high-quality workspace: `@oaknational/eslint-plugin-standards`. Eliminate all legacy configuration files (`eslint-rules`, `eslint.config.base.ts`, root `eslint.config.ts`) and ensure all workspaces rely exclusively on the plugin. Enforce strict adherence to project rules, including comprehensive testing and documentation for the plugin itself.

## User Review Required

> [!IMPORTANT]
> This plan requires deleting the root `eslint.config.ts` and `eslint.config.base.ts`. This is a significant architectural change that will force all packages to be self-contained regarding linting.

## Phases

### Phase 1: Elevate `@oaknational/eslint-plugin-standards`

**Goal**: Bring the plugin workspace up to the highest standards of engineering excellence.

- **Acceptance Criteria**:
  - [ ] `vitest` is configured and running for the plugin.
  - [ ] All rules and configurations have comprehensive unit tests.
  - [ ] All exports have TSDoc comments.
  - [ ] `README.md` documents usage and available configs.
  - [ ] Full quality gates pass for the plugin workspace.

### Phase 2: Migrate Core and Libs (Completed)

- [x] Migrate `packages/libs/env`
- [x] Migrate `packages/libs/logger`
- [x] Migrate `packages/libs/openapi-zod-client-adapter`
- [x] Migrate `packages/libs/storage`
- [x] Migrate `packages/libs/transport`

### Phase 3: Migrate Apps and Providers (Completed)

- [x] Migrate `packages/providers/mcp-providers-node`
- [x] Migrate `apps/oak-notion-mcp`
- [x] Migrate `apps/oak-curriculum-mcp-stdio`
- [x] Migrate `apps/oak-curriculum-mcp-streamable-http`
- [x] Migrate `apps/oak-open-curriculum-semantic-search`s

**Goal**: Switch all `apps/*` and `packages/providers/*` to use the plugin.

- **Acceptance Criteria**:
  - [ ] All `apps/*` use appropriate plugin configs (e.g., `plugin:standards/next`).
  - [ ] `packages/providers/*` use the plugin.
  - [ ] Full quality gates pass for all modified packages.

### Phase 4: Cleanup and Root Centralization (Completed)

- [x] Delete `eslint.config.base.ts`
- [x] Delete `eslint-rules` directory
- [x] Update root `eslint.config.ts`
- [x] Run full verification

### Phase 5: Strict Enforcement & Legacy Remediation (In Progress)

**Goal**: Enforce `strict` configuration across the entire repository while managing legacy code compliance.

- **Strategy**:
  - Adopt `strict` config for all packages.
  - Use `// eslint-disable-next-line ... -- REFACTOR` comments to "grandfather" existing violations in product code.
  - **Explicitly avoid** creating compatibility layers or fallback configurations.
  - Ensure `pnpm lint` passes cleanly for the entire monorepo.

- **Current Status**:
  - [x] All packages updated to use `strict` config.
  - [x] `REFACTOR` disables applied to `logger`, `notion`, `streamable-http`, and `semantic-search`.
  - [ ] Resolve persistent lint errors in `streamable-http` and `semantic-search`.
  - [ ] Final full repo verification.

- **Remaining Challenges**:
  - `streamable-http` and `semantic-search` still have failing lint checks despite initial fixes.
  - Need to ensure `REFACTOR` comments are applied correctly without breaking functionality or types.

## Next Steps

1. **Fix Remaining Lints**: Systematically address the remaining errors in `streamable-http` and `semantic-search`.
2. **Verify**: Run `pnpm lint` on the full repo.
3. **Complete**: Mark the migration as complete.
