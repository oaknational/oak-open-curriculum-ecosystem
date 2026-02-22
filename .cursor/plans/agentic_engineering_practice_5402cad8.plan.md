---
name: Agentic Engineering Practice
overview: Define, frame, and communicate the "Agentic Engineering Practice" — the conceptual boundary around the system of rules, workflows, sub-agents, quality gates, memory, and tooling that creates a safe environment for human-AI collaboration in this repository.
todos:
  - id: adr
    content: Write ADR-119 defining the Agentic Engineering Practice — name, boundary, three-layer model, self-teaching property
    status: completed
  - id: practice-guide
    content: Write .agent/directives/practice.md — the orienting map (under 200 lines, mermaid diagrams, signposts not reference)
    status: completed
  - id: readme-update
    content: Add Agentic Engineering Practice section to root README.md
    status: completed
  - id: agent-md-update
    content: Add brief practice framing to AGENT.md
    status: completed
  - id: onboarding-update
    content: Add practice.md to onboarding reading list
    status: completed
  - id: quality-gates
    content: Full quality gate chain
    status: completed
  - id: reviews
    content: "Specialist reviews: docs-adr-reviewer, architecture-reviewer-barney"
    status: completed
isProject: false
---

# Agentic Engineering Practice — Communication Plan

## The Naming Decision

**Name**: Agentic Engineering Practice (shorthand: "the practice")

**Conceptual boundary**: everything that together creates the conditions for safe, high-quality human-AI collaboration on this codebase. Includes principles, structures, agents, workflows, learning mechanisms, and platform bindings. *Excludes* the product code itself (SDK, MCP servers, search system) — those are what the practice produces.

**Three layers**:

- **Philosophy** — First Question, metacognition, experience, the learning loop
- **Structure** — directives, plans, templates, ADRs, memory, sub-agents, quality gates
- **Tooling** — platform-specific bindings (`.cursor/rules/`, `.cursor/commands/`, `.cursor/agents/`, entry points)

## Communication Principle

The practice is self-teaching: you pull one thread (AGENT.md) and the tapestry reveals itself. The communication work should explain *just enough* for someone to know to pull the thread, then let the self-teaching nature do the rest. Over-documenting would undermine the property that makes it work.

## Deliverables

### 1. ADR: Agentic Engineering Practice

Record the naming decision and conceptual boundary as an architectural decision.

- **File**: `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md` (next ADR number — verify)
- **Content**: the name, the three-layer model, the conceptual boundary, the self-teaching property, the learning loop, why "practice" and not "framework"
- **Cross-references**: ADR-114 (sub-agent architecture), ADR-117 (plan templates)

### 2. Practice Guide

A single document that maps the whole system for someone encountering it for the first time. Not exhaustive — orienting.

- **File**: `.agent/directives/practice.md` (alongside AGENT.md, rules.md — this is a directive)
- **Content**:
  - What the agentic engineering practice is (one paragraph)
  - The three layers (philosophy, structure, tooling) with a mermaid diagram
  - The learning loop (napkin → distilled → rules → work → napkin) with a mermaid diagram
  - The review system (specialist sub-agents, invocation matrix reference)
  - The workflow (commands → prompts → plans → quality gates)
  - The artefact map — what lives where:
    - `.agent/directives/` — principles and rules
    - `.agent/plans/` — work planning
    - `.agent/memory/` — institutional memory
    - `.agent/experience/` — experiential record
    - `.agent/sub-agents/` — reviewer prompt architecture
    - `.cursor/` — Cursor-specific bindings
    - `docs/architecture/architectural-decisions/` — permanent decision records
  - NOT a reference manual — a map with signposts. Each section points to the authoritative source.

### 3. Root README Update

Add a section introducing the practice to the root [README.md](README.md). Currently the README covers the product (SDK, MCP, search) but not how the repo works.

- **Location**: new section after "Documentation & Onboarding", before "Contributing"
- **Title**: "Agentic Engineering Practice"
- **Content**: 3-4 paragraphs maximum:
  - What it is (one sentence)
  - Why it exists (safety + quality for human-AI collaboration)
  - Where to start (link to `practice.md`)
  - The self-teaching property (follow the thread from AGENT.md)

### 4. AGENT.md Update

Frame AGENT.md as part of the practice. Currently it's the entry point but doesn't name or frame the larger system it belongs to.

- **Change**: add a brief "Agentic Engineering Practice" section near the top, after "Grounding", that names the practice, links to `practice.md`, and explains that AGENT.md is the operational entry point within a larger self-reinforcing system
- **Keep it brief**: 3-5 lines. AGENT.md should remain concise and action-oriented.

### 5. Onboarding Update

Update [docs/development/onboarding.md](docs/development/onboarding.md) to mention the practice in the "Read the Grounding Docs" section.

- **Change**: add `practice.md` to the reading list alongside AGENT.md and rules.md
- **One line**: "Read `.agent/directives/practice.md` for a map of the practice — the system of rules, workflows, and reviewers that governs how work happens."

## Non-Deliverables

- **NOT** a comprehensive reference manual of every file (the practice is self-teaching)
- **NOT** a migration guide (this is framing, not changing anything)
- **NOT** renaming any existing files or directories
- **NOT** changing how any existing mechanism works

## Execution Order

1. ADR first (establishes the decision)
2. Practice guide (the main deliverable)
3. README, AGENT.md, onboarding updates (wire it in)
4. Quality gates
5. Reviews: `docs-adr-reviewer` (ADR quality), `architecture-reviewer-barney` (framing/boundary clarity)

## Risk Assessment

- **Over-documentation**: The practice guide becomes a reference manual instead of a map. Mitigation: strict length limit (under 200 lines), every section points elsewhere.
- **Naming doesn't land**: "Agentic Engineering Practice" feels too formal or too niche. Mitigation: the ADR records the rationale; the name can evolve.
- **Scope creep**: temptation to reorganise `.agent/` structure during this work. Mitigation: this plan is framing-only, no structural changes.
