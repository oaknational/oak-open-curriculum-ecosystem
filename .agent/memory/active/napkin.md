---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-12.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-11.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-12.md
[previous-pass]: archive/napkin-2026-05-11.md

## 2026-05-12 — Flamebright Sparking Forge / codex / GPT-5 / `019e1a`

### Consolidation Pass

- Ran `jc-start-right-thorough` before touching the targeted operational
  docs. Registered claim `faaab113-d585-41ea-92ca-92854a53a0e1` after the
  live claims query returned no active claims.
- Archived the pre-reconciliation `repo-continuity.md` snapshot to
  `archive/repo-continuity-session-history-2026-05-12.md`, then rewrote the
  live file as a compact operational index: current state, active threads,
  next safe steps, open owner decisions, invariants, and deep-consolidation
  status.
- Reconciled `pending-graduations.md` so the index counts the body's current
  due candidates and explicitly separates stale graduated metadata from live
  ADR/PDR promotion decisions.

### Patterns to Remember

- A full-file archive snapshot is a good defensive move before large continuity
  compaction: it preserves historical prose verbatim while allowing the live
  surface to become operational again.
- When correcting stale `status: due` metadata, name the existing durable home
  in the index. That makes the action status reconciliation, not silent
  doctrine graduation.
- Cost-of-collaboration P0 remains live: `.husky/pre-commit` still runs
  whole-tree gates except for staged Markdown. Do not treat documentation
  consolidation as permission to reopen multi-agent implementation windows.

### Validation

- Focused `markdownlint` and `git diff --check` passed for the edited
  continuity, pending-graduations, napkin, thread-record, archive, and
  collaboration-state surfaces.
- `practice:fitness:informational` improved from CRITICAL to HARD:
  `repo-continuity.md` is healthy; `pending-graduations.md` remains hard on
  lines/chars; `practice-bootstrap.md` remains hard on chars.
- `practice:fitness:strict-hard` failed as expected on those remaining hard
  surfaces. This is the correct residual signal: the queue still needs a real
  graduation/archive drain, not metric-shaped trimming.

## 2026-05-12 — Torrid Flaring Hearth / codex / GPT-5 / `019e1a`

### Consolidate-Docs Pass

- Ran `jc-start-right-thorough` before consolidation: read the parent
  directive, canonical rules index, start-right files, repo continuity, the
  active thread record, live claims, shared comms, active memory, and relevant
  consolidation directives.
- Registered the session identity in
  `agentic-engineering-enhancements.next-session.md` because PDR-027 requires
  traceable identity rows for active repo work.
- Opened claim `f7ea560a-cb19-4bdf-b1b8-6faf2a66d1d5` for the consolidation
  surfaces touched by this pass.
- Archived the oversized active napkin as `archive/napkin-2026-05-12.md` and
  reset this active page to current carry-forward notes only.

### Mistakes Made

- My first `claims open` attempt passed an unquoted
  `.agent/state/collaboration/comms-events/**` pattern. The shell expanded it
  into every matching path and the CLI rejected the command as an unknown
  argument set. No collaboration state changed, but the failure is worth
  keeping visible.
- Behaviour change: quote every glob-shaped collaboration-state pattern, or
  pass it as a single `--area-pattern` value. Do not trust a bare glob inside
  a shared-state command.

### Fitness Findings

- `practice:fitness:informational` correctly flagged this napkin as critical
  before rotation: 687+ lines against a 300-line hard limit.
- Remaining hard pressure is not solved by napkin rotation: `repo-continuity.md`
  and `pending-graduations.md` need separate owner-visible drain plans because
  both are carrying real cross-session state.
- The pending-graduations index appears stale relative to body entries marked
  `status: due`; the next drain pass should reconcile the index before moving
  individual doctrine candidates.

### Thread State Notes

- Cost-of-collaboration P0 is still open. `.husky/pre-commit` still runs
  whole-tree checks (`format-check:root`, `knip`, `depcruise`, and full Turbo
  type/lint/test), while only markdownlint has a staged-specific route.
- The current thread record's warning to keep the repo in a single-agent window
  until P0 lands remains valid.
