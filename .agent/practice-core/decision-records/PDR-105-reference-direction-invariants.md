---
pdr_kind: governance
---

# PDR-105: Reference-Direction Invariants — the Artefact Fundamentality Hierarchy

**Status**: Accepted (owner co-design, 2026-06-19)
**Date**: 2026-06-19
**Related**:
[PDR-019](PDR-019-adr-scope-by-reusability.md) (defines the ADR=specific /
PDR=general layer split this invariant references);
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md) (the Core
artefact types ordered here);
the `no-moving-targets-in-permanent-docs` rule (the existing write-time hook that
already enforces the durability axis — now an operationalisation of this PDR);
the `practice-core-portability` rule (the portability axis as applied to the Core).

## Context

A cross-artefact reference is a **dependency**: the referrer depends on the target
existing, at the target's location, in the referrer's context. A reference whose
target is *less fundamental* than the referrer — more volatile in time, or more
specific to one context — is a latent defect: it breaks when the target moves, is
deleted, or is absent where the referrer is read. The two axes are Robert C. Martin's
**Stable Dependencies Principle** (SDP) applied to the knowledge substrate — *depend in
the direction of stability* — generalised from SDP's original time-stability axis to a
second, contextual one: every reference points toward an artefact at least as
fundamental (durable, general) as the referrer. The **stable-index corollary** below is
the **Dependency Inversion Principle** (DIP) proper: where a reference to a volatile
target is unavoidable, depend on a stable *abstraction* — an identity resolved through
one stable-addressed index — never on the concretion's volatile location.

The defect surfaced concretely as link-rot (continuity/plan references to
thread-record paths breaking when records were relocated by lifecycle) and as
organisational residue (surfaces that outlived their model because nothing made the
wrong-direction dependency visible). The cure is not to repoint paths — that treats
the symptom and re-breaks on the next move — but to fix the **direction** of
dependency.

## Decision

Every cross-artefact reference MUST point toward a **more fundamental** artefact,
measured on two orthogonal axes. A reference pointing away from the foundation (to a
more-volatile or more-specific target) is a defect.

### Axis 1 — Durability (time): reference ephemeral → durable

Ordered most-ephemeral to most-durable:

1. Operational state (session capture, comms events, claims, the napkin)
2. Threads / next-session continuity records
3. Plans (execution instructions; deletable once complete)
4. Patterns and distillation buffers
5. Rules
6. ADRs / PDRs
7. Principles and directives

An artefact references only artefacts at least as durable as itself. Ephemeral
surfaces (plans, threads) reference durable doctrine; **durable doctrine references
nothing ephemeral.** (This extends the long-standing "ADRs are permanent, plans are
ephemeral; plans cite ADRs, never the reverse" rule from plans to threads — threads
are ephemeral in exactly the same sense.)

### Axis 2 — Portability (context): reference specific → general

Ordered most-specific to most-general:

1. Host-repo code, READMEs, and docs
2. ADRs (one repo's architectural decisions)
3. PDRs and the Practice Core (portable across every Practice-bearing repo)
4. Cross-Practice principles

A specific artefact references only artefacts at least as general as itself. ADRs may
cite PDRs; **a PDR must never cite an ADR** — the PDR travels to repos where that ADR
does not exist, so the reference would dangle on arrival.

### Unifying invariant

The **availability of a reference's target must be greater than or equal to the
availability of the referrer** — across time (durability) and across context
(portability). A reference is safe if and only if its target outlives and
out-travels the referrer.

### Stable-index corollary

Some references to volatile targets are unavoidable: an *index's* job is to point at
the volatile things it catalogues. Resolve these through exactly **one stable-addressed
index** that owns the identity→location mapping and absorbs the churn internally.
Every other surface references the stable **identity** (a slug, an id) and resolves
location through that index — never by hardcoding the volatile location. A lifecycle
move then updates one place. A stable index has a stable *address* even though its
*content* changes; that is what makes it a safe dependency target for the identities
it resolves.

## Consequences

- **Enforcement is mechanical, not prose.** Prose doctrine loses to artefact gravity
  (PDR-098). The durability axis already has a write-time hook (`no-moving-targets`);
  the standing follow-on is a validator that knows each artefact's layer and flags any
  reference pointing the wrong way on either axis. Operationalising rules
  (`no-moving-targets`, `practice-core-portability`) cite this PDR.
- **Wrong-direction citations are defects to retire, not patterns to maintain.** Any
  consolidation or review step that validates a durable→ephemeral or general→specific
  citation (for example, a check that affirms a rule citing a plan as its authority) is
  itself a violation of this PDR and is retired; the durable artefact's authority must
  be a peer-or-more-fundamental artefact.
- **Lifecycle may be encoded as location** (e.g. paused/retired subdirectories) only
  because the stable index localises the resulting churn; without the single-index
  rule, location-encoded lifecycle trades glanceability for link-rot.

## Notes (host-local)

In this repo: `repo-continuity.md` is the stable thread index — its link-definition
block is the one surface that maps a thread slug to its current record path, so a
thread moving between the active root and the `paused/` or `retired/` subdirectories
updates only that block. The `tracks/` and `workstreams/` surfaces were removed
2026-06-19 as residue; their removal and the thread-index discipline are the first
applications of this PDR.
