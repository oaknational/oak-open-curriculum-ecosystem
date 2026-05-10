# Consolidate at the Third Consumer

Operationalises the no-duplication principle in
[`principles.md`](../directives/principles.md),
[PDR-014 (Consolidation and Knowledge-Flow Discipline)](../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md),
and [PDR-045 (Workspace-First Investigation Discipline)](../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
§Move 2.

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

## See Also

[PDR-058 §Surface 2 (design optionality)](../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md)
governs *when to shape* (close-the-shape until a real second
instance forces decomposition); this rule governs *when to extract*
(third consumer triggers consolidation). The two compose: design-
optionality discipline keeps the shape closed up to the second
consumer; this rule extracts at the third.
