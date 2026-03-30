# Pre-Merge Divergence Analysis

**Last Updated**: 2026-03-30
**Status**: Active guidance

When a feature branch and its target branch have diverged significantly (tens
of commits, hundreds of files on either side), a standard `git merge` is not
enough. Text-level conflict resolution misses type-system breaks, deleted-file
cascades, numbering collisions, and signature mismatches in auto-merged files.

This guide codifies a systematic analysis process that surfaces those hidden
risks before the merge begins.

## When to Use This Guide

Use this guide when **any** of the following are true:

- Either branch has changed more than ~100 files
- A dry-run merge (`git merge --no-commit`) produces more than ~10 conflicts
- The other branch refactored core interfaces that your branch consumes
- The other branch deleted files that your branch imports
- Both branches touched the same workspace's production code

For routine merges (a few files, a handful of conflicts), standard conflict
resolution is sufficient.

## Phase 1: Measure the Divergence

```bash
git fetch origin main
git merge-base HEAD origin/main          # find the fork point
git rev-list HEAD..origin/main --count   # commits behind
git rev-list origin/main..HEAD --count   # commits ahead
git diff --stat HEAD..origin/main | tail -3  # files changed on main
```

Understand the scale before planning. A 10-file merge and a 700-file merge
need different levels of rigour.

## Phase 2: Identify All Conflicts (Text and Structural)

### 2a. Dry-run merge for text conflicts

```bash
git merge --no-commit --no-ff origin/main 2>&1
git diff --name-only --diff-filter=U      # list conflicting files
git merge --abort                          # clean up
```

Capture the full output — it shows both content conflicts and
modify/delete conflicts.

### 2b. Find files changed on both sides

```bash
git diff --name-only $(git merge-base HEAD origin/main)..HEAD > /tmp/branch.txt
git diff --name-only $(git merge-base HEAD origin/main)..origin/main > /tmp/main.txt
comm -12 <(sort /tmp/branch.txt) <(sort /tmp/main.txt)
```

Files in this intersection are the risk zone — even if they auto-merge, they
may have semantic conflicts.

### 2c. Find files the other branch deleted

```bash
git diff --name-only --diff-filter=D \
  $(git merge-base HEAD origin/main)..origin/main \
  -- 'path/to/workspace/src/'
```

For each deleted file, grep your branch for imports of it. Files that
auto-merge cleanly but import a deleted module will fail at type-check time
— Git cannot detect this.

### 2d. Find files both branches added (add/add conflicts)

```bash
git diff --name-only --diff-filter=A $(git merge-base HEAD origin/main)..HEAD > /tmp/branch-added.txt
git diff --name-only --diff-filter=A $(git merge-base HEAD origin/main)..origin/main > /tmp/main-added.txt
comm -12 <(sort /tmp/branch-added.txt) <(sort /tmp/main-added.txt)
```

Watch for numbering collisions (e.g. both branches creating ADR-141 with
different content but different filenames — Git merges both silently).

## Phase 3: Categorise Each Conflict

Assign every conflicting file to one of these categories:

| Category          | Description                                   | Risk   | Resolution                                  |
| ----------------- | --------------------------------------------- | ------ | ------------------------------------------- |
| **Trivial**       | Only one side's changes matter                | Low    | Accept one side                             |
| **Mechanical**    | Both sides changed different hunks            | Low    | Accept both hunks                           |
| **Semantic**      | Both sides changed the same logic differently | High   | Manual merge — read both versions           |
| **Modify/delete** | One side modified, other deleted              | Medium | Usually accept the deletion + check imports |
| **Structural**    | Directory vs file, symlink vs real            | Medium | Accept the canonical form                   |

## Phase 4: Gap Analysis — Find Silent Breaks

This is the most important phase. Text-level conflict resolution only catches
half the problems. The other half are **auto-merged files that compile on their
own but break when combined**.

### 4a. Deleted-file import cascade

For every file the other branch deleted, grep your branch for imports:

```bash
for deleted in $(git diff --name-only --diff-filter=D \
  $(git merge-base HEAD origin/main)..origin/main -- 'src/'); do
  basename=$(basename "$deleted" .ts)
  grep -rn "$basename" src/ --include='*.ts' | grep import
done
```

