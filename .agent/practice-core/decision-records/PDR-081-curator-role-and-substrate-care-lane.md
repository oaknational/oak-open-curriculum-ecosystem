---
pdr_kind: governance
---

# PDR-081: Curator Role and Substrate-Care Lane

**Status**: Proposed
**Date**: 2026-05-24
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(surface classification for fitness-response routing);
[PDR-071](PDR-071-coordinator-allocates-without-gating.md)
(mode separation as a structural property);
[PDR-072](PDR-072-knowledge-curation-as-autonomic-learning.md)
(knowledge curation as autonomic learning; the principle this PDR
operationalises).

## Context

PDR-072 names knowledge curation as one of two real output-accounting
axes for a Practice-bearing repo: product surface and Practice
substrate surface. PDR-072 articulates the principle; it does not
name the role that operates the substrate-care lane day-to-day.

The practical effect of leaving the role unnamed is that substrate-care
work is invisible at team-formation time. Sessions form around feature
delivery; substrate-care work is taken on opportunistically when
fitness pressure crosses a threshold, when an owner directs it, or
when a consolidating-out agent has spare context at session close.
The recurring failure modes that result include:

- Graduation buffers grow past their envelope between drain passes
  because no agent self-selects into the substrate lane.
- Autonomic-curation defects (contamination of distillation buffers,
  drift in identity surfaces, adoption gaps on landed substrate)
  go undiscovered for long windows because no agent is reading the
  substrate as their primary surface.
- Cross-session patterns require cross-session vision to name and
  cure; an end-of-session consolidator does not have that vision.

The existing role taxonomy contains a closely-adjacent label —
`consolidator`, the session-bounded closeout-synthesis owner — that
covers one moment of the substrate-care work but not the lane shape.
Treating consolidation as the whole of substrate care collapses a
recurring lane into a single per-session ritual.

## Decision

Name the substrate-care lane's owner the **curator**.

The curator is the lane-shaped equivalent of the implementer: where
the implementer ships product-surface output, the curator ships
Practice-substrate output. The role is cross-session and lane-shaped,
not session-bounded; a curator pass is the unit of work, and a single
agent may run many curator passes across many sessions in the same
lane.

### Scope

A curator pass:

1. Surveys knowledge surfaces (active memory, operational memory,
   platform-specific per-user memory, plugin-managed capture
   buffers, comms event stream, in-repo platform plans).
2. Identifies durable knowledge ready to route (substance-stable,
   trigger-fired, owner-direction-cleared) and routes it to its
   permanent home.
3. Identifies home-gaps (mature substance with no obvious permanent
   home) and surfaces them as structural-cure proposals.
4. Identifies structural defects in the substrate (autonomic-curation
   failures, adoption gaps on landed substrate, classification
   confusions, drift) and surfaces them.
5. Drains graduation buffers; routes graduated substance to permanent
   homes; does not allow the buffer to accumulate records of what
   graduated or records of curation work (the buffer is buffer only).
6. Logs the pass in the per-pass curation log (metadata only).

### Authority

The curator MAY:

- Read every knowledge surface in the repo.
- Route durable knowledge to permanent homes (PDR / ADR / rule /
  pattern / directive / skill / canon surface) — through the normal
  owner-decision gates that govern principle-class changes; the
  curator does not bypass those gates.
- Maintain the per-pass curation log (metadata-only contract; see
  below).
- Surface home-gaps and structural defects as routing events.

The curator MUST NOT:

- Delete primary-source streams reserved for separate mining (e.g.
  comms event logs preserved for team-dynamics insight extraction).
  Substance is extracted; sources are preserved.
- Mutate plugin-managed buffers directly (the plugin owns lifecycle).
  Defects in those buffers are surfaced as structural-cure proposals
  to the plugin's contract, not patched in the buffer.
- Trim active-memory surfaces under fitness pressure. Knowledge
  preservation outranks fitness; the structural cure is graduation
  upward, not compression.
- Author principle-class changes (PDRs, ADRs, rules, governance
  documents) without owner approval. The curator surfaces the
  proposal; the owner ratifies.

### Boundary versus other roles

| Other role | Boundary against curator |
|---|---|
| `consolidator` | Session-bounded closeout-synthesis owner. Curator is cross-session. A consolidator may execute one moment of curator-class work at session close, but the lane is not theirs. |
| `implementer` | Ships product-surface output. Curator ships Practice-substrate output. The two are parallel lanes, not nested. |
| `reviewer` | GO/BLOCK on a bounded slice. Curator routes knowledge from drafts to permanent homes, does not gate slices. |
| `scout` | Explores next-slice for implementer. Curator explores substrate gaps and adoption signals. |
| `marshal` | Owns git/index/commit-window scarcity. Curator's commits move through the marshal lane like any other. |
| `controller` | Allocates and sequences work across the team. Curator is allocatable into a team route by the controller, like any other role. |

### Engagement triggers

A curator engages when any of:

1. The owner directly invokes the lane.
2. A session opens with a curator boundary in the team-start
   broadcast (the lane is one of the allocated responsibilities).
3. A graduation buffer crosses its critical fitness envelope.
4. A pending-graduations trigger condition fires (second-instance
   evidence, owner-direction cleared on a previously gated entry,
   etc.).
