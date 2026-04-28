---
pdr_kind: governance
---

# PDR-025: Quality-Gate Dismissal Discipline

**Status**: Accepted
**Date**: 2026-04-19
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-008](PDR-008-canonical-quality-gate-naming.md)
(canonical gate names this PDR governs the discipline around);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(dismissing a gate failure is a smuggled drop at the quality-gate
layer; route as a finding instead);
[PDR-017](PDR-017-workaround-hygiene-and-fix-discipline.md)
(gate-failure suppressions are workarounds; the rationalisation
modes mirror PDR-017's);
[PDR-020](PDR-020-check-driven-development.md)
(complementary: PDR-020 governs which gate asserts the RED-phase
gap; this PDR governs what to do when any gate reports a failure).

## Context

Quality gates — type checkers, linters, test runners, dead-code
detectors, dependency-graph validators, format checks — report
failures continuously. Three recurring failure modes emerge when
the discipline around gate failures is loose:

1. **"Pre-existing" dismissal.** A gate failure is observed and
   attributed to prior work: "this was failing before my change."
   The framing converts the failure from a problem into a piece of
   background noise. Nobody is assigned to fix it; no lane tracks
   it; the failure persists. Future sessions repeat the
   observation, each attributing to the prior session. The failure
   becomes structural.

2. **"No new issues" rationalisation.** A commit, PR, or session
   close cites "I didn't introduce any new failures" as a quality
   argument. Strictly true; the argument is not doing the work it
   implies. The pre-existing failures remain, and the claim of
   discipline masks quality decay. Over many sessions, the "no new
   issues" frame turns into "the quality floor is wherever we last
   stopped looking."

3. **Selective-run CI exception-lists.** A CI config grows
   exception lists ("skip these files", "allow these warnings",
   "exclude this workspace") without documented lanes to remove
   the exceptions. Each exception is individually defensible;
   together they form a shadow quality gate that nobody reads.
   The visible gate is green; the actual gate is the exception
   list, invisible.

Underlying cause: local pressure always favours moving past a
failure. The cost of fixing is here and now; the cost of
dismissal is distributed across future sessions. Without explicit
discipline, the local cost always wins, and the failure mode is
slow quality decay that looks like normal operation.

## Decision

**Every gate failure is either fixed in the scope that surfaces
it, or tracked as a blocking item with a named owning lane, a
specific acceptance criterion, and a promotion trigger if the lane
is not immediately active. "Pre-existing" is a metadata tag, not a
dismissal. "No new issues" is not a quality argument. CI
exception-lists are tracked lanes with documented remediation
paths, not shadow gates.**

### Fix in scope, or name the lane

When a gate failure is observed:

1. **Fix in scope** — remediate within the current work if the
   cost is proportionate. Small fixes absorb cleanly; tracking
   overhead for a five-line fix is disproportionate.
2. **Name the lane** — if the fix is out-of-scope for the current
   work, route the failure to a named owning lane with:
   - A specific acceptance criterion (the gate command that must
     return clean).
   - An owner (person or role; "the next session" is not an owner).
   - A promotion trigger if the lane is not currently active (per
     PDR-012's findings-route-to-lane-or-rejection discipline and
     `nothing-unplanned-without-a-promotion-trigger.md`).

"Pre-existing" labels the failure's origin; it does not route it
anywhere. Every pre-existing failure gets a lane.

### "No new issues" is a diagnostic, not a closure

The question "does this change introduce new failures?" is a
legitimate diagnostic for scoping a fix. It is not a legitimate
closure argument for a PR, session, or merge. Closure requires
positive evidence that the gate surface is as clean as the decision
framework requires — which includes the decision about how to
handle pre-existing failures, which is the lane-tracking above.

Symptoms of the "no new issues" anti-pattern:

- PR descriptions or commit messages citing "no regressions" or
  "no new failures" without linking to a tracked remediation
  lane for the existing failures.
- Session-close summaries that report gate status as "same as
  before" without surfacing what "before" actually is.
- Session-handoff prompts carrying stale "known-failing gates"
  lists that have not been reviewed in multiple sessions.

### CI exception-lists are tracked lanes

Every CI exception (skipped file, allowed warning, excluded
workspace, warn-severity rule that should be error) has a
documented lane with:

- **Why** the exception exists (specific failure mode it masks).
- **When** it will be removed (acceptance criterion or promotion
  trigger).
- **Where** the lane lives (a plan, an ADR, a README section, or
  a PDR — any of these is fine; a comment in the config file
  alone is not).

Exceptions without documented lanes are shadow gates; they
compound over CI history and become irremovable by default.

## Rationale

**Why lane-tracking rather than immediate fix.** Fix-in-scope is
the first-preference path; lane-tracking is the fallback when the
fix is disproportionate. Both are legitimate; the combination
ensures no failure is left untracked.

**Why this is PDR-shaped, not ADR-shaped.** The adopter scope is
the Practice network, not a single host repo. Every repo that
runs quality gates faces these failure modes. Every hydrating
repo needs this discipline installed alongside the gate runner.
Per PDR-019's reusability test, cross-repo reusability ⇒ PDR.

**Why not "zero tolerance".** A pre-existing failure with a
named remediation lane is a managed debt, not a dismissal. The
discipline is about routing, not about instant perfection. A
repo that tolerates zero pre-existing failures is also a repo
that cannot absorb inherited code with existing defects — which
is unrealistic at any non-greenfield scale.

### Alternatives rejected

- **"Allow known-failing gates in CI as long as nothing new
  fails."** This is the anti-pattern described in §Context. It
  produces the exact decay mode the discipline exists to prevent.
- **"Track pre-existing failures only in code comments at the
  failure site."** Comments rot; they do not propagate to plans,
  reviewers, or session handoffs; lane-tracking is the portable
  form.
- **"Fail CI on any gate failure regardless of scope."** Too
  brittle for inherited-code situations; does not distinguish
  managed debt from unmanaged decay.

## Consequences

### Required

- Every observed gate failure routes to either in-scope fix or a
  named lane with acceptance + owner + trigger.
- CI exception-lists have documented lanes matched to each entry.
- "No new issues" appears in PR/session closure prose only when
  accompanied by the existing-failures lane reference.

### Forbidden

- "Pre-existing" as a closure reason for any open gate failure.
- "No new issues" as a standalone quality argument at PR, merge,
  or session closure.
- CI exception entries without a linked remediation lane.
- ESLint rules at `warn` severity for new zero-violation patterns
  (per `.agent/memory/active/patterns/warning-severity-is-off-severity.md`;
  `warn` is permitted as a migration mechanic with a named
  flip-to-error trigger, not as a default).

### Accepted cost

- Lane-tracking requires more authorship effort than dismissal.
  Justified by the prevention of silent quality decay. A repo
  with five managed-debt lanes is healthier than a repo with no
  lanes and fifty pre-existing failures.
- In-scope fixes sometimes grow the scope of the current work.
  Acceptable when the cost is proportionate; escalate to
  lane-tracking when it is not.

## Notes

### Host-local context (this repo only)

Proven application surfaces:

- Distilled entry (now pruned) — `"All gates blocking, no
  'pre-existing' exceptions"` — the instance form that graduated
  to this PDR.
- Pattern `.agent/memory/active/patterns/warning-severity-is-off-severity.md`
  — companion discipline on ESLint severity as a migration
  mechanic. PDR-025 §Forbidden restates the pattern's invariant.
- PDR-008 §Canonical Gate Naming defines the gate surface this
  PDR operates on. The `check`/`check:ci`/`check:fix` triplet is
  the gate the discipline gates against.

### Application boundary

This PDR governs **quality gates in the engineering sense** —
type-check, lint, test, dead-code, dependency-graph, format,
coverage, knip, depcruise, and similar. It does NOT govern:

- Product-observability gates (those are ADR-162's five-axis
  domain).
- Review-finding dispositions (those are PDR-012's domain).
- Workaround hygiene in code (that is PDR-017's domain).

Overlap at boundaries: a gate failure that is diagnosed as a
workaround-debt problem routes through PDR-017 after this PDR
routes it to a lane. A reviewer surfacing a gate-failure
dismissal routes through PDR-012 after this PDR routes the
underlying failure to a lane. The PDRs compose without replacing
each other.
