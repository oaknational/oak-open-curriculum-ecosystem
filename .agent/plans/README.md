# Plans

Strategic and tactical planning documents for the Oak Open Curriculum Ecosystem.

**High-Level Coordination**: [high-level-plan.md](high-level-plan.md)
**Milestones**: [milestones/](../milestones/) — per-milestone summaries (audience, value, gates)
**Completed Plans**: [completed-plans.md](completed-plans.md)
**Foundation Documents**: [.agent/directives/](../directives/)

---

## Plan Collections

| Collection | Purpose | Status |
|------------|---------|--------|
| [semantic-search/](semantic-search/) | Elasticsearch search implementation | ✅ Merge-prep complete; secrets sweep next |
| [sdk-and-mcp-enhancements/](sdk-and-mcp-enhancements/) | MCP extensions, SDK pipeline evolution, concept preservation | 🔄 Active |
| [architecture-and-infrastructure/](architecture-and-infrastructure/) | Cross-cutting architecture, system quality, observability | 📋 Planned |
| [agentic-engineering-enhancements/](agentic-engineering-enhancements/) | Architectural enforcement, hallucination/evidence guards, cross-agent standardisation, mutation testing | 📋 Planned |
| [the-practice/](the-practice/) | Practice evolution and adoption of validated agentic workflow concepts | 🔬 In Progress |
| [security-and-privacy/](security-and-privacy/) | MCP security hardening, claim/evidence safeguards, and protocol/auth/tool governance baselines | 📋 Planned |
| [developer-experience/](developer-experience/) | SDK publishing, generated docs, tooling | 📋 Planned |
| [external/](external/) | Upstream API wishlist | 📋 Reference |
| [icebox/](icebox/) | Deferred/low priority | ⏸ Deferred |
| [archive/](archive/) | Completed/superseded plans | ✅ Complete |
| [templates/](templates/) | Plan templates | 📚 Reference |

---

## Plan Collection Structure

Each plan collection follows a consistent pattern:

```text
.agent/plans/{collection-name}/
├── README.md           # Navigation hub with current status
├── requirements.md     # Success criteria, business context (optional)
├── {plan-documents}    # Individual plan files
├── reference-docs/     # Supporting reference material (optional)
└── archive/            # Completed/superseded plans (optional)
```

---

## Related Directories

| Directory | Purpose | Relationship |
|-----------|---------|--------------|
| [.agent/research/](../research/) | Research proposals, analysis | Informs plans |
| [.agent/evaluations/](../evaluations/) | Experiment results, guidance | Validates plans |
| [.agent/prompts/](../prompts/) | Entry points for AI sessions | Implements plans |
| [docs/architecture/architectural-decisions/](../../docs/architecture/architectural-decisions/) | ADRs | Documents decisions |

---

## Naming Conventions

### Plan Files

| Pattern | Use For | Example |
|---------|---------|---------|
| `{nn}-{name}-plan.md` | Numbered plans in a sequence | `03-mcp-infrastructure-plan.md` |
| `{part}-{stream}-{name}.md` | Part/Stream structured plans | `part-1-stream-a-relevance.md` |
| `phase-{n}-{name}.md` | Sequential phases (legacy) | `phase-3-multi-index.md` |
| `{name}-plan.md` | Standalone plans | `config-architecture-plan.md` |

### Status Indicators

| Status | Meaning |
|--------|---------|
| 📋 Planned | Not started |
| 🔬 In Progress | Actively being worked on |
| ⏸ Blocked/Deferred | Waiting on dependency or deprioritised |
| ✅ Complete | Done |
| ❌ Abandoned | Won't implement |

---

## Creating New Plan Collections

When creating a new plan collection:

1. **Create the directory**: `.agent/plans/{collection-name}/`
2. **Create README.md**: Navigation hub (see template below)
3. **Create requirements.md** (optional): Business context and success criteria
4. **Follow the hierarchy guidelines** in the next section
5. **Update this file**: Add to the Plan Collections table
6. **Update high-level-plan.md**: Add to directory structure and active items

---

## Plan Triage Protocol

Use this when modernising an existing collection, consolidating stale plans, or
preparing archive moves.

### Triage Questions

1. Is the work still relevant to current repository state?
2. Is the plan stale (paths, ADR links, assumptions)?
3. Is there overlap or duplication with another plan?
4. Is the plan referenced by `high-level-plan.md` or other active documents?
5. Does the plan contain settled documentation that must be extracted before
   archiving?

### Decision Taxonomy

| Decision | Meaning | Typical Action |
|----------|---------|----------------|
| Keep | Current and actively useful | Retain in place; ensure status is accurate |
| Rewrite | Core intent valid, structure stale | Replace with a modernised plan |
| Consolidate | Duplicative with another plan | Merge content; keep one canonical plan |
| Icebox | Useful but not currently prioritised | Move to `icebox/` with a clear trigger |
| Archive | Complete and historical | Move to `archive/completed/` and update references |
| Delete | Obsolete/superseded with no remaining value | Remove after reference checks |

