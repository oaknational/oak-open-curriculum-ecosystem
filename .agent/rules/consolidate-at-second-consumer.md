# Consolidate at the Second Consumer

Operationalises the no-duplication principle in
[`principles.md`](../directives/principles.md),
[PDR-014 (Consolidation and Knowledge-Flow Discipline)](../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md),
and [PDR-045 (Workspace-First Investigation Discipline)](../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
§Move 2.

One consumer may justify a local, self-contained shape while it is still proving
itself. The **second** consumer makes the duplication load-bearing and forces a
canonical owner: two copies of a shape that must evolve together is one too many.
For security-critical shapes (validators, auth, path/IO guards) the second
consumer is the floor, not a soft signal — divergence between copies is a defect
waiting to happen, and a required quality gate (e.g. duplication density) will
refuse it.

When adding a second consumer of a type, contract, parser, policy, rule,
or workflow shape:

1. Stop and identify the canonical owner.
2. Move the shared shape to that owner — extract a shared package or module — or
   route the work to a named consolidation lane before landing.
3. Do not add a second copy with a note to reconcile later.

The pressure signal is not "this feels reusable"; it is "the next caller
would make two places that must evolve together."

**Reclassification is the event.** When the extraction moves code into a
library, the move itself changes the code's obligations independent of any
code change: byte-identical code acquires a library threat model (exported
params become untrusted input to CodeQL's library rules), a stricter lint
tier (e.g. no-ambient-process), and contract obligations to every caller
shape. Plan the cures for the reclassification when consolidating, not
just the move (worked instance 2026-08-09: the fidelity-review extraction
fired both classes on unchanged code).

## See Also

[PDR-058 §Surface 2 (design optionality)](../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md)
governs *when to shape* (close-the-shape until a real second instance forces
decomposition); this rule governs *when to extract* (the second consumer triggers
consolidation). The two compose at the same point: the second consumer both forces
the shape's decomposition and extracts it to a canonical owner — a shape is not
carried as two copies past its second consumer.
