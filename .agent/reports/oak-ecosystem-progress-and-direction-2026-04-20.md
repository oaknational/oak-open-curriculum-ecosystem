---
title: "Oak Open Curriculum Ecosystem — Progress and Direction"
status: active
last_reviewed: 2026-04-20
audience: mixed (technical edtech, AI, engineering leadership)
---

# Oak Open Curriculum Ecosystem — Progress and Direction (April 2026)

## Framing

The [oak-open-curriculum-ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem)
turns Oak National Academy's open curriculum data into AI-native infrastructure
that is straightforward to build on, and is itself an exemplar of safe,
high-throughput agentic engineering. The thesis is leverage: one infrastructure
investment supporting many downstream tools — for teachers inside the AI
clients they already use, and for edtech and AI developers inside the
environments they already work in. The repository code is released under an
open MIT licence so the wider education, edtech, and AI sectors can benefit
directly; curriculum content licensing remains governed by upstream Oak / OGL
terms (see [docs/foundation/VISION.md](../../docs/foundation/VISION.md) and
[LICENCE-DATA.md](../../LICENCE-DATA.md)). The repository has a deliberate
dual identity: a production product surface, and a working demonstration of
the agentic engineering Practice that built it.

## What we have delivered

Two milestones are complete: M0 (open private alpha — repository public on
GitHub) and M1 (invite-only alpha — live HTTP MCP server at
`curriculum-mcp-alpha.oaknational.dev`, v1.0.0 released). Per the
[high-level plan](../plans/high-level-plan.md) and
[milestone summaries](../milestones/README.md), the delivered work clusters
into three reinforcing layers.

**Product surfaces.** A strict, type-safe TypeScript Curriculum SDK generated
end-to-end from the upstream OpenAPI schema, so any upstream API change flows
through `pnpm sdk-codegen` into all dependent workspaces; a fully
standards-compliant MCP server (HTTP and stdio) exposing Oak's curriculum to
ChatGPT, Claude, Cursor, and other MCP-capable clients; a hybrid semantic
search service on Elasticsearch Serverless with all the code needed to
recreate it for internal or external use, plus its own SDK and MCP tools so
the Oak corpus is fully discoverable from natural-language requests; an MCP
Apps UI extension surface delivering a deeper visual experience aimed at
teachers; and Clerk-managed authentication and authorisation. The search
service is benchmarked through a ground-truth protocol (MRR 0.983 on lessons,
41 ground truths across four indices) and matches or exceeds the existing
product search surface.

**Engineering exemplar.** The monorepo is organised along disciplined lines —
core packages do one job and have no dependencies, libraries compose core
packages without importing each other, apps consume libraries and export
nothing. Every third-party integration (Sentry, Elasticsearch, Clerk) is held
behind a local adapter so the system degrades gracefully when a provider is
unavailable and provider switches stay cheap. The repo carries 130+ ADRs, 21
specialist sub-agent reviewers, and an always-blocking quality-gate suite
(see [docs/foundation/strategic-overview.md](../../docs/foundation/strategic-overview.md)),
with a dedicated onboarding flow and progressive-disclosure documentation. A
schema-first cardinal rule ensures that all static types, validators, and
guards flow from the OpenAPI schema, removing entire classes of drift.

**The Practice.** A self-reinforcing agentic engineering framework spanning
research, planning, development, validation, release, and self-improvement.
Control loops (gates, reviewers, strict rules) maintain quality within
seconds of authoring; learning loops (napkin → distilled → ADRs/governance
via `jc-consolidate-docs`) compound knowledge into permanent doctrine;
continuity mechanisms preserve context across multiple time horizons (see
[docs/foundation/agentic-engineering-system.md](../../docs/foundation/agentic-engineering-system.md)).
A portable Practice Core travels between repositories via the
[plasmid exchange model](../../docs/architecture/architectural-decisions/124-practice-propagation-model.md),
so improvements developed in one repo flow back to others — the
self-improvement is local *and* distributed, and accelerates as more repos
join the exchange.

## What we are doing now (Milestone 2 in flight)

Four lanes are currently open against the open-public-alpha gate.

The **Sentry and OpenTelemetry foundation** is being deployed under the
five-axis observability principle (engineering, product, usability,
accessibility, security) ratified in
[ADR-162](../../docs/architecture/architectural-decisions/162-observability-first.md).
Runtime integration is complete; the remaining work is credential
provisioning and the deployment evidence bundle for the HTTP MCP server. The
collection's plan-density invariant is itself part of the discipline:
planning capacity is governed alongside execution capacity (see
[.agent/plans/observability/README.md](../plans/observability/README.md)).

