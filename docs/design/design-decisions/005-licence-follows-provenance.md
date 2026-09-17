---
ddr: DDR-005
iri: urn:uuid:83d0dc71-072b-458b-876c-f4b9ad92d087
title: Licence follows provenance
status: ratified
date: 2026-08-02
deciders: Jim Cresswell (owner)
edges:
  depends_on: []
  supersedes: []
  informed_by:
    - packages/design/oak-design-system/LICENCES.md
    - packages/design/oak-design-system/LICENSING-MANIFEST.md
  related:
    - LICENCE
    - LICENCE-DATA.md
---

# DDR-005: Licence follows provenance

## Context

The design packages mix repo-authored code and prose, Oak-published material
(brand voice text, curriculum content), and Oak marks. An early split by
SUBJECT ("docs about the design system") was held briefly and corrected by
the owner mid-flight to a split by PROVENANCE.

## Decision

Licence is determined by **where the material originated**, never by what it
is about:

- Code and repo-authored prose: **MIT**.
- Material already published on an Oak surface outside this repo and its
  apps (brand voice toolkit text, curriculum content): **© Oak National
  Academy, OGL v3.0**.
- Oak trademarks, logos, and brand elements: covered by **neither** —
  reserved, never licensed by this repo.

## Consequences

- New authored material needs no licence decision — its provenance decides.
- The constrained surface (Oak-published, Oak-marked) is the enumerated
  exception; MIT is the default, stated once at the root.
- Every licence surface (the kit README's licence statement, LICENCES.md,
  LICENSING-MANIFEST.md) states the same provenance rule in substance and
  cites the same authority chain; per-file-class dispositions belong to
  LICENSING-MANIFEST.md alone.

## Provenance

- Owner rulings 2026-08-02 (verbatim intent: code MIT, content OGL, brand
  reserved; corrected same day to the provenance split). Executed in
  PR #719 and PR #721.
