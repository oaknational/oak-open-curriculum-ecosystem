# Lifecycle, change and conflict

The states a specification, its implementation and its evidence hold separately, the procedure a
change follows, and the order in which a conflict is resolved. Owned with `specify` (its revise
mode); `assess-specification` reads the same definitions when it judges a revision. Source: the
specification framework note, §10.

## Three separate states

A specification is proposed, adopted, deprecated or retired. An implementation conforms, or does not,
to a named revision. Evidence is absent, supporting, challenged or stale. These are distinctions, not
a prescribed enumeration; a project maps them to its own terms and keeps them apart. Updating a date
alone is not lifecycle maintenance.

## What a change alters

Every change is asked what it alters: syntax, meaning, behaviour, authority, evidence assumptions,
operations or human expectations. A backward-compatible shape can hide an incompatible meaning. A
timestamp or a semantic-version label identifies a change; neither establishes compatibility.

## The change procedure

1. Identify the changed claim and its authority; retain the previous revision.
2. Traverse the relevant dependency and reliance links to find the affected consumers, tests, views,
   operating procedures and evidence.
3. Classify compatibility in each relevant dimension and identify any migration or re-evaluation.
4. Record transition behaviour, coexistence, rollback, correction propagation and retirement
   conditions.
5. Verify the served or used result at the actual boundary and record which consumers have adopted it.

Where time matters, distinguish source event time, observation time, effective time and revision
time. An amendment can take effect after an observation without changing what happened. Revocation,
correction and deletion mean different things; retained lineage respects the applicable data policy
rather than becoming a reason to keep personal data indefinitely.

## Resolving a conflict, in order

1. Check whether the scope, the versions or the terms differ.
2. Correct a factual error.
3. Identify the actual governing authority and obligation.
4. Preserve an unresolved value conflict for that authority.

No universal rule says the higher-level document wins. An organisational aspiration cannot override
an applicable prohibition, and an implementation cannot redefine a requirement by existing.

## Homes and derivation

Schema, code, prose and generated views each have a named home. Mechanically derivable content is
generated and checked. Where interpretations differ legitimately, a crosswalk is preserved rather than
one representation claimed as the universal source of truth. One authoritative definition per concern
is compatible with distributed authority across domains.
