# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings
in this repository. When the Practice Core or local docs reference
platform support, this file is the authoritative local source.

For what each platform itself supports, the platform's **official
documentation is the only source of truth** — feature support varies by
platform and changes rapidly, and in-repo adapter shapes (including this
matrix's rows) reflect when they were written, not necessarily what the
platform currently supports or requires. Before asserting that a feature
exists or that an adapter shape is correct on platform X, check the
current official docs; never generalise across platforms or treat in-repo
precedent as a substitute.

## Copilot CLI: Target Versus Wired

The owner-ratified target is **GitHub Copilot CLI running locally** as an equal
first-class Practice citizen. A target row is not an implementation claim.
GitHub Copilot coding-agent/cloud execution is outside this matrix's Copilot
scope.

| Surface | Ratified local-CLI target | Wired and proven in this repository |
| --- | --- | --- |
| Identity | Native `sessionStart` adapter returns honest Copilot identity through `additionalContext` | **No** — canonical identity types and persistence do not yet admit Copilot |
| Deliberate team join | Native bootstrap is useful alone; `oak-start-right-team` explicitly opens claims, heartbeat, watcher, and lifecycle | **No** — no Copilot launcher or joined/non-joined proof |
| Repo instructions | Direct discovery of existing root `AGENTS.md`; do not change shared `.github/copilot-instructions.md` | **Partial** — `AGENTS.md` exists; clean local Copilot CLI discovery and canonical traversal are not yet acceptance-proven |
| Path-scoped instructions | Generated ignored files activated only through launcher `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | **No** |
| Skills | Use `.agents/skills/` under documented `.github/skills` → `.agents/skills` → `.claude/skills` first-found precedence | **Partial** — the portable wrappers exist; clean local Copilot CLI discovery/invocation is not yet an acceptance gate |
| Custom agents | Namespaced generated agents installed locally under resolved `COPILOT_HOME/agents`, with atomic owned-manifest cleanup | **No** |
| Policy hooks | CLI-only inline hooks in `.github/copilot/settings.json` over one canonical evaluator, with attested inherited-route neutralisation | **No** — inherited Claude activation currently receives an incompatible Copilot batch and blocks valid writes |
| Settings | `.github/copilot/settings.json` only for documented, tested CLI-only project settings | **No** |
| Session MCP | Establish a canonical secret-free server manifest, then pass an ignored file through `--additional-mcp-config` for one local session | **No** — no canonical manifest or session-scoped projection exists |
| Communications | Existing local comms substrate plus native wake, re-arm, drain recovery, handoff, and retirement | **No** — the substrate exists, but no Copilot notification/lifecycle projection is wired |
| End-to-end proof | Fresh-checkout validators plus a live local Copilot CLI acceptance run | **No** |

Delivery truth lives in MCP-150, MCP-154, MCP-155, and MCP-156 under the
[`first-class-copilot-cli-practice-citizenship`](../../plans/strategic/first-class-copilot-cli-practice-citizenship.plan.md)
node.

## Adapter Families

| Surface        | Cursor                | Claude Code                                            | Gemini / Antigravity CLI                          | GitHub Copilot CLI                                           | Codex                                            | `.agents/`                |
| -------------- | --------------------- | ------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ | ------------------------- |
| **Skills**     | `.agents/skills/`     | `.claude/skills/`                                      | `.agents/skills/`                                 | `.agents/skills/` exists; acceptance target above            | `.agents/skills/`                               | `.agents/skills/`         |
| **Commands**   | no separate surface   | no separate surface                                    | transitional `.gemini/commands/review-*.toml` only | no separate surface                                           | no separate surface                              | skills are invokable       |
| **Rules**      | `.cursor/rules/`      | `.claude/rules/`                                       | entry-point chain only                            | `AGENTS.md`; ignored launcher-scoped modular target           | `AGENTS.md` entry-point chain                    | `.agents/rules/`          |
| **Sub-agents** | `.cursor/agents/`     | `.claude/agents/`                                      | native `/agents` upstream; no repo wrappers wired | local `COPILOT_HOME/agents` generated-install target         | `.codex/agents/`                                | unsupported               |
| **Hooks**      | unsupported           | `.claude/settings.json` (tracked project `PreToolUse`) | supported upstream; no project-local hook wired   | inline `.github/copilot/settings.json` target; currently unwired | `.codex/hooks/` plus tracked project config      | unsupported               |
| **MCP**        | user/workspace config | user/workspace config                                  | supported upstream; no `.agents/mcp_config.json` wired | session-only `--additional-mcp-config` target                 | plugin/user-local                               | no wired MCP config       |

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
- **GitHub Copilot CLI**: native hooks are documented, including
  `sessionStart`, `preToolUse`, `notification`, `agentStop`, and `sessionEnd`.
  This repository has no inline `.github/copilot/settings.json` activation
  wired. `.github/hooks/*.json` is not eligible because cloud agent loads it.
  The inherited Claude hook currently receives an incompatible Copilot batch
  shape and is a reproduced blocking defect, not supported Copilot
  enforcement.
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

| Platform               | Entry File                                     |
| ---------------------- | ---------------------------------------------- |
| All platforms          | `.agent/directives/AGENT.md`                   |
| Claude Code            | `CLAUDE.md` → `AGENT.md`                       |
| GitHub Copilot CLI     | `AGENTS.md` direct discovery; validated canonical traversal is the target |
| Codex host             | `AGENTS.md` → `AGENT.md`                       |
| Gemini CLI             | `GEMINI.md` → `AGENT.md`                       |
| Linear coding sessions | `skills.md` → `AGENT.md`                       |

## Notes

- `.agents/skills/` and `.agents/rules/` are portable skill/command and
  rule-adapter layers, not evidence for blanket `.agents/` parity with
  every platform-native surface.
- Gemini / Antigravity CLI loads portable skills from `.agents/skills/`.
  Files under `.agents/rules/` are rule wrappers, not skills, and are not
  treated as a native auto-scan surface here unless a future verification
  proves that behaviour. Directory contents and repository validators are the
  authority; this matrix deliberately carries no hand-maintained counts.
- Antigravity plugins can bundle skills, agents, rules, MCP definitions, and
  hooks, but plugin bundle support is not the same as repo-local wiring.
- Tracked project platform config is part of the agentic system contract;
  local overrides are additive where the platform supports them.
- Unsupported states are written down explicitly rather than inferred
  from missing files.
- Linear coding sessions run through Claude Code or Codex and inherit
  those entry-point chains; the root `skills.md` is supplementary
  guidance Linear Agent can use during a delegated session (per
  [Linear's coding-sessions docs](https://linear.app/docs/coding-sessions),
  verified 2026-07-13). Linear has no adapter-family or hook surface
  in this repo.
- Portable does not mean symmetrical: each platform has different native
  capabilities and the matrix records what is actually wired.
- Copilot CLI target surfaces are governed by
  [ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  and the linked plan estate; the target table above must not be collapsed into
  an unsupported/supported binary before live acceptance.
