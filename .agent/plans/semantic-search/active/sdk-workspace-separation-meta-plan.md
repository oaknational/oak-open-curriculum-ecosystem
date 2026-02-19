# Meta-Plan: Improve SDK Workspace Separation Plan

**Status**: 📋 Pending  
**Purpose**: Guide the improvement of the rough
[sdk-workspace-separation.md](sdk-workspace-separation.md)
into a fully actionable, TDD-compliant plan with concrete
todos, file lists, and implementation steps.

---

## What Exists

Two plan documents cover the SDK workspace separation:

1. **Active (rough)**: [sdk-workspace-separation.md](sdk-workspace-separation.md)
   — merge-blocking summary with phase outline and
   acceptance criteria. Needs enrichment.

2. **Detailed (original)**: [pipeline-enhancements/sdk-workspace-separation-plan.md](../../pipeline-enhancements/sdk-workspace-separation-plan.md)
   — comprehensive plan with goals (G1-G5), 6-phase
   breakdown, acceptance criteria, validation strategy,
   risks, and open questions. Needs updating to reflect
   current codebase state (post-search-SDK, post-env-
   architecture-overhaul).

---

## Improvement Tasks

### 1. Resolve Open Questions

Before detailed planning can proceed:

- [ ] **Generated artifact location**: Should generated files
  live in the generation workspace (committed) or the
  runtime workspace (generated on build)? This affects CI
  and developer workflow.
- [ ] **Aggregated tool definitions**: `search`, `fetch`,
  `browse-curriculum`, `explore-topic` are currently
  hand-written in `src/mcp/`. After WS5 replaces the old
  `search` tool, the aggregated tool landscape changes.
  Decide: do aggregated tool configs move to type-gen
  (declarative definitions → generated code) or stay in
  runtime (hand-written)?
- [ ] **Versioning policy**: If the generation package
  publishes independently, what semver policy applies?

### 2. Inventory Current State

The existing inventory in the detailed plan is from Feb 2026
and predates the search SDK integration. Update:

- [ ] Re-run the import audit: `grep -r` for all imports
  from `types/generated/` across the runtime codebase
- [ ] Document new generated artifacts added by search SDK
  integration (search tool descriptors, Zod schemas for
  search args, source exclude lists)
- [ ] Map the env architecture (resolveEnv pipeline,
  RuntimeConfig) — determine which parts are generation-time
  vs runtime
- [ ] Identify any new coupling introduced by WS1-WS4

### 3. Add TDD Structure to Each Phase

The rough plan has phases but no RED/GREEN/REFACTOR
structure. For each phase:

- [ ] Define what tests to write FIRST (RED)
- [ ] Define the minimal implementation (GREEN)
- [ ] Define what to clean up (REFACTOR)

Particularly important for Phase 3 (boundary enforcement)
where the ESLint rules are testable, and Phase 4 (runtime
updates) where existing tests must continue passing.

### 4. Create Concrete Todo Items

Convert the rough phase descriptions into frontmatter todos
with specific, verifiable actions. Each todo should name:

- Exact files to create/move/modify
- The test that must fail/pass
- The quality gate to run after

### 5. Update the Detailed Plan

Sync the detailed plan in `pipeline-enhancements/` with:

- [ ] Current codebase state (post-search-SDK, post-WS5)
- [ ] Resolved open questions
- [ ] Any scope changes discovered during inventory
- [ ] Updated prerequisite status (MCP search integration
  status, OAuth compliance status)

### 6. Cross-Reference Other Plans

Verify alignment with:

- [ ] [phase-3a-mcp-search-integration.md](phase-3a-mcp-search-integration.md)
  — WS5 changes the aggregated tool surface
- [ ] [oauth-spec-compliance.md](oauth-spec-compliance.md)
  — changes to middleware may affect boundary decisions
- [ ] [03-mcp-infrastructure-advanced-tools-plan.md](../../sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md)
  — Phase 0 describes aggregated tools moving to type-gen,
  which directly intersects with the separation boundary
- [ ] [ADR-108](../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
  — confirm the plan still aligns with the 4-workspace
  end state

---

## Sequencing

This meta-plan should be executed **after WS5 completes**
(since WS5 changes the aggregated tool landscape) and
**before the separation work begins**. OAuth compliance
can run in parallel.

Recommended order:

1. Complete WS5 (old search replaced)
2. Complete OAuth compliance (can overlap with #3)
3. Execute this meta-plan (improve the SDK split plan)
4. Execute the improved SDK split plan

---

## Acceptance Criteria

This meta-plan is complete when:

1. All open questions have documented decisions
2. The active plan has concrete todos with file-level detail
3. The detailed plan is synced with current codebase state
4. TDD structure is defined for each phase
5. Cross-references are verified and up to date
