---
id: paused-pr-estate-disposition
node_type: delivery
name: Paused-PR estate disposition (the 17 owner-labelled PRs)
overview: >-
  Every PR labelled "paused for submission" carries a recorded disposition —
  merge at condition, close with adjudication, or hold at a named gate — and
  a named owner; execution is sized to the unique substance.
status: superseded
superseded_by: open-surface-zero
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-09
---

# Paused-PR estate disposition

Owner directive (2026-08-08 morning, in-session at the Director seat):
seventeen open PRs carry the "paused for submission" label; "we need a
plan for merging or closing each of them." This node is the disposition
ledger — the record that no PR was silently dropped. The owner answered
the ledger's three forks the same sitting: #766 merges as research docs,
and BOTH execution lanes are routed.

A second owner word (2026-08-08 afternoon, at the Director seat)
re-trued the design rows: all open design-system PRs merge safely and
properly as the design seat's priority. #783's Act-2 adjudication
resolves in the merge direction and #784's accumulation window closes.
Executed the same afternoon: the owner merged #737 directly (the
standing reviews were Matt's agents', confused), and the Director —
owner-named executor — adjudicated every review comment on #783/#784
first-hand and merged both at full condition. #829, outside this
label estate, rides the design seat's sha-pinned grant.

## The ledger (every PR, its verdict, its ground)

| PR | Verdict | Ground and owner |
|---|---|---|
| #737 | MERGED by the owner (2026-08-08 14:15Z) | The standing changes-requested reviews were from Matt's agents, not Matt, and had confused; the owner dissolved the gate and merged directly |
| #788 | Merge at full condition | Small dead-code retirement; freshness re-check then merge — sweep lane |
| #818 | Merge path | Custodial pair lane: Copilot foundation + finding-3 config-class expert ruling, undraft, merge |
| #819 | Merge path | Custodial pair lane: docs-adr + onboarding passes + Copilot, merge |
| #731 | Reconcile-then-merge | The grouped-by-concern owner ruling re-trues it before merge; one seat, source work |
| #745 | Adjudicate at MCP-528 pickup | Overlaps the ratified seat-register plan; that implementer rules merge-or-supersede |
| #734 | Owned by its live lane | The typescript-estate lane's landing vehicle (owner-directed worktree); re-slicing question at that lane's resume |
| #783 | MERGED at b888b732b (2026-08-08) | Owner-named Director execution: five review findings adjudicated first-hand (cures at 74cffbf85), threads resolved, full condition recomputed at the boundary; ratification inputs routed to the design seat's Act-2 pass |
| #784 | MERGED at 1bfbb19d6 (2026-08-08) | Owner-named Director execution: eleven findings adjudicated (cures at ff207c5f2 — dated count corrections, the reference-local cure; two rejections recorded on the PR); story-card notes ride the merged record's addendum |
| #746 | Sweep lane adjudicates | Pre-submission plan node trued against the moved estate: merge if current, close-with-adjudication if superseded |
| #769 | Sweep lane adjudicates | Same class as #746 |
| #771 | Sweep lane adjudicates | Same class as #746 |
| #774 | Sweep lane adjudicates | Same class as #746 |
| #792 | Sweep lane adjudicates | Same class as #746 |
| #805 | Sweep lane adjudicates | Orphan-rescue report: merge as report if substance unhomed, close-with-adjudication if conserved (the #806 precedent) |
| #807 | Close-with-adjudication (candidate) | Spike evidence for the pending mutation-testing decision; branch preserved, evidence linked — sweep lane confirms |
| #766 | Merge as research docs | OWNER WORD 2026-08-08: freshness re-check then full-condition merge — sweep lane carries it |

## Goal

The open-PR board returns to the standing discipline — every open PR
merged, closed, or owned — with a recorded decision per PR and no
silent drops. Success is the label emptying through recorded
dispositions, not through bulk action.

## Mechanism

Two routed lanes execute the unique substance; four PRs are already
owned by named lanes or clocks and need no new work:

1. **Plans-truing sweep lane** (ROUTE on the comms stream, 2026-08-08):
   seven adjudications (#746, #769, #771, #774, #792, #805, #807) plus
   two merges (#788 freshness-checked, #766 at owner word). One
   sitting; each superseded plan closes with its adjudication recorded.
2. **Custodial pair lane**: #818 + #819 through their expert passes and
   full-condition merges under the Copilot-foundation review posture.
3. Dispositioned 2026-08-08: #737 (owner-merged), #783/#784 (merged
   under owner-named Director execution). Still owned: #734
   (typescript-estate lane), #731 (reconcile seat when routed), #745
   (MCP-528's implementer).

## Acceptance criteria (each with a proof — required)

1. Every ledger row's disposition is executed or its named gate/owner is
   live, and the "paused for submission" label holds zero PRs without a
   recorded decision. Proof: `repo-safe` — the label query plus each
   PR's closing/merging record.
2. No close loses substance: every close-with-adjudication names where
   the substance lives or that the branch is preserved. Proof:
   `repo-safe` — the adjudication comments.

## Out of scope

- Executing #734's re-slicing, #745's adjudication, or the design
  lane's Act-2 calls — those belong to their owning lanes; this ledger
  only records that they own them.
- Any change to the merge instruments — the merge-decision
  Copilot-foundation truing is its own routed story.

## Review notes

The `plan-body-first-principles-check` fires at authoring; the sweep
lane's per-PR adjudications carry their own evidence on each PR. No
vendor forks.
