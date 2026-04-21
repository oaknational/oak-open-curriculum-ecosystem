# Executive-Memory Drift Capture

When a session observation surfaces drift, incompleteness, or a learning
*about* a file in `.agent/memory/executive/` (the stable catalogue plane —
artefact inventory, reviewer catalogues, adapter matrices, surface
matrices), capture the observation with a `Source plane: executive` tag in
the napkin so it routes through the executive-memory feedback loop defined
in
[PDR-028](../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md).

This rule operationalises the **`active → executive` cross-plane path**:
executive-memory surfaces drift silently by default because they are
catalogues, not learning loops — there is no capture edge inside executive
memory itself. The active-plane napkin IS the capture edge; a plane-origin
tag routes the observation back into the executive surface via consolidation.

## What counts as executive-memory drift

- A reviewer catalogue entry that no longer matches the reviewer's current
  scope (e.g. the reviewer's persona evolved during a session).
- An artefact-inventory row that names an artefact type no longer used, or
  fails to name a new one.
- A surface matrix (cross-platform agent surface) that misses a platform
  introduced between consolidations.
- A canonical path that moved (e.g. the observability thread's legacy
  singular path → `threads/` migration).
- Any stable-catalogue claim contradicted by session evidence.

## How to capture

In the napkin, use the standard surprise format augmented with the
plane-origin tag:

```markdown
### Surprise

- **Expected**: what the executive surface said
- **Actual**: what the session evidence showed
- **Why expectation failed**: what drift or gap caused it
- **Behaviour change**: what the executive surface should say going forward
- **Source plane: executive** — routes through consolidation for
  executive-surface update
```

The tag is load-bearing: without it, consolidation treats the entry as
ordinary active-plane learning. With it, `/jc-consolidate-docs` step 5
cross-plane scan routes the observation to the affected executive surface
for amendment.

## Why this rule exists

Executive memory is the stable-catalogue plane. It drifts less than active
or operational memory but also surfaces drift later because nothing inside
executive memory periodically re-evaluates itself — catalogues are read, not
refreshed. The absence of a local capture edge is the failure mode this
rule counters.

Captured observations with `Source plane: executive` are graduation
candidates: second instance of the same drift moves the item into the
pending-graduations register for structural amendment at the next
consolidation, closing the loop from active-plane observation to
executive-plane update.

## Related surfaces

- [PDR-028 Executive-Memory Feedback Loop](../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md)
  — the doctrine this rule operationalises.
- [PDR-030 Plane-Tag Vocabulary](../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md)
  — canonical form of the `Source plane:` tag.
- [ADR-131 Self-Reinforcing Improvement Loop](../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
  — architectural basis for the feedback loop shape.
- [`.agent/directives/orientation.md § Layers`](../directives/orientation.md#layers)
  — three-plane memory taxonomy the tag routes across.
