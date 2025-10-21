# Semantic Search Recovery – Context Log

_Last updated: 2025-10-21 10:43 BST_

---

## Current Snapshot

- **Generator alignment** – `mcp-tool-generator.ts` continues to emit the `stubs/` bundle with optional fields intact; generator unit suites remain green.
- **Runtime state** – Both transports toggle between stub and live execution via env; manual fixtures remain removed. HTTP Accept middleware enforces `text/event-stream`.
- **Test coverage** – Stub-mode and live-mode supertest E2E suites assert SSE envelopes; stdio transport integration tests exercise initialise/list, success, validation, and missing-stub paths. The stubbed “SDK behaviours” suite now relies on lint-compliant helpers for JSON-RPC parsing.
- **Developer experience** – `loadRootEnv` still backfills `OAK_API_KEY`. HTTP and stdio READMEs document Accept header requirements and test commands.
- **Quality gates** – `pnpm make` and `pnpm qg` re-ran 21 October 2025 10:41 BST and completed cleanly (format, type-check, lint, markdownlint, unit/UI/E2E, smoke). Only smoke scripts require network access; all other suites run against generated stubs.

---

## Key Findings

1. `sdk-client-stub.e2e.test.ts` now uses helper functions (`withStubbedHttpApp`, `expectJsonRpcError`) to keep ESLint complexity and safety rules satisfied while asserting schema-shaped payloads.
2. Repository search (`rg "fetch(" --glob "*.test.ts"`) confirms no non-smoke tests call live HTTP endpoints; network reliance is confined to the smoke scripts.
3. Generated stubs continue to flow end-to-end, preserving optional schema fields such as `canonicalUrl`.
4. Smoke scripts still conflate stub vs live intent; restructuring remains part of Stage 6.
5. Cursor integration test coverage remains absent; automation still queued for Stage 7.

---

## Work Completed This Session

- Refactored `sdk-client-stub.e2e.test.ts` using `withStubbedHttpApp`, typed JSON-RPC error helpers, and schema-safe accessors to satisfy ESLint (complexity, optional chaining, unsafe assignments) while keeping assertions behaviour-led.
- Added defensive utilities (`ensureOptionalString`, `expectJsonRpcError`) so payload parsing no longer relies on optional chaining or type assertions, and reused them across canonical URL checks.
- Re-ran targeted commands for the HTTP app (`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`, `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`, `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`) to verify the refactor preserves behaviour.
- Audited tests with `rg "fetch(" --glob "*.test.ts"` confirming network traffic is confined to smoke scripts.
- Executed `pnpm make` and `pnpm qg` (second invocation clean after local rerun) to close Stage 5 with an unfiltered green gate suite.

---

## In-Flight Work

- **Stage 6 – Smoke harness & docs**
  - Split smoke scripts, share assertion helpers, and document Accept header expectations.
- **Stage 7 – Cursor dev flow validation**
  - Automate the SSE initialise/list/call flow against the stubbed dev server.

---

## Next Steps (Detailed Checklist)

1. **Stage 5 – Runtime integration tests**
   - ✅ Task 1: purge legacy `{ data: { data: [...] } }` expectations across all suites.
   - ✅ Task 2: supertest coverage for streamable HTTP in stub mode.
   - ✅ Task 3: live-mode parity coverage with controllable overrides.
   - ✅ Task 4: stdio transport harness and tests.
   - ✅ Task 5: consolidate shared helpers, update documentation, and capture usage guidance.
   - ✅ Task 6: execute gate sweep commands (21 October 2025 10:41 BST – `pnpm make`, `pnpm qg` clean without filters).

2. **Stage 6 – Restructure smoke harness & docs**
   - Split smoke scripts into stub/live/remote variants and share SSE assertion utilities.
   - Refresh documentation (plan/context, README, stdio notes) to explain Accept header rules and test commands.
   - Run `pnpm format:root`, full lint/test suite, and smoke variants.

3. **Stage 7 – Cursor integration test**
   - Implement automated SSE initialise/list/call flow against stubbed dev server.
   - Log the validated run here and keep gates green.

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

2025-10-20 14:30 BST
- Status: Stage 4 complete. Generated stubs include optional schema fields; transports run against them in stub mode.
- Generator: `sampleSchemaObject` now retains optional properties, and `pnpm type-gen` emits fixtures that pass `descriptor.validateOutput`.
- Tests: `pnpm qg` (format → smoke) is green; smoke assertions accept schema-true arrays without expecting an artificial `{ data: ... }` wrapper.
Reflection: Move on to Stage 5 (supertest suites) and Stage 6 (smoke harness split) while keeping the gates green.

2025-10-21 10:34 BST
- Status: Stage 5 Task 5 clean-up. Refactored `sdk-client-stub.e2e.test.ts` to split responsibilities, added typed JSON-RPC helpers, and removed unsafe optional chaining.
- Tests: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`, `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`, `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.
- Reflection: Lint now clean; ready to confirm no suites rely on live HTTP and rerun the full gate stack.

2025-10-21 10:41 BST
- Status: Stage 5 gate sweep sign-off. Repository search verified that only smoke scripts use network APIs; reran unfiltered gates.
- Commands: `rg "fetch(" --glob "*.test.ts"`, `pnpm make`, `pnpm qg`.
- Reflection: Stage 5 complete; Stage 6 smoke harness split is the next active workstream.
```
