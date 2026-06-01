# Agent Hook Policy

This directory contains the canonical agent-hook policy for this
repository. Hooks follow the same canonical-first pattern as rules and
skills: policy lives here, shared runtime lives in a workspace-owned command,
and thin native activation lives in platform config.

## Current Status

**Guardrail-only**: the hook layer is intentionally narrow.

- `preToolUse` — natively enforced for Claude Code Bash calls by invoking the
  prebuilt runtime artefact directly with
  `node agent-tools/dist/src/hook-policy/check-blocked-patterns.js`; blocks
  shell commands that bypass safety guardrails or destroy history (force-push,
  hard reset, `--no-verify`)
- `sessionStart` — documented policy only; grounding is already enforced
  through the entry-point chain and start-right skills
- `preCommit` — documented policy only; quality-gate reminders already
  live in the workflow and review surfaces

## Policy Spine

The hook layer follows a small Policy Spine. The layers are not peers.

1. **Canonical policy** — `.agent/hooks/policy.json`
   This is the authority for what the repo intends to allow, block, or
   describe.
2. **Native activation** — platform config such as `.claude/settings.json`
   This tracked project config may activate only supported canonical policy. It
   does not redefine the policy.
3. **Workspace-owned runtime** — the prebuilt
   `agent-tools/dist/src/hook-policy/check-blocked-patterns.js` artefact,
   invoked directly with `node` by the native activation (the
   `pnpm agent-tools:check-blocked-patterns` script remains as a manual /
   diagnostic entry point to the same TypeScript source).
   The runtime enforces the active policy for the supported native surface.
4. **Explanatory mirrors** — this README and the cross-platform surface matrix
   These must describe the live arrangement, but they never override it.

Failure semantics:

- `override` — a higher-authority canonical layer wins
- `prune` — a missing native surface removes a local activation path without
  changing canonical intent
- `block` — the runtime or validator rejects an unsafe or incoherent state

## Build-Artefact Freshness

The native activation invokes a **prebuilt** artefact
(`agent-tools/dist/src/hook-policy/check-blocked-{patterns,content}.js`), not the
TypeScript source. `dist/` is gitignored, so the artefact is materialised by the
build, and its freshness is guaranteed at two points:

- **Install** — the root `package.json` `postinstall` builds `agent-tools`, so a
  fresh clone has the artefact before the first agent session.
- **Commit** — `.husky/pre-commit` runs `build` (turbo-cached, a no-op when the
  guard source is unchanged), so committed guard-source changes are compiled.

**Invariant:** after editing a hook-guard source file
(`agent-tools/src/hook-policy/*.ts` or `policy-loader.ts`), run a build
(`pnpm --filter @oaknational/agent-tools build` or any `turbo build`) before
relying on the guard in the active session — until then the running hook
executes the previously-compiled artefact. The failure direction is safe: a
stale guard still blocks every already-published pattern; only a *newly added*
pattern is unenforced until the next build. If the artefact is missing entirely,
the `node` invocation fails loudly (`Cannot find module`) rather than silently
allowing the tool call.

## Platform Support

Claude Code currently has thin native activation wired for
`PreToolUse` only via the tracked project file `.claude/settings.json`.
Additional Claude overrides can stay in `.claude/settings.local.json`,
which is gitignored and additive.

See `.agent/memory/executive/cross-platform-agent-surface-matrix.md` for the
full platform support status.

Cursor, Gemini CLI, GitHub Copilot, and Codex remain unsupported.

## Policy File

`policy.json` is the canonical hook policy. Platform-specific activation
translates this policy into native config. The policy file is the source
of truth; native config files and repo-local scripts are derived from it.

## Porting to Native Activation

When wiring hooks for a platform:

1. Read `policy.json` for the canonical policy
2. Create thin native activation in the platform config directory
3. Reuse or add a workspace-owned runtime command only when native config
   cannot read `policy.json` directly
4. Update the surface matrix to record the supported state
5. Add drift checks to the portability validation script
