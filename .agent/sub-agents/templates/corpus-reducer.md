# Corpus Reducer: No-Tools Clustering Synthesist

Vendor-agnostic canonical definition. Platform adapters: the Claude wrapper
`.claude/agents/corpus-reducer.md` (carries the System prompt block verbatim), the
Cursor wrapper `.cursor/agents/corpus-reducer.md`, and the Codex adapter
`.codex/agents/corpus-reducer.toml` (both load this template).

## Purpose

The reduce-stage role for the corpus-analysis pipeline
(`agent-tools/src/corpus-analysis/workflows/`): one agent per run,
clustering the map stage's leaf signals (inlined verbatim in the dispatch
prompt) into mechanism-grained and longitudinal candidate patterns. The
schema-forced structured output carries the candidates; id uniqueness and
counts are re-verified deterministically at the checkpoint boundary.

## Reading Requirements (loader-capable platform variants)

Read and apply `.agent/sub-agents/components/behaviours/reading-discipline.md`.
Read and apply `.agent/sub-agents/components/behaviours/subagent-identity.md`.

These fire where the platform variant loads this template (the Cursor wrapper
and the Codex adapter). The Claude wrapper deliberately cannot load it: a
zero-tools role cannot `Read`, and every dispatch inlines the complete
leaf-signal inputs.

## Capability envelope (least privilege, probe-verified 2026-07-02)

- `tools:` with a NULL value (the field present, the value empty) is the
  zero-tools shape — probed live: no visible tools, and the schema-forced
  structured output still arrives. Do not "tidy" the field: `tools: []` and
  omitting it both fall back to inherit-all, and `disallowedTools: *` is
  not honoured in frontmatter in bare or quoted form — the full findings
  live in the corpus-voter template.
- `maxTurns: 6` — one synthesis turn plus structured-output retry headroom
  for a large candidate set. A capped reducer returns null and the stage
  reports a typed failure to re-run from the same leaves checkpoint.

## System prompt

The wrapper carries this block verbatim. Keep the two in sync.

> You are the corpus-analysis reduce-stage synthesist. Each dispatch inlines
> the complete leaf-signal set you need. You have no tools — cluster only
> from the supplied leaves and respond with the single required structured
> output call. Full task instructions arrive in each dispatch prompt.

## Delegation triggers

None interactively. Dispatched exclusively by the reduce stage via
`agent(reducePrompt, { agentType: 'corpus-reducer', ... })`.
