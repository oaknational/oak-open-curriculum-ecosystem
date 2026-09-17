---
id: H009
status: testing
confidence: low
evidence_snapshot: Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H009: Capability policy protocol

## Claim

**Hypothesis:** One typed decision protocol over principal, referent, revision,
intended use, channel, territory and time can replace duplicated rights reasoning
while preserving channel-specific enforcement and competent policy authority.

The kit would define how decisions, reasons, obligations and policy identity are
carried and checked. It would not appoint itself as rights authority.

## Why it is plausible

**Observed:** The pinned public API uses separate committed correction lists and
different gates for text, quizzes, assets and bulk behaviour; OCE must consume the
resulting channel differences without one shared policy decision identity
([API policy analysis](../current-state/database-tools/api-runtime-contract-and-policy.md)).

**Observed:** These compensations contain real knowledge about allowed use and
availability, but their agreement, provenance and supersession are not one
executable contract ([synthesis](../current-state/database-tools/concept-lenses/synthesis.md)).

**Inferred:** Decision vocabulary can be shared even where data, authority,
obligations and enforcement legitimately differ by use or channel.

## Predictions

If the hypothesis is useful:

1. Every registered rights case yields an explicit decision, reason, obligations
   and policy identity.
2. Discovery, metadata, quiz, asset, bulk and tool channels can enforce that
   decision locally without reinterpreting its meaning.
3. Legitimate channel differences are explained by decision inputs or
   obligations rather than unrelated correction lists.
4. Policy changes and revocations are traceable to competent authority and time.
5. Consumers can distinguish denied, unavailable, withdrawn and unsupported
   outcomes without inferring policy from missing data.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- competent authorities require irreducibly incompatible decision semantics for
  a registered case, rather than different inputs under one vocabulary;
- a shared protocol obscures jurisdiction, delegation or channel-specific duty;
- enforcement cannot be checked against the originating decision without
  coupling every delivery provider to one central service;
- time-sensitive revocation cannot coexist with cached metadata or copied open
  releases under the proposed model;
- policy reasoning is already singular, authoritative and correspondingly
  enforced across every relevant path; or
- the protocol becomes a universal rule engine whose complexity exceeds the
  obligations it makes explicit.

## Most direct discriminating work

1. Execute [V014](../investigations/validation-register.md) using an
   authority-approved rights corpus.
2. Include permitted, denied, restricted, withdrawn, unknown and conflicting
   cases across principal, use, channel, territory and time.
3. Compare current channel outcomes with one candidate decision vocabulary.
4. Test cached descriptors, short-lived grants, revocation and offline releases.
5. Obtain rights-owner review of every mismatch and claimed common concept.

## Decision affected

The rights-decision, policy-evidence and enforcement-conformance contracts of the
Oak Innovation Kit.

## Evidence history

- **2026-07-20:** Graduated from the database/API/OCE multi-lens synthesis. Static
  evidence shows duplicated and channel-specific policy mechanisms, but does not
  establish legal correctness, institutional ownership or that one protocol is
  sufficient.