The **user-facing MCP App search experience** introduces a `user_search`
surface that demonstrates the MCP Apps standard end-to-end and gives
teachers a self-directed semantic search experience inside their AI client of
choice. Together with the observability evidence bundle, this is the second
of the two M2 / public-alpha blockers.

The **knowledge graph alignment audit** runs the first canonical overlap
check between the formally modelled Oak Curriculum Ontology and the
search-facing records, with a deliberate direct-use-first stance: any
commitment to Neo4j, Stardog, or another serving platform is held back
until a real direct-use baseline and prototype comparison exist (see
[.agent/plans/knowledge-graph-integration/README.md](../plans/knowledge-graph-integration/README.md)).

The **Practice itself continues to evolve**: governance-plane concept
integration, operational-awareness surface separation, hallucination and
evidence-guard adoption, mutation testing, the Reviewer Gateway upgrade,
and a growing roster of specialist capability triplets (Elasticsearch,
Sentry, and Clerk shipped or in flight; Express, cyber/web-API security,
privacy/GDPR, OOCE-internal, planning, TDD, and DevX queued).

## Adjacent threads worth naming

Several threads sit beyond the headline lanes and deserve to be visible.

**Open education knowledge surfaces.** The
[knowledge-graph-integration collection](../plans/knowledge-graph-integration/README.md)
composes Oak with EEF Toolkit evidence, Education Skills surfaces, and an
international comparator that routes the Finnish Opetushallitus public
curriculum API through the same OpenAPI → SDK → MCP pipeline as the first
external consumer. That second source is a deliberate test of the pipeline's
portability claim — if the framework only fits Oak it is not a framework.

**Aila complementarity.** The relationship with Oak's AI lesson-planning
assistant is explicit and reinforcing rather than overlapping: shared
curriculum retrieval, a shared knowledge-graph path, and shared safety
patterns. Infrastructure work here strengthens product work there, and
vice versa.

**Continuity and institutional memory.** The napkin → distilled → patterns →
ADR layering, the experience records, and the dated reports surface together
form an answer to a question this kind of work raises directly: *where does
institutional knowledge live when agents do most of the coding?* It lives
in the repository, where both humans and agents read it.

**Plan governance.** The planning system is itself governed. Plans move
through `future/` → `current/` → `active/` → `archive/` lifecycles, every
plan carries activation triggers, and density invariants (such as the one in
the observability collection) prevent planning capacity from outrunning
execution capacity. A large research backlog is therefore an asset, not a
liability.

## Impact and value

The intended impact compounds through three orders of effect, drawn from the
[vision](../../docs/foundation/VISION.md). First-order: Oak can deliver
SDK, MCP, and search infrastructure safely and quickly under the Practice.
Second-order: Oak teams and external developers can build faster on typed
APIs, search primitives, and MCP access to curriculum data. Third-order: the
tools and workflows those builders create reduce teacher planning workload
and improve teaching quality at scale. The MIT licence acts as a force
multiplier across each order — every adopter is a potential contributor of
patterns, evidence, and improvements back into the ecosystem.

## Next directions

In the near term, closing M2 unlocks the open public alpha: the deployment
evidence bundle for Sentry + OTel, and the user-facing MCP App search
experience. M3 / public beta is scoped around production Clerk migration
(social providers, public sign-up, edge rate limiting), exemplar UI
hardening, operational alerting on the observability foundation, and a
PostHog integration that has already been researched and planned. Beyond
the milestone gates, two longer arcs are explicit: making the search
service available from the upstream Oak API so its discovery affordances
flow directly into Oak's primary product surface, and continuing to deepen
the Practice — expanding the specialist roster, hardening continuity and
memory systems, and nurturing the cross-repo Practice ecosystem so
improvements travel both ways.

## On the backlog (and why that is healthy)

The repository carries a large body of research spanning product,
engineering, and agentic-interaction work — enough to keep the project at
the frontier for years. That is governed depth, not bloat. Nothing is
promoted into a plan without an activation trigger, multiple plan classes
have their own validation mechanisms, and dormant plans either fire,
evolve, or close. The repository is designed to be self-explanatory; the
fastest way to understand any of the threads above in detail is to read
[docs/foundation/strategic-overview.md](../../docs/foundation/strategic-overview.md)
and ask the repo about itself.
