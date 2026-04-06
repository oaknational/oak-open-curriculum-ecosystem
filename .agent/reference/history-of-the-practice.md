# History of the Evolution of the Practice

A living record of how the Practice emerged, grew, and became a
self-propagating system. This document covers the pre-Practice origins,
the formation period, and the ongoing evolution. Updated as the Practice
evolves.

**Sources**: Git history of `oak-open-curriculum-ecosystem` (OOCE) and
`VoxQuant`, Practice Core CHANGELOG, and `provenance.yml`.

---

## Era 0: Pre-Practice — Windsurf Rules and Cognitive Frameworks (Apr-Jul 2025)

The Practice did not begin with a grand design. It began with frustration.

### VoxQuant: The First Agent-Assisted Codebase (Apr 2025)

VoxQuant (originally a Reddit financial data scraper, later an agent
collaboration research platform) was the first codebase where Jim worked
seriously with AI coding agents. The earliest commits tell the story of
a developer learning what agents need:

- **2025-04-26**: `.windsurfrules` — the first attempt at giving an agent
  context. A single file of rules for Windsurf (Codeium's IDE). This was
  the "CLAUDE.md equivalent" of the era.
- **2025-04-30**: A full day spent iterating on rules formats — "first go
  at new rules", "combined rules — far too big", "condensed rules",
  "reset to a blank slate." The character limit of `.windsurfrules` forced
  compression. The insight: agent rules need to be concise but complete.
- **2025-05-24**: `CLAUDE.md` created — "provide an entry point for Claude
  code." The first Claude Code integration alongside Windsurf.

### VoxQuant: The Cognitive Framework Period (Jun-Aug 2025)

VoxQuant became a laboratory for agent infrastructure experiments:

- **2025-06-08**: "define cognitive framework" — the first structured
  attempt at agent metacognition. Not yet the Practice, but the seeds:
  explicit reflection, structured decision-making, quality consciousness.
- **2025-06-19**: "EVOLVING the cognitive framework, significant changes"
  — the framework was not static. It grew through use.
- **2025-06-20**: "consciousness conductors" — an experiment in agent
  behavioural architecture (attention, feedback mechanisms, reflection).

### VoxQuant: Strange Attractor and Rainbow Connection (Jun-Jul 2025)

Two algorithms emerged that were early explorations of cross-session
continuity and learning — concepts later refined in the Practice's
learning loop:

- **Strange Attractor** (2025-06-22 to 2025-07-24): A "consciousness
  algorithm" that recursively synthesises insights from a codebase. It
  reads files in batches, extracts insights, synthesises meta-level
  understanding, then synthesises meta-meta understanding. The output
  flows to `.agent/meta-synthesis/`. Named after the mathematical
  concept: it pulls scattered insights toward a coherent centre without
  reaching a final destination — understanding deepens infinitely. This
  is the ancestor of the distillation process in the Practice's learning
  loop: raw observations → patterns → settled understanding.
- **Rainbow Connection** (2025-06-20 to 2025-07-23): Maps horizontal
  relationships across files — concept deduplication, relationship
  discovery, and connection graphs. Where Strange Attractor extracts
  vertical depth through recursive synthesis, Rainbow Connection finds
  lateral connections. Together they created "stereoscopic consciousness
  — seeing with depth." This is the ancestor of the pattern extraction
  process: recognising that the same insight applies across different
  contexts.

Both algorithms used `.agent/` directories for their output — patterns,
insights, experience reflections, knowledge graphs, and deep memory.
The `.agent/` directory structure that later became standard Practice
infrastructure was first developed here to store the outputs of these
algorithms.

Key insight from this period: the "Learning Axiom" — that a system can
develop understanding through structured recursive reflection. This
would become the Practice's learning loop: capture → distil → graduate
→ enforce.

### VoxQuant: The Foundation Period (Aug 2025)

- **2025-07-02**: "cognitive-process-algorithms" extracted into its own
  workspace — the cognitive framework became a first-class concern.
- **2025-08-05 to 2025-08-15**: The "Foundation" period. A concept called
  "Foundation compliance" emerged — zero type assertions, pure function
  architecture, I/O boundary isolation. These became ADRs (001-004) in
  VoxQuant. The principle of "no type assertions" that later became
  absolute in the Practice was first articulated here as "Foundation
  principles."

### VoxQuant: Agent Collaboration (2026-02-14 onward)

After a gap (Aug 2025 to Feb 2026), VoxQuant pivoted to agent
collaboration research:

- **2026-02-14**: "provider-agnostic agent collaboration substrate" —
  multiple Claude instances collaborating via MCP, tmux, and Slack.
- **2026-02-15 to 2026-02-18**: Session tracking, orchestration specs,
  cognitive process documentation. The `.agent/` directory grew to
  include plans, sessions, experience records, deep memory, and meta
  directories — a parallel evolution to what was happening in OOCE,
  but with a different structure.

VoxQuant never adopted the Practice Core formally. It developed its own
agent infrastructure organically. The Practice Core evolved elsewhere and
may yet be integrated back.

---

## Era 1: OOCE Foundation — From CLAUDE.md to Structured Agent Support (Jul-Oct 2025)

### The First Day (2025-07-28)

Oak Open Curriculum Ecosystem was born on 28 July 2025. Within hours of
the initial commit, agent infrastructure appeared:

- **97fbecd7** (13:24): `.agent/directives-and-memory/AGENT.md` (86
  lines) — the first AGENT.md. Also created `CLAUDE.md`, `GEMINI.md`,
  `.windsurf/rules/`, and the `.agent/` directory tree. From the very
  first day, this was an agent-first codebase.
- **6bf380b1** (14:14): `GO.md` — the first metacognitive framework.
  A reflection prompt for agents to pause and think. This would later
  become the `jc-go` command.
- **4e9d9878** (14:43): `.agent/prompts/` — prompt infrastructure.
  Historical records "for education" — the earliest expression of the
  idea that agent work should be recorded and learned from.

### The Building Period (Jul 2025 - Feb 2026)

OOCE grew into a production SDK ecosystem: curriculum SDK, MCP servers,
semantic search. The `.agent/` directory accumulated plans, reference
material, and session prompts. But there was no formal governance system.
Agent guidance lived in AGENT.md and evolved informally. ADRs accumulated
(eventually reaching 150+), each recording architectural decisions.

Key milestones:

- **2025-08-02**: v1.0.0 — MCP server live.
- **2025-08-03**: "biological architecture with mathematical foundation"
  — an early experiment in structured system design. The language was
  different, but the impulse was the same: make the architecture explicit
  and self-reinforcing.
- **2025-10 onward**: Semantic search, Elasticsearch integration,
  operator tooling. The codebase grew complex enough that informal agent
  guidance was insufficient.

---

## Era 2: The Practice Emerges — Plasmid Exchange and the Core (Feb-Mar 2026)

### Origin (2026-02-26)

The Practice Core was created simultaneously in two repos on the same
day:

- `cloudinary-icon-ingest-poc` — a short-lived proof-of-concept for
  SVG icon ingestion. Small, disposable, and therefore safe to
  experiment with.
- `oak-open-curriculum-ecosystem` — the production codebase.

The initial package: 5 files. Three blueprints (the "plasmid trinity"):
`practice.md` (philosophy and architecture), `practice-lineage.md`
(propagation and evolution), `practice-bootstrap.md` (installation
templates). Plus `README.md` (human entry) and `index.md` (agent entry).

The name "plasmid exchange" came from bacterial conjugation — horizontal
gene transfer between organisms. The Practice was designed from the start
to travel between repos and evolve through use, not through central
decree.

### First Round-Trip: new-cv (2026-03-05 to 2026-03-09)

The Practice's first real test: Jim's personal website and CV repo.
A single-developer, editorial-voice project — completely different from
the production SDK ecosystem.

The round-trip proved the Practice could adapt:

- `new-cv` added value traceability to the planning model.
- `new-cv` introduced the Codex reviewer-sub-agent pattern.
- `new-cv` added the CHANGELOG as the 6th Core file.
- The Practice returned to OOCE enriched, not diluted.

### Formal Governance: Rules, Principles, and Specialists (2026-03-06 to 2026-03-07)

In OOCE, a critical structural transition happened in two days:

- **2026-03-06**: The first specialist reviewer agent (`mcp-reviewer`)
  was created. Domain-specific knowledge encoded in a structured template
  with platform adapters for Claude Code and Cursor.
- **2026-03-07**: The three-layer architecture was codified. The rename
  from `rules.md` to `principles.md` (ADR-127) established the hierarchy:
  Principles (foundational) > Rules (individual canonical) > Platform
  Adapters (thin wrappers). This was the moment the Practice gained
  structural self-awareness.
- **2026-03-07**: Always-on governance rules were pushed to
  `.claude/rules/` — closing the gap where Claude Code couldn't see
  `.agent/rules/`. The insight: platform-specific wrappers are
  infrastructure, not optional.

### Second Integration: castr (2026-03-09)

An IR-based schema transformation library — a mature codebase with its
own established norms. The Practice had to integrate without overwriting
local doctrine. This proved the "survey local norms before hydrating"
principle and confirmed that `principles.md` was the right name for the
foundational document.

### Third Round-Trip: pine-scripts and algo-experiments (2026-03-17 to 2026-03-23)

The most productive exchange period. `pine-scripts` (Pine Script trading
strategies) and `algo-experiments` (Python trading research) were
different ecosystems — Python, not TypeScript. The Practice had to prove
it was truly ecosystem-agnostic.

**pine-scripts** (2026-03-17):

- Built the three-layer sub-agent composition model (components >
  templates > wrappers).
- Created the canonical plan lifecycle (active/current/future/archive).
- Assessed itself at Practice Maturity Level 3 (Self-Correcting).
- Wrote back 4 documents to the source ecosystem.

**algo-experiments** (2026-03-19 to 2026-03-23):

- 8 evolution rounds in a single day (2026-03-23).
- Promoted "strict and complete, everywhere, all the time" as explicit
  doctrine.
- Extracted provenance into `provenance.yml` — the 7th Core file.
- Introduced fitness key renames and three-dimension fitness constraints.
- Created the prompts-to-skills migration.
- Introduced Learned Principles tiering (axioms vs active).

This round-trip was the Practice's adolescence — rapid structural change,
each iteration driven by real implementation needs.

---

## Era 3: Maturation — Transmission Safety and Self-Verification (Apr 2026)

### Continuity and Specialist Scaling (2026-04-02)

- Three new ADR-129 specialist reviewer triplets (accessibility,
  design-system, react-component) — the roster reached 17 specialists.
- The continuity practice was formalised: `session-handoff` for
  lightweight continuity, `consolidate-docs` for deep convergence.
- The surprise pipeline was codified: capture > distil > graduate >
  enforce.

### Transmissibility (2026-04-03)

The incoming Practice Context from `agent-collaboration` exposed concrete
hydration failure modes: hook activation without canonical source,
continuity workflows pointing at absent surfaces, memory layer claimed
before installation. The response was the 8th Core file:

- **`practice-verification.md`**: Split from `practice-bootstrap.md` to
  give verification proper weight. Contains the minimum operational
  estate, claimed/installed/activated audit, and fresh-checkout acceptance
  criteria.
- **UUID provenance migration**: Sequential integer IDs in
  `provenance.yml` were replaced with UUID v4 to eliminate implied
  hierarchy and merge-conflict risk during exchange.

### Concept Exchange (2026-04-05)

Three foundational principles were promoted during the Practice Core
evolution session:

1. **Concepts are the unit of exchange.** The Practice learns, teaches,
   compares, and evolves at the concept level — not the file or name
   level.
2. **Substance before fitness.** Concepts must be written at the weight
   they deserve first; fitness limits are a post-writing editorial
   concern.
3. **Self-containment requires concept export.** Travelling content
   carries the substance itself, not pointers to where a host repo
   documents it.

---

## The Practice Core File Count Over Time

| Files | Date | Trigger |
|-------|------|---------|
| 5 | 2026-02-26 | Origin: trinity + two entry points |
| 6 | 2026-03-06 | new-cv: CHANGELOG for exchange provenance |
| 7 | 2026-03-23 | algo-experiments: provenance.yml extracted from frontmatter |
| 8 | 2026-04-03 | oak: practice-verification.md split from bootstrap |

## The Repo Network

Repos that have hosted the Practice Core, in order of first contact:

| Repo | First Contact | Character |
|------|--------------|-----------|
| cloudinary-icon-ingest-poc | 2026-02-26 | Short-lived POC (co-origin) |
| oak-open-curriculum-ecosystem | 2026-02-26 | Production SDK ecosystem (co-origin, primary development) |
| new-cv | 2026-03-05 | Personal website/CV (first round-trip) |
| castr | 2026-03-09 | IR schema transformation (mature integration) |
| pine-scripts | 2026-03-17 | Trading strategy research (Python, Pine Script) |
| algo-experiments | 2026-03-19 | Trading research platform (Python, rapid evolution) |
| agent-collaboration (VoxQuant) | 2026-04-03 | Agent collaboration research (incoming contributor) |

## The Pre-Practice Lineage

The Practice did not appear from nothing. Its intellectual ancestors:

- **VoxQuant `.windsurfrules`** (2025-04-26): The first attempt at
  structured agent guidance. The constraint of a character-limited rules
  file forced the discipline of concise, complete rules.
- **VoxQuant cognitive framework** (2025-06-08): Structured agent
  metacognition. The Practice's emphasis on reflection and self-awareness
  descends from this.
- **VoxQuant Strange Attractor** (2025-06-22): Recursive synthesis of
  insights from a codebase — the ancestor of the distillation process
  in the Practice's learning loop. Raw observations → patterns → settled
  understanding, deepening with each pass.
- **VoxQuant Rainbow Connection** (2025-06-20): Horizontal relationship
  mapping across files — the ancestor of pattern extraction. Finding
  the same insight in different contexts. Together with Strange Attractor,
  these algorithms pioneered the `.agent/` directory structure and the
  concept of structured cross-session knowledge accumulation.
- **VoxQuant Foundation principles** (2025-08-05): Zero type assertions,
  pure functions, I/O boundary isolation. The Practice's absolute
  prohibition on type assertions was first articulated here.
- **OOCE AGENT.md** (2025-07-28): The first day of OOCE included
  agent infrastructure. The Practice inherited the idea that agent
  guidance is infrastructure, not documentation.
- **OOCE GO.md** (2025-07-28): The metacognitive reflection prompt.
  Later became `jc-go`, now a Practice command.
- **OOCE ADR system** (2025-08 onward): 150+ architectural decision
  records. The Practice's emphasis on recording decisions and their
  rationale comes from this tradition.

---

## Where We Are Now (2026-04-05)

The Practice is a self-propagating system of 8 Core files, travelling
between 7+ repos, with a learning loop (capture > distil > graduate >
enforce), 17+ specialist reviewers in OOCE, and cross-repo exchange via
plasmid semantics. It is ecosystem-agnostic (TypeScript, Python, Pine
Script), platform-portable (Claude Code, Cursor, Codex, Gemini CLI),
and self-verifying (practice-verification.md, fitness validators,
portability checks).

This document will continue to be updated as the Practice evolves.
