# Closed-Shape Design Optionality

Operationalises [PDR-058 §Surface 2 — Design Optionality](../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md).
PDR-058 decomposed the `stop-inventing-optionality` candidate into four
impact-named surfaces and deliberately left Surface 2 (design optionality) to
graduate as its own rule once it had its own evidence trail; this rule is that
graduation. It is the design-time sibling of
[`consolidate-at-third-consumer.md`](consolidate-at-third-consumer.md): that rule
governs *when to extract* a shared abstraction; this one governs *when to shape*
one at all.

When authoring or reviewing code or schema, author the **closed shape the known
instances need**. Do not add configurable, optional, or extensible surface to
admit an unknown future second instantiation you cannot name. Defer the
configurable shape until a real second instance forces the decomposition.

## Trigger

Fires at code and schema authoring and review time, whenever a surface is being
shaped to admit more than the cases currently in scope.

## Diagnostic

All three conditions hold:

1. A surface is being authored or reviewed.
2. The author or reviewer cannot name a concrete second instantiation in scope.
3. The surface is nonetheless being shaped to admit the unknown second
   instantiation.

When all three hold, the optionality is speculative — close the shape.

## The shapes this prevents

Drawn from PDR-058 §Surface 2's evidence cluster:

- `Record<string, unknown>` or index signatures on a schema whose key set is
  known and closed.
- `?` (optional) on a property whose call sites all supply a value, with no
  caller in foreseeable scope intending to omit it.
- Generic type parameters introduced "to support future extension" where every
  call site instantiates the same concrete type.
- Configuration flags toggling behaviour where one branch is the always-correct
  path and the other is speculative.
- Plugin, strategy, or adapter slots with one implementation and no concrete
  second one in scope.
- A graph node kind, variant, or wrapper type that exists to generalise a single
  corpus-wide instance (the 2026-06-04 EEF `guidance_report` case in the evidence
  trail below).

## Cure

Author the closed shape. Encode exactly the cases in scope, with the tightest
types that admit them and nothing more. The configurable or extensible surface
is deferred until a real second instance forces it — at which point
[`consolidate-at-third-consumer`](consolidate-at-third-consumer.md) governs the
extraction. Two is not three; speculative configurability is not consolidation.

## Why this is strict

The impact is concrete (PDR-058 §Surface 2): optional surface **erodes types**
(the closed shape's guarantees weaken to admit the optional case), **bakes in
fragility** (every downstream consumer must handle the optional case forever),
and **mints maintenance load** (every refactor must reason about a branch no real
caller exercises). The cost is paid forever; the speculative benefit usually
never arrives.

## Evidence trail

Two named instances established the graduation bar PDR-058 required of Surface 2:

1. The legacy-backlog design-optionality instances catalogued in PDR-058
   §Surface 2 (the original evidence cluster).
2. **2026-06-04, EEF decision B (Burnished Glowing Spark):** a `guidance_report`
   graph-node kind that deduplicated exactly one leaf corpus-wide (`{title, url}`,
   no body, no edges) and bought no first-version user value — yet it was the
   single biggest complexity driver (a heterogeneous `TNodeId`, a second id type,
   a second edge type). Inlining it (the closed shape the one instance needed)
   collapsed all of that. A concrete second named instance, with a cure.

## Related

- [PDR-058 §Surface 2](../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md)
  — the authority; this rule graduates Surface 2's cure.
- [`consolidate-at-third-consumer.md`](consolidate-at-third-consumer.md) — the
  extraction-time sibling: when to generalise, after a real second or third
  instance forces it.
- [`replace-dont-bridge.md`](replace-dont-bridge.md) — closing a speculative
  shape means replacing it, not bridging to it.
- [`apply-architectural-principles.md`](apply-architectural-principles.md) — the
  broader discipline of shaping for what is, not what might be.
