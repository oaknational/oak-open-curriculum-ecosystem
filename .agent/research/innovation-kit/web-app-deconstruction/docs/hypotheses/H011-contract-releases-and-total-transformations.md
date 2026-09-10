---
id: H011
status: testing
confidence: low
evidence_snapshot: Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H011: Contract releases and total transformations

## Claim

**Hypothesis:** Immutable contract acquisition plus a total, loss-accounting
intermediate representation can derive HTTP clients, runtime validators and
transport adapters without silent semantic loss, while authored capability
contracts retain intent-level meaning outside generated transport code.

A compiler is candidate machinery, not an enduring domain concept. This
hypothesis does not assume OpenAPI is the best domain model or that every useful
capability maps to one operation.

## Why it is plausible

**Observed:** oak-openapi has manually synchronized source and generated schemas,
while OCE can select cached or live schema input and transforms the document into
types, validators and MCP primitives with known omissions and authored additions
([consumer analysis](../current-state/database-tools/oce-consumer-and-generation.md)).

**Observed:** A lockfile-checked, network-guarded comparison found structural
equality for the two pinned provider and consumer snapshots, but this proves
neither runtime conformance nor future transformation completeness
([API analysis](../current-state/database-tools/api-runtime-contract-and-policy.md)).

**Inferred:** Separating reviewed acquisition, pure transformation and authored
capability semantics could turn each transformation into an executable proof
obligation.

## Predictions

If the hypothesis is useful:

1. Every supported contract construct is preserved or deliberately adapted with
   explicit rationale and evidence.
2. Unsupported constructs fail before output rather than disappearing silently.
3. Identical input digest, transformer version and options produce identical
   artefacts across environments.
4. Compatibility classification reflects protocol rules and registered
   capability uses, not raw JSON inequality alone.
5. Generated primitives remain complete for the declared transport subset while
   authored capabilities are separately owned and testable.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- a required provider construct or registered capability cannot be represented
  without hidden semantic branches outside the transformation definition;
- existing generation already proves total preservation or rejection over the
  complete required language;
- the intermediate representation merely duplicates OpenAPI while adding another
  manual synchronization point;
- hermetic acquisition prevents required compatibility or deployment behaviour;
- capability authors still need provider archaeology despite the proposed split;
  or
- direct idiomatic clients and small authored adapters provide stronger
  correspondence with less conceptual machinery.

## Most direct discriminating work

1. Execute [V015](../investigations/validation-register.md) over every construct
   used by the pinned API plus adversarial fixtures.
2. Include headers, cookies, bodies, response headers, status families, binary,
   redirect, range, streaming and error representations.
3. Compare current generation, a total intermediate representation and direct
   idiomatic client generation.
4. Replay additive and breaking changes through generated and authored surfaces.
5. Require reproducible artefact digests and an explained result for every input
   node.

## Decision affected

The contract acquisition, code-generation, validation, compatibility and
transport-extension architecture of the Oak Innovation Kit.

## Evidence history

- **2026-07-20:** Graduated from the database/API/OCE multi-lens synthesis. Pinned
  snapshot correspondence provides a known starting case; the claimed totality,
  compatibility value and cognitive benefit remain unproved.
