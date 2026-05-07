---
name: "PR 102 Snagging"
overview: "Queued next-session plan to clear PR review threads and Sonar gate blockers."
type: quality-fix
status: current
source_pr: 102
todos:
  - id: phase-0-refresh-evidence
    content: "Phase 0: Re-pull PR review threads and Sonar state before editing."
    status: completed
  - id: phase-1-review-thread-snags
    content: "Phase 1: Address the four unresolved PR review threads."
    status: completed
  - id: phase-2-sonar-snags
    content: "Phase 2: Address the one Sonar issue and two Sonar security hotspots."
    status: completed
  - id: phase-3-gates-and-review
    content: "Phase 3: Run quality gates, specialist reviews, and PR/Sonar verification."
    status: completed
  - id: phase-4-handoff
    content: "Phase 4: Record evidence, close lifecycle state, and hand off remaining risk."
    status: completed
---

# PR 102 Snagging

**Last Updated**: 2026-05-07  
**Status**: COMPLETED (`current/`)  
**Scope**: Next-session execution plan for clearing all known PR #102 review
threads and Sonar quality-gate blockers. This plan does not implement the fixes.

## Context

PR #102 is open and merge-blocked by Sonar. The latest pull found four
unresolved, non-outdated review threads, one open Sonar code issue, and two
unreviewed Sonar security hotspots.

The intended impact is narrow: unblock the PR by fixing the source problems
without widening the branch, weakening checks, adding compatibility layers, or
editing Practice Core files. The next session should treat this as snagging,
not as permission to rework the graph planning arc or the branch-file-count
tooling beyond the reported defects.

First question: could this be simpler without compromising quality? Yes: do the
minimum source-level corrections that make the comments and Sonar findings
obsolete, then prove the PR is clean. Do not route around the findings.

## Foundation Alignment

Before implementation starts and at each phase boundary, re-read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

Commitments:

- Fix at the source; no compatibility layers, aliases, or fallback values.
- Preserve TDD atomic landing for code changes: test and product code land
  together in each code cycle.
- For documentation-only changes, use deterministic text validation and PR
  thread evidence as the acceptance surface.
- Do not edit `.agent/practice-core/**` as part of this plan.
- Do not reactively edit shared knowledge files to satisfy fitness output.

## Snag Ledger

### C1-C3: Graph Layer Taxonomy Mismatch

**Evidence**: PR review threads `r3203494220`, `r3203494323`, and
`r3203494358` all flag the old `surface` graph-layer value in the three new
graph slice plans. The portfolio index defines a narrower set of accepted
values.

**Root cause to verify**: plan frontmatter and portfolio taxonomy drifted from
one another during closeout.

**Resolution intent**: make the frontmatter and taxonomy source use one
canonical surface-layer value. If the taxonomy itself is the wrong source of
truth, amend it consistently in the same landing; do not add an alias.

### C4: Primitive Wording Inconsistency

**Evidence**: PR review thread `r3203494399` flags acceptance criterion #4 in
the thread-surface plan. It says the ADR records "renamed primitives", while
the plan describes adding new primitives and explicitly says it does not rename.

**Root cause to verify**: copied or stale wording in acceptance criteria.

**Resolution intent**: update the criterion so it describes recording new
primitives, not renamed primitives.

### S1: Loop Counter Assignment

**Evidence**: Sonar issue `AZ4DmqZJ8-ee4mAVgRc0`,
`agent-tools/src/branch-touched-files/cli.ts:99`, rule `typescript:S2310`.

**Root cause to verify**: `parseArgs` assigns to the `for` loop counter inside
the loop body after delegating to `consumeArg`.

**Resolution intent**: refactor argument consumption so index advancement is
explicit and not expressed as a `for` counter reassignment. Preserve existing
CLI behaviour.

### H1-H2: Git Subprocess Command Lookup

**Evidence**:

- Hotspot `AZ4DmqWc8-ee4mAVgRcz`,
  `agent-tools/src/bin/branch-touched-files.ts:12`, rule `typescript:S4036`.
