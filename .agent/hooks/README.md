# Agent Hook Policy

This directory contains the canonical agent-hook policy for this
repository. Hooks follow the same canonical-first pattern as rules and
skills: policy lives here, shared runtime lives in a workspace-owned command,
and thin native activation lives in platform config.

## Current Status

**Guardrail-only**: the hook layer is intentionally narrow.

- `preToolUse` — natively enforced for Claude Code Bash calls by invoking the
  prebuilt runtime artefact
  (`agent-tools/dist/src/hook-policy/check-blocked-patterns.js`) through the
  verdict shim `.claude/hooks/run-pretooluse-guard.mjs`; blocks
  shell commands that bypass safety guardrails or destroy history (force-push,
  hard reset, `--no-verify`)
- `preToolUseContent` — natively enforced for Claude Code Edit/Write calls
  through the same verdict shim, running
  `agent-tools/dist/src/hook-policy/check-blocked-content.js`; blocks the
  path-agnostic owner-approval marker and path-scoped doctrine block groups
  (see "Content guard: concept-grouped doctrine blocks" below)
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
   invoked through the verdict shim `.claude/hooks/run-pretooluse-guard.mjs`
   by the native activation (the
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

## Content guard: concept-grouped doctrine blocks

`preToolUseContent` guards Edit/Write content. It has two surfaces:

- `blocked_patterns` — the path-agnostic owner-approval marker; only the
  project owner may author it.
- `scoped_blocks` — path-scoped doctrine block **groups**. Each group gathers
  the surface patterns for one **concept**, so the citation and the reappraisal
  are authored once per concept rather than once per pattern:

  ```jsonc
  {
    "concept": "expediency-hedging", // names the pattern family
    "kind": "literal", // or "regex"; group-level
    "patterns": ["carve out", "good enough"],
    "include_paths": ["**/*.plan.md"],
    "exclude_paths": ["archive/"], // optional
    "excludes_inline_code": true, // optional; regex groups
    "excludes_lines_with": ["(historical reference)"], // optional; regex groups
    "citation": "PDR-044; principles.md §...", // the doctrinal anchor
    "reappraisal": "Re-assess whether the design is uniform ..." // positive direction
  }
  ```

  `kind` and the `excludes_*` options are group-level — every pattern in a group
  shares them.

**The deny message carries the reappraisal.** When a group fires, the message
names the concept the matched text is a fingerprint of, states the `reappraisal`
(the positive direction the firing signals), adds the meta-instruction that the
firing is about the concept and not the wording, and ends with the `citation`.
This is the content of PDR-044 §Innate immunity (as amended 2026-06-07): a block
that only says "no" leaves the agent to find a synonym and route around it; a
block that says "no, and here is the concept to reappraise" triggers the right
response. Detection — whether a block fires — depends only on `patterns` +
path-scope + the added-not-in-prior check, never on the `reappraisal`.

**`reappraisal` is enforced at commit-time, not load time.** The load-time
schema (`agent-tools/src/hook-policy/types.ts` `ScopedContentBlockGroupSchema`)
leaves `reappraisal` optional, so a missing value never throws and fails the
guard closed — which would brick the worktree on a stale-`dist`/new-policy
mismatch. Presence is enforced where blocking is safe instead: the
`validate-policy-reappraisal` repo validator
(`agent-tools/src/validators/policy-reappraisal/`), wired into
`repo-validators:check`, fails the commit/push/CI run if any group lacks a
non-empty `reappraisal`. The deny builder defaults a generic reappraisal as a
runtime safety net if one is ever absent.

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
pattern is unenforced until the next build.

The shim `.claude/hooks/run-pretooluse-guard.mjs` takes control of the verdict
when the artefact does not run cleanly — something a direct `node <guard>.js`
cannot do (a direct `node <missing>.js` exits 1, which Claude Code treats as
non-blocking and would *silently allow* the call). It splits the two
artefact-failure shapes:

- **Present but broken** — the guard is built but crashes, is killed, fails its
  module load, or is called with no path: the shim **fails closed** (exit 2),
  blocking the tool call. A built guard that misbehaves is a suspicious signal.
- **Not built** — the artefact is missing (a fresh checkout before install, or a
  branch switch / deleted `dist`): the shim **fails open** (exit 0) and lets the
  call proceed. Blocking here would brick the worktree — it would block the very
  `pnpm install` / `pnpm agent-tools:build` needed to build the guard, an
  unrecoverable catch-22. The allow is loud, not silent: a warning naming the
  artefact and the rebuild command goes to stderr **and** is appended to
  `.claude/logs/hook-errors.log` (the harness does not surface PreToolUse stderr
  on an allow, so the log is the durable, auditable record).

The Read / `UserPromptSubmit` secrets-scan hooks (via
`.claude/hooks/_lib/log-hook-errors.sh`) are deliberately **best-effort /
fail-open**: they `exit 0` when the scanner is unavailable so a session is never
bricked by a missing optional tool. That is a broader fail-open posture than the
dangerous-command/content guards above: those fail open *only* for the not-built
case (loudly, as above) and fail **closed** whenever a built guard misbehaves.

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