- A peer `git:index/head` claim was fresh during this pass, so this session
  intentionally avoided staging, committing, or rewriting shared git state.

### Carry-Forward

- Treat `active-claims.json`, `shared-comms-log.md`, and `comms-events/**` as
  live shared surfaces. Re-read them before any new state mutation.
- Do not silently promote pending ADR/PDR candidates from a consolidation pass.
  Surface due candidates and route the owner-visible decisions explicitly.
- When a fitness file is oversized because it is carrying useful state, the
  cure is home, graduate, split, refine, or limit. It is not trim-for-metrics.

### Session Handoff

- Ran `jc-session-handoff` after the consolidation pass per owner direction.
- No new ADR/PDR decision was made in this closeout. The next session should
  inspect the already-surfaced candidates in `pending-graduations.md` and make
  owner-visible promotion decisions there.
- Entry-point drift sweep was clean for `AGENTS.md`, `CLAUDE.md`, and
  `GEMINI.md`.
- No session-created tactical track card required promotion or deletion. The
  existing skills-standardisation timing card is older, still informational,
  and outside this closeout bundle.

## 2026-05-12 — Flamebright Roasting Magma / codex / GPT-5 / `019e1a`

### Root-Script Retirement Surprises

- Deleting root `scripts/` exposed a Knip configuration edge: removing the
  root script workspace let Knip fall back to broad root-source discovery and
  report unrelated operational/platform files as unused. The fix is to keep
  the root workspace explicit with `entry: ['package.json']` and `project: []`,
  which encodes "root has no source logic" without reintroducing `scripts/**`.
- Commit-queue intents are file-list exact. When a hook failure requires
  follow-up files, abandon the old intent and enqueue a widened one rather than
  trying to verify extra staged files against the original intent.
- Owner correction: the current agent-tools CLI surface is too low-level for
  ordinary agent use. Having agents hand-pass ISO dates, UUIDs, claim ids, and
  intent ids is tooling leakage, not good operator UX. Recorded as
  `frictions-register.md` F-19 and routed into the P-Foundation CLI overhaul.

## 2026-05-12 — Shared State Is Commit-Worthy

### Mistakes Made

- I treated post-work comms/state residue as if it could be left behind after
  the requested commit. Owner correction: comms are a shared responsibility
  that anyone can commit, as is everything under `.agent/memory/**` and
  `.agent/state/**`.
- Behaviour change: when shared memory or state is part of the live work,
  either commit it or name precisely why a fresh post-commit mutation remains.
  Do not describe those surfaces as disposable cleanup.

## 2026-05-12 — `pnpm check:profile` Needs Environment Notes

### Profiling Surprise

- A clean detached worktree isolated the dirty main tree, but it also exposed
  local bootstrap assumptions: pnpm offline cache was incomplete, Playwright
  browsers were not installed, and Chromium could not launch inside the
  sandbox. The useful full-profile attempt needed browser install plus an
  escalated run before it reached the real failing task.
- Behaviour change: when profiling a many-process gate, preserve the early
  environment failures as evidence instead of flattening everything into the
  final failing test.

## 2026-05-12 — Volcanic Banking Pyre Skill Review / codex / GPT-5 / `019e1a`

### Skill Remediation Findings

- Deep review of `jc-start-right-quick` and `jc-start-right-thorough` showed a
  subtle drift shape: the canonical skill wrappers had become smaller
  directive-only summaries while the shared workflow files carried the real
  live-state, active-claim, thread, plan, and git-grounding contract. Fix:
  make the canonical skill body point at the shared workflow as the source of
  truth instead of duplicating a partial list.
- `jc-commit` still named retired adapter paths and a deleted root
  `scripts/log-commit-attempt.sh` helper after root-script retirement. Fix:
  remove the stale root-script instruction and point platform topology back to
  ADR-125 plus the generated `.agents/skills/jc-commit` and
  `.claude/skills/jc-commit` adapters.
- `pnpm portability:check` caught an adjacent `.agents/rules/` wrapper gap for
  `present-verdicts-not-menus.md` from the prior jc-plan remediation. Treat
  adapter validation failures during documentation work as real infrastructure
  findings, even when the missing wrapper is not in the original edit list.

