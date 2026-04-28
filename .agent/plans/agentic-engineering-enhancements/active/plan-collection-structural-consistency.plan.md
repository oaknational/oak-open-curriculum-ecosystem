---
name: "Plan Collection Structural Consistency"
overview: >
  Bring all plan collections under `.agent/plans/` into alignment with the
  canonical lifecycle structure defined by ADR-117 and the collection-readme
  template. Planning complete; execution deferred to a future session.
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit current state and confirm design decisions for non-standard collections."
    status: completed
  - id: phase-1-lifecycle-dirs
    content: "Phase 1: Create missing lifecycle directories and index files for standard collections."
    status: pending
  - id: phase-2-non-standard
    content: "Phase 2: Migrate non-standard collections (external, icebox, user-experience) to canonical structure."
    status: pending
  - id: phase-3-readme-alignment
    content: "Phase 3: Align all collection READMEs to the collection-readme-template format."
    status: pending
  - id: phase-4-closeout
    content: "Phase 4: Update cross-references, remove qualifier from .agent/README.md, validate."
    status: pending
isProject: false
---

# Plan Collection Structural Consistency

**Last Updated**: 12 March 2026
**Status**: 🟡 PLANNED (audit and design complete, execution deferred)
**Scope**: Bring all plan collections to canonical lifecycle structure (ADR-117)

---

## Context

The plan architecture (ADR-117) defines a canonical collection structure:
`README.md`, `roadmap.md`, `active/README.md`, `current/README.md`,
`future/README.md`, `archive/completed/`. Six of nine collections have
grown organically and lack some or all of these.

### Current State (from audit, 12 March 2026)

| Collection | README | Roadmap | active/ | current/ | future/ | Archive | Gap |
|---|---|---|---|---|---|---|---|
| semantic-search | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| sdk-and-mcp-enhancements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| developer-experience | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| agentic-engineering | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | `future/README.md` |
| security-and-privacy | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | `current/README.md`, `future/README.md` |
| architecture-and-infra | ⚠️ | ✗ | ✗ | ✓ | ✓ | ✓ | `active/`, `roadmap.md`, README format |
| user-experience | ⚠️ | ✓ | ✗ | ✗ | ✗ | ✗ | All lifecycle dirs, README format |
| external | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Everything |
| icebox | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Everything |

### Root Cause

Collections were created at different times with different levels of
template maturity. The templates arrived after the earliest collections.

### Canonical Structure (ADR-117)

Every lifecycle plan collection MUST have:

```text
collection-name/
├── README.md              ← collection hub (from collection-readme-template)
├── roadmap.md             ← strategic milestone sequence (from collection-roadmap-template)
├── active/
│   └── README.md          ← in-progress plans index (from active-plan-index-template)
├── current/
│   └── README.md          ← queued plans index (from current-plan-index-template)
├── future/
│   └── README.md          ← deferred plans index (from future-plan-index-template)
└── archive/
    └── completed/         ← done, read-only evidence
```

---

## Non-Goals

- Rewriting the content of existing plans or roadmaps
- Moving plans between lifecycle directories (that is execution work)
- Changing the `templates/` or top-level `archive/` directories (these
  are meta/utility, not lifecycle collections)

---

## Confirmed Design Decisions (12 March 2026)

All three confirmed by user.

### D1: `icebox/` — CONFIRMED

Move existing flat `.md` files into `future/`. Create `README.md` with
collection brief. Create `future/README.md` listing all iceboxed plans.
Create empty `active/`, `current/`, `archive/completed/` with `.gitkeep`.
No `roadmap.md` — icebox items are pre-strategic; a minimal roadmap note
noting "icebox items are promoted to other collections when ready" is
sufficient.

**Files to move** (12 files as of audit):

