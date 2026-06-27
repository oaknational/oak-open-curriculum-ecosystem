---
status: PROPOSED — DEEP REVIEW REQUIRED before any execution
owner: unassigned (owner-scheduled)
created: 2026-06-27
created_by: Alder tracks Topsoil (claude / claude-opus-4-8[1m])
thread: agent-tooling
related:
  - ADR-197 (one checkout owns shared registry state)
  - F-41 (resolve the coordination home across worktrees)
  - .agent/memory (reference) worktree-primary-resolution-scatter
---

# Comms-system and primary-checkout / worktree operability

> **DEEP REVIEW AND FURTHER THOUGHT REQUIRED.** This plan NAMES the work and the
> decisions to be made; it does not make them. It was drafted at the end of a long
> session that surfaced the underlying frictions first-hand, so it captures the
> shape while it is fresh — but it must not be executed before a deliberate
> review pass (see §Review gate). Several load-bearing facts are flagged
> "verify" below; treat them as hypotheses, not settled.

## Deep re-assessment scope — READ FIRST (everything below is provisional)

This plan was captured fast at session end; treat **all specifics as provisional**. Each item
below needs deliberate re-assessment and likely rewriting in the review pass — none is
settled. The live review-round comments on this PR (#244) are **folded into this list** rather
than fixed line-by-line, by owner direction:

- **The per-command path discipline (Part A).** Which `comms` / `claims` subcommands default
  their path via `resolveCoordinationHome` vs require `--comms-dir` / `--active` explicitly —
  re-verify the EXACT set against the live CLI. It is not just `list/watch/inbox`: `direct`,
  `reply`, and others also require explicit paths; only `send` is confirmed to default. Do not
  enumerate from memory — the list drifts.
- **The command-anchoring consolidation (Part B).** Whether to default every
  collaboration-state command via `resolveCoordinationHome` — reconcile against the queued
  `future/coordination-home-explicit-targeting-migration.plan.md` (F-41 CLI tail) and the
  frictions register; it may be a reference, not new work.
- **The statusline binary-pinning + resolver consolidation (Part B1/B2).** The Claude Code
  semantics it rests on (project-settings resolution across worktrees, `CLAUDE_PROJECT_DIR`
  reliability, the statusLine command cwd) are asserted but NOT verified end-to-end from a
  worktree — re-verify (the claude-code-guide pass erred on `--show-toplevel`). Decide
  command-resolves-primary vs shim-self-resolves vs both.
- **The markdownlint `.agent/state` scheme.** The durable approach (gitignore-respecting vs
  surgical globs, under the no-`!` HARD RULE) is open; the shipped fix is an interim narrow
  ignore of the specific untracked files.
- **Part A scope and shape (feature-shaping = owner's).** Two skills vs one; the content
  boundaries; whether each is warranted.

In short: re-derive every factual claim and every command name against the live system before
building, and treat the structure as a starting point, not a specification.

## Why (the frictions that motivated this, all observed 2026-06-26/27)

The invariant **"shared team state lives at the primary checkout"** (ADR-197; the
F-41 cure) is real but **scattered and only partially enforced**, and it produced
three first-hand footguns in one session:

1. **Comms `--comms-dir` hazard.** The comms CLI default anchors to the primary via
   `resolveCoordinationHome` (correct), but an explicit **relative `--comms-dir`**
   overrides it and resolves relative to cwd — from a worktree that silently writes
   worktree-local, re-creating the F-41 invisibility. (I passed a relative
   `--comms-dir` all session; it only worked because the session ran in the primary.)
2. **Statusline binary not pinned to the primary.** `statusLine.command` is
   `node .claude/scripts/statusline-identity.mjs` (relative) → from a worktree it runs
   the **worktree's** copy of the script (its branch's version + its agent-tools
   build), so the statusline's layout and even existence vary by which worktree the
   agent is in. The shim's internal `repoRoot = CLAUDE_PROJECT_DIR ?? <path-arithmetic>`
   compounds it (both can resolve to the worktree).
3. **markdownlint-root globbed untracked state.** `.agent/**/*.md` lint glob caught an
   untracked `.agent/state/` coordination file and blocked pushes tree-wide. **FIXED
   separately this session** by a *narrowed* ignore of the specific untracked coordination
   files in `.markdownlint-cli2.jsonc` (the generated log + the cross-worktree map) — NOT a
   blanket `.agent/state/**`, which would drop the tracked READMEs (see §Open questions).
   Positive ignores only (the file's HARD RULE: a `!` re-include silently zeroes the gate).

Root cause: the "primary checkout" is resolved by **at least two separate
implementations** and the invariant is undocumented for operators.

## Part A — Two operating skills (feature-shaping: owner decision)

Two distinct skills, distinct invocation triggers; keep separate (they overlap only
on "comms anchors to primary" — cross-reference, do not duplicate).

### A1. Comms-system usage skill

Operational how-to for the collaboration-state CLI. Consolidates knowledge currently
scattered across `comms-all-channels-watcher`, `use-agent-comms-log`, the
`arc-rapid-communication` reference, `start-right-team`, and the CLI `--help`. Must
cover: send / list / watch / inbox / reply / claims; the canonical ↔ ARC channel
pairing (and that an ARC watcher never substitutes for the canonical one); identity
seeding; n=2 mode (PDR-082); and the **command-specific path discipline** — `comms send`
defaults its `comms-dir`/`active` to the primary via `resolveCoordinationHome`, but `comms
list / watch / inbox` REQUIRE `--comms-dir` and `claims` REQUIRE `--active` with no
primary-anchored default (Codex, #244). So: let `send` default; give the explicit-path
commands the primary-resolved PATH directly in `--comms-dir` / `--active` (resolve it via
`resolveCoordinationHome` / `git worktree list --porcelain | first` — those commands do NOT
accept `--repo-root`), never a cwd-relative path (from a worktree that lands worktree-local).

### A2. Mixed primary-checkout / worktree operation skill

Environment-operational how-to for working inside a linked worktree. Must cover: the
ADR-197 invariant; **what auto-resolves to the primary** (only `comms send`'s defaults, via
`resolveCoordinationHome`) **vs. what does NOT and needs the primary path passed explicitly**
(`comms list/watch/inbox` `--comms-dir`, `claims` `--active`, the statusline binary, anything
globbed by tooling — a *relative* path to any of these silently lands worktree-local); that
gates and pushes run against
the *worktree*; the cross-worktree work-state map (the F-98 interim registry); and where
to read vs. write shared state.

## Part B — Structural consolidation (architecture; needs design review)

Skills document how to operate given current behaviour; Part B fixes the behaviour.

### B1. One primary-checkout resolver (DRY — owner-directed)

There is already a reusable, tested resolver:
`resolveCoordinationHome(cwd)` in `agent-tools/src/collaboration-state/coordination-home.ts`
(`git worktree list --porcelain` → first/main worktree). **Use it everywhere — do not
add a new resolver.** The statusline currently **duplicates** the logic in
`agent-tools/src/claude/statusline-git-io.ts` (`parsePrimaryWorktreeRoot` via its own
`git worktree list`). Consolidate the statusline's primary resolution onto
`resolveCoordinationHome` (or a shared lower-level helper), removing the duplicate.

Also close the **command-anchoring asymmetry** (Codex, #244): `comms send` defaults
`--comms-dir`/`--active` to the primary via `resolveCoordinationHome`, but `comms
list/watch/inbox` and `claims` require those paths explicitly with no default — a footgun
(a relative path lands worktree-local). Give them the same `resolveCoordinationHome` default
so every collaboration-state command anchors to the primary by default (DRY; removes the
relative-path hazard at the source rather than documenting around it). This overlaps the
already-queued `future/coordination-home-explicit-targeting-migration.plan.md` (the F-41 CLI
tail) and the frictions register — drive/reference that work, do not duplicate it.

> **VERIFIED TRAP (do not regress):** the primary is `git worktree list --porcelain |
> first`, **NOT** `git rev-parse --show-toplevel` (which returns the *current* worktree —
> empirically confirmed 2026-06-27; the claude-code-guide subagent wrongly recommended
> `--show-toplevel`). Any reviewer who proposes `--show-toplevel` is wrong.

### B2. Pin the statusline binary to the primary checkout

Goal: the statusline script + its agent-tools build always come from the primary,
regardless of the session's worktree.

- `statusLine.command` resolves the primary via the shared resolver and runs the
  primary's shim — no machine-local path (git-native resolution; the repo forbids
  hardcoded absolute paths).
- The shim (`statusline-identity.mjs`) resolves `repoRoot` via the same shared resolver,
  not `CLAUDE_PROJECT_DIR ?? path-arithmetic` (both can resolve to the worktree).
- Graceful degradation preserved: any resolution failure still exits 0 with no output
  (the statusline must never disrupt a session).

**Lane coordination (2026-06-27):** §B1/B2 are the INFRASTRUCTURE member of the statusline
lane — coordinate via the
[`statusline-enhancements` thread record](../../../memory/operational/threads/statusline-enhancements.next-session.md)
(the lane SSOT). Both §B2 and the logo-modularisation plan's WS4.2 edit
`statusline-identity.ts`; sequence with it, do not land in parallel. This work stays behind
the §Review gate below.

## Open questions / verify-before-building (the deep-review surface)

- **Claude Code semantics (verify, do not trust):** does project `.claude/settings.json`
  resolve to the primary repo in a worktree (claude-code-guide claimed yes)? Is the
  `statusLine.command` cwd the worktree? Is `CLAUDE_PROJECT_DIR` reliably exported to the
  statusline? These determine whether updating `main`'s settings is sufficient or whether
  each branch needs it, and whether a shell-resolved command or a self-resolving shim is
  the cleaner seam. The claude-code-guide pass got the core resolver wrong — re-verify
  every Claude Code claim against current behaviour and docs.
- Should the statusline `command` resolve the primary (shell `$(...)`) or should the shim
  self-resolve (so even a stale worktree command still lands on the primary)? Likely both,
  belt-and-suspenders — decide in review.
- Is a shared lower-level "first worktree path" helper warranted (used by both
  `resolveCoordinationHome` and the statusline), or should the statusline call
  `resolveCoordinationHome` directly? (DRY either way; pick the cleaner boundary.)
- Security: the bootstrap resolver runs `git` from PATH (S4036); acceptable for a
  best-effort cosmetic read, but confirm against the trusted-git posture.
- **markdownlint scope for `.agent/state/` (durable scheme, deferred):** markdownlint-cli2
  lints by glob with `gitignore: false`, so untracked coordination `.md` (the cross-worktree
  map, handoff records) get linted and can block pushes tree-wide — but `.agent/state/` also
  holds **tracked, authored** scaffolding/decision-provenance markdown (`README.md`,
  `handoffs/README.md`, `archive/README.md`, `escalations/README.md`) that SHOULD stay
  linted. A blanket `.agent/state/**` ignore over-excludes those (Copilot caught this on
  #244); the interim fix excludes only the specific untracked files. The durable options —
  `gitignore: true` (skip gitignored files repo-wide; understand why it is currently `false`)
  vs. surgical per-subtree globs (constrained by the HARD RULE forbidding `!` negation) — are
  a design decision for this review, not a one-liner.

## Review gate (before ANY execution)

This plan is PROPOSED, not READY. Required before execution:

- A deliberate design review with **architecture-expert** (boundary/DRY of the shared
  resolver) and **config-expert** (the `statusLine` config + settings-resolution).
- A **claude-code-guide** re-pass on the Claude Code semantics — **critically assessed**
  (it erred on `--show-toplevel` this time).
- An **end-to-end test from an actual linked worktree**, not just the primary.
- Owner ratification of Part A scope (two skills vs. other shapes) — feature-shaping is
  the owner's.
