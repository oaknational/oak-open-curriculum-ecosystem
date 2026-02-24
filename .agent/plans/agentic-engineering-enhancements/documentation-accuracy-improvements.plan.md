---
name: Documentation Accuracy Improvements
overview: >
  Fix documentation inaccuracies, contradictions, and structural issues across
  the agentic engineering practice collection, ADR-041, ADR-119, practice.md,
  and the architecture reviewer template. Prerequisite for architectural
  enforcement tooling.
todos:
  - id: ws-a-boundary-fixes
    content: "Workstream A: Fix dependency direction and boundary definition across 5 files."
    status: completed
  - id: ws-b-mutation-plan
    content: "Workstream B: Fix mutation testing plan (broken link, stale state, quality-gate positioning)."
    status: completed
  - id: ws-c-adr-practice
    content: "Workstream C: Rationalise ADR-119 / practice.md ownership and reduce duplication."
    status: completed
  - id: ws-d-plan-structure
    content: "Workstream D: Split cross-agent plan into committed-now vs conditional-later."
    status: completed
  - id: ws-e-research-hygiene
    content: "Workstream E: Add staleness caveats to research document inventory counts."
    status: completed
  - id: ws-f-collection-index
    content: "Workstream F: Add collection README with read order and dependencies."
    status: completed
---

# Documentation Accuracy Improvements

> **Status**: Complete historical prerequisite. Retained as an audit and
> rationale record; execution authority for current work is in `roadmap.md`
> and `active/*.md` plans.

## How to Use This Plan

This plan is a standalone entry point. It contains all context needed to execute the improvements without referring to the originating session. Read the Background section first, then execute workstreams in the order specified under Recommended Execution Order.

## Background

### Origin

A multi-reviewer chain on 2026-02-22 examined the `agentic-engineering-enhancements/` collection, `practice.md`, ADR-119, and related architecture documentation. Five specialist reviewers identified 19 issues (3 HIGH, 10 MEDIUM, 3 LOW, 3 observations).

| Reviewer | Focus | Findings |
|----------|-------|----------|
| Barney (architecture, simplification) | Boundary mapping, complexity reduction | 7 |
| Fred (architecture, ADR compliance) | Dependency direction, ADR grounding | 9 |
| Betty (architecture, systems thinking) | Cross-SDK import policy, change-cost | 1 (confirmed policy) |
| docs-adr-reviewer | Completeness, accuracy, drift | 5 |

Transcript ID: `4febb7bd-6c79-4ed9-8ae4-2a398b63e224`

### Collection Inventory

> Snapshot note: this inventory reflects the collection state at the time of this plan (2026-02-22). For live inventory, use `README.md` in this directory.

All files in `.agent/plans/agentic-engineering-enhancements/`:

| File | Type | Description |
|------|------|-------------|
| `architectural-enforcement-adoption.plan.md` | Plan | ESLint boundaries, dependency-cruiser, knip — physical enforcement |
| `cross-agent-standardisation.plan.md` | Plan | Cross-platform portability (skills, commands, sub-agent wrappers) |
| `mutation-testing-implementation.plan.md` | Plan | Stryker mutation testing across all workspaces |
| `2026-02-21-cross-agent-standardisation-landscape.research.md` | Research | Landscape of cross-agent standards (AGENTS.md, Skills, MCP, A2A) |
| `augmented-engineering-practices.research.md` | Research | Industry evidence base for AI-augmented engineering |
| `documentation-accuracy-improvements.plan.md` | Plan | This file |

Related files outside the collection that are modified by this plan:

| File | Role |
|------|------|
| `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md` | ADR defining workspace structure and dependency flow |
| `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md` | ADR naming and framing the agentic engineering practice |
| `docs/architecture/README.md` | Canonical architecture documentation |
| `.agent/directives/practice.md` | Orienting map of the agentic engineering practice |
| `.agent/sub-agents/templates/architecture-reviewer.md` | Shared template for all four architecture reviewers |
| `.agent/reference-docs/prog-frame/agentic-engineering-practice.md` | Progression framework application (not discoverable — intentionally unreferenced) |

### Key Architectural Decision: Cross-SDK Import Policy

Betty's systems-thinking analysis concluded that cross-SDK imports are **legitimate essential domain coupling**, not artificial coupling. `oak-search-sdk` depends on `curriculum-sdk` because semantic search inherently operates on curriculum concepts. Forbidding this would force type duplication (violating DRY) or generic types like `Record<string, unknown>` (violating the no-type-shortcuts rule).

The canonical dependency matrix (to be used everywhere boundaries are defined) is:

