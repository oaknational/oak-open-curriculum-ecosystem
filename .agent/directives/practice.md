# The Agentic Engineering Practice

The agentic engineering practice is the self-reinforcing system of principles, structures, agents, and tooling that governs how work happens in this repository. It creates the conditions for safe, high-quality human-AI collaboration. The practice is what produces the product code (SDK, MCP servers, search system) — but it is not the product code itself.

**See also**: [ADR-119](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) records the naming decision and conceptual boundary.

## Three Layers

The practice operates in three layers. Each builds on the one below.

```mermaid
graph TB
    subgraph Philosophy ["Philosophy — why it works"]
        FQ["First Question<br/><i>Could it be simpler?</i>"]
        MC[Metacognition]
        EX[Experience Records]
        LL[Learning Loop]
    end

    subgraph Structure ["Structure — what it consists of"]
        DIR[Directives]
        PLANS[Plans & Templates]
        ADR[ADRs]
        SA[Sub-agents]
        QG[Quality Gates]
        MEM[Institutional Memory]
    end

    subgraph Tooling ["Tooling — how it is used"]
        RULES[".cursor/rules/"]
        CMDS[".cursor/commands/"]
        AGENTS[".cursor/agents/"]
        SKILLS[".cursor/skills/"]
        ENTRY["Entry points<br/>AGENT.md · CLAUDE.md · AGENTS.md"]
    end

    Philosophy --> Structure --> Tooling
```

### Philosophy

The principles and learning mechanisms. The First Question ("could it be simpler?"), [metacognition](metacognition.md), [experience records](../experience/README.md), and the learning loop. This layer defines *why* the practice works.

### Structure

The organisational patterns. [Directives](./) (this directory), [plans](../plans/) and their [templates](../plans/templates/), [ADRs](../../docs/architecture/architectural-decisions/), sub-agent [prompt architecture](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) ([ADR-114](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)), quality gates, and [institutional memory](../memory/). This layer defines *what* the practice consists of.

### Tooling

Platform-specific implementations. `.cursor/rules/` (always-applied workspace rules), `.cursor/commands/` (slash commands), `.cursor/agents/` (sub-agent definitions), `.cursor/skills/` (specialised capabilities), and entry-point files (`AGENT.md`, `CLAUDE.md`, `AGENTS.md`). This layer defines *how* the practice is used in a specific environment.

## The Learning Loop

The practice improves through use. Mistakes, corrections, and discoveries flow through a cycle that converts experience into rules.

```mermaid
graph LR
    W[Work] -->|mistakes & discoveries| N[Napkin]
    N -->|accumulates ~800 lines| D[Distilled Learnings]
    D -->|high-signal patterns| R[Rules & Directives]
    R -->|govern| W
```

- **Napkin** (`.agent/memory/napkin.md`) — session-level log of what went wrong, what worked, and corrections received. Written continuously during every session.
- **Distilled learnings** (`.agent/memory/distilled.md`) — curated rulebook extracted from the napkin when it grows large. Deduplicates, archives, and rotates.
- **Rules** (`.agent/directives/rules.md`, `.cursor/rules/*.mdc`) — the operational rules that govern all work. Updated when distilled learnings reveal persistent patterns.
- **Experience** (`.agent/experience/`) — qualitative records of shifts in understanding across sessions.

## The Review System

Specialist sub-agents provide targeted review after non-trivial changes. The `invoke-code-reviewers` rule (`.cursor/rules/invoke-code-reviewers.mdc`) is the authoritative source for the full roster, invocation matrix, timing tiers, and triage checklist. The [AGENT.md](AGENT.md) "Available Sub-agents" section lists all reviewers by name.

Sub-agent prompts follow a three-layer composition architecture ([ADR-114](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)): components, templates, and wrappers.

## The Workflow

Work flows through a predictable sequence: commands invoke prompts, prompts reference plans, plans use templates, quality gates validate the output.

```mermaid
graph LR
    CMD[Commands] --> PROMPT[Prompts]
    PROMPT --> PLAN[Plans]
    PLAN --> TMPL[Templates]
    PLAN --> WORK[Implementation]
    WORK --> QG[Quality Gates]
    QG --> REVIEW[Sub-agent Reviews]
    REVIEW --> CONSOL[Documentation Consolidation]
```

