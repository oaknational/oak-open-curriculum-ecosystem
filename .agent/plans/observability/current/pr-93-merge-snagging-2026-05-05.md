---
status: active
owner: agents
created: 2026-05-05
source_pr: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/93
branch: feat/eef_exploration
base: main
---

# PR 93 Merge Snagging

Snapshot taken 2026-05-05 14:34 UTC by Deep Rolling Archipelago.

Compared PR 93 at remote head `cdcde955` against `origin/main` (`e2796757`).
Local checkout is one commit ahead of the PR head (`84879230`) and has an
unstaged `.agent/commands/session-handoff.md` edit; those local-only changes are
not part of this PR comparison.

Update 2026-05-05 16:28 UTC by Glassy Drifting Dock: the GitHub PR body now
opens with the merge-blocking `thread-units` / `unitOrder` upstream API-shape
fix and current branch scope. The stale-description snag is retained below as
resolved history, not a live PR 93 blocker.

## Merge Readiness Summary

**Not merge-ready yet.** The branch contains the blocking upstream API-shape fix,
and the core GitHub/Vercel/CodeQL/test surfaces are green, but SonarCloud is
still failing. The PR description drift called out in the original snapshot has
been resolved remotely.

The blocking fix is present in the PR as commit `9e657ad3`
`fix(sdk): align thread-units adapter to upstream schema dropping unitOrder`.
It updates:

- `apps/oak-search-cli/src/adapters/oak-adapter-threads.ts`
- `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-base.ts`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-original.json`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-sdk.json`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-threads-units.ts`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/response-map.ts`
- `packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts`

## GitHub Conversation And Statuses

### Comments

- PR review line comments: none.
- Submitted reviews: none.
- Issue comments:
  - Vercel bot comment updated 2026-05-05 14:25 UTC: preview deployment ready at
    `poc-oak-open-curriculum-mcp-git-feat-eefexploration.vercel.thenational.academy`.
  - SonarQube Cloud bot comment created 2026-05-05 14:25 UTC: Quality Gate
    failed with 11 new issues, 3 security hotspots, and 16.4% duplication on
    new code, against a requirement of at most 3%.

### Status Checks

- `test`: success.
- CodeQL `Analyze (javascript-typescript)`: success.
- CodeQL `Analyze (actions)`: success.
- CodeQL app status: success.
- Cursor Bugbot: success.
- Vercel: success / ready.
- SonarCloud Code Analysis: failure.
- GitHub merge state: `UNSTABLE`.

## Resolved Description Drift

The original snapshot found that the PR body still opened as if the PR was the
original four-commit, plans-only EEF restructure:

- It says **"No code changed"**.
- It says **"plans-only architectural restructure across 27 files"**.
- It lists four commits (`0224429b`, `e70bbc73`, `c7e4828c`, `c7063541`).
- It frames the main remaining work as owner direction on nine architectural
  planning findings and type-reviewer escalation for future implementation.

The PR branch currently contains:

- 118 commits on the remote PR branch.
- 569 changed files.
- 51,598 insertions and 10,053 deletions.
- Runtime and generated SDK changes for the upstream API shape fix.
- Search CLI adapter changes.
- HTTP MCP app test/config changes, including retirement of the old smoke-test
  harness and replacement test coverage.
- Observability/env package changes.
- Agent-tooling, rule, hook, Practice, planning, and continuity changes.

Deep Rolling Archipelago subsequently replaced the PR body. A 2026-05-05
16:28 UTC `gh pr view` check confirmed the body now leads with the
`thread-units` schema change, generated SDK artefacts, search adapter update,
remote head `cdcde955`, and base `e2796757`.

## Current Snag List

### P0: SonarCloud Quality Gate Failed

Source: SonarQube Cloud PR analysis for PR 93.

The Quality Gate is failing on:

- 16.0% duplication on new code after the latest PR 93 analysis.

Resolved issue/hotspot state after 2026-05-05 disposition:

- Open issues: 0.
- Security hotspots: 0.
- `new_violations`: 0.

The three remaining `oak-eslint` S1135 findings were marked false positive in
Sonar after owner direction: they are documentation/test examples describing
the strict gate that catches TODO-like suppression rationales and pending-test
markers, not outstanding work items.

Duplication pressure is broad. Sonar's duplicated-file list is large; top
contributors include generated SDK files, HTTP MCP E2E tests, agent identity
wordlist files, and custom ESLint rule tests. Notable entries:

- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-base.ts`
  with 6,993 duplicated lines.
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts`
  with 2,705 duplicated lines.
