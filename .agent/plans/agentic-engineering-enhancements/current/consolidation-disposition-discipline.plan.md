---
status: completed
kind: executable
owner_decision_required: false
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agentic framework / knowledge-curation discipline
  strategic_choice: the agentic framework is a first-class value stream (FRAME-1)
  derives_from: >-
    .agent/skills/consolidate-docs/SKILL-CANONICAL.md;
    .agent/skills/consolidate-until-done/SKILL-CANONICAL.md;
    sibling write-time cure in
    future/continuity-surface-drift-prevention.plan.md
todos:
  - id: ws1-guardrails
    content: >-
      Amend consolidate-docs + consolidate-until-done so a "residual,
      report-not-chase" verdict on an over-limit file is gated on a content read,
      and so graduating learned lessons is named non-deferrable (distinct from an
      owner-gated decision).
    status: completed
  - id: ws2-graduate-and-fix-director-handoff
    content: >-
      Graduate the durable Director-craft Standing Lessons into PDR-117; correct
      the stale CURRENT HANDOFF STATE; prune the FIXED frictions; shrink the
      Standing Lessons section to PDR-117 pointers.
    status: completed
    depends_on: [ws1-guardrails]
  - id: ws3-aee-drain
    content: >-
      Focused drain pass on agentic-engineering-enhancements.next-session.md —
      verify-homed then conserve-insight-and-delete the completed/landed arcs to
      pointers, keeping only live lanes, live briefs, recent live sessions, the
      identity table, and cross-links.
    status: completed
    depends_on: [ws1-guardrails]
  - id: ws4-meta-pattern
    content: >-
      Capture the "legitimate principle invoked as cover for not doing the work"
      anti-pattern as a patterns/ file (sibling of fluency-is-a-failure-vector).
    status: completed
isProject: false
---

# Consolidation Disposition Discipline

> **STATUS: COMPLETE (2026-06-29) — safe to archive.** All four workstreams landed.
> WS1 (read-gates-verdict + graduation-non-deferrable) + the impact-not-thresholds
> re-centring → both consolidate skills (`be953fbf3`, `dc5280a21`, M1-fix). WS2 →
> PDR-117 carries the Director craft; director-handoff shrunk + corrected. WS3 →
> the AEE record drained to live-content-only (~844→356 lines). WS4 →
> `patterns/legitimate-principle-as-avoidance-cover.md`. The permanent doctrine lives in
> the skills + the pattern; this plan is the execution record (archive per ADR-117).

## Problem (gap, harm, mechanism, success)

**Gap.** The `consolidate-docs` and `consolidate-until-done` skills tell an agent
to *"investigate any file worse than soft,"* but they never gate the
*"report residual, don't chase"* verdict on an actual content read — so an agent
can disposition an over-limit file as a benign residual from its **metadata**
(size, role) alone and be "compliant." They also leave open an escape hatch:
graduating a learned lesson into its doctrine home can be deferred to a vague
"owner-routed future session" by conflating it with a genuinely owner-gated
*decision*.

**Who it harms.** Every future consolidation agent, and the knowledge substrate —
which then retains un-homed doctrine (e.g. Director-craft lessons that belong in
PDR-117) and un-drained completed-session narrative (the AEE thread record at
76k chars), both invisible because the "residual" verdict closed the file.

**Mechanism (causal hypothesis).** A true principle is bent into cover for not
doing the work. *"Don't chase fitness numbers"* (real) is read as *"don't
investigate the number"* (false — the conservation invariant says fitness
**routes** work). *"Owner-routed"* (real, for decisions) is read as *"don't
graduate the learned lesson"* (false — homing captured lessons **is**
consolidation). The justification arrives fluently
(`fluency-is-a-failure-vector`), so it bypasses the check. This was demonstrated
first-hand this session: both director-handoff.md and the AEE record were passed
as "report-not-chase residuals" without a content read; the read later falsified
that verdict (un-homed PDR-117 doctrine + ~330–390 lines of drainable narrative).

