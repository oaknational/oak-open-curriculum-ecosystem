---
name: "Documentation Architecture Phase A: Immediate Improvements"
overview: >
  Five documentation-only improvements with no dependencies: quality attribute
  register, ADR-166 / ADR-121 gate-mapping follow-up, ADR index
  categorisation, C4 architecture diagrams, and document layer content
  contract. All can execute in parallel.
todos:
  - id: i1-quality-attribute-register
    content: "I1: Create quality attribute register at docs/architecture/quality-attribute-register.md"
    status: pending
  - id: i2-gate-mapping-follow-up
    content: "I2: Follow up ADR-166 / ADR-121 gate-to-quality-attribute mapping without creating a duplicate ADR by default"
    status: pending
  - id: i4-adr-index-categorisation
    content: "I4: Add categorised view and skipped-number note to ADR index"
    status: pending
  - id: i5-c4-diagrams
    content: "I5: Add C4 context and container diagrams to docs/architecture/README.md"
    status: pending
  - id: i9a-layer-content-contract
    content: "I9a: Add document layer content contract to governance README"
    status: pending
  - id: validation
    content: "Run markdownlint, practice:fitness:informational, and verify cross-references"
    status: pending
---

# Documentation Architecture Phase A: Immediate Improvements

**Last Updated**: 2026-04-29
**Status**: Queued
**Scope**: Five documentation-only improvements with no dependencies
**Parent**: [architectural-documentation-excellence-synthesis.plan.md](./architectural-documentation-excellence-synthesis.plan.md)

---

## Context

The architectural documentation excellence synthesis identified 10 improvement
items. Five have no dependencies and can execute immediately. This plan covers
those five. All are documentation-only — no code changes, no test changes.

### Foundation Alignment

> "Architectural Excellence Over Expediency — Always choose long-term
> architectural clarity over short-term convenience." — principles.md
>
> "We must have a clear onboarding path for new developers and AI agents"
> — principles.md §Onboarding
>
> "Document Everywhere — ALL files, modules, functions, data structures,
> classes, constants, and type information MUST have exhaustive,
> comprehensive TSDoc annotations" — principles.md §Code Design

---

## Quality Gate Strategy

Documentation-only work. After each task:

```bash
pnpm markdownlint:root            # Markdown lint
pnpm practice:fitness:informational  # Fitness report (non-blocking)
```

After all tasks:

```bash
pnpm check  # Full canonical verification
```

---

## Task I1: Quality Attribute Register

**File**: `docs/architecture/quality-attribute-register.md`

**What**: A single document that explicitly names, ranks, and connects the
quality attributes this system values to their enforcement mechanisms (fitness
functions).

**Content structure**:

1. Brief introduction connecting to principles.md §Architectural Excellence
2. Ranked quality attribute table with columns:
   - Quality Attribute (name)
   - Rank (priority ordering for trade-off navigation)
   - Definition (what this means for this system)
   - Enforcement Mechanisms (which fitness functions protect it)
   - Measured By (how we know it's working)
3. Brief note on how to use the register (referenced by ADRs, reviewers,
   and when navigating principle tensions)

**Quality attributes to include** (derived from principles.md):

| Rank | Quality Attribute | Key enforcement |
|------|-------------------|-----------------|
| 1 | Type safety / correctness | type-check, schema-first, no-type-shortcuts rule |
| 2 | Evolvability | TDD, modularity, no compat layers, ADR governance |
| 3 | Testability | TDD, DI (ADR-078), pure functions, test taxonomy |
| 4 | Security | PII scrubbing, secret scanning (ADR-111), input validation, Clerk |
| 5 | Maintainability | Documentation, KISS/DRY/YAGNI, knip, depcruise |
| 6 | Accessibility | WCAG 2.2 AA, Playwright + axe-core, both themes |
| 7 | Operability | Structured logging (ADR-051), Sentry, error cause chains |

**Ranking rationale** (from Betty review): Security must outrank maintainability
for a system that handles PII (Sentry scrubbing), exposes MCP endpoints to
external AI hosts, and integrates with an identity provider (Clerk). The register
is used as a tiebreaker — rank 6 security would lose to maintainability, which
inverts the risk hierarchy.

**Critical framing note** (from Fred review): The register MUST explicitly state
that ALL quality attributes are mandatory. The ranking is for tie-breaking when
two absolutes create an apparent conflict — it is NOT permission to deprioritise
lower-ranked attributes. This framing must be present in the register's
introduction to prevent misuse by downstream agents.

**Onboarding placement** (from onboarding review): The register answers "what
does this project care about?" — the single most valuable orientation question
for a newcomer. It must surface early, not deep in the architecture fold:

- Add as item 0 in the governance README's "5-minute reading path" (before
  Development Practice) with framing: "What this project values and how it
  enforces those values."
