# .agent/ — The Practice Infrastructure

> **Human developers**: this directory is AI agent infrastructure, not
> intended for you. See [HUMANS.md](HUMANS.md) for where to go instead.

This directory contains the infrastructure that supports the agentic
engineering practice used to build and maintain this repository. For the
formal definition, see
[ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md).

## Why this directory exists

This repository was built through agentic engineering — human-AI
collaboration governed by explicit rules, quality gates, and specialist
reviewers. There is no large team with shared institutional memory;
instead, the practice captures that knowledge in structured form so
that each new session (human or AI) can pick up where the last one
left off.

## What's here

| Directory | Purpose |
| --- | --- |
| `directives/` | Core rules, testing strategy, schema-first execution directive, and operational entry point (AGENT.md) |
| `practice-core/` | Plasmid trinity (practice, lineage, bootstrap) and the Practice Box for cross-repo exchange |
| `plans/` | Executable work plans with status tracking and lifecycle management |
| `memory/` | Session-level learning: `napkin.md` captures observations, `distilled.md` extracts durable rules |
| `experience/` | Qualitative records of what work was like across sessions — see [experience/HUMAN.md](experience/HUMAN.md) |
| `milestones/` | Per-milestone summaries: audience, value delivered, and progression gates |
| `prompts/` | Reusable prompt playbooks for common workflows |
| `skills/` | Specialised capabilities that encode domain knowledge |
| `research/` | Research proposals and analysis |
| `evaluations/` | Experiment results and guidance |
| `tools/` | CLI tools for monitoring and managing agent workflows (`claude-agent-ops`) |
| `reference-docs/` | Supporting reference material (some internal-only) |

## Entry point

Start with [directives/AGENT.md](directives/AGENT.md) — follow the links
from there and the practice reveals itself.
