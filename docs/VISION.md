# Vision

> **Last updated**: 23 February 2026

[Oak National Academy](https://www.thenational.academy/about-us/who-we-are) is an
independent UK public body whose mission is to _"improve pupil outcomes and close
the disadvantage gap by supporting teachers to teach, and enabling pupils to
access, a high-quality curriculum."_ Oak has also publicly stated that it is
_"exploring how we can help teachers reduce their lesson planning workload using
AI."_

Oak publishes a deeply resourced, fully sequenced curriculum through a
well-specified API: [open-api.thenational.academy](https://open-api.thenational.academy/).
At the time of writing, curriculum content served via that API is made available
under upstream Open Government Licence (OGL) terms (except where otherwise
stated). This repository exists to amplify the impact of that public asset.

## Two Audiences, One Vision

This document is written for two audiences with different questions.

### For External Developers And Edtech Teams

Primary question: what can we build with this?

Answer: this repository gives you a production-grade path to build curriculum
tools and AI services on top of Oak's open curriculum data, with:

- typed and validated API access through the SDK
- AI-agent integration through MCP servers
- semantic discovery and retrieval patterns that are ready to operationalise

### For Internal Stakeholders

Primary question: what value and impact does investment in this repository
create for Oak?

Answer: this repository is a leverage multiplier for mission delivery. It turns
Oak's curriculum and AI capabilities into reusable infrastructure that can power
multiple products, teams, and external ecosystems, while preserving quality and
safety through the agentic engineering practice.

## What This Repository Is For

The oak-mcp-ecosystem turns Oak's open curriculum data into AI-native
infrastructure that is easy to build on.

It serves three groups:

- developers building education tools and services
- AI agents needing reliable, structured curriculum access
- products for teachers that require strong search and retrieval over curriculum
  content

For a plain-language introduction to Oak's curriculum structure, KS4 complexity,
and user personas, see the [Curriculum Guide](curriculum-guide.md).

The central objective is leverage: reduce the cost, time, and risk of building
high-quality curriculum tooling.

## Non-Goals

To keep scope clear, this repository is not:

- an attempt to define a universal "right way" for others to build; our role is
  to support and enable, not constrain
- a replacement for Oak's primary teacher-facing site and product journeys
- the owner of upstream curriculum licensing policy or legal interpretation
- a promise that every experimental AI capability is exposed publicly before it
  meets quality, safety, and pedagogical standards

## What We Deliver Today

Today, this repository delivers a pipeline for working with Oak's open
curriculum data:

- **Curriculum SDK** — typed, validated API access generated from the OpenAPI
  schema
- **MCP servers** — curriculum access via Model Context Protocol for desktop and
  web AI clients
- **Semantic search** — hybrid retrieval for discovery across lessons, units,
  threads, and broader curriculum structures

It is intentionally feasible for downstream teams to populate and run their own
search infrastructure (for example Elasticsearch Serverless) using this
repository as the implementation baseline.

Alongside product infrastructure, this repository also develops the operating
system for delivery itself: Oak's
[agentic engineering practice](../.agent/directives/practice.md) and associated
guardrails, including architectural enforcement and human-AI collaboration
improvements ([ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md)).

## Capability Status (Current / Next / Later)

For the delivery roadmap with milestones and user-impact summaries, see the
[high-level plan](../.agent/plans/high-level-plan.md).

| Capability                                      | Status  | What this means for users                                                                                                                                                         | Evidence                                                                                                           |
| ----------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Curriculum SDK (schema-first)                   | Current | Developers get typed, validated access to Oak's curriculum data without writing type definitions by hand. Build on Oak's curriculum in TypeScript with full type safety.          | SDK generation pipeline operational; all types, validators, and MCP tool metadata generated from OpenAPI schema    |
| MCP servers (desktop and web)                   | Current | AI assistants like Claude, ChatGPT, and Cursor can access Oak's curriculum directly — teachers can ask questions about lessons and get structured, accurate answers.              | Stdio and HTTP servers deployed; OAuth-compliant authentication                                                    |
| Semantic search pipeline                        | Current | When a teacher searches for a lesson, the system finds the right one with high accuracy across 7 different curriculum structures (lessons, units, threads, sequences).            | MRR 0.983 on lessons (finds the right lesson in the top result 98% of the time); 41 ground truths across 4 indices |
| Agentic engineering practice                    | Current | A self-reinforcing system of quality gates, AI reviewers, and architectural constraints that maintains code quality as the team and codebase grow.                                | 115+ ADRs; 10+ specialist sub-agent reviewers; comprehensive quality gate suite                                    |
| MCP Apps extension interaction model            | Next    | Public alpha will make curriculum interaction native inside platforms like ChatGPT, Claude, and Gemini — teachers can discover and use Oak content without leaving their AI tool. | Pre-public-release                                                                                                 |
| Knowledge graph + concept framework integration | Later   | Planned: richer understanding of how curriculum concepts connect, enabling smarter lesson composition and cross-subject pathways.                                                 | Pre-development                                                                                                    |
| Pedagogical rigour assessment APIs              | Later   | Planned: AI-assisted quality checks to ensure generated or adapted resources meet high pedagogical standards.                                                                     | Pre-development                                                                                                    |

## What Changes At Public Alpha

When the MCP Apps extension work reaches public alpha, this repository moves
beyond "developer infrastructure only". It becomes a direct interaction surface
for curriculum resources inside AI platforms such as ChatGPT, Claude, and
Gemini.

That shift matters: the same underlying curriculum can be discovered, explored,
and reused through the interfaces where many educators and developers already
work.

## Strategic Integrations Ahead

This repository is designed to integrate forthcoming Oak capabilities, including:

- a true curriculum knowledge graph
- a conceptual framework that defines curriculum resources as minimal building
  blocks
- APIs for AI-assisted assessment of generated curriculum resources against high
  standards of pedagogical rigour
- additional AI-driven curriculum services developed across Oak

These capabilities are not separate tracks in competition with the SDK/MCP
ecosystem. They are intended to feed into it directly, expanding what developers
and AI systems can do with Oak curriculum data.

## Relationship With Aila

[Aila](https://labs.thenational.academy/) demonstrates high-value AI curriculum
applications already. This repository is complementary to that work.

The principle is mutual reinforcement: reuse what works, share patterns, and
allow product-level AI applications and infrastructure-level AI tooling to
strengthen each other across the wider Oak ecosystem.

Concrete examples of how the two tracks reinforce each other:

1. **Shared curriculum retrieval** — Aila's lesson planning needs fast, accurate
   curriculum search. The semantic search pipeline developed here (MRR 0.983 on
   lessons) provides that capability as reusable infrastructure rather than
   duplicated per-product.
2. **Knowledge graph synergy** — As Oak develops a curriculum knowledge graph,
   this repository will expose it through the SDK and MCP servers. Aila and
   external tools alike can traverse concept relationships, enabling richer
   lesson composition and cross-subject pathways.
3. **Quality and safety patterns** — The agentic engineering practice's quality
   gates and type safety discipline are transferable patterns. Lessons learned
   here about safe human-AI collaboration inform how Aila and other Oak products
   manage AI-assisted content generation.

## Investment Value For Oak

Investment in this repository creates value through several reinforcing channels:

1. **Mission leverage**: one infrastructure investment can support many teacher
   and pupil outcomes via multiple downstream tools and services.
2. **Delivery quality and speed**: the combination of shared infrastructure and
   the agentic engineering practice increases delivery throughput while
   maintaining rigour.
3. **Ecosystem amplification**: external developers and edtech organisations can
   build on Oak's open curriculum data, increasing reach beyond what Oak can
   deliver alone.
4. **Strategic integration point**: emerging Oak capabilities (knowledge graph,
   pedagogical rigour APIs, additional AI services) can be integrated once and
   then exposed consistently through SDK and MCP surfaces.
5. **Public value leadership**: Oak can demonstrate how open public curriculum
   assets and safe AI engineering practice can be combined for system-level
   educational impact.

## How We Measure Impact

To ensure investment stays outcome-focused, impact should be tracked through
leading and outcome indicators.

### Leading Indicators (Near-Term)

- external adoption of SDK and MCP packages (downloads, active integrations,
  retained users)
- internal delivery throughput and quality (cycle time, escaped defects, quality
  gate pass rates)
- speed of integrating new Oak curriculum capabilities into shared SDK/MCP
  surfaces

**Current baselines** (pre-public-release, February 2026):

| Metric               | Current value | Context                                                                                                  |
| -------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| Search MRR (lessons) | 0.983         | Finds the correct lesson in the top result 98% of the time                                               |
| Search MRR (units)   | 1.000         | 2 ground truths — mechanism check                                                                        |
| Search MRR (threads) | 0.938         | 8 ground truths across curriculum threads                                                                |
| Ground truths        | 41            | Across 4 search indices                                                                                  |
| ADRs                 | 115+          | Architectural decisions documenting every significant design choice                                      |
| Quality gate suite   | 11 gates      | type-gen, build, type-check, lint, format, markdownlint, test, test:ui, test:e2e, smoke, subagents:check |

These baselines will evolve as external adoption begins and the MCP Apps
extension reaches public alpha. External adoption metrics (downloads, active
integrations) are aspirational until the first public release.

### Outcome Indicators (Medium-Term)

- evidence that downstream tools reduce teacher lesson-planning workload
- evidence that generated or adapted resources maintain high pedagogical quality
- growth in high-quality external ecosystem reuse of Oak curriculum data

## Impact Through Three Orders Of Effect

The impact compounds through three orders, each magnifying the next:

1. **First order — safe delivery**: Oak can deliver SDK, MCP, and search
   infrastructure safely and quickly using the agentic engineering practice.
2. **Second order — enablement**: Oak teams and external developers can build
   faster with typed APIs, search primitives, and MCP access to curriculum data.
3. **Third order — outcomes at scale**: those builders create new tools and
   workflows that reduce planning workload and improve teaching quality for
   teachers and pupils.

A key leverage point is compositional curriculum creation. With semantic
discovery, curriculum APIs, and knowledge-graph traversal combined, it becomes
far easier to assemble coherent, pedagogically rigorous new resource sequences,
including cross-subject pathways where appropriate.

This third-order effect is where the repository aligns most strongly with Oak's
mission.

## Positioning

The long-term intent is for this repository to become a primary Oak product
surface alongside the main Oak site: open infrastructure, integrated AI
capabilities, and curriculum intelligence made usable by the wider world.

## Open Source And Licensing

The repository code is released under the MIT licence. Curriculum content
licensing remains governed by upstream API/data terms (including OGL conditions
where applicable), with attribution and third-party rights obligations preserved.

For practical guidance on code/data boundaries and attribution requirements, see
[LICENCE-DATA.md](../LICENCE-DATA.md).

Open code + open curriculum access is a deliberate strategy: maximise educational
impact by making high-quality infrastructure and practice reusable.

## Historical Positioning

[ADR-008](architecture/architectural-decisions/008-ecosystem-architecture-vision.md)
is retained for historical context but is conceptually deprecated.

This vision document, together with
[ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md),
is the current framing for why this repository exists and how its impact is
expected to compound.
