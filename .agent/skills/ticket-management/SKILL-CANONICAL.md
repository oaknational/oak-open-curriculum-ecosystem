---
name: ticket-management
classification: active
description: >-
  Author and curate the ticket graph deliberately — scoping, relationships, milestone homes, and
  the standing curation sweep. Use when minting any ticket, deferring or sequencing work, wiring
  blockedBy chains, placing milestone homes, or when the graph has grown dense enough that only
  its authors can navigate it. The graph is authored, not endured.
---

# Ticket Management

Owner ruling (2026-07-27, verbatim): *"we need better scoping and better relationships between
tickets, that is a thing we do, not a thing that happens to us."* The ticket graph is an authored
artefact with the same care standard as code: scoped stories, explicit edges, named homes, and a
curation practice that keeps it navigable by someone who did not write it.

## Scoping — at mint time

- **One story per ticket.** The test is the same as small-PRs: a reviewer (or picker-upper) can
  hold the whole story at once. A ticket needing "and" twice in its title is usually two tickets.
- **Pointers, never specs** (`future-work-items-are-pointers`): carry the finding, its evidence
  home (PR thread, report, comment id), the cure SHAPE, and the decision moments — never
  co-designed implementation detail that will be stale at pickup.
- **Provenance and evidence ride the ticket**: who found it, where the first-hand evidence lives,
  and any owner words verbatim. A ticket whose evidence lives only in a chat transcript is
  unpickable.
- **Blocking posture is explicit** when a dated gate exists — the worked form: a
  "BLOCKS / DOES NOT BLOCK <gate>" header line in the description (instance: the Wednesday
  submission record on MCP-201..213).
- Team and project hygiene per `linear-mcp-team-and-project-hygiene`; milestone homes are
  PROPOSE-AND-AGREE with the owner, in prose — never set unilaterally, never dangled
  (`milestones-propose-agree-never-dangle`).

## Relationships — edges are authored, not implied

- **Sequencing lives in blockedBy edges, not in description prose.** Deferred work is legitimate
  ONLY as an explicit chain (owner ruling 2026-07-26: deferrals need "explicit tickets and
  explicit sequencing for pick up"; worked instance: MCP-152 → MCP-214 (build) → MCP-215 (serve)).
  "Later" without an edge and a carrier is ignoring, not sequencing (`no-stopgaps`).
- **Every edge answers a question a picker-upper would ask**: what must be true before this
  starts (blockedBy), what waits on this (blocks), what shares its evidence base (relatedTo).
  Edges that merely cluster topics are noise — remove them.
- **A finding routed by the review-triage rule** (`pr-lifecycle` §Phase 4 state 3) mints its
  ticket at the moment of routing, with the thread reference in the ticket and the ticket
  reference in the closed thread — the pair is the audit trail.

## Curation — the standing sweep

The graph decays without tending: blockers discharge silently, scopes drift, deferred chains
lose their carriers. Curation is a periodic, deliberate pass — Director-owned unless routed:

1. **Discharged blockers**: tickets whose blockedBy resolved — unblock explicitly and route or
   backlog deliberately.
2. **Stale scopes**: tickets whose described world has moved (superseded rulings, landed cures) —
   re-true the description or close with the superseding pointer; a ticket steering a future
   reader wrong is worse than no ticket (`no-moving-targets-in-permanent-docs` applies in spirit).
3. **Orphan edges and dangling deferred work**: chains whose carrier evaporated get re-carried or
   surfaced to the owner; dense subgraphs only their author can navigate get a one-paragraph map
   comment on the root ticket.
4. **Duplicates**: same finding from different reviewers converges on one ticket with the second
   source cited (worked instance: MCP-199 absorbing a duplicate finding without a new ticket).

## Linear Platform Behaviours (operational facts, recorded 2026-07-31)

- **PR-merge automation auto-closes multi-slice tickets at EVERY slice
  merge**, even with slices outstanding — manually reopen at each landing
  until the final one, or the programme ticket silently reads Done at
  slice 1 of N.
- **The Linear MCP connector refuses ticket writes whose payload carries
  internal planning detail and repo paths** (it treats a general Linear
  permission as insufficiently specific) — keep ticket bodies
  plain-language and pointer-shaped (which the plain-language discipline
  wants anyway), and carry internals in repo surfaces the ticket points at.

## Definition-of-Done Ceremony (owner discipline, MCP-356)

A ticket's Definition of Done changes only by PROPOSAL COMMENT followed by
owner ratification — never by direct edit. A DoD is the owner's acceptance
contract; editing it in place moves the goalposts invisibly. Propose the
change as a comment naming old text, new text, and reason; the owner's
ratifying reply licenses the edit.

## Routing Boundaries

- Owner decisions discovered during ticket work (milestone homes, blocking-posture confirmations,
  scope collisions with owner words) surface as cards at their action moment — the graph records
  the decision, it never makes it.
- This skill governs the GRAPH; the work inside a ticket is governed by its own lane's doctrine.
