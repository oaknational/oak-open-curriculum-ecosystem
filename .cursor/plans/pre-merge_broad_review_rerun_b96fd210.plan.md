---
name: Pre-merge broad review rerun
overview: Run a full pre-merge, merge-base-scoped review across all branch changes with the requested reviewer order, enforcing fix-and-validate cycles between tranches until all findings are resolved or explicitly rejected with rationale.
todos:
  - id: scope-freeze
    content: Freeze review scope to merge-base diff (`main...HEAD`) and produce changed-file inventory for reviewer context.
    status: completed
  - id: tranche-01-code
    content: Run code-reviewer standalone pass; classify findings; apply fixes; run full gate quartet to clean.
    status: completed
  - id: tranche-02-to-05-arch
    content: Run architecture reviewers Barney, Betty, Fred, Wilma in order with fix-and-gate loop after each tranche.
    status: completed
  - id: tranche-06-type
    content: Run type-reviewer tranche; resolve type-safety findings and re-run all gates to clean.
    status: completed
  - id: tranche-07-test
    content: Run test-reviewer tranche; resolve testing/TDD quality findings and re-run all gates to clean.
    status: completed
  - id: tranche-08-to-11-doc-sec-config-onboard
    content: Run docs/ADR, security, config, and onboarding reviewers in order with tranche-level fix-and-gate loops.
    status: completed
  - id: tranche-12-elastic
    content: Run elasticsearch-reviewer tranche (required by changed ES mapping/query/ingest/synonym/count surfaces); fix and gate.
    status: completed
  - id: tranche-13-barney-final
    content: Run final Barney architecture pass to catch cross-tranche regressions; resolve findings; run final clean gates.
    status: completed
  - id: final-report
    content: Publish consolidated per-reviewer report (findings, fixes, rejected items with rationale, residual risks).
    status: completed
isProject: false
---

# Pre-merge Broad Review (Re-run, New Order)

## Intent and Scope

- Review all changes on this branch since `merge-base(main, HEAD)` (`main...HEAD`), not only recent commits.
- Current branch scope: `feat/search_cli_enhancements`, `158` changed files.
- Treat all reviewer findings as blocking by default; only reject findings with explicit rationale.
- Enforce strict principles alignment from `[.agent/directives/principles.md](.agent/directives/principles.md)`, especially: no compatibility layers, fail fast, no type shortcuts, no disabled checks.

## Domain Risk Map (Prioritised During Review)

- CLI lifecycle/admin/indexing paths: `[apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts](apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts)`, `[apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts](apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts)`, `[apps/oak-search-cli/src/lib/indexing/run-versioned-ingest.ts](apps/oak-search-cli/src/lib/indexing/run-versioned-ingest.ts)`
- Elasticsearch client/count/synonyms surfaces: `[apps/oak-search-cli/src/cli/shared/with-es-client.ts](apps/oak-search-cli/src/cli/shared/with-es-client.ts)`, `[packages/sdks/oak-search-sdk/src/admin/create-admin-service.ts](packages/sdks/oak-search-sdk/src/admin/create-admin-service.ts)`, `[packages/sdks/oak-search-sdk/src/admin/admin-index-operations.ts](packages/sdks/oak-search-sdk/src/admin/admin-index-operations.ts)`, `[packages/sdks/oak-search-sdk/src/admin/verify-doc-counts.ts](packages/sdks/oak-search-sdk/src/admin/verify-doc-counts.ts)`
- Generator-first/schema-derived changes: `[packages/sdks/oak-sdk-codegen/code-generation/sitemap-scanner-core.ts](packages/sdks/oak-sdk-codegen/code-generation/sitemap-scanner-core.ts)`, `[packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/validate-canonical-urls.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/validate-canonical-urls.ts)`, `[packages/sdks/oak-sdk-codegen/code-generation/codegen.ts](packages/sdks/oak-sdk-codegen/code-generation/codegen.ts)`
- Process/config/doc shifts: `[agent-tools/src/core/runtime.ts](agent-tools/src/core/runtime.ts)`, `[package.json](package.json)`, `[turbo.json](turbo.json)`, `[.husky/pre-commit](.husky/pre-commit)`, ADR updates in `[docs/architecture/architectural-decisions/](docs/architecture/architectural-decisions/)`

## Execution Flow

```mermaid
flowchart TD
  scope[EstablishMainMergeBaseScope] --> tranche1[Tranche1CodeReviewer]
  tranche1 --> fix1[ApplyFixesAndValidate]
  fix1 --> gates1[RunGatesLintTypeTestBuild]
  gates1 --> tranche2[ArchitectureBarney]
  tranche2 --> tranche3[ArchitectureBetty]
  tranche3 --> tranche4[ArchitectureFred]
  tranche4 --> tranche5[ArchitectureWilma]
  tranche5 --> tranche6[TypeReviewer]
  tranche6 --> tranche7[TestReviewer]
  tranche7 --> tranche8[DocsAdrReviewer]
  tranche8 --> tranche9[SecurityReviewer]
  tranche9 --> tranche10[ConfigReviewer]
  tranche10 --> tranche11[OnboardingReviewer]
  tranche11 --> tranche12[ElasticsearchReviewer]
  tranche12 --> tranche13[ArchitectureBarneyFinal]
  tranche13 --> finalReport[ConsolidatedReviewerReport]
```

## Tranche Protocol (Applied to Every Reviewer)

- Invoke reviewer in strict order with `readonly: true` and branch-wide scope (`main...HEAD`).
- Record findings by severity with concrete file/symbol references.
- Implement fixes for accepted findings before moving on.
- For any rejected finding, capture explicit rejection rationale and evidence.
- Run quality gates from repo root after each tranche fix set:
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm test`
  - `pnpm build`
- If any gate fails, fix and re-run full gate set until clean.

## Reviewer Order (Exact)

1. `code-reviewer` only (deep standalone pass)
2. `architecture-reviewer-barney`
3. `architecture-reviewer-betty`
4. `architecture-reviewer-fred`
5. `architecture-reviewer-wilma`
6. `type-reviewer`
7. `test-reviewer`
8. `docs-adr-reviewer`
9. `security-reviewer`
10. `config-reviewer`
11. `onboarding-reviewer`
12. `elasticsearch-reviewer` (required; Elasticsearch-related files changed)
13. `architecture-reviewer-barney` (final regression pass)

## Reporting Contract (Per Reviewer)

- Findings ordered by severity, each with file/symbol references.
- What was fixed in this tranche.
- What was consciously rejected and why.
- Residual risks or verification gaps.

## Acceptance Criteria

- All 13 reviewer tranches completed in required order.
- No unresolved blocking findings remain.
- All non-blocking suggestions either implemented or explicitly rejected with rationale.
- Every tranche’s post-fix quality gates pass cleanly.
- Final report includes per-reviewer sections and overall residual-risk statement.

## Risks and Mitigations

- Review fatigue across large diff (`158` files): enforce tranche isolation and gate discipline to prevent drift.
- Generated artefact noise hiding root causes: focus review on generator sources first, then validate generated outputs.
- Cross-cutting regressions after later fixes: final Barney pass plus clean full gates before completion.
