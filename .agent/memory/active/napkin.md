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
