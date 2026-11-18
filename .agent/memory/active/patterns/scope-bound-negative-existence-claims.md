---
name: Scope-Bound Negative-Existence Claims
polarity: anti-pattern
use_this_when: About to accept a "does not exist" / "nothing to update" / "no matches" verdict — from your own search, a peer's search, or a reviewer's clearance — before treating the absence as settled, check what scope the verdict actually swept
category: process
layer: general
proven_in: .agent/memory/active/napkin.md (two instances, 2026-07-08 and 2026-07-14)
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating a negative-existence claim (search found nothing / reviewer found nothing to update) as proof of absence, when the claim actually only proves absence within whatever scope the searcher or reviewer happened to sweep"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not
> a shape to repeat. Recognising the scope-bound shape of a negative claim is
> the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

A claim of the form "X does not exist" or "nothing here needs updating" is
never a fact about the whole repository — it is a fact about whatever scope
the searcher, subagent, or reviewer actually swept. The claim's confident
phrasing hides its scope silently; a reader (including the agent who made the
claim, minutes later) treats it as unconditional. The failure recurs at two
different altitudes with the same shape:

1. **Search-scope altitude.** An agent searches a subset of the plausible
   home directories for a term, finds nothing, and reports "does not exist" —
   when the term lives in a different plausible home the search never swept.
2. **Reviewer-scope altitude.** A specialist reviewer inspects a file against
   their own mental model of what needs checking, clears it ("nothing to
   update"), and that clearance is later treated as proof the file has no
   issues at all — when the reviewer's own search scope, not the file's
   actual state, is what the clearance measured.

Both instances share the same warrant gap: **a negative verdict inherits the
verdict-giver's search scope**, and that scope is never stated as part of the
verdict, so downstream readers cannot tell a scope-bounded "not found here"
from an unconditional "does not exist anywhere."

## Worked Instances

**2026-07-08 (Corsair guards Channel, search-scope altitude).** Searched only
`patterns/` for `standby-runway-handoff`, concluded "does not exist", then
widened and found it in `memory/collaboration/`. In the same session, three
of four quorum-review seats independently made the identical scoped miss and
reported it as an over-rejection finding — a convergent FALSE finding,
refuted only by widening the search and citing the actual location. Lesson:
convergence across independent reviewers does not waive verification
(`verify-dont-trust` §convergence); and a review brief should name every
plausible home explicitly (`patterns/` AND `memory/collaboration/`) so
downstream seats do not silently inherit the primary's search scope.

**2026-07-14 (Foxglove seeks Petal, reviewer-scope altitude).** A
docs-adr-expert review explicitly cleared `consolidate-docs.md` ("e.g./etc.,
no update owed"). A later Copilot review round on the same file found two
explicit operational enumerations that did need updating. The reviewer's
negative verdict was correct *within the scope the reviewer actually
checked* — it was never a claim that no enumeration anywhere in the file
needed attention.

## Countermeasure

A clearance of absence (a search result, a reviewer's "nothing to update") is
**evidence within its own stated scope**, never a substitute for a mechanical
class sweep. Two composing moves:

1. **State the scope of a negative claim explicitly** when making one —
   "no matches in `patterns/`" is a different, weaker claim than "does not
   exist"; say which one you mean.
2. **Compose a scoped clearance with a mechanical sweep**, never let it stand
   alone as the final word — if the underlying question is "does this term /
   enumeration / defect exist anywhere in the artefact", run the mechanical
   check (a grep across every plausible home, a full enumeration re-read)
   rather than trusting a single reviewer's or searcher's scope.

## Composition

This pattern composes with
[`verify-dont-trust`](../../../rules/verify-dont-trust.md) — convergence
across independent verifiers does not waive verification, and a convergent
negative finding can still be a convergent scope-bounded miss, not a
convergent truth.
