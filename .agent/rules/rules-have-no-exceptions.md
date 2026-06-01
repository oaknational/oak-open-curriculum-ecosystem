# Rules Have No Exceptions

Operationalises [`principles.md` §Strict and Complete](../directives/principles.md#strict-and-complete).

A rule states what to do, and it holds in every case it governs. The point of
a rule is that one statement is strong enough that nothing has to escape it.

When a case appears that the rule seems not to fit, read it as evidence about
the rule. Improve the rule until its single statement covers the case
correctly — sharpen the principle, state its domain more precisely, or
re-express it so the case falls inside it. The repaired rule is whole again,
and every later reader inherits the fix.

An exception does the reverse. It freezes the misfit into the rule and states
the rule by where it stops holding, so a rule with an exception has stopped
being improved. It also carries the shape
[`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md) warns
against — a live instruction defined by what it is not. An exception is a
tombstone for the case the author could not yet fit.

## When a case seems not to fit

1. Read the misfit as evidence the rule is incomplete.
2. Make the smallest change to the rule's statement or its stated domain that
   makes the case fall inside it correctly.
3. If two real cases demand genuinely opposite behaviour, the rule is
   conflating two principles — split it into two rules, each whole on its own.
4. A case you cannot yet resolve is surfaced for an owner doctrine decision,
   never parked inside the rule as a carve-out.

## Why this is strict

Exceptions accrete. Each one is a small licence to stop thinking, and the next
author reads the carve-out as permission to add their own. A rule that holds
everywhere stays sharp and stays trusted; a rule riddled with exceptions
becomes advisory, and an advisory rule is no rule. Fixing the statement is more
work once; an exception is less work paid for forever.

## Related

- [`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md) — an
  exception states a rule by what it is not; the same negation pattern, at the
  level of rule-authoring.
- [`new-rule-vs-pdr-clause`](new-rule-vs-pdr-clause.md) — whether an improvement
  belongs in a rule or a PDR clause.
