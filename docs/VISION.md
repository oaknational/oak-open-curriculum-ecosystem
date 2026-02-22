# Vision

[Oak National Academy](https://www.thenational.academy/about-us/who-we-are) is an
independent UK public body whose mission is to _"improve pupil outcomes and close
the disadvantage gap by supporting teachers to teach, and enabling pupils to
access, a high-quality curriculum."_ Oak has also publicly stated that it is
_"exploring how we can help teachers reduce their lesson planning workload using
AI."_

This repository exists to make that exploration operational as shared
infrastructure.

## What This Repository Is For

The oak-mcp-ecosystem is not a teacher-facing product. It is infrastructure that
makes Oak's openly licensed curriculum reliable and reusable for:

- developers building education products
- AI agents that need structured curriculum access
- teacher search experiences built on top of Oak curriculum data

The core goal is leverage: lower the cost and raise the quality bar for teams
building curriculum tools.

## What This Repository Delivers

The oak-mcp-ecosystem makes Oak's openly licensed, fully sequenced,
pedagogically rigorous curriculum data accessible to AI-powered services on the
open web. It does this through:

- **A Curriculum SDK** — typed, validated access to the
  [Open Curriculum API](https://open-api.thenational.academy/), generated at
  compile time from the OpenAPI schema
- **MCP servers** — exposing the full curriculum to AI agents via the Model
  Context Protocol (stdio for desktop tools, HTTP with OAuth for web services)
- **Semantic search** — 4-way Reciprocal Rank Fusion hybrid search across
  lessons, units, curriculum threads, and subject-phase sequences

These are infrastructure components, not end-user products. They lower the cost
of building AI-powered curriculum tools for developers, edtech companies, and
public-sector organisations in the UK and globally.

## Impact Through Three Orders of Effect

The impact of this work is designed to compound. Each order magnifies the leverage of the one before:

1. **First order — safe, high-quality delivery**: the
   [agentic engineering practice](../.agent/directives/practice.md) that
   governs this repository enables safe, high-quality delivery with AI
   collaboration.

2. **Second order — enabling developers**: as the SDK and MCP server packages
   are published and the repository is released publicly under MIT, developers
   gain typed, validated access to Oak's curriculum data. Oak's own product
   engineers also contribute under the practice's guidance, delivering safely
   and at increased velocity.

3. **Third order — changing outcomes at scale**: those developers build new
   systems: AI-powered curriculum tools, teacher-facing products, and
   educational services. Those systems reduce teachers' lesson-planning
   workload and improve the quality of teaching. This is where the leverage of
   the initial investment is maximised: infrastructure that enables others to
   build things that change outcomes for teachers and children.

The third-order effect is where this work connects most powerfully to Oak's
mission: not through what this repository delivers directly, but through what it
enables others to build.

## Two Contributions

This repository makes two distinct contributions, each with its own impact:

### The Products

The SDK, MCP servers, and semantic search system make Oak's curriculum accessible to AI-powered services. They are specific to Oak's curriculum data but general in their patterns: schema-first type generation, MCP tool composition, hybrid search across structured educational content.

### The Practice

The [agentic engineering practice](../.agent/directives/practice.md) — the
system of principles, structures, specialist AI reviewers, quality gates, and
learning mechanisms that governs how the products are built — is designed to be
transferable. It is deliberately conceived as a domain with a clear boundary
([ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md))
so that the patterns can be adopted in other repositories, both within Oak and
beyond.

The products enable innovation in education technology. The practice enables
safe, high-quality innovation with AI. Together, they position Oak to contribute
publicly to both.

## Open Source Strategy

The repository is being released as open source under the MIT licence. This is a
deliberate choice: the infrastructure and the practice are most valuable when
others can use, learn from, and build on them.

Open-source code does not change upstream curriculum data licensing. Code is MIT;
curriculum data terms remain governed by Oak's published data licence.

Access to a great education should not depend on who can afford to build the
tools, and access to safe AI engineering practices should not depend on who can
afford to discover them independently.

## Historical Positioning

[ADR-008](architecture/architectural-decisions/008-ecosystem-architecture-vision.md)
is retained for historical context but is conceptually deprecated.

This vision document, together with
[ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md),
is the current framing for why this repository exists and how its impact is
expected to compound.
