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

### Remaining Focus

1. **Live Smoke: Fail Fast on Missing `OAK_API_KEY`**
   - **Goal:** Harden `smoke:dev:live` so it terminates immediately with a descriptive error if `OAK_API_KEY` is not found via `loadRootEnv`; with the key present (whether via `.env` or env var) the run must remain green.
2. **Split Smoke Utilities for Maintainability**
   - **Goal:** Extract the stub/live/remote preparation logic out of `smoke-tests/smoke-suite.ts` into dedicated modules to satisfy lint ceilings and simplify future edits (e.g. `prepare-local.ts`, `prepare-remote.ts`).
3. **Stdio Tool Description Fix (Stage 5 Task 7)**
   - **Goal:** Update `apps/oak-curriculum-mcp-stdio/src/app/server.ts:170` so tool metadata descriptions come directly from the generated descriptor, with TDD coverage and documentation updates. The detailed execution steps are outlined below.

Exit Criteria: Tasks above completed and validated; Stage 6/Stage 5 notes updated accordingly before moving into full Stage 7 execution.

---

## Stage 7 – Cursor Dev Flow Validation (Will Not Action)

**Decision:** Dropped. Existing Streamable HTTP e2e coverage already exercises initialise/list/call via the transport, and additional Cursor-specific automation offered no incremental assurance.

- 2025-10-22 10:05 BST context entry records the decision and rationale.
- No further work planned for this stage.

---

## Stage 5 Task 7 – STDIO Tool Description Alignment

**Objective:** Ensure the STDIO transport advertises schema-derived tool descriptions without local fallbacks, supported by unit/integration coverage and documentation updates.

### Step 1 – Confirm Descriptor Contract

- **Acceptance criteria:** Documented evidence that every `ToolDescriptor` emitted by the generator supplies a description; any gaps identified for follow-up.
- **Implementation tasks:**
  1. Inspect the generated descriptor module within `@oaknational/oak-curriculum-sdk` to confirm `description` fields originate from the OpenAPI schema.
  2. Note findings in `.agent/plans/semantic-search/context.md`.
- **Validation tasks:** Run `pnpm --filter @oaknational/oak-curriculum-sdk test` to ensure the generator’s unit suite remains green after inspection.

### Step 2 – Update STDIO Registration Logic

- **Acceptance criteria:** `registerMcpTools` sets the tool description to `descriptor.description` only; no string concatenation remains.
- **Implementation tasks:**
  1. Modify `apps/oak-curriculum-mcp-stdio/src/app/server.ts` to remove the `"METHOD /path"` fallback and rely solely on the descriptor metadata.
  2. Ensure the registration options still include the existing title and schema references.
- **Validation tasks:** `pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint`.

### Step 3 – Add Unit Coverage (TDD)

- **Acceptance criteria:** A unit test fails before the product change and passes afterwards, asserting the registered description matches the generated descriptor text.
- **Implementation tasks:**
  1. Extend `apps/oak-curriculum-mcp-stdio/src/app/server.unit.test.ts` to capture the registration options, verifying the description matches the mocked descriptor.
  2. Follow red → green → refactor, using simple fakes per testing strategy.
- **Validation tasks:** `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`.

### Step 4 – Verify Integration Harness Behaviour

- **Acceptance criteria:** The stubbed STDIO server used in tests advertises the schema description when enumerating tools.
- **Implementation tasks:**
  1. Update `apps/oak-curriculum-mcp-stdio/src/app/test-helpers/create-stubbed-stdio-server.ts` (or adjacent integration test) to assert `tools/list` responses expose the descriptor descriptions.
- **Validation tasks:** Execute the affected integration/spec file via `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`.

### Step 5 – Update Documentation and Context

- **Acceptance criteria:** Plan/context documents mention the change; any README references describing STDIO metadata are accurate.
- **Implementation tasks:**
  1. Add a context log entry.
  2. Adjust relevant documentation if needed.
- **Validation tasks:** `pnpm markdownlint:root` when docs change.

### Step 6 – Final Validation Sweep

- **Acceptance criteria:** All lint/test suites pass for the STDIO package; dependent Streamable HTTP e2e tests remain green if impacted.
- **Implementation tasks:**
  1. Run `pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint`.
  2. Run `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`.
  3. Optionally re-run the streamable HTTP e2e suite if descriptors feed into shared helpers.
- **Validation tasks:** Capture results in the context log.

## Backlog (Defer Until Above Stages Complete)

- Address generator lint debt under `type-gen/typegen/operations/**` and `type-gen/typegen/response-map/**`.
- Align downstream UI clients once stub generation is complete and transports are stable.
