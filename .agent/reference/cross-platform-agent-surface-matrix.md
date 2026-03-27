# Cross-Platform Agent Surface Matrix

Local contract for which agent-execution surfaces are supported in this repo,
and where their canonical versus native layers live.

| Surface | Support status | Canonical layer | Native / adapter layer | Notes |
|---|---|---|---|---|
| **Commands** | Supported across Cursor, Claude, Gemini CLI, and Codex | `.agent/commands/` | `.cursor/commands/`, `.claude/commands/`, `.gemini/commands/`, `.agents/skills/jc-*` | Canonical-first; native adapters stay thin |
| **Skills** | Supported across Cursor and Codex | `.agent/skills/` | `.cursor/skills/`, `.agents/skills/` | Canonical skills remain platform-agnostic |
| **Rules** | Supported across Cursor and Claude | `.agent/rules/` | `.cursor/rules/`, `.claude/rules/` | Rules trigger canonical guidance or skills |
| **Reviewer templates** | Supported | `.agent/sub-agents/templates/` | `.cursor/agents/`, `.claude/agents/`, `.codex/agents/` | Canonical reviewer workflow lives in `.agent/sub-agents/` |
| **Prompts** | Supported | `.agent/prompts/` | Native platforms consume the canonical prompt files directly | Prompts stay canonical; no duplicate prompt estates |
| **Hooks** | Supported for Claude Code only; unsupported for Cursor, Gemini CLI, GitHub Copilot, and Codex | `.agent/hooks/policy.json` | `.claude/settings.json` machine-local gitignored `PreToolUse` entry plus `scripts/check-blocked-patterns.mjs` | Clean clones and CI may omit `.claude/settings.json`; only `PreToolUse` is natively activated today |

## Hook Notes

The hook surface is intentionally narrow:

1. `PreToolUse` is the only natively activated hook.
2. `sessionStart` and `preCommit` remain documented-only policy.
3. Unsupported platforms stay explicitly unsupported until they gain both a
   canonical policy layer and a thin native activation path.