| Importer | core | libs | sdks | apps | Constraint |
|----------|------|------|------|------|------------|
| core     | —    | no   | no   | no   | Must remain domain-agnostic |
| libs     | yes  | —    | no   | no   | — |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK dependencies |
| apps     | yes  | yes  | yes  | —    | — |

"DAG" means: an SDK may import from another SDK, but circular dependencies are forbidden. The `dependency-cruiser` configuration (enforcement plan Phase 3) must flag circular SDK-to-SDK dependencies.

### Key Architectural Decision: ADR-041 Update Strategy

Barney confirmed: **update ADR-041 in place** (do not supersede). The original decision ("use conventional workspace structure with explicit boundaries") still stands. The drift is documentation entropy (workspace list aged), not a new architectural choice. Supersession would add overhead (new ADR, status churn, index updates) for no structural benefit.

## Sequencing Constraint

**Workstream A must complete before architectural enforcement tooling is configured.** The enforcement plan (`architectural-enforcement-adoption.plan.md`) drives `eslint-plugin-boundaries` and `dependency-cruiser` configuration. If the boundary definitions are wrong, the tooling will produce false violations or miss real violations.

All other workstreams are independent and can proceed in parallel.

---

## Workstream A: Dependency Direction & Boundary Definition

**Priority**: BLOCKING (before enforcement tooling)
**Files touched**: 5

### A1 — Update ADR-041 in place (HIGH + MEDIUM)

**File**: `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md`

The current content is stale. Here is what needs to change:

**Current Decision section** (to be replaced):
```markdown
- `apps/` – runnable MCP servers
- `packages/libs/` – lib contracts/utilities (logger, storage, transport, env)
- `packages/libs/` – reusable libraries
- `packages/providers/` – platform providers (e.g., Node, Workers)
- `packages/sdks/` – client SDKs (future growth)
```

**Updated workspace list** (the current actual layout):
```markdown
- `apps/` – application runtimes (MCP servers, search CLI)
- `packages/core/` – foundational shared code (result types, ESLint config, env, OpenAPI adapter)
- `packages/libs/` – shared runtime libraries (logger)
- `packages/sdks/` – SDK packages (curriculum-sdk, oak-search-sdk)
```

**Current dependency flow** (to be replaced):
```markdown
- Dependency flow: core → libs → apps/SDKs; core never imports providers.
```

**Updated dependency flow** (use the canonical import matrix from the Background section above).

Also:
- Add "Updated: YYYY-MM-DD" date marker to the Status line
- Remove the stale `packages/providers/` references throughout
- Remove the stale link to `docs/architecture/provider-system.md` if it no longer exists
- Verify ADR-108 (`docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md`) still references ADR-041 correctly after the update

### A2 — Replace linear shorthand with canonical import matrix (HIGH)

**File**: `architectural-enforcement-adoption.plan.md`

**Current text** (line 57):
```markdown
- **Layers:** `core` -> `libs` -> `sdks` -> `apps`.
```

This is ambiguous — natural reading suggests adjacent-only imports, but the actual policy is layered (any layer below). Replace with the canonical import matrix table from the Background section.

Also:
- Add ADR-041 to the "implements" citation list (currently only cites ADR-119)
- Add `docs/architecture/README.md` as a reference
- Update the `boundary-configuration` YAML todo to reference the matrix

### A3 — Fix architecture reviewer template contradiction (HIGH)

**File**: `.agent/sub-agents/templates/architecture-reviewer.md` (around lines 88–101)

**Current text with contradiction** — the diagram is correct but the text is wrong:

```
core  <--  libs  <--  apps
  ^          ^
  |          |
  +--- sdks--+

**Valid patterns:**

- apps/ can import from libs/, sdks/, core/
- libs/ can import from core/
- sdks/ can import from core/        ← WRONG: omits libs/
- core/ imports NOTHING from this monorepo
```

**Corrected valid-patterns text**:
```markdown
- apps/ can import from libs/, sdks/, core/
- libs/ can import from core/
- sdks/ can import from core/, libs/, and other sdks/ (no circular dependencies)
- core/ imports NOTHING from this monorepo
```

Also update the Invalid patterns section to add:
```markdown
- Circular SDK-to-SDK imports (oak-search-sdk importing from curriculum-sdk is allowed; the reverse would create a cycle)
```

### A4 — Document cross-SDK import policy in architecture README (MEDIUM)

**File**: `docs/architecture/README.md`

**Current dependency flow** (line 38):
```markdown
- Dependencies flow: `core` depends on nothing; `libs` depend on `core`; `sdks` depend on `core`/`libs`; `apps` depend on `sdks`/`libs`/`core`.
```