- Hotspot `AZ4DmqZc8-ee4mAVgRc1`,
  `agent-tools/src/branch-touched-files/git.ts:29`, rule `typescript:S4036`.

**Root cause to verify**: direct `execFileSync("git", ...)` calls rely on
ambient command lookup.

**Resolution intent**: route Git process execution through one explicit,
auditable subprocess helper that avoids unbounded ambient lookup. Prefer an
existing repo pattern if one exists; otherwise introduce the smallest strict
helper needed for this CLI and test it through dependency injection.

## Resolution Plan

### Phase 0: Refresh Evidence

Pull current PR and Sonar state before editing. Do this even if the next session
starts immediately after this plan: bot comments and check states can change.

Acceptance criteria:

1. PR #102 review threads are re-read with resolved/outdated state.
2. Top-level PR comments are re-read.
3. Sonar quality gate, open issues, and security hotspots are re-read for PR
   #102.
4. If any thread or Sonar item has already disappeared, mark it as no-op in the
   session notes and do not edit for it.

Deterministic validation:

```bash
gh pr view 102 --json state,isDraft,mergeStateStatus,statusCheckRollup
gh pr view 102 --comments
gh api graphql \
  -f owner="$(gh repo view --json owner -q .owner.login)" \
  -f repo="$(gh repo view --json name -q .name)" \
  -F number=102 \
  -f query='
query($owner:String!, $repo:String!, $number:Int!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      reviewThreads(first:100) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first:20) {
            nodes {
              databaseId
              author { login }
              body
              createdAt
              url
            }
          }
        }
      }
    }
  }
}'
```

Expected: GraphQL output includes every review thread with `isResolved`,
`isOutdated`, path, line, and review-comment `databaseId` values.

Use the Sonar MCP tools with the project key read from
`sonar-project.properties`; do not substitute a repo slug from memory:

```text
PROJECT_KEY = value of sonar.projectKey from sonar-project.properties

get_project_quality_gate_status({
  projectKey: PROJECT_KEY,
  pullRequest: "102",
})

search_sonar_issues_in_projects({
  projects: [PROJECT_KEY],
  pullRequestId: "102",
  issueStatuses: ["OPEN", "CONFIRMED"],
  ps: 100,
})

search_security_hotspots({
  projectKey: PROJECT_KEY,
  pullRequest: "102",
  status: ["TO_REVIEW"],
  sinceLeakPeriod: true,
  ps: 100,
})
```

### Phase 1: Review Thread Snags

#### Cycle 1.1: Surface-Layer Taxonomy Alignment

Address C1-C3 together because they are the same defect across three sibling
plan files.

Acceptance criteria:

1. All three flagged frontmatter blocks use the canonical value chosen from the
   taxonomy source.
2. The portfolio index and plan frontmatter agree without aliases.
3. No old `surface` graph-layer residue remains in the relevant plan corpus.
4. Review threads `r3203494220`, `r3203494323`, and `r3203494358` are obsolete
   by diff inspection.

Validation:

```bash
rg -n "graph_layer:[[:space:]]+surface" .agent/plans
rg -n "graph_layer:" .agent/plans/graph-portfolio-index.md .agent/plans/connecting-oak-resources/knowledge-graph-integration/current
pnpm markdownlint:root
```

Expected: first command returns no matches; second command shows one consistent
taxonomy value for the affected surface plans; markdownlint passes.

#### Cycle 1.2: Primitive Wording Correction

Address C4.

Acceptance criteria:

1. The flagged acceptance criterion describes new primitives.
2. No nearby text reintroduces rename language for those primitives.
3. Review thread `r3203494399` is obsolete by diff inspection.

Validation:

```bash
rg -n "renamed primitives|new primitives" .agent/plans/connecting-oak-resources/knowledge-graph-integration/current
pnpm markdownlint:root
```

Expected: no stale "renamed primitives" wording remains in the affected slice
plan; markdownlint passes.

### Phase 2: Sonar Snags

#### Cycle 2.1: Parser Index Advancement

