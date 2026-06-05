# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings
in this repository. When the Practice Core or local docs reference
platform support, this file is the authoritative local source.

## Adapter Families

| Surface        | Cursor              | Claude Code                                            | Gemini / Antigravity CLI                          | GitHub Copilot    | Codex                                      | `.agents/`             |
| -------------- | ------------------- | ------------------------------------------------------ | ------------------------------------------------- | ----------------- | ------------------------------------------ | ---------------------- |
| **Skills**     | `.cursor/skills/`   | `.claude/skills/`                                      | `.agents/skills/`                                  | unsupported       | unsupported                                | `.agents/skills/`      |
| **Commands**   | `.cursor/commands/` | `.claude/commands/`                                    | `.gemini/commands/`                                | unsupported       | unsupported                                | `.agents/skills/jc-*/` |
| **Rules**      | `.cursor/rules/`    | `.claude/rules/`                                       | entry-point chain only                             | entry-point chain | entry-point chain                          | `.agents/rules/`       |
| **Sub-agents** | `.cursor/agents/`   | `.claude/agents/`                                      | native `/agents` upstream; no repo wrappers wired  | unsupported       | `.codex/`                                  | unsupported            |
| **Hooks**      | unsupported         | `.claude/settings.json` (tracked project `PreToolUse`) | supported upstream; no project-local hook wired    | unsupported       | supported upstream; no project-local hook wired | unsupported            |
| **MCP**        | user-local          | user-local / MCP config                                | supported upstream; no `.agents/mcp_config.json` wired | unsupported       | plugin/user-local                          | `.agents/mcp_config.json` target |

## Hook Support

Claude Code currently has native `PreToolUse` activation for Bash
commands via the tracked project `.claude/settings.json`, backed by the
canonical policy in `.agent/hooks/policy.json` and the prebuilt runtime
artefact `agent-tools/dist/src/hook-policy/check-blocked-patterns.js`, invoked
through the verdict shim `.claude/hooks/run-pretooluse-guard.mjs` so a
built-but-broken artefact blocks the tool call (exit 2), while a not-built
artefact fails open (exit 0) with a loud, logged warning so a fresh checkout is
not bricked — well within the per-tool-call hook timeout. Local additive
overrides, when needed, live in `.claude/settings.local.json`.

Status by platform:

- **Claude Code**: supported for `PreToolUse` only (Bash blocked-pattern
  enforcement via tracked project `.claude/settings.json`)
- **Cursor**: no native agent hook surface at time of writing
- **Gemini / Antigravity CLI**: native hooks are documented through
  `hooks.json` under the workspace `.agents/` directory or global config, with
  `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, and `Stop`
  events. This repository has no project-local `.agents/hooks.json` wired.
- **GitHub Copilot**: no native agent hook surface at time of writing
- **Codex**: upstream Codex hooks are available behind `codex_hooks`, and this
  local Codex install reports the feature enabled. This repository has no
  project-local `.codex/` hook configuration wired. Current Codex docs show
  `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`,
  `UserPromptSubmit`, and turn-scoped `Stop`; no `SessionEnd` equivalent is
  documented, so session-close cleanup must rely on explicit handoff and
  standard TTL/stale-archive cleanup until that surface exists.

## Policy Spine

This repo's hook and adapter surfaces follow a small Policy Spine:

| Layer | Role | Can It Override Higher Layers? |
| --- | --- | --- |
| Canonical policy (`.agent/`) | Declares intended behaviour and support | No |
| Native activation (tracked `.claude/settings.json`) | Activates supported policy in the repo baseline | No |
| Workspace runtime (`agent-tools/dist/src/hook-policy/check-blocked-patterns.js` via `.claude/hooks/run-pretooluse-guard.mjs`) | Enforces the active native hook path; fails closed if a built artefact is broken, fails open (loud, logged) if not yet built | No |
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
| Codex host         | `AGENTS.md` → `AGENT.md`                       |
| Gemini CLI         | `GEMINI.md` → `AGENT.md`                       |

## Notes

- `.agents/skills/` and `.agents/rules/` are portable skill/command and
  rule-adapter layers, not evidence for blanket `.agents/` parity with
  every platform-native surface.
- Gemini / Antigravity CLI loads the repo's 20 portable skills from
  `.agents/skills/`. The 86 files under `.agents/rules/` are rule wrappers,
  not skills, and are not treated as a native auto-scan surface here unless a
  future verification proves that behaviour.
- Antigravity plugins can bundle skills, agents, rules, MCP definitions, and
  hooks, but plugin bundle support is not the same as repo-local wiring.
- Tracked project platform config is part of the agentic system contract;
  local overrides are additive where the platform supports them.
- Unsupported states are written down explicitly rather than inferred
  from missing files.
- Portable does not mean symmetrical: each platform has different native
  capabilities and the matrix records what is actually wired.
