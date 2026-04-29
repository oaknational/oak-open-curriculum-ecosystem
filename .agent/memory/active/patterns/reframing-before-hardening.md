---
name: Reframing Before Hardening
category: process
status: provisional
discovered: 2026-04-29
proven_in: "Experience-audit cross-session scan. ≥4 instances: 2026-04-25-jazzy-from-locks-to-knowledge (Wilma's findings dissolved under owner-directed reframe from enforcement to advisory; explicit candidate naming), 2026-04-23-three-reviewers-collapse-an-ambitious-plan (Barney's ABANDON-REFACTOR was the reframe not the absorption), 2026-04-24-pippin-the-spiral-i-could-not-see (failure mode: hardening-before-reframing produces inflation spiral), 2026-04-18-seam-definition-precedes-migration (mid-bash-loop interrupt: boundary axis was wrong, reframing before file-moves)."
related_pdr: PDR-015
---

# Reframing Before Hardening

When a reviewer's findings land BLOCKING, the first move is to ask
whether the central design claim is the right claim. If no,
**reframing dissolves the findings rather than absorbing them**.
Hardening-before-reframing produces an inflation spiral: each
absorbed finding adds complexity without addressing the wrong frame.

## The Anti-Pattern (Hardening Without Reframing)

A blocking review surfaces 6+ findings. The agent absorbs them one
by one:

1. Finding 1 → patch.
2. Finding 2 → patch.
3. Findings 3-6 → patches that interact with the prior patches.
4. Code complexity grows; the central claim is unchanged.
5. A new round of review surfaces 4+ NEW findings emerging from the
   patches.
6. Repeat.

The spiral has two properties: (a) each absorption locally feels like
progress, (b) the central design claim is never re-examined. The
review's substantive signal — *the frame is wrong* — is dissolved
into N tactical fixes that preserve the wrong frame.

## The Pattern

When a review lands BLOCKING with substantive findings:

1. **Pause before absorption.** The reviewer's findings are evidence
   about the design, not just defects to patch.
2. **Ask the reframe question.** Is the central design claim — the
   thing every finding is in service of — the right claim? Concrete
   prompts: "What does the reviewer's set of findings, taken
   together, suggest about the *frame*?" "If I had no commitments,
   would I design this the same way?"
3. **If the reframe applies, the findings dissolve.** A different
   design — advisory not enforcing; knowledge not locks; seams
   defined before migration — makes the findings moot rather than
   resolved.
4. **If the frame is right, hardening proceeds.** Absorb findings
   one by one, with the awareness that each absorption is structural,
   not tactical.

## When Reframing Applies

Reframing dissolves findings when:

- Multiple findings cluster around the same axis (all about
  enforcement strictness; all about boundary placement; all about
  who owns a responsibility).
- The findings invoke principles the design was supposed to embody
  but doesn't (e.g. "knowledge and communication, not mechanical
  refusals" — if review keeps surfacing refusal-shape problems, the
  design's enforcement frame is the issue).
- A single owner-direction reframe makes 5+ findings irrelevant.
- The reviewer's findings include framing-shaped notes ("this whole
  approach assumes X; what if X is wrong?").

Reframing does NOT apply when:

- Findings are tactical/local (one type, one boundary, one missed
  case).
- The frame is owner-validated and stable.
- Findings would persist under any frame the work could take.

## Cross-References

- PDR-015 (reviewer authority and dispatch) — sibling doctrine
  about reviewer findings as evidence not theatre. The 2026-04-29
  amendment about briefing reviewers with full merge-gate scope
  pairs with this pattern: the reframe question and the
  scope-equals-prompted-scope question both interrogate what the
  reviewer was actually asked.
- Sibling pattern:
  [`scope-as-goal.md`](scope-as-goal.md) — reframing of the work-
  list relationship to the goal; same instinct at a different
  surface.
- Sibling pattern:
  [`tool-error-as-question.md`](tool-error-as-question.md) — the
  meta-pattern. Findings are questions about state; absorption-
  without-reframing is the "find a way past" response at the review
  surface.

## Owner Direction

When the owner is the one offering the reframe ("from enforcement
to advisory", "from locks to knowledge"), the reframe is
authoritative — proceed with the reframe and let the reviewer's
findings dissolve. The reviewer's role is evidence, not veto.
