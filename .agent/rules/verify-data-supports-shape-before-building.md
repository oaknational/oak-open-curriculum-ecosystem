# Verify the Data Supports the Shape Before Building

Operationalises [ADR-038 (Compilation-Time Revolution)](../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md)
— the data is the source of truth for what can be built — and
[PDR-085 (Definition of Delivery)](../practice-core/decision-records/PDR-085-definition-of-delivery.md)
— value reaches a beneficiary or it has not been delivered. It is the design-time
face of [`verify-dont-trust`](verify-dont-trust.md): a design premise is a claim
to test against the data before code is committed to it.

## Trigger

You are about to commit to the *shape* of a build — a tool, a feature, a schema,
a migration, or a refactor — on a premise about what the underlying data, corpus,
or system supports.

## Action

Before building or shaping, verify the data actually supports the intended shape.
Two recurring faces:

- **Trace value end-to-end before designing a tool or feature.** Walk the user
  journey and the value it delivers hop by hop, and at each hop ask "does the data
  support this?" — not "can we build this tool?". A tool whose value depends on a
  join, field, or axis the data does not carry cannot deliver that value, however
  well it is built.
- **Fingerprint the data before deciding the shape of a fix or migration.** Run a
  cheap scan of the actual corpus to test the premise the fix rests on *before*
  code lands. A premise the data refutes is redirected at the source, not
  engineered around.

If the data does not support the shape, the shape is wrong — correct it at the
data contract or the design; do not bridge the gap with glue, crosswalks, or a
parallel structure ([`replace-dont-bridge`](replace-dont-bridge.md)). A refuted
premise that the owner had approved is re-surfaced for owner re-decision
([`owner-attention-at-action-moments`](owner-attention-at-action-moments.md)),
not silently reshaped.

## Failure mode this prevents

The EEF tools as first envisioned keyed on a curriculum subject/topic axis the
EEF corpus does not carry; months of data-shape engineering went into a join the
data never supported — the data-shape work was the tail wagging the dog. A
separate migration plan rested on a data premise a cheap corpus fingerprint
refuted before any code landed. Both are the same failure: committing to a shape
on an unverified data premise. The check is cheap; the rebuild is not.
