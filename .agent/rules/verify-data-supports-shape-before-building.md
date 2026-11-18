---
classification: core
description: Before committing to the shape of a build (tool, feature, schema, migration, refactor), verify the data actually supports it — trace value end-to-end and fingerprint the corpus before building, not after.
---

# Verify the Data Supports the Shape Before Building

Operationalises the host's record that the data is the source of truth for
what can be built (jimcresswell.net: ADR-020, the entity model as the source
of truth for shared atoms; OCE: ADR-038, the compilation-time revolution) and
[PDR-085 (Definition of Delivery)](../practice-core/decision-records/PDR-085-definition-of-delivery.md)
— value reaches a beneficiary or it has not been delivered. It is the design-time
face of [`verify-dont-trust`](verify-dont-trust.md): a design premise is a claim
to test against the data before code is committed to it.

## Trigger

You are about to commit to the *shape* of a build — a tool, a feature, a schema,
a migration, or a refactor — on a premise about what the underlying data, corpus,
system, contract, or governing plan supports.

## Action

Before building or shaping, verify the data actually supports the intended shape.
Recurring faces:

- **Trace value end-to-end before designing a tool or feature.** Walk the user
  journey and the value it delivers hop by hop, and at each hop ask "does the data
  support this?" — not "can we build this tool?". A tool whose value depends on a
  join, field, or axis the data does not carry cannot deliver that value, however
  well it is built.
- **Fingerprint the data before deciding the shape of a fix or migration.** Run a
  cheap scan of the actual corpus to test the premise the fix rests on *before*
  code lands. A premise the data refutes is redirected at the source, not
  engineered around. Fingerprint the **source**, not a projection: in
  jimcresswell.net the ground truth is the entity model, and in OCE the in-repo
  bulk export of its curriculum data; rendered surfaces, generated corpora,
  JSON-LD and a PDF are projections that can flatten away structure the source
  carries. Check the source before declaring a relationship "must be sourced"
  / "deferred" / "not present".
- **Cite the governing assignment before adding a design surface.** Every
  contract, tool, resource, prompt, envelope field, or reviewer condition must
  cite the plan text, ADR, PDR, schema, or data fact that assigns that role. If
  the rationale has to be invented from generic ecosystem knowledge, strike the
  surface instead of justifying it.
- **Verify cardinality before treating a present key as identity.** A field
  present on every record is a content key, not automatically a unique node
  identity: check whether uniqueness is *guaranteed* by the source contract or
  merely observed in the current snapshot — observed-unique is the trap, since
  the model then corrupts silently on the rare multi-placement case. Separate
  entity identity (a stable, authoritative id) from placement or membership,
  which is a relationship/edge, never part of identity (worked instance from the
  lineage, 2026-06-04: an item placed in more than one container has no
  guaranteed identity in its slug; membership is an edge).

If the data, contract, or governing plan does not support the shape, the shape
is wrong — correct it at the data contract, governing plan, or design; do not
bridge the gap with optional fields, fallback handlers, glue, crosswalks, or a
parallel structure ([`replace-dont-bridge`](replace-dont-bridge.md)). A refuted
premise that the owner had approved is re-surfaced for owner re-decision
([`owner-attention-at-action-moments`](owner-attention-at-action-moments.md)),
not silently reshaped.

## Failure mode this prevents

In OCE (2026-06), a tool family keyed on an axis its corpus did
not carry; months of data-shape engineering went into a join the data never
supported. A separate migration plan rested on a premise a cheap corpus
fingerprint refuted before any code landed. Both are the same failure:
committing to a shape on an unverified data premise. The check is cheap; the
rebuild is not. A third instance justified a design surface by an invented host
class the governing plan had already assigned elsewhere; the correction was to
delete the surface, not to add optional fields or bridges around the fabricated
premise.

A fourth instance (JC.net, 2026-09-13): a curator-passes README was imported
because a report listed the directory as a register the curation loop writes to;
the writer's own doctrine (PDR-081 and the curator-pass skill) says the loop
writes no such register, and the directory was history OCE kept. Before creating
a surface because a document says something writes to it, read the writer: a
report's inventory is a projection, and only the writer's contract is the
source.
