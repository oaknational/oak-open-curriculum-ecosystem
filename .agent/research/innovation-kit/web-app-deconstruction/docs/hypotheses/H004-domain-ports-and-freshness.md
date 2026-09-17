---
id: H004
status: testing
confidence: low
evidence_snapshot: OWA 510ac63; Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H004: Domain ports and explicit freshness

## Claim

**Hypothesis:** Routes and UI should depend on domain-facing use cases whose provider ports include explicit freshness and failure semantics, instead of directly coordinating source-shaped queries and broad cache defaults.

## Why it is plausible

**Observed:** OWA has useful query adapters that validate and reshape generated GraphQL data, but page orchestration can still join curriculum, CMS, filtering, cache and redirect policy ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L154-L302)).

**Observed:** The current system serves sources with different change rates and failure modes: curriculum, CMS, account data, pupil progress, media, search and generated documents.

**Inferred:** A source-oriented cache default cannot by itself express the freshness a user outcome requires.

## Predictions

If the hypothesis is useful:

1. Route code asks for user-relevant results rather than transport-specific response shapes.
2. Runtime validation and content exceptions remain at provider/domain boundaries.
3. Freshness, stale behavior and invalidation can be explained per use case.
4. Provider substitution in an experiment does not change route or UI contracts.
5. Failure behavior becomes testable without invoking external services.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- the current adapters already expose authority, acceptable age, stale fallback, retry, acknowledgement and user-visible failure for each traced outcome, leaving only route composition above them;
- a fixture-backed port cannot preserve the required query selection, freshness or runtime behaviour without leaking provider-specific concerns;
- stakeholder review assigns the same acceptable age, stale fallback and failure response to curriculum, CMS, file availability, account data, pupil progress and Classroom state;
- prototype operations merely forward arguments and results and add no independently testable policy, semantic translation or failure behaviour;
- incidents and freshness-related changes provide no evidence that named authority, transformation, acknowledgement or cache ownership would have changed behaviour or diagnosis;
- changing the publication or authority model removes the need for several proposed freshness ports entirely.

## Most direct discriminating work

1. Trace every transformation and cache decision for teacher download and pupil completion.
2. Record the required freshness and degraded behavior from the user's perspective.
3. Review incidents and fixes involving stale, missing or mismatched data.
4. Challenge whether changing the source authority, publication model or data shape can remove current synchronization and caching concerns.
5. Compare a provider-independent use case, direct authoritative access and a redesigned source model against the full outcome contract.

## Decision affected

The data-access, caching and fixture architecture of OCE products and Innovation Kit teaching material.

## Evidence history

- **2026-07-19:** Proposed from the initial service map and teacher programme-page trace.
- **2026-07-19:** Account-to-saved-content trace found a user-specific BFF and runtime validation, but no explicit stale, retry or missing-curriculum-content contract. This strengthens the need to test H004 without establishing that another abstraction is required.
- **2026-07-19:** Teacher and pupil traces found materially different policies for cached curriculum, live file existence, ephemeral state, Firestore attempts and Classroom progress. Existing query adapters already provide strong validation and shaping, so H004 must add independent failure/freshness policy rather than rename them.
- **2026-07-19:** Classroom already has a substantial package/provider facade, yet OWA does not name progress ordering, retry, acknowledgement, stale or degraded-mode semantics. This is mixed evidence: an outcome port is useful only if it owns those policies.
- **2026-07-19:** [Freshness and failure matrix](../current-state/freshness-and-failure.md) found different clocks and degraded modes across seven boundaries, plus related lesson/unit download checks that fail differently. Product-required age and fallback remain unknown, so H004 is ready for stakeholder and fault-injection tests but remains low confidence.
- **2026-07-19:** Editorial SSR names no publish-latency or last-known-good contract, while curriculum export versions a composite DOCX/XLSX artifact only by curriculum materialized-view time. These are discriminating cases for outcome-level freshness; strong existing CMS and curriculum adapters remain counterevidence to indiscriminate wrapper layers.
- **2026-07-19:** [Production topology](../current-state/production-topology.md) found clocks from one minute to 30 days and no repository-visible live invalidation path. External CMS/CDN control-plane behavior must be checked before treating that as the complete production policy.
- **2026-07-19:** A [focused handler probe](../experiments/curriculum-export-redirect.md) reproduced consecutive redirects when missing curriculum refresh metadata generated a new timestamp. This supplies one concrete failure case for explicit cache identity and degraded behavior; deployed frequency remains unknown.
- **2026-07-20:** The pinned [database, API and OCE synthesis](../current-state/database-tools/concept-lenses/synthesis.md) found independently versioned source, materialized-view, public-contract, consumer-cache and bulk clocks. Materialized-view refresh can acknowledge before completion, and API handlers pin several projection versions without one curriculum release watermark. This strengthens explicit freshness and failure semantics while narrowing H004: release and projection identity may remove some generic freshness ports rather than justify another wrapper around every provider.
- **2026-07-20:** The same source is mixed evidence for the proposed boundary. Database-Tools projections expose storage/read shapes, and no domain-facing port or query-selection layer was found at that boundary; oak-openapi handlers add use-specific composition later. This diagnoses missing authority/freshness semantics but does not show that ports are present, sufficient or preferable to changing publication and release design. H004 remains low confidence and must not be read as supported architecture.
- **2026-08-14:** The host repository merged Proposed provider-independence doctrine (`docs/architecture/architectural-decisions/225-provider-independent-capability-contracts.md` and `.agent/practice-core/decision-records/PDR-139-provider-independent-capability-composition.md`, merge `c0a6c08d3`): capability contracts named before providers, technology adapters split from provider bindings, omission made semantic, and a per-provider exercised-independent-composition floor quantified over named external providers. Observed as a repository governance event, not product evidence: it neither supports nor weakens H004's OWA-derived claims, but the hypothesis's decision context now includes an adopted boundary vocabulary overlapping H004's port concept, and this corpus's own negative-space row — "tested semantic portability, exit, restoration and retained options" — is directly answered by that floor (the convergence is recorded at `.agent/research/capability-deconstruction-survey-comparison.md` in the host repository). H004's status and confidence are unchanged.