### Archive Prerequisite

Before archiving, extract settled documentation to permanent locations (ADRs,
`/docs/`, or workspace README files) and apply
[`jc-consolidate-docs`](../../.cursor/commands/jc-consolidate-docs.md).

---

# Plan Hierarchy: Part → Stream → Task

This section defines the standard structure for organising complex, multi-workstream plans. Use this structure when work involves multiple parallel concerns that converge on a common milestone.

## Core Concepts

### Hierarchy Levels

```text
Part (Major Milestone)
└── Stream (Parallel Workstream)
    └── Task (Concrete Work Item)
```

| Level | Purpose | Relationship | Naming |
|-------|---------|--------------|--------|
| **Part** | Major milestone or deliverable | Sequential gates | Part 1, Part 2, ... |
| **Stream** | Area of concern or capability | Can run in parallel | Stream A, Stream B, ... |
| **Task** | Concrete, actionable work item | Usually sequential within stream | A.1, A.2, B.1, ... |

### Why This Structure?

1. **Parallelism is explicit** — Streams A, B, C can progress independently
2. **Sequencing is implicit** — Tasks within a stream are ordered (A.1 before A.2)
3. **Dependencies are documented** — Cross-stream dependencies are called out
4. **Navigation is simple** — Easy to answer "where are we?" and "what's next?"

---

## Part: Major Milestone

A **Part** represents a major milestone or deliverable that gates significant progress.

### Characteristics

- Has a clear "Definition of Done"
- Enables subsequent Parts
- May take weeks or months to complete
- Contains multiple parallel Streams

### Example

```markdown
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption
```

### When to Create a New Part

- Work represents a major capability or milestone
- There's a clear gate before the next phase of work
- Multiple parallel workstreams will converge

---

## Stream: Parallel Workstream

A **Stream** represents an area of concern that can progress independently of other Streams within the same Part.

### Characteristics

- Has a distinct focus (e.g., "Relevance", "Infrastructure")
- Can run in parallel with other Streams
- Contains sequential Tasks
- May have dependencies on Tasks in other Streams

### Example

```markdown
Stream A: Relevance Optimization                    [Can start now]
───────────────────────────────────────────────────────────────────
  A.1  Baseline documentation                       B-001  📋
  A.2  Semantic reranking experiment                E-001  📋
  A.3  Linear retriever experiment                  E-003  📋
  A.4  Implement winning approaches                        📋

Stream B: Query Intelligence                        [Start after A.2]
───────────────────────────────────────────────────────────────────
  B.1  Query expansion experiment                   E-002  📋
  B.2  Query classification design                  ADR-082 📋
```

### Stream Naming

Use letters (A, B, C...) to reinforce that Streams are parallel, not sequential.

| Good | Avoid |
|------|-------|
| Stream A: Relevance | Stream 1: Relevance |
| Stream B: Infrastructure | Phase 1: Infrastructure |

### Stream Annotations

Add annotations to clarify parallelism and dependencies:

| Annotation | Meaning |
|------------|---------|
| `[Can start now]` | No blockers, work can begin |
| `[Start after X.n]` | Depends on specific task |
| `[Blocked by Part N]` | Depends on prior Part completion |
| `[Optional]` | Only if primary approach doesn't meet goals |

---

## Task: Concrete Work Item

A **Task** is a concrete, actionable work item that can be completed in a bounded time.

### Characteristics

- Atomic and specific
- Has clear completion criteria
- Takes hours to days (not weeks)
- May reference experiments (E-XXX) or ADRs

### Example

```markdown
  A.1  Baseline documentation                       B-001  📋
  A.2  Semantic reranking experiment                E-001  🔬
  A.3  Implement reranking                                 📋
```

### Task Numbering

Use `{Stream}.{Number}` format:

| Good | Avoid |
|------|-------|
| A.1, A.2, A.3 | 1, 2, 3 |
| B.1, B.2 | Task 1, Task 2 |

### Linking to Experiments and ADRs

Tasks should reference related artefacts:

```markdown
  A.2  Semantic reranking experiment                E-001  📋
       └── Details: .agent/evaluations/experiments/E-001-semantic-reranking.experiment.md

  B.2  Query classification design                  ADR-082 📋
       └── Requires: docs/architecture/architectural-decisions/082-*.md
```

---

## Dependencies

Document cross-stream dependencies explicitly:

```markdown
Dependencies:
  • B.1-B.4 depend on A.2 results (reranking may obviate expansion)
  • Part 2 depends on C.1-C.3 (SDK must exist for MCP to consume)
  • Stream C can start immediately (no blockers)
```

### Dependency Types

| Type | Notation | Meaning |
|------|----------|---------|
| Task-to-Task | `B.1 depends on A.2` | Specific task blocks another |
| Stream-to-Task | `Stream B starts after A.2` | Whole stream blocked |
| Part-to-Part | `Part 2 depends on Part 1` | Major milestone gate |
| Conditional | `Stream C if A doesn't meet target` | Fallback path |

