---
id: H012
status: testing
confidence: low
evidence_snapshot: Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H012: Descriptor, grant and delivery

## Claim

**Hypothesis:** Stable resource descriptors plus contextual, policy-derived
delivery grants and replaceable byte-delivery adapters can remove the false
JSON/binary shadow contract while preserving correct rights, caching, redirect,
range, streaming and failure semantics.

This tests three independently changing responsibilities. It does not select
object storage, proxying, signed URLs, a CDN or any particular HTTP topology.

## Why it is plausible

**Observed:** The public API describes lesson assets as JSON metadata and URLs,
then serves an asset through a separate route whose redirect or byte behaviour,
statuses, headers and policy checks are not fully represented by the generated
JSON contract ([API analysis](../current-state/database-tools/api-runtime-contract-and-policy.md)).

**Observed:** Descriptor availability, rights permission and successful byte
delivery can change on different clocks and have different authorities
([journeys](../current-state/database-tools/end-to-end-journeys.md)).

**Inferred:** Explicitly separating durable metadata, use-time authority and
representation delivery could preserve provider independence while making each
outcome truthful.

## Predictions

If the hypothesis is useful:

1. A descriptor identifies exact resource revision, media properties, provenance
   and available representations without granting access by itself.
2. A grant identifies principal, intended use, representation, obligations,
   policy decision and expiry.
3. Delivery outcomes expose redirect, range, streaming, cache and failure
   semantics through an explicit representation contract.
4. Storage or CDN substitution does not change descriptor or policy meaning.
5. Revocation, expiry and stale cached metadata produce distinguishable outcomes.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- descriptor, grant and delivery always share authority, lifetime and failure in
  every registered use case;
- the split adds round trips or state without improving any rights, caching,
  recovery or provider-substitution decision;
- direct public resources need no contextual grant and a grant abstraction would
  falsely imply revocability after lawful copying;
- signed delivery authority cannot express required range, streaming or cache
  behaviour without provider leakage;
- existing HTTP contracts already describe and test all three responsibilities;
  or
- a simpler standards-based representation link preserves the same distinctions.

## Most direct discriminating work

1. Execute [V019](../investigations/validation-register.md) across public,
   restricted, withdrawn, expired and unavailable resource cases.
2. Predeclare descriptor, policy and delivery authorities and clocks.
3. Compare API proxy, direct signed delivery and public immutable delivery.
4. Test HEAD/GET, redirects, byte ranges, cache validators, interruption, retry,
   expiry and provider substitution.
5. Verify rights-owner, accessibility, browser and independent-consumer outcomes.

## Decision affected

The resource metadata, rights capability and representation-delivery contracts
offered by the Oak Innovation Kit.

## Evidence history

- **2026-07-20:** Graduated from the database/API/OCE multi-lens synthesis. Static
  source warrants a representation experiment, but deployed HTTP behaviour,
  rights authority and consumer requirements remain external evidence.