## 2026-05-12 — Vining Budding Canopy / codex / GPT-5 / `019e1a`

### Profiling Handoff

- The `pnpm check` profile needs two evidence modes: cold isolated proof cost
  and warm local rerun cost. The first pass is now preserved in
  `.logs/check-profiles/` and explained in
  `pnpm-check-profiling-deep-dive-2026-05-12.md`; the second pass is blocked
  until the MCP Vitest failure is fixed.
- Do not let profiling environment failures obscure the final product failure:
  Playwright bootstrap and sandbox launch were profiling constraints; the
  next actionable blocker is
  `src/correlation/middleware.integration.test.ts:203`.

### Quality-Gate Plan Update

- Owner asked whether the quality-gate performance/tuning work had an explicit
  implementation plan. The correct answer was "partly": P0 existed in
  `cost-of-collaboration.plan.md`, and the profiling deep dive contained
  recommendations, but the task decomposition was not yet executable enough.
- Behaviour change: when an analysis note creates next-step recommendations
  that affect collaboration cost, promote them into the active plan's
  machine-readable `todos:` before handoff. Recommendations alone are too easy
  for the next agent to admire and not execute.
- Owner then changed root `pnpm check` toward non-mutating lint, Markdown, and
  format proof commands. Behaviour change: treat live owner gate changes as
  current baseline evidence to verify, while keeping the owner-authored code
  edit out of my commit unless explicitly asked to include it.

## 2026-05-12 — Volcanic Banking Pyre Closeout / codex / GPT-5 / `019e1a`

### Handoff Closeout Correction

- The first closeout commit preserved the earlier profiling handoff at the
  top of the thread record, but the owner's newest instruction superseded the
  next-session opener. Fix: make the paired `jc-session-handoff` +
  `jc-consolidate-docs` review, with `jc-metacognition`, the current
  continuation while keeping the profiling lane below it as preserved state.

## 2026-05-12 — Smouldering Melting Kiln Skill Review / codex / GPT-5 / `019e1a`

### Patterns to Remember

- Cross-tool skill wrappers live under `.agents/skills/jc-*` and
  `.claude/skills/jc-*`, but the reviewable source of truth for shared
  workflow logic lives under `.agent/skills/*/SKILL-CANONICAL.md`. When
  reviewing a skill, open the wrapper only to confirm it is a pointer; patch
  the canonical body unless the adapter itself has drifted.
- A "clean at closeout" opener can be overtaken by live owner edits or monitor
  events before the next session starts. Treat the opener as a hypothesis,
  re-read `git status`, active claims, shared comms, and continuity surfaces,
  then scope around whatever residue is actually present.

## 2026-05-12 — Cosmic Gliding Aurora Quality-Gate Correction / codex / GPT-5 / `019e1a`

### Mistakes Made

- I initially forced the P0 work through a blunt "make pre-commit staged-only"
  frame and treated the owner's unit-test/type-check note as compatible with
  removing too much from the commit boundary. Owner correction: pre-commit
  stops detectably broken code entering git history; pre-push stops broken code
  and additional high-standard failures leaving the local environment.

### Patterns to Remember

- Speed work cannot redefine the trigger's purpose. Optimise only the part that
  is actually causing false ambient failures: here, Prettier and Markdownlint
  content scanning. Keep type-check, lint, shell lint, and current test proof at
  pre-commit until a validated unit-only lane preserves the same broken-code
  guard.
- Knip and depcruise are owner-classified higher-standard gates for this repo:
  keep them at pre-push, `pnpm check`, and CI rather than at the commit
  boundary.

## 2026-05-12 — Comms Event Retention Correction / codex / GPT-5 / `019e1a`

### Owner Correction

- Comms are first-class, but individual `comms-events/` files are not a
  permanent archive. At consolidation, events older than seven days must be
  read for documentation content or reusable coordination insight, routed to
  napkin/distilled/patterns/pending-graduations or permanent docs as
  appropriate, and then deleted from the event buffer.
