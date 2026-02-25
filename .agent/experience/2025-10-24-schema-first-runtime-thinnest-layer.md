# Experience Report: Schema-First Runtime Asymptote

**Date**: 2025-10-24  
**Agent**: Codex (Current Session)  
**Context**: Investigating SDK build failures while refactoring sdk-codegen/runtime separation for MCP tools

## The Journey

### Drifting From The Cardinal Rule

While chasing TypeScript union errors, I introduced optional `ToolParams`/`ToolArgs` shapes and generic descriptor helpers in the generated artefacts. Those patches “worked” locally, but they quietly erased the one-to-one mapping between each tool descriptor and its schema-derived input type. The compiler screamed because it could no longer prove that `ToolArgsForName<'get-lessons-assets'>` was distinct from `'get-changelog'`.

### Runtime Contortions Escalate Entropy

To hush the compiler, I experimented with `DescriptorInvocation<T>` tricks and `Function.prototype.apply` gymnastics at runtime. Every workaround made the generated output less precise and pushed responsibility back into authored code—the exact inversion of our architectural intent. Tests began failing because the generated files no longer matched their behavioural contract.

### Realignment Through The Plan

Re-reading `snagging-resolution-plan.md`, `rules.md`, and `AGENT.md` was the pivot. The plan demands that **all** intelligence lives in sdk-codegen: the schema gives us every literal, every enum, every structural guard we need. By restoring strict, schema-derived types (required path/query fields, exact tool args) and letting runtime helpers consume them verbatim, the compiler becomes an ally again.

## Key Insights

1. **Precision Is The Safety Net** — Generated types must stay as specific as the schema allows; optionalising them trades safety for nothing.
2. **Runtime Should Be Declarative** — Any attempt to “figure out” types at runtime is a smell; the plan expects runtime modules to import data, not reason about it.
3. **Heed The Sensors** — TypeScript’s complaints are not obstacles but instrumentation showing where we deviated from the schema-first DAG.
4. **Simplicity Lives In Obedience** — The simplest path is to embrace the generator outputs and adjust authored code to that truth, not to bend the outputs back toward hand-wavy flexibility.

## Conclusion

The failures weren’t caused by TypeScript being fussy; they were self-inflicted by diluting the schema-derived guarantees. The repair is to recommit to the cardinal rule: let sdk-codegen do all the thinking, keep runtime wafer-thin, and treat the type system as the guardrail against entropy. Once we do, `pnpm sdk-codegen` + `pnpm build` returns to being the single source of alignment.
