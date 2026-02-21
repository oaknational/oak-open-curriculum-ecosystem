# Cross-Agent Standardisation Alignment

## Status

Icebox — low priority. Act on triggers, not proactively.

## Research

[Cross-Agent Standardisation Landscape](../../research/agentic-engineering/2026-02-21-cross-agent-standardisation-landscape.md)

## Context

Two open standards are maturing for AI coding agent configuration:

1. **AGENTS.md** (Linux Foundation) — project-level instructions. Already adopted.
2. **Agent Skills** (`SKILL.md`, originated Anthropic) — portable capability packages. Already adopted.

The repository architecture (ADR-114: layered prompt composition with agent-agnostic cores and thin platform wrappers) is structurally ahead of both standards. Alignment opportunities exist but are low-urgency.

## Immediate Actions (trivial, do any time)

- [ ] Normalise skill frontmatter: move `version`/`date` into `metadata:` per Agent Skills spec in `napkin` and `distillation` SKILL.md files.
- [ ] Delete `.agent/skills/start-right/agents/openai.yaml` stub (YAGNI — Codex has no skill dispatch mechanism).

## Triggered Actions (act when the trigger fires)

| Action | Trigger |
|---|---|
| Consolidate skill directories (`.cursor/skills/`, `.agents/skills/`, `.agent/skills/`) | A second platform gains Cursor-equivalent skill discovery |
| Extract command cores into `.agent/commands/` with thin platform wrappers | A third command platform is added, or command count doubles |
| Add nested `AGENTS.md` per workspace | External contributors onboard, or per-workspace agent confusion recurs |

## Out of Scope

Sub-agent definitions, always-applied rules, and slash commands have no cross-agent standard. The current strategy (agnostic core + thin wrappers) is the correct hedge. No action needed.
