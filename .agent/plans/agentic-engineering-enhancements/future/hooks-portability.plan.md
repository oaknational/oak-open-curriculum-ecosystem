# Hooks Portability Plan

**Status**: Future (not started)
**Parent**: [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
**Related**: [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)

## Context

ADR-125 established the three-layer model for agent artefacts: canonical content in `.agent/`, thin platform adapters, and entry points. This covers skills, commands, rules, and sub-agents. Hooks — deterministic shell commands or LLM prompts that fire at lifecycle points — are a fifth artefact type not yet brought into the system.

This plan describes a **target portability architecture**, not the current
repo-local hook baseline. The authoritative local contract remains
[`cross-platform-agent-surface-matrix.md`](../../../memory/executive/cross-platform-agent-surface-matrix.md),
which currently records only Claude Code `PreToolUse` as wired in this repo.

Target-state platform posture:

| Platform | Repo-local status today | Target activation path if promoted |
|---|---|---|
| Claude Code | Supported for tracked `PreToolUse` only | `.claude/settings.json` `hooks` key |
| Cursor | Unsupported in the local support matrix | `.cursor/hooks.json` after fresh verification and wiring |
| Gemini CLI | Unsupported in the local support matrix | `.gemini/settings.json` `hooks` key after fresh verification and wiring |
| Codex | Unsupported | Blocked on upstream support |

## Problem Statement

Without a canonical hooks layer:

1. Hook scripts would be duplicated across `.cursor/hooks/`, `.claude/hooks/`, and `.gemini/hooks/`.
2. The same validation logic (e.g., "block destructive commands", "auto-format after edit", "inject context at session start") would drift between platforms.
3. Adding a new hook behaviour requires editing three configuration files with three different schemas.

## Related Strategic Work

Hook portability covers native lifecycle integration only. Durable
session-associated metadata is broader than that: wrapper-only and importer-only
vendors need the same canonical storage and query contract even when no native
hook surface exists.

See [Cross-Vendor Session Sidecars — Strategic Plan](./cross-vendor-session-sidecars.plan.md)
for the local-first sidecar model and
[Manifest-Driven Adapter Generation — Strategic Plan](./adapter-generation.plan.md)
for adjacent wrapper automation. Sidecars are complementary infrastructure, not
a prerequisite for basic hook adoption.

## Proposed Architecture

Extend the three-layer model to hooks:

```text
.agent/hooks/                           # Layer 1: Canonical hook scripts
  scripts/
    block-destructive-commands.sh        # Shared validation logic
    auto-format-after-edit.sh            # Post-edit formatting
    inject-session-context.sh            # Session start context injection
    lint-after-edit.sh                   # Post-edit lint check
  README.md                              # Hook inventory and design rationale

.cursor/hooks.json                       # Layer 2a: Cursor hook config
.claude/settings.json (hooks key)        # Layer 2b: Claude Code hook config
.gemini/settings.json (hooks key)        # Layer 2c: Gemini CLI hook config
```

### Layer 1: Canonical Hook Scripts

All hook logic lives in `.agent/hooks/scripts/`. Scripts are platform-agnostic shell scripts (or Node.js scripts) that:

- Read JSON from stdin (the event payload)
- Perform the hook logic (validation, formatting, logging)
- Write JSON to stdout (the decision/result)
- Use exit codes for control (0 = allow, 2 = block)

Scripts must not assume platform-specific stdin schemas. Each script should extract only the fields it needs and ignore the rest. A shared utility (`parse-hook-input.sh` or similar) could normalise the minor schema differences between platforms.

### Layer 2: Platform Hook Configuration

Each platform's configuration file points at the canonical scripts. The configuration is platform-specific (JSON schema differs), but the scripts they invoke are shared.

The Cursor and Gemini examples below are **target-state sketches** for a future
promotion. They are not evidence that those hook surfaces are currently wired in
this repository.

**Cursor** (`.cursor/hooks.json`):

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      { "command": ".agent/hooks/scripts/auto-format-after-edit.sh" }
    ],
    "beforeShellExecution": [
      { "command": ".agent/hooks/scripts/block-destructive-commands.sh" }
    ]
  }
}
```

**Claude Code** (`.claude/settings.json` `hooks` key):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": ".agent/hooks/scripts/auto-format-after-edit.sh" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".agent/hooks/scripts/block-destructive-commands.sh" }
        ]
      }
    ]
  }
}
```

**Gemini CLI** (`.gemini/settings.json` `hooks` key):

