---
pdr_kind: governance
---

# PDR-054: Asymmetric-Cure Discipline

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — this PDR specialises
the doctrine for the case where a behavioural cure exists but its
structural enforcement is one-sided);
[PDR-044](PDR-044-memetic-immune-system.md) (memetic immune system —
asymmetric cures are the failure mode innate-immunity layers must close).

## Context

A *cure* that addresses a recurring failure mode can be authored at any of
three layers:

1. **Behavioural** — operator-applied prose discipline ("always use
   `git commit -- <pathspec>`"; "never write directly to the rendered
   shared-comms-log"). The cure depends on every operator reading and
   applying it.
2. **Self-enforcing** — environmental tripwires that fire automatically
   when the cure is needed (a hook that refuses the wrong-shape commit;
   a write-time scanner that blocks the dangerous edit).
3. **Asymmetric** — a behavioural cure that is structurally enforced *only
   on the operators who follow the discipline*. The cure protects the
   applier from being the cause of the failure mode but does not prevent
   peers from causing the same failure mode against the applier.

Asymmetric cures are *visible only after the failure mode has fired*.
Three observed instances on this repo's `git commit` flow (Vining
Spreading Seed initial; Lacustrine→Moonlit second; Ethereal→Dawnlit
third) demonstrated the shape: the originating agent applied
`git commit -- <pathspec>` correctly, the peer agent did not, and the
peer's `git commit` swept the originator's staged content into the
peer's commit. The applier did everything right; the failure mode fired
anyway. Substance was preserved in all cases; commit attribution was
distorted; reviewer evidence (when present) applied to the absorbed
diff.

The asymmetry insight (owner-named): *a cure that protects the agent
who applies it but does not prevent the failure mode in agents who don't
apply it is not really a structural cure — it is a behavioural commitment
one side keeps on the other side's behalf.*

## Decision

When authoring or reviewing a cure for a recurring failure mode in
shared-state work, classify the cure's *symmetry* explicitly. Three
shapes:

1. **Symmetric structural cure**: the cure fires regardless of which
   operator triggered the failure mode. Hooks, gates, scanners, validators
   that run at the system boundary. Symmetric structural cures are the
   default destination for recurring failure modes in shared-state work.

2. **Asymmetric structural cure**: the cure fires only when *this*
   operator triggers the failure mode. The applier is protected; the
   peer is not. Asymmetric cures are flagged in the cure's
   documentation as "applier-only protection — does not prevent peer-
   triggered manifestation".

3. **Behavioural cure (no structural enforcement)**: prose discipline
   that depends on every operator reading and applying it. Always
   one-sided in shared-state contexts; the absence of structural
   enforcement is the gap.

The discipline:

- **A behavioural cure for a shared-state failure mode is incomplete by
  default.** The third or subsequent instance of the failure mode
  triggers a graduation pass to symmetric structural enforcement.
- **An asymmetric structural cure must record its asymmetry.** The
  documentation for the cure (rule body, ADR, governance doc) names
  explicitly that the cure is applier-only and that the failure mode
  remains reachable from non-compliant peers.
- **The third instance of the same shared-state failure mode is the
  symmetric-cure trigger.** Two instances may be coincidence; three
  proves the structural surface is incomplete and a symmetric cure is
  the natural next step.

## Scope

**Adopter scope**: every Practice-bearing repo with shared-state surfaces
(shared git index, shared lockfiles, shared collaboration state, shared
generated artefacts, shared documentation surfaces, shared schemas).
The asymmetric-cure failure mode is a portable shape; the host-specific
implementation choices (which symmetric cure to install, where the
tripwire fires) live as host ADRs.

**Excluded**: cures whose failure mode is only-self-applicable (e.g. the
agent's own context-budget discipline). Symmetric cures are the
discipline for *shared* failure modes.

## Rationale

The asymmetric-cure failure mode is:

- *Invisible until it fires*. The applier completes the work correctly;
  the failure mode shows up only when a peer triggers the same shape
  while the applier is mid-flight.
- *Compounding under multi-agent load*. As N grows, the probability that
  any peer triggers the failure mode against any applier rises rapidly.
  Three observed instances at small N (5–7 active agents) are a strong
  signal that the failure mode will recur.
- *Reframed as "the absent agent's responsibility"*. Authoring a
  behavioural cure can feel complete because the authoring agent applied
  it; the cure's incompleteness only surfaces when reviewing the failure
  modes from the *other* side.

The third-instance trigger is the empirical threshold: at one instance
the cause may be operator error; at two it may be coincidence; at three
the structural surface is the cause and the cure must be symmetric.

A symmetric cure has its own costs: friction (extra steps), false
positives (the symmetric tripwire fires on legitimate work), operational
complexity (more enforcement to maintain). These are real but they are
trades against a structural failure mode that compounds with N. The
trades belong in a host ADR; the *requirement* to install a symmetric
cure once the third instance has fired is portable Practice governance.

## Consequences

**Required**:

- Cure documentation in shared-state contexts records the symmetry
  classification (symmetric / asymmetric / behavioural-only).
- The third instance of a shared-state failure mode is treated as the
  symmetric-cure trigger; consolidation passes that surface a third
  instance route to a host ADR proposing the symmetric implementation.
- Asymmetric structural cures carry a "applier-only protection" warning
  in their documentation so subsequent agents do not mistake them for
  symmetric cures.

**Forbidden**:

- Treating a behavioural cure as complete after the third instance of
  the failure mode has fired. The third instance is the trigger for
  graduation, not for re-asserting the cure.
- Authoring a behavioural cure for a shared-state failure mode without
  a sequenced graduation pointer to its symmetric form.
- Marking an asymmetric structural cure as "structural" without the
  applier-only warning. The asymmetry is part of the substance.

## Implementation

This PDR's host-repo operational application is ADR-177 (Asymmetric-cure
enforcement in staging — host structural-enforcement choice for the
`git commit -- <pathspec>` failure mode). The rule
[`stage-by-explicit-pathspec`](../../rules/stage-by-explicit-pathspec.md)
already records the asymmetric-cure observation and is the existing
behavioural cure; ADR-177 names the symmetric cure that closes the
asymmetry.

## Source

This PDR graduates the substance of the
`pending-graduations.md` entry *"PDR-shaped follow-up (Practice-
governance principle): asymmetric-cure failure mode — a cure that
protects only the applier is not really a structural cure"* (captured
2026-05-04, three instances by 2026-05-05; the entry's "second-context
manifestation required" gate was the fabricated-gate-as-avoidance shape
named at the
[`patterns/fabricated-gate-as-avoidance.md`](../../memory/active/patterns/fabricated-gate-as-avoidance.md)
pattern; the substance is portable on three same-context instances and
graduates with explicit "host-evidence base" status). Owner reframe
2026-05-10 in the `knowledge graduation` session authorises the
graduation.
