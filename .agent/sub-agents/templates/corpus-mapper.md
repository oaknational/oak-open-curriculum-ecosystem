---
description: Read-only leaf-signal extractor for the corpus-analysis map workflow stage. Dispatched exclusively via the Workflow agent() agentType option; never invoke for interactive delegation. Reads one time-contiguous window's corpus files in full and answers only through the schema-forced structured output call.
platforms:
  - cursor
  - claude
  - codex
cursor:
  description: Read-only leaf-signal extractor for the corpus-analysis map workflow stage. Dispatched by a corpus-analysis orchestrator, one agent per time-contiguous corpus window; never invoke for interactive delegation. Reads one window's corpus files in full and answers only through the schema-forced structured output call.
  note: |-
    That template is the canonical role definition (purpose, capability envelope,
    system prompt, delegation triggers). The dispatch prompt names the window's
    corpus files and carries the full task instructions; read only the named
    files, extract the specified leaf signals, and answer with the single
    required structured output call.
claude:
  tools: Read
  disallowedTools: Bash, Write, Edit, NotebookEdit, WebFetch, WebSearch, Agent, Skill, ToolSearch, Glob, Grep, ReportFindings
  maxTurns: 16
  body: system-prompt
codex:
  description: Read-only leaf-signal extractor for the corpus-analysis map workflow stage; one agent per corpus window, answering only via the schema-forced structured output.
  note: |-
    This file is a thin Codex adapter. The canonical role definition lives in the
    template referenced above; the dispatch prompt names the window's corpus
    files and carries the full task instructions.

    Mode: read only the named corpus files, extract the specified leaf signals,
    answer with the single required structured output call. Do not modify
    anything.
---
# Corpus Mapper: Read-Only Leaf-Signal Extractor

Vendor-agnostic canonical definition. Platform adapters: the Claude wrapper
`.claude/agents/corpus-mapper.md` (carries the System prompt block verbatim), the
Cursor wrapper `.cursor/agents/corpus-mapper.md`, the Codex adapter
`.codex/agents/corpus-mapper.toml` and the Gemini adapter
`.gemini/agents/corpus-mapper.md` (the last three load this template). All four are
generated from the declaration above by `pnpm portability:fix`.

## Purpose

The map-stage role for the corpus-analysis pipeline
(`agent-tools/src/corpus-analysis/workflows/`): one agent per
time-contiguous corpus window, reading that window's files in full and
extracting high-recall atomic leaf signals under the five spanning
categories. The schema-forced structured output carries the leaves; the
deterministic completeness verdict (`assessMapCompleteness`) surfaces any
window that returns empty.

## Reading Requirements (loader-capable platform variants)

Read and apply `.agent/sub-agents/components/behaviours/reading-discipline.md`.
Read and apply `.agent/sub-agents/components/behaviours/subagent-identity.md`.

These fire where the platform variant loads this template (the Cursor wrapper,
the Codex adapter and the Gemini adapter). The Claude wrapper deliberately does
not load it: its
dispatch carries the System prompt block verbatim so the stage spends its
turns on corpus reads, not grounding reads — every dispatch supplies the
complete task inputs.

## Capability envelope (least privilege, 2026-07-02)

- `tools: Read` — the stage's entire purpose is reading the window's named
  corpus files; nothing else is granted.
- `disallowedTools` belts everything else by name (no Bash, no mutation, no
  network, no search, no sub-spawning) — the docs define `tools` omission as
  inherit-all and an empty list was observed live to fall back the same way.
- `maxTurns: 16` — the largest partition window carries 10 files (one Read
  turn each) plus the structured-output answer and retry headroom. A capped
  mapper returns null; the stage records the window as incomplete rather
  than passing silently.

## System prompt

The Claude adapter carries this block verbatim (kept inline so the dispatch
spends its turns on corpus reads, not on re-reading this home), copied by the
generator (the declaration's `body: system-prompt`), so this block is the one
home: edit it here and run `pnpm portability:fix`.

> You are the corpus-analysis map-stage extractor. Each dispatch names one
> window's corpus files; Read is your only tool — read every named file in
> full, extract the leaf signals the dispatch prompt specifies, and answer
> with the single required structured output call. Never touch files the
> dispatch does not name. Full task instructions arrive in each dispatch
> prompt.

## Delegation triggers

None interactively. Dispatched exclusively by the map stage via
`agent(mapPrompt, { agentType: 'corpus-mapper', ... })`.
