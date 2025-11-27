+# Restoration Notes

- +The following sections reproduce, from memory, the latest versions of the observability plan, context snapshot, and continuation prompt that existed prior to the destructive git operation.
- +---
- +## `.agent/plans/mcp-oauth-implementation-plan.md`
- +``` +<!-- markdownlint-disable -->
- +# MCP Observability Plan
- +**Status:** Phase 1 – logging consolidation in progress (Tranche 1.2.5 complete)  
  +**Last Reviewed:** 2025-11-03 (post-quality-gate sweep)  
  +**Scope:** `apps/oak-curriculum-mcp-streamable-http`, `apps/oak-curriculum-mcp-stdio`, `packages/libs/logger`
- +## Purpose
- +Deliver a single, type-safe logging strategy across the Oak MCP servers so future transport instrumentation (Phase 2) and rollout (Phase 3) build on a stable foundation.
- +## Snapshot
- +- Legacy trace system removed; debug verbosity now governed solely by `LOG_LEVEL`.
  +- Logger package now publishes browser-safe (`@oaknational/mcp-logger`) and Node-specific (`@oaknational/mcp-logger/node`) entry points.
  +- Full quality gates (format → qg) pass after the restructure; downstream work may resume.
  +- Hosted runtimes (Vercel) must remain stdout-only; stdio runtimes must keep stdout clean and rely on file sinks.
- +### Outstanding Focus Areas
- +- Logger consumers: audit all workspaces so browser/edge code uses the main entry and Node runtimes use `/node`; update configs/tests where necessary.
  +- Documentation: expand README/migration guidance for the entry split and propagate notes to dependent apps.
  +- HTTP server: finish integration tidy-up once audit confirms imports; remove stray file-sink wiring and legacy references.
  +- Stdio server: migrate to shared logger with file-only sink, test stdout silence, document configuration.
  +- Integration: maintain green quality gates after each tranche; update context files with results.
  +- Phases 2 & 3 remain blocked until Phase 1 closes but are kept in view for planning.
- +## Constraints & Guidance
- +- Apply TDD (Red → Green → Refactor) for every code change.
  +- No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`, `Object.*`, `Reflect.*`).
  +- Preserve strict typing and schema-first data flow (all types generated via `pnpm type-gen`).
  +- Keep code within designated boundaries; document every export with tsdoc.
  +- Quality gates must stay green: `format → type-check → lint → test → build`.
  +- Tree-shakeable architecture: main entry must stay browser-safe; Node utilities live under `/node`.
  +- Public API only: no deep imports from `@oaknational/mcp-logger/src/...`.
- +## Critical Architectural Requirements
- +### Tree-Shakeable Logger Design
- +- Browser/edge contexts: no Node built-ins, stdout-only logging, express middleware permitted.
  +- Node contexts: file-sink support via Node built-ins, file-only mode for stdio.
  +- Solution: multiple entry points with main entry browser-safe and `/node` entry augmenting Node-only features.
- +## Validation Commands
- +### Per-Package Pattern
- +For individual packages run: `build → type-check → lint → test → (e2e/smoke where applicable)`.
- +### Full Quality Gate (Tranche 1.5)
- +`
+pnpm format-check:root
+pnpm markdownlint-check:root
+pnpm build
+pnpm type-check
+pnpm lint
+pnpm doc-gen
+pnpm test
+pnpm test:e2e
+pnpm smoke:dev:stub
+pnpm smoke:dev:live
+pnpm qg
+`
- +## Phase 1 – Logging Consolidation
- +### Tranche 1.1 – Shared Logger Foundations ✅
- +- Trace code removed; base logger functionality confirmed; context files updated.
- +### Tranche 1.2 – Shared Logger Enhancements ✅
- +- Semantic modules exported, express middleware shipped, documentation refreshed, `.env` sample produced.
- +### Tranche 1.2.5 – Logger Package Restructuring ✅ COMPLETE (2025-11-03)
- +**Goal:** Ship a browser-safe main entry and Node-specific subpath so bundlers can tree-shake `fs` access out of web builds.
- +#### Delivered Changes
- +- Added `packages/libs/logger/src/node.ts` exposing Node-only exports (`MultiSinkLogger`, file-sink helpers, sink configs, filesystem types).
  +- Trimmed `packages/libs/logger/src/index.ts` to browser-safe symbols and added runtime guardrails in `adaptive.ts`.
  +- Updated `package.json` exports to publish `./node` and ship only `dist` artefacts.
  +- Switched `tsup.config.ts` to a multi-entry build, externalised Node built-ins, enabled tree-shaking, and aligned target to `es2022`.
  +- Added `adaptive-node.ts` plus integration tests covering entry separation.
  +- Refined JSON sanitisation helpers/tests to satisfy lint rules without type loosening.
