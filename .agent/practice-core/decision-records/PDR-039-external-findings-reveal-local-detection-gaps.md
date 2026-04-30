---
pdr_kind: governance
---

# PDR-039: External-System Findings Reveal Local Detection Gaps

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — sibling PDR
addressing the authoring-time discipline; this PDR addresses the
response-time discipline);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — deferral honesty discipline;
external findings either close gaps in the current arc or are
explicitly deferred with named triggers);
[ADR-131](../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
(self-reinforcing improvement loop — external findings are inputs to
the loop, not just one-off bug reports).

## Context

External quality systems — SonarCloud, GitHub Copilot review, Cursor
Bugbot, GitHub Code Scanning, third-party security scanners,
deployment-platform warnings (Vercel, etc.) — sometimes catch issues
that the local quality gates did not. The traditional response is to
fix the issue. That is a fix; it is not a learning.

Empirical instance (2026-04-29 PR-90 closure on this repo): Cursor
Bugbot found a duplicate H2 heading in the rotated archive napkin
file. The fix was straightforward (rename one heading). The
investigation behind the fix surfaced that markdownlint MD024 was
globally disabled in `.markdownlint.json` — a stronger gap than the
single instance suggested. Phase 5 of PR-90 enabled MD024 with
`siblings_only: true`, which surfaced exactly three genuine
duplicates across the whole repo. The external finding was the
visible tip of a class-of-bug invisible locally.

The principle is recursively useful: applying the principle generates
its own meta-instances. Cursor Bugbot finding the duplicate heading
revealed the missing local rule; enabling the missing rule revealed
the additional duplicates; the same investigation pattern fires at
each layer.

## Decision

**When an external system catches an issue that the local quality
gates did not, the response MUST include a local-detection-gap
question: "could this class of bug have been caught locally? If
yes, by what method? Implement or raise with explicit
effort/risk/ROI." The fix and the gap question are equally
load-bearing — fixing without asking the gap question is half a
response.**

The discipline has three concrete moves:

1. **Triage the finding for class shape.** A single instance can
   represent a wider class. Ask: is this issue inherent to the
   change in this PR, or is it pre-existing and merely surfaced by
   external review? Pre-existing class-of-bug findings that the
   local gates miss are the highest-value signals.
2. **Decide implementation vs deferral.** If the local-detection
   surface is small (an existing-rule re-enable, a one-line
   schema-tightening, a missing lint rule that already exists in
   the ecosystem), close it inline. If the surface is larger (a
   custom validator, a new ESLint rule package, structural CI
   change), record a candidate with `effort/risk/ROI` columns and
   route via the Pending-Graduations Register or a follow-up plan.
3. **Apply recursively.** Each gap closed generates its own
   external-vs-local question for the next finding the gap surfaces
   (the MD024 instance: enabling the rule found two more duplicates
   that needed structural fixes). The principle terminates when no
   new findings emerge from the closed gap.

## Consequences

- **Local detection grows monotonically.** Every external finding
  either closes a local-detection gap or names the gap as a
  candidate. The local quality gates catch more over time.
- **External systems become inputs to the improvement loop.** Per
  ADR-131, the self-reinforcing loop consumes feedback from authoring,
  reviewing, and operating. This PDR adds an explicit edge for
  external-quality-system findings.
- **Cross-PR follow-up plans become routine.** Pre-existing findings
  surfaced by external review (independent of the current PR's
  scope) belong in follow-up plans, not inline fixes that smuggle
  scope. The fix-or-follow-up decision becomes a reviewer-discipline
  question.
- **Pairing with PDR-038.** External findings often reveal that a
  stated principle had no structural enforcement surface. The
  authoring-time discipline (PDR-038) and the response-time
  discipline (this PDR) work together: each external finding is a
  candidate to either author a missing rule (PDR-038) or accept the
  finding as a one-off if no structural surface is appropriate.

## Implementation Notes

Reviewer agents and pre-merge analysis should explicitly run the
local-detection-gap question for each external-system finding. The
pre-merge-analysis flow (see `docs/engineering/pre-merge-analysis.md`)
is the natural enforcement surface for the response-time discipline,
mirroring how `consolidate-docs §7a` is the surface for PDR-038's
authoring-time discipline.

The `effort/risk/ROI` columns for deferred candidates use the
Practice's standard sizing: effort in arc-fractions ("phase",
"day-arc", "session"), risk in {LOW, MEDIUM, HIGH} for
implementation impact, ROI as a one-line motivation comparing the
detection-gap class to the local-cost of closing it.

## Compliance Triggers

- An external system (SonarCloud, Copilot, Cursor Bugbot,
  Code Scanning, Vercel build warnings, deployment-platform
  signals) catches an issue not flagged locally.
- A reviewer agent reads a PR comment from an external review system;
  before approving the fix, the reviewer asks the gap question.
- A consolidation pass finds an external-system finding that was
  fixed inline without the gap question being asked — surface as a
  retroactive candidate.

## Worked Instance

PR-90 closure 2026-04-29: Cursor Bugbot finding (duplicate heading)
→ MD024 globally disabled discovered → rule re-enabled with
`siblings_only: true` → three additional duplicates surfaced and
fixed. Single external finding closed a class-of-bug gap.

## Amendment Log

None yet.
