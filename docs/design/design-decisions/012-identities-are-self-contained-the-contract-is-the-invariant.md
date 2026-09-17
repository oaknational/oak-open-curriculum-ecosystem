---
ddr: DDR-012
iri: urn:uuid:ee825831-feb8-4550-a8fb-e4d7d171ce99
title: Identities are self-contained; the contract is the invariant
status: ratified
date: 2026-08-18
deciders: Jim Cresswell (owner)
edges:
  depends_on: [DDR-001, DDR-007]
  supersedes: []
  informed_by:
    - '.agent/reports/design/design-lane-critical-analysis-2026-08-17.md — the 2026-08-17 sitting whose rulings the 2026-08-18 decision builds on (the eventual state: all identities as canonical identity packs)'
    - '.agent/reports/design/tango-pack-plan-readiness-reviews-2026-08-17.md §Addendum 2026-08-18 — the demo-day defect ledger (reduced-motion collapse defeated by a bare later-sheet override; a stranded server-rendered brand sheet; cascade-order and specificity fights; light-dark() resolving at the declaring root) and the P7 ruling that reshaped T1a-ii'
    - 'PR #908 — the landing that carried this record, the tango-identity-pack node and its review record to main (2026-09-02)'
  related: [DDR-003, DDR-004]
---

# DDR-012: Identities are self-contained; the contract is the invariant

## Context

Identity switching was first proven with a runtime override mechanism: the
kit ships a base token surface carrying Oak's values, and an identity is a
delta stylesheet loaded after it, re-declaring ("re-pointing") the tokens
it wants to differ. The mechanism demonstrated live switching over
identity-invariant markup — and then quietly persisted as the
architecture. Under it, inheritance is invisible and order-dependent:
what an identity did NOT re-point silently tracks the base, a base edit
re-skins every identity that never pinned that token, and the full
surface of an identity exists only inside a browser cascade. The
2026-08-18 demo day produced the defect ledger that made this concrete
(see edges), and the owner named the underlying fault: an early
mechanism design to prove theme switching persisted when it should not
have.

## Decision

**Each identity is self-contained: an identity pack carries its complete
token surface, including all of its theme faces. The token CONTRACT —
the names, semantics, and obligations every pack implements — is the
shared INVARIANT: invariance of the contract is what keeps
one-markup-every-identity true and what makes new identities cheap to
create.**

Defaults exist and are welcome — **at construction time, never as
runtime values**. Creating an identity fills every contract field the
author has not yet decided from the default scaffold, records the
provenance of every value (defaulted or authored), and emits a complete
artefact the identity owns from that moment. Construction is a
first-class tooling operation (working name, owner's verbatim:
`oak-design identity create`), with an upgrade path that re-derives
against an evolved contract as an explicit, reviewable per-pack diff.

The axes separate cleanly: **identity is a build-time axis** (who the
service is — a complete, selectable artefact); **theme is the runtime
axis** (the reader's condition — light, dark, high-contrast,
colour-safe — carried in full inside every pack).

## Consequences

- **Default-as-scaffold, never default-as-lien.** A scaffold value is
  visible, provenance-recorded, and owned by the identity after
  creation; a runtime fallback is invisible, owned by nobody, and
  changes underneath its consumers. Base evolution reaches identities
  as explicit upgrade diffs, never silent re-skins.
- **The runtime-override mechanism is graded legacy-demo.** It keeps
  the showcase honest until the pack migrations land, and no new
  surface may adopt it. Identity "switching" becomes artefact
  selection: swapping complete sheets, with no overlay ordering, no
  stranded base, no adoption dance.
- **Prefixes stop encoding the base.** The Oak-named primitive palette
  becomes Oak's own construction-time resource; served token names are
  the identity-neutral contract, with any identity-specific prefix a
  pack-declared manifest field (a MAJOR: the prefix is a cross-estate
  wire field).
- **The kit base becomes value-free.** Oak ceases to be the implicit
  base and becomes an identity like the others; the kit keeps the
  unbranded contract, the default scaffold, and the layout/behaviour
  machinery. Emptying Oak's values out of the base bytes is the Oak
  pack's migration outcome, not a precondition of this decision:
  completeness admission keeps the base-fallback path structurally dead
  for admitted packs in the meantime.
- **Validation is completeness against the contract**, never
  delta-wellformedness: the pack manifest declares the full surface,
  the admission guard verifies it, and a contract-drift validator
  recomputes rather than records.
- **The means live in delivery plans, never here.** This record states
  the should-be — the contract-invariant manifest, the construction
  instrument, the first pack born through it, and the migration of the
  three existing identities off the runtime override. Which plan carries
  which step, and when, is the schedule's business; those plans cite
  this record for the decision, never the reverse.

## Provenance

Owner ruling, 2026-08-18, design-lane session (Yarrow stirs Undergrowth,
ab1066), the post-demo feedback round — verbatim:

> On the re-pointing point. That feels fundamental. I think it is showing
> that an early mechanism design to prove theme switching has persisted
> when it shouldn't. Each identity needs to be self contained, not
> override a base. We can certainly have defaults, but the time to use
> them is during identity construction, not as runtime values… we can
> have a CLI with commands like oak-design identity create

And, ratifying the seat's self-contained-values-shared-contract clause,
same sitting:

> Absolutely yes, the contract is an invariant, that is what makes it
> cheap to create new identities.

This section is the decision's durable authority anchor; every other
surface is downstream of it.
