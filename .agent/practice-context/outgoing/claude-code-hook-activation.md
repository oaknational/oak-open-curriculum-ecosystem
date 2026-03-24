# Claude Code Hook Activation

> **Origin**: oak-mcp-ecosystem, 2026-03-23
> **Status**: Live local implementation

This note captures the smallest hook activation that proved worth wiring in a
real repo.

## What Was Activated

- **Platform**: Claude Code
- **Native surface**: machine-local gitignored `.claude/settings.json`
- **Hook event**: `PreToolUse`
- **Matcher**: `Bash`
- **Runtime**: `node scripts/check-blocked-patterns.mjs`
- **Canonical policy**: `.agent/hooks/policy.json`

The runtime reads Claude's hook payload from `stdin`, extracts the shell
command, loads `hooks.preToolUse.blocked_patterns` from the canonical policy,
and returns a structured `PreToolUse` deny payload when a dangerous pattern is
matched.

The repo only relies on the ignored machine-local `.claude/settings.json`
entry for native activation. Additional Claude overrides can stay in
`.claude/settings.local.json`, which is also gitignored.

## Why Only `PreToolUse`

`PreToolUse` adds real enforcement: it can stop destructive or guardrail-bypass
commands such as force-pushes, hard resets, and `--no-verify`.

The other policy entries stayed **documented-only**:

- `sessionStart` already overlaps with `AGENT.md` plus the start-right skills
- `preCommit` already overlaps with the quality-gate and reviewer workflow

This kept the native activation thin instead of wiring advisory hooks that add
maintenance cost without adding enforcement.

## Runtime Design Choice

Do not hardcode `tools/` as the only valid home for hook runtimes. In this repo
the natural fit was `scripts/`, because repo-level validation and audit scripts
already lived there. The portable Core should describe a **repo-local script
surface** (`scripts/` or `tools/` as appropriate), not a mandatory directory
name.

## Validation Pattern

The local portability audit (`scripts/validate-portability.mjs`) was extended to
check that three artefacts stay aligned:

1. `.agent/hooks/policy.json`
2. `.claude/settings.json`
3. `.agent/reference/cross-platform-agent-surface-matrix.md`

Policy and matrix parity are always enforced. Local hook wiring is validated
only when the machine-local `.claude/settings.json` exists, so clean clones and
CI do not fail simply because that ignored file is absent.

## Limits

- This is **not** a generic hook runtime framework; it is a single-purpose
  checker for one native platform
- Pattern matching is a guardrail, not a proof boundary
- Unsupported platforms should stay explicitly unsupported until they have a
  real canonical policy layer plus thin native activation