- Surface it from the root `README.md` Architecture section as a one-line
  pointer, alongside the existing schema-first ADRs (029/030/031).
- Do NOT add to `AGENT.md` directly — let agents discover it through
  progressive disclosure via governance or architecture.

**Acceptance Criteria**:

1. Document exists at `docs/architecture/quality-attribute-register.md`
2. All 7 quality attributes listed with definitions and enforcement mechanisms
3. Ranking reflects the implicit priority from principles.md
4. Document references principles.md and links to relevant ADRs
5. Architecture README links to the register
6. Governance README 5-minute reading path links to the register as item 0
7. Root `README.md` Architecture section surfaces the register alongside the
   schema-first ADRs (029/030/031)
8. markdownlint passes

**Deterministic Validation**:

```bash
# 1. File exists
test -f docs/architecture/quality-attribute-register.md && echo "OK" || echo "MISSING"
# Expected: OK

# 2. All quality attributes present
grep -c "| [1-7] |" docs/architecture/quality-attribute-register.md
# Expected: 7

# 3. Linked from architecture README
grep -l "quality-attribute-register" docs/architecture/README.md
# Expected: docs/architecture/README.md

# 4. Markdown lint
pnpm markdownlint:root
# Expected: exit 0
```

---

## Task I2: Fitness Function Framing ADR

**Status**: Partially satisfied by
`docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md`.

**What**: Do not create the stale `157-quality-gates-as-fitness-functions.md`
ADR. ADR-166 now carries the cross-scale fitness-function vocabulary for
architectural budgets. Any remaining quality-attribute mapping work should
extend ADR-166 or ADR-121 during execution, rather than adding a competing ADR.

**Remaining work**:

1. Decide whether the gate-to-quality-attribute mapping belongs in ADR-121,
   ADR-166, or the quality attribute register once Task I1 is complete.
2. Do not add a second ADR unless the remaining mapping work cannot be cleanly
   expressed as an amendment to one of those existing documents.
3. Any future gate-mapping requirement must name an enforcement hook; passive
   vocabulary alone is not sufficient governance.

**Acceptance Criteria**:

1. This plan no longer points at an already-used ADR number.
2. Any remaining quality-gate fitness-function work extends ADR-121, ADR-166,
   or the quality attribute register.
3. markdownlint passes.

---

## Task I4: ADR Index Categorisation

**File**: `docs/architecture/architectural-decisions/README.md` (modify)

**What**: Add a categorised view grouping ADRs by domain concern, plus a note
about intentionally skipped ADR numbers.

**Categories** (from synthesis analysis):

- **Cardinal Rule / Schema-First**: 029, 030, 031, 035, 036, 043, 105
- **Search / Elasticsearch**: 064, 067, 072, 074, 076, 080, 082, 084, 089, 102, 104
- **Type Safety / Error Handling**: 028, 032, 034, 078, 088, 153
- **Auth / Identity**: 040, 052, 053, 056, 057, 113, 115
- **MCP Protocol**: 050, 112, 113, 123, 141
- **Testing / Quality**: 078, 085, 098, 106, 111, 121, 147
- **UI / Design**: 045, 061, 148, 149, 151, 156
- **Workspace / Build**: 010-017, 041, 065, 108, 128
- **Agentic Engineering**: 114, 119, 125, 129, 135, 146, 150
- **Operations / Observability**: 033, 051, 069, 087, 130, 143

**Skipped numbers note**: "ADR numbers 039 and 090 were never assigned.
ADRs 020, 021, and 023 are archived."

**Acceptance Criteria**:

1. Categorised view added to README.md (does not replace chronological list)
2. Every ADR file on disk appears in at least one category
3. Skipped-number note added
4. markdownlint passes

**Deterministic Validation**:

```bash
# 1. Categorised section exists
grep "By Domain" docs/architecture/architectural-decisions/README.md
# Expected: match found

# 2. Skipped number note exists
grep "039" docs/architecture/architectural-decisions/README.md
# Expected: match found

# 3. Markdown lint
pnpm markdownlint:root
# Expected: exit 0
```

---

## Task I5: C4 Architecture Diagrams

**File**: `docs/architecture/README.md` (modify) or
`docs/architecture/c4-diagrams.md` (new, linked from README)

**What**: Add Mermaid-format C4 context and container diagrams.

**C4 Level 1 — System Context**:

