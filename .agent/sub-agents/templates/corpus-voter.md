# Corpus Voter: Single-Turn No-Tools Adversary

Vendor-agnostic canonical definition. Platform adapters: the Claude wrapper
`.claude/agents/corpus-voter.md` (carries the System prompt block verbatim), the
Cursor wrapper `.cursor/agents/corpus-voter.md`, and the Codex adapter
`.codex/agents/corpus-voter.toml` (both load this template).

## Purpose

The adversary voter role for the corpus-analysis validate workflow
(`agent-tools/src/corpus-analysis/workflows/`). Each dispatch supplies one
candidate pattern plus its verbatim grounding excerpts and requests four
conjunctive apophenia-test judgments via a schema-forced structured output
call. The deterministic adjudication state machine makes every routing
decision; the voter judges exactly one candidate and emits nothing else.

## Reading Requirements (loader-capable platform variants)

Read and apply `.agent/sub-agents/components/behaviours/reading-discipline.md`.
Read and apply `.agent/sub-agents/components/behaviours/subagent-identity.md`.

These fire where the platform variant loads this template (the Cursor wrapper
and the Codex adapter). The Claude wrapper deliberately cannot load it: a
zero-tools role cannot `Read`, and every dispatch supplies the complete
candidate + grounding evidence — the role's economics forbid extra turns.

## Why no tools (measured, 2026-07-02)

Free-tool voters spent ~7 tool calls each re-verifying their supplied
grounding against the corpus; every call re-read ~50k of cached context,
putting a voter at 350–800k input tokens for ~3–4k of judgment output. The
verification the voters were re-doing belongs in deterministic code
(PDR-122: code verifies mechanics, agents judge semantics): survivors'
grounding quotes are machine-verified against the pinned corpus by the
post-run driver. Removing the tool surface is harness-enforced (the wrapper's
`tools` frontmatter is a deterministic allow-list, not prompt compliance) and
also shrinks the per-turn context the tool definitions would occupy.

## Capability envelope (least privilege, probe-verified 2026-07-02)

- `tools:` with a NULL value (the field present, the value empty) is the
  zero-tools shape: probed live through the real Workflow path, the agent
  reports NO visible tools and the schema-forced structured output still
  arrives (`{"visibleTools":[],"structuredOutputWorks":true}`, ~14.9k probe
  tokens vs ~29k unrestricted). Do not "tidy" the field: `tools: []` and
  omitting the field both fall back to inherit-all (probed), and
  `disallowedTools: *` is not honoured in frontmatter in either bare or
  quoted form (probed; the `["*"]` deny-glob lives in the SDK options
  layer, not frontmatter). No deny list is needed — zero granted leaves
  nothing to subtract, and the shipped shape is exactly the probed shape.
- `maxTurns: 4` — the deterministic cap on the measured cost driver (turn
  count). The ideal voter answers in one turn; four allows a structured-output
  retry. A voter that hits the cap returns null, which the adjudication state
  machine already handles as a first-class `unadjudicated` outcome — never a
  silent drop, never a stranded candidate.

## System prompt

The wrapper carries this block verbatim — it cannot point here because a
no-tools agent cannot `Read`, and the role's economics forbid extra turns.
Keep the two in sync when editing (pairing note in both files).

> You are a corpus-analysis adversary voter. Each dispatch supplies the
> complete evidence you need: one candidate pattern and its grounding
> excerpts, extracted mechanically from a pinned corpus. You have no tools —
> judge only from the supplied evidence and respond with the single required
> structured output call. Full task instructions arrive in each dispatch
> prompt.

## Delegation triggers

None interactively. This agent type is dispatched exclusively by the validate
workflow via `agent(votePrompt, { agentType: 'corpus-voter', ... })`; it is
not for main-loop delegation.
