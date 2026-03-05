---
name: "MCP Result Pattern Unification (Execution)"
overview: "Execute WS1-WS6 to converge MCP tool execution on Result<T, E> and remove legacy ToolExecutionResult union handling."
source_strategy: "../future/06-mcp-consumer-integration/mcp-result-pattern-unification.md"
todos:
  - id: ws1-result-contract
    content: "WS1: Convert executeToolCall and stub executor to Result<ToolExecutionSuccess, McpToolError | McpParameterError>."
    status: completed
  - id: ws2-remove-extract-execution-data
    content: "WS2: Remove extractExecutionData and update universal/aggregated execution paths to consume Result directly."
    status: completed
  - id: ws3-consumer-adoption
    content: "WS3: Update stdio and streamable-http consumers/tests to Result.ok / Result.error branches."
    status: completed
  - id: ws4-remaining-consumers
    content: "WS4: Complete remaining consumer migration and remove any residual legacy shape assumptions."
    status: pending
  - id: ws5-quality-gates
    content: "WS5: Run workspace quality gates and resolve regressions before promotion/closure."
    status: in_progress
  - id: ws6-doc-propagation
    content: "WS6: Propagate final contract changes to roadmap/high-level/docs and archive when complete."
    status: pending
---

# MCP Result Pattern Unification (Execution)

**Last Updated**: 2026-03-03
**Status**: 🟢 IN PROGRESS
**Scope**: Replace legacy MCP execution result handling with canonical `Result<T, E>` across the curriculum SDK and MCP consumers.

---

## Foundation Alignment

Before each workstream: re-read `rules.md`, `testing-strategy.md`, and `schema-first-execution.md`.

First question: **Could it be simpler without compromising quality?**

---

## Execution Summary (2026-03-03)

Completed in this session:

1. `executeToolCall` now returns `Result<ToolExecutionSuccess, McpToolError | McpParameterError>`.
2. Stub executor now returns `ok(...)` / `err(...)`.
3. Removed `extractExecutionData` from shared MCP helpers.
4. Updated aggregated fetch and universal tool executor to consume `Result` directly.
5. Updated stdio + streamable-http consumers/tests to the `result.ok` contract.

---

## WS5 Validation Snapshot

Completed gates:

- `pnpm --filter @oaknational/curriculum-sdk type-check` ✅
- `pnpm --filter @oaknational/curriculum-sdk test` ✅
- `pnpm --filter @oaknational/curriculum-sdk build` ✅
- `pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check` ✅
- `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test` ✅
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check` ✅
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run src/tool-handler-with-auth.integration.test.ts src/handlers-auth-errors.integration.test.ts` ✅

Environment-constrained gates:

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run --config vitest.e2e.config.ts e2e-tests/tool-call-success.e2e.test.ts e2e-tests/live-mode.e2e.test.ts e2e-tests/string-args-normalisation.e2e.test.ts` ❌ sandbox `listen EPERM 0.0.0.0`

---

## Remaining Work

1. Finish WS4 by removing any remaining legacy-shape assumptions outside the touched paths.
2. Run final workspace lint/test/type-check sweep after WS4 scope closure.
3. Update references and archive only when all WS acceptance criteria are complete.

---

## Related

- Strategic source: [future/06-mcp-consumer-integration/mcp-result-pattern-unification.md](../future/06-mcp-consumer-integration/mcp-result-pattern-unification.md)
- Milestone context: [roadmap.md](../roadmap.md)
