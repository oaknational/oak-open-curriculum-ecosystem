# Semantic Search Recovery – Context Log

_Last updated: 2025-10-20 11:10 BST_

---

## Current Snapshot

- **Generator alignment** – `mcp-tool-generator.ts` now emits a `stubs/` bundle alongside the existing artefacts; the new helpers pull schemas via `sampleSchemaObject` and feed `generateStubModules`.
- **Runtime state** – Both transports conditionally call the generated stub executor when `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`. Manual fixtures have been removed.
- **Testing gap** – `src/mcp/stub-tool-executor.unit.test.ts` is back in place and green, but the streamable HTTP Vitest suite and the smoke harness still highlight response drift (missing `canonicalUrl` in sampled payloads).
- **Developer experience** – `loadRootEnv` continues to backfill `OAK_API_KEY`; Accept header enforcement remains in place and documented by the smoke script logs.
- **Quality gates** – `pnpm type-gen`, `pnpm lint`, unit tests, and the app-specific suites now pass with the generated stubs. `pnpm smoke:dev` still fails because the generated fixtures omit optional fields that downstream Zod validators expect (e.g. `canonicalUrl` for key stages).

---

## Key Findings

1. Generated stubs are flowing end-to-end, but the sampler currently drops optional properties (`canonicalUrl`, etc.), triggering SDK validation failures.
2. The stub executor must stay argument-agnostic; upstream universal executors already validate inputs.
3. Smoke scripts must treat stub mode as the default for local runs and only depend on `OAK_API_KEY` when `--require-live` is set.
4. Supertest coverage is still missing for both transports; without it, we rely on smoke scripts to catch schema drift.
5. Cursor integrations continue to require explicit SSE headers; documentation and automated coverage remain outstanding.

---

## Work Completed This Session

- Hooked `sampleSchemaObject` + `generateStubModules` into `mcp-tool-generator.ts`, extending unit tests to assert the new `stubs` outputs.
- Reintroduced `src/mcp/stub-tool-executor.unit.test.ts` to call the generated helper and validate every payload via `validateCurriculumResponse`.
- Exported the stub executor adapter through the SDK barrels and wired both MCP apps (`stub-executors.ts`, streamable HTTP handlers + OpenAI connector) to consume it when stub mode is enabled.
- Regenerated artefacts via `pnpm type-gen`; SDK unit/integration suites, lint, and app-level tests now run against the generated stubs.
- Investigated smoke harness failures and determined that sampled fixtures lack optional fields (`canonicalUrl`), causing runtime validation to set `isError: true`.

---

## In-Flight Work

- **Stage 4 – Schema-generated stubs**
  - Fix sampled fixtures so optional properties (e.g. `canonicalUrl`) are emitted when they appear in the schema.
  - Repeat `pnpm type-gen`, unit suites, and ensure the stub executor test stays green.
- **Stage 5 – Runtime adoption & tests**
  - Add supertest “sanity” suites for stubs vs live modes and ensure transports remain `isError: false`. Use supertest, these are different from the smoke test scripts.
- **Stage 6 – Smoke harness & docs**
  - Split smoke scripts, share assertion helpers, and document Accept header expectations.
- **Stage 7 – Cursor dev flow validation**
  - Automate the SSE initialise/list/call flow against the stubbed dev server.

---

## Next Steps (Detailed Checklist)

1. **Step 4 – Regenerate artefacts and flip the scaffold**
   - Update `schema-sample-core` so optional fields (canonical URLs, etc.) are preserved in the sampled payloads.
   - Re-run `pnpm type-gen` and verify representative stubs under `src/types/generated/api-schema/mcp-tools/generated/stubs/`.
   - Keep `src/mcp/stub-tool-executor.unit.test.ts` green.

2. **Step 5 – Full gate sweep**
   - Run `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, `pnpm smoke:dev`.
   - Resolve any failures before advancing to Stage 5.

3. **Adopt shared stubs in apps**
   - Add supertest “sanity” suites for both dev (stub) and prod (auth enforced) flows.
   - Keep transports wired to the generated helper and re-run the gate suite.
   - These are different from the smoke test scripts.

4. **Restructure smoke harness & docs**
   - Create dedicated smoke scripts (stub / live / remote) and shared utilities.
   - Update documentation (plans, context, README) with Accept header, stub usage, `.env` fallback.
   - Run `pnpm format:root`, then the gate suite including each smoke script.

5. **Cursor integration test**
   - Implement a vitest or Playwright workflow that launches the stubbed dev server and performs `initialize` → `tools/list` → `tools/call` with the SSE header.
   - Record the run in this log and keep the gate suite green.

---

## Command Log

```text
2025-10-19 15:45 BST
- Status: Stage 4 in progress. Added failing unit scaffold (stub-tool-executor.unit.test.ts).
- Generator: mcp-tool-generator.ts now tracks stub payloads; schema walking & module emitters still pending.
- Tests: New unit test intentionally failing until generator emits fixtures.
Reflection: Once schema-driven stubs exist, the transports can consume them and smoke harness work can proceed.

2025-10-19 18:35 BST
- Status: Stage 4 Step 0 complete. Rolled the generator directory back to the last green configuration and removed unused helper drafts.
- Generator: `pnpm type-gen` now succeeds; generated artefacts are restored while stub emission is deferred to later steps.
- Tests: No new suites were added in Step 0; existing generator tests remain green.
Reflection: Next action is Step 1—introduce a schema-sampling core helper under tight TDD.

2025-10-19 19:19 BST
- Status: Baseline green apart from known smoke drift. Manual stub executors reinstated;/stdio e2e assertions tolerate schema-shaped arrays.
- Generator: Unchanged since Step 0 revert; ready for schema sampler work.
- Tests: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui` all pass. `pnpm smoke:dev` continues to fail pending schema-driven stubs.
Reflection: Proceed to Step 1 by adding the schema sampling helper with a red → green unit test, then rebuild the stub pipeline.

2025-10-20 11:05 BST
- Status: Stage 4 Step 4 in progress. Generator emits stub fixtures; transports consume the generated helper when stub mode is enabled.
- Generator: `pnpm type-gen` produces `generated/stubs/**`; schema sampler still omits optional fields (e.g. `canonicalUrl`).
- Tests: `pnpm lint`, SDK unit/integration suites, and app tests are green. `pnpm smoke:dev` remains red because validation rejects the truncated stub payloads.
Reflection: Extend `sampleSchemaObject` so optional properties survive sampling, then rerun the full gate stack before revisiting Stage 5 tasks.
```
