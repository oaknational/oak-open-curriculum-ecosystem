---
name: Derive a Controlled Surface From the Authoritative Data
polarity: pattern
use_this_when: A surface you control (an enum, a parameter value space, a type, a listing page) mismatches an authoritative data source and the tempting move is a crosswalk or mapping layer between them
category: architecture
layer: general
status: emerging
discovered: 2026-05-27
proven_in: The EEF focus-enum owner correction (2026-05-27) and the MCP landing-page under-listing cure — see §Worked Instances
proven_date: 2026-06-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Building a crosswalk or mapping layer over a surface you control, institutionalising a self-inflicted mismatch that drifts silently in both directions (data adds a value the crosswalk never exposes; you add a value that maps to nothing)"
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

When a surface **you control** (an enum, a parameter value space, a type)
mismatches an **authoritative data source**, derive the controlled surface FROM
the data (schema-first) — at build/codegen time, or as a const with a
drift-failing assertion. Never build a crosswalk or mapping layer between them.

A crosswalk is only legitimate between two surfaces you genuinely do NOT control
(an external API's vocabulary vs your domain). Reaching for a mapping over a
surface you DO control is doctrine-by-analogy — the integration-bridge reflex
misapplied where schema-first derivation is correct — and it institutionalises a
self-inflicted mismatch as a permanent drift source: the data adds a value and the
crosswalk silently fails to expose it; you add an enum value and it maps to
nothing. This is the generalisation that
[`replace-dont-bridge`](../../../rules/replace-dont-bridge.md) (disproven shapes)
and schema-first execution each state more narrowly.

Only if no authoritative vocabulary exists do you define one — and then your
definition becomes the source, not a bridge.

## Corollary — Self-Describing Data

Real-world data snapshots often ship their OWN controlled vocabulary (the EEF
snapshot carries a `school_context_schema` block with `enum` definitions for
phase, key stage, priorities). Consume the data's self-description; do not invent
a parallel vocabulary and strip the authoritative one.

## Corollary — Listing Surfaces

The same principle governs any surface that *lists what is registered* (an MCP
landing page's resources/prompts/tools sections, a generated index): derive every
section from the ONE canonical registered catalogue, never from a narrow
hand-maintained subset — a narrow const silently under-lists and drifts. Cure: a
single canonical catalogue consumed by the surface, plus a drift-guard test tying
the listing to the registered set.

## Corollary — Don't Persist What You Can Derive

The storage-side face of the same principle: **persisting a value derivable
from fields already present is a drift generator**, and every consumer of the
stored copy inherits its machinery — staleness validation, totality corners,
propagation slices, schema bumps, promotion paths all follow from the one
decision to store. Worked instance (PR #515, 2026-07-24): every finding of
three consecutive review waves traced to ONE generator — a persisted
disambiguator derivable from fields already on the record; the owner-accepted
reframe (render-time derivation, no persisted field, no schema change)
dissolved the whole finding family. The estate already lives this elsewhere
(`shared-comms-log.md` is a generated view, never authored) — recognise the
shape at plan-authoring time: a plan slice adding validation/propagation for
a stored field is the tell that the field should be derived instead.

## Worked Instances

- **The EEF `focus` enum (owner correction, 2026-05-27).** A crosswalk was
  proposed between an invented `focus` enum and the EEF priority vocabulary — and
  posed as a multiple-choice question on top. Both moves were wrong: the enum was
  a controlled surface, the EEF vocabulary was authoritative, and the answer was
  forced ("you are not a passive observer, you are a highly competent engineer
  designing an architecturally excellent system"). The cure was deriving the
  parameter space from the data's own schema block.
- **The MCP landing page under-listing.** The page showed 3 of 8 resources
  because one section read a hand-maintained `DOCUMENTATION_RESOURCES` const
  instead of the full registered catalogue. The cure was the single canonical
  catalogue plus a drift-guard test.

## How to Apply

On any enum, parameter, or type that filters or queries a data source: first
locate the data's authoritative vocabulary (a schema block, a distinct-values
scan, a spec); make the controlled surface equal to it, derived at build time or
guarded by a drift-failing assertion. On any listing surface: find the canonical
registry and consume it whole.

## Forward References

- [`replace-dont-bridge`](../../../rules/replace-dont-bridge.md) — the rule this
  pattern generalises beyond disproven-shape bridges.
- [`crosswalk-before-reconciling-drifted-docs.md`](crosswalk-before-reconciling-drifted-docs.md)
  — the sibling where "crosswalk" is an analysis move over two *documents*; this
  pattern bounds when a *built* crosswalk artefact is ever legitimate.
- [`.agent/rules/verify-data-supports-shape-before-building.md`](../../../rules/verify-data-supports-shape-before-building.md)
  — the upstream check that the authoritative data actually carries the shape.