```json
{
  "hooks": {
    "AfterTool": [
      {
        "matcher": "edit_file|write_file",
        "hooks": [
          { "type": "command", "command": ".agent/hooks/scripts/auto-format-after-edit.sh" }
        ]
      }
    ],
    "BeforeTool": [
      {
        "matcher": "shell",
        "hooks": [
          { "type": "command", "command": ".agent/hooks/scripts/block-destructive-commands.sh" }
        ]
      }
    ]
  }
}
```

### Platform-Specific Hook Types

Claude Code supports prompt hooks (`type: "prompt"`) and agent hooks (`type: "agent"`) that have no equivalent on other platforms. These are inherently platform-specific and should remain in `.claude/settings.json` only. They can still reference canonical content (e.g., a prompt hook that references `.agent/directives/` for its evaluation criteria).

## Candidate Hooks

Based on existing rules and directives, these are the highest-value hooks to implement:

| Hook | Event | What it does | Source directive |
|---|---|---|---|
| Auto-format after edit | PostToolUse (Edit/Write) | Run `pnpm prettier --write` on changed file | Development practice |
| Lint after edit | PostToolUse (Edit/Write) | Run `pnpm lint:fix` on changed file | `.agent/rules/lint-after-edit.md` |
| Block destructive commands | PreToolUse (Bash/Shell) | Reject `rm -rf /`, `git push --force main`, `--no-verify` | `.agent/directives/principles.md` (never disable checks) |
| Session context injection | SessionStart | Inject git status, branch, recent changes | Start-right workflow |
| Secrets scan | PreToolUse (Write/Edit) | Scan written content for API keys, tokens | Safety and security policy |

## Open Questions

1. **Stdin schema normalisation**: Claude Code, Cursor, and Gemini all send JSON on stdin but with slightly different schemas. Should scripts handle all three, or should a thin adapter normalise the input before calling the script?
2. **Node.js vs shell**: Shell scripts are universally available but limited. Node.js scripts can use `jq`-like JSON parsing natively. Which should be the default?
3. **Codex**: When Codex adds hook support, will it follow the same stdin/stdout/exit-code pattern? The plan should be revisited when Codex hooks ship.
4. **Hook testing**: How do we test hooks? Unit tests for the scripts with mock stdin? Integration tests that verify the hook fires correctly in each platform?
5. **Claude Code prompt/agent hooks**: These are uniquely powerful (LLM-evaluated gates, multi-turn verification). Should we create canonical prompt templates in `.agent/hooks/prompts/` that Claude Code's prompt hooks reference?

## Phases

### Phase 0: Research and Design

- Verify exact stdin/stdout schemas for all candidate platforms with real hook
  invocations
- Reconcile any promotion proposal against the local support matrix before
  wiring new activation surfaces
- Determine whether stdin normalisation is needed or if scripts can be schema-tolerant
- Decide on shell vs Node.js for hook scripts
- Define the `.agent/hooks/` directory structure and README
- Update ADR-125 to include hooks as a sixth artefact type

### Phase 1: Core Hook Scripts

- Implement the 3 highest-value hooks: auto-format, lint-after-edit, block-destructive-commands
- Write tests for each script (mock stdin, verify stdout/exit-code)
- Create `.agent/hooks/README.md` with inventory and design rationale

### Phase 2: Platform Configuration

- Add hook configuration to `.cursor/hooks.json`
- Add hook configuration to `.claude/settings.json`
- Add hook configuration to `.gemini/settings.json`
- Verify hooks fire correctly on each platform

### Phase 3: Extended Hooks

- Session context injection
- Secrets scanning
- Claude Code prompt hooks for complex validation (if warranted)
- Documentation and ADR update

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Stdin schema differences break scripts across platforms | Phase 0 research; schema-tolerant parsing or thin normaliser |
| Hooks slow down agent workflow | Keep hooks fast (< 1s); use async where supported |
| Codex adds hooks with a different protocol | Design scripts to be protocol-tolerant; revisit when Codex ships hooks |
| Hook scripts need platform-specific tool names in matchers | Matchers stay in platform config (Layer 2); scripts receive normalised input |

## Dependencies

- ADR-125 (three-layer model) — already accepted
- Repo-local activation beyond Claude Code `PreToolUse` — requires fresh
  verification, wiring, and matrix updates
- Codex hook support — blocked on upstream (openai/codex#7396)

## Non-Goals

- Replacing Cursor's activation triggers (`.mdc` rules) with hooks — triggers and hooks serve different purposes
- Implementing hooks for Codex before upstream support exists
- Creating a universal hook abstraction layer — the thin-wrapper pattern is sufficient
