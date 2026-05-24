# Mid-Cycle Handoff Records

This directory holds one JSON file per mid-cycle handoff record produced
under the mid-cycle retirement protocol. The protocol fires only when a
token-bounded agent must retire before the natural boundary they were
working toward; natural-boundary closeouts continue to use the existing
`start-right-team` SKILL §Closeout Contract unchanged.

The genotype (portable principle) is
[`../../../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md`](../../../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md).
The phenotype (this repo's substrate) is
[`../../../../docs/architecture/architectural-decisions/182-mid-cycle-handoff-record-substrate.md`](../../../../docs/architecture/architectural-decisions/182-mid-cycle-handoff-record-substrate.md).

## File convention

- One JSON file per active claim, content-addressed by the claim's
  `claim_id` (UUID v4): `<claim_id>.json`.
- A claim that retires twice in succession writes a versioned successor
  filename `<claim_id>.<n>.json` (n starting at 2 for the second
  retirement, 3 for the third, and so on) per ADR-182. Records are
  append-only: corrections write a new versioned successor rather than
  mutating an already-written record.
- The owning claim's `handoff_record_path` pointer in
  `../active-claims.json` updates to the latest version.

## Schema status

Until Tranche 2 of ADR-182 lands, the record shape is governed by
PDR-063 §Step 2's four named sections — **current edit state**,
**in-flight reasoning**, **decisions made**, **decisions deferred** —
and is validated by readers against that shape only, with no strict
JSON schema in place. Tranche 2 will land
`../handoff-record.schema.json` and a worked `EXAMPLE.json` reference
record drawn from the first observed instance per ADR-182 §"Landing
tranche".

## Active-claims pointer

Claims in `../active-claims.json` whose `handoff_record_path` field is
populated are mid-cycle and carry a handoff record at the referenced
path. Absent value signals normal active-claim semantics. The field is
optional and additive per ADR-182 + PDR-049 + PDR-050; readers that do
not understand it ignore it.
