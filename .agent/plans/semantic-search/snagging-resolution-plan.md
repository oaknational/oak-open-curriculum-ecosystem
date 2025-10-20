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

### Task 2 – Streamable HTTP Supertest Coverage (Stub Mode)

- **Goal:** Prove the HTTP transport returns schema-valid results when stubs are enabled.
- **Implementation steps:**
  1. Add a test helper (e.g. `createStubbedHttpApp()`) that sets `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`, clears API keys, and returns an Express app wired to the real stub executor.
  2. Write supertest/Vitest cases covering:
     - `tools/list` (assert roster matches `listUniversalTools()` output).
     - `tools/call` success for at least one representative endpoint (validate canonical URL presence, SSE structure).
     - `tools/call` validation failure (invalid args → 200 envelope with `isError` flagged via stub executor).
     - Auth rejection (401 when header missing).
     - Accept-header enforcement (406 when `text/event-stream` absent).
  3. Ensure no spies/mocks replace the executor; rely on generated stubs only.
- **TDD expectations:** For each scenario, write a failing test, then adjust server helpers/config until it passes.
- **Validation:** `pnpm test apps/oak-curriculum-mcp-streamable-http` must succeed with the new suite; SSE assertions confirm raw payloads.

### Task 3 – Streamable HTTP “Live-mode” Sanity (Optional Auth)

- **Goal:** Prove the same suite works when stubs are disabled and a fake Oak client is injected.
- **Implementation steps:**
  1. Introduce an override factory that injects a controllable `executeMcpTool` returning schema-compliant data (no wrappers).
  2. Replicate success/error scenarios ensuring the transport still formats responses correctly with live-mode hooks.
- **Validation:** Extended tests pass, demonstrating parity between stubbed and live flows.

### Task 4 – Stdio Transport Coverage

- **Goal:** Add integration tests for the stdio server demonstrating stub-backed executions.
- **Implementation steps:**
  1. Expose a test harness (`createStubbedStdioServer`) that instantiates the stdio transport with `createStubToolExecutionAdapter()`; capture responses without network calls (e.g. using in-memory pipes or the existing MCP transport helpers).
  2. Cover:
     - `initialize` + `tools/list` (responses match generated descriptors).
     - `tools/call` success (assert returned content contains schema-valid JSON with canonical fields).
     - `tools/call` validation failure and missing stub scenarios.
  3. Ensure no auth/header expectations (stdio is local only).
- **TDD expectations:** Write failing tests first, verify they fail because stub wiring is missing, then implement harness until green.
- **Validation:** `pnpm test apps/oak-curriculum-mcp-stdio` passes with new cases.

### Task 5 – Cross-cutting Clean-ups

- **Goals:** Keep implementation aligned with repository directives.
- **Steps:**
  1. Update shared test utilities if duplication arises (e.g. SSE parsing helper reused between unit and smoke tests).
  2. Document stub-mode expectations in `apps/oak-curriculum-mcp-streamable-http/README.md` and equivalent stdio notes.
- **Validation:** `pnpm lint`, `pnpm format:root`, and `pnpm test` run clean after documentation updates.

### Task 6 – Gate Sweep & Sign-off

- **Goal:** Ensure the repository remains compliant after Stage 5.
- **Steps:** Run `pnpm qg` (format-check, type-check, lint, markdownlint, unit/UI/E2E tests, smoke:dev). Resolve regressions immediately.
- **Exit criteria:** All new tests pass, smoke harness stays green, no `{ data: { data: ... } }` remnants, supertest coverage in place for both transports.

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
