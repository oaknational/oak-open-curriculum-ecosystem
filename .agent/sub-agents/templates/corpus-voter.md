---
description: Single-turn no-tools adversary voter for the corpus-analysis validate workflow. Dispatched exclusively via the Workflow agent() agentType option; never invoke for interactive delegation. Judges one candidate against the four conjunctive apophenia tests from supplied grounding and answers only through the schema-forced structured output call.
# No Gemini adapter: the Gemini adapter's body is the pointer to this template, which a
# no-tools agent cannot read; the System prompt body is the Claude adapter's alone.
platforms:
  - cursor
  - claude
  - codex
claude:
  tools: none
  maxTurns: 4
  body: system-prompt
cursor:
  description: Single-turn adversary voter for the corpus-analysis validate workflow. Dispatched by a corpus-analysis orchestrator, one call per candidate-lens vote; never invoke for interactive delegation. Judges one candidate against the four conjunctive apophenia tests from supplied grounding and answers only through the schema-forced structured output call.
  note: |-
    That template is the canonical role definition (purpose, capability envelope,
    system prompt, delegation triggers). The dispatch supplies the complete
    evidence — one candidate pattern plus its verbatim grounding excerpts,
    extracted mechanically from a pinned corpus: judge only from the supplied
    evidence — no other reads are part of the task — and answer with the single
    required structured output call. (On Claude this role runs zero-tools by
    frontmatter; Cursor cannot enforce that envelope, so honour it
    behaviourally.)
codex:
  description: Single-turn adversary voter for the corpus-analysis validate workflow; judges one candidate against the four conjunctive apophenia tests from supplied grounding only.
  note: |-
    This file is a thin Codex adapter. The canonical role definition lives in the
    template referenced above; each dispatch supplies the complete evidence — one
    candidate pattern plus its verbatim grounding excerpts from a pinned corpus.

    Mode: judge only from the supplied evidence — no other reads are part of the
    task (on Claude this role runs zero-tools by frontmatter; honour that
    envelope behaviourally here) — and answer with the single required
    structured output call. Do not modify anything.
---
# Corpus Voter: Single-Turn No-Tools Adversary

Vendor-agnostic canonical definition. Platform adapters: the Claude wrapper
`.claude/agents/corpus-voter.md` (carries the System prompt block verbatim), the
Cursor wrapper `.cursor/agents/corpus-voter.md`, and the Codex adapter
`.codex/agents/corpus-voter.toml` (both load this template). All three are generated
from the declaration above by `pnpm portability:fix`.

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
  The declaration spells it `tools: none`, which the generator renders as
  the null-value field and the declaration schema refuses beside a deny
  list or a pointer body.
- `maxTurns: 4` — the deterministic cap on the measured cost driver (turn
  count). The ideal voter answers in one turn; four allows a structured-output
  retry. A voter that hits the cap returns null, which the adjudication state
  machine already handles as a first-class `unadjudicated` outcome — never a
  silent drop, never a stranded candidate.

## System prompt

The Claude adapter carries this block verbatim — it cannot point here because
a no-tools agent cannot `Read`, and the role's economics forbid extra turns. The
declaration's `body: system-prompt` makes the generator copy it, so this block
is the one home: edit it here and run `pnpm portability:fix`.

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