**What success looks like.** A consolidation skill where (a) a "residual" verdict
on any over-limit file is structurally the **conclusion of a content read**, never
a substitute for one, checked against the file's own disposition policy; and
(b) "graduate the learned lesson into its home" is named non-deferrable
consolidation work, with "owner-routed" reserved for decisions, never homings.

## End goal · Mechanism · Means

- **End goal.** Shallow, metadata-only disposition and deferred graduation become
  structurally hard to do while staying "compliant"; the next agent that opens an
  over-limit continuity/doctrine file reads it and homes/drains its substance.
- **Mechanism.** Make the read the gate (an over-limit verdict must cite what the
  read found), and close the graduation escape hatch in the skill text — the two
  edits a future agent reads at the exact decision moment.
- **Means.** WS1 amends the two skills; WS2/WS3 are the **proving instance** —
  execute the very graduation and drain that the shallow verdict skipped; WS4
  homes the generative anti-pattern so the lesson fires next time.

## Crosswalk — not a fork

[`future/continuity-surface-drift-prevention.plan.md`](../future/continuity-surface-drift-prevention.plan.md)
owns the **write-time** firing point: its WS(a) makes `session-handoff` §2 a
*curate-not-append* step so finished entries drain as new ones are added
(append-rate ≥ drain-rate at the surface). Its promotion trigger — *"whenever the
next continuity-curation pass runs"* — has fired (this pass); WS2/WS3 here are
that curation. **This plan is the sibling at the consolidation-time firing
point**: it stops a consolidation agent from *closing* an over-accreted file with
a metadata-only verdict. Same generator (append > drain), two firing points; both
cures are needed. WS1 cross-references drift-prevention WS(a); neither duplicates
the other.

## Workstreams

### WS1 — consolidation guardrails (the systemic cure)

Amend both skills (best-effort doctrine authoring, PDR-104; main agent only,
PDR-003):

1. **`consolidate-until-done` Completion Contract item 1 / `consolidate-docs`
   step 9** — a file worse than soft may only be recorded as a *residual to
   report* after a **first-hand content read** whose finding is stated (un-homed
   substance? drainable completed narrative? genuinely dense live content?). A
   residual verdict that cites only size/role/limit is forbidden — it is the
   metadata-only disposition this plan exists to stop. For continuity/narrative
   files, the read checks the file against its own `overflow_disposition` /
   continuity-practice §Disposition (leave-if-live; else conserve-and-delete).
   Name the distinction explicitly: **"don't chase the number" ≠ "don't
   investigate the number."**
2. **`consolidate-docs` step 7 / `consolidate-until-done` work loop** — graduating
   a learned lesson into its doctrine home (rule/PDR/ADR/pattern/governance doc)
   is **non-deferrable consolidation work**: it is the point of the pass. Deferring
   it to "a future/owner-routed session" is only valid for a genuinely owner-gated
   **decision** (a verdict, a product-scope call), never for the **homing** of an
   already-learned lesson. Name the failure: an owner-gated decision's gating must
   not bleed onto a graduation.

### WS2 — graduate Director-craft to PDR-117 + fix director-handoff (proving instance, point 2)

- Synthesise the durable Director-**role doctrine** from director-handoff
  §Standing Lessons into PDR-117 (Director role / Consequences Required-Forbidden)
  — context-economy/minimum-action, verify-state-before-routing, route-lanes-not-
  pickups, reject-either/or, delegate-aggressively, takeover-verification
  (registry-freshness ≠ comms-liveness), stop-heartbeat-at-standdown. Synthesis,
  not paste; PDR-117 is portable role doctrine.
- After graduation, shrink director-handoff §Standing Lessons to **operational
  procedure + PDR-117 pointers** (the file is PDR-117's operational entry point,
  not a second doctrine store — its own contract).
