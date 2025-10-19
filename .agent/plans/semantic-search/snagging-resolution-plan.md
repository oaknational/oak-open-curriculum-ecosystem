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
2. **Introduce schema-sampling core with TDD**
   - Add a focused unit test covering a minimal schema → sample conversion.
   - Implement a small helper (e.g., `schema-sample-core.ts`) that passes the test while keeping lines-per-file within lint limits.
3. **Layer stub-module emitters**
   - Write a test that asserts the exact strings produced for a trivial tool map.
   - Implement the emitter (`stub-modules.ts`) to satisfy the test without touching the main generator yet.
4. **Thread helpers into `mcp-tool-generator.ts`**
   - Add a generator-level test (or extend the existing one) that validates integration with the new helpers.
   - Update the generator to use the helpers, keeping previously green tests passing.
   - Reintroduce `stub-tool-executor.unit.test.ts` so the generated helpers drive the runtime acceptance.
5. **Regenerate artefacts and re-run the unit scaffold**
   - Execute `pnpm type-gen` and inspect outputs.
   - Run `vitest run packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts` to confirm the scaffold moves from red to green.
6. **Validate the full gate stack**
   - Once the above steps pass, run the complete suite (`build`, `type-check`, `lint`, `test`, `test:e2e`, `test:ui`, `smoke:dev`).

Exit Criteria:

- `pnpm type-gen` emits stub modules and helpers.
- All gates pass with the new fixtures in place.
- The new unit test turns green.

---

## Stage 5 – SDK Runtime & App Integration

**Objective:** Replace handwritten stubs in both apps with the generated helper and prove behaviour with supertest “sanity” suites.

Tasks:

1. Update `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts` to delegate to the generated helper. Adjust unit tests to validate complete responses via `validateCurriculumResponse`.
2. Update streamable HTTP:
   - Inject the helper whenever `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`.
   - Ensure unit tests assert SSE success for stubbed `tools/call`.
3. Add vitest + supertest suites that confirm:
   - Dev mode (stubbed, auth bypass) lists tools and executes stub calls without `isError`.
   - Production mode enforces auth and Accept headers (401/406 as appropriate).
4. After each change set, run the full gate suite.

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
2. Extract shared SSE/assertion utilities; keep negative Accept-header cases and add light unit coverage for helpers.
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
