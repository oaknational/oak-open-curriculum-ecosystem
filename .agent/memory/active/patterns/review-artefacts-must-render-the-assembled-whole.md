---
name: Review Artefacts Must Render the Assembled Whole, Machine-Rendered
polarity: pattern
use_this_when: Authoring a review artefact (an audit, a registry snapshot, a "here is what the system produces" report) over content that is delivered as a cohesive assembled whole (composed server instructions, rendered UI, a built document) rather than as independent fragments
category: process
layer: general
proven_in: .agent/memory/active/napkin.md (two instances, 2026-07-09, mcp-agent-facing-content audit)
proven_date: 2026-07-09
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reviewing or labelling fragments as if they were the assembled whole, and labelling a value 'exact'/'verbatim' when it is actually hand-reconstructed rather than machine-rendered from the built source"
  stable: true
---

> **POLARITY: PATTERN.** This entry describes a positive shape to repeat: the
> structural elements below should be reproduced whenever a review artefact
> claims to represent an assembled whole or an exact value.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

When content is delivered to its real consumer as a cohesive **assembled
whole** — composed server instructions, a rendered tool description, a built
UI, a generated document — but authored and stored as many independent
**fragments**, a review of the fragments alone can miss defects that only
exist in the composition (branding drift across concatenated pieces, a
context hint that never actually renders, a missing param because the
schema's raw shape has no `.properties`). Two composing disciplines close
this gap:

1. **Present the reviewer the assembled whole**, not only the fragments —
   render it from the running code (exact, or with `{{placeholder}}` markers
   where dynamic content is elided), never reconstruct it by hand from the
   source fragments. A hand-reconstruction is itself a fragment-level
   artefact wearing whole-level clothes.
2. **Anything labelled "exact" or "verbatim" in a review artefact must
   actually be machine-rendered from the built source.** If it cannot be
   rendered (truncation, an unrenderable value serialising as
   `[object Object]`, a raw Zod shape with no `.properties`), the label is a
   defect, not a cosmetic gap — relabel it an explicit **snapshot** with an
   SSOT pointer instead of claiming exactness it does not have.

## Worked Instances (2026-07-09, mcp-agent-facing-content audit)

- **Assembled-whole gap**: the audit's per-fragment review missed
  composition-level defects — three sites where "exact" rendered-wholes
  labels were aspirational (params never actually rendered because the Zod
  raw shape has no `.properties`; a context hint and branding string were
  hardcoded and had already drifted by one apostrophe from the live source).
  Bot review caught what a fragment-only review had missed.
- **Exact-render gap**: the registry's own derivations contradicted its own
  report narrative in two places (tool-annotations tiered as simple-config
  while the report's own text listed a confirmed defect on the same field;
  a content item classified by filename despite the report's own text
  recording an owner provenance ruling that should have overridden it).
  **Derivation rules must be checked against the artefact's own stated
  claims** — a report that states X while its generator encodes not-X ships
  both, and only one of them is true.

## Countermeasure

Before labelling any value in a review artefact "exact", ask: is this value
machine-rendered from the built/running source right now, or is it a
hand-transcription, a paraphrase, or a value that will silently go stale the
next time the source changes? If it cannot be rendered mechanically, state
the artefact is a dated **snapshot** with a pointer to the generator/SSOT
that would regenerate it, rather than claiming a currency the artefact does
not have.
