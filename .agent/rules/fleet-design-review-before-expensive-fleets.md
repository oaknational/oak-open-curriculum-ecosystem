# Fleet design review before expensive fleets

Owner-directed standing practice (2026-08-11): any potentially expensive
fleet — as a working line, one that would exceed the session's default
workflow size guideline, or whose estimated spend crosses ~500k tokens —
has its DESIGN reviewed by a smaller fleet before the owner prices it,
and the design review's verdicts travel with the plan to the
ratification ask.

## Why (the measured instance)

The first use of this practice paid for itself before it was a rule. The
PR #846 review-fleet plan (2026-08-10, `pr-846-review-fleet`) was
reviewed by a five-leg fleet (~384k tokens, ~7 minutes) ahead of an
estimated 1.5–4.8M-token run, and returned 5/5 *revise* with two
severity-4 design defects, either of which would have wasted or
corrupted the whole spend:

- **The wrong object**: the dispatched diff range (`main...branch`)
  resolved against a stale local `main` to ~906 files instead of the
  PR's ~41 — every leg would have reviewed a 22× contaminated object.
  All five legs caught it independently.
- **Structural false confidence**: refute-by-default empirical
  verification would have systematically killed judgement-class
  findings (frame, doctrine, architecture) and hard-to-reproduce
  browser findings, then reported their absence as verified soundness.

Neither defect was visible to the plan's author — both live in the gap
between the plan's words and the execution environment, which is
exactly where independent eyes are cheapest.

## The practice

1. **Compose the review fleet small and adversarial**: 3–6 legs chosen
   by substance — always `assumptions-expert` (proportionality,
   agent-count warrant) and a frame-challenger; add adversarial
   architecture, test-methodology, and script-mechanics lenses as the
   design's shape demands. Reviewers get the plan file AND first-hand
   access to the execution environment, with the instruction to VERIFY
   the plan's factual claims there (ranges, ports, paths, tool names)
   — the wrong-object class is caught only by resolving the plan's
   words against the real environment.
2. **Adjudicate and revise in place**: every severity-3+ finding cured
   or refuted with evidence; the revision carries a dated note naming
   what changed.
3. **Present with the verdicts attached**: the owner's pricing decision
   sees the review's findings, the cures, and the reviewed cost
   estimate together.

Cheap fleets (a handful of legs, well-trodden shape) do not need this
ceremony — the rule binds where the spend makes a design defect
expensive.
