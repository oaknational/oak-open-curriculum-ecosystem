---
id: H008
status: testing
confidence: low
evidence_snapshot: Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H008: Release and placement authority

## Claim

**Hypothesis:** One immutable, scope-closed curriculum publication release plus
explicit revision and placement relations can support bounded online reads, bulk
manifests, search and graph ingestion, and curriculum traversal without asking
endpoint crawls or consumer caches to establish completeness.

This tests a semantic basis, not a commitment to a particular database, event
model, archive format or deployment topology.

## Why it is plausible

**Observed:** The pinned database, API and OCE chain exposes useful curriculum
through independently versioned materialized views, endpoint responses, a cached
contract, generated consumers and a separate bulk receipt. No inspected boundary
names one scope-closed curriculum release containing exact revision and placement
identity across those profiles ([synthesis](../current-state/database-tools/concept-lenses/synthesis.md)).

**Observed:** OCE compensates for open-ended enumeration with endpoint
choreography, while online, bulk, search and graph paths can advance on different
clocks ([journeys](../current-state/database-tools/end-to-end-journeys.md)).

**Inferred:** A release and placement authority could make completeness and
derivation testable once, while allowing independently optimized projections.

## Predictions

If the hypothesis is useful:

1. A predeclared subject/phase corpus has one exact revision and placement set.
2. Live, bulk, search and graph inputs derive the same placement identities and
   source digest without endpoint-specific reconstruction rules.
3. Variants, ordering, withdrawal and restricted descriptors remain explicit.
4. Projection releases can advance independently while naming their source
   curriculum release and conformance result.
5. Rebuilding a projection does not create a second curriculum fact authority.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- a registered profile requires an independently authored fact that cannot be
  represented as a projection input, assertion or policy decision;
- legitimate preview, audience or jurisdiction semantics cannot be represented
  as named releases or channels without corrupting one publication authority;
- a complete release cannot preserve variants, placement order, correction,
  withdrawal or restricted representations;
- the release model merely moves crawl, reconciliation or synchronization work
  behind a manifest;
- representative online workloads require unversioned mutation semantics which
  cannot coexist with immutable publication releases; or
- a smaller or federated model establishes the same outcomes more truthfully.

## Most direct discriminating work

1. Execute [V012](../investigations/validation-register.md) over one scope-closed
   subject/phase corpus containing variants and restricted descriptors.
2. Define exact entity, revision, placement and release identities with competent
   curriculum and publication owners.
3. Derive live cursor, bulk manifest, search input and graph input independently.
4. Compare placement IDs, ordering, digests, omissions and duplicates.
5. Inject rename, withdrawal, partial publication and projection-rebuild failure.

## Decision affected

The curriculum identity, publication, enumeration and projection contracts
offered by the Oak Innovation Kit.

## Evidence history

- **2026-07-20:** Graduated from the database/API/OCE multi-lens synthesis. The
  pinned chain warrants a controlled release experiment, but production
  completeness, curriculum authority and independently owned discovery facts
  remain unknown.