- +#### Validation Summary
- +- `pnpm --filter @oaknational/mcp-logger build`
  +- `pnpm --filter @oaknational/mcp-logger type-check`
  +- `pnpm --filter @oaknational/mcp-logger lint`
  +- `pnpm --filter @oaknational/mcp-logger test`
  +- `grep -E "require.*['\"](fs|node:fs)['\"]" packages/libs/logger/dist/index.js` → no matches
  +- `grep -E "require.*['\"](fs|node:fs)['\"]" packages/libs/logger/dist/node.js` → fs imports present as expected
  +- `pnpm --filter @oaknational/open-curriculum-semantic-search build`
  +- Full repo gates: `pnpm format-check:root`, `markdownlint-check:root`, `build`, `type-check`, `lint`, `doc-gen`, `test`, `test:e2e`, `smoke:dev:stub`, `smoke:dev:live`, `qg`
- +#### Follow-up Items Rolled Forward
- +- Communicate entry split in README and downstream docs.
  +- Audit every consumer to ensure correct subpath usage (see Tranche 1.2.6).
- +**State:** All quality gates green; workstream unblocked.
- +### Tranche 1.2.6 – Logger Consumer Audit & Docs (NEW – Next Up)
- +**Goal:** Ensure every workspace uses the correct logger entry point, refresh documentation, and capture outcomes for future agents.
- +#### Code & Config Checklist
- +- Catalogue all imports of `@oaknational/mcp-logger`; classify runtime (browser/edge vs Node).
  +- Update browser/edge code to use main entry and avoid file sinks or stdout-disabled configs.
  +- Update Node runtimes (CLI, stdio, background workers) to import from `@oaknational/mcp-logger/node`.
  +- Adjust tests/configs for any workspace touched.
- +#### Documentation Checklist
- +- Expand `packages/libs/logger/README.md` with entry-point guidance and migration notes.
  +- Add migration summaries to affected app docs (HTTP, stdio, semantic search).
  +- Update `.agent/context` files with audit outcomes and remaining follow-up work.
- +#### Validation Checklist
- +- Spot-check builds/tests for each updated workspace (`pnpm --filter <pkg> lint test build`).
  +- Re-run `pnpm qg` once all import adjustments land.
  +- Document results in the continuation prompt.
- +**Exit Criteria:** Consumers aligned to correct entry points, documentation refreshed, quality gates green.
- +### Tranche 1.3 – HTTP Server Clean-up (Queued)
- +- **Prerequisite:** Logger entry-point audit complete.
  +- Verify HTTP server imports only from main entry; remove residual file-sink wiring and legacy references.
  +- Validation: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build`, `type-check`, `lint`, `test`, `smoke:dev:live` (auth smoke remains manual per docs).
- +### Tranche 1.4 – Stdio Server Migration (Queued)
- +- **Prerequisite:** Logger entry-point audit complete.
  +- Import from `/node`, enforce file-only sink, ensure stdout is clean, update tests/docs.
  +- Validation: `pnpm --filter @oaknational/oak-curriculum-mcp-stdio build`, `type-check`, `lint`, `test`, `test:e2e` + manual stdout check.
- +### Tranche 1.5 – Integration & Quality Gates (Queued)
- +- Re-run full quality-gate suite (`pnpm qg`).
  +- Update root README, architecture docs, and continuation prompt with final state.
  +- Note: Auth smoke (`smoke:dev:live:auth`) remains manual-only; document completion outside automated gates.
- +## Phase 2 – Transport Instrumentation (Blocked until Phase 1 complete)
- +- Author integration tests covering normal/slow/timed-out responses.
  +- Instrument transport timing and error hooks using the shared logger.
  +- Emit structured session metadata for debugging.
- +## Phase 3 – Documentation & Rollout (Blocked until Phase 2 complete)
- +- Finalise documentation across apps and SDK.
  +- Verify Vercel configuration for stdout-only logging.
  +- Run markdown lint, quality gates, and capture deployment observations.
- +## Success Metrics (Phase 1)
- +- ✅ Logger package split; Next.js builds pass without `fs` bundling.
  +- ✅ Shared logger documentation and tests updated.
  +- 🔄 Logger consumer audit (Tranche 1.2.6).
  +- 🔜 HTTP and stdio migrations (Tranches 1.3/1.4).
  +- 🔜 Full repo `pnpm qg` post-migration (Tranche 1.5).
- +## References
- +- `.agent/directives-and-memory/rules.md` – repository rules.
  +- `.agent/directives-and-memory/testing-strategy.md` – TDD guidance.
  +- `packages/libs/logger/README.md` – authoritative logger documentation.
  +- `apps/oak-curriculum-mcp-streamable-http/README.md` – HTTP logging configuration.
  +- `apps/oak-curriculum-mcp-stdio/README.md` – stdio logging configuration.
  +- `.agent/context/context.md` & `.agent/context/continuation.prompt.md` – current state snapshots.
- +_Last updated: 2025-11-03 (logger restructure complete; consumer audit queued)_
  +```
