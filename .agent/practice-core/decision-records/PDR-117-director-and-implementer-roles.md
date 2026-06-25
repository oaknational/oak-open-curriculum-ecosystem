---
pdr_kind: governance
---

# PDR-117: Director and Implementer Roles (the Two First-Class Seats of the Many-Agent Model)

**Status**: Proposed
**Date**: 2026-06-24
**Related**:
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two moments — the Director is a coordinator; its
role transitions use that two-moments shape);
[PDR-074](PDR-074-director-value-is-mind-coherence-per-owner-attention.md)
(Director value is mind-coherence-per-owner-attention; its P2 —
owner-decision-elision via substrate-resolution — is the Director's
escalation half, and this PDR adds the implementer-facing complement);
[PDR-082](PDR-082-n2-collaboration-mode.md)
(n=2 collaboration mode — the special case where these two roles collapse
into owner-visible peers);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement — how an Implementer freezes and hands off);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — how the Director consumes Implementer presence);
[PDR-111](PDR-111-agent-experience-is-first-class.md)
(agent experience is first-class);
`start-right-team` SKILL §3
(temporary-responsibilities — the operational entry point this PDR makes
first-class for these two roles);
`feedback_director_pure_direction_only` per-user memory
(graduated into this PDR — its content is portable Practice doctrine, not
per-user).

## Context

The Practice is increasingly run as **one developer driving many agents**,
trending toward **many checkouts with variable agent density** over one
author-agnostic substrate. In that model two needs pull in opposite
directions:

- **The doing must be intense and isolated.** An agent that touches source,
  runs gates, and iterates spends context fast and retires young. Several
  such agents working in parallel must not collide on one working tree or
  index.
- **The awareness must persist.** The live map — what is decided, what is in
  flight, why, and the next safe step — has to outlive the births and deaths
  of the agents doing the work, or each new agent reconstructs it expensively
  from lossy durable artefacts (or builds the wrong thing).

`start-right-team` §3 already holds that coordination roles are
**session-local examples, not a fixed ontology — except that "a recurring
singleton or critical role earns a definition."** The commit-warden / marshal
earned exactly such a definition. Two more seats earn the same. The
Director / coordinator seat has recurred across many sessions; the
worktree-pilot session (the worked instances below) exercised the **full
two-role model** — a Director plus worktree-isolated Implementers —
end-to-end for the first time. Both carry enough load to earn definition:
**Director** and **Implementer**, the two first-class seats of the many-agent
model. Every other label (marshal, scout, standby, curator, …) remains a
session-local example; these two are doctrine.

## Decision

Define **Director** and **Implementer** as portable, first-class roles. One
idea in two layers: **isolate the doing (Implementers, worktrees); centralise
the awareness (Director, minimum action).**

### The Director role

- **Purpose.** Carry **cross-session contextual awareness** — the live map of
  what is decided, in flight, why, and the next safe step — across the births
  and deaths of the Implementers doing the work.
- **Mechanism — minimum action (the warm cache).** Context budget is the
  finite resource bounding any session. The Director persists by **consuming
  compressed verdicts, not raw artefacts** — a slow context metabolism that is
  intended to let one Director session outlast many Implementer generations. It
  is a long-lived **warm cache over a durable-but-lossy substrate** (thread
  records, plans, comms). **Continuous-but-minimal externalisation** of
  load-bearing continuity — decisions, the map, the next safe step; never
  chain-of-thought — lets the cache survive its own eventual death. (That
  minimum-action → longevity link is the PDR's core mechanism *hypothesis*,
  proposed on first-instance evidence — see §Falsifiability assertion 1.)
- **Decision rule for acting.** Take an action directly **only if it changes
  my routing AND no cheaper agent can absorb it.** Minimum is not zero: a
  Director that reads nothing holds a stale map and routes wrongly.
