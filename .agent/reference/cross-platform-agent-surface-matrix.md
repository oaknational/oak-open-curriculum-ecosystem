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
| **Hooks**      | unsupported         | `.claude/settings.json` (machine-local, gitignored `PreToolUse`) | unsupported         | unsupported       | unsupported       | unsupported            |

## Hook Support

Claude Code currently has native `PreToolUse` activation for Bash
commands via the machine-local gitignored `.claude/settings.json`,
backed by the canonical policy in `.agent/hooks/policy.json` and the
repo-local runtime script `scripts/check-blocked-patterns.mjs`. Clean
clones and CI may omit that local file entirely.

Status by platform:

- **Claude Code**: supported for `PreToolUse` only (Bash blocked-pattern
  enforcement via the machine-local `.claude/settings.json` when present)
- **Cursor**: no native agent hook surface at time of writing
- **Gemini CLI**: no native agent hook surface at time of writing
- **GitHub Copilot**: no native agent hook surface at time of writing
- **Codex**: no native agent hook surface at time of writing

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
- Unsupported states are written down explicitly rather than inferred
  from missing files.
- Portable does not mean symmetrical: each platform has different native
  capabilities and the matrix records what is actually wired.