- `advanced-mcp-server-ideas.md`
- `agent-lifecycle-automation.md`
- `contract-testing-schema-evolution.md`
- `cross-agent-standardisation.md`
- `mcp-testing-toolkit.md`
- `openapi-pipeline-framework.md`
- `pair-programming-coach-agent.md`
- `redoc-accessibility-remediation.md`
- `serverless-hosting-plan.md`
- `shared-error-library.md`
- `subagent-ideas.md`
- `supply-chain-controls.md`

All move to `icebox/future/`. No content changes.

### D2: `external/` — CONFIRMED

Create `README.md` with collection brief explaining purpose (upstream
dependency tracking and cross-repo reference material). Keep existing
`castr/` and `ooc-api-wishlist/` as reference material alongside
lifecycle directories. Create empty `active/`, `current/`, `future/`,
`archive/completed/` with `.gitkeep`. Minimal `roadmap.md` note noting
external tracking is reactive. **Further consolidation of this
collection deferred to a separate session.**

### D3: `user-experience/` — CONFIRMED

Add top-level lifecycle directories (`active/`, `current/`, `future/`,
`archive/completed/`) alongside the existing persona directories. The
persona directories (`educator-end-users/`, `engineering-end-users/`,
`learner-end-users/`) remain as domain-boundary briefs — they are
reference material, not lifecycle containers. Executable UX plans go in
the standard lifecycle directories. Update existing `README.md` to
include lifecycle links in header alongside existing persona links.

---

## Phase 0: Audit and Design — COMPLETED

Audit performed 12 March 2026. Design decisions D1-D3 confirmed by user.

---

## Phase 1: Standard Collections — Missing Lifecycle Pieces

Fix the three collections that are close to complete.

### Task 1.1: `agentic-engineering-enhancements/future/README.md`

**What**: Create `future/README.md` from `future-plan-index-template.md`.

**Content**: Populate the table with the one existing future plan:

| Horizon | Plan | Scope | Prerequisites |
|---|---|---|---|
| Later | `hooks-portability.plan.md` | Bring hooks into the three-layer model | ADR-125 portability hardening complete |

**Links**: `../roadmap.md`, `../active/README.md`, `../current/README.md`.

**Acceptance**:

- File exists at `.agent/plans/agentic-engineering-enhancements/future/README.md`
- Links to roadmap, active, current resolve
- `pnpm markdownlint:root` passes

### Task 1.2: `security-and-privacy/current/README.md`

**What**: Create `current/` directory and `current/README.md` from
`current-plan-index-template.md`.

**Content**: Empty queue table (no plans currently queued in this
collection).

**Links**: `../roadmap.md`, `../active/README.md`, `../future/README.md`.

**Acceptance**:

- Directory exists at `.agent/plans/security-and-privacy/current/`
- `README.md` exists within it
- Links to roadmap, active, future resolve

### Task 1.3: `security-and-privacy/future/README.md`

**What**: Create `future/README.md` from `future-plan-index-template.md`.

**Content**: Populate the table with the four existing future plans:

| Horizon | Plan | Scope | Prerequisites |
|---|---|---|---|
| Later | `phase-0-control-mapping.md` | Phase 0 control inventory and mapping target | Active phases complete |
| Later | `phase-1-security-claim-contract.md` | Phase 1 security claim contract | Phase 0 |
| Later | `phase-2-evidence-merge-readiness-rules.md` | Phase 2 evidence merge-readiness rules | Phase 1 |
| Later | `phase-3-baseline-control-cut-list.md` | Phase 3 baseline control cut list | Phase 2 |

**Links**: `../roadmap.md`, `../active/README.md`, `../current/README.md`.

**Acceptance**:

- File exists at `.agent/plans/security-and-privacy/future/README.md`
- Links resolve, all four plans listed

### Task 1.4: `architecture-and-infrastructure/active/README.md`

**What**: Create `active/` directory and `active/README.md` from
`active-plan-index-template.md`.

**Content**: Empty table (no plans currently active in this collection).

