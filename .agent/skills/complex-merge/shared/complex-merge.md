---
prompt_id: complex-merge
title: "Complex Merge"
type: workflow
status: active
last_updated: 2026-03-31
---

# Complex Merge Workflow

Structured process for merging significantly diverged branches. This workflow
wraps the [Pre-Merge Divergence Analysis](../../../docs/engineering/pre-merge-analysis.md)
guide into an agent-executable process, enhanced with operational patterns
learned from the WS3 merge (2026-03-30).

## Prerequisites

Read these documents before starting:

- `.agent/rules/pre-merge-divergence-analysis.md`
- `docs/engineering/pre-merge-analysis.md`
- `.agent/directives/principles.md` (TDD, fail-fast, no compatibility layers)

## Phase 1: Measure the Divergence

```bash
git fetch origin main
git merge-base HEAD origin/main
git rev-list HEAD..origin/main --count   # commits behind
git rev-list origin/main..HEAD --count   # commits ahead
git diff --stat HEAD..origin/main | tail -3
```

Record the scale. This determines the level of rigour needed for subsequent
phases.

## Phase 2: Identify All Conflicts

### 2a. Text conflicts (dry-run merge)

```bash
git merge --no-commit --no-ff origin/main 2>&1
git diff --name-only --diff-filter=U
git merge --abort
```

### 2b. Files changed on both sides

```bash
FORK=$(git merge-base HEAD origin/main)
git diff --name-only "$FORK"..HEAD > /tmp/branch.txt
git diff --name-only "$FORK"..origin/main > /tmp/main.txt
comm -12 <(sort /tmp/branch.txt) <(sort /tmp/main.txt)
```

Files in the intersection are the risk zone.

### 2c. Deleted-file cascade analysis

```bash
git diff --name-only --diff-filter=D "$FORK"..origin/main -- 'src/'
```

For each deleted file, grep your branch for imports.

### 2d. Add/add collision detection

Check for ADRs, plan files, or generated files where both branches used the
same number or path for different content.

## Phase 3: Categorise Every Conflict

Assign each conflicting file to: **Trivial** (one side only), **Mechanical**
(different hunks), **Semantic** (same logic, different changes), **Modify/delete**,
or **Structural**.

Record the categorisation in a plan or session document.

## Phase 4: Gap Analysis — Find Silent Breaks

This is the most critical phase. Text conflict resolution catches half the
problems. The other half are auto-merged files that break when combined.

### 4a. Deleted-file import cascades

For every file the other branch deleted, grep your branch for imports of it.
Any match is a type-check failure after merge.

### 4b. Signature mismatches in auto-merged files

When the other branch changed a function signature in a file your branch didn't
touch, Git auto-merges their version. Your callers still use the old signature.

**Pattern**: List functions the other branch changed → check if your branch
calls any of them → verify call sites match the new signature.

### 4c. Required parameter additions

If your branch adds a required parameter to a shared interface, every caller
in the other branch's new files will fail type-check.

### 4d. Observability gap analysis

Trace wrapping mechanisms (Sentry spans, structured logging) across all protocol
surfaces (HTTP, MCP, SDK). If the other branch added observability wrappers
to handlers, verify that your branch's new handlers also have them — auto-merge
will not add wrappers to files that only exist on your branch.

### 4e. Call-chain contract verification

For each auto-merged file, verify that callers match the post-merge function
signatures. The pattern: "this file auto-merged from main, but my branch calls
functions in it with the old signature."

## Phase 5: Create Characterisation Tests

Before starting the merge, write tests at the **integration seams** — points
where your code meets code the other branch changed:

- Parameter threading (e.g. observability passed to handlers)
- Wrapper application (e.g. tool handlers wrapped with observability)
- Boundary behaviour that depends on both branches' code

Commit characterisation tests **before** the merge so they exist on both sides
of the merge commit.

## Phase 6: Execute the Merge

### Pre-review step

Have specialist reviewers validate the merge plan before executing:

- Describe what you intend to do, the conflict categorisation, and gap analysis
- Reviewers can identify missing risks before any code changes

### Resolution order

1. Trivial and structural conflicts — fast, clears noise
2. Mechanical conflicts — accept both hunks
3. Semantic conflicts in dependency order — start with the keystone file
4. Test file conflicts — after production code is correct
5. Non-conflicting adaptations — auto-merged files needing new parameters
6. Stale file cleanup — delete files, fix imports, renumber collisions
7. Regenerate lockfile — `pnpm install`
8. Type-check immediately — `pnpm type-check` catches most merge errors

### Concrete wrapping pattern

When the other branch added observability or auth wrappers, do not just "add
the parameter". Wrap the handler body in the same pattern used by existing
handlers. Read the other branch's wrapped handlers for the canonical pattern.

## Phase 7: Verify and Review

1. `pnpm type-check` — catches silent breaks from gap analysis
2. `pnpm lint:fix` — structural issues
3. `pnpm test` — behavioural regressions
4. Characterisation tests — confirms your branch's wiring survived
5. `pnpm check` — full clean rebuild + verification
6. Invoke specialist reviewers on the merge result

## Post-Merge

Write session learnings to the napkin:

- Merge patterns that worked well
- Surprises from auto-merge behaviour
- Time sinks and what could have been done faster
- Gap analysis predictions that caught real breaks
- Breaks that gap analysis missed

## References

- `.agent/rules/pre-merge-divergence-analysis.md` — canonical rule
- `docs/engineering/pre-merge-analysis.md` — detailed guide
- `.agent/plans/sdk-and-mcp-enhancements/active/ws3-merge-main-into-branch.plan.md` — real-world example
