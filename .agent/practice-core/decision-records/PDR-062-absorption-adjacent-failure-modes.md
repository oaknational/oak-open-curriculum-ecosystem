---
pdr_kind: pattern
---

# PDR-062: Absorption-Adjacent Failure Modes

**Status**: Accepted
**Date**: 2026-05-21
**Related**:
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(review-finding disposition);
[PDR-015](PDR-015-reviewer-authority-and-dispatch.md)
(reviewer authority);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(landing and closeout discipline);
[PDR-048](PDR-048-insight-capture-at-moment-of-occurrence.md)
(capture before closure).

## Context

Review findings and completed-work reviews create a high-pressure
moment: the agent must dispose evidence without losing the shape of the
evidence. Three adjacent failure modes recur around that moment.

The first produces **less** than the reviewer or evidence named:
closure pressure rationalises unabsorbed findings as deliberate
deferral. The second produces **more** than the reviewer named:
absorption expands into adjacent edits and quietly changes surfaces the
finding did not request. The third reopens a completed disposition as
if it were a new decision, spending attention on a settled call instead
of extracting lessons or fixing defects.

They are one family because the same boundary is being lost: the agent
is no longer preserving the exact contour of the disposition.

## Decision

Reviewer-finding and completed-work dispositions preserve the exact
contour of the evidence. Every finding or retrospective observation is
classified as one of:

- **Absorb**: implement exactly the finding, or fix the defect the
  review exposed.
- **Re-argue**: provide a reasoned contrary verdict with evidence.
- **Escalate**: surface a genuine owner-owned or unresolved decision.

"Defer by agent choice" is not a fourth disposition. "Absorb nearby
extra changes" is not absorption. "Ask the owner to re-decide a
settled call" is not a completed-work review.

## The Three Failure Modes

### Less: Closure-Pressure Rationalisation

The agent absorbs fewer findings than the evidence warrants, then
reconstructs the omission as a deliberate deferral. The diagnostic is a
closeout or continuity record that reports fewer disposed items than
the reviewer or evidence actually named.

The cure is an explicit disposition table: every finding is absorbed,
re-argued, or escalated, with evidence. If the agent notices the urge
to call a missed item "deferred", the correct move is to dispose it,
not narrate the miss.

### More: Over-Correction During Absorption

The agent absorbs a finding and also changes an adjacent symbol,
contract, or behaviour the finding did not name. The diagnostic is a
diff that touches more named concepts than the review recommendation
specified.

The cure is contour-preserving absorption. When the correct recovery is
to revert the extra change, that revert is itself absorption of the
original finding. It is not re-argument.

### Re-Litigate: Completed-Work Review as Re-Decision

The agent reviews completed work, identifies a lesson, then asks the
owner whether to keep or undo a settled call without new evidence. The
diagnostic is a backward-looking review that ends in a multiple-choice
question about a decision already made and landed.

The cure is to separate two legitimate outputs: lessons for future
decisions, and defects to fix now. Re-deciding a settled call is not a
third output class.

## Consequences

### Required

- Reviewer-finding closeout names every finding and gives it one of
  absorb, re-argue, or escalate.
- Absorption diffs stay within the named contour of the finding.
- Completed-work reviews output lessons and fixes, not re-decision
  menus.

### Forbidden

- Reporting fewer disposed findings than the reviewer named.
- Recasting a missed finding as a tactical deferral without
  re-arguing or escalating it.
- Expanding an absorption into adjacent changes the reviewer did not
  request.
- Asking the owner to re-decide a completed call when the review has
  not produced new owner-owned information.

### Accepted Cost

Contour-preserving disposition can feel slower than narrative closeout.
The extra precision is the point: it prevents quality findings from
being lost, inflated, or re-litigated under closure pressure.
