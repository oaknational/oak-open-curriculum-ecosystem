---
name: "ADR by Reusability, Not Diff Size"
use_this_when: "closing a small implementation lane and deciding whether the decision it encoded deserves to be promoted to an ADR"
category: process
proven_in: ".agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md (hygiene closure, 2026-04-17)"
proven_date: 2026-04-17
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Scoping ADR-worthiness by size of the originating diff, so that pattern-establishing lanes leave their decision implicit and force the next adopter to re-derive it"
  stable: true
---

# ADR by Reusability, Not Diff Size

## Pattern

At the closure of a small implementation lane, decide whether to
promote its decision to an ADR by answering the **reusability**
question, not the **size** question:

> Will the next workspace or lane adopting this vendor / tool / pattern
> need to re-derive the same decision I just made?

If yes, write the ADR even if the originating diff is tiny. The lane is
small precisely because the pattern is clean, and that is exactly when
an ADR captures the most value with the least writing.

## Anti-pattern

Scoping ADR-worthiness by the size of the originating diff: "this was
a one-config-file follow-up, an ADR feels disproportionate."

The decision survives the diff. A future adopter reading the lane
months later will see `config.rc + one shell script + one devDep` and
have no load-bearing surface to deviate from — or worse, to **detect a
deviation** during review. Leaving pattern-establishing lanes
implicit in code is the silent-disagreement-later failure mode.

## Resolution

At lane closure, before filing the commit:

1. Name the decision the lane encoded in one sentence.
2. Ask: who else will encounter this decision, and how soon?
   - Zero other adopters expected → no ADR; a README section or
     operations doc is enough.
   - One concrete future adopter already on the plan → ADR is
     cheap insurance; write it now.
   - Reviewer findings cluster around *"where is this documented
     canonically?"* → strong ADR-worthy signal, write it.
3. Size of the ADR should match the decision, not the diff. A
   pattern-establishing ADR can be 60 lines if the decision is
   clean; a rationale-heavy one can be 300. Both are valid.

## Evidence

**Session 2026-04-17** — the Sentry CLI hygiene lane started as a
narrow follow-up (one devDep, one config file, one script rewrite).
Reviewer feedback reframed it: the per-workspace CLI ownership
pattern it applied is exactly the shape the planned Clerk CLI
adoption will take, and any subsequent vendor CLI after that.
Promoting to [ADR-159](../../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
made the decision discoverable, linked it back through ADR-143 /
ADR-010 / ADR-154, and unblocked the Clerk adoption plan from
citing a concrete authority. The ADR itself is ~200 lines — larger
than the originating diff but cheap against the expected re-use.
