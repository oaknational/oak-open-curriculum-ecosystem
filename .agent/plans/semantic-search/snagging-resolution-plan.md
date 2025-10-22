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

### Task 7 – Fix STDIO Tool Description Bug ⏳

- **Status:** Identified 2025-10-21. OpenAI Apps SDK metadata audit revealed STDIO server overrides rich OpenAPI descriptions with generic "GET /path" strings.
- **Issue:** `apps/oak-curriculum-mcp-stdio/src/app/server.ts:170` constructs description as `descriptor.method.toUpperCase() + ' ' + descriptor.path`, discarding the transformed OpenAPI `operation.description` already available in `descriptor.description`.
- **Impact:** ChatGPT sees "GET /subjects" instead of "This tool returns an array of all available subjects and their associated sequences, key stages and years", severely degrading tool discovery and selection accuracy for OpenAI Apps SDK integration.
- **Fix:** Change line 170 from:

  ```typescript
  const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;
  ```

  to:

  ```typescript
  const description =
    descriptor.description ?? `${descriptor.method.toUpperCase()} ${descriptor.path}`;
  ```

- **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`, verify tool registration exposes rich descriptions matching HTTP server behaviour.
- **Note:** HTTP server (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:41`) already correctly uses `tool.description` via `listUniversalTools()`.

---

## Stage 6 – Smoke Harness, Documentation, and Formatting

**Objective:** Make the smoke harness deterministic, DRY, and well-documented across stub, live, and remote modes.

### Completed groundwork

1. **Catalogue current smoke harness** ✅
   - Completed 2025-10-21 10:05 BST; context log summarises existing commands, environment dependencies, and network touchpoints.
2. **Design stub/live/remote command matrix** ✅
   - Completed 2025-10-21 11:22 BST; plan captures target commands, environment inputs, and CI hand-off expectations.
3. **Refactor smoke environment bootstrap** ✅
   - `prepareEnvironment` now shapes stub/live/remote modes, lazily imports the HTTP app, and keeps stub runs off the repo `.env` while logging deterministic token usage and `.env` provenance.
4. **Respect remote URL precedence** ✅
   - Remote smoke resolves the base URL in the order CLI → `SMOKE_REMOTE_BASE_URL` → `OAK_MCP_URL`, logging the winning source (including defaults from the repo `.env`).
5. **Rename smoke harness directory** ✅
   - CLI scripts now live under `smoke-tests/`, with package manifests, Turbo inputs, tsconfigs, ESLint ignores, docs, and plan/context references updated to match the new structure.

### Remaining tasks

1. **Introduce structured logging and payload capture** ✅
   - **Acceptance:** Smoke harness routes logs through `@oaknational/mcp-logger`, emits structured context for environment setup and assertion phases, and—when `SMOKE_LOG_TO_FILE=true`—writes final SSE payloads to `tmp/smoke-logs/{mode}-{tool}.json` for stub, live MCP, and upstream REST captures.
   - **Implementation:**
     1. Finalise the logging split (`smoke-suite.ts` delegating to `environment.ts`, `logging.ts`, and assertion-specific loggers) and keep lint under threshold ✅ (2025-10-21).
     2. Ensure each assertion logs request/response metadata, raw SSE envelopes, and validation outcomes; remote modes should warn instead of failing on 4xx/5xx ✅ (2025-10-21).
     3. Extend snapshot writer to tag source (`stub`, `local-live`, `rest`) and persist payloads for diffing ✅ (2025-10-21 18:04 BST via `SMOKE_CAPTURE_ANALYSIS=true`).
     4. Add instrumentation around output validation to log the failing payload and Zod issues when `validateOutput` returns `{ ok: false }` ✅ (2025-10-21 17:55 BST, exercised in `handlers.unit.test.ts`).
   - **Validation:** `LOG_LEVEL=debug SMOKE_LOG_TO_FILE=true SMOKE_CAPTURE_ANALYSIS=true pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`, `smoke:dev:live`, and `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:capture:rest` generate structured console output plus JSON artefacts for `get-key-stages` / `get-key-stages-subject-lessons` under `tmp/smoke-logs/analysis/`.
   - **Progress:** 2025-10-21 18:05 BST – Local stub/live runs now emit analysis snapshots (`*-local-stub.sse.json`, `*-local-live.sse.json`) alongside REST captures (`*-rest.json`). Output-validation failures surface through `logger.warn('MCP tool validation failed', …)` with truncated payloads and Zod issue lists.
2. **Canonically load live-mode credentials**
   - **Acceptance:** Live smoke runs succeed using `OAK_API_KEY` sourced from the repo-root `.env`, and missing credentials trigger a clear error message naming the key and searched files.
   - **Implementation:**
     1. Confirm `prepareEnvironment` loads `OAK_API_KEY` via `loadRootEnv({ requiredKeys: ['OAK_API_KEY'] })`.
     2. Fail fast with a descriptive error when the key is still absent.
     3. Remove redundant credential-loading code from entry points.
   - **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live` (expect success when `.env` populated) and an additional run with the key temporarily unset (expect descriptive failure).
   - **Progress:** 2025-10-21 – `loadRootEnv` loads `.env`; direct SDK call to `https://open-api.thenational.academy/api/v0/key-stages` succeeds, confirming the key is valid. Live smoke failure now attributed to output validation rather than missing credentials.