**Links**: `../roadmap.md`, `../current/README.md`, `../future/README.md`.

**Acceptance**:

- Directory exists at `.agent/plans/architecture-and-infrastructure/active/`
- `README.md` exists within it
- Links to roadmap, current, future resolve

### Task 1.5: `architecture-and-infrastructure/roadmap.md`

**What**: Create `roadmap.md` from `collection-roadmap-template.md`.

**Content**: Populate from the existing README content:

- **Current state**: Sentry blocker (M3), config standardisation,
  observability, security-dependency-triage, stdio-http alignment
- **Milestone alignment**: M2 (server alignment, config standardisation),
  M3 (observability, Sentry blocker)
- **Execution order**: Reference existing plans in `current/` and
  `future/` by filename

**Acceptance**:

- File exists at `.agent/plans/architecture-and-infrastructure/roadmap.md`
- Lists all known queued work with milestone alignment
- References `current/` and `future/` plans

### Task 1.6: `architecture-and-infrastructure/README.md` alignment

**What**: Update existing README to follow `collection-readme-template.md`
format.

**Preserve**: History section, milestone alignment content, `codegen/`
reference.

**Add**:

- Header lifecycle links: `roadmap.md`, `active/README.md`,
  `current/README.md`, `future/README.md`
- Document roles section (DRY)
- Read order section
- Documentation propagation contract
- Foundation documents section

**Acceptance**:

- README has all five template-required sections
- Existing content preserved, not duplicated
- Links to all lifecycle directories resolve

---

## Phase 2: Non-Standard Collections

### Task 2.1: `icebox/` — full structure

**Create**:

- `icebox/README.md` — collection brief: "Pre-strategic ideas and
  deferred plans that do not yet belong to a specific collection.
  Items are promoted to other collections when scope and prerequisites
  become clear."
- `icebox/roadmap.md` — minimal note: "Icebox items are pre-strategic.
  Promotion to `current/` or another collection happens when
  prerequisites and scope crystallise."
- `icebox/future/README.md` — list all 12 moved files
- `icebox/active/README.md` — empty, from template
- `icebox/current/README.md` — empty, from template
- `icebox/archive/completed/.gitkeep`

**Move** (git mv): all 12 `.md` files from `icebox/` to `icebox/future/`.

**Acceptance**:

- All 12 `.md` files accessible at `icebox/future/*.md`
- `git log --follow` shows history preserved for at least one moved file
- All four lifecycle READMEs exist
- `icebox/README.md` has header lifecycle links

### Task 2.2: `external/` — add structure

**Create**:

- `external/README.md` — collection brief: "Upstream dependency tracking
  and cross-repo reference material. This collection tracks requirements
  on external systems (Oak API wishlist, cross-project references) that
  affect planning in other collections."
- `external/roadmap.md` — minimal note: "External tracking is reactive.
  Items surface when upstream changes or cross-repo needs are identified."
- `external/active/README.md` — empty, from template
- `external/current/README.md` — empty, from template
- `external/future/README.md` — empty, from template
- `external/archive/completed/.gitkeep`

**Keep**: `external/castr/` and `external/ooc-api-wishlist/` unchanged.

**Acceptance**:

- All lifecycle directories and READMEs exist
- Existing `castr/` and `ooc-api-wishlist/` untouched
- `external/README.md` has header lifecycle links

### Task 2.3: `user-experience/` — add lifecycle directories

**Create**:

- `user-experience/active/README.md` — empty, from template
- `user-experience/current/README.md` — empty, from template
- `user-experience/future/README.md` — empty, from template
- `user-experience/archive/completed/.gitkeep`

**Update**: `user-experience/README.md` — add lifecycle links in header
block alongside existing persona links:

```markdown
**Atomic Execution Plans**: [active/README.md](active/README.md)
**Next-Up Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)
```

