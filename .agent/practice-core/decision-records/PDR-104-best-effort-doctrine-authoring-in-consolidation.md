---
pdr_kind: governance
---

# PDR-104: Best-Effort Practice-Doctrine Authoring in Dedicated Consolidation Sessions

**Status**: Accepted (owner-stated standing policy, 2026-06-18; formalised under
its own terms — best-effort, no owner pre-ratification)
**Date**: 2026-06-18
**Related**:
[PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md)
(sub-agent protection — the boundary this policy operates *within*, unchanged);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — the flow that corrects best-effort
mistakes);
[PDR-101](PDR-101-graduation-requires-quorum.md)
(graduation review rigor — a *review* mechanism that composes with best-effort
authoring, not an owner-pre-ratification gate);
[`over-caution-root-is-perfectionism`](../../memory/active/patterns/over-caution-root-is-perfectionism.md)
and the `gates-must-be-citable` discipline (the failure mode this policy names).

## Context

The Practice's knowledge flow requires agents to author and amend Practice
doctrine — PDRs, rules, patterns, skills, and the Core trinity — during dedicated
consolidation sessions. A recurring over-caution reflex led agents to **invent**
owner-pre-ratification gates for that authoring. The proximate instance
(2026-06-18, Asteroid calls Meridian): an agent asserted "PDR authoring is
owner-ratified" — an invented gate generalised from the kept Core-edit safety
control and from two stale wordings, uncited (a `gates-must-be-citable` breach).

The two stale wordings that fed the invented gate:

- **PDR-003 §Decision**: the primary agent "retains full authority over these
  documents, with the human's consent in the loop for changes of substance."
- **`consolidate-docs` step 8 §3**: "Owner approves each amendment before editing
  Core surfaces … the owner reviews each diff."

Read literally, both impose a per-amendment owner pre-approval gate, which stalls
buffer drains on owner availability and gives the over-caution reflex a fig-leaf.

The owner corrected the reflex and stated the standing policy (2026-06-18): agents
make **best efforts** in dedicated consolidation sessions; mistakes are accepted;
**better-tomorrow over perfect-today**; Practice frictions surface through use and
are fixed by the knowledge flow — **not** by owner-pre-ratification of each PDR.

## Decision

In a **dedicated consolidation session**, the **primary conversation agent**
authors and amends Practice doctrine (PDRs, rules, patterns, skills, and Core
trinity surfaces) on **best effort, without owner pre-ratification of each
change.** Mistakes are an accepted normal cost; the knowledge flow (PDR-014
capture → distil → graduate → enforce, plus the PDR-101 graduation quorum and
ordinary reviewer dispatch) surfaces and corrects them.

Three boundaries keep this narrow and safe:

1. **Sub-agent protection is unchanged (PDR-003).** Sub-agents still MUST NOT
   create, edit, delete, or rename foundational/Core documents. The best-effort
   authority is the *primary* agent's — the one carrying the cross-session context
   PDR-003 requires. Best-effort does not widen *who* may edit Core; it clarifies
   that the primary agent need not pre-clear each edit.
2. **Action-authority and safety gates are unchanged** (the 2026-06-16 owner
   scoping that survived the `owner-gated` purge): merge, plan-promotion / PR-merge,
   Sonar authorisation, `--no-verify`, and fitness-limit raises remain
   owner-gated. Those are *action-authority* controls, a different axis from
   *knowledge-flow doctrine authoring*. This PDR governs only the latter.

   **The 2026-06-16 list also named "Core-edit" — this PDR disambiguates it, it does
   not silently keep it.** "Core-edit" fused two senses the 2026-06-16 wording left
   coupled: **(a) sub-agents may not edit Core** (PDR-003) — KEPT, unchanged; and
   **(b) the owner pre-approves each Core / doctrine amendment** — the
   per-amendment pre-ratification reading from which the invented "PDR authoring is
   owner-ratified" gate was generalised. Sense (b) is exactly what this PDR relaxes
   for dedicated consolidation sessions; it is the **third** stale wording reconciled
   here, alongside PDR-003 §Decision and `consolidate-docs` step 8 §3. The two
   continuity surfaces that record the 2026-06-16 kept-gates list (repo-continuity
   § Current State; the `agentic-engineering-enhancements` thread record) carry a
   forward-pointer to this PDR for sense (b).
3. **Review rigor still applies (PDR-101).** Graduating a new lesson to doctrine
   still runs the graduation quorum where one is reachable; the quorum is a
   *review* mechanism (does the doctrine hold up?), not an owner *pre-ratification*
   (may I write it?). Best-effort authoring composes with review, it does not skip it.

**Reconciliation of the stale wordings.** PDR-003's "with the human's consent in
the loop for changes of substance" and `consolidate-docs` step 8 §3's "owner
approves each amendment" are reconciled to: the owner reviews doctrine through the
normal flow and retains the kept safety gates — the owner does **not**
pre-approve each consolidation-session amendment. Both surfaces are amended to
cite this PDR.

## Consequences

### Enables

- Agents drain buffers and graduate doctrine without stalling on owner
  availability — the dedicated-consolidation goal can actually run to done.
- The over-caution / owner-gating reflex loses its fig-leaf: "the owner must
  approve" is no longer a citable reason to defer the hard graduation work.

### Forbids

- Inventing uncited owner-approval gates for doctrine authoring (`gates-must-be-citable`).
- Using "owner must pre-approve" as a soft-default to defer draining or graduation.
- Reading this PDR as licence for *sub-agents* to edit Core (PDR-003 stands) or as
  licence to bypass the kept action-authority/safety gates (boundary 2 stands).

### Accepted cost

- Some best-effort doctrine will be wrong and need correction. This is the cheaper
  failure: an un-drained buffer and a lesson that recurs every session
  (the cost the owner was paying) is worse than a corrected best-effort edit. The
  knowledge flow exists precisely to catch and fix it.

## Falsifiability

Falsified if best-effort doctrine authoring in consolidation sessions produces a
materially harmful Core change that the knowledge flow + PDR-101 quorum + ordinary
review fail to catch before it causes downstream damage — which would be evidence
that per-amendment owner pre-ratification was load-bearing after all. Absent such
evidence, the recurring cost of *not* draining (owner re-issuing the same
corrections every consolidation) is the standing falsification of the
pre-ratification posture.

## Notes

This PDR was authored under its own policy — best-effort, no owner
pre-ratification — in a dedicated consolidation session (Wisteria spins Bark,
2026-06-18), as the graduation of the `PG-best-effort-consolidation-policy`
register item (owner-stated 2026-06-18, Asteroid calls Meridian). PDR-103 records
that it too was authored under this policy; this PDR generalises the policy beyond
that one instance.
