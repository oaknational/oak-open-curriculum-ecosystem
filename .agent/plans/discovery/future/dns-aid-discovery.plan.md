---
name: "DNS-AID discovery - DNS layer agent readiness"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-06-01
parent_plan: agentic-mechanisms-discovery.plan.md
---

# DNS-AID discovery plan

> **Strategic brief (`future/`).** DNS-AID is an early Internet-Draft. This plan
> tracks whether Oak should publish DNS-layer agent discovery records and, if so,
> which scope avoids drift from the apex API catalog.

## Purpose

Track DNS for AI Discovery (DNS-AID) as an optional DNS-layer accelerator for
Oak's agent-readiness estate, without duplicating the apex API catalog as a
second service inventory.

Primary reference:

- DNS-AID draft:
  <https://datatracker.ietf.org/doc/html/draft-mozleywilliams-dnsop-dnsaid-02>

## Problem, End Goal, Mechanism, And Means

- **Problem.** Agents may eventually look for AI/service discovery in DNS before
  fetching HTTP well-known documents. Oak's estate already has an apex catalog as
  the truthful service index, so a per-service DNS list would create drift unless
  it is generated from the same source.
- **End goal.** If DNS-AID becomes worth adopting, Oak publishes the smallest
  DNS record set that points agents to the canonical discovery hub and does not
  duplicate the service inventory.
- **Mechanism.** Prefer hub-only `_index._agents.thenational.academy` as the
  DNS entry point. Per-service records are allowed only if generated from the
  same catalog source or separately justified by a real client need.
- **Means.** Track the draft, decide hub-only versus per-service scope, confirm
  DNSSEC/DNS ownership, design generation from catalog source if per-service is
  selected, and validate records after publication.

## Domain Boundaries

This plan owns:

- DNS-AID scope decision;
- `_agents.thenational.academy` record strategy;
- relationship to the apex API catalog and skills index;
- validation commands for DNS records and digest parameters.

This plan does not own:

- the HTTP API catalog itself;
- Agent Skills artifacts;
- MCP Server Cards;
- A2A Agent Cards;
- DNS provider account policy beyond the records needed for this surface.

## Non-Goals

- Do not publish per-service DNS records that can drift from the API catalog.
- Do not treat DNS-AID as a trust signal by itself.
- Do not publish DNS-AID while the draft shape is too volatile for Oak's risk
  posture.
- Do not advertise inactive hosts such as `mcp.thenational.academy` before they
  exist.

## Dependencies And Sequencing

Blocking prerequisites:

- **`blocking`** - Oak chooses DNS-AID scope: hub-only or per-service.
- **`blocking`** - The DNS-AID draft is stable enough for Oak's publication
  posture, or Oak explicitly accepts experimental publication.
- **`blocking`** - DNS zone ownership and DNSSEC posture are confirmed.

Beneficial prerequisites:

- **`beneficial`** - The apex API catalog is generated from a source that DNS
  records can share. *Without it:* publish hub-only or do not publish.
- **`beneficial`** - Agent clients used by Oak partners consume DNS-AID. *Without
  it:* keep this as tracking only.

## Strategic Acceptance Criteria And Success Signals

This strategic plan is successful when:

- future executors can tell that hub-only DNS-AID is the default recommendation;
- per-service DNS is blocked unless it cannot drift from the API catalog;
- no inactive or conditional Oak service is advertised from DNS;
- DNS-AID is clearly optional and subordinate to the HTTP discovery hub.

Success after implementation would mean:

- `_index._agents.thenational.academy` resolves to the discovery hub;
- records validate against the live DNS-AID draft or final standard;
- any digest parameter is generated from the canonical descriptor bytes;
- records are DNSSEC-covered where Oak's zone supports it.

## Promotion Trigger To `current`

Promote when Oak decides to publish DNS-AID records and the live draft/final spec
has a stable-enough shape for the chosen scope.

Promotion must produce executable tasks for DNS ownership checks, record
generation, digest calculation if used, DNSSEC validation, and catalog drift
prevention.