3. **Analyse live-mode payload parity** ✅
   - **Acceptance:** Differences between stub outputs and live responses (e.g. canonical URLs) are documented and reconciled so the harness validates the correct shape.
   - **Implementation:**
     1. Capture live responses during `smoke:dev:live` (before formatting) and compare against the schema-generated validators ✅ (`tmp/smoke-logs/analysis/get-key-stages-local-live.sse.json`).
     2. Patch the generator/runtime to unwrap OpenAPI `{ data, response }` envelopes so live data passes validation; update tests and stubs accordingly ✅ (`pnpm --filter @oaknational/oak-curriculum-sdk type-gen`, refreshed `execute-tool-call.unit.test.ts`).
     3. Record findings and decisions in the plan/context ✅ (2025-10-21 18:10 BST).
   - **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live` exits successfully and logs the reconciled shape; `tmp/smoke-logs/analysis/` holds stub, MCP live, and REST payloads for key tools.
   - **Progress:** 2025-10-21 18:10 BST – MCP executors now emit schema-shaped arrays (no `{ data, response }` wrapper); live SSE payloads align with stubs, and REST captures document upstream fields for diffing.
4. **Clarify remote-mode behaviour**
   - **Acceptance:** Remote smoke logs precedence (CLI → `SMOKE_REMOTE_BASE_URL` → `OAK_MCP_URL`), records response codes when auth is disabled, and treats 401s as informative without masking legitimate failures.
   - **Implementation:**
     1. Simplify remote assertions to log status codes instead of expecting specific auth outcomes.
     2. Add guidance to documentation about the unauthenticated production deployment.
     3. Ensure logging captures base URL source, status codes, and any schema validation results.
   - **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote` logs precedence and response summaries without raising avoidable assertion errors.
   - **Progress:** 2025-10-21 18:25 BST – Remote environment now requires an explicit base URL and no longer mandates a bearer token; the Accept-header checks record remote responses instead of asserting on 401s, and the README explains that the alpha deployment is unauthenticated and drifted.
5. **Document new commands and environment flow**
   - **Acceptance:** Updated documentation (HTTP README, Stage plan, context log) explains the three smoke commands, environment precedence (CLI → `SMOKE_REMOTE_BASE_URL` → `OAK_MCP_URL` → repo `.env`), deterministic tokens, and Accept header requirements.
   - **Implementation:**
     1. Revise `apps/oak-curriculum-mcp-streamable-http/README.md` with usage guidance, environment flow, and drift caveats.
     2. Document structured logging toggles (`LOG_LEVEL`, `SMOKE_LOG_TO_FILE`), snapshot locations, and stub/live diff workflow.
     3. Update Stage plan/context entries to reflect the refactor and log timestamps.
     4. Ensure language follows British English and repository documentation style.
   - **Validation:** `pnpm markdownlint:root`; spot-check docs for correct anchors and notation.
   - **Progress:** 2025-10-21 – README updates now cover logging toggles, snapshot paths, diff commands, and remote diagnostics behaviour; markdownlint run clean. Plan/context entries updated accordingly.
6. **Split smoke utilities for maintainability**
   - **Acceptance:** `smoke-tests/smoke-suite.ts` is reduced below the lint threshold by extracting mode-specific helpers into dedicated modules without altering behaviour.
   - **Implementation:** Move stub/live/remote preparation logic into separate files (e.g. `prepare-local.ts`, `prepare-remote.ts`) and re-export via `smoke-tests/smoke-suite.ts`.
   - **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`.
7. **Run lint, tests, and smoke suites**
   - **Acceptance:** Lint, unit, e2e, and all smoke variants run from the HTTP workspace; remote runs may log informative failures but must capture base URL and status codes.
   - **Implementation:**
     1. From the repo root run:
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
        - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote`
     2. Capture timings and notable logs in `.agent/plans/semantic-search/context.md`.
   - **Validation:** Ensure each command completes (remote failures acceptable with logged rationale) and update the context log accordingly.
8. **Run full gate sweep**
   - **Acceptance:** `pnpm make` and `pnpm qg` succeed unfiltered after the refactor.
   - **Implementation:**
     1. Execute both commands from the repo root with at least a five-minute timeout allowance.
     2. Record start/end timestamps, durations, and key observations in the context log.
   - **Validation:** Both commands finish green; context log reiterates gate health for Stage 6 closure.

Exit Criteria: All smoke variants pass; documentation mirrors the new workflows; linting and formatting remain clean.

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