**Updated text** — add cross-SDK allowance:
```markdown
- Dependencies flow: `core` depends on nothing; `libs` depend on `core`; `sdks` depend on `core`/`libs`/other `sdks` (no circular dependencies); `apps` depend on `sdks`/`libs`/`core`.
```

### A5 — Post-update validation

After A1–A4, invoke:
- `architecture-reviewer-fred` (readonly) to confirm ADR alignment
- `docs-adr-reviewer` (readonly) to validate ADR-041 lifecycle wording and cross-link hygiene

---

## Workstream B: Mutation Testing Plan Cleanup

**Priority**: HIGH (broken link) + MEDIUM (structural)
**Files touched**: 1 (`mutation-testing-implementation.plan.md`)

### B1 — Fix broken cross-reference (HIGH)

**Current text** (line 29):
```markdown
- Testing Strategy link pointed at `../../.agent/directives/testing-strategy.md`
```

This resolves to `.agent/.agent/directives/testing-strategy.md` (doubled path) because the file lives in `.agent/plans/agentic-engineering-enhancements/` — going up two levels reaches `.agent/`, then `.agent/directives/...` creates a double-nested path.

**Corrected text**:
```markdown
- Testing Strategy link points at `../../directives/testing-strategy.md`
```

### B2 — Trim stale operational state (MEDIUM)

Lines 42–68 contain a "Current State" section with:
- A workspace inventory last audited on 2025-09-24
- A pilot run narrative from a workspace that no longer exists (`@oaknational/mcp-providers-node`)
- Key findings from that pilot

The plan already has a `re-baseline` todo and a note saying re-baselining is needed. But there is no gate ensuring it completes before Phase 0 begins.

**Action**:
- Trim lines 42–68 to a short checklist of what the re-baseline must verify
- Move the historical pilot narrative to an `## Appendix: Historical Pilot` section at the end
- Add a prerequisite gate to Phase 0: "Phase 0 MUST NOT begin until the re-baseline audit (todo `re-baseline`) is completed and the Current State section is updated."

### B3 — Explicitly position quality-gate vs supplementary signal (MEDIUM)

**Problem**: Line 88 says "Decide whether `mutate` runs as part of `pnpm qg`, a nightly pipeline, or both." Line 120 says "Mutation testing runs as part of nightly CI or release pipelines." The workspace rule states: "All quality gate issues are always blocking." If `pnpm mutate` is added to `pnpm qg`, surviving mutants block all development.

**Recommended approach** (graduated):
- Phases 0–2: supplementary signal (nightly/release only). Do not use "quality gate" terminology.
- Phase 3: evaluate promotion to `pnpm qg` once performance overhead is acceptable and mutant survival is below threshold.
- Rewrite line 88 to state the positioning explicitly rather than deferring the decision.
- Update success metrics (lines 119–122) to match the chosen positioning.

---

## Workstream C: ADR-119 / practice.md Rationalisation

**Priority**: MEDIUM
**Files touched**: 3

### C1 — Trim ADR-119 mechanism detail (MEDIUM)

**File**: `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`

ADR-119 duplicates mechanism detail that belongs in `practice.md`. The docs-adr-reviewer mapped the overlap:

| Content | ADR-119 | practice.md | Action |
|---------|---------|-------------|--------|
| Three-layer model (layer descriptions) | Lines 91–122 | Lines 7–50 | **Trim ADR**: keep one-sentence per layer + the delegation at lines 119–122. Remove bullet-point content listings. |
| Feedback loops (mechanism detail) | Lines 124–148 | Lines 119–152 | **Trim ADR**: reduce to 3–4 sentences stating the *consequence*. Reference practice.md for mechanism. |
| Self-teaching property (walkthrough) | Lines 150–163 | Lines 154–158 | **Trim ADR**: reduce to 2–3 sentences naming the property. Remove the verbatim walkthrough. |
| Name etymology, boundary, "why Practice" | Lines 47–89, 165–176 | — | **Keep in ADR**: unique to the decision record. |
| Impact through three orders | Lines 178–205 | — | **Keep in ADR**: unique to the decision record. |
| Consequences | Lines 207–235 | — | **Keep in ADR**: unique to the decision record. |
| Workflow, artefact map, learning loop details | — | Lines 52–117 | **Keep in practice.md**: unique operational content. |

**Ownership boundary**: ADR = the *decision* and its *consequences*. practice.md = the *operational map* and *mechanisms*.

The ADR's own closing lines already state this: "The practice guide serves as the orienting map; this ADR records the decision." The body should match that intent.

### C2 — Enrich practice.md with missing concepts (LOW)

**File**: `.agent/directives/practice.md`

