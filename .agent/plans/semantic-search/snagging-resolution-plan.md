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

- Honour the gate hierarchy: unit and integration suites must be green before investigating smoke or higher-level regressions.
- Prefer the high-level abstractions provided by `@modelcontextprotocol/sdk`; avoid custom protocol plumbing.

---

## Stage 4 – Schema-Generated Stubs (Completed)

**Objective:** Generate canonical stub payloads during type generation so they automatically stay aligned with the OpenAPI schema, then expose helpers that transports can import directly. ✅

Achievements:

1. **Re-established the green baseline** (2025-10-19) ensuring `pnpm type-gen` succeeded before further changes.
2. **Introduced schema-sampling core with TDD** covering `$ref`, enum, and default precedence.
3. **Layered stub-module emitters** to generate `index.ts`, `tools/index.ts`, and per-tool modules.
4. **Emitted high-fidelity stubs** by teaching `sampleSchemaObject` to retain optional properties such as `canonicalUrl`, then regenerating artefacts and keeping `stub-tool-executor.unit.test.ts` green.
5. **Validated the full gate stack** via `pnpm qg`, confirming build, lint, tests, UI, E2E, and smoke suites (with stubs) all pass.

Exit criteria satisfied: the generator emits stub modules, the SDK/unit suites enforce schema fidelity, and the quality gates are green.

---

## Stage 5 – SDK Runtime & App Integration (Planned)

**Objective:** Demonstrate that both MCP transports behave correctly when backed by the generated stub executor. Replace legacy test doubles, add supertest-driven regression coverage, and ensure all suites run green against schema-faithful payloads.

### Preconditions

- Stage 4 complete (generator emits canonical stubs; `pnpm qg` green).
- Wrapper-based fixtures (`{ data: { data: [...] } }`) removed from all tests/fixtures before this stage closes as part of Task 1 below.

### Task 1 – Purge Wrapper Assumptions ✅

- **Status:** Completed 2025-10-20. All fixtures, helpers, and docs now rely solely on schema-faithful payloads.
- **Key changes:**
  - Replaced legacy `{ data: { data: [...] } }` stubs with raw schema arrays in HTTP e2e tests, smoke harness, and documentation.
  - Removed wrapper-aware validation helper (`pickPayloadForValidation`) from the stdio server and updated the corresponding unit tests.
  - Confirmed no `payload.data` fallbacks remain (`rg 'payload.data' -n` → no matches).
- **Validation:**
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`
  - `pnpm lint`
  - `pnpm qg`

### Task 2 – Streamable HTTP Supertest Coverage (Stub Mode) ✅

- **Status:** Completed 2025-10-21. Supertest + Vitest suite now exercises stub mode end to end.
- **Key changes:**
  - Introduced `createStubbedHttpApp()` helper to enforce stub env wiring (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts`).
  - Added SSE parsing utilities consumed by the new test cases (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/sse.ts`).
  - Wrote coverage for `tools/list`, successful `tools/call`, validation failures, 401, and 406 responses (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/stub-mode.e2e.test.ts`).
- **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.

### Task 3 – Streamable HTTP “Live-mode” Sanity (Optional Auth) ✅

- **Status:** Completed 2025-10-21. Live-mode overrides now mirror stub-mode formatting.
- **Key changes:**
  - Added `createLiveHttpApp()` helper supporting controllable executor overrides (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts`).
  - Implemented success and simulated error parity tests (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/live-mode.e2e.test.ts`).
- **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.

### Task 4 – Stdio Transport Coverage ✅

- **Status:** Completed 2025-10-21. In-memory stdio harness proves stub executor flows.
- **Key changes:**
  - Delivered `createStubbedStdioServer()` harness that wires the generated stub executor into the MCP server (`apps/oak-curriculum-mcp-stdio/src/app/test-helpers/create-stubbed-stdio-server.ts`).
  - Added coverage for initialise/list, successful execution, validation errors, and missing stub payloads (`apps/oak-curriculum-mcp-stdio/src/app/stdio-transport.test.ts`).
- **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`.

### Task 5 – Cross-cutting Clean-ups ✅

- **Status:** Completed 2025-10-21. Shared SSE helpers now live in `e2e-tests/helpers/sse.ts`, and documentation reflects stub/live guidance.
- **Key changes:**
  - Exported `parseJsonRpcResult` and `getContentArray` utilities, refactoring `tool-call-success.e2e.test.ts`, `tool-call-envelope.e2e.test.ts`, and `stub-mode.e2e.test.ts` to reuse them.
  - Documented Accept header enforcement and test commands in the HTTP README; updated stdio README with the new in-memory harness details.
  - 21 October 2025 10:34 BST – Refactored `sdk-client-stub.e2e.test.ts` to satisfy ESLint (complexity, unsafe assignments, unnecessary nullish checks) by introducing `withStubbedHttpApp`, typed JSON-RPC error helpers, and schema-safe accessors.
- Added a stubbed “SDK behaviours” e2e suite under the streamable HTTP app to replace the SDK’s live network test.
- Retired the legacy `client/api-calls.e2e.test.ts` and associated helpers so only smoke tests perform real HTTP requests.
- **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`, `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`.
- **Follow-up:** None outstanding; lint target verified at 21 October 2025 10:36 BST and repository search confirmed no test suites execute live `fetch` calls.

### Task 6 – Gate Sweep & Sign-off ✅

- **Status:** Completed 2025-10-21. Full unfiltered gate suite executed via `pnpm make` and `pnpm qg`.
- **Validation:** `pnpm make`, `pnpm qg` (format-check, type-check, lint, markdownlint, unit/UI/E2E suites, smoke:dev).
- **Notes:** Previous timeout mitigated by addressing lint/test issues; aggregate `pnpm qg` command revalidated at 21 October 2025 10:41 BST after the stub suite refactor.

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
