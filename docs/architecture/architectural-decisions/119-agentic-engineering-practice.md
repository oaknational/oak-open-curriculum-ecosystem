# ADR-119: Agentic Engineering Practice

**Status**: Accepted
**Date**: 2026-02-22
**Related**: [Vision](../../VISION.md), [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-117 (Plan Templates and Components)](117-plan-templates-and-components.md)

## Context

Over the course of building this repository — across SDK extraction,
MCP tool wiring, OAuth flows, search integration, and quality
remediation — a system of interlocking artefacts emerged organically:
directives, rules, plans, templates, sub-agents, quality gates,
institutional memory, experiential records, and platform-specific
bindings.

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
[docs/VISION.md](../../VISION.md). This ADR defines one specific part of that
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
- **Platform bindings** — Cursor rules, commands, agents, skills;
  Codex/Claude entry points

It _excludes_ the product code itself (SDK, MCP servers, search
system, applications) — those are what the practice produces, not
what the practice is. The boundary is drawn deliberately: the
practice is conceived as a transferable pattern that can be adopted
in other repositories, both within Oak and beyond. The product code
is specific to Oak's curriculum; the practice is generalisable.

### Three Layers

The practice operates in three layers, each building on the one
below:

1. **Philosophy** — the principles and learning mechanisms.
   The First Question ("could it be simpler?"), metacognition,
   experience records, and the napkin-distilled-rules learning
   loop. This layer defines _why_ the practice works.
   **Architectural Enforcement** is a core philosophical
   commitment and an active adoption track: preferring physical
   constraints (lint, boundaries) over human vigilance.

2. **Structure** — the organisational patterns. Directives,
   plans and their templates (ADR-117), ADRs, sub-agent prompt
   architecture (ADR-114), quality gates, institutional memory.
   This layer defines _what_ the practice consists of. It
   includes **Cross-Agent Standardisation** (AGENTS.md, Agent
   Skills) as an evolving implementation direction to keep the
   practice portable and platform-agnostic.

   Plans form a **nested hierarchy** from strategic overview
   down to hands-on implementation tasks:
   (a) strategic index (`high-level-plan.md`),
   (b) collection roadmaps (e.g. `roadmap.md`),
   (c) active execution plans (e.g. `widget-search-rendering.md`),
   (d) platform-specific session plans (e.g. `.cursor/plans/`).
   The lowest-level active plans in `.agent/plans/` are
   supplemented by platform-specific plans created per-session
   for fine-grained task tracking (e.g. Cursor plans in
   `.cursor/plans/` with batch breakdowns and review checkpoints).

3. **Tooling** — the platform-specific implementations.
   `.cursor/rules/` (always-applied workspace rules),
   `.cursor/commands/` (slash commands), `.cursor/agents/`
   (sub-agent definitions), `.cursor/skills/` (specialised
   capabilities), and entry-point files (`AGENT.md`, `CLAUDE.md`,
   `AGENTS.md`). This layer defines _how_ the practice is used.

### Feedback Loops and Recursive Self-Improvement

The practice is stabilised by interlocking feedback loops --
the same mechanism that stabilises any complex system.

**Negative feedback loops** correct errors and prevent drift:
quality gates catch regressions, sub-agent reviews catch design
issues, and the learning loop converts mistakes into rules that
prevent repetition. These are the system's error-correcting
mechanisms.

**Positive feedback loops** compound capability over time: the
subagent-architect reviews and upgrades other agents, which then
produce better reviews, which improve code quality, which raises
the bar for what agents must understand. The consolidation
workflows (documentation and prompt architecture) extract common
threads into shared structures, making the system simpler and
more consistent with each pass.

This recursive self-improvement -- agents improving agents,
reviews improving reviews, consolidation simplifying
consolidation -- is not incidental. It is the mechanism by
which the practice adapts to changing requirements and growing
complexity without external intervention. It is what makes the
practice a _practice_ rather than a static framework.

### Self-Teaching Property

The practice is designed to be discoverable through use.
`AGENT.md` links to `rules.md`, which references
`testing-strategy.md` and `schema-first-execution.md`. Commands
invoke prompts, prompts reference plans, plans use templates.
Sub-agents review work against the same rules that guided its
creation. The napkin captures what went wrong, distillation
extracts rules, and the rules prevent repetition.

This self-teaching property is intentional and should be
preserved. Communication about the practice should explain
_just enough_ for someone to know to follow the thread, then
let the self-teaching nature do the rest.

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
  500+ files across 20+ categories
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

### Neutral

- This ADR names and frames what already exists; it does not
  change any mechanism, structure, or workflow
- The practice guide (`.agent/directives/practice.md`) serves as
  the orienting map; this ADR records the decision