Address S1.

Acceptance criteria:

1. `parseArgs` preserves current CLI behaviours for flags, valued flags,
   positionals, `--`, and help.
2. Index advancement no longer assigns to a `for` loop counter inside the loop
   body.
3. If current tests do not describe the affected behaviours, add the missing
   tests in the same commit as the refactor.
4. Sonar issue `AZ4DmqZJ8-ee4mAVgRc0` is obsolete after analysis.

Validation:

```bash
pnpm --filter ./agent-tools test -- branch-touched-files
pnpm --filter ./agent-tools lint
pnpm --filter ./agent-tools build
```

#### Cycle 2.2: Git Subprocess Boundary

Address H1-H2.

Acceptance criteria:

1. Both Git subprocess call sites use one shared helper or one shared injected
   command boundary.
2. The helper does not rely on unbounded ambient command lookup.
3. Tests describe command construction and error propagation without spawning
   real processes.
4. The two Sonar hotspots are either gone after analysis or reviewed with
   concrete evidence that the fixed boundary satisfies the rule.

Validation:

```bash
pnpm --filter ./agent-tools test -- branch-touched-files
pnpm --filter ./agent-tools lint
pnpm --filter ./agent-tools build
```

### Phase 3: Gates And Review

After each code cycle, run the focused agent-tools validations above. After the
phase, run the quality-gate component commands as the explicit workstream
gate:

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
```

For merge-readiness, run the canonical aggregate gate as the final local
verification:

```bash
pnpm check
```

Reviewer scheduling:

1. Run `assumptions-reviewer` before implementation if Phase 0 changes the
   solution shape.
2. Run `code-reviewer` after implementation.
3. Run `docs-adr-reviewer` only if the taxonomy fix changes an ADR, index
   contract, or documentation rule beyond the three review-thread snags.

PR verification:

1. Push the branch.
2. Confirm PR #102 review threads are resolved or obsolete.
3. Confirm Sonar quality gate is OK or that no open issue/hotspot remains
   attributable to this plan's scope.

### Phase 4: Handoff

Acceptance criteria:

1. The plan todo statuses reflect completed work or explicit residual blockers.
2. Evidence is recorded in the session handoff: commands run, reviewer results,
   Sonar state, and PR thread state.
3. Active collaboration claims are closed.
4. The learning-loop consolidation trigger is checked.

Learning loop:

Run the standard session handoff. If the session discovers a reusable lesson,
capture it in the appropriate active-memory surface without trimming unrelated
knowledge for fitness.

## Completion Evidence

Completed by Twigged Shedding Fern on 2026-05-07.

Phase 0 refreshed PR #102 review threads, top-level PR comments, and Sonar PR
state before editing. The refreshed evidence showed four unresolved review
threads, one open Sonar issue, and two Sonar security hotspots in this plan's
scope.

Local validation passed:

```bash
rg -n "graph_layer:[[:space:]]+surface" .agent/plans
rg -n "renamed primitives" .agent/plans/connecting-oak-resources/knowledge-graph-integration/current
rg -n "execFileSync\\('git'|execFileSync\\(\"git\"|spawnSync\\('git'|spawnSync\\(\"git\"" agent-tools/src/bin/branch-touched-files.ts agent-tools/src/branch-touched-files/git.ts agent-tools/src/branch-touched-files/cli.ts
pnpm --filter ./agent-tools test -- branch-touched-files
pnpm --filter ./agent-tools lint
pnpm --filter ./agent-tools build
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm check
git diff --check
```

`pnpm lint:fix` and `pnpm check` reported existing out-of-scope
`unicorn/prefer-single-call` warnings in search/codegen files. Those commands
also rewrote unrelated files; the rewrites were removed to keep the branch
limited to the PR #102 snagging scope.

## Non-Goals

- No Practice Core edits.
- No broad graph planning rewrite.
- No branch-file-count feature expansion.
- No acceptance of failing checks.
- No workaround commit that only marks Sonar items reviewed while leaving the
  source boundary unchanged.