Shows the Oak MCP ecosystem and its external dependencies:

- Oak Open Curriculum API (upstream data source)
- Elasticsearch (search engine)
- Clerk (identity provider)
- AI Host applications (ChatGPT, Claude, etc.)
- Human developers / contributors

**C4 Level 2 — Container**:

Shows the internal structure:

- `apps/oak-mcp-server-ext` (HTTP MCP server)
- `apps/oak-search-cli` (search CLI + ingestion)
- `packages/sdks/curriculum-sdk` (OpenAPI client + code generation)
- `packages/sdks/oak-search-sdk` (search query/response)
- `packages/sdks/sdk-codegen` (code generation tooling)
- `packages/core/*` (shared foundations)
- `packages/libs/*` (shared libraries)
- `packages/design/*` (design tokens)

With dependency direction arrows showing the layer topology. Annotate
build-time-only vs runtime dependencies (e.g., design tokens are build-time
only — this distinction is architecturally significant per Betty review).

**Onboarding placement** (from onboarding review): A system context diagram is
the single highest-value artefact for a newcomer's first 5 minutes. Placing it
only in the architecture section means it is not reached until minute 15-20.

- Embed or inline the C4 Level 1 context diagram in the root `README.md`
  Architecture section — this is the first visual a newcomer sees.
- Keep the Level 2 container diagram in `docs/architecture/README.md` for
  deeper exploration.

**Acceptance Criteria**:

1. Context diagram present in Mermaid format
2. Container diagram present in Mermaid format
3. Dependency arrows match the layer topology in AGENT.md §Structure
4. Level 1 context diagram embedded in the root `README.md` Architecture section
5. Level 2 container diagram in architecture README "Start Here" section
5. markdownlint passes

---

## Task I9a: Document Layer Content Contract

**File**: `docs/governance/README.md` (modify)

**What**: Add a short section defining the content contract between the three
documentation layers.

**Content**:

```markdown
## Document Layer Content Contract

The documentation system has three layers with distinct roles. Content should
exist in exactly one layer and be referenced (not restated) by others.

- **Directives** (`.agent/directives/`): Prescriptive — what agents and
  developers must do. The authoritative source for principles and rules.
- **Rules** (`.agent/rules/`): Enforcement triggers — when to check, what
  to enforce. Thin pointers to the directive that defines the rule.
- **Governance docs** (`docs/governance/`): Descriptive-elaborative — how to
  do it well, with examples, edge cases, and tooling guidance. Elaborates on
  directives without restating them.

When in doubt: if it says "you must", it belongs in a directive. If it says
"here's how", it belongs in governance. If content is found in the wrong
layer, it is moved to the correct layer — never duplicated.
```

**Onboarding placement** (from onboarding review): AI agents are primary
documentation authors but arrive via `AGENT.md`, not the governance README.
They need to know where content belongs.

- Add a one-line note to `AGENT.md` under "Essential Links > Core Practice"
  pointing to the governance README's content contract section.

**Acceptance Criteria**:

1. Content contract section added to governance README
2. Defines all three layers with distinct roles
3. Includes the "when in doubt" guidance
4. One-line reference added to `AGENT.md` Essential Links > Core Practice
5. markdownlint passes

---

## Related Architectural Organisation Plans

These plans reshape the workspace structure and boundaries. The C4 diagrams
(I5), quality attribute register (I1), and ADR-166 / ADR-121 gate-mapping
follow-up (I2) must align with the architectural direction they set:

- [Oak Surface Isolation](../future/oak-surface-isolation-and-generic-foundation-programme.plan.md) — separating Oak-specific surfaces from generic foundations; affects C4 container diagram scope
- [Workspace Topology Exploration](../../sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md) — four-tier layered architecture model; affects C4 container diagram layer annotations and fitness function boundary rules
- [SDK Codegen Workspace Decomposition](../codegen/future/sdk-codegen-workspace-decomposition.md) — SDK codegen restructuring; affects C4 container diagram SDK container boundaries

**Alignment requirement**: C4 diagrams (I5) must reflect the current structure
but note the planned direction. The gate-mapping follow-up (I2) must account
for the boundary enforcement rules that the topology exploration will
introduce.

---

## Validation

After all five tasks complete:

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm check  # Full canonical verification
```

---

## Documentation Propagation

Before marking complete:

1. Architecture README updated with links to new documents
2. ADR index updated with new ADR and categorised view
3. Governance README updated with content contract
4. Run `/jc-consolidate-docs`

---

## Consolidation

After all work complete and gates pass, run `/jc-consolidate-docs`.
