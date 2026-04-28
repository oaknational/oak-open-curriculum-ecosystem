---
title: Vision
status: active
last_reviewed: 2026-04-20
---

# Vision

[Oak National Academy](https://www.thenational.academy/about-us/who-we-are) is an
independent UK public body whose mission is to _"improve pupil outcomes and close
the disadvantage gap by supporting teachers to teach, and enabling pupils to
access, a high-quality curriculum."_ Oak has also publicly stated that it is
_"exploring how we can help teachers reduce their lesson planning workload using
AI."_

Oak publishes a deeply resourced, fully sequenced curriculum through a
well-specified API: [open-api.thenational.academy](https://open-api.thenational.academy/).
Curriculum content served via that API is made available under upstream
licence terms — currently Open Government Licence (OGL) v3.0 except where
otherwise stated; see [LICENCE-DATA.md](../../LICENCE-DATA.md) for current
authority. This repository exists to amplify the impact of that public asset.

This document is the timeless statement of what the repository is for and why
it matters. For the current delivery roadmap, see the
[high-level plan](../../.agent/plans/high-level-plan.md). For a dated snapshot
of where the work has reached, see the
[reports surface](../../.agent/reports/). For an engineering-lens explanation
of how the work is delivered, see
[How the Agentic Engineering System Works](agentic-engineering-system.md).

## Two Audiences, One Vision

This document is written for two audiences with different questions.

### For External Developers And EdTech Teams

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

The Oak Open Curriculum Ecosystem turns Oak's open curriculum data into
AI-native infrastructure that is easy to build on.

It serves three groups:

- developers building education tools and services
- AI agents needing reliable, structured curriculum access
- products for teachers that require strong search and retrieval over
  curriculum content

> **For a plain-language introduction** to Oak's curriculum structure, KS4
> complexity, and user personas, see the
> **[Curriculum Guide](../domain/curriculum-guide.md)**.

The central objective is leverage: reduce the cost, time, and risk of building
high-quality curriculum tooling.

## What We Deliver

The repository delivers a small, composable pipeline for working with Oak's
open curriculum data: a strict, type-safe **Curriculum SDK** generated end-to-end
from Oak's OpenAPI schema; **MCP servers** that expose the curriculum to AI
clients (ChatGPT, Claude, Cursor, and any other MCP-capable host); and a
**semantic search service** with its own SDK and MCP tools so the corpus is
fully discoverable from natural-language requests. Downstream teams can run
their own search infrastructure (for example Elasticsearch Serverless) using
this repository as the implementation baseline.

Alongside this product infrastructure, the repository develops the operating
system for delivery itself: Oak's
[agentic engineering practice](agentic-engineering-system.md) and associated
guardrails, including architectural enforcement and human-AI collaboration
improvements
([ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md)).

## Non-Goals

To keep scope clear, this repository is not:

- an attempt to define a universal "right way" for others to build; our role is
  to support and enable, not constrain
- a replacement for Oak's primary teacher-facing site and product journeys
- the owner of upstream curriculum licensing policy or legal interpretation
- a promise that every experimental AI capability is exposed publicly before it
  meets quality, safety, and pedagogical standards
- a surface that learners (including children) interact with directly — that
  work would require a separately governed safeguarding, moderation, and
  pedagogical-framing programme first, and is deliberately held out of scope
  until that programme exists

## Strategic Integrations Ahead

This repository is designed to integrate forthcoming Oak capabilities,
including:

- a true curriculum knowledge graph
- a conceptual framework that defines curriculum resources as minimal building
  blocks
- APIs for AI-assisted assessment of generated curriculum resources against
  high standards of pedagogical rigour
- additional AI-driven curriculum services developed across Oak

These capabilities are not separate tracks in competition with the SDK/MCP
ecosystem. They are intended to feed into it directly, expanding what
developers and AI systems can do with Oak curriculum data.

## Relationship With Aila

[Aila](https://labs.thenational.academy/) (Oak's AI lesson planning assistant)
demonstrates high-value AI curriculum applications already. This repository is
complementary to that work.

The principle is mutual reinforcement: reuse what works, share patterns, and
allow product-level AI applications and infrastructure-level AI tooling to
strengthen each other across the wider Oak ecosystem.

Concrete examples of how the two tracks reinforce each other:

1. **Shared curriculum retrieval** — Aila's lesson planning needs fast,
   accurate curriculum search. The semantic search pipeline developed here
   provides that capability as reusable infrastructure rather than duplicated
   per-product.
2. **Knowledge graph synergy** — As Oak develops a curriculum knowledge graph,
   this repository will expose it through the SDK and MCP servers. Aila and
   external tools alike can traverse concept relationships, enabling richer
   lesson composition and cross-subject pathways.
3. **Quality and safety patterns** — The agentic engineering practice's quality
   gates and type safety discipline are transferable patterns. Lessons learned
   here about safe human-AI collaboration inform how Aila and other Oak
   products manage AI-assisted content generation.

## Investment Value For Oak

Investment in this repository creates value through several reinforcing
channels:

1. **Mission leverage**: one infrastructure investment can support many teacher
   and pupil outcomes via multiple downstream tools and services.
2. **Delivery quality and speed**: the combination of shared infrastructure and
   the agentic engineering practice increases delivery throughput while
   maintaining rigour.
3. **Ecosystem amplification**: external developers and EdTech organisations
   can build on Oak's open curriculum data, increasing reach beyond what Oak
   can deliver alone.
4. **Strategic integration point**: emerging Oak capabilities (knowledge graph,
   pedagogical rigour APIs, additional AI services) can be integrated once and
   then exposed consistently through SDK and MCP surfaces.
5. **Public value leadership**: Oak can demonstrate how open public curriculum
   assets and safe AI engineering practice can be combined for system-level
   educational impact.

## How We Measure Impact

To ensure investment stays outcome-focused, impact should be tracked through
both leading and outcome indicators. The values themselves move over time and
live in the [reports surface](../../.agent/reports/) and the
[high-level plan](../../.agent/plans/high-level-plan.md); the framing below is
the timeless definition of what success looks like.

### Leading Indicators (Near-Term)

- external adoption of SDK and MCP packages (downloads, active integrations,
  retained users)
- internal delivery throughput and quality (cycle time, escaped defects,
  quality gate pass rates)
- speed of integrating new Oak curriculum capabilities into shared SDK/MCP
  surfaces

### Outcome Indicators (Medium-Term)

- evidence that downstream tools reduce teacher lesson-planning workload
- evidence that generated or adapted resources maintain high pedagogical
  quality
- growth in high-quality external ecosystem reuse of Oak curriculum data

## Impact Through Three Orders Of Effect

The impact compounds through three orders, each magnifying the next:

1. **First order — safe delivery**: Oak can deliver SDK, MCP, and search
   infrastructure safely and quickly using the agentic engineering practice.
2. **Second order — enablement**: Oak teams and external developers can build
   faster with typed APIs, search primitives, and MCP access to curriculum
   data.
3. **Third order — outcomes at scale**: those builders can create new tools and
   workflows that reduce planning workload and improve teaching quality for
   teachers and pupils.

A key leverage point is compositional curriculum creation. With semantic
discovery, curriculum APIs, and knowledge-graph traversal combined, it becomes
far easier to assemble coherent, pedagogically rigorous new resource sequences,
including cross-subject pathways where appropriate.

This third-order effect is where the repository aligns most strongly with
Oak's mission.

## Positioning

The long-term intent is for this repository to become a primary Oak product
surface alongside the main Oak site: open infrastructure, integrated AI
capabilities, and curriculum intelligence made usable by the wider world.

## Open Source And Licensing

The repository code is released under the MIT licence. Curriculum content
licensing remains governed by upstream API/data terms (including OGL conditions
where applicable), with attribution and third-party rights obligations
preserved.

For practical guidance on code/data boundaries and attribution requirements,
see [LICENCE-DATA.md](../../LICENCE-DATA.md).

Open code + open curriculum access is a deliberate strategy: maximise
educational impact by making high-quality infrastructure and practice reusable.

## Historical Positioning

[ADR-008](../architecture/architectural-decisions/008-ecosystem-architecture-vision.md)
is retained for historical context but is conceptually deprecated. This vision
document, together with
[ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md),
is the current framing for why this repository exists.
