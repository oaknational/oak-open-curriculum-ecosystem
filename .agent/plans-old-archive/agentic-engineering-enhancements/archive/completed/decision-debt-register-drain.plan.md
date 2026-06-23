---
plan_id: decision-debt-register-drain
collection: agentic-engineering-enhancements
lane: current
status: READY FOR EXECUTION
created: 2026-06-16
owner_thread: agentic-engineering-enhancements
source_brief: .agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md
governing_method: .agent/skills/consolidate-until-done/SKILL-CANONICAL.md
todos:
  - id: ws0-triage
    content: "Triage all live register items first-hand; classify each {graduate | reject | duplicate}; group by target home"
    status: pending
  - id: ws1-graduation-tranches
    content: "Route each tranche's substance into its target home, verify it live, remove the decided entries; commit per coherent tranche"
    status: pending
    depends_on: [ws0-triage]
  - id: ws2-integrity-repairs
    content: "Resolve the register-integrity findings (PR #213: DUE-tiering entry removed without disposition) as part of triage, not separately"
    status: pending
    depends_on: [ws0-triage]
  - id: ws3-rest-verification
    content: "Re-run fitness; confirm decision-debt reflects real dispositions; report residue as live decision-debt (never owner-gated)"
    status: pending
    depends_on: [ws1-graduation-tranches, ws2-integrity-repairs]
---

# Decision-Debt Register Drain

## End Goal

Every live item in the pending-graduations register has a recorded terminal
disposition (`graduated` / `rejected` / `duplicate`), or is a small, honest
residue of genuinely-future-triggered decision-debt — with each item's insight
conserved in a durable permanent home before any entry leaves the register. The
user-impact outcome: the Practice's knowledge-flow pipeline actually delivers
captured learning into enforced doctrine, instead of accumulating undecided debt
that silently ages (72 overdue, oldest 48d at plan-authoring time).

## Mechanism

Decision-debt falls **only by deciding** (PDR-100): route substance to its
`target` home and remove the entry, confirm a duplicate's home and remove, or
reject with a recorded reason. The register entries already carry their own
routing metadata (`target`, `trigger`), so the drain is a **disposition pass**,
not N graduation projects. Per the plan-skill "Apply all of X" discipline, the
unit of thoroughness is *every item having a recorded decision*; implementation
work is sized to the **unique substance**, not the item count — many items will
be `duplicate` (already-homed) or `reject` (single-instance "keep-watching"
candidates that warrant no durable home). The safety net for a wrong call is
**provenance + adaptation** (commits, the landed homes, visible history), not
owner pre-approval — there is no owner-gated / owner-walk / owner-only resting
state.

## Means

Governed end-to-end by [`consolidate-until-done`](../../../skills/consolidate-until-done/SKILL-CANONICAL.md)
(mode `dedicated-knowledge-curation`). This plan is the executable scaffold;
the method, completion contract, and forbidden anti-patterns are owned by that
skill and are not restated here.

- **WS0 — Triage (first-hand).** Read every live register item. Classify each
  `{graduate | reject | duplicate}`. Group the graduates by `target` home into
  tranches. Re-derive the live count at execution time (derivation-anchored — the
  72 is a plan-authoring snapshot; concurrent same-day flow can change it).
- **WS1 — Graduation tranches.** For each tranche (grouped by destination home —
  a rule amendment, an existing PDR/ADR, a governance doc): route the substance
  in, **verify it is live in the home** (the pre-archive verification gate),
  remove the decided entries, and commit the tranche as one coherent unit.
