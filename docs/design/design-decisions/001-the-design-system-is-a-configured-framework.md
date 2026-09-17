---
ddr: DDR-001
iri: urn:uuid:b0783be7-dec7-4428-99a4-406bc3986bd6
title: The design system is a configured framework
status: ratified
date: 2026-08-05
deciders: Jim Cresswell (owner)
edges:
  depends_on: []
  supersedes: []
  informed_by:
    - 'PR #782 — the strategic node ratification (the informing artefact)'
    - 'PR #737 — Oak Components anatomy, intent and evolution'
  related: []
---

# DDR-001: The design system is a configured framework

## Context

The Oak Open Curriculum Design System could have been built as a bespoke
component library (the shape of its reference sources, Oak Components and
OWA). The strategic question was whether value ships as hand-made artefacts
or as configuration of a general system.

## Decision

The design system is a **configured framework**: a general, portable system
whose Oak-specific identity is carried entirely by configuration (tokens,
themes, brand values), never by bespoke code paths. Deeper layers are more
general; semantic tokens are never Oak-specific.

## Consequences

- Any consumer can re-configure the system for a different identity without
  forking it; "works for any user, any machine" is a review lens, not an
  aspiration.
- Oak-specific values enter only at the configuration boundary, which is
  where identity, licensing, and attribution scrutiny concentrate
  (DDR-005, DDR-007).
- Capability commitments are made by the framework, so conformance needs a
  framework-level predicate (DDR-008), not per-artefact judgement.

## Provenance

- Strategic node ratified by owner word 2026-08-05 (session a0892f);
  ratification stamp landed in PR #782 — that node is this decision's
  informing artefact, and this record now carries its decision substance.
- The generality-depth gradient, in-record (owner kernel, 2026-08-02/03):
  the system is layered with the most reusable layers at the bottom and
  the most specific at the top; each higher layer depends on the lower
  layers and every layer is optional and complete, down to a zero-runtime
  static consumer with full identity fidelity; deeper layers are more
  general, and semantic tokens are never Oak-specific. The configuration
  boundary is where Oak-specific values enter — ideally no more than
  config passed to a general framework.
