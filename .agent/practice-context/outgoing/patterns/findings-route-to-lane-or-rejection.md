# Findings Route to a Lane or a Rejection

**Type**: Transferable Pattern
**Origin**: oak-open-curriculum-ecosystem (2026-04-17)
**Related**: `reviewer-gateway-operations.md`, `production-reviewer-scaling.md`, `assumption-auditing-meta-level-capability.md`

## Summary

Reviewer findings must be ACTIONED, TO-ACTION (with named owning lane +
specific edit), or explicitly REJECTED (with written rationale). No
"deferred as a follow-up" without a named home. "Deferred without a
lane" is a smuggled drop and surfaces recurring structural gaps when
disallowed.

## Problem

Large reviewer rosters return 20+ findings per session close. The
implementer is tempted to triage a subset as "high priority actioned"
and bundle the rest as "deferred as low-priority follow-ups." Parked
findings without a named owning lane + specific acceptance edit
accumulate silently. No future session has a cue to action them; the
deferral is functionally a drop.

## Key Moves

### 1. A full findings register, not a triage summary

After a reviewer matrix runs, build a register that accounts for
**every** finding. Each entry carries:

1. Source reviewer + verbatim finding.
2. Status = `ACTIONED` | `TO-ACTION (lane X: <specific edit>)` | `REJECTED (rationale)`.
3. If `ACTIONED`: the exact edit location in the plan / code / ADR.
4. If `TO-ACTION`: the lane that absorbs it + the acceptance criterion.
5. If `REJECTED`: a written rationale naming the principle being upheld.

### 2. No fourth outcome

"Deferred," "follow-up TBD," "nice-to-have" are not outcomes — they are
smuggled drops. When a finding has nowhere to land, that is itself a
finding: the plan is missing a lane, or the finding should be rejected
with a written rationale. Both are legitimate. "Parked without a home"
is not.

### 3. The register survives the session

The register lives in the executable plan (or equivalent durable
artefact), not in chat or a session-only note. Future sessions verify
that TO-ACTION items landed in their named lanes by reading the
register against commits.

## What This Unlocks

- Structural gaps surface: a finding that cannot be routed signals a
  missing lane, a missing acceptance criterion, or a principle conflict
  worth naming explicitly.
- The session close is falsifiable: a future session can grep the
  register and check whether each TO-ACTION item was absorbed where
  scheduled.
- Procedural inversions come to light. When "ADR Open Questions
  resolved in plan prose" or "tautological test that cannot fail" are
  identified as findings that need a lane, the routing exercise
  reveals they need an ADR amendment or a different enforcement
  mechanism — not a silent park.

## Evidence

Origin session: close-of-session reviewer matrix produced 29 findings
across six reviewers. Initial register split into 7 "actioned
in-situ" and 7 "deferred as future-lane follow-ups (low-priority
improvements)." Owner correction: "plan to address all of them unless
they are explicitly rejected as incorrect, update the current plan
with all of them, nothing is deferred." Register rewritten as 18
ACTIONED, 11 TO-ACTION (each with owning lane and specific edit), 0
REJECTED. The rewrite surfaced two procedural issues (ADR Open
Questions closed only in plan prose; a test-file
`BYPASS_CANDIDATES` tautological assertion) that the "deferred"
framing had hidden.

Prior instance in the same repo: the existing rule "separate in-scope
from pre-existing issues; fix in-scope, track pre-existing as gated
follow-up" is the same principle applied to scope rather than to
findings. "Track as gated follow-up" is a legitimate home; "deferred
without a gate" is not.

## Adoption

For receiving repos:

1. At reviewer-matrix close, refuse to write a "deferred" block
   without a named lane + specific edit.
2. When tempted to defer, ask: "does this finding have a lane? does
   that lane have an acceptance criterion that would absorb this edit?
   if not, what lane should exist?"
3. If a finding truly belongs rejected, write the rationale. "Low
   priority" is not a rationale; "upholds principle X because Y" is.

Scales with reviewer roster size — cheap for small rosters, load-
bearing for large ones.
