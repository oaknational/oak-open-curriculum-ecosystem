---
id: coordination-substrate
node_type: strategic
name: "Coordination substrate — a self-describing fleet coordination system"
overview: >-
  The machinery by which many agents on many machines coordinate work on this
  repository is a governed system whose knowledge lives entirely in the
  repository — losing any third-party surface loses schedule state only, never
  design.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-07
ratified_where: >-
  In-session owner word "Ratified, land the stamps", 2026-08-07,
  following presentation of all three nodes (Director seat, Panther
  rides Midnight 7efb00); commissioning instruction and the verbatim
  revocation principle earlier in the same session.
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-08-07
---

# Coordination substrate — a self-describing fleet coordination system

> "If the repo were to lose authorisation to access this specific Linear
> project it should lose ZERO information about the repo, it should lose
> only information about the service that the deployed code and
> third-party systems together provide."
>
> — the owner, 2026-08-07, commissioning this node. The same sorting
> principle as the plan-node schema's governing clause ("if it moves when
> the schedule moves, it lives in Linear; if it only moves when the
> product moves, it lives in the repository") and the 2026-07-31 ruling
> ("the repo holds the knowledge, the ticket holds the work"), restated
> as a revocation test — which makes it runnable.

## Outcome

The coordination substrate — seats and their authority, work claims and
their liveness, the comms event stream, coordination-branch mechanics,
handoff records — is a deliberately designed system rather than an
accretion of conventions. Its **state** stays machine-local and
instance-tier by design (ADR-199 / PDR-094); its **designs, invariants,
and rationale** are repository artefacts under this node. A reader with
repository access alone can understand, rebuild, or extend any part of
the substrate.

## The bet

Two mechanisms, one direction — replace remembered facts with
derivable-or-registered facts:

- **Knowledge drains to wherever work is minted unless a structural home
  exists.** The founding instance: the coordination-branch naming design
  was authored in full on its Linear ticket — before this node existed
  there was no `serves:` target for it, so ticket-first discipline made
  the schedule surface the knowledge home by gravity. The cure is this
  node existing, not vigilance.
- **The revocation test is the family's conformance instrument.** It is
  the estate's delete-and-rebuild survivability discipline (already
  standing for lockfiles) generalised to knowledge homes: for any
  substrate design, ask what a repository-only reader loses if a
  third-party surface disappears. The answer must be schedule state —
  assignment, due dates, notification routing, the service that the
  deployed code and third-party systems together provide — and nothing
  else.

Deliberately not done instead: mirroring third-party state into the
repository (schedule state belongs to the schedule surface — the sorting
test cuts both ways), and legislating for surfaces the owner has not yet
ruled on (the principle is stated for Linear; whether pull-request
bodies deserve the same test is an open question this node names and
does not decide).

## Success looks like

- Every substrate design decision is readable from repository artefacts
  alone — plans under this node, ADRs for landed substrate phenotypes
  (the ADR-182/183/199 lineage), and rules for operating discipline.
  Tickets in the family are thin pointers carrying schedule state.
- The revocation test passes on inspection at any time: no substrate
  knowledge exists only on a third-party surface.
- New work in the family arrives as a delivery plan serving this node,
  with its ticket minted as the pointer — not the reverse.
- This node does **not** claim: that the substrate's runtime state
  becomes tracked (it stays instance-tier by design), or that existing
  scattered records are retro-migrated wholesale (they are homed as they
  are touched).

## Delivery

Delivery plans serving this node declare `serves: coordination-substrate`
— enumerate them by search, never by a hand-kept list. Milestones and
execution state live in Linear as projections; this node points at them,
never mirrors them.
