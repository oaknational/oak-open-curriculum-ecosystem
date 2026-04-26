# ADR-119: Agentic Engineering Practice

**Status**: Accepted
**Date**: 2026-02-22
**Related**: [Vision](../../VISION.md), [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-117 (Plan Templates and Components)](117-plan-templates-and-components.md), [ADR-124 (Practice Propagation Model)](124-practice-propagation-model.md), [How the Agentic Engineering System Works](../../foundation/agentic-engineering-system.md) (human-readable engineering narrative)

## Context

Over the course of building this repository — across SDK extraction,
MCP tool wiring, OAuth flows, search integration, and quality
remediation — a system of interlocking artefacts emerged organically:
directives, rules, plans, templates, sub-agents, quality gates,
institutional memory, live collaboration state, experiential records,
and platform-specific bindings.

Each piece was created to solve a concrete problem: rules to prevent
repeated mistakes, sub-agents to provide specialist review, plans to
organise multi-step work, the napkin to preserve session-level
learning, experience files to record qualitative shifts. But no
document named or framed the system as a whole, and no entry point
explained how the pieces relate.

As the repository moves towards being public, new developers and AI
agents need to understand not just the product code (SDK, MCP servers,
search) but the environment in which that code is produced and
maintained. That environment needs a name, a boundary, and a map.

The repository-level purpose and impact framing is defined in
[docs/foundation/VISION.md](../../foundation/VISION.md). This ADR defines one specific part of that
framing: the naming, boundary, and operating model of the agentic engineering
practice.

