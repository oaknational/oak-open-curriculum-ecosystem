# .agent/ — The Practice Infrastructure

> **Human developers**: this directory is AI agent infrastructure, not
> intended for you. See [HUMANS.md](HUMANS.md) for where to go instead.

This directory contains the canonical infrastructure for the agentic
engineering practice that governs this repository. For the formal
definition, see
[ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md).

## Structural model

`.agent/` is the **canonical layer** in a three-layer architecture
([ADR-125](../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)):

```text
.agent/              ← canonical content (rules, skills, commands)
  ↓ referenced by
.claude/, .cursor/,  ← thin platform adapters (one-line pointers)
.gemini/, .codex/,
.agents/
  ↓ loaded by
CLAUDE.md, AGENTS.md,← entry points each platform reads automatically
GEMINI.md
```

When you see a rule in `.claude/rules/` or `.cursor/rules/`, it is a
one-line pointer back to the canonical version in `.agent/rules/`. Edit
the canonical version; adapters follow.

## How information flows

### Rules: directives → rules → platform adapters

`directives/` holds the authoritative source documents (principles,
testing strategy, schema-first execution). `rules/` atomises those
directives into individual canonical rules. Platform adapters in
`.claude/rules/` and `.cursor/rules/` point back to `rules/`.

### Plans: future → current → active → archive

Plans follow a lifecycle through `plans/` subdirectories:

- `future/` — deferred, not yet queued
- `current/` — queued, next to execute
- `active/` — in progress now
- `archive/completed/` — done, read-only evidence

Each plan collection (e.g. `semantic-search/`, `sdk-and-mcp-enhancements/`)
has its own lifecycle directories and a `roadmap.md` as its strategic entry
point. Not all collections use every stage — lifecycle directories are
created as needed.

### Knowledge: napkin → distilled → graduated

Session observations are captured in `memory/napkin.md`. Periodic
distillation extracts high-signal patterns into `memory/distilled.md`.
Settled patterns graduate into permanent documentation (ADRs, governance
docs, READMEs) via the consolidation workflow.

## Directory map

### Core

| Directory | Purpose |
| --- | --- |
| `directives/` | Authoritative rules, testing strategy, schema-first execution directive, and operational entry point ([AGENT.md](directives/AGENT.md)) |
| `rules/` | Individual canonical rules referenced by platform adapters (`.claude/rules/`, `.cursor/rules/`) |
| `practice-core/` | Foundational practice definitions (practice spec, lineage tracking, bootstrap sequence) for cross-repo exchange |
| `practice-context/` | Staging area for importing/exporting practice artefacts between repositories |
| [`practice-index.md`](practice-index.md) | Bridge file linking portable Practice Core to this repo's local artefacts |

### Planning and execution

| Directory | Purpose |
| --- | --- |
| `plans/` | Executable work plans with lifecycle management (`future/` → `current/` → `active/` → `archive/`) |
| `milestones/` | Per-milestone summaries: audience, value delivered, and progression gates |
| `prompts/` | Reusable prompt playbooks for common workflows |
| `commands/` | Slash-command definitions for agent workflows (`/jc-commit`, `/jc-gates`, etc.) |

### Knowledge and learning

| Directory | Purpose |
| --- | --- |
| `memory/` | Session learning: `napkin.md` (observations), `distilled.md` (extracted patterns), `code-patterns/` (reusable solutions) |
| `experience/` | Qualitative records of what work was like across sessions — see [experience/HUMAN.md](experience/HUMAN.md) |
| `research/` | Research proposals and analysis |
| `analysis/` | Technical analysis artefacts (API investigations, reranking assessments, etc.) |
| `evaluations/` | Experiment results and guidance |
| `proposals/` | Formal proposals for upstream API changes and architectural enhancements |
| `reports/` | Bug reports and investigation outputs |

### Agent infrastructure

| Directory | Purpose |
| --- | --- |
| `skills/` | Specialised capabilities that encode domain knowledge |
| `sub-agents/` | Sub-agent definitions, component templates, and standards |
| `roles/` | Named role definitions for agent personas |
| `tools/` | Agent-local tool scripts (e.g. `cursor-session-from-claude-session`) |

### Reference

| Directory | Purpose |
| --- | --- |
| `reference-docs/` | Supporting reference material (some internal-only) |
| `archive/` | Historical prompts and context snapshots |

Agent tooling CLIs also live at [`../agent-tools/`](../agent-tools/README.md)
at the repo root (`claude-agent-ops`, `cursor-session-from-claude-session`).
Ephemeral directories like `tmp/` are gitignored and not listed.

## Entry point and reading order

Start with [directives/AGENT.md](directives/AGENT.md). The canonical
grounding sequence is:

1. [AGENT.md](directives/AGENT.md) — operational entry point and
   documentation index
2. [principles.md](directives/principles.md) — authoritative rules
3. [testing-strategy.md](directives/testing-strategy.md) — TDD at all
   levels
4. [schema-first-execution.md](directives/schema-first-execution.md) —
   types flow from the OpenAPI schema

For the full artefact index (directives, ADRs, tools, workflows), see
[practice-index.md](practice-index.md).
