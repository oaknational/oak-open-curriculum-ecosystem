---
name: "Coordination-Home Explicit-Targeting Migration — refuse cwd-relative writes across the estate (F-41 B2)"
overview: >
  Complete the F-41 path-safety arc begun by WS-3 B1 of the AX umbrella plan. B1
  landed the shared `resolveCoordinationHome` resolver and removed the silent
  cwd-fallback from comms-send / tui / comms-validate (commit b5408291d). B2 — make
  the remaining write commands (claims open/close/heartbeat, comms inbox/watch,
  commit-queue) refuse a bare relative path and resolve the coordination home
  explicitly — turned out to be a repo-wide invocation-contract migration, not a
  small in-package change: the canonical watcher rule, the commit skill, start-right,
  ~a dozen tests, and every live agent's watcher invoke these commands with relative
  paths today. Owner-deferred 2026-06-21 to be sequenced as one coordinated change.
status: future
type: developer-experience
related_frictions:
  - "F-41 (.agent/plans/agent-tooling/frictions-register.md) — partially closed by B1; B2 completes it"
related_plans:
  - "../current/agent-experience-improvement.plan.md"
related_doctrine:
  - "docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md"
  - ".agent/practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md"
  - ".agent/rules/no-machine-local-paths.md"
  - ".agent/rules/comms-all-channels-watcher.md"
  - ".agent/skills/commit/SKILL-CANONICAL.md"
landed_predecessor: "commit b5408291d (WS-3 B1)"
last_updated: 2026-06-21
isProject: false
---

# Coordination-Home Explicit-Targeting Migration (F-41 B2)

**Status**: 🔵 FUTURE — strategic brief, queued. Deferred from
[`agent-experience-improvement.plan.md`](../current/agent-experience-improvement.plan.md)
WS-3 B2 by owner decision (2026-06-21) once the blast radius surfaced: refusing
bare-relative paths breaks the relative-path invocations baked into the estate's
own skills, rules, and tests, so it must be a coordinated migration, not a
small per-command edit.

## Framing: many checkouts, many machines is the default

This brief assumes **many checkouts, on possibly different machines**, as the
baseline — not a single shared checkout (owner direction 2026-06-21; the
multi-developer-transition reality; ADR-197's whole reason for existing). The
single-checkout case is the degenerate one. Under the many-checkout default:

- Each checkout has its own `.agent/state/collaboration/`. Resolving a path by
  walking up from `cwd` finds the **local** checkout's home — which is the WRONG
  registry whenever the local checkout is not the coordination home. A bare
  relative path resolved against `cwd` has the same defect.
- The only robust target is an **explicit absolute path to the coordination
  home**, resolved at session open and carried on every invocation
  (ADR-197 §"The coordination home"; `--repo-root` / absolute `--comms-dir` /
  `--active`). No machine-local path is ever written into a versioned file
  (`no-machine-local-paths`).
- Across machines the collaboration filesystem is not shared at all; cross-machine
  coordination (git push/pull or a network surface) is a larger architectural
  question and is explicitly **out of scope** here — flagged, not built.

## What B1 already delivered (predecessor)

Commit `b5408291d`:

- One shared `resolveCoordinationHome(cwd, {exists})` built on a new throwing
  `resolveRootFromDir` walk primitive in `core/repo-root.ts`.
- Deleted the two duplicated silent `findCollaborationRepoRoot` finders
  (`cli-comms-send`, `tui/config`) and the bare `process.cwd()` fallback
  (`cli-comms-validate`); consolidated to the single resolver. A guard test
  refuses re-introduction of a silent finder.
- The resolver **throws loudly** when no ancestor holds the
  `.agent/state/collaboration` sentinel, instead of silently falling back to
  `cwd`. This closes the silent-cwd-fallback subclass of F-41 (machine-agnostic:
  it discovers the home relative to cwd, no hardcoded path).

**B1's residual limit (the reason B2 exists):** B1's *default* resolution still
walks up to the **local** checkout's home. In a many-checkout world that is not
necessarily the coordination home, so a relative path or an omitted-path default
can still land in the wrong registry without throwing. Closing that requires the
explicit-targeting discipline below.

## The blast radius (why this is a migration, not an edit)

Refusing bare-relative paths on the named commands breaks every current
invocation that passes them — verified first-hand 2026-06-21:

- **Watcher rule** `comms-all-channels-watcher.md:41-42`: relative `--comms-dir`
  and `--seen-file` in the canonical watcher invocation every agent runs.
- **Commit skill** `SKILL-CANONICAL.md:202,302`: relative `--active` on every
  commit's claim open/close.
- **start-right** shared workflow: relative collaboration paths.
- **~a dozen agent-tools tests** passing relative `active.json` / `state/comms`.
- **Live agents' watchers** (any running session) would be refused on restart.

So the refusal must land together with a migration of all those invocations to
the safe pattern, or it bricks the coordination substrate mid-session.

## Scope (the coordinated change)

1. **agent-tools code** — for `claims open/close/heartbeat`, `comms inbox`,
   `comms watch`, and `commit-queue`:
   - Default each path option, when omitted, via `resolveCoordinationHome` (so the
     safe invocation can simply omit defaultable paths).
   - Refuse a bare **relative** path loudly with a specific, actionable error
     (absolute, or `--repo-root`, or omit). Honour the `--repo-root` / absolute
     override (PDR-055 clause 7) — over-refusal that breaks legitimate explicit
     targeting is the named risk.
   - The per-agent `--seen-file` cannot be fully defaulted (it carries the agent
     codename); decide between an absolute requirement and a
     `<home> + codename` derivation.
2. **Doctrine + skills** — migrate the watcher rule, commit skill, and start-right
   invocations to the safe pattern (omit defaultable paths; absolute where an
   explicit path is required; `--repo-root` to the coordination home resolved at
   session open).
3. **Tests** — sweep the ~dozen relative-path invocations to absolute/omit.
4. **Live re-arm** — re-arm running watchers with the migrated invocation in the
   same coordinated window.

## Acceptance (outcome-based)

- A write/seen-file invocation from a nested or non-coordination-home checkout with
  a bare relative path is refused with a specific error; an invocation that omits
  the path (defaulted) or passes `--repo-root`/absolute lands in the
  coordination-home registry regardless of cwd or checkout.
- The migrated watcher rule, commit skill, and start-right invocations run green
  under the new contract; no live watcher is bricked by the rollout.
- `frictions-register` F-41 closed with B1 + this migration's landing SHAs.

## Sequencing

Land as one coordinated change when the session can absorb a doctrine + test +
live-re-arm migration without disrupting an active multi-agent window. Pairs
naturally with the worktree-topology adoption (separate git worktrees per seat),
which is the structural cure for the shared-checkout turbo-gate coupling observed
in the 2026-06-21 n=2 session.
