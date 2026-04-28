# Workstream Brief — Operational Awareness and Continuity

**Status**: CLOSED 2026-04-21 (OAC Phase 4 bookkeeping closeout, Session 5 of
the `memory-feedback` thread, Pippin/cursor-opus). Substantive Phase 4 work
landed in the 2026-04-20 session arc; this brief retains the closed-lane
narrative because two pieces are still load-bearing for the
`memory-feedback` thread: (1) the Session-4 FAILED-watchlist observation
below, and (2) the promotion watchlist that the thread still mines for
emergent-whole signal.

**Last refreshed**: 2026-04-21 (Session 5 close-out).
**Branch (historical)**: `feat/otel_sentry_enhancements`.

## Closure summary (2026-04-21)

OAC Phase 4 closed. Plan archived to
[`archive/completed/operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md).

Phase outcomes:

- **Phase 0** baseline: complete (2026-04-19 baseline + 2026-04-20 addendum).
- **Phase 1** state-surface contract: complete (in-plan Design Contract + the
  deep-dive
  [`operational-awareness-and-state-surfaces.md`](../../reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md)).
- **Phase 2** workflow integration: complete. Scaffolding at
  `.agent/memory/operational/` (commit `ffcad2aa`); session-handoff, GO,
  and (historically) the now-dissolved continuation prompt updated.
- **Phase 3** self-hosted pilot: complete. Evidence at
  [`operational-awareness-pilot-evidence.md`](../../analysis/operational-awareness-pilot-evidence.md).
  Scenarios 1, 4, 5, 6 PASS. Calibration: PROMOTE. Mid-pilot owner correction
  inverted the gitignore decision — tracks are git-tracked, not gitignored.
- **Phase 4** rollout + portability + doc propagation: complete.
  - Task 4.1 rollout — continuation prompt dissolved (1628 → ~140 lines,
    behavioural-only); session-handoff + GO retired pilot framing and
    read/write state surfaces directly.
  - Task 4.2 portability decision — **No promotion to Practice Core. Remain
    portable candidate, repo-local.** Only one of four criteria met
    (markdown-first vs sidecar boundary explained); the other three need
    multi-shape and multi-agent evidence the single-session dogfooding could
    not generate. Re-evaluation triggers named in plan body.
  - Task 4.3 doc propagation — six surfaces handled (ADR-150, governance,
    practice-bootstrap, OAC deep-dive substantively updated; practice.md,
    hub README, continuity-and-knowledge-flow deep-dive, ADR-119 carry
    explicit no-change rationale). Reviewers `docs-adr-reviewer` +
    `assumptions-reviewer` ran ACCEPT-WITH-NOTES; findings applied. See
    [`documentation-sync-log.md` § OAC Phase 4.3](../../plans/agentic-engineering-enhancements/documentation-sync-log.md).
  - Refinements (a) repo-continuity field rename and (b) authority-order
    language landed; refinements (c) expiry-check helper and (d)
    napkin-promotion helper deferred with named build triggers.

## Why this brief is retained, not deleted

Two narratives remain useful to the `memory-feedback` thread:

1. **Session-4 FAILED-watchlist observation** (below) — first concrete
   instance of the `hedged-link-in-ritual-is-read-as-none` pattern
   candidate. Removing it loses the load-bearing pilot-evidence anchor for
   that pattern.
2. **Promotion watchlist** (below) — first-ever real population of a
   workstream brief. Whether the field set held under resume pressure, and
   whether the pilot evidence file format generalises, are still open
   questions worth observing across more workstreams before promotion.

When the `memory-feedback` thread no longer mines this brief for signal,
delete the file or move it to an archived-briefs location.

## Session-4 FAILED-watchlist observation (2026-04-21)

The `workstream-brief-is-compact-state-of-resumption` test item at the
bottom of this brief was, in effect, **FAILED in Session 4**. The
`memory-feedback` thread's next-session record at
[`../threads/memory-feedback.next-session.md`](../threads/memory-feedback.next-session.md)
historically cited this brief as *"arguably covers [the memory-feedback
thread] loosely"*. The Session 4 agent (Samwise) read that line at session
open, absorbed the "loose-coverage" framing, and proceeded for the rest of
the session without reading this brief. Owner surfaced the miss late in the
session.

The brief itself was compact and correct — the failure was the hedged
parenthetical discouraging the read, compounded by no explicit instruction
in the thread-resume ritual to follow such linked-but-hedged references.
Data point: current brief format can be **linked but not read** when the
linking prose hedges. See also the pattern candidate
`new-doctrine-lands-without-sweeping-indexes` (the same session missed
threads in the operational-memory README index and in `orientation.md` —
same class of silent discoverability failure).

The hedged passage in the thread record was de-hedged at Session 5 open
(2026-04-21) when Pippin updated the workstream-brief column on the
`memory-feedback` row of `repo-continuity.md` to a direct link with
"read this on arrival". The hedge in the thread's next-session record
itself is a Session 5 simplification-pass target (item: `hedged-link-in-ritual-is-read-as-none`).

## Promotion watchlist (retained)

- **`pilot-evidence-structure-as-decision-template`** — if the pilot
  evidence file format (per scenario: setup → actions → result PASS/FAIL →
  friction → verdict) proves useful as a general "prove-this-decision-with-
  evidence" artefact, extract it as a template.
- **`workstream-brief-is-compact-state-of-resumption`** — first real
  population of a workstream brief (this file and the sibling observability
  brief). Session 4 surfaced the first failure mode (hedged link → not
  read). Whether the field set itself holds under resume pressure remains
  open.

## Follow-ups routed elsewhere (do not block this closure)

- **Deep consolidation pass for governance guardrails `4bccba71` graduation**
  — tracked in `.agent/memory/operational/repo-continuity.md § Deep
  consolidation status`. Scheduled for explicit session, not smuggled into
  the next commit.
- **PDR-011 second-pass assumption review** — logged in
  `documentation-sync-log.md § Follow-up flagged during closeout`. Picks up
  on the next consolidation pass.

## Owning plan(s)

- [`operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md)
  — lane-level execution authority. **CLOSED + ARCHIVED 2026-04-21**.
