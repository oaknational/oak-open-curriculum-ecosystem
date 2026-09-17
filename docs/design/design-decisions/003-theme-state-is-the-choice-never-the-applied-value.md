---
ddr: DDR-003
iri: urn:uuid:4869815c-44a0-49fd-a813-bc8d3b86b8c3
title: Theme state is the choice, never the applied value
status: accepted
date: 2026-08-02
deciders: design lane; owner-merged landings
edges:
  depends_on: [DDR-002]
  supersedes: []
  informed_by:
    - 'PR #644, PR #710, PR #715 — the choice-model landings'
  related:
    - docs/architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md
---

# DDR-003: Theme state is the choice, never the applied value

## Context

A theme system has two distinct values: what the user chose (possibly
nothing) and what is currently applied (choice resolved against OS
preferences and defaults). Early demo stores conflated them — reading the
applied attribute back as if it were state — which made OS-triggered changes
masquerade as user choices.

## Decision

Observable theme state is the **explicit user choice only**. The applied
theme is presentation output and never round-trips into state. The kit
exposes the choice through a dedicated accessor (MCP-388), and the shared
store's snapshot distinguishes no-runtime from no-explicit-choice; the store
deliberately carries no contrast-media mirror (probe-proven inert under this
model: the OS-contrast path writes only the applied attribute). The accessor
signature lives on the store's exported `OakThemeRuntime` contract
(`packages/design/oak-design-react/src/oak-theme-store.ts`); the sentinel
encodings live in `packages/design/oak-design-react/README.md`.

## Consequences

- A first-time visitor has no choice; consumer selects render a placeholder
  state, never a guessed value.
- An applied-theme accessor is a separate, future contract that lands only
  at first materialised need — never by re-conflating the two values.
- Store implementations that read applied attributes into state are
  non-conformant regardless of test coverage.

## Dated amendment — the no-choice default is the IDENTITY default (2026-08-11, owner-ruled)

Two owner rulings, one day apart, settle the theme model's ownership
question:

1. **People have theme preferences, and those preferences should win**
   (2026-08-10): an explicit user choice — system, light, dark,
   high-contrast, colour-safe — always overrides everything else.
2. **The page also has a theme preference** (2026-08-11): an identity's
   default is real design intent — typically light, dark for a
   dark-first identity (EMC²'s bedtime arcade), and an institution may
   legitimately default its white-label to high-contrast or another
   access theme. **"Identity default" joins the theme choices, and it
   is the default that shows when the user expresses no choice.**

Consequences for the model this DDR governs:

- The choice model this DDR names is CONFIRMED: the control's state is
  the user's choice, with "Identity default" as the honest name of the
  no-choice state (superseding both the earlier "Page default" wording
  and the 2026-08-10 interim applied-model store, which briefly
  contradicted this DDR unamended — the drift is owned and corrected
  here).
- "Identity default" is itself selectable: choosing it clears the
  stored choice and returns the page to the identity's own default
  (implementation: no `data-theme` attribute; a brand may re-polarise
  its default via the brand.css polarity lever, which this amendment
  restores as first-class design intent).
- The automatic access commitment stands: with no stored choice, an
  OS-level `prefers-contrast: more` still applies high-contrast.
- Implementation of this amendment is the design lane's next slice
  (post-2026-08-11-compaction); until it lands, the interim
  applied-model behaviour from 2026-08-10 is the live state and this
  amendment is the governing intent.

## Provenance

- Kit 1.8.0 choice accessor: PR #710 (2026-08-02). Shared store with the
  two-level snapshot: PR #715 (same day; the
  [ADR-213](../../architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md)
  §3 tier landing).
- The 2026-08-11 identity-default amendment implemented on PR #846
  (2026-08-11): kit `clear()` + `IDENTITY_DEFAULT` control value in the
  react store, the restored creature polarity lever with its
  `:root:not([data-theme])` icon-filter arms, and the re-trued cell
  estate across the kit, store, showcase, and hub.
- The conflation defect and its cure trace through PR #644; #715's
  landing superseded it, and the pointer trail is recorded on that PR.