- +---
- +## `.agent/context/context.md`
- +```
  +# Context: Oak MCP Ecosystem
- +**Updated**: 2025-11-03  
  +**Branch**: `feat/oauth_support`
- +## Current Focus
- +Phase 1 logging consolidation continues with Tranche 1.2.6 (logger consumer audit & doc refresh) now the top priority. Tranche 1.2.5 is complete, quality gates are green, and downstream work can resume in sequence.
- +## Strategic Goal
- +Deliver a unified, type-safe, well-documented logging foundation that enables transport instrumentation for diagnosing production timeouts and errors while maintaining protocol correctness (stdout-only for HTTP/Vercel; file-only for stdio).
- +## Recent Milestones
- +- ✅ Logger package split into browser-safe main entry and Node subpath (`@oaknational/mcp-logger/node`).
  +- ✅ Adaptive logger updated with browser guardrails; Node runtime gains `adaptive-node` for file sinks.
  +- ✅ Integration tests cover entry separation; JSON sanitisation refactor cleared lint debt.
  +- ✅ Full quality gate suite passed on 2025-11-03 following restructure.
- +## Architectural Guardrails (Still Enforced)
- +1. Tree-shakeable design: browser entry remains free of Node built-ins; Node-only utilities live under `/node`.
  +2. Runtime typing discipline: no `any`, `as`, `Record<string, unknown>`, broad guards, or schema drift.
  +3. Public API only: consumers import via package exports, never `src/` paths.
  +4. Validated data: treat inputs as `unknown`, validate immediately, never widen afterwards.
  +5. TDD & fail fast: keep Red → Green → Refactor loop; prefer `parse` with explicit errors (or handle `safeParse` results immediately).
- +## Next Steps (Execute in Order)
- +### 1. Tranche 1.2.6 – Logger Consumer Audit & Documentation (IN PROGRESS)
- +- Catalogue imports of `@oaknational/mcp-logger` across the monorepo and classify each runtime.
  +- Ensure browser/edge code uses the main entry and avoids file sinks or stdout-disabled configs.
  +- Ensure Node runtimes (stdio server, CLI tools, background jobs) import from `/node`.
  +- Update tests/configs as needed; keep `.js` suffixes in place.
  +- Extend documentation (logger README, app docs) with entry-point guidance; record audit outcomes here and in the continuation prompt.
  +- Validation: targeted `lint/test/build` per affected workspace → rerun `pnpm qg` once complete.
- +### 2. Tranche 1.3 – HTTP Server Clean-up (Queued)
- +- Depends on audit completion.
  +- Remove residual adapters/file sink logic; scrub legacy `MCP_STREAMABLE_HTTP_*` references.
  +- Validation: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build type-check lint test smoke:dev:live`.
- +### 3. Tranche 1.4 – Stdio Server Migration (Queued)
- +- Depends on audit completion.
  +- Import from `/node`, enforce file-only sink, verify stdout silence with tests/manual check, document configuration.
  +- Validation: `pnpm --filter @oaknational/oak-curriculum-mcp-stdio build type-check lint test test:e2e` plus manual stdout check.
- +### 4. Tranche 1.5 – Integration & Quality Gates (Queued)
- +- Re-run full `pnpm qg` after migrations.
  +- Update shared documentation and continuation prompt with final baseline.
  +- Auth smoke remains manual; document the run outside automated gates.
- +## State Snapshot
- +| Tranche | Description | Status / Notes |
  +|---------|---------------------------------------|--------------------------------------------------|
  +| 1.1 | Legacy trace system removal | ✅ Complete |
  +| 1.2 | Shared logger enhancements | ✅ Complete |
  +| 1.2.5 | Logger package restructure | ✅ Complete (2025-11-03) |
  +| 1.2.6 | Logger consumer audit & docs | 🔄 In progress (highest priority) |
  +| 1.3 | HTTP server clean-up | ⏳ Pending (after 1.2.6) |
  +| 1.4 | Stdio server migration | ⏳ Pending (after 1.2.6) |
  +| 1.5 | Integration & quality gates | ⏳ Pending |
