# Codex Platform Layer

This directory contains the Codex project-agent configuration for the Oak Open Curriculum Ecosystem.

## Model

Codex uses two directories:

- **`.agents/skills/`** — Codex skill and command adapters (thin wrappers referencing canonical content in `.agent/skills/` and `.agent/commands/`)
- **`.codex/`** — Codex project-agent configuration for reviewer sub-agents

Reviewer sub-agents are **not** skills. They require `sandbox_mode = "read-only"`, `approval_policy = "never"`, and `model_reasoning_effort = "high"` — settings only available to project agents.

Codex custom workflows do not appear as project-defined slash commands.
Codex's `/` popup is the built-in command surface; repo workflows in
`.agents/skills/` are invoked through the `/skills` selector or by typing a
`$skill-name` mention such as `$jc-review`. See the official
[Codex skills](https://developers.openai.com/codex/skills) and
[Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands)
documentation.

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

All reviewer adapters are registered in `config.toml`, alongside the
non-reviewer helper agents `ground-truth-designer` and `subagent-architect`.
Each `.toml` adapter in `agents/` is a self-describing project-scoped custom
agent: it declares `name`, `description`, the required Codex execution
settings, and `developer_instructions` that point to the canonical reviewer
template in `.agent/sub-agents/templates/`. The architecture-reviewer variants
additionally reference an individual persona component in
`.agent/sub-agents/components/personas/`.

In `.codex/config.toml`, each `agents.<name>.config_file` value is relative to
`.codex/config.toml` itself, so entries point to `agents/<name>.toml`, not
`.codex/agents/<name>.toml`.

For the full reviewer invocation matrix and timing guidance, see `.agent/memory/executive/invoke-code-reviewers.md`.

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