- **WS2 — Integrity repairs.** Fold the register-integrity findings into triage:
  PR #213 flagged a `status: DUE` tiering entry removed without a disposition
  (drain-by-deletion is forbidden). Recover its insight from git history (the
  deleting commit's parent), decide it properly.
- **WS3 — Rest verification.** Re-run `pnpm practice:fitness`; confirm the
  decision-debt count reflects real dispositions; report any residue as live
  decision-debt (`pending`/`due`/`overdue`) — never re-introduce a gated status.

## Acceptance Criteria (outcome-based)

1. Every live register item present at execution start has a recorded terminal
   disposition (`graduated` / `rejected` / `duplicate`) — an unfired second-instance
   trigger is a legitimate `reject` reason once the item's insight is conserved —
   **or** remains live decision-debt (`pending`/`due`/`overdue`) solely because its
   trigger is genuinely future. Residue is not a fourth disposition that clears the
   obligation (PDR-100 §Falsifiability); it stays visible in the count. Proof level:
   `non-code` — the register end-state and the commits are the proof.
2. For every `graduated` item, its substance is verifiably live in the named
   permanent home (read the home; do not trust the ledger). For every `duplicate`,
   the home is confirmed. For every `reject`, the reason is recorded.
3. `pnpm practice:fitness` decision-debt count reflects the real dispositions; no
   item carries `owner-gated` (the `item-count.ts` guard would flag it).
4. No register entry was removed except by a recorded terminal disposition — no
   deletion-to-fit, no limit raise, no archive-to-fit (PDR-100 falsifiability).

## Prerequisites

- **Blocking:** the substrate `owner-gated` purge — landed this session (the
  register, skills, briefs, continuity, and drain plans no longer teach
  owner-gated/owner-walk as a resting status); without it the drain re-inherits the
  abolished frame. The owner abolition-*scope* decision (knowledge-flow purged,
  action-authority gates kept) is resolved and gates no item's disposition — it ran
  parallel, never as a blocker.
- **Beneficial:** the cadence-anchor decision (open-questions Q-001). Minimum
  shippable shape without it: the drain still completes; the cadence cure only
  governs *re-accrual prevention*, which is explicitly post-drain (below).

## Non-Goals

- **The consumer-cadence cure (WS-OM / lightweight trigger-scan, PDR-068) is NOT
  in this plan.** The thread directs *drain first, build later*; the cadence cure
  is a named follow-on, authored only after the drain proves the steady-state
  decision rate. Building it before draining is the soft-default antipattern the
  thread record names.
- Not re-opening PDR-100; not changing fitness thresholds; not touching the
  immutable/historical record of the old vocabulary.

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) — knowledge-preservation
  is absolute; conserve insight before any entry leaves.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — any code in
  the follow-on cadence cure lands test-first; the drain itself is `non-code`.
- [PDR-100](../../../practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md)
  — decision-debt as a first-class pillar; provenance over pre-approval.
- [PDR-068](../../../practice-core/decision-records/PDR-068-pipeline-back-pressure-as-structural-cure-signal.md)
  — the four-bottleneck diagnosis informs the follow-on cure, not this drain.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md):
the only code path is the follow-on cadence cure (out of scope here), so the
TDD-cycle and vendor-literal clauses do not fire on the drain itself. The
shape-clause fires on WS0: the risk is treating "decide 72 items" as 72
execution cycles; the disposition-pass framing is the first-principles correction.

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| "Covered elsewhere" claims that are false (15/18 once were) | Verify each home first-hand before reject/duplicate; the pre-archive gate is mandatory |
| Drain pressure produces hollow doctrine to force count→0 | Reject is a valid disposition; residue stays as honest decision-debt; never mint doctrine from a single instance |
| Re-inheriting owner-gated framing from stale substrate | Blocking prerequisite: substrate purge lands first |
| Context exhaustion mid-drain across 70+ items | Commit per tranche; `carried-forward` only as an interrupted-run handoff, not a disposition |

## Readiness Reviewers

Before execution start next session: `assumptions-expert` (drain proportionality
and the residue definition), and — for any follow-on cadence-cure code —
`test-expert` and `config-expert`. Reviewer findings assessed first-hand.

## Learning Loop & Lifecycle Triggers

Completion runs [`consolidate-until-done`](../../../skills/consolidate-until-done/SKILL-CANONICAL.md)
(the drain *is* the consolidation). Lifecycle touch points per
[`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
session-open grounding, claim registration on the register surface, per-tranche
commit landing, and handoff closure updating the thread record. On completion,
archive this plan per ADR-117 and update the completed-plans index.