Any match is a type-check failure waiting to happen after merge.

### 4b. Interface signature changes in auto-merged files

When the other branch changes a function signature in a file your branch
didn't touch, Git auto-merges their version. But your branch's callers
still use the old signature. Check:

- What functions did the other branch change signatures for?
- Does your branch call any of them?
- Do the call sites pass the right parameters?

### 4c. Required parameter additions

If your branch adds a required parameter to a shared interface (e.g.
`observability` on `RegisterHandlersOptions`), every caller on the other
branch's new test files will fail type-check — even though those files
auto-merge cleanly from the other branch.

List the other branch's new files that call your changed interfaces:

```bash
git diff --name-only --diff-filter=A \
  $(git merge-base HEAD origin/main)..origin/main -- 'src/' |
while read f; do
  git show origin/main:"$f" | grep -l 'yourFunction' && echo "$f"
done
```

### 4d. Numbering and naming collisions

Check for ADRs, plan files, or generated files where both branches used
the same number or name for different content. Git merges these silently
because the filenames differ.

### 4e. Dependency version conflicts

Compare `package.json` changes on both sides. If both branches updated
the same dependency to different versions, the auto-merge may pick the
wrong one (or produce an invalid `package.json`).

## Phase 5: Create Characterisation Tests

Before starting the merge, write tests that capture the behaviour your branch
adds at the **integration seams** — the points where your code meets code the
other branch changed.

These tests serve as a safety net: if the merge accidentally drops your
wiring, the characterisation tests fail.

Good characterisation tests for a merge:

- Test that your branch's parameters are threaded through to the right
  call sites (e.g. observability passed to handlers)
- Test that your branch's wrappers are applied (e.g. tool handlers are
  wrapped with observability)
- Test boundary behaviour that depends on both branches' code working
  together

Commit these tests **before** starting the merge so they exist on both
sides of the merge commit.

## Phase 6: Execute the Merge

Work in dependency order:

1. **Trivial and structural conflicts first** — fast, low risk, clears noise
2. **Mechanical conflicts** — accept both hunks
3. **Semantic conflicts in dependency order** — start with the keystone file
   (the one other files depend on), then work outwards
4. **Test file conflicts** — after production code is correct
5. **Non-conflicting adaptations** — auto-merged files that need your new
   parameters added
6. **Stale file cleanup** — delete files, fix imports, renumber collisions
7. **Regenerate lockfile** — `pnpm install`
8. **Verify** — `pnpm type-check` first (catches most merge errors), then
   full `pnpm check`

## Phase 7: Verify and Review

1. Run `pnpm type-check` immediately after resolving all conflicts — this
   catches the silent breaks that gap analysis predicted
2. Run `pnpm lint:fix` — catches structural issues
3. Run `pnpm test` — catches behavioural regressions
4. Run characterisation tests — confirms your branch's wiring survived
5. Run `pnpm check` — full clean rebuild + verification
6. Invoke specialist reviewers on the merge result

## Checklist

Use this checklist to ensure nothing is missed:

- [ ] Measured divergence (commits, files, insertions on both sides)
- [ ] Ran dry-run merge, captured full conflict list
- [ ] Identified files changed on both sides (intersection)
- [ ] Identified files deleted by the other branch
- [ ] Grepped for imports of deleted files on your branch
- [ ] Identified files added by both branches (add/add collisions)
- [ ] Checked for numbering collisions (ADRs, plans)
- [ ] Categorised every conflict (trivial/mechanical/semantic/structural)
- [ ] Checked for auto-merged files that call changed interfaces
- [ ] Checked for auto-merged files that import deleted modules
- [ ] Checked for new files on the other branch that call your new required params
- [ ] Compared dependency version changes on both sides
- [ ] Created characterisation tests at integration seams
- [ ] Committed characterisation tests before starting the merge
- [ ] Resolved conflicts in dependency order
- [ ] Adapted non-conflicting files that need new parameters
- [ ] Cleaned up stale files, imports, and numbering
- [ ] Regenerated lockfile
- [ ] Ran full verification suite
- [ ] Invoked specialist reviewers on the merge result
