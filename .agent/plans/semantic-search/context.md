# Semantic Search Recovery – Context Log

This log complements `snagging-resolution-plan.md`. Use it to capture command outcomes, decisions, and loop-check reflections. Keep entries concise and dated.

---

## Grounding Cadence

- Every session begins by reading:
  - `.agent/directives-and-memory/rules.md`
  - `.agent/directives-and-memory/AGENT.md`
  - `.agent/directives-and-memory/schema-first-execution.md`
  - The recovery plan (latest revision)
  - This context log
- Redraw the schema-first DAG before touching code.

---

## Current Status (2025-10-24)

- **Generator:** `generate-definitions-file.ts` now emits `MCP_TOOL_DESCRIPTORS` with explicit `ToolDescriptor` typing. Executor template and alias generation still widen `ToolArgsForName`, leading to intersection errors during `pnpm build`. No casts are checked in yet, but the generator needs another pass.
- **Runtime:** `src/mcp/execute-tool-call.ts` delegates to the generated `callTool` while mapping errors. Zero-parameter coercion currently relies on generator narrowing that is missing, so runtime code cannot yet compile without the generator fix.
- **Tests:** `execute-tool-call.unit.test.ts` exercises the generated descriptors (rate-limit tool) but will only pass once the executor arguments are typed correctly. Wider behavioural suite still pending.
- **Quality gates:** `pnpm build --filter @oaknational/oak-curriculum-sdk` fails with TS2345 (`ToolArgs` intersection). Repo-wide commands are blocked until generator alignment is restored.
- **Documentation:** The recovery plan is updated with the staged workflow and mandatory grounding checks. Architecture docs still need to capture the refined generator/executor flow once complete.

---

## Immediate Priorities

1. **Stage 0 / Loop Check A:** Re-ground with rules + schema-first directive; capture the current failing state and intended generator fix.
2. **Stage 1 Diagnostics:** Pinpoint exactly where `ToolArgsForName` widens (aliases vs. executor template) and record findings.
3. **Stage 2 Design:** Draft a generator-first approach for descriptor-specific argument helpers that eliminates the union → intersection issue.
4. **Stage 3 Implementation:** Update templates, regenerate (`pnpm type-gen`), and verify executor outputs are cast-free.
5. **Stage 4 Runtime & Tests:** Once generator output is correct, keep `execute-tool-call.ts` thin and expand tests to cover zero-parameter validation plus error mapping.
6. **Stage 5 Gates & Stage 6 Docs:** Run filtered/unfiltered quality commands, then refresh documentation and experience logs to describe the new flow.

---

## Command Log Template

Append entries in chronological order. Example format:

```text
2025-10-24 10:15 UTC
- pnpm type-gen → ✅
  Notes: Generated executor now exports callTool with literal result types.
- Loop Check C → pass (no optional fallbacks detected).
```

If a command fails, capture diagnostics and the corrective action.

---

2025-10-24 14:05 UTC
- Grounding Check (Stage 0) → ✅  
  Notes: Re-read `.agent/directives-and-memory/rules.md` and `schema-first-execution.md`; reaffirmed the goal of removing all runtime widening and keeping fixes generator-first. Logged the target state for the MCP executor pipeline (no casts, no helper overrides).
- Stage 1 Diagnostics → ✅  
  Notes: `generate-types-file.ts` defines `ToolArgsForName` via `Parameters<ToolInvoke<TName>>[1]`, and because `ToolDescriptorForName<TName>` is indexed over the descriptor map, TypeScript widens to a union across all tools. `generate-execute-file.ts` therefore had to introduce a cast to satisfy `descriptor.invoke`, causing the TS2345 build error. `generate-definitions-file.ts` correctly types the literal map, so the fix must introduce per-tool arg aliases or helper types emitted by the generator to preserve specificity.

---

## Loop Check Ledger

| Check | Purpose                                             | Last Status | Notes                                                                 |
| ----- | --------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| A     | Grounding anchor complete                           | ✅ 2025-10-24 | Grounding note captured; ready to proceed with design work.            |
| B     | Generator design keeps all typing in templates      | _pending_   | Current alias approach still widens; design work not yet recorded.    |
| C     | Runtime/tests remain generator-driven and cast-free | _pending_   | Façade thinness depends on Stage 3 fixes; tests incomplete.           |
| D     | Quality gates green without runtime patches         | _pending_   | `pnpm build --filter …` fails with TS2345 union/intersection error.   |
| E     | Documentation and knowledge capture complete        | _pending_   | Plan updated; architecture docs/experience notes still outstanding.   |

Update rows as loop checks pass/fail; tie each update to a logged reflection.

---

## Notes & Decisions

- Record architectural decisions, schema insights, grounding reflections, and deviations here.
- Example entry:
  - _2025-10-24:_ Decided to emit `callTool` from generator; runtime façade will become ~30 lines, only mapping errors.
- _2025-10-24:_ Identified `ToolArgsForName` widening as the root cause of TS2345; solution must come from generator alias emission, not runtime casts.
- _2025-10-24:_ Stage 1 diagnostics confirm that alias generation needs per-tool helper emission so `descriptor.invoke` receives fully narrowed argument types without casts.

---

## Backlog / Follow-ups

- Update `docs/architecture/*` with schema-first execution diagram once generator fixes land.
- Fix lint issues outside the SDK after MCP schema-first alignment.
- Adjust semantic-search `search-index-target.unit.test.ts` once API expectation stabilises.
- Ensure experience logs capture lessons learned from eliminating helper loops and enforcing the new workflow.