- +## Quality Gate Status
- +Latest run (2025-11-03) succeeded:
- +`
+pnpm format-check:root
+pnpm markdownlint-check:root
+pnpm build
+pnpm type-check
+pnpm lint
+pnpm doc-gen
+pnpm test
+pnpm test:e2e
+pnpm smoke:dev:stub
+pnpm smoke:dev:live
+pnpm qg
+`
- +Re-run the suite after Tranche 1.2.6 adjustments and subsequent tranches.
- +## Reference Rules & Documents
- +- `.agent/plans/mcp-oauth-implementation-plan.md` – authoritative roadmap.
  +- `.agent/context/continuation.prompt.md` – hand-off prompt (kept in sync with this file).
  +- `.agent/directives-and-memory/rules.md` – cardinal rules.
  +- `.agent/directives-and-memory/testing-strategy.md` – required TDD approach.
  +- `packages/libs/logger/README.md` – logger usage & entry points.
  +- `apps/oak-curriculum-mcp-streamable-http/TESTING.md` – HTTP testing guidance.
  +```
- +---
- +## `.agent/context/continuation.prompt.md`
- +```
  +# Continuation Prompt: Oak MCP Observability Implementation
- +**Last Updated**: 2025-11-03  
  +**Status**: ✅ Logger restructure complete · 🔄 Tranche 1.2.6 (consumer audit) in progress
- +Use this prompt to rehydrate a fresh chat session.
- +## Startup Checklist
- +- Read (in order):
- 1.  `@.agent/context/context.md`
- 2.  `.agent/plans/mcp-oauth-implementation-plan.md`
- 3.  `.agent/directives-and-memory/rules.md`
- 4.  `.agent/directives-and-memory/testing-strategy.md`
      +- Confirm understanding of the logger entry-point split (main vs `/node`).
      +- Keep all quality gates green; never disable or skip checks.
- +## Current State Snapshot
- +- Logger package publishes separate browser and Node entry points; Next.js builds succeed without `fs` dependencies.
  +- Integration tests and JSON sanitisation refactor landed; repo-wide quality gates green.
  +- Active work: Tranche 1.2.6 to audit imports and refresh docs before HTTP/stdio migrations.
- +## Immediate Priorities (Follow in Order)
- +1. **Tranche 1.2.6 – Logger Consumer Audit & Docs**
- - Catalogue imports, align runtimes with correct entry point, update docs, record results, rerun `pnpm qg`.
    +2. **Tranche 1.3 – HTTP Server Clean-up**
- - Remove bespoke adapters/file-sink wiring; validation includes `smoke:dev:live`.
    +3. **Tranche 1.4 – Stdio Server Migration**
- - Adopt `/node`, enforce file-only sink, verify stdout silence, update docs/tests.
    +4. **Tranche 1.5 – Integration & Quality Gates**
- - Re-run full `pnpm qg`, update shared docs, capture new baseline.
- +## Guardrails & Reminders
- +- No type shortcuts (`any`, `as`, `!`, `Record<string, unknown>`, `Object.*`, `Reflect.*`).
  +- Treat incoming data as `unknown` and validate immediately.
  +- Public API only; no deep imports from logger package internals.
  +- Prefer `parse` with clear errors (or handle `safeParse` results immediately).
  +- TDD: Red → Green → Refactor for every change.
- +## Quality Gate Baseline (Post-Tranche 1.2.5)
- +`
+pnpm format-check:root
+pnpm markdownlint-check:root
+pnpm build
+pnpm type-check
+pnpm lint
+pnpm doc-gen
+pnpm test
+pnpm test:e2e
+pnpm smoke:dev:stub
+pnpm smoke:dev:live
+pnpm qg
+`
- +Re-run after Tranche 1.2.6 and subsequent tranches.
- +## Quick Reference
- +- Plan: `.agent/plans/mcp-oauth-implementation-plan.md`
  +- Context snapshot: `.agent/context/context.md`
  +- Rules: `.agent/directives-and-memory/rules.md`
  +- Testing strategy: `.agent/directives-and-memory/testing-strategy.md`
  +- Logger docs: `packages/libs/logger/README.md`
- +## Hand-off Notes
- +- Repo currently green post-restructure.
  +- Pending work order: 1.2.6 → 1.3 → 1.4 → 1.5.
  +- Auth smoke (`smoke:dev:live:auth`) stays manual; document outcomes separately.
  +- Record validation commands + results in plan/context as you progress.
- +---
- +**Next Review:** After Tranche 1.2.6 completion.
  +```
