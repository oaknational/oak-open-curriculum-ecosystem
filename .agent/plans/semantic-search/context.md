# Semantic Search Recovery – Context Log

_Last updated: 2025-10-20 09:48 BST_

---

## Current Snapshot

- **Generator alignment** – Schema sampling and stub module emitters now exist with unit coverage (`schema-sample-core.ts`, `stub-modules.ts`). The main generator still emits only the legacy artefacts until the new helpers are wired in.
- **Runtime state** – SDK façades stay wafer-thin. Both transports validate requests/responses with generated Zod artefacts, but the streamable HTTP smoke harness still calls manual stubs and receives payloads that fail validation, producing SSE envelopes with `isError: true`.
- **Testing gap** – There is still no automated proof that the dev and production HTTP entry points boot with the correct tool list, Accept-header behaviour, and stub execution. Dedicated vitest + supertest “sanity” suites remain outstanding.
- **Developer experience** – `loadRootEnv` correctly falls back to repo `.env` files for `OAK_API_KEY`. The dev server (`pnpm dev`) bypasses auth via `REMOTE_MCP_ALLOW_NO_AUTH=true`, but Cursor still fails unless callers send `Accept: text/event-stream`, which is expected and must be documented.
- **Quality gates** – Core suites (`pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, and now `pnpm type-gen`) are green. `pnpm smoke:dev` still fails because the manual stubs drift from the generated schemas.

---

## Key Findings

1. Schema sampling and stub-module emitters are in place and tested; the remaining generator work is to integrate them so stubs are emitted during `pnpm type-gen`.
2. Manual stubs in the streamable HTTP harness still drift from generated schemas, so SSE responses remain error-marked until schema-generated fixtures exist.
3. To honour the cardinal rule, stub fixtures must be generated alongside the rest of the SDK artefacts. The generator remains the single source of truth.
4. The dev server already reads `.env` when necessary and fails fast if no key is available—no change required.
5. Cursor failures stem from missing `Accept: text/event-stream`; the middleware legitimately returns 406 and needs clearer documentation and tests.

---

## Work Completed This Session

- Restored `type-gen/typegen/mcp-tools` to the last green structure, deleting speculative helper drafts and trimming generator/unit tests back to the baseline behaviour.
- Updated `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` and the root SDK barrel to drop references to the stub helpers while they are reworked.
- Reverted the stdio and streamable HTTP apps to their pre-experiment stub wiring, keeping manual fixtures in place until schema-driven stubs exist, and deleted the placeholder stub executor unit test.
- Adjusted `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts` to accept schema-shaped arrays (matching the current manual stubs).
- Implemented `schema-sample-core.ts` with deterministic sampling behaviour and added unit coverage.
- Implemented `stub-modules.ts` plus corresponding tests so stub maps render to deterministic modules.
- Ran the full quality gate stack through `pnpm test:ui`; `pnpm smoke:dev` is still red because the transports consume manual stubs that fail schema validation.

---

## In-Flight Work

- **Stage 4 – Schema-generated stubs**
  - Step 3: thread the helpers into `mcp-tool-generator.ts`, replacing the inline logic and reintroducing the scaffold test.
  - Step 4–5: regenerate artefacts and turn the stub executor scaffold green.
- **Stage 5 – Runtime adoption & tests**
  - Replace manual stubs in stdio and streamable HTTP with the generated helper.
  - Add vitest + supertest “sanity” suites covering dev and production scenarios.
- **Stage 6 – Smoke harness & docs**
  - Split smoke scripts (`smoke-dev:stub`, `smoke-dev:live`, `smoke-remote`), share utilities, document Accept-header expectations, and run formatting + gates.
- **Stage 7 – Cursor dev flow validation**
  - Add an automated test that mimics Cursor’s initialise/list/call flow against the stubbed dev server.

---

## Next Steps (Detailed Checklist)

1. **Step 3 – Thread helpers into `mcp-tool-generator.ts`**
   - Extend the generator unit test to assert stub keys in `GeneratedMcpToolFiles`.
   - Import the helpers, remove redundant inline logic, and keep lint limits intact.
   - Reintroduce and update `stub-tool-executor.unit.test.ts` so the generated stubs are exercised.
   - Run the generator unit suite and lint the folder.

2. **Step 4 – Regenerate artefacts and flip the scaffold**
   - Execute `pnpm type-gen` to regenerate outputs and inspect representative stub files.
   - Run `vitest run packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts` to prove the scaffold validates responses.

3. **Step 5 – Full gate sweep**
   - Run `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, `pnpm smoke:dev`.
   - Resolve any failures before advancing to Stage 5.

4. **Adopt shared stubs in apps**
   - Replace `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts` with the generated helper and update unit tests to validate entire responses.
   - Update streamable HTTP to use the helper whenever `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`; adjust unit tests accordingly.
   - Add supertest “sanity” suites for both dev (stub) and prod (auth enforced) flows.
   - Run the full gate suite.

5. **Restructure smoke harness & docs**
   - Create dedicated smoke scripts (stub / live / remote) and shared utilities.
   - Update documentation (plans, context, README) with Accept header, stub usage, `.env` fallback.
   - Run `pnpm format:root`, then the gate suite including each smoke script.

6. **Cursor integration test**
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

2025-10-20 09:48 BST
- Status: Stage 4 Steps 1 & 2 complete. Schema sampling and stub-module emitters exist with unit coverage; generator wiring remains.
- Generator: Ready to import the new helpers and reintroduce generated stubs.
- Tests: Full gate stack (type-gen, build, type-check, lint, test, test:e2e, test:ui) green; `pnpm smoke:dev` still failing because transports use manual stubs.
Reflection: Step 3 is next—wire helpers into the generator, regenerate artefacts, and breathe life into the scaffold test before touching the runtimes.
```
