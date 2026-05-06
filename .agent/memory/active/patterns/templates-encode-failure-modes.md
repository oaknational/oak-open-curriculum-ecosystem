---
name: "Templates Can Institutionalise Failure Modes; Doctrine and Template Update Together"
use_this_when: "Sharpening a doctrine, principle, or rule that flows through templates, scaffolds, or generators that produce future plans or artefacts"
category: process
proven_in: ".agent/plans/templates/feature-workstream-template.md and .agent/directives/tdd-phases.md (TDD-as-pairs sharpening 2026-05-03)"
proven_date: 2026-05-03
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Updating a directive but not its templates leaves the failure mode alive in every future artefact derived from the template — passive guidance loses to artefact gravity"
  stable: true
---

# Templates Can Institutionalise Failure Modes

## Problem

A directive states a principle correctly. The templates and
scaffolds that flow from that directive subtly encode a *misreading*
of the principle. Future artefacts derived from those templates
inherit the misreading, not the principle. Fixing the directive
alone leaves the failure mode alive in every new derivation.

The risk is highest when:

- The directive uses a phrase that has a precise technical meaning
  (e.g. "Red, Green, Refactor" describing a single TDD cycle).
- The template structurally translates that phrase into a
  serialisation (e.g. WS1=RED commit, WS2=GREEN commit,
  WS3=REFACTOR commit) that the directive did not intend.
- Many artefacts are generated from the template before anyone
  asks whether the structural translation matches the directive.

## Pattern

When sharpening a doctrine, principle, or rule:

1. **Identify the templates and scaffolds the doctrine flows
   through.** Search `.agent/plans/templates/`,
   `.agent/directives/`, `.agent/skills/`, and any scaffold
   generators. The doctrine flows through every artefact derived
   from these surfaces.
2. **Read each template through the *new* doctrine, not the old
   one.** Ask: does this template's structure encode the doctrine
   as authored, or does it encode an earlier misreading? A
   directive saying "Red, Green, Refactor" describes one cycle.
   A template saying "WS1: RED commit; WS2: GREEN commit;
   WS3: REFACTOR commit" structurally translates that into three
   separate atomic units — which is the multi-commit-TDD failure
   mode the directive sharpening was *fixing*.
3. **Update directive and templates in the same pass.** Passive
   guidance (a sharpened directive) loses to artefact gravity
   (existing templates that still encode the misreading). Every
   plan derived from the old template will reproduce the misreading
   even after the directive is fixed.
4. **Look for active artefacts already derived from the
   template.** A template fix prevents future derivations from
   inheriting the failure mode; existing plans derived from the
   old shape may need explicit reshape to the new doctrine.

## Worked Example

**TDD-as-pairs sharpening 2026-05-03**: the principles directive
already said "Red, Green, Refactor". The
`.agent/plans/templates/feature-workstream-template.md` and
`.agent/directives/tdd-phases.md` templates structurally encoded
that as "WS1: RED commit; WS2: GREEN commit; WS3: REFACTOR commit".
Six plans inherited that shape; one of them left four skipped
tests in the working tree (the "WS1 RED arc" pattern). The fix
for the directive (TDD-as-pairs: tests and product code travel
together in one commit) had to land alongside fixes to the
templates and the in-flight plans, not just the directive itself.

The cure landed as a multi-file diff: the directive sharpening
(`tdd-as-design.md` new directive carrying the
load-bearing definition), template updates
(`feature-workstream-template.md`, `tdd-phases.md`), and the in-flight
plan reshape so all six existing plans expressed work as cycle-pairs
(test paired with product code in one commit, with named cycle-pair
homes for each of the six skipped tests).

## When This Pattern Does Not Apply

- Doctrine that does not flow through templates (e.g. a one-off
  ADR about a specific library choice).
- Templates that are demonstrably unused (verify before assuming).
- Doctrine sharpening that is genuinely additive without changing
  any existing template's structural meaning.

## Related

- Source insight: napkin entry "2026-05-03 — Templates can encode
  failure modes; TDD-as-pairs landed in surfaces and plans"
  (archived at `.agent/memory/active/archive/napkin-2026-05-04.md`).
- Companion to [`current-plan-promotion`](current-plan-promotion.md)
  (directive + plan-template alignment) and the broader doctrine-
  enforcement-quick-wins arc.
