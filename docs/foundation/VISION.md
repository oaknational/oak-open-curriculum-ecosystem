---
title: Vision
status: active
last_reviewed: 2026-04-30
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

The vision is **compositional curriculum intelligence**: reusable sector
infrastructure, not isolated point solutions. Typed curriculum APIs and a
generated SDK give agents and applications contracts they can trust. Hybrid
semantic search answers open-ended discovery across the corpus at scale.
Oak's curriculum graph surfaces carry relationships between curriculum entities
(pathways, threads, misconceptions, prerequisites, cross-links). Coverage and
rigour deepen as formal graph work lands. Tools can therefore traverse and
justify against structured relationships wherever they exist, rather than
improvising purely from unstructured text alone.

MCP servers and MCP Apps form the interoperability layer that AI assistants and
engineering toolchains consume, bringing the same primitives to teachers
in-product and to developers without bespoke integrations multiplying across
the ecosystem. Oak's openly documented Practice is how that stack is delivered
safely, quickly, and with continuous improvement.

Beyond the services this repository runs and publishes, a secondary goal is
to provide a set of reusable, high-quality components for building education
applications. The intent is to lower the cost of innovation across the
education and technology sectors by giving builders ready-to-adapt building
blocks, rather than asking each team to start from scratch. The component
inventory is listed in [_What We Deliver_](#what-we-deliver).

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
- AI-agent integration through MCP servers and MCP Apps
- hybrid semantic discovery and retrieval ready to operationalise
- structured curriculum relationships through graph-aligned surfaces, exposed
  through the same SDK and MCP primitives
- reusable components you can adopt directly in your own stack
  (see [_What We Deliver_](#what-we-deliver) for the inventory)

### For Internal Stakeholders

Primary question: what value and impact does investment in this repository
create for Oak?

Answer: this repository is a leverage multiplier for mission delivery. It
turns Oak's curriculum and AI capabilities into reusable infrastructure that
can power multiple products, teams, and external ecosystems, while preserving
quality and safety through the agentic engineering Practice. The same body of
work also gives the wider sector the components it would otherwise have to
build alone.

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
high-quality curriculum tooling — both for Oak's own delivery and for the
wider education and technology sectors that adopt the components this
repository publishes.

## What We Deliver

The repository delivers a small, composable pipeline for working with Oak's
open curriculum data: a strict, type-safe **Curriculum SDK** generated
end-to-end from Oak's OpenAPI schema; **MCP Apps** that expose the curriculum
to AI clients and developer tools (including ChatGPT, Claude Cowork, Claude
Desktop, Cursor, and any other MCP-capable host); and a **semantic search
service** with its own SDK and MCP tools so the corpus is fully discoverable
from natural-language requests. Curriculum graph-aligned surfaces add
structured relationships alongside retrieval, exposed through the same MCP
and SDK pathways. Downstream teams can run their own search infrastructure
(for example Elasticsearch Serverless) using this repository as the
implementation baseline.

The same body of work doubles as a set of **reusable components** for the
sector. The canonical component inventory is:

- the **OpenAPI-to-MCP server pipeline** — turn a well-specified OpenAPI
  schema into typed SDK + MCP server with one workflow
- the **SDK generation flow** — the schema-first toolchain that produces the
  Curriculum SDK and is reusable for any equivalently specified API
- the **hybrid-search configuration and tooling** — Elasticsearch-Serverless
  ingestion, query, and evaluation patterns
- the **MCP and MCP App scaffolds** — server skeletons and MCP App UI
  resource patterns ready to be adapted
- the **graph projection patterns** — code and conventions for projecting
  curriculum-graph data into search-facing and MCP-facing surfaces
- the **Practice** — Oak's agentic engineering Practice as a portable,
  plain-text framework

These components are designed to be picked up by other education
organisations, EdTech teams, and public-sector partners — not only consumed
as hosted Oak services. Reusability is treated as a first-class delivery
concern, not a side effect. Partner-facing adoption claims mature from this
enumeration; playbook discipline sits in [sector reusable components —
partner adoption
contract](../../.agent/plans/sector-engagement/current/sector-reusable-components-adoption.plan.md).

Alongside this product infrastructure, the repository develops the operating
system for delivery itself: Oak's
[agentic engineering Practice](agentic-engineering-system.md), a reusable
plain-text framework for agents from major vendors to collaborate, continually
learn and adapt, and keep institutional and operational knowledge in the repo
where it is useful. It includes architectural enforcement and human-AI
collaboration improvements
([ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md)).

## Non-Goals

To keep scope clear, this repository is not:

- an attempt to define a universal "right way" for others to build; our role
  is to support and enable, not constrain
- a replacement for Oak's primary teacher-facing site and product journeys
- the owner of upstream curriculum licensing policy or legal interpretation
- a promise that every experimental AI capability is exposed publicly before
  it meets quality, safety, and pedagogical standards
- a surface that learners (including children) interact with directly — that
  work would require a separately governed safeguarding, moderation, and
  pedagogical-framing programme first, and is deliberately held out of scope
  until that programme exists

## Strategic Integrations Ahead

Oak's curriculum intelligence evolves; this repository is where new depth
lands inside the SDK and MCP integration surface — not as rival efforts.
Knowledge-graph-aligned capabilities are partial today and deepen across
releases: richer formal ontology, breadth of traversal queries, clearer
export contracts for partners, tighter alignment between graph projections
and search-facing records.

Further Oak capabilities slated to feed this same trajectory include:

- richer formal modelling, validation, and serving of the curriculum
  knowledge graph
- a conceptual framework that defines curriculum resources as minimal
  building blocks
- reusable knowledge graph exports and traversal surfaces that help external
  organisations build on Oak's curriculum structure
- APIs for AI-assisted assessment of generated curriculum resources against
  high standards of pedagogical rigour
- additional AI-driven curriculum services developed across Oak

These capabilities are not separate tracks in competition with the SDK/MCP
ecosystem. They are intended to feed into it directly, expanding what
developers and AI systems can do with Oak curriculum data.

## Impact Through Three Orders Of Effect

The impact compounds through three orders, each magnifying the next, and
each with a primary set of beneficiaries:

1. **First order — safe and fast delivery (Oak's own engineering)**: the
   agentic engineering Practice lets Oak ship SDK, MCP, search, and graph
   capabilities safely, quickly, and with continuous improvement. The
   Practice itself is also designed to travel: other teams can adopt it to
   deliver their own systems with the same discipline.
2. **Second order — enablement (Oak product teams, external developers,
   EdTech, public-sector partners)**: builders inside and outside Oak can
   move faster on top of typed APIs, MCP integration, hybrid search, and
   graph-aligned surfaces. Beyond the hosted services, the reusable
   components — pipeline, SDK generation, search configuration, MCP App
   scaffolds, projection patterns, Practice — lower the cost of innovation
   for any team building on a well-specified curriculum API.
3. **Third order — outcomes at scale (teachers and pupils)**: those builders
   create tools and workflows that reduce teacher planning workload and lift
   the quality of the resources teachers reach for. At the heart of Oak's
   mission, this work helps **close the disadvantage gap** by widening
   reliable access to a high-quality curriculum, wherever the AI tools
   teachers use happen to live.

A key leverage point is compositional curriculum creation. With semantic
discovery, curriculum APIs, and knowledge-graph traversal combined, it
becomes far easier to assemble coherent, pedagogically rigorous new resource
sequences, including cross-subject pathways where appropriate.

This third-order effect is where the repository aligns most strongly with
Oak's mission.

## Worked Example: Aila

[Aila](https://labs.thenational.academy/) (Oak's AI lesson planning
assistant) is a working example of the three orders in practice. It already
demonstrates high-value AI curriculum applications, and this repository is
complementary to that work — product-level AI applications and
infrastructure-level AI tooling strengthen each other across the wider Oak
ecosystem.

Concrete examples of how the two tracks reinforce each other:

1. **Shared curriculum retrieval** — Aila's lesson planning needs fast,
   accurate curriculum search. The semantic search pipeline developed here
   provides that capability as reusable infrastructure rather than
   duplicated per-product.
2. **Knowledge graph synergy** — Graph-aligned curriculum relationships
   already reach agents through MCP alongside search and API tools; as
   formal graph depth grows, exposure stays unified through SDK and MCP.
   Aila and external tools alike can traverse richer relationships,
   strengthening lesson composition and cross-subject pathways without
   fragmenting integration patterns.
3. **Quality and safety patterns** — The agentic engineering Practice's
   quality gates and type safety discipline are transferable patterns.
   Lessons learned here about safe human-AI collaboration inform how Aila
   and other Oak products manage AI-assisted content generation.

## How We Measure Impact

To ensure investment stays outcome-focused, impact should be tracked through
both leading and outcome indicators. The values themselves move over time
and live in the [reports surface](../../.agent/reports/) and the
[high-level plan](../../.agent/plans/high-level-plan.md); the framing below
is the timeless definition of what success looks like.

### Leading Indicators (Near-Term)

- external adoption of the SDK, MCP servers, and the reusable component set
  (package downloads, active integrations, retained users, and reuse
  signals for non-package components such as the pipeline, scaffolds, and
  patterns)
- internal delivery throughput and quality (cycle time, escaped defects,
  quality gate pass rates)
- speed of integrating new Oak curriculum capabilities into shared SDK and
  MCP surfaces

### Outcome Indicators (Medium-Term)

- evidence that downstream tools reduce teacher lesson-planning workload
- evidence that generated or adapted resources maintain high pedagogical
  quality
- growth in high-quality external ecosystem reuse of Oak curriculum data
  and components

## Investment Value For Oak

The mission-causal returns of this investment are captured in the three
orders of effect above. Two further channels matter at the strategic and
public-value level:

1. **Strategic integration point**: emerging Oak capabilities (knowledge
   graph, pedagogical rigour APIs, additional AI services) can be
   integrated once and then exposed consistently through SDK and MCP
   surfaces, so each new capability immediately reaches every downstream
   tool — internal product, external builder, or AI assistant.
2. **Public value leadership**: Oak can demonstrate how open public
   curriculum assets, reusable infrastructure components, and the safe AI
   engineering Practice can be combined for system-level educational
   impact in the UK and beyond.

## Positioning

The long-term intent is for this repository to become a primary Oak product
surface alongside the main Oak site: open infrastructure, integrated AI
capabilities, curriculum intelligence, and reusable components made usable
by the wider world.

## Open Source And Licensing

The repository code is released under the MIT licence. Curriculum content
licensing remains governed by upstream API/data terms (including OGL
conditions where applicable), with attribution and third-party rights
obligations preserved.

For practical guidance on code/data boundaries and attribution requirements,
see [LICENCE-DATA.md](../../LICENCE-DATA.md).

Open code + open curriculum access is a deliberate strategy: maximise
educational impact by making high-quality infrastructure, components, and
practice reusable.

## Historical Positioning

[ADR-008](../architecture/architectural-decisions/008-ecosystem-architecture-vision.md)
is retained for historical context but is conceptually deprecated. This
vision document, together with
[ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md),
is the current framing for why this repository exists.
