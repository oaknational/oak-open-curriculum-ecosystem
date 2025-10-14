# Semantic Search SDK Recovery Plan (Cardinal Rule Enforcement)

_All tasks are linear, atomic, and must be executed in order. Each ACTION is immediately followed by its REVIEW. Grounding tasks reference GO.md. Quality gates follow testing-strategy.md._

## Status Snapshot

- Phase 0 baseline collection completed on 2025-10-12 (artefacts logged in `../../evidence-log.md` and `logs/type-check-2025-10-12.txt`).
- Current mission: execute the critical path below to return the SDK to a green state.

## Critical Path Overview

1. Capture failing build evidence and guard the generated search exports.
2. Regenerate search barrels with `.js` specifiers under TDD.
3. Introduce build artefact integration coverage and make it pass.
4. Ensure tsup emits canonical dist artefacts for generated modules.
5. Harden SDK package exports (dist-only for consumers, optional dev surface).
6. Re-run SDK build and confirm green state with updated evidence.
7. Execute full quality gates end-to-end.
8. Update documentation and secure sign-off.

## Phase 4 – tsup & Build Alignment

5. **ACTION:** Update `packages/sdks/oak-curriculum-sdk/tsup.config.ts` (and any supporting entry wiring) so every generated barrel (`src/types/generated/**/*.ts`), MCP runtime module, and public helper is emitted to `dist/` with matching `.js` artefacts.
   - **REVIEW:** Run `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/__tests__/build-artifacts.integration.test.ts` from the repo root. Log the current failing evidence in `../../evidence-log.md`.

6. **ACTION:** Iterate on tsup/export configuration and the MCP generator runtime until `pnpm build` (repo root) and the build artefact integration test both succeed without manual edits. Consolidate MCP literals in `definitions.ts`, restore canonical helper types in `types.ts`, and curate the public barrel in `index.ts`.
   - **REVIEW:** Record the red/green build and integration test results, plus hashes for representative artefacts, in `../../evidence-log.md` as each checkpoint is reached.
7. **QUALITY-GATE:** Re-run `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/__tests__/build-artifacts.integration.test.ts` from the repo root after adjustments to confirm dist coverage remains intact. Log the pass/fail status in `../../evidence-log.md`.
8. **GROUNDING:** Re-read `GO.md`, reflect on alignment with sections I and II, and adjust the plan if new insights emerge.

## Phase 5 – Package Boundary Hardening

9. **ACTION:** Harden MCP tool generation and runtime imports: ensure `types.ts` exports precise `ToolArgs`/`ToolParams`/operation helpers without cycles, curate `index.ts` exports, and re-align runtime code to consume the new surface.
   - **REVIEW:** Extend generator/runtime unit tests to cover the reorganised outputs and capture the results in `../../evidence-log.md`.
10. **ACTION:** Tighten `packages/sdks/oak-curriculum-sdk/package.json` `exports` so production consumers resolve only `./dist/*.js` (with `.d.ts` types) and no deep source imports remain.

- **REVIEW:** Run `pnpm lint --filter @oaknational/oak-curriculum-sdk -- --fix` and capture results in `../../evidence-log.md`, confirming no forbidden imports.

## Phase 6 – Quality Gates

11. **ACTION (QUALITY-GATE):** From the repository root run, in strict order with zero edits between commands:
1. `pnpm install`
1. `pnpm clean`
1. `pnpm type-gen`
1. `pnpm build`
1. `pnpm type-check`
1. `pnpm lint -- --fix`
1. `pnpm format:root`
1. `pnpm markdownlint:root`
1. `pnpm test`
1. `pnpm test:ui`
1. `pnpm test:e2e`
1. `pnpm dev:smoke`

- **REVIEW:** Log the outcome of each command, including key hashes or artefacts, in `../../evidence-log.md`.

## Phase 7 – Documentation & Sign-off

12. **ACTION:** When all gates are green, update this plan, `../../evidence-log.md`, and any impacted READMEs with the completed phases, residual risks, and references.

- **REVIEW:** Capture stakeholder acknowledgement and note any follow-up actions.

13. **GROUNDING:** Re-read `GO.md` to confirm Section I completion and track deferred UI work in `snagging-resolution-ui-plan.md` if re-prioritised.

---

**Completion Criteria:** MCP generator and runtime exports are canonical, repo-wide builds succeed, full quality gates are green, and documentation captures the recovery with residual risks noted.
