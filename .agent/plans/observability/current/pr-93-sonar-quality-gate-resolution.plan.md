---
name: "PR 93 Sonar Quality Gate Resolution"
overview: >
  Resolve PR 93 Sonar findings outside paused Claude-owned oak-eslint files,
  document generated SDK duplication disposition, and leave the claimed
  oak-eslint findings in a separate post-unpause plan.
todos:
  - id: phase-0-coordination
    content: "Register comms and claims; split oak-eslint overlap away from this execution pass."
    status: completed
  - id: phase-1-unclaimed-sonar
    content: "Resolve unclaimed script/env Sonar issues and test-string hotspots."
    status: completed
  - id: phase-2-roadmap-disposition
    content: "Record generated SDK duplication as non-blocking PR 93 roadmap debt."
    status: completed
  - id: phase-3-validation
    content: "Run targeted gates and re-query Sonar/GitHub."
    status: completed
---

# PR 93 Sonar Quality Gate Resolution

**Last Updated**: 2026-05-05
**Status**: SONAR ISSUE DISPOSITION COMPLETE; DUPLICATION DEFERRED
**Scope**: PR 93 Sonar findings that do not touch paused Claude-owned
`oak-eslint` files.

## Context

Sonar PR 93 initially reported 11 open issues, 3 security hotspots, and a
16.4% duplicated-lines density on new code. Silvered Hiding Silhouette's
claim `588160cf-d8c7-41b7-b7ac-ecaa870acfa6` owned
`packages/core/oak-eslint/src/configs/strict.unit.test.ts` and adjacent
step-07 work, so the `oak-eslint` TODO-comment findings were intentionally
split to
[`../future/pr-93-sonar-oak-eslint-claim-overlap.plan.md`](../future/pr-93-sonar-oak-eslint-claim-overlap.plan.md).

Generated SDK duplication is not hand-fixed in PR 93. It is routed to
[`../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md`](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md).

Owner direction on 2026-05-05 dispositioned the three remaining
`oak-eslint` S1135 findings as false positives: each occurrence is
documentation/test text describing the gate that catches TODO-like
suppression or pending-test markers, not outstanding work.

## Resolution Plan

### Phase 0 - Coordination

- Post a shared comms event naming the Sonar snapshot and the
  Silvered-owned `oak-eslint` split.
- Register active claims for the unclaimed script/env/docs files.
- Do not edit generated/built SDK files.
- Do not edit Silvered-claimed `oak-eslint` files.

### Phase 1 - Unclaimed Sonar Findings

- Hoist repeated no-capture stdin generators in
  `scripts/check-blocked-content.integration.test.ts`.
- Use `String.prototype.replaceAll` in `scripts/check-blocked-content.ts`.
- Use `String.raw` for escaped regex fixtures in
  `scripts/check-blocked-content.unit.test.ts`.
- Replace public-writable-directory-looking test literals with
  workspace-style literals in script and env schema tests.
- Convert observability schema re-exports to direct `export ... from`.

### Phase 2 - Roadmap Disposition

- Update the PR 93 snagging note so the refreshed PR description is no
  longer treated as a live blocker.
- State that generated/built SDK duplication is acknowledged but
  non-blocking for PR 93.
- Link the generated SDK duplication work to the existing codegen
  workspace decomposition plan and architecture roadmap.

### Phase 3 - Validation

```bash
pnpm test:root-scripts
pnpm --filter @oaknational/env test
pnpm --filter @oaknational/env type-check
```

After validation, re-query Sonar PR 93 issues, hotspots, duplication, and
quality-gate status. If the code fixes have landed upstream and any hotspot
remains only because of a test-only string literal, review it as `SAFE`
with a site-specific rationale.

## Validation Evidence

Local validation on 2026-05-05:

```bash
pnpm test:root-scripts
pnpm --filter @oaknational/env test
pnpm --filter @oaknational/env type-check
pnpm exec markdownlint --dot .agent/plans/observability/current/pr-93-sonar-quality-gate-resolution.plan.md .agent/plans/observability/future/pr-93-sonar-oak-eslint-claim-overlap.plan.md .agent/plans/observability/current/pr-93-merge-snagging-2026-05-05.md .agent/plans/architecture-and-infrastructure/roadmap.md .agent/plans/observability/README.md .agent/memory/active/napkin.md
git diff --check -- scripts/check-blocked-content.integration.test.ts scripts/check-blocked-content.ts scripts/check-blocked-content.unit.test.ts packages/core/env/src/schemas/observability.ts packages/core/env/src/schemas/observability.unit.test.ts .agent/plans/observability/current/pr-93-sonar-quality-gate-resolution.plan.md .agent/plans/observability/future/pr-93-sonar-oak-eslint-claim-overlap.plan.md .agent/plans/observability/current/pr-93-merge-snagging-2026-05-05.md .agent/plans/architecture-and-infrastructure/roadmap.md .agent/plans/observability/README.md .agent/memory/active/napkin.md
```

All commands above passed. `pnpm --filter @oaknational/env lint` also
exited 0 with one pre-existing warning in untouched
`packages/core/env/tests/root-package-version.unit.test.ts`. A direct
ad-hoc `pnpm exec eslint <root script files>` invocation is not a valid
root-script lint path in this repo because the root flat config requires
typed parser services for those files when invoked this way.

Remote verification on 2026-05-05 after branch sync to
`b929a022079876119fcd631e546f442896f78b72`:

- `new_violations=0` after marking the three remaining `oak-eslint`
  S1135 findings false positive in Sonar.
- Security hotspots: 0.
- Sonar quality gate remains `ERROR` only because
  `new_duplicated_lines_density=16.0` exceeds the threshold of 3.
- Duplication remediation is deferred to the existing future codegen plan;
  this session does not hand-edit generated SDK files or solve the broader
  duplicated-file list.

## Acceptance Criteria

1. All non-claimed script/env Sonar issues have local code changes.
2. The three public-writable-directory hotspots have either been removed
   from source or have a site-specific Sonar review disposition after
   re-analysis.
3. The remaining `oak-eslint` Sonar issues are documented in the separate
   post-unpause plan.
4. The generated/built SDK duplication route is explicit in the snagging
   note and architecture roadmap.
5. Targeted gates pass locally, or any failure is recorded with evidence
   and next action.

## Non-Goals

- No generated SDK hand-refactor in PR 93.
- No change to `packages/core/oak-eslint/src/configs/strict.ts` or
  `packages/core/oak-eslint/src/configs/strict.unit.test.ts` while the
  paused Silvered claim remains fresh.
- No broad Sonar suppression for public-writable-directory hotspots.
