# Semantic Search SDK Recovery Plan

**Schema-First MCP Execution – Cardinal Rule Enforcement**

This plan replaces all previous recovery checklists. It establishes a single schema-driven DAG from the Open Curriculum OpenAPI specification to runtime execution. Every task, test, and runtime change must honour this flow and the directives listed below.

---

## Grounding (Read before every session)

1. `.agent/directives-and-memory/rules.md`
2. `.agent/directives-and-memory/AGENT.md`
3. `.agent/directives-and-memory/schema-first-execution.md`
4. `docs/agent-guidance/testing-strategy.md`

Always open with the question: **_Could it be simpler without compromising quality?_**

---

## Authoritative Flow (Strict DAG – No Cycles)

```text
OpenAPI schema
      ↓
Generator templates (type-gen/typegen/mcp-tools/**)
      ↓
Generated contract (ToolDescriptor<TName, TClient, TArgs, TResult>)
      ↓
Generated literal descriptors (MCP_TOOL_DESCRIPTORS, per-tool files)
      ↓
Generated aliases (ToolArgsForName, ToolResultForName, …)
      ↓
Generated runtime executor(s) (callTool, callToolWithValidation, …)
      ↓
Authored runtime façade (execute-tool-call.ts)
      ↓
Tests and consumers
```

Any shortcut, manual override, or re-validation outside this DAG is prohibited. Workstreams below enforce the flow.

---

## Operational Workflow & Loop Checks

Follow this workflow end-to-end; do not skip steps. Grounding checkpoints are **MANDATORY** and require a fresh reread of the directives each time. The content of the files is constant, but our understanding deepens as the repo evolves—always reassess in context and record reflections in `.agent/plans/semantic-search/context.md`.

### Stage 0 – Anchor

- Re-read `.agent/directives-and-memory/rules.md` and `.agent/directives-and-memory/schema-first-execution.md`.
- Capture a grounding note in the context log describing the current repo state and desired schema-first target.

**Loop Check A:** Are we beginning from a clear understanding of the cardinal rule and existing drift? If not, repeat the grounding read-through.

### Stage 1 – Diagnose Generator Drift

- Inspect `generate-types-file.ts`, `generate-definitions-file.ts`, and representative generated artefacts to locate type widening or helper remnants.
- Summarise findings and suspected root causes in the context log.

**Grounding Check 1 (MANDATORY):** Re-read the directives and reflect deeply on whether the diagnosis implies a generator-first remedy. Document the reflection; if runtime fixes seem tempting, stop and redesign.

### Stage 2 – Design Generator-Led Fix

- Sketch the generator changes needed (e.g. descriptor-specific arg helpers, refined aliases) ensuring the DAG flow remains intact.
- Validate the design against the schema-first directive before touching code.

**Loop Check B:** Does the proposed design keep all static data in generated artefacts with no runtime inference? If uncertain, revisit the design.

### Stage 3 – Implement Generator Changes

- Update generator templates (`generate-definitions-file.ts`, `generate-types-file.ts`, `generate-execute-file.ts`, etc.) to encode the design.
- Run `pnpm type-gen` and inspect regenerated artefacts for casts, widened unions, or helper leaks.

**Grounding Check 2 (MANDATORY):** Re-read the directives and log whether the regenerated files now satisfy the cardinal rule. If not, undo and correct at the generator.

### Stage 3.2 – Discriminated Generator Entries

- Re-ground with rules + schema-first directive; note in the context log that Stage 3.2 aims to remove remaining type widening.
- Update generator templates to emit discriminated tool entries (e.g. `MCP_TOOL_ENTRIES`) and derive `ToolDescriptorForName`, `ToolArgsForName`, etc., from those entries to keep name-to-descriptor associations literal.
- Regenerate via `pnpm type-gen` and verify that generated files (`definitions.ts`, `aliases/types.ts`, `runtime/execute.ts`) compile without casts or unions. Re-run `pnpm build --filter @oaknational/oak-curriculum-sdk` before moving on.
- **If TypeScript still widens after exhaustive generator refactors:** generate a switch-based dispatcher so each case operates on a single literal entry and inlines parse/invoke/validate logic. Remove any remaining assertions and document the rationale in the context log.

**Loop Check C:** Do generator outputs provide exact per-tool types with no runtime casts? If not, redesign within the generator before advancing.

### Stage 4 – Runtime Façade & Tests

- Simplify `src/mcp/execute-tool-call.ts` to rely solely on generated executors, mapping errors without additional validation.
- Update unit/integration tests to import generated descriptors/executors (cover zero-parameter tools, validation errors, and success paths).
- Run targeted commands: `pnpm build --filter @oaknational/oak-curriculum-sdk`, `pnpm type-check --filter @oaknational/oak-curriculum-sdk`, `pnpm lint --filter @oaknational/oak-curriculum-sdk`, `pnpm test --filter @oaknational/oak-curriculum-sdk`.

**Loop Check C:** Do runtime files or tests reintroduce manual parsing or casts? If yes, revert and fix the generator instead.

**Grounding Check 3 (MANDATORY):** Re-read the directives and document whether the façade and tests remain thin, generator-driven layers.

### Stage 5 – Repo-wide Quality Gates

- Execute the full suite: `pnpm clean`, `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, plus any additional required gates (`pnpm test:ui`, `pnpm test:e2e`, `pnpm dev:smoke`) in the prescribed order.
- Log each command result and associated loop check outcome in the context file.

**Loop Check D:** Did any gate force a runtime workaround or cast? If so, undo it and repair the generator.

**Grounding Check 4 (MANDATORY):** Re-read the directives, reflecting on overall system integrity before proceeding.

### Stage 6 – Documentation & Knowledge Capture

- Update `.agent/plans/semantic-search/context.md`, relevant architecture docs, and experience logs to describe the revised generator → runtime → façade flow.
- Ensure generator templates include TSDoc banners explaining their role in the DAG; reference these helpers in runtime files with `@see`.

**Loop Check E:** Does every layer (templates, generated artefacts, façade, docs) describe the schema-first DAG accurately? If anything is ambiguous, clarify it now.

### Stage 7 – Outstanding Follow-ups

- Resolve lingering lint issues across the repo.
- Update dependent tests such as `search-index-target.unit.test.ts` once the MCP tools stabilise.
- Continue recording decisions and reflections for future agents.

**Grounding Check 5 (MANDATORY):** Perform a final reread of the directives and record a closing reflection tying the finished work back to the cardinal rule.

---

## Loop Detection & Session Ritual

- **Start of session:** Read all directives, review this plan, and visualise the DAG. If a proposed change violates the flow, redesign it before touching code.
- **After every change:** Run `pnpm type-gen`, inspect a representative generated tool, the executor, and the runtime façade. Record findings in the context log.
- **If two consecutive loop checks fail:** halt work, schedule a focused review, and do not proceed until root cause is addressed.

---

## Definition of Done

- Generator emits contract, descriptors, aliases, and executors with exact schema-derived types.
- Runtime façade contains no custom helpers or casts—only thin delegation to generated executors with error mapping.
- Behavioural tests import generated artefacts exclusively.
- SDK and monorepo quality gates are green.
- Documentation, plan, and context reflect the schema-first directive.
- All loop checks are satisfied with evidence logged.
