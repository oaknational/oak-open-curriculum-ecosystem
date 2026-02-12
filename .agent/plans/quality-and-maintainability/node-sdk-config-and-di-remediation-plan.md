# Node SDK Config + DI Remediation Plan

**Status**: Ready to start
**Priority**: High (aligns with global state elimination and config standardisation)
**Estimated Effort**: 8-12 hours
**Created**: 2025-02-14

---

## Intent

Eliminate direct `process.env` access and global-state mutations in product code and tests, while aligning the SDK with Node-only support and explicit configuration injection. This plan closes the gaps identified in the repo review and aligns with the foundational directives.

## Foundations (Must Re-Read)

- [rules.md](../../directives/rules.md)
- [testing-strategy.md](../../directives/testing-strategy.md)
- [schema-first-execution.md](../../directives/schema-first-execution.md)

## Related Plans

- [Config Architecture Standardisation Plan](../architecture/config-architecture-standardisation-plan.md) (parent dependency)
- [Global State Elimination and Testing Discipline Plan](./global-state-elimination-and-testing-discipline-plan.md)

## Scope

### In Scope

- Node-only SDK configuration: remove runtime detection, use explicit config injection.
- Replace direct `process.env` usage in product code with DI-friendly config readers.
- Remove `process.env` mutations in tests; use config builders/factories.
- Replace forbidden type-system shortcuts in tests (e.g. `Record<...>`, `as` casts).

### Out of Scope

- Any new runtime support beyond Node.js.
- Schema-first generator changes unless required for env/config flow.
- Non-essential refactors unrelated to configuration and testing discipline.

## Current Findings (Summary)

1. SDK config implies multi-runtime support and reads globals in a way that breaks outside Node (now out of scope).
2. Product code reads `process.env` outside entry points (violates DI rule).
3. Tests mutate `process.env` (violates testing strategy).
4. Tests include type-system shortcuts (`Record`, `as`) forbidden by rules.

## Plan Phases

### Phase 1: Architecture Alignment (ADR already updated)

- Confirm ADR-027 as Node-only SDK support (completed).
- Ensure any documentation referencing multi-runtime SDK is updated if present.

**Exit Criteria**

- ADR index reflects Node-only SDK; no contradictions in architectural docs.

### Phase 2: SDK Config Injection (Node-only)

- Refactor `packages/sdks/oak-curriculum-sdk/src/config/index.ts` to accept explicit env/config inputs.
- Provide a single config reader (e.g. `readSdkConfig(env)`) used only at entry points.
- Remove runtime detection and any implied edge/browser support.

**Exit Criteria**

- SDK config no longer reads globals directly.
- All SDK config is derived from explicit inputs and validated once.

### Phase 3: App Config Standardisation (DI)

- Apply the canonical config pattern from the Config Architecture Standardisation Plan.
- Migrate `oak-search-cli` to DI-compatible env readers.
  *(Note: `oak-notion-mcp` has been removed — see Item #4
  in the [high-level plan](../../high-level-plan.md).)*
- Remove module-level env constants and direct `process.env` reads in product code.

**Exit Criteria**

- `process.env` reads only occur at entry points.
- No module-level env evaluation in product code.

### Phase 4: Test Refactors (No Global State)

- Replace `process.env` mutations in unit/integration/E2E tests with config builders.
- Update handlers/factories to accept config inputs so tests can pass explicit values.
- Remove any `vi.doMock` or global mocking introduced to patch env access.

**Exit Criteria**

- Zero `process.env` mutations in tests.
- Tests pass using explicit configuration inputs.

### Phase 5: Type Discipline Cleanup

- Remove forbidden type-system shortcuts in tests (e.g. `Record<...>`, `as` casts).
- Replace with narrow helpers or schema validation consistent with rules.

**Exit Criteria**

- No forbidden type shortcuts in modified tests.
- Tests remain behaviour-focused and TDD-compliant.

## Acceptance Criteria

- Node-only SDK config is explicit, DI-friendly, and validated once.
- Product code accesses env only at entry points.
- Tests do not mutate `process.env` or rely on global state.
- No forbidden type shortcuts in updated tests.
- Full quality gates pass (see below).

## Risks and Mitigations

- **Risk**: Wider refactor scope due to env coupling.
  - **Mitigation**: Follow the Config Architecture Standardisation Plan; migrate app-by-app.
- **Risk**: Tests depend on old env behaviour.
  - **Mitigation**: Add config builders and update tests alongside product code changes.

## Verification (Mandatory)

From the repo root, run one at a time, no filters:

```bash
pnpm type-gen # Makes changes
pnpm build # Makes changes
pnpm type-check
pnpm lint:fix # Makes changes
pnpm format:root # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```