[Oak's stated mission](https://www.thenational.academy/about-us/who-we-are)
is to _"improve pupil outcomes and close the disadvantage gap by
supporting teachers to teach, and enabling pupils to access, a
high-quality curriculum."_ Oak has also publicly stated that it is
_"exploring how we can help teachers reduce their lesson planning
workload using AI."_ The product code in this repository — SDK, MCP
servers, semantic search — makes Oak's curriculum accessible to
AI-powered services, directly enabling that exploration. The practice
governs how that product code is produced; naming and framing it
creates the conditions for safe, high-quality delivery at scale.

## Decision

### Name

**Agentic Engineering Practice** — shortened to "the practice" in
day-to-day use.

"Agentic" in its original sense: relating to agency, the capacity of
agents to act. Both human developers and AI agents exhibit agency in
this system; the practice governs how that agency is exercised.

"Engineering" grounds the concept in real work — this is not abstract
methodology but the specific structures that govern how code is
written, reviewed, planned, and learned from.

"Practice" in the deep sense — a discipline that improves through
use, like a medical practice or a martial arts practice. It is
something you _do_, not something you _have_. It is active, not
passive. It is self-reinforcing: following the rules teaches you the
system.

### Conceptual Boundary

The practice encompasses everything that together creates the
conditions for safe, high-quality human-AI collaboration on this
codebase:

- **Principles** — First Question, TDD at all levels, schema-first,
  fail-fast, no type shortcuts
- **Structures** — directives, plans, templates, ADRs, institutional
  memory
- **Agents** — specialist reviewers, their three-layer prompt
  architecture (ADR-114)
- **Workflows** — commands, quality gates, documentation
  consolidation
- **Learning mechanisms** — napkin, distilled learnings, experience
  records
- **Agent-to-agent coordination** — shared communication log, active
  claims, closed claim history, and decision threads
- **Operational state** — repo-owned live state that start-right,
  session-handoff, and consolidate-docs read or update
- **Platform bindings** — canonical `.agent/` content plus thin
  Cursor, Claude, Codex, Gemini, and portable `.agents/` adapters

It _excludes_ the product code itself (SDK, MCP servers, search
system, applications) — those are what the practice produces, not
what the practice is. The boundary is drawn deliberately: the
practice is conceived as a transferable pattern that can be adopted
in other repositories, both within Oak and beyond. The product code
is specific to Oak's curriculum; the practice is generalisable. The
propagation mechanism — how the practice travels between repos and
adapts to each one — is specified in [ADR-124](124-practice-propagation-model.md).

### Three Layers

The practice operates in three layers:

1. **Philosophy** — the principles and learning mechanisms
   that define _why_ the practice works. Includes architectural
   enforcement as a core philosophical commitment.
2. **Structure** — the organisational patterns that define
   _what_ the practice consists of. Includes cross-agent
   standardisation as an evolving implementation direction.
3. **Tooling** — the platform-specific implementations that
   define _how_ the practice is used.

The plan hierarchy, workflow details, artefact map, collaboration-state
contract, and layer
content are documented in the practice guide
([practice.md](../../../.agent/practice-core/practice.md)), which
serves as the orienting map for day-to-day use.

### Feedback Loops and Recursive Self-Improvement

The practice is stabilised by interlocking feedback loops.
Negative loops (quality gates, sub-agent reviews, the
napkin-distilled-rules learning loop) correct errors, create
the conditions for emergent stability, and prevent drift.
Positive loops (agents improving agents, consolidation
workflows) compound capability over time. This recursive
self-improvement is what makes the practice a _practice_
rather than a static framework.

See [practice.md](../../../.agent/practice-core/practice.md) for
mechanism detail and diagrams.

### Self-Teaching Property

The practice is designed to be discoverable through use —
each document links to the next, and the system teaches itself
through that traversal. This property is intentional and should
be preserved.

### Documentation Propagation Contract

Plans are execution artefacts, not permanent documentation. When practice
behaviour or governance changes, the settled outcome must be propagated to
permanent documentation before phase closure.

Minimum canonical update surfaces are:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
3. `.agent/practice-core/practice.md`

Additionally, update any impacted ADRs, `/docs/` pages, and README files.
Apply the consolidation workflow in
`.agent/commands/consolidate-docs.md` before closing major phases.

### Why "Practice" and Not "Framework"

- A **framework** is adopted wholesale. The practice evolved
  organically from real work.
- A **framework** is static. The practice has a learning loop
  that changes it over time.
- A **framework** is external. The practice is the environment
  in which the work happens.
- A **toolkit** implies picking and choosing. The practice is
  interconnected — the pieces reinforce each other.
- **Governance** implies oversight from outside. The practice is
  self-reinforcing from within.

### Impact Through Three Orders of Effect

The impact of naming and framing the practice compounds through
three successive orders:

1. **First order (direct)** — the practice has enabled safe,
   high-quality product delivery on this repository. A single
   engineer, working with AI under the practice's governance,
   produced the SDK, MCP servers, semantic search, and the
   practice itself.

2. **Second order (enablement)** — as the repository becomes
   public and Oak's product engineers contribute, the practice
   enables them to work safely and at increased velocity with AI
   tools. Separately, as the SDK and MCP server packages are
   published, external developers gain typed, validated access to
   Oak's curriculum data, lowering the cost of building
   AI-powered education tools.

3. **Third order (leverage)** — those external developers build
   new systems — AI-powered curriculum tools, teacher-facing
   products, educational services — that have a direct impact on
   teaching quality and pupil outcomes at scale. This is where
   the leverage of the initial investment is maximised: the
   practice governs the production of infrastructure that enables
   others to build things that change outcomes for teachers and
   children, in direct service of
   [Oak's mission](https://www.thenational.academy/about-us/who-we-are).

## Consequences

### Positive

- New developers and AI agents have a name for the system they
  are entering, making it easier to reason about and discuss
- The conceptual boundary clarifies what is part of the practice
  (and what is product code), preventing scope confusion
- The three-layer model provides a mental map for navigating the
  1,000+ files across 20+ categories
- The self-teaching property is named and can be consciously
  preserved as the practice evolves
- The deliberate separation of practice from product makes the
  practice transferable to other repositories and organisations

### Negative

- The name "Agentic Engineering Practice" may initially feel
  unfamiliar or formal; the "the practice" shorthand mitigates
  this
- Naming the system creates an expectation of completeness that
  the self-teaching design intentionally avoids
- The file volume (~1,000+ files) is a consequence of the
  three-layer model and is managed through consolidation
  mechanisms (distillation, consolidate-docs, sub-agent
  architect); see [practice.md](../../../.agent/practice-core/practice.md)
  for details

### Neutral

- This ADR names and frames what already exists; it does not
  change any mechanism, structure, or workflow
- The practice guide (`.agent/practice-core/practice.md`) serves as
  the orienting map; this ADR records the decision
