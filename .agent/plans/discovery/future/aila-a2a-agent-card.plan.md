---
name: "Aila A2A Agent Card - conditional remote-agent discovery"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-06-01
parent_plan: agentic-mechanisms-discovery.plan.md
---

# Aila A2A Agent Card plan

> **Strategic brief (`future/`).** This plan exists only for the conditional
> case where Oak chooses to expose Aila as a real A2A server for third-party
> agents. Until then, Aila stays off the public discovery map.

## Purpose

Track the discovery and trust work needed if `aila.thenational.academy` becomes
an Agent-to-Agent (A2A) endpoint.

Primary references:

- A2A latest specification: <https://a2a-protocol.org/dev/specification/>
- A2A agent discovery guide:
  <https://a2a-protocol.org/latest/topics/agent-discovery/>

## Problem, End Goal, Mechanism, And Means

- **Problem.** Aila is an Oak lesson-creation surface, not automatically a
  third-party callable agent. Publishing an A2A Agent Card before a strategic
  exposure decision would imply a delegation surface Oak may not intend to offer.
- **End goal.** If Oak decides Aila should answer to third-party agents, Aila has
  a truthful Agent Card on its own host, with an auth model, capability boundary,
  safety posture, and catalog linkage.
- **Mechanism.** A2A uses an Agent Card to describe a remote agent's identity,
  capabilities, skills, service endpoint, and authentication requirements. The
  card belongs on the Aila service host, not the apex.
- **Means.** Wait for the exposure decision; then define Aila's allowed
  agent-to-agent tasks, auth model, public metadata, safety review, catalog edge,
  and validation suite.

## Domain Boundaries

This plan owns:

- conditional Aila Agent Card discovery;
- Aila A2A publication boundary;
- catalog linkage if Aila ships;
- public metadata and auth/safety proof for A2A exposure.

This plan does not own:

- Aila product UX;
- lesson-creation policy;
- MCP Server Cards;
- Agent Skills workflows;
- generic A2A adoption outside Aila.

## Non-Goals

- Do not publish `/.well-known/agent-card.json` for Aila until Oak chooses Aila
  as an A2A server.
- Do not infer A2A exposure from Aila's existing human-facing product.
- Do not list private, internal, or experimental lesson-generation capabilities.
- Do not add Aila to DNS-AID or the API catalog before the A2A decision.

## Dependencies And Sequencing

Blocking prerequisites:

- **`blocking`** - Oak decides Aila should answer to third-party agents.
- **`blocking`** - Aila's A2A auth model is chosen.
- **`blocking`** - Public capability descriptions are reviewed for safety and
  product accuracy.
- **`blocking`** - The live A2A Agent Card path/schema is re-checked.

Beneficial prerequisites:

- **`beneficial`** - Partner demand exists for Aila A2A. *Without it:* keep the
  plan in future.
- **`beneficial`** - DNS-AID scope is decided. *Without it:* publish only the
  HTTP Agent Card and catalog edge if Aila ships.

## Strategic Acceptance Criteria And Success Signals

This strategic plan is successful when:

- future executors know Aila is conditional, not pending implementation;
- the A2A Agent Card is assigned to `aila.thenational.academy`, not the apex;
- auth and safety review are blocking, not post-publication polish;
- the catalog/DNS updates are sequenced after the Aila exposure decision.

Success after implementation would mean:

- `aila.thenational.academy/.well-known/agent-card.json` returns a valid public
  Agent Card;
- the card contains no sensitive credentials or internal details;
- the auth model is discoverable or documented honestly;
- the apex catalog links to Aila only after the public endpoint is live.

## Promotion Trigger To `current`

Promote when Oak makes the strategic decision that Aila should expose an A2A
agent-to-agent surface.

Promotion must produce executable tasks for Agent Card validation, auth metadata
or `Auth.md`, endpoint checks, safety review, catalog linkage, and optional
DNS-AID linkage.