---

## Complete Example

```markdown
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

Stream A: Relevance Optimization                    [Can start now]
───────────────────────────────────────────────────────────────────
  A.1  Baseline documentation                       B-001  📋
  A.2  Semantic reranking experiment                E-001  📋
  A.3  Linear retriever experiment                  E-003  📋
  A.4  Implement winning approaches                        📋
  A.5  Validate MRR improvement                            📋

Stream B: Query Intelligence                        [Start after A.2]
───────────────────────────────────────────────────────────────────
  B.1  Query expansion experiment                   E-002  📋
  B.2  Phonetic enhancement experiment              E-004  📋
  B.3  Query classification design                  ADR-082 📋
  B.4  Implement classification routing                    📋

Stream C: Infrastructure                            [Can start now]
───────────────────────────────────────────────────────────────────
  C.1  Extract Search SDK                                  📋
  C.2  Create CLI workspace                                📋
  C.3  Retire Next.js app                                  📋
  C.4  Documentation                                       📋

Dependencies:
  • B.1-B.4 depend on A.2 results (reranking may obviate expansion)
  • Part 2 depends on C.1-C.3 (SDK must exist for MCP to consume)
  • Stream C can start immediately (no blockers)

═══════════════════════════════════════════════════════════════════
Part 2: MCP Natural Language Tools
═══════════════════════════════════════════════════════════════════
Done when: Agents can search Oak curriculum via natural language

(Cross-reference: .agent/plans/sdk-and-mcp-enhancements/)

Stream A: Structured Search Tools
───────────────────────────────────────────────────────────────────
  A.1  Lesson search tool
  A.2  Unit search tool
  A.3  Filter tools (KS4, subject, etc.)

Stream B: Natural Language Pipeline
───────────────────────────────────────────────────────────────────
  B.1  NL→Search routing
  B.2  Intent detection
  B.3  Answer generation (RAG)

Stream C: Agent Guidance
───────────────────────────────────────────────────────────────────
  C.1  Tool prompts
  C.2  Workflow prompts
  C.3  Error handling

═══════════════════════════════════════════════════════════════════
Part 3: Future Enhancements
═══════════════════════════════════════════════════════════════════

Stream A: Reference Indices
Stream B: Entity Extraction
Stream C: Learning to Rank
Stream D: Full Curriculum Coverage
```

---

## When to Use This Structure

### Good Fit

- ✅ Multi-week projects with parallel concerns
- ✅ Work that converges on a major milestone
- ✅ Multiple team members or AI agents working simultaneously
- ✅ Complex dependencies that need explicit documentation

### Not Required

- ❌ Simple, linear sequences of tasks
- ❌ Single-stream work with no parallelism
- ❌ Small plans (< 10 tasks)

For simpler plans, use numbered tasks or the existing Phase structure.

---

## Migration from Phase-Based Plans

Existing phase-based plans (Phase 1, 2, 3...) don't need immediate migration. The Part → Stream → Task structure is recommended for:

1. **New plan collections** — Use from the start
2. **Major plan rewrites** — When restructuring significantly
3. **Complex multi-stream work** — When parallelism emerges

Phases can be mapped to the new structure:

| Old Structure | New Structure |
|---------------|---------------|
| Phase 1-3 (complete) | Part 1, Stream A (complete) |
| Phase 4 (SDK) | Part 1, Stream C |
| Phase 5-7 (future) | Part 2 or Part 3 |

---

## Templates

### Part Template

```markdown
═══════════════════════════════════════════════════════════════════
Part N: [Name]
═══════════════════════════════════════════════════════════════════
Done when: [Clear definition of done]

[Streams...]

Dependencies:
  • [Cross-stream and cross-part dependencies]
```

### Stream Template

```markdown
Stream X: [Name]                                    [Annotation]
───────────────────────────────────────────────────────────────────
  X.1  [Task description]                           [Ref]  [Status]
  X.2  [Task description]                           [Ref]  [Status]
  X.3  [Task description]                                  [Status]
```

### README.md Template for New Collections

```markdown
# [Collection Name]

[One-line description of what this collection covers.]

**Status**: [Overall status]  
**Last Updated**: [Date]

---

## Overview

[2-3 paragraphs explaining the purpose, scope, and current state.]

---

## Structure

[Part → Stream → Task breakdown, or simpler structure if appropriate.]

---

## Entry Points

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | This file — navigation hub |
| [requirements.md](requirements.md) | Business context, success criteria |
| [Part 1 Plan](part-1-*.md) | Current active work |

---

## Related Documents

- [ADR-XXX](../../docs/architecture/architectural-decisions/XXX-*.md)
- [Research](../research/*.md)
- [Evaluations](../evaluations/*)

---

## Quality Gates

[Standard quality gate reminder, or collection-specific gates.]
```

---

## References

- [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Experiment structure
- [Evaluations Directory](../evaluations/) — Experiment documentation conventions
- [high-level-plan.md](high-level-plan.md) — Strategic coordination
