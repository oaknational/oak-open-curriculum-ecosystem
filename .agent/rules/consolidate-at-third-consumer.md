# Consolidate at the Third Consumer

Operationalises the no-duplication principle in
[`principles.md`](../directives/principles.md) and
[PDR-014 (Consolidation and Knowledge-Flow Discipline)](../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md).

Two consumers may justify local duplication while a shape is still proving
itself. The third consumer makes the duplication load-bearing and forces a
canonical owner.

When adding a third consumer of a type, contract, parser, policy, rule,
or workflow shape:

1. Stop and identify the canonical owner.
2. Move the shared shape to that owner, or route the work to a named
   consolidation lane before landing.
3. Do not add a third copy with a note to reconcile later.

The pressure signal is not "this feels reusable"; it is "the next caller
would make three places that must evolve together."
