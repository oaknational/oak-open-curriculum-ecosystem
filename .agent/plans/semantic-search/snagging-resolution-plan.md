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

**Objective:** Generate canonical stub payloads during type generation so they automatically stay aligned with the OpenAPI schema.

Tasks:

1. Extend `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts` to:
   - Resolve each tool’s 200-response schema (handling `$ref` via the existing component resolver).
   - Build deterministic fixtures (choose the first enum value, include required arrays with a single entry, provide sensible primitives, etc.).
   - Emit per-tool stub modules plus shared helpers (`createStubToolExecutor`, `createStubbedUniversalExecutors`).
2. Ensure the generator writes these files under `src/types/generated/api-schema/mcp-tools/...` so `pnpm type-gen` remains the single source of truth.
3. TDD:
   - Keep `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts` failing until the generator emits valid fixtures.
   - Add any needed template-focused tests inside `type-gen` to guard fixture structure.
4. Once stubs are generated, run the full gate suite.

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