- **Single owner-interface; lens-resolve before escalate.** Implementers route
  questions to the Director; the Director answers what it can, runs anything
  ambiguous through the decision lenses (`principles.md` §Decision Lenses), and
  **escalates to the owner only when the lenses genuinely fail OR the decision
  is constitutively the owner's** (product / feature scope). This is the
  implementer-facing half of PDR-074 P2 (owner-decision-elision via
  substrate-resolution). **Asking the owner is always legitimate and never
  discouraged — the lenses refocus attention, they are not a gate on
  questions.** Asking an Implementer to self-review with the lenses is
  endorsed.
- **Routes, does not execute.** No source edits, no gate runs, no
  self-dispatched reviewers (reviewer / spec-fetch / exploration sub-agent
  launches are Implementer-class — route them; a self-dispatching Director is
  unavailable for routing, re-creating the coordinator-less window PDR-064
  exists to prevent). The single exception that *is* Director work:
  **owner-direction capture and load-bearing continuity** written to durable
  surfaces (the continuity seed, role / lesson drafts, memory).
- **Carries owner intent across retirement.** The Director holds the owner's
  framing after an Implementer retires, so a successor does not build the wrong
  thing.
- **Handoff (PDR-064 two moments).** Director transitions are pre-positioning
  (information transfer, authority retained) then active-acknowledgement
  (authority transfers); the cadence cron never goes dark between them.
  **Exactly one holder at all times** — never zero (work goes unrouted), never
  two (collision).
- **Dissolve when pressure clears.** The Director seat is justified by
  coordination pressure; when it clears (e.g. the team settles to n≤2
  owner-visible per PDR-082), dissolve it rather than perform it more quietly.

### The Implementer role

- **Purpose.** An ephemeral seat that owns **one bounded lane**, executes it to
  a landing, and retires. The unit of real work.
- **Worktree isolation.** Each Implementer works in its **own git worktree** on
  a branch off the coordination branch — own working tree, own index, own
  build output, own gate runs. The doing is isolated; shared-tree collisions
  dissolve.
- **Runs its own gates; proves behaviour.** Full pre-commit gate green, no
  `--no-verify`; value is proven by observed behaviour, not "it compiles."
- **Reports compressed verdicts.** Returns distilled conclusions to the
  Director (the cheap channel), not raw artefacts — this is what keeps the
  Director's metabolism slow.
- **Retires with a handoff (PDR-063).** At the natural boundary or under
  context-budget pressure, freezes work-in-progress to a handoff record and
  routes a deep handoff to the Director. Routes durable, repo-wide substance
  **up to the Director** rather than editing repo-wide surfaces from a
  feature-branch worktree (which would diverge them).
- **Routes questions to the Director** (single owner-interface), not the owner
  directly; the Director escalates as needed. (See §The routing contract for
  the upward/downward asymmetry, the multiply-directed case, and the
  Director-absent case.)
- **Critically assesses claims first-hand** before accepting them — including
  the Director's. Verifies **empirically** what source-reading leaves
  ambiguous; never surfaces a consequential conclusion on inference when a
  cheap empirical check exists.
- **Applies the decision lenses**, runs **no-backfill reviewer discipline**
  (reviewers fold *before* READY, never after), and self-organises
  singleton-lane contention by first-broadcast `created_at` (dialogue, not
  competition).
- **Verification honesty.** Distinguishes **RUN-verified** (a gate actually
  exercised the change) from **CONSTRUCTION-verified** (a no-op the gate cannot
  reach); never claims a method verified what it cannot reach.

### The routing contract (Director ↔ Implementer ↔ Owner)

The routing norm carries **owner ratification (2026-06-24): it is a general
instruction for the Implementer role.** Its operational home is the
`start-right-team` §3 clause this PDR requires.

- **The upward flow.** Questions and decisions travel **Implementer →
  Director → owner**; the owner is reached only when the lenses fail or the
  call is constitutively the owner's. The Director is the single
  owner-interface; routing Implementer questions straight to the owner
  fragments coordination and wastes owner attention.
