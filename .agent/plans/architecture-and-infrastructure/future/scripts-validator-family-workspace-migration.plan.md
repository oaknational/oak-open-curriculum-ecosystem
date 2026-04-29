# Scripts Validator Family — Workspace Migration

**Status**: 🔵 STRATEGIC BRIEF (not yet executable)
**Last Updated**: 2026-04-29

## Problem and Intent

The `scripts/` directory at the repo root currently hosts a family of repo-invariant validators with the shape **runtime + helper module + unit tests** (and in some cases integration tests). These are:

- `scripts/validate-portability.ts` (553 lines + 348-line test) and `validate-portability-helpers.ts`
- `scripts/validate-practice-fitness.ts` (685 lines + 287-line test)
- `scripts/validate-fitness-vocabulary.ts` (216 lines + 126-line test)
- `scripts/validate-subagents.ts` (230 lines + 150-line test) and `validate-subagents-helpers.ts`
- `scripts/validate-eslint-boundaries.ts` (also crosses workspace boundary via `../packages/core/oak-eslint/src/...` relative import)
- `scripts/validate-no-stale-script-invocations.ts` (added in PR #90 commit `62ea5032`) and helpers
- `scripts/check-blocked-content.ts` and `scripts/check-blocked-patterns.ts` (Claude-hook-shaped, slightly different category)
- `scripts/ci-turbo-report.ts`, `scripts/ci-schema-drift-check.ts` (CI-tooling category)

The owner direction recorded on 2026-04-27 (in napkin and as feedback memory entry `feedback_no_workspace_to_root_scripts`):

> "Anything complex or high enough risk to need tests MUST be moved into a proper workspace. That absolutely applies to everything touched by the test:root-scripts script."

This rule has not yet been graduated to a canonical `.agent/rules/*.md` file. Four parallel architecture reviews on PR #90 (Barney boundaries, Fred principles, Betty cohesion/change-cost, Wilma adversarial reliability) all converged on the same finding: **the existing `scripts/validate-*` pattern is structural drift relative to ADR-041 (workspace structure), §Separate Framework from Consumer ("Distinct architectural layers MUST live in distinct workspaces"), and the owner's stated principle.**

The drift is invisible to:

- workspace ESLint boundary rules (root config special-cases `scripts/**` only for `no-console`; no `import-x/no-restricted-paths` zone applies)
- depcruise (run only against `apps/`, `packages/`, `agent-tools/`)
- per-workspace `pnpm type-check` (root tsconfig.json does not include `scripts/**`)
- turbo task graph
- per-workspace ESLint configs

## Domain Boundaries and Non-Goals

**In scope** of the migration this brief covers:

- `scripts/validate-*` family (Group A — repo-invariant governance validators)
- Their helper modules and test files
- The `pnpm test:root-scripts` script wiring
- The `.github/workflows/*.yml` invocations
- Any documentation that references the script paths
- Authoring a `.agent/rules/` file codifying the doctrine
- Authoring an ADR delta or peer ADR documenting the placement decision

**Out of scope** of this migration brief (separate questions):

- `scripts/check-blocked-{content,patterns}.ts` (Group B — Claude-hook stdin/stdout contract; different execution model). May belong in `agent-tools/` or in a dedicated hooks workspace; assess separately.
- `scripts/ci-turbo-report.ts`, `scripts/ci-schema-drift-check.ts`, etc. (Group C — CI-only tooling). May belong in a dedicated `packages/devx/ci-tools` workspace; assess separately.
- Truly thin shell-style scripts (`*.sh`, single-file Node helpers with no logic worth testing) — these can legitimately remain at root.

## Dependencies and Sequencing Assumptions

**Hard prerequisite**: graduate the owner direction to a canonical rule before adding more validators. The rule should specify the threshold ("any TS file in `scripts/` that has a separated `*-helpers.ts` or any `*.{unit,integration}.test.ts` file MUST live in a declared workspace") so future PRs do not re-litigate the question.

**Workspace home decision required**: the four reviewers split on the right destination:

- **Barney + Fred** recommend `agent-tools/` because it already exists, has the build/test infrastructure, and is governed by ADR-165.
- **Betty** argues against `agent-tools/` on cohesion grounds — its README scopes it to "operational CLIs for agents" (e.g. `claude-agent-ops`, `collaboration-state`, `agent-identity`); repo-invariant validators are a different semantic category. Betty recommends a new workspace (`packages/devx/repo-invariants` or `packages/core/repo-invariants`).

This is a Build-vs-Buy decision (use `agent-tools/` vs build a new workspace) that must be resolved at promotion time, not deferred indefinitely. An `assumptions-reviewer` pass at promotion will challenge the choice.

**Coupling cleanup opportunity**: `scripts/validate-eslint-boundaries.ts` currently imports `../packages/core/oak-eslint/src/rules/boundary.js` — a cross-workspace relative-path import that bypasses the package's declared `@oaknational/eslint-plugin-standards` public API. The migration is the natural occasion to convert this to a proper `devDependency` import.

**Filesystem-walker duplication**: three current validators (`validate-portability.ts`, `validate-subagents.ts`, `validate-no-stale-script-invocations.ts`) each implement their own `walkFiles` / `listFiles` with different exclusion predicates. Consolidating into a single utility is a natural side-effect of placing them in one workspace.

## Success Signals (what would justify promotion)

- A second new validator surfaces and is being authored. Adding it to `scripts/` would extend the drift; the natural moment to act is when the marginal cost of adding properly equals the cost of migrating the family.
- Owner explicitly asks for the migration to start.
- A change to one of the validators reveals genuine pain (hidden type error, broken cross-workspace import, missing boundary check) that a workspace placement would have caught structurally.
- The owner-direction rule gets graduated to a `.agent/rules/` file, which is its own standalone work item.

## Risks and Unknowns

- **Test-runner re-wiring**: `pnpm test:root-scripts` currently in the `pnpm check` chain. The migration must preserve that gate without race conditions or duplicate runs.
- **CI workflow updates**: `.github/workflows/ci.yml` invokes `pnpm test:root-scripts`. After migration, may need to invoke workspace-scoped tests instead.
- **Boundary-rule additions**: if the migration uses `agent-tools/` or a new workspace, the `eslint-plugin-standards` boundary rules may need updating to allow the new import patterns (e.g. test files importing from `@oaknational/eslint-plugin-standards` directly).
- **Documentation sweep**: ADR-168, governance/development-practice, the napkin pattern file `governance-claim-needs-a-scanner.md`, and `docs/engineering/build-system.md` all reference these scripts; need updating in lockstep.
- **Rule-vs-code timing**: if the rule is graduated first, future PRs will be blocked from adding validators to `scripts/` — which is desirable, but the existing 6+ violators must be migrated quickly to prevent the rule from being accumulated as known debt.

## Promotion Trigger into `current/`

Promote when **either** condition is met:

1. Owner explicitly directs starting the migration.
2. A new validator is needed and the owner sees value in landing the migration first to avoid extending the drift.

## Implementation Detail (Reference Context Only — Not Yet Executable)

The four reviewers' direction (synthesised):

1. **Author the rule** at `.agent/rules/no-workspace-evading-scripts.md` (canonical body) plus thin adapters in `.claude/rules/`, `.cursor/rules/`, `.agents/rules/`. Cite ADR-168 §Workspace-script-ban and the 2026-04-27 owner direction as provenance.
2. **Choose the workspace home** (resolve the `agent-tools/` vs new-workspace question via Build-vs-Buy attestation; default toward `agent-tools/` if no compelling cohesion argument resolves).
3. **Migrate Group A in one focused commit batch**:
   - Move runtime + helper + unit-test triples from `scripts/` into the chosen workspace.
   - Convert `validate-eslint-boundaries`'s relative cross-workspace import into a proper `devDependency` import via `@oaknational/eslint-plugin-standards`.
   - Optional consolidation: extract the duplicated filesystem walker into a shared utility within the workspace.
4. **Re-wire test execution**: replace `pnpm test:root-scripts` either by retiring it (if the validator workspace is part of `pnpm test` directly) or sharply scoping it to genuinely thin shell-style residue.
5. **Update CI workflow YAML** if the invocation path changes.
6. **Sweep documentation**: ADR-168 reference, `governance-claim-needs-a-scanner.md` paths, build-system.md, and any other validator-script references.

Execution decisions (which validators move first, ordering, ADR amendment vs new ADR, etc.) are finalised at promotion to `current/`/`active/` only.

## References

- Owner direction provenance: `feedback_no_workspace_to_root_scripts` memory entry; napkin entry on 2026-04-27 ("Prismatic Waxing Constellation — quality-gated scripts belong in workspaces")
- ADR-041 (workspace structure) — the architectural anchor
- ADR-165 (agent-work-practice-phenotype-boundary) — relevant to `agent-tools/` placement
- ADR-168 (TS6 baseline + workspace-script architectural rules) — Rule 2 covers workspace→root direction; this brief addresses the inverse
- Pattern: `.agent/memory/active/patterns/governance-claim-needs-a-scanner.md` — predicts more validators will arrive
- Reviewer consensus from PR #90 (architecture-reviewer-{barney,betty,fred,wilma} parallel pass on 2026-04-29)
- PR #90 commit `62ea5032` (the most recent file added to `scripts/`; cleanest test case for migration shape because the framework/consumer split already exists and the surface area is small)
