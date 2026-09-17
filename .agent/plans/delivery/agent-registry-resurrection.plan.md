---
id: agent-registry-resurrection
node_type: delivery
name: "Resurrect the deliberate per-repo agent registry"
overview: >-
  Find and resurrect the estate's deliberate per-repo registry of agents —
  the declared team-state surface, not the emergent transform of the claims
  registry — so "who is working here" has one authoritative,
  platform-neutral answer.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

# Resurrect the deliberate per-repo agent registry

Authored at the owner's word (2026-08-11 morning): "we need to find and
resurrect the per-repo registry of agents, the deliberate one, not the
emergent transform of claims, as a plan, not as immediate action." The
word arrived alongside a demonstrated hazard: the platform's
session-listing presents as an agent census while being Claude-only —
a repo with a live Codex teammate listed as empty (the census illusion,
recorded in `.agent/analysis/2026-08-11-comms-landscape-s2s-arc-stream.md`).
The claims registry answers "who holds what" as an emergent by-product;
nothing today answers "who is on this repo's team, on what platform,
reachable how" as a DECLARED fact.

## Goal

One deliberate, platform-neutral, per-repo registry of agents: every
seat working the repo is a declared row (identity, platform, lane,
reachability), maintained at session boundaries, consulted as the
authoritative census by every who-is-working decision — with the claims
registry remaining the activity view and the platform's session listing
demoted to Claude-side corroboration.

## Mechanism

Archaeology first, then resurrection shaped by what is found — the
registry existed deliberately once and its design decisions should be
recovered, not re-invented (retention is knowledge: the deleted plan
`.agent/plans/agent-tooling/current/team-state-register-and-session-shape-icons.plan.md`
is the strongest recovered lead; `register-identity-on-thread-join` and
`register-active-areas-at-session-open` are the surviving behavioural
descendants, both now pointing at the claims surface).

## Acceptance criteria (each with a proof)

1. **The prior registry's design is recovered and dispositioned** —
   proof `repo-safe`: a recovery note in the plan (or its successor
   ADR) cites the historical files/commits and states what is adopted,
   superseded, or dropped, each with a reason.
2. **A declared registry exists and is populated** — proof `repo-safe`:
   the registry file validates against its schema in CI, and every
   live seat at landing time has a row (including non-Claude seats).
3. **The census question routes to it** — proof `repo-safe`: the
   session-open and thread-join rules name the registry as the census
   surface; the census-illusion hazard note in the comms-landscape
   analysis points at it as the cure.
4. **Owner ratification of the resurrected shape** — proof
   `owner-held`: Jim's stamp on this plan after T1's recovery note
   fixes the shape.

## Todos

- T1: Archaeology — recover the deleted team-state-register plan and
  any implementation traces from history; write the recovery note
  (adopt / supersede / drop per element).
- T2: Present the recovered shape + resurrection sketch for
  ratification (the plan returns to the owner with T1's findings).
- T3: Implement per the ratified shape (schema-first, validator in CI,
  session-boundary maintenance folded into start-right/wrap).
- T4: Re-point the census consumers (rules, comms-landscape analysis,
  any liveness protocol steps) at the registry.

## Out of scope

- Immediate action of any kind (owner word: "as a plan, not as
  immediate action") — this node carries intent until ratified.
- Replacing the claims registry — it remains the activity/holding
  view; the agent registry is the declared team view.
- Cross-vendor interrupt channels (the comms-landscape analysis's
  separate thread).
