---
title: "Oak Open Curriculum Ecosystem — Progress and Direction"
status: active
last_reviewed: 2026-04-20
audience: mixed (technical edtech, AI, engineering leadership)
---

# Oak Open Curriculum Ecosystem — Progress and Direction (April 2026)

## Why this exists

Oak National Academy publishes a deeply resourced, fully sequenced UK
curriculum through a public, open-licensed API. The Oak Open Curriculum
Ecosystem is a small, disciplined project that turns that public asset into
AI-native infrastructure: typed SDKs, a standards-compliant MCP server, a
benchmarked hybrid semantic search service, and an MCP App user interface —
all released under an open MIT licence so the wider education, edtech, and AI
sectors can build on it directly. It is also a working demonstration of what
agentic engineering can deliver when the engineering system around the agents
is taken as seriously as the agents themselves.

What follows is a snapshot of what has been built, what is being built right
now, what is intended next, and the impact this is set up to have. There are
four equally important arenas of achievement here. None of them is the
headline.

## Achievement arena 1 — Products that move the sector

The ecosystem now ships a working, end-to-end stack that lets two distinct
audiences use Oak's curriculum data on their own terms.

For **teachers**, there is a fully standards-compliant Model Context Protocol
(MCP) server, deployed and live, that exposes Oak's high-quality, fully
sequenced curriculum directly inside the AI tools they already use for
planning — ChatGPT, Claude, Cursor, and any other MCP-capable client. Where
those clients support richer interaction, an MCP App UI extension provides a
deeper visual experience designed for teachers rather than for agents.

For **edtech and AI developers**, the same MCP server (plus the underlying
SDKs) makes Oak's curriculum trivial to bring into their own products, IDEs,
and agent workflows. The cost of adopting Oak data has fallen by an order of
magnitude, and the rate at which the wider sector can innovate on top of it
has correspondingly risen.

Underneath both audiences sits a **hybrid semantic search service** built on
Elasticsearch Serverless from Oak's bulk data, with all the code needed to
recreate it for internal or external use. It has been benchmarked through a
formal ground-truth protocol and reaches Mean Reciprocal Rank of 0.983 on
lessons across 41 ground truths in four indices — matching, and typically
exceeding, the existing Oak product search service. It has its own SDK, and
MCP tools built on that SDK so the entire Oak corpus is fully discoverable to
any agent through natural-language requests.

Authentication and authorisation are managed through Clerk so the service can
be operated safely with real users, and the service is currently in
invite-only alpha at `curriculum-mcp-alpha.oaknational.dev` with v1.0.0
released.

## Achievement arena 2 — Developer tooling that lowers the cost of building on Oak

The most quietly consequential thing in the repository may be the SDKs.

The **Curriculum SDK** is a strict, type-safe TypeScript client for Oak's
public API and bulk data. Crucially, it is *generated* end-to-end from the
upstream OpenAPI schema — when Oak updates the API, the SDK (types,
validators, type guards, and tool metadata alike) regenerates on its next
build. There are no hand-maintained data structures to drift, and no manual
catch-up cost for downstream consumers. This is enforced as a cardinal rule
in the repository.

The **search SDK** does the same job for the semantic search service, and the
MCP tools that power agent-facing search are themselves generated on top of
it. The result is a clean, layered toolkit — API SDK, search SDK, MCP server
— each of which can be adopted independently or composed together.

For external developers, this means typed, validated, low-friction access to
Oak from day one. For internal teams, it means new Oak capabilities can be
integrated once and then exposed consistently across SDK and MCP surfaces.
That property — *integrate once, expose everywhere* — is the quiet engine
behind the ecosystem's leverage thesis.

## Achievement arena 3 — Engineering as exemplar

The engineering bar in this repository is deliberately high, because in
agentic development low quality compounds fast and the system can collapse
suddenly when disorder becomes dominant. Several things are notable.

**Disciplined, enforced architecture.** Core packages do one job and have no
dependencies. Libraries compose core packages but never import each other —
when functionality needs to be shared across libraries, it is factored out
into a new core package. Apps consume libraries and export nothing. This is
ordinary good practice taken seriously, and it pays back twice: the codebase
stays comprehensible, and the orthogonal, independent parts can be remixed
into new capabilities and new apps very quickly.

**Adapter-wrapped third-party services.** Every third-party integration —
Sentry, Elasticsearch, Clerk — sits behind a small local adapter. The two
benefits compound: if any service is unauthorised or unavailable the rest of
the system keeps working, and switching providers later is cheap rather than
catastrophic.

**More forms of automated checking than most projects carry.** The repository
runs a wide, orthogonal quality-gate suite — type-check, lint, build, format,
markdown lint, multiple test surfaces (unit, integration, UI, accessibility,
end-to-end, smoke), and several specialised checks for portability,
sub-agent definitions, and Practice fitness. All of them are always
blocking. Their orthogonality is the point: they catch different classes of
drift, and together they prevent low-grade entropy from accumulating.

**Documentation as a first-class surface.** The repository carries 130+
Architectural Decision Records (ADRs) so that "why was it done this way?" is
almost always answerable, a dedicated onboarding flow for new contributors,
TSDoc-driven generated docs, and a progressive-disclosure documentation
hierarchy. One of the explicit roles of this repository is to be an exemplar
of good software engineering practice.

