# Codex Platform Layer

This directory contains the Codex project-agent configuration for the Oak Open Curriculum Ecosystem.

## Model

Codex uses two directories:

- **`.agents/skills/`** — Codex skill and command adapters (thin wrappers referencing canonical content in `.agent/skills/` and `.agent/commands/`)
- **`.codex/`** — Codex project-agent configuration for reviewer sub-agents

Reviewer sub-agents are **not** skills. They require `sandbox_mode = "read-only"`, `approval_policy = "never"`, and `model_reasoning_effort = "high"` — settings only available to project agents.

## Structure

```text
.codex/
├── config.toml           # Agent roster and feature flags
├── README.md             # This file
└── agents/               # Thin per-reviewer adapter TOMLs
    ├── code-reviewer.toml
    ├── test-reviewer.toml
    ├── ...
    └── architecture-reviewer-wilma.toml
```

## Reviewer Roster

All 16 reviewers are registered in `config.toml`, alongside the non-reviewer helper agents `ground-truth-designer` and `subagent-architect`. Each `.toml` adapter in `agents/` is a self-describing project-scoped custom agent: it declares `name`, `description`, the required Codex execution settings, and `developer_instructions` that point to the canonical reviewer template in `.agent/sub-agents/templates/`. The architecture-reviewer variants additionally reference an individual persona component in `.agent/sub-agents/components/personas/`.

For the full reviewer invocation matrix and timing guidance, see `.agent/directives/invoke-code-reviewers.md`.

## Resolver Workflow

When reviewing from Codex, do not assume the runtime has automatically loaded the repo-local reviewer adapter. Resolve the reviewer first:

```bash
pnpm agent-tools:codex-reviewer-resolve code-reviewer
```

That command prints the exact `.codex/agents/*.toml` adapter and canonical `.agent` files that should ground the review, and `--json` is available for audit or automation.

## Entry Points

- [AGENTS.md](../AGENTS.md) — Codex entry point, links to AGENT.md
- [AGENT.md](../.agent/directives/AGENT.md) — Operational directives and rules
- [Practice Core](../.agent/practice-core/index.md) — The full Practice system