Two concepts are currently unique to ADR-119 and should be mentioned in practice.md (since practice.md is the operational map):
- "Architectural enforcement as core philosophical commitment" (ADR-119 lines 100–102) — add a brief mention under the Philosophy section
- "Cross-agent standardisation as evolving implementation direction" (ADR-119 lines 108–110) — add a brief mention under the Structure section

Also: review the Workflow section (lines 75–98) for implementation-specific detail that will age. Keep it at map-level — push procedural specifics to command/guide docs.

### C3 — Add canonical-source note to reference doc (MEDIUM)

**File**: `.agent/reference-docs/prog-frame/agentic-engineering-practice.md`

This progression framework application document reproduces core concepts (three orders of effect, feedback loops, self-teaching property). It is a third maintenance surface. It is intentionally unreferenced and should remain non-discoverable — do not add links to it from other documents.

**Action**: Add a note at the top indicating which documents are canonical for the concepts it describes:
```markdown
> **Canonical sources**: The concepts in this document are defined in
> [ADR-119](../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
> (naming decision) and [practice.md](../../directives/practice.md)
> (operational map). Check those documents for the current definitions.
```

---

## Workstream D: Cross-Agent Plan Structure

**Priority**: MEDIUM
**Files touched**: 1 (`cross-agent-standardisation.plan.md`)

### D1 — Split into committed-now vs conditional-later (MEDIUM)

The plan's five tasks mix immediate actions with deferred conditional work:

| Task | Status | Trigger |
|------|--------|---------|
| Task 1: Skill frontmatter | Immediate | — |
| Task 3: openai.yaml cleanup | Immediate | — |
| Task 2: Command portability | Deferred | "when command sets grow further or a third platform is added" |
| Task 4: Workspace context | Deferred | "when onboarding external contributors" |
| Task 5: Sub-agent wrappers | Deferred | "when Claude Code or GitHub Copilot becomes an active development platform" |

**Action**: Restructure into two sections:
- **Section 2a — Committed Work**: Tasks 1 and 3
- **Section 2b — Conditional Work** (with explicit triggers): Tasks 2, 4, and 5

Update YAML frontmatter todos to reflect the distinction. Consider adding a comment grouping the deferred todos.

---

## Workstream E: Research Document Hygiene

**Priority**: LOW
**Files touched**: 1–2

### E1 — Add date-stamp caveat to inventory counts (MEDIUM)

**File**: `2026-02-21-cross-agent-standardisation-landscape.research.md` (Section 4.3, around lines 319–334)

The inventory summary contains exact counts (11 sub-agent templates, 14 Cursor wrappers, 13 always-applied rules, 10 slash commands, etc.) that will become stale as agents, skills, and commands are added or removed.

**Action**: Add a note above the table: "Counts are as-of the research date (2026-02-21). Re-audit the directories listed below for current state before acting on specific numbers."

### E2 — Consider structural simplification (MEDIUM, optional)

The ~580-line landscape report repeats recommendations across sections that are already settled in the cross-agent standardisation plan. Barney suggested splitting into a decision brief + evidence appendix.

**Decision**: Defer unless the document is being actively used as a decision reference. The document is date-stamped research; its current size is acceptable with the caveat from E1.

---

## Workstream F: Collection Discoverability

**Priority**: OBSERVATION
**Files touched**: 1 (new file)

### F1 — Add collection README (OBSERVATION)

**Directory**: `.agent/plans/agentic-engineering-enhancements/`

The collection has no local index. A lightweight `README.md` would improve navigability.

**Suggested content**:
- Collection purpose (one paragraph)
- Document inventory with one-line descriptions (use the table from this plan's Collection Inventory section)
- Suggested read order: plans first (enforcement → standardisation → mutation testing), then research as evidence base
- Dependencies between documents (which plans cite which research)
- Relationship to `high-level-plan.md` milestones (Milestone 2 for enforcement + standardisation, Milestone 3 for mutation testing)

---

## Recommended Execution Order

```
A1 → A2 → A3 → A4 → A5 (validation)     ← BLOCKING, do first
     ↕ (parallel)
B1 → B2 → B3                              ← HIGH broken link first
C1 → C2 → C3                              ← MEDIUM, after A settles
D1                                         ← MEDIUM, standalone
E1 (→ E2 if warranted)                    ← LOW
F1                                         ← OBSERVATION
```

## Post-Implementation Review

After all workstreams complete, invoke:
- `code-reviewer` (gateway)
- `architecture-reviewer-fred` (readonly — ADR compliance confirmation)
- `docs-adr-reviewer` (readonly — documentation completeness and drift check)