- `packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts`
  with 1,575 duplicated lines.
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/response-map.ts`
  with 1,444 duplicated lines.
- `packages/core/oak-eslint/src/rules/no-real-io-in-tests.unit.test.ts`
  with 333 duplicated lines.

Action: keep duplication remediation deferred to the codegen roadmap rather
than product-code refactoring in PR 93.

### Resolved: PR Description Was Materially Stale

The original PR description no longer communicated the branch that would be
merged. This was a merge-readiness problem because reviewers and approvers would
miss the real risk surface: the branch now includes the blocking upstream
API-shape fix and a large body of runtime/tooling/test/doctrine changes.

Resolution: the remote PR body now leads with:

- Blocking fix: upstream `thread-units` schema dropped `unitOrder`; branch
  updates generated SDK artefacts and the search adapter.
- Current branch size: 118 commits, 569 files.
- Current status: CI/test green, CodeQL green, Vercel ready, Sonar failing.
- Major change families: SDK/schema fix, HTTP MCP smoke-test retirement,
  observability/env work, agent-tooling/practice/rules/docs changes.
- Remaining merge blockers: Sonar gate and any owner acceptance of branch scope.

### P1: Scope Explosion Since Original Review Context

The original PR body says "plans-only"; the actual PR includes code and tests in
multiple workspaces. Even if all checks pass, the review context needs to match
the landed work.

Action: add a short "scope since PR opened" section to the PR body and request
review attention on the code-bearing parts, especially:

- SDK generated artefacts and `apps/oak-search-cli/src/adapters/oak-adapter-threads.ts`.
- HTTP MCP test/config migration after smoke-test retirement.
- `packages/core/env` observability schema work.
- `packages/core/oak-eslint` rule/config changes.
- `agent-tools` identity/statusline/collaboration changes.

### P1: Generated-Code Duplication Needs Explicit Disposition

Sonar duplication is dominated by generated SDK files. Refactoring generated
output by hand would violate the schema-first rule; if the duplication is real
and harmful, the generator owns the fix. If it is an unsuitable Sonar signal for
generated artefacts, the disposition must be explicit and per project policy.

Disposition: the generated/built SDK duplication is acknowledged but is not a
PR 93 code-change blocker. Do not hand-refactor generated SDK files on this PR.
The owner path is the existing future codegen plan
[`../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md`](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md),
scheduled for an upcoming codegen session.

Action for PR 93: no duplication remediation in this session. The owner has
accepted deferral to a future codegen session.

### Resolved: Hotspots Need Review Records

All three public-writable-directory-looking hotspot literals were removed from
the tested source surface. Sonar PR 93 now reports 0 hotspots.

### P2: Local Checkout Contains Non-PR Work

Local HEAD is one commit ahead of the remote PR head:

- `84879230 docs(workflow): add session comms-events as napkin auxiliary source`

There is also an unstaged edit to `.agent/commands/session-handoff.md`.

Action: before any merge or final PR update, decide whether the local-only
commit and unstaged edit are intended for PR 93. If they are not, keep them out
of the PR update path.

## Proposed Closure Order

1. Done: fix or disposition the 11 Sonar issues.
2. Done: fix or review the 3 Sonar security hotspots.
3. Done: confirm duplication remediation is deferred to the future codegen
   session for this PR closeout.
4. Keep generated/built SDK duplication on the codegen roadmap; do not
   hand-refactor generated files in PR 93.
5. Rerun or wait for SonarCloud and confirm the Quality Gate status or the
   documented owner disposition.
6. Re-check PR statuses and comments immediately before merge.

## Evidence Commands Used

```bash
gh pr view 93 --repo oaknational/oak-open-curriculum-ecosystem --json title,body,headRefName,baseRefName,mergeStateStatus,isDraft,commits,files,comments,reviews,statusCheckRollup
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/93/comments --paginate
gh api repos/oaknational/oak-open-curriculum-ecosystem/issues/93/comments --paginate
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/93/reviews --paginate
git rev-list --count origin/main..origin/feat/eef_exploration
git diff --shortstat origin/main...origin/feat/eef_exploration
git diff --name-status origin/main...origin/feat/eef_exploration -- packages/sdks/oak-sdk-codegen apps/oak-search-cli/src/adapters/oak-adapter-threads.ts
```

Sonar issue, hotspot, and duplication details came from the SonarQube MCP server
against project `oaknational_oak-open-curriculum-ecosystem`, PR `93`.