- Correct the stale `CURRENT HANDOFF STATE` (Falcon stood down; #290 merged) —
  a live misleading-doc.
- Prune the two FIXED frictions (F-94/F-95) to a single line.
- The worktree-per-agent **model verdict** remains genuinely owner-routed — it is a
  decision, not a homing; do not graduate a verdict that has not been reached.

### WS3 — AEE record focused drain (proving instance, point 3)

This pass IS the focused drain. Per completed/landed arc: verify the substance is
live in its cited home first-hand, then conserve-insight-and-delete the narrative
to a one-line pointer. Drain candidates: the PDR-105 burndown block (~140 lines,
"COMPLETE"), Decision-Debt (Limpet + superseded Lapwing), AX-first-class,
statusline-DONE, four-files-resolved + Current-Continuation, the landed-item-2a
detail in the Briny banner. Keep: live lanes A–D, the live WS1 brief, the recent
live session (Schooner), the identity table, cross-links.

### WS4 — capture the generative anti-pattern

Author `patterns/legitimate-principle-as-avoidance-cover.md` (sibling of
`fluency-is-a-failure-vector`): a real principle invoked to license an omission it
does not actually license; the tell is a fluent "of course, conservation/owner-
gating/restraint means I needn't…"; the cure is to check whether the principle
*licenses* the omission or is being *bent* into it.

## Acceptance criteria

- **WS1**: both skills carry the read-gates-the-verdict clause and the
  graduation-is-non-deferrable clause; portability green. Outcome test: the skill
  text makes a metadata-only "residual" verdict and an "owner-routed" graduation
  deferral each visibly non-compliant.
- **WS2**: PDR-117 carries the graduated Director-role doctrine (docs-adr-expert
  assessed); director-handoff §Standing Lessons is pointers+procedure; CURRENT
  HANDOFF STATE truthful; FIXED frictions one line. director-handoff back under
  its char/line limits as a side effect (not the goal).
- **WS3**: every drained arc verified-homed before deletion; AEE record carries
  only live content + identity table + cross-links; char-hard cleared by real
  draining (not a limit raise).
- **WS4**: the pattern file exists, polarity-correct, linked from
  `fluency-is-a-failure-vector` and the WS1 skill clauses.

## Non-goals (YAGNI)

- Not the worktree-per-agent model verdict (genuinely owner-routed decision).
- Not the structural drain-lag validator (drift-prevention WS(b), AX WS-4) — this
  plan is doctrine + execution, not tooling.
- Not raising any fitness limit to clear the char-hard (the cure is draining the
  substance, not moving the line).
- Not a re-litigation of the 115 prose-width raise (correct and done).

## Prerequisites

- WS2/WS3 are `beneficial`-sequenced after WS1 (apply the guardrail, then execute
  the work it governs as the proving instance) — but all execute this same pass;
  the minimum shippable shape if interrupted is WS1 + WS4 (the systemic cure)
  with WS2/WS3 carried as the next pass's first work.

## Risks

| Risk | Mitigation |
|---|---|
| Graduating Director lessons bloats PDR-117 | Synthesise, don't paste; PDR-117 carries doctrine, director-handoff carries procedure; preserve substance, route fitness pressure (PDR-046). |
| The AEE drain deletes a still-live forward-ask | Per-arc verify-homed AND confirm any live forward-ask is already captured in lanes A–D / cross-links before deleting (conserve-insight-and-delete gate). |
| A peer is live-editing adjacent surfaces (owner on repo-continuity, corpus-runbook) | Stage by explicit pathspec; do not touch repo-continuity or the corpus-runbook report/plan. |

## Foundation alignment

- `principles.md` — conservation invariant (fitness routes work, never trims
  understanding); documentation-is-infrastructure (crosswalk before forking).
- `consolidate-docs` / `consolidate-until-done` — the surfaces amended.
- `permanent-doc-is-the-consolidation-record` — the commits + homes are the record
  of the drain; no disposition ledger.

## Plan-body first-principles check

- **Shape**: WS1 acceptance tests the skill *text*'s effect on a future agent's
  decision (verdict-needs-a-read), not "the file was edited."
- **Landing-path**: skill edits are canonical `.agent/skills/*/SKILL-CANONICAL.md`;
  portability:check validates adapter sync at edit time.
- **Vendor-literal**: none (doctrine + memory surfaces only).

## Lifecycle triggers

Per [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
this plan is executed within the active dedicated-consolidation pass; its own
completion is recorded by the consolidation commit and the permanent homes (PDR-117,
the amended skills, the drained record), per `permanent-doc-is-the-consolidation-record`.
