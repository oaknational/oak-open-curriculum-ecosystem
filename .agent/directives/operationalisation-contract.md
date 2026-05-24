---
fitness_line_target: 150
fitness_line_limit: 220
fitness_char_limit: 9500
fitness_line_length: 100
---

# Operationalisation Contract

This directive carries the **principle → operationalisation →
worked-example** flow. It governs how generative claims (principles)
get expressed as behavioural rules, hooks, sub-agents, and other
mechanisms, and how those mechanisms in turn point at small focused
worked-example files.

It complements [`orientation.md`](orientation.md) (the layering
contract of where content lives) by adding the *flow contract* of how
content moves between layers as substance gets operationalised.

## Three Levels of Progressive Disclosure

A reader starts at Level 1, descends only as far as needed, and never
has to climb upward to grasp the load-bearing claim.

| Level | Surface | What lives here |
| --- | --- | --- |
| **1. Principles** | `.agent/directives/principles.md` | The generative WHY — short, load-bearing claims that generate everything below. |
| **2. Operationalisation Mechanisms** | `.agent/rules/`, `.agent/hooks/`, `.agent/sub-agents/`, `.agent/skills/`, ESLint plugins, ADRs, PDRs, governance docs, patterns library | The HOW — focused per-mechanism files that enforce, encode, or elaborate one principle. |
| **3. Worked Examples + Recipes** | Per-instance files indexed at the parent mechanism (e.g. patterns library entries, recipe pages in governance docs) | The *what-it-looks-like* — small focused per-instance files. |

A principle may have **zero or more** Level 2 mechanisms. Layered
defences — a principle enforced by both a hook AND a rule AND a
sub-agent — are intentional, not redundant: they target different
firing moments (write-time vs commit-time vs review-time). This
layering is the substance of [PDR-029][pdr-029] (perturbation-mechanism
bundle) and [PDR-044][pdr-044] (memetic immune system). The contract
MUST NOT force one-mechanism-per-principle.

## Mechanism Catalogue

Mechanisms by firing moment:

| Mechanism | Surface | Firing moment |
| --- | --- | --- |
| Rules | `.agent/rules/*.md` | Passive, every session |
| Hooks | `.agent/hooks/policy.json` | Write-time (innate immunity) |
| Sub-agents / specialist reviewers | `.claude/agents/`, `.cursor/`, `.agents/` | Review-time (adaptive immunity) |
| ESLint custom plugins | `packages/core/oak-eslint/` | Lint-time |
| Quality gates | `pnpm check`, `pnpm test`, etc. | Pre-commit + CI |
| Skills | `.agent/skills/*` | Workflow-time |
| ADRs | `docs/architecture/architectural-decisions/` | Architectural-decision record |
| PDRs | `.agent/practice-core/decision-records/` | Practice-decision record |
| Governance docs | `docs/governance/*.md` | Detailed elaboration |
| Patterns library | `.agent/memory/active/patterns/*.md` | Recurring solutions / failures |
| Distilled / pending-graduations | `.agent/memory/active/`, `operational/` | Learning-loop staging |

The catalogue is non-exhaustive; a new mechanism category may be
introduced when an existing principle needs a firing moment none of
the above covers.

## What Belongs At Each Level

### Level 1 — Principles

Belongs: the generative claim; one short paragraph (3–10 lines) per
principle giving the load-bearing reasoning a fresh reader needs;
a pointer block listing operationalisation mechanisms for that
principle.

Does not belong: magic numbers from operational rules; tooling
inventory or configuration discipline; type-system rule lists;
worked failure-mode examples; historical context.

### Level 2 — Mechanisms

Belongs: one mechanism, one file. A rule names a behaviour. A hook
encodes a write-time check. A sub-agent describes a review remit.
Each mechanism file links **upward** to the principle(s) it
operationalises and **across** to peer mechanisms that target the
same principle.

Does not belong: multiple unrelated mechanisms in one file;
historical post-mortems with no remaining behavioural force;
per-instance worked examples (those route to Level 3).

### Level 3 — Worked Examples + Recipes

Belongs: one concept per file. Title states the concept. Body is
small. Indexed at the parent mechanism's index file; linked from
the principle via the mechanism index, not directly.

Granularity test: a worked example gets its own file when either
(a) it has been instanced ≥2 times, OR (b) it would add ≥30 lines
to its candidate parent. Below either threshold, inline is fine.

## File-Size Discipline

| Level | Target | Hard | Rationale |
| --- | --- | --- | --- |
| Level 1 | <200 lines | 275 | Read at every session open |
| Level 2 | <150 lines | 220 | Concept-focused; one mechanism |
| Level 3 | <80 lines | 120 | One scenario per file |

Limits are advisory targets for the contract. Per-file fitness
frontmatter is the binding mechanism; setting frontmatter on each
file is its own graduation pass tracked under the fitness-frontmatter
manifest sweep work.

## Index Discipline

Every level needs a small index file:

- **Level 1 index**: `principles.md` (after extraction) is the
  principles index.
- **Level 2 indexes**: each mechanism category has a README — e.g.
  `RULES_INDEX.md` for rules, `decision-records/README.md` for PDRs,
  `patterns/README.md` for patterns.
- **Level 3 indexes**: the parent mechanism's README.

Indexes are pointer + 1-line "what is here" descriptions; never
content of their own. An index that grows substance has stopped
being an index.

## Bidirectional Traceability

Every Level 2 mechanism file MUST link **upward** to its principle(s).
Every Level 3 worked-example file MUST link **upward** to its parent
mechanism.

Without the upward link, drift accumulates silently — a rule's
meaning shifts without the principle moving, or vice versa.
`/oak-consolidate-docs` audits this alignment at consolidation time.

## Citation Directionality

Cross-cutting with
[`no-moving-targets-in-permanent-docs`](../rules/no-moving-targets-in-permanent-docs.md):
permanent docs (Level 1, plus those Level 2 mechanisms that are
permanent — ADRs, PDRs, governance, principles, testing-strategy,
rules) MUST NOT cite plans, plan paths, plan section identifiers,
workstream identifiers, or other ephemeral surfaces.

Plan-to-plan citation IS permitted: plans are themselves ephemeral,
and a citation between them does not introduce a permanent →
ephemeral pointer. The forbidden direction is *permanent → ephemeral*
only.

## Recursion Test

The same contract applies at every level. If a Level 2 governance
doc bloats, extract its detail to Level 3 worked examples and reduce
Level 2 to an index. The same reasoning that justifies extracting
from Level 1 justifies extracting from Level 2. The contract is
self-referential by design — including for this directive itself.

## Doctrinal Anchors

- [`principles.md`](principles.md) — Level 1 source.
- [`orientation.md`](orientation.md) — layering contract this
  directive complements.
- [PDR-014][pdr-014] — knowledge-flow discipline.
- [PDR-029][pdr-029] — perturbation-mechanism bundle (layered
  defences).
- [PDR-044][pdr-044] — memetic immune system (innate + adaptive).
- [PDR-046][pdr-046] — layered knowledge processing (Move 3
  graduation).

[pdr-014]: ../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md
[pdr-029]: ../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md
[pdr-044]: ../practice-core/decision-records/PDR-044-memetic-immune-system.md
[pdr-046]: ../practice-core/decision-records/PDR-046-layered-knowledge-processing.md