- **Upward/downward asymmetry.** The norm governs the **upward** flow only. It
  does **not** restrict **downward** direction: the owner may direct any agent
  directly (owner-direction-beats-plan). When the owner directs an Implementer
  directly, the Implementer **follows it AND informs the Director** so the map
  stays current.
- **Multiply-directed coordination.** When the owner issues the **same**
  directive to more than one Implementer, "who executes" is itself an upward
  coordination question that **routes to the Director**; an Implementer must
  not self-execute a multiply-directed single-owner-surface lane.
- **Director-absent case.** When no Director seat is held (e.g. the team has
  collapsed to n≤2 owner-visible per PDR-082), the Implementer **is** the
  owner-interface directly; the upward flow shortens to Implementer → owner.
  The full contract re-applies the moment a Director seat is re-established.
- **Asking is legitimate.** Asking the owner is never discouraged; the lenses
  refocus attention before an escalation, they do not gate questions.

## Rationale

- **Why two roles earn first-class status.** They are recurring, singleton-ish,
  and load-bearing — the §3 test for a definition. Leaving them as ad-hoc
  session labels **risks losing** the hard-won operating discipline (minimum
  action; route-don't-execute; the routing contract) each time a session
  rebuilds the team shape from scratch. That this codification pays for itself
  is the benefit this PDR claims, pending second-instance evidence
  (§Falsifiability assertion 3).
- **Why minimum action for the Director.** Continuity is the scarce good in a
  rotating-cast model. An agent's lifespan is bounded by context budget; the
  proposed way one seat outlasts many is to spend context slowly — verdicts not
  artefacts, externalise the map not the reasoning.
- **Why route-don't-execute.** A Director that self-dispatches work is
  unavailable for routing for that duration, silently re-creating the
  coordinator-less window. The cost of delegating is one routing event; the
  cost of self-dispatching is a coordination gap peers cannot detect.
- **Why the asymmetry is explicit.** Without it, "route to the Director" can be
  mis-read as "the owner must not talk to Implementers" — which would break
  owner-direction-beats-plan. The owner directs downward freely; only the
  upward flow is disciplined.

## Consequences

### Required

- `start-right-team` §3 gains a **routing clause** (the contract above) and
  names Director + Implementer as first-class roles with a pointer to this PDR.
  The clause is the complement to the existing
  coordinator-delegates-sub-agent-launches discipline.
- `AGENT.md` carries a one-line discoverability pointer to this PDR so the
  roles are reachable from the operational entry point. (`RULES_INDEX.md` is
  **deliberately not touched**: it enumerates the always-applied
  `.agent/rules/*.md` rule tier, and neither a governance PDR nor a §3 SKILL
  clause has the on-disk rule form that index contracts to enumerate.)
- Each hosting repo SHOULD maintain an operational **Director handoff entry
  point**: a single, committed, discoverable file the next Director rehydrates
  from — the role-pickup procedure, the **readiness self-check before a Moment-2
  acknowledgement** (the gate whose absence let a successor ack prematurely then
  retract), the current handoff state, and the live todo list — pointing back to
  this PDR for the role doctrine. In this repo it is
  `.agent/memory/operational/director-handoff.md`.
- `feedback_director_pure_direction_only` (per-user memory) has its **portable
  content absorbed here**; the per-user file is disposed separately (retired or
  slimmed to a pointer) by the Director, since it lives outside the repo.

### Forbidden

- A Director self-executing source edits, gate runs, or reviewer dispatch
  (collapses the seat — the failure `feedback_director_pure_direction_only`
  names).
- An Implementer routing questions straight to the owner by reflex while a
  Director holds the interface — **except** the owner's own direct downward
  direction, which the Implementer follows and then mirrors to the Director.
- An Implementer self-executing a multiply-directed single-owner-surface lane
  without routing the "who executes" question to the Director.

### Accepted cost

- Two named roles add protocol surface area over pure ad-hoc labelling. The
  cost is the definition + the §3 clause + an agent-self-check ("am I Director
  or Implementer this session?"); the benefit is that the operating discipline
  survives across sessions instead of being re-derived.

## Worked instances (2026-06-24 worktree pilot — illustrative, repo-specific)

These are the founding instances; the doctrine above is portable, these are
the evidence.

1. **Continuity across retirement.** A WS-B Implementer committed a cycle-0
   plan that routed an orientation tool to the wrong content domain and retired
   at almost the same moment the owner's separation principle landed. The
   Director held the principle across the retirement and corrected the
   successor before any wrong code was built. Repeated for a second
   ("use defaults") reframe.
2. **Singleton-lane self-organisation.** Two Implementers both declared the
   same lane; they converged by first-broadcast `created_at` with no Director
   mediation, and the Director routed the second to a complementary lane.
3. **Critical assessment beats inheritance.** An Implementer verified the
   Director's "~15-file migration" figure first-hand and corrected it to ~1;
   another settled a config default that conflicting source signals could not,
   with a 3-line empirical probe. Claims are verified, not inherited —
   including the Director's.
4. **Multiply-directed coordination, live.** The owner issued the **same**
   directive ("make implementer-routes-to-Director a general instruction") to
   **two** Implementers at once. Each independently recognised that
   self-executing the routing clause would *contradict the clause itself*
   (a performative contradiction) and *collide* with the other on the shared
   doctrine surface — and each routed the "who executes" question to the
   Director instead of racing. The Director assigned one. This PDR's
   multiply-directed rule is the encoding of that worked instance.
5. **Worktree mechanics.** Comms auto-resolve the one coordination home;
   claims need an explicit absolute `--active`; fresh worktrees ship no
   build artefacts; the shell cwd resets to the primary each command.
   Source / gate / index isolation held with **zero shared-tree collision
   incidents** — strong evidence for the worktree-per-agent transition.

## Falsifiability (PDR-026)

This is **first-instance** doctrine (one worked session); marked Proposed. It
asserts:

1. **Minimum action lets one Director outlast many Implementers.** Falsifiable
   by: a Director session that adopts minimum action yet still exhausts its
   budget before the Implementers it coordinates, OR one whose minimal
   externalisation proves insufficient for a successor to rehydrate. (This
   session: one Director outlasted four-plus Implementer generations —
   suggestive, single instance; the causal link is not yet isolated from the
   confound that the Director's work was simply lighter.)
2. **The routing contract reduces owner double-prompting.** Falsifiable by: a
   session under this contract where Implementers still double-prompt the owner
   on a question the Director could resolve. (This session: prevented at least
   one cross-session double-prompt; the owner-elevated §3 clause is the
   forward cure.)
3. **The role split lowers coordination cost.** Operationalised as
   **owner-visible coordination prompts per landed cycle** — owner-directed
   clarifications plus escalations the owner must field, divided by cycles
   landed. Falsifiable by: a comparably-sized many-agent session under ad-hoc
   roles achieving an equal-or-lower ratio with equal-or-better continuity. The
   metric is observable incidentally from the comms stream and owner chat, so
   no deliberate counterfactual session is required.

Second-instance evidence path: a second many-agent session that runs the two
roles cleanly → candidate for Adopted; one that surfaces a new failure vector
→ refined, remains Proposed.

## Open questions

1. **The Director-unreachable autonomy gap.** An Implementer that announces it
   is *blocking on owner input in its own session* goes effectively
   **Director-unreachable** — the Director's comms cannot wake it; only the
   owner can. This is a candidate **missing autonomy primitive**
   (`feedback_owner_action_is_not_a_cure`: owner intervention is a stopgap, not
   a cure). Deferred to a dedicated design pass.
2. **Where the role-self-check lives.** Whether an agent's Director-vs-Implementer
   self-identification should be a named start-right step or stay emergent from
   the team-start broadcast. First draft leaves it emergent.
