---
id: H003
status: testing
confidence: low
evidence_snapshot: OWA 510ac63
last_updated: 2026-07-19
---

# H003: Explicit application-host contracts

## Claim

**Hypothesis:** OCE-produced web products will preserve cross-cutting obligations more coherently when identity, consent, theming, analytics, errors, notifications, metadata and diagnostics are explicit, without inheriting either OWA provider tree.

The two OWA routers are comparison evidence for discovering obligations. They are not implementations to unify or migration work to perform.

## Why it is plausible

**Observed:** The Pages and App Router roots independently compose overlapping but non-identical cross-cutting behavior ([Pages source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L47-L90), [App source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L48-L111)).

**Inferred:** Migration correctness depends on engineers knowing which differences are intentional, route-specific or accidental.

## Predictions

If the hypothesis is useful:

1. A parity matrix can name every shell capability and the routes that require it.
2. A new product cannot silently omit required consent, identity, error or analytics behaviour.
3. Route groups can omit unnecessary client providers while remaining conformant to the same contract.
4. Host behaviour can be integration-tested independently from individual product pages.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- the parity review finds no shared user, legal or operational outcome across public, authenticated, pupil and Classroom profiles;
- conformance makes a route initialize providers or browser state it does not require;
- equivalent obligations require materially different behaviour because of legitimate host or outcome semantics;
- route history and incidents provide no evidence that a shared host contract would prevent omission or clarify responsibility;
- consent, identity, analytics or error requirements have contradictory obligations that cannot be expressed as named profiles without route-specific exceptions.
- premise analysis shows that server request policy, product capabilities and isolated client interactions can express the obligations directly, making a shell abstraction unnecessary.

## Most direct discriminating work

1. Produce a provider, global-style, metadata and error-behavior parity matrix.
2. Map each difference to a user, legal, operational or performance requirement.
3. Determine which obligations require shared lifetime or state and which can be expressed at request, route or interaction boundaries.
4. Compare an explicit shell/profile design with a design that removes the shell abstraction and composes obligations directly.

## Decision affected

How the Innovation Kit makes cross-cutting obligations explicit without prescribing one framework or provider composition.

## Evidence history

- **2026-07-19:** Proposed after observing two active application roots and an ongoing router migration.
- **2026-07-19:** Static [runtime-shell parity](../current-state/runtime-shell-parity.md) found a large common behavioral surface plus unresolved differences. This supports testing the contract hypothesis but does not establish that one implementation is desirable.
- **2026-07-19:** Change-history sampling found a dedicated App Router error-boundary change across root, core and teacher layouts, reinforcing error behavior as a profile-level shell contract.
- **2026-07-19:** Pupil trace requires distinct anonymous lesson, Classroom pupil and teacher-results profiles across both routers. This further narrows H003 to named outcomes and conformance tests, not identical chrome or providers.
- **2026-07-19:** Assurance mapping found shared runtime diagnostics but no rendered parity gate across roots; consent, error and accessibility outcomes remain the next discriminating contract tests.
- **2026-07-19:** Classroom trace found an App-to-Pages handoff with separate Google identity, iframe and analytics needs. This supports testing H003 specifically as a profile contract across the transition.
- **2026-07-19:** Editorial preview also crosses App and Pages roots and combines draft state, feature release, preview controls, analytics and metadata. This supports an `editorial-preview` conformance test, not one provider tree.
- **2026-07-19:** [Production topology](../current-state/production-topology.md) adds release identity, consent-aware diagnostics and deployment behavior to the shell boundary while leaving host-specific adapters and live enforcement external.
