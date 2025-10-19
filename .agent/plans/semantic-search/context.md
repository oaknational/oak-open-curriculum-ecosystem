# Semantic Search Recovery – Context Log

_Last updated: 2025-10-20 15:45 BST_

---

## Current Snapshot

- **Generator alignment** – All core MCP tooling still flows from the Open Curriculum OpenAPI schema. Stub payloads, however, are still authored manually in the stdio app, so they drift from the generated response schemas. Replacing them with schema-generated fixtures is the remaining blocker.
- **Runtime state** – SDK façades stay wafer-thin. Both transports validate requests/responses with generated Zod artefacts, but the streamable HTTP smoke harness calls the manual stubs and receives payloads that fail validation, producing SSE envelopes with `isError: true`.
- **Testing gap** – There is no automated proof that the dev and production HTTP entry points boot with the correct tool list, Accept-header behaviour, and stub execution. A vitest + supertest “sanity” suite is required.
- **Developer experience** – `loadRootEnv` correctly falls back to repo `.env` files for `OAK_API_KEY`. The dev server (`pnpm dev`) bypasses auth via `REMOTE_MCP_ALLOW_NO_AUTH=true`, but Cursor still fails unless callers send `Accept: text/event-stream`, which is expected and must be documented.
- **Quality gates** – `pnpm test`, `pnpm test:e2e`, and `pnpm test:ui` are green. `pnpm smoke:dev` currently fails because the stub payloads do not match the generated schemas.

---

## Key Findings

1. Manual stubs in the streamable HTTP harness no longer satisfy generated output schemas, resulting in SSE responses flagged with `isError: true`.
2. To honour the cardinal rule, stub fixtures must be generated alongside the rest of the SDK artefacts. Running `pnpm type-gen` should emit them automatically.
3. The dev server already reads `.env` when necessary and fails fast if no key is available—no change required.
4. Cursor failures stem from missing `Accept: text/event-stream`; the middleware legitimately returns 406. We must document and test this explicitly.
5. We lack supertest-based confidence that dev/prod servers expose consistent tool lists and stub behaviour; new “sanity” tests will address that.

---

## Work Completed This Session

- Added a TDD scaffold: `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts`. It calls `createStubToolExecutor` for every tool, then validates the envelope with `validateCurriculumResponse`. The helper does not yet exist, so the test fails intentionally.
- Began extending `type-gen/typegen/mcp-tools/mcp-tool-generator.ts` to collect per-tool stub payloads. Imports for component resolution, stub tracking, and a new `stubs` output bucket are in place, but the schema-walking logic and module emitters are still to-do.

---

## In-Flight Work

- **Stage 4 – Schema-generated stubs**
  - Implement schema walkers that derive deterministic 200-response payloads for each tool (including `$ref` resolution and sensible defaults).
  - Extend the generator so every `pnpm type-gen` run emits per-tool stub modules plus helpers (`createStubToolExecutor`, `createStubbedUniversalExecutors`).
  - Ensure generated files live under `src/types/generated/api-schema/mcp-tools/...`.
  - Rerun the full gate suite once stubs emit successfully.
- **Stage 5 – Runtime adoption & tests**
  - Replace manual stubs in stdio and streamable HTTP with the generated helper.
  - Add vitest + supertest “sanity” suites covering dev and production scenarios.
- **Stage 6 – Smoke harness & docs**
  - Split smoke scripts (`smoke-dev:stub`, `smoke-dev:live`, `smoke-remote`), share utilities, document Accept-header expectations, and run formatting + gates.
- **Stage 7 – Cursor dev flow validation**
  - Add an automated test that mimics Cursor’s initialise/list/call flow against the stubbed dev server.

---

## Next Steps (Detailed Checklist)

1. **Finish generator stub support**
   - Complete the stub generation functions in `mcp-tool-generator.ts`.
   - Emit modules and helpers under the generated tree.
   - Run `pnpm type-gen`.
   - Execute full gates:  
     `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, `pnpm smoke:dev`.

2. **Adopt shared stubs in apps**
   - Replace `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts` with the generated helper and update unit tests to validate entire responses.
   - Update streamable HTTP to use the helper whenever `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`; adjust unit tests accordingly.
   - Add supertest “sanity” suites for both dev (stub) and prod (auth enforced) flows.
   - Run the full gate suite.

3. **Restructure smoke harness & docs**
   - Create dedicated smoke scripts (stub / live / remote) and shared utilities.
   - Update documentation (plans, context, README) with Accept header, stub usage, `.env` fallback.
   - Run `pnpm format:root`, then the gate suite including each smoke script.

4. **Cursor integration test**
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
```