5. A landed substrate shows near-zero adoption after its observation
   window (adoption-gap signal).
6. After a substantive substrate-producing window (deep team
   sessions, multi-cycle pushes) where the active memory surfaces
   have absorbed substance worth routing.

### Per-pass log contract (metadata only)

Each curator pass writes one log file. The log file is **metadata
only**. It records the structural facts of the pass:

- pass identity (date, agent, platform, model, session id prefix)
- pass kind (e.g. due-drain, second-instance graduation,
  defect-surfacing, role-substrate-landing)
- surfaces surveyed (as a table with disposition pointers)
- knowledge routed (as a list of "concept → permanent home"
  pointers)
- owner decisions captured (name + verdict, no substance)
- findings surfaced (short title + pointer to the substantive home
  where the finding lives)
- carry-forward items for the next pass

The log file does **not** carry:

- the substance of any defect, observation, or insight surfaced
  during the pass (substance lives in active memory, comms events,
  or its permanent home)
- the substance of any concept being graduated (substance lives at
  the destination)
- duplicate copies of substance from anywhere else

This contract makes the log file a navigation index for the work
done by curators across the repo's history, not a parallel
substance store. Substance has exactly one permanent home; the log
points at it.

## Rationale

PDR-072 establishes that knowledge curation is output, not overhead.
A first-class output surface deserves a first-class role. The role
name `curator` matches the substantive work (active selection,
preservation, arrangement, exhibition to permanent homes) and matches
established usage in knowledge-engineering contexts.

The lane shape (cross-session, ongoing) is necessary because the
recurring failure modes named in Context require cross-session
vision. A session-bounded role (the existing `consolidator`) sees one
window; the curator sees the substrate's trajectory across windows
and can name patterns that no single session would expose.

The metadata-only log contract prevents the new log surface from
becoming the next buffer that needs a curator. Substance has one
permanent home; the log lists where each substance went. If a
substance does not yet have a home, the log records the home-gap as
a structural-cure proposal pointer, not the substance itself.

Rejected alternatives:

- **Rely on `consolidator` to cover substrate care**: collapses a
  cross-session lane into a per-session ritual; misses the patterns
  that only cross-session vision reveals.
- **Pure automation**: hooks can catch some write-time defects
  (e.g. contamination of distillation buffers) but cannot run the
  synthesis-and-routing work that turns observation into substrate.
  Automation is complementary to the curator, not substitutive.
- **Treat curation as a sub-mode of implementation**: collapses
  PDR-072's two-axis output accounting back into one; recreates the
  failure mode PDR-072 cured.
- **Log substance in the pass file**: re-creates a buffer the
  curator would then need to drain. The metadata-only contract is
  load-bearing.

## Cascade

This PDR names the role and the log contract. The host repo's
substrate implementation (where the per-pass log files live, what
filename convention they use, whether the workflow is a SKILL or a
directive, how the curator interacts with the host's quality-gate
machinery) is a separate concern. Adopting repos land their own
substrate; this PDR is the portable doctrine those substrates
implement.

This PDR is part of the same structural-property cluster as PDR-072:
PDR-072 names curation as autonomic-learning output; PDR-081 names
the role that owns the lane.

## Consequences

**Enables**:

- Team-start broadcasts can name a `curator` boundary as a
  first-class allocated responsibility, parallel to `implementer` or
  `reviewer`.
- Substrate-care work has a named lane that future agents
  self-select into, rather than depending on owner-direction or
  consolidator-coverage each time.
- Cross-session patterns (adoption gaps, accumulating buffer
  residue, recurring autonomic-curation defects) get cross-session
  vision applied to them.
- The per-pass log becomes a navigation index for substrate
  evolution: any reader can scan curator passes to see what work
  was done, what was routed where, what gaps remain.

**Costs**:

- Adopting repos must author or adopt the substrate (where the
  per-pass log lives, what the workflow looks like).
- The curator role adds another label to the team-start role list.
  Mitigation: the label is opt-in; teams that do not need
  substrate-care this session do not allocate the role.
- The metadata-only contract requires discipline. Mitigation: the
  contract is short and the reasons are recorded here; pass-file
  drift toward substance is a recurrent-failure-mode candidate
  worth a future check.

**Forbids**:

- Treating substrate-care as ad-hoc work that happens when context
  permits.
- Putting substance in the per-pass log file.
- Allowing the graduation buffer to accumulate records of curation
  work or records of what graduated.
- Deleting primary-source streams reserved for separate mining.

## Falsifiability

This PDR is falsified if any of:

- The curator role is named in team-start broadcasts but agents
  consistently do not engage the lane, suggesting the role's value
  proposition is not load-bearing.
- Curator passes accumulate without measurable change in the
  substrate's health signals (graduation buffer envelope, autonomic-
  curation defect rate, adoption gaps on landed substrate).
- The metadata-only contract is repeatedly violated, suggesting
  the contract shape is wrong for how agents actually do the work.
- The role's boundary versus `consolidator` proves indistinguishable
  in practice, suggesting one role suffices and this PDR collapsed
  back into PDR-072 plus existing taxonomy.
