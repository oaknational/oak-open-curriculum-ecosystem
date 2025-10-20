# Semantic Search SDK Recovery Plan

## Mission

Restore a fully schema-first pipeline where every runtime artefact—including stub fixtures—is generated directly from the Open Curriculum OpenAPI schema. The goal: running `pnpm type-gen` should emit all files required by the SDK and both MCP transports so they remain in lockstep without manual intervention.

## Ground Rules

- Re-read `.agent/directives-and-memory/rules.md`, `.agent/directives-and-memory/schema-first-execution.md`, and `docs/agent-guidance/testing-strategy.md` before touching code.
- After any meaningful change, run the full gate suite from the repo root:

  ```bash
  pnpm type-gen
  pnpm build
  pnpm type-check
  pnpm lint
  pnpm test
  pnpm test:e2e
  pnpm test:ui
  pnpm smoke:dev (and additional smoke targets once split)
  ```

- Prefer the high-level abstractions provided by `@modelcontextprotocol/sdk`; avoid custom protocol plumbing.

---

## Stage 4 – Schema-Generated Stubs (In Progress)

**Objective:** Generate canonical stub payloads during type generation so they automatically stay aligned with the OpenAPI schema, then expose helpers that transports can import directly.

**Progress:** Step 0 (re-establish the green baseline) completed on 2025-10-19 18:35 BST; proceed with Step 1.

Tasks (small, test-driven increments):

1. **Re-establish the green baseline** _(completed 2025-10-19)_
   - Revert `type-gen/typegen/mcp-tools/` to the last working structure (single generator file plus existing parts).
   - Prove `pnpm type-gen` runs clean before introducing new helpers.
2. **Introduce schema-sampling core with TDD** _(completed)_
   - Added `schema-sample-core.unit.test.ts` covering refs/enum/default precedence.
   - Implemented `schema-sample-core.ts` with recursion, `$ref` resolution, and deterministic defaults.
3. **Layer stub-module emitters** _(completed)_
   - Added `stub-modules.unit.test.ts` asserting exact file output for a test stub map.
   - Implemented `stub-modules.ts` to generate `index.ts`, `tools/index.ts`, and per-tool modules.
4. **Thread helpers into `mcp-tool-generator.ts`**
   - Extend `mcp-tool-generator.unit.test.ts` (and `typegen-core.test.ts`) so `GeneratedMcpToolFiles` includes `stubs`.
   - Import `sampleSchemaObject` / `generateStubModules`, delete the old placeholder map, and keep the dependency graph intact.
   - Recreate `src/mcp/stub-tool-executor.unit.test.ts` to consume the generated helper (calls each tool, validates with `validateCurriculumResponse`).
   - Run the generator/unit suites plus SDK lint to confirm coverage.
5. **Regenerate artefacts and re-run the unit scaffold**
   - Execute `pnpm type-gen`, inspect emitted stub files under `src/types/generated/api-schema/mcp-tools/generated/stubs/`.
   - Run `vitest run packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts` and ensure it passes.
6. **Validate the full gate stack**
   - Once Steps 1–5 are complete, run `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, `pnpm smoke:dev`.
   - Fix any failures immediately (expected: `smoke:dev` turns green when stubs align with schemas).

Exit Criteria:

- `pnpm type-gen` emits stub modules and helpers.
- All gates pass with the new fixtures in place.
- The new unit test turns green.

---

## Stage 5 – SDK Runtime & App Integration

**Objective:** Replace handwritten stubs in both apps with the generated helper and prove behaviour with supertest “sanity” suites.

Tasks:

1. Update `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts` to call the generated helper; delete manual fixtures and update `stub-executors.unit.test.ts` to validate via `validateCurriculumResponse`.
2. Update streamable HTTP (`src/env.ts`, `src/handlers.ts`):
   - Branch on `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` and wire the generated helper.
   - Ensure existing unit tests assert `isError: false` responses for stub mode.
3. Add vitest + supertest sanity suites (one for stubbed dev mode, one for prod/auth flows) covering `tools/list`, `tools/call`, Accept header enforcement, and auth rejection.
4. After each incremental change, run the full gate suite and keep `pnpm smoke:dev` green.

Exit Criteria:

- Both transports rely solely on generated stubs.
- New supertest suites pass.
- The full gate suite stays green.

---

## Stage 6 – Smoke Harness, Documentation, and Formatting

**Objective:** Restructure smoke tests, document expectations, and polish the repo.

Tasks:

1. Split smoke commands into:
   - `pnpm smoke:dev:stub`
   - `pnpm smoke:dev:live`
   - `pnpm smoke:remote`
2. Extract shared SSE/assertion utilities; keep negative Accept-header cases and add unit coverage for the helpers.
3. Update documentation:
   - `.agent/plans/semantic-search/context.md`
   - `.agent/plans/semantic-search/snagging-resolution-plan.md`
   - `apps/oak-curriculum-mcp-streamable-http/README.md`
   - Emphasise Accept header requirements, `.env` fallback for `OAK_API_KEY`, and stub vs live smoke usage.
4. Run `pnpm format:root`, then execute the full gate suite for each smoke variant.

Exit Criteria:

- All smoke variants pass.
- Documentation reflects the new workflows and header requirements.
- Formatting/linting remains clean.

---

## Stage 7 – Cursor Dev Flow Validation

**Objective:** Provide automated assurance that Cursor (or any SSE client) can talk to the dev server in stub mode.

Tasks:

1. Add a vitest or Playwright integration test that:
   - Launches the streamable HTTP dev server with stubs enabled.
   - Performs `initialize`, `tools/list`, and `tools/call` via fetch with `Accept: text/event-stream`.
   - Asserts 200 responses and SSE envelopes without `isError`.
2. Record the successful run in the context log and maintain a green gate suite.

Exit Criteria:

- Cursor-style integration test passes consistently.
- Results captured in `.agent/plans/semantic-search/context.md`.

---

## Backlog (Defer Until Above Stages Complete)

- Address generator lint debt under `type-gen/typegen/operations/**` and `type-gen/typegen/response-map/**`.
- Align downstream UI clients once stub generation is complete and transports are stable.
