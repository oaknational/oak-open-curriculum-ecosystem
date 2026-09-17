# Linear MCP Team and Project Hygiene

Owner ruling (2026-07-23, issued while correcting a mis-minted AIP-182;
his phrasing — "was 'only ever the MCP team' ambiguous?" — marks it as a
previously-established instruction, not a new one): "In Linear, ALL of
our tickets MUST be MCP- tickets, NEVER AIP- tickets … we are the MCP
team, AI-Platform is a _different team_." And: every ticket in the
correct team AND the correct project. The why is measurement integrity —
"otherwise our progress measurements will be wrong, one way or the
other": burndown, milestone, and DORA numbers corrupt in BOTH teams when
a ticket sits in the wrong home.

## Trigger

Any Linear ticket write — minting, moving between teams or projects,
bulk audits of ticket placement — and any moment a ticket's team or
project is being chosen.

## Action

- **Mint only in the MCP App Pathfinder team** (`MCP-` identifiers,
  `linear.app/oaknational/team/MCP`). Never AIP- or any other team,
  whatever the work class (product, doctrine, infra).
- **Pick the correct project at mint time.** Release work takes the
  release project; the OKR and Ontology projects are legitimate
  MCP-team homes for their own workstreams (owner placements).
- **Project scope is submission-relevance** (owner ruling 2026-07-31,
  verbatim substance): "the MCP Linear project should only contain
  information relevant to the imminent submissions, general work and
  knowledge stays in the repo" — general engineering/hygiene tickets
  take the MCP team but NOT the submission project. Tickets are
  delivery pointers, never the sole home of durable knowledge: the repo
  home lands first, the ticket carries the pointer.
- **Classification test for "ours"**: creator plus content referencing
  this repo, the MCP app, or the design system. Fix any of ours found
  in the wrong team or project — including historic misplacements
  (Linear re-numbers team moves to `MCP-xxx`; old `AIP-*` identifiers
  that redirect to `MCP-*` tickets are aliases from past moves, already
  correct).
- **Never move tickets that belong to other teams** — "only move
  tickets that you know are ours, do not steal tickets that actually
  belong to other teams." Other-creators' platform work stays put, as
  do tickets the owner deliberately placed elsewhere.
- **Tickets are minted at owner word, never as a default session
  output** (owner ruling 2026-08-31, verbatim core: "there is no need or
  desire to produce linear tickets for everything, just because an MCP
  server isn't authenticated it doesn't mean we should use it"). A
  connector's presence in the environment is not a request to use it,
  and its auth state is not surfaced unprompted. Delivery lanes still
  open ticket-first at their start (the DORA discipline); the ruling
  governs speculative minting, not lane opening. Before minting for a
  live finding, characterise it against a control AND search Linear
  first: a changelog 404 that looked like a fresh regression failed
  identically on the control preview and was already MCP-626/630/653,
  two weeks old (2026-09-02).

## Worked Instances

- 2026-07-23: AIP-182 minted in the wrong team drew the ruling; the
  same-day audit fully enumerated the AIP team (137 tickets), moved the
  historic strays (old AIP-137/157/159 now redirect to MCP tickets),
  and homed the MCP team completely after MCP-1 (a test artifact) was
  cancelled.
- 2026-07-31: MCP-446/447 (general hygiene work) moved off the
  submission project at the moment the project-scope ruling landed.

## Why a Rule, Not a Memory

The ruling lived only in per-user vendor memory, while
[`ticket-management`](../skills/ticket-management/SKILL-CANONICAL.md)
already cited this rule by name — a dangling doctrine pointer, found by
the 2026-08-05 vendor-memory graduation audit. Per-user memory is
platform-scoped and rotates; a ruling every seat must obey at every
ticket write belongs in the always-discoverable rule tier the skill was
already pointing at.

## Related Surfaces

- [`ticket-management` SKILL](../skills/ticket-management/SKILL-CANONICAL.md)
  — the authoring discipline that cites this rule for team and project
  hygiene.
- [`bot-identity-on-third-party-systems`](./bot-identity-on-third-party-systems.md)
  — whose name the ticket write surfaces displays; this rule governs
  where the ticket lives.

## Enforcement

Behavioural at the ticket-write moment. Placement is observable and
cheap to audit (team identifier prefix, project field); any audit that
finds one of ours mis-homed fixes it under the classification test
above and records the move.
