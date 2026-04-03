# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings
in this repository. When the Practice Core or local docs reference
platform support, this file is the authoritative local source.

## Adapter Families

| Surface        | Cursor              | Claude Code                                                      | Gemini CLI          | GitHub Copilot    | Codex             | `.agents/`             |
| -------------- | ------------------- | ---------------------------------------------------------------- | ------------------- | ----------------- | ----------------- | ---------------------- |
| **Skills**     | `.cursor/skills/`   | `.claude/skills/`                                                | unsupported         | unsupported       | unsupported       | `.agents/skills/`      |
| **Commands**   | `.cursor/commands/` | `.claude/commands/`                                              | `.gemini/commands/` | unsupported       | unsupported       | `.agents/skills/jc-*/` |
| **Rules**      | `.cursor/rules/`    | `.claude/rules/`                                                 | entry-point chain   | entry-point chain | entry-point chain | entry-point chain      |
| **Sub-agents** | `.cursor/agents/`   | `.claude/agents/`                                                | unsupported         | unsupported       | `.codex/`         | unsupported            |
| **Hooks**      | unsupported         | `.claude/settings.json` (tracked project `PreToolUse`)           | unsupported         | unsupported       | unsupported       | unsupported            |

## Hook Support

Claude Code currently has native `PreToolUse` activation for Bash
commands via the tracked project `.claude/settings.json`, backed by the
canonical policy in `.agent/hooks/policy.json` and the repo-local
runtime script `scripts/check-blocked-patterns.mjs`. Local additive
overrides, when needed, live in `.claude/settings.local.json`.

Status by platform:

- **Claude Code**: supported for `PreToolUse` only (Bash blocked-pattern
  enforcement via tracked project `.claude/settings.json`)
- **Cursor**: no native agent hook surface at time of writing
- **Gemini CLI**: no native agent hook surface at time of writing
- **GitHub Copilot**: no native agent hook surface at time of writing
- **Codex**: no native agent hook surface at time of writing

## Policy Spine

This repo's hook and adapter surfaces follow a small Policy Spine:

| Layer | Role | Can It Override Higher Layers? |
| --- | --- | --- |
| Canonical policy (`.agent/`) | Declares intended behaviour and support | No |
| Native activation (tracked `.claude/settings.json`) | Activates supported policy in the repo baseline | No |
| Repo-local runtime (`scripts/check-blocked-patterns.mjs`) | Enforces the active native hook path | No |
| Explanatory mirrors (this matrix, hook README) | Describe the live state and support contract | No |

Failure semantics:

- `override` — a higher-authority canonical layer wins over a lower mirror or activation hint
- `prune` — a missing native surface removes a local activation path without changing canonical intent
- `block` — validators or runtime enforcement reject an unsafe or incoherent state

## Entry Points

| Platform           | Entry File                                     |
| ------------------ | ---------------------------------------------- |
| All platforms      | `.agent/directives/AGENT.md`                   |
| Claude Code        | `CLAUDE.md` → `AGENT.md`                       |
| GitHub Copilot     | `.github/copilot-instructions.md` → `AGENT.md` |
| Codex / `.agents/` | `AGENTS.md` → `AGENT.md`                       |
| Gemini CLI         | `GEMINI.md` → `AGENT.md`                       |

## Notes

- `.agents/skills/` is a narrow portable skill and command-workflow
  layer, not evidence for blanket `.agents/` parity with other platforms.
- Tracked project platform config is part of the agentic system contract;
  local overrides are additive where the platform supports them.
- Unsupported states are written down explicitly rather than inferred
  from missing files.
- Portable does not mean symmetrical: each platform has different native
  capabilities and the matrix records what is actually wired.