**Preserve**: All existing persona directories, roadmap, experience
contract, cross-collection dependencies, read order. The persona
directories are domain-boundary briefs, not lifecycle containers.

**Acceptance**:

- All four lifecycle directories exist
- `README.md` has lifecycle links in header
- Existing persona directories and content untouched

---

## Phase 3: README Alignment Pass

### Task 3.1: Template compliance audit

For every collection README, verify presence of these
`collection-readme-template.md` sections:

1. Header lifecycle links (roadmap, active, current, future)
2. Documents table
3. Read order
4. Document roles (DRY)
5. Documentation propagation contract
6. Milestone alignment
7. Foundation documents (mandatory re-read)

### Task 3.2: Fix non-compliant READMEs

Apply template sections to any README still missing them.

**Collections likely needing fixes** (based on audit):

- `security-and-privacy/README.md` — missing `current/` and `future/`
  links in header (add once those directories exist from Phase 1)
- `agentic-engineering-enhancements/README.md` — missing `future/` link
  in header (add once directory exists from Phase 1)

**Collections already compliant or close**:

- `semantic-search/README.md` — comprehensive, may have minor deviations
- `sdk-and-mcp-enhancements/README.md` — follows template
- `developer-experience/README.md` — follows template

**Rule**: Preserve collection-specific content (prioritisation contracts,
coordination boundaries, persona structures, dependency tables). Only add
missing template sections.

---

## Phase 4: Closeout

### Task 4.1: Update `.agent/README.md`

Remove the qualifier on line 50-51:

> Not all collections use every stage — lifecycle directories are
> created as needed.

Replace with a definitive statement that all collections follow the
canonical lifecycle structure.

### Task 4.2: Update `high-level-plan.md` Collection Status table

Ensure the table at the bottom of `high-level-plan.md` accurately
reflects the updated state of all collections.

### Task 4.3: Validation

```bash
# Structural check: every collection has all lifecycle dirs
for d in agentic-engineering-enhancements architecture-and-infrastructure \
  developer-experience external icebox sdk-and-mcp-enhancements \
  security-and-privacy semantic-search user-experience; do
  echo "=== $d ==="
  for sub in README.md roadmap.md active/README.md current/README.md \
    future/README.md; do
    [ -f ".agent/plans/$d/$sub" ] && echo "  ✓ $sub" || echo "  ✗ $sub MISSING"
  done
  [ -d ".agent/plans/$d/archive/completed" ] && echo "  ✓ archive/completed/" \
    || echo "  ✗ archive/completed/ MISSING"
done

# Markdown quality
pnpm markdownlint:root
```

**Expected**: Every collection shows ✓ for all six items. markdownlint
passes.

---

## Execution Notes for Future Session

1. **Phase 1 first** — it unblocks Phase 3 (README alignment needs the
   directories to exist for links to resolve).
2. **Phase 2 can parallelise** — `icebox/`, `external/`, and
   `user-experience/` are independent.
3. **Use `git mv`** for icebox file moves to preserve history.
4. **All templates** are at `.agent/plans/templates/`. Copy and
   customise; do not inline templates mechanically.
5. **markdownlint** is the primary quality gate for this work (no
   product code changes).
6. The `external/` collection is confirmed for structural standardisation
   now, with further content consolidation deferred to a separate session.

---

## Foundation Document Commitment

1. `.agent/directives/principles.md` — consistent naming and structure
2. `.agent/directives/testing-strategy.md` — N/A (no product code)
3. `.agent/directives/schema-first-execution.md` — N/A (no product code)

First question: Could it be simpler? Yes — this is a structural
consistency pass, not a content migration. Create structure, don't
rewrite plans.

---

## References

- [ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) —
  Plan templates and components
- Templates:
  - `collection-readme-template.md`
  - `collection-roadmap-template.md`
  - `active-plan-index-template.md`
  - `current-plan-index-template.md`
  - `future-plan-index-template.md`
- All templates at `.agent/plans/templates/`