## Achievement arena 4 — Agentic engineering, and the Practice

Most of the code, configuration, and documentation in this repository was
authored by AI agents, directed by a single engineer. That this is possible
at this quality level is itself a result. The path from there to here ran
through several pioneering steps that are now consolidated into one
framework.

**Guardrails as part of the agent loop.** Traditional engineering guardrails
— automated tests, linters, type-checkers — were repurposed as first-class,
reliable feedback for agents, not just for humans. Failing a gate is an
event the agent can observe, reason about, and correct, and gates are wired
into the workflow at the right points to make that loop tight.

**Stabilising frameworks for longer-horizon work.** Several frameworks were
built and tested for the things long-running agentic work tends to break:
session-state memory, learning loops, reusable rules, plan lifecycles, and
continuity across sessions.

**The Practice.** All of the above was then consolidated, extended, and
hardened into *the Practice* — a complete agentic engineering framework
covering research, planning, development, validation, release, guardrails,
multiple forms of memory and feedback loop, and self-improvement. Three
properties matter:

1. It is **portable**. A small Practice Core travels between repositories
   through a deliberate exchange mechanism, so each repo can carry its own
   Practice instance. There is no hierarchy.
2. It is **self-improving**, both locally — the napkin → distilled →
   permanent doctrine flow turns lived mistakes into governance — and
   **distributed**, because improvements proven in one Practice repo can
   travel back into the others.
3. It is **self-referential**. Rules about rule creation, patterns about
   distillation quality, and learnings about consolidation all flow through
   the same loop.

The compounding effect is real: as more repositories run the Practice, the
rate of practice improvement accelerates.

## Currently in flight

Public alpha is now blocked on two specific things, both already largely
delivered. The first is **observability**: a Sentry and OpenTelemetry
integration grounded in a five-axis observability principle covering
engineering, product, usability, accessibility, and security signals.
Runtime integration is in place; what remains is credential provisioning
and a deployment evidence bundle for the HTTP MCP server.

The second is the **user-facing MCP App search experience** — a polished,
self-directed semantic search surface for teachers that simultaneously
demonstrates the full capabilities of the search service and exemplifies how
the new MCP Apps standard should be used.

In parallel, two other lanes are progressing. The first **knowledge graph
alignment audit** runs the first canonical overlap check between the formal
Oak Curriculum Ontology and the search-facing records, with a deliberate
direct-use-first stance: any commitment to Neo4j, Stardog, or another
serving platform is held back until a real direct-use baseline and prototype
comparison exist. And the **Practice itself** continues to evolve —
governance-plane integration, hallucination and evidence-guard adoption,
mutation testing, a Reviewer Gateway upgrade, and an expanding roster of
specialist sub-agent reviewers (Elasticsearch, Sentry, and Clerk shipped or
in flight; Express, security, privacy/GDPR, planning, TDD, and DevX queued).

## Next directions

In the near term, closing the two M2 lanes opens **public alpha** to anyone
on the internet. Beyond that, **public beta** is scoped around production
Clerk migration (social providers, public sign-up, edge rate limiting),
operational alerting on the observability foundation, hardening of the
exemplar UI, and PostHog integration — all already researched and planned.

Two longer arcs sit beyond the milestone gates. The first is to make the
**search service available from the upstream Oak API itself**, so its
discovery affordances flow into Oak's primary product surface and into every
downstream tool that already consumes that API. The second is to keep
**deepening the Practice and its memory and continuity systems**. Agents do
the work with the repository, so the project context must live *in* the
repository. Institutional knowledge about what was done no longer sits
mostly with developers — they are doing less and less of the actual coding.
The Practice is how that institutional knowledge continues to exist, and how
it stays useful to both developers and agents.

## What lives in the backlog, and why that is a strength

The repository carries a substantial body of research spanning product,
engineering, agentic interactions, and open-education ecosystem
opportunities — including, for example, an international curriculum
comparator that routes the Finnish Opetushallitus public curriculum API
through the same OpenAPI → SDK → MCP pipeline as a real second consumer
of the framework, and several pedagogy-evidence integrations alongside
Oak's own data. There is enough material here to keep the project at the
frontier for years.

This is not bloat or a useless backlog. Nothing is promoted into a plan
without explicit triggers to activate or drop it, multiple plan classes
each carry their own validation mechanism, and dormant plans either fire,
evolve, or close on a schedule. The depth is governed.

## Impact

The intended impact compounds in three orders. First, Oak can now deliver
SDK, MCP, and search infrastructure safely and quickly under the Practice.
Second, Oak teams and external developers can build new things faster on
typed APIs, search primitives, MCP access, and (soon) graph-augmented
navigation. Third, the tools and workflows those builders create reduce
teacher planning workload and improve teaching quality — which is Oak's
stated mission.

The open MIT licence is a deliberate amplifier across all three orders.
Every adopter is a potential contributor of patterns, evidence, and
improvements back into the ecosystem; every external use of the framework
makes the framework itself more robust. Combine that with the
self-improving Practice that propagates between repositories, and the value
of the investment compounds rather than depreciates. There is, candidly, a
lot more in here than first appearance suggests — the repository is built
to teach itself to anyone who reads it.
