---
id: H005
status: testing
confidence: low
evidence_snapshot: OWA 510ac63; Oak Components 8ff8264
last_updated: 2026-07-19
---

# H005: Journey-level confidence

## Claim

**Hypothesis:** Outcome-focused journey evidence is necessary where important behaviour crosses boundaries that focused unit, component, contract, accessibility and visual evidence cannot demonstrate completely.

The claim is not that journey tests should replace lower-level tests.

## Why it is plausible

**Observed:** OWA has extensive Jest coverage plus Storybook, Percy and Pa11y, while its Playwright documentation identifies limited current coverage and follow-up CI wiring ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L38-L71)).

**Observed:** Important outcomes cross routing, providers, external-service adapters, persistence and analytics boundaries.

## Predictions

If the hypothesis is useful:

1. Production or migration defects can be mapped to missing cross-boundary journey contracts.
2. Deterministic service substitutes can exercise those contracts without a full production environment.
3. Each selected journey demonstrates an outcome or failure state that narrower evidence cannot establish completely.
4. Journey failures identify a broken user outcome while lower-level tests localize the defect.
5. Defence in depth remains where independent evidence is warranted by the consequence of failure.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- incident review finds no cross-boundary failure for which journey evidence would be the appropriate proof;
- controlled adapters cannot reproduce relevant router, identity, persistence or provider-handoff behaviour without encoding the production implementation itself;
- the journey evidence is unreliable or cannot distinguish product failures from environment failures;
- existing contract, integration or deployment evidence already demonstrates the same outcome and adverse states completely;
- a representative journey set cannot preserve the materially distinct identity, accessibility and failure contracts without hiding important variation.

## Most direct discriminating work

1. Classify a sample of recent regressions by user impact, boundary crossed and the evidence required to demonstrate correct behaviour.
2. Specify contracts for teacher download, pupil completion, saved content and Classroom submission.
3. Implement one deterministic journey against controlled adapters.
4. Assess reliability, diagnostic clarity, behavioural coverage and relationship to the other assurance layers.

## Decision affected

The assurance pyramid, fixture strategy and required checks for products created through the Innovation Kit.

## Evidence history

- **2026-07-19:** Proposed from static test inventory and the cross-boundary nature of core journeys.
- **2026-07-19:** In the latest 20 merged OWA PRs, 18 co-changed tests, specs, snapshots or test infrastructure. H005 is therefore narrowed to necessary cross-boundary evidence, not a claim that focused testing discipline is absent.
- **2026-07-19:** Pupil result-sharing verification found an existing Jest test that passes because its `NextResponse` mock defaults an omitted status to 500. The installed real implementation returned HTTP 200 and `ok: true` for the same call. This is a concrete test-fidelity gap; a journey assertion is still required to reproduce user impact.
- **2026-07-19:** Assurance mapping found configured Storybook Axe, deployment Pa11y/Percy and extensive Jest coverage, but only one non-CI teacher Playwright journey. H005 must demonstrate unique signal beyond these existing strengths.
- **2026-07-19:** Classroom change history and trace expose cross-router, iframe, identity, progress and submission-state contracts with focused tests but no discovered browser journey. Delayed/reordered progress and hand-in transitions are direct discriminators.
- **2026-07-19:** Freshness analysis narrows useful journey assertions to degraded outcomes and acknowledgement: stale withdrawal, failed download checks, optimistic reconciliation, resolvable shared results and ordered progress writes.
- **2026-07-19:** Executing the final-feedback helper reproduced a zero-score calculation defect. A focused unit test directly proves that local rule, which is counterevidence against moving it into the journey layer.
- **2026-07-19:** Editorial and curriculum-export traces expose query-to-render and generator-to-delivered-artifact contracts that stop at different current test layers. This supports controlled experiments only; static gaps do not establish unique journey-test signal.
- **2026-07-19:** [Production topology](../current-state/production-topology.md) found real-deployment Pa11y/Percy but no repository-visible core-outcome smoke gate. Whether those checks block promotion or external checks already cover the outcomes remains unknown.