- **Commands** (`.cursor/commands/`) — slash commands that initiate structured workflows
- **Prompts** (`.agent/prompts/`) — reusable playbooks that provide domain context and operational guidance. Session entry points (e.g. `semantic-search.prompt.md`) combine grounding, context, and a pointer to the active execution plan
- **Plans** (`.agent/plans/`) — executable work plans forming a nested hierarchy from strategic overview down to hands-on implementation tasks:
  1. **Strategic index** — `high-level-plan.md` cross-collection overview
  2. **Collection roadmaps** — e.g. `semantic-search/roadmap.md` milestone sequence
  3. **Active execution plans** — e.g. `semantic-search/active/widget-search-rendering.md` with YAML frontmatter, phased execution, and deterministic validation. Active plans live in `active/`, completed plans move to `archive/completed/`
  4. **Platform-specific plans** — e.g. `.cursor/plans/*.plan.md` (Cursor plans) supplement the lowest-level active plans with session-scoped implementation tasks, batch breakdowns, and review checkpoints. These are created per-session and track fine-grained progress that is too ephemeral for the active plan itself
- **Templates** (`.agent/plans/templates/`) — reusable plan components ([ADR-117](../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md))
- **Quality gates** — see [rules.md](rules.md) and `pnpm qg`. All gates are always blocking.

## Artefact Map

| Location | What lives there |
|---|---|
| `.agent/directives/` | Principles, rules, and this practice guide |
| `.agent/plans/` | Work planning — active, archived, and templates |
| `.agent/memory/` | Institutional memory — napkin and distilled learnings |
| `.agent/experience/` | Experiential records across sessions |
| `.agent/prompts/` | Reusable prompt playbooks |
| `.agent/sub-agents/` | Reviewer prompt architecture (components, templates) |
| `.agent/skills/` | Repo-managed skills for shared workflows |
| `.cursor/rules/` | Always-applied workspace rules |
| `.cursor/commands/` | Slash commands |
| `.cursor/agents/` | Sub-agent definitions (Cursor-specific) |
| `.cursor/skills/` | Skills (Cursor-specific) |
| `docs/architecture/architectural-decisions/` | Permanent architectural decision records |

## Feedback Loops and Recursive Self-Improvement

The practice is stabilised by interlocking feedback loops -- the same mechanism that stabilises any complex system. Each loop is a cycle where outputs feed back to improve inputs.

```mermaid
graph TB
    subgraph negative ["Negative Feedback Loops — error correction"]
        QG["Quality Gates<br/>catch regressions"]
        SAR["Sub-agent Reviews<br/>catch design issues"]
        LL2["Learning Loop<br/>napkin → distilled → rules"]
    end

    subgraph positive ["Positive Feedback Loops — capability growth"]
        AIA["Agents improve agents<br/>architect → templates → better reviews"]
        STP["Self-teaching property<br/>use → discovery → fluency"]
        CONSOL["Consolidation<br/>extract common threads → simpler system"]
    end

    negative --> positive
```

**Negative feedback loops** correct errors and prevent drift:

- **Quality gates** catch regressions before they propagate
- **Sub-agent reviews** catch design, security, and architectural issues
- **The learning loop** converts mistakes into rules that prevent repetition

**Positive feedback loops** compound capability over time:

- **Agents improve agents** -- the subagent-architect reviews and upgrades other agents, which then produce better reviews, which improve code quality, which raises the bar for what agents must understand. This recursive self-improvement is analogous to how a mature engineering team raises its own standards through retrospectives and practice refinement
- **Self-teaching** -- each new user (human or AI) who follows the practice from `AGENT.md` discovers the system through use, and their questions and mistakes feed back into documentation improvements
- **Consolidation** -- the `/jc-consolidate-docs` workflow and the subagent-architect's ecosystem consolidation procedure both extract common threads into shared, reusable structures. Each consolidation pass leaves the system simpler and more consistent

These loops operate at different timescales -- quality gates within seconds, learning loops within sessions, consolidation across sessions -- but they all serve the same purpose: keeping the practice aligned with reality and continuously improving.

## The Self-Teaching Property

The practice is designed to be discoverable through use. `AGENT.md` links to `rules.md`, which references `testing-strategy.md` and `schema-first-execution.md`. Commands invoke prompts, prompts reference plans, plans use templates. Sub-agents review work against the same rules that guided its creation. The napkin captures what went wrong, distillation extracts rules, and the rules prevent repetition.

If you are new to this repository, start with [AGENT.md](AGENT.md). Follow the links. The practice will teach itself.
