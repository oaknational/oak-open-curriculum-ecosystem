# Phase 0 Current Main Ledger

**Captured**: 2026-05-06  
**Project**: `oaknational_oak-open-curriculum-ecosystem`  
**Branch**: `main` at `4864cbb4`

## Quality Gate

Source: `main-quality-gate.json`.

| Condition | Actual | Threshold | Status |
|---|---:|---:|---|
| `reliability_rating` | 4 | 3 | ERROR |
| `security_rating` | 1 | 1 | OK |
| `new_duplicated_lines_density` | 6.5 | 3 | ERROR |
| `new_security_hotspots_reviewed` | 61.1 | 100 | ERROR |
| `new_violations` | 30 | 0 | ERROR |
| `security_hotspots_reviewed` | 7.1 | 100 | ERROR |

## Condition Closure Map

| Condition | Evidence source | Closure owner surface |
|---|---|---|
| `reliability_rating` | Open Critical `typescript:S2871` issues | Comparator fixes in authored source/tests and generator source. |
| `new_violations` | Sonar issue export plus branch analysis after push | Current issue ledger; no rule-wide suppressions. |
| `new_security_hotspots_reviewed` | TO_REVIEW hotspot export | Per-hotspot `FIXED` or `SAFE`; `ACKNOWLEDGED` only with owner approval. |
| `security_hotspots_reviewed` | TO_REVIEW hotspot export | Same as above, across all current main hotspots. |
| `new_duplicated_lines_density` | Sonar duplication query | New-code duplication cleanup after PR/branch analysis identifies blockers. |

## Critical Issues

Source: `main-critical-issues-page-1.json`.

| Rule | Open count | First disposition |
|---|---:|---|
| `typescript:S2871` | 56 | Add explicit comparators by current call-site semantics. |
| `typescript:S3735` | 50 | Replace `void` operator uses with explicit promise handling or calls. |
| `typescript:S3776` | 8 | Extract behaviour-preserving helpers at source/generator level. |
| `typescript:S2004` | 4 | Flatten helper nesting with named functions. |

Open Critical total: 118. The export contains 142 Critical records including
non-open statuses; only OPEN records are implementation targets.

## Workspace Split

| Workspace / area | Open Critical count |
|---|---:|
| `packages/sdks` | 68 |
| `apps/oak-curriculum-mcp-streamable-http` | 16 |
| `apps/oak-search-cli` | 12 |
| `packages/libs` | 9 |
| `packages/core` | 7 |
| `agent-tools` | 6 |

## Hotspots

Source: `main-hotspots-to-review.json`.

Current TO_REVIEW hotspots: 143. Security hotspot work is in scope because both
`new_security_hotspots_reviewed` and `security_hotspots_reviewed` fail the
Quality Gate. Each disposition requires a site-specific Sonar comment.

## Duplication

Source: Sonar MCP `search_duplicated_files` on 2026-05-06.

Overall duplicated-lines density is 13.5 with 33,394 duplicated lines. The
new-code Quality Gate fails at 6.5 against a threshold of 3. Phase 3 must reduce
the blocking new-code duplication structurally after Phase 0 identifies the
branch/PR-scoped duplicate files.

## Local Inventories

- `rg-sort-and-tosorted-inventory.txt`
- `rg-void-token-inventory.txt`

These are closure evidence only. The permanent prevention surface is the
targeted `sonarjs` rule activation in `@oaknational/oak-eslint`.

## Superseded Old-Branch Work Check

- The legacy OAuth smoke-test cleanup from `fix/sonar_high_priority_issues` is
  not replayed.
- The generated `unitOrder` schema patch from the old branch is not replayed.
- The old branch remains prior research; implementation proceeds from current
  `main` files only.

## Phase 1 Slice Evidence: Targeted SonarJS Detectors

**Status**: implemented locally, package verification blocked by an existing
dependency-resolution issue before this slice's config can load.

- Activated only the four SonarJS rules named by this rebuild plan in
  `@oaknational/eslint-plugin-standards`: `sonarjs/cognitive-complexity`,
  `sonarjs/no-alphabetical-sort`, `sonarjs/no-nested-functions`, and
  `sonarjs/void-use`.
- Kept `sonarjs.configs.recommended` out of scope. The config comment now
  preserves the future full-preset activation as a separate GREEN-phase plan.
- Added a strict-config regression test asserting the four targeted rule
  settings so this branch does not silently activate a larger SonarJS surface.

Verification:

| Command | Result |
|---|---|
| `pnpm --filter @oaknational/eslint-plugin-standards exec vitest run src/configs/strict.unit.test.ts` | Blocked before tests load by existing missing `@vitest/eslint-plugin`. |
| `pnpm --filter @oaknational/eslint-plugin-standards type-check` | Blocked by existing missing `@vitest/eslint-plugin`. |

## Phase 2 Slice Evidence: `typescript:S2871`

**Status**: implemented locally, pending reviewer disposition and branch Sonar
analysis.

- Rewrote all 56 OPEN `typescript:S2871` call sites from
  `main-critical-issues-page-1.json` with explicit `localeCompare` comparators.
- Local search found additional no-argument sorts outside the Sonar export; they
  were fixed in the same reliability slice rather than left for later drift.
- `rg -n "\\.(sort|toSorted)\\(\\)" agent-tools apps packages --glob '*.ts'`
  now returns only documentation-comment references.
- Reviewer follow-up changed behaviour-bearing sites from `localeCompare` to
  explicit code-unit comparators where an existing contract depends on direct
  `<` / `>` ordering: sitemap teacher paths, generated-code ordering, and
  versioned-index cleanup/listing.
- Reviewer follow-up changed sequence year ordering from alphabetical to
  curriculum-display ordering with `compareCurriculumYears`.

Verification:

| Command | Result |
|---|---|
| `pnpm type-check` | Fails before full closure on existing `@vitest/eslint-plugin` and `@oaknational/observability` module-resolution issues. |
| `pnpm --filter @oaknational/agent-tools type-check` | Pass |
| `pnpm --filter @oaknational/search-cli type-check` | Pass |
| `pnpm --filter @oaknational/sdk-codegen type-check` | Pass |
| `pnpm --filter @oaknational/oak-search-sdk type-check` | Pass |
| `pnpm --filter @oaknational/search-contracts type-check` | Pass |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check` | Pass |
| `pnpm --filter @oaknational/curriculum-sdk type-check` | Pass |
| `pnpm --filter @oaknational/eslint-plugin-standards type-check` | Fails on existing missing `@vitest/eslint-plugin`. |
| `pnpm --filter @oaknational/agent-tools test` | Pass: 21 files, 133 tests. |
| `pnpm --filter @oaknational/sdk-codegen test` | Pass: 88 files, 855 tests. |
| `pnpm --filter @oaknational/oak-search-sdk test` | Pass: 27 files, 277 tests. |
| `pnpm --filter @oaknational/search-contracts test` | Pass: 1 file, 4 tests. |
| `pnpm --filter @oaknational/curriculum-sdk test` | Pass: 53 files, 716 tests. |
| `pnpm --filter @oaknational/search-cli test` | Fails on existing missing `@oaknational/observability`; unaffected suites pass 96 files, 962 tests. |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` | Fails on existing missing `@oaknational/observability`; unaffected suites pass 70 files, 595 tests. |
| `pnpm --filter @oaknational/eslint-plugin-standards test` | Fails on existing missing `@vitest/eslint-plugin`; unaffected suites pass 10 files, 182 tests. |
| Targeted package `lint` commands | Blocked before file analysis by existing missing `@vitest/eslint-plugin` from `packages/core/oak-eslint/dist/index.js`. |

Reviewer dispositions:

| Reviewer | Finding | Disposition |
|---|---|---|
| `architecture-reviewer` | `teacherPaths` must preserve code-unit binary-search ordering. | Fixed with `compareCodeUnits` in sitemap generation. |
| `type-reviewer` | Generated-code ordering and versioned-index cleanup must not use locale collation. | Fixed with local code-unit comparators in generator and admin surfaces. |
| `type-reviewer` | Temporary `delete rest.issuer` rewrite was a TS2790 blocker. | Fixed with typed rest destructuring. |
| `elasticsearch-reviewer` | Sequence years need curriculum display order, not alphabetic order. | Fixed with `compareCurriculumYears` and a unit test. |
| `test-reviewer` | Evidence undercounted extra local comparator repairs. | Ledger corrected to describe additional local repairs rather than one extra site. |

## Phase 2 Slice Evidence: `typescript:S3735`

**Status**: implemented locally, pending reviewer disposition and branch Sonar
analysis.

- Rewrote all 50 OPEN `typescript:S3735` call sites from
  `main-critical-issues-page-1.json`.
- Generated MCP tool files were updated by changing
  `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-schema.ts`
  and running `pnpm sdk-codegen`; generated outputs now keep `flatArgs` and
  validate unexpected keys for zero-argument tools instead of using
  `void flatArgs` or `_flatArgs`.
- The MCP widget source and served generated HTML were kept in sync by running
  `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build:widget`.
- Local targeted check
  `rg -n "void flatArgs|void _schema|void operation|void errorType|void context|void omitted|void req|void res|void issuer|void unitSummarySchema|void lessonSummarySchema|void app\\.openLink|=> void acc\\." apps packages agent-tools --glob '*.ts' --glob '*.tsx'`
  returns no matches.
- Additional targeted check
  `rg -n "_flatArgs|transformFlatToNestedArgs\\(_|void flatArgs" packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-schema.ts`
  returns no matches.

Verification:

| Command | Result |
|---|---|
| `pnpm sdk-codegen` | Generator ran and updated generated SDK files; root turbo command exits red because existing `@vitest/eslint-plugin` and `@oaknational/observability` build blockers fire in sibling packages. |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build:widget` | Pass |
| `pnpm --filter @oaknational/search-cli type-check` | Pass |
| `pnpm --filter @oaknational/sdk-codegen type-check` | Pass |
| `pnpm --filter @oaknational/oak-search-sdk type-check` | Pass |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check` | Pass |
| `pnpm --filter @oaknational/logger type-check` | Pass |
| `pnpm --filter @oaknational/observability type-check` | Pass |
| `pnpm --filter @oaknational/curriculum-sdk type-check` | Pass |
| `pnpm --filter @oaknational/search-contracts type-check` | Pass |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:widget` | Pass: 3 files, 17 tests. |
| `pnpm --filter @oaknational/search-cli exec vitest run src/adapters/bulk-sequence-transformer.unit.test.ts src/lib/indexing/sequence-facets.unit.test.ts src/lib/indexing/year-ordering.unit.test.ts` | Pass: 3 files, 29 tests. |
| `pnpm --filter @oaknational/sdk-codegen exec vitest run code-generation/typegen/mcp-tools/parts/emit-schema.header.unit.test.ts code-generation/typegen/mcp-tools/parts/emitters.unit.test.ts code-generation/typegen/search/generate-search-modules.unit.test.ts code-generation/typegen/search/generate-es-mappings.unit.test.ts code-generation/typegen/admin/generate-admin-fixtures.unit.test.ts code-generation/typegen/observability/generate-zero-hit-fixtures.unit.test.ts` | Pass: 6 files, 55 tests. |
| `pnpm --filter @oaknational/sdk-codegen test` | Pass: 88 files, 855 tests. |
| `pnpm --filter @oaknational/oak-search-sdk test` | Pass: 27 files, 277 tests. |
| `pnpm --filter @oaknational/logger test` | Pass: 13 files, 139 tests. |
| `pnpm --filter @oaknational/observability test` | Pass: 6 files, 63 tests. |
| `pnpm --filter @oaknational/curriculum-sdk test` | Pass: 53 files, 716 tests. |
| `pnpm --filter @oaknational/search-contracts test` | Pass: 1 file, 4 tests. |
| `pnpm --filter @oaknational/search-cli test` | Fails on existing missing `@oaknational/observability`; unaffected suites pass 97 files, 964 tests. |
| `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` | Fails on existing missing `@oaknational/observability`; unaffected suites pass 70 files, 595 tests. |
| `git diff --check` | Pass |

Reviewer dispositions:

| Reviewer | Finding | Disposition |
|---|---|---|
| `code-reviewer` | Widget source changed but served generated widget HTML was stale. | Fixed by rebuilding and embedding widget HTML. |
| `code-reviewer` | One generated-code ordering path still used locale collation. | Fixed with `compareCodeUnits` in `typegen-extraction.ts`. |
| `test-reviewer` | Add widget rejection coverage for `app.openLink`. | Fixed with `openHostLink` unit coverage and `test:widget`. |
| `test-reviewer` | Add year-ordering coverage through sequence extraction and document creation. | Fixed with bulk sequence/facet tests and `createSequenceFacetDoc` ordering coverage. |
| `test-reviewer` | Add generator regression proving no `void flatArgs`. | Fixed in `emit-schema.header.unit.test.ts`. |
| `type-reviewer` | Avoid `as Assert` in logger contract checks. | Fixed with exported annotated constants. |
| `type-reviewer` | Avoid broad underscore unused bindings introduced by S3735 rewrites. | Fixed with assertions, structural guards, schema input validation, and explicit fake observability context. |

## Phase 3 Slice Evidence: `typescript:S3776` / `typescript:S2004`

**Status**: implemented locally for current Sonar Critical findings, pending
fresh reviewer pass and branch Sonar analysis.

- Refactored current S3776/S2004 findings with local helper extraction rather
  than suppressions.
- Generator/source changes were made before regenerating generated SDK output.
- `emit-schema` complexity was reduced alongside the S3735 generator fix so
  zero-argument tools now have a behaviour-bearing empty-argument guard.

Verification:

| Command | Result |
|---|---|
| `pnpm --filter @oaknational/sdk-codegen exec vitest run code-generation/typegen/response-map/build-response-map.integration.test.ts code-generation/zodgen-core.unit.test.ts code-generation/zodgen-core.integration.test.ts src/bulk/generators/synonym-miner.unit.test.ts src/bulk/generators/synonym-miner.integration.test.ts src/bulk/generators/analysis-report-generator.unit.test.ts` | Pass: 6 files, 37 tests. |
| `pnpm --filter @oaknational/search-cli exec vitest run ground-truths/generation/bulk-data-parser.unit.test.ts src/lib/indexing/sandbox-fixture.unit.test.ts` | Pass: 1 file, 16 tests; `sandbox-fixture.unit.test.ts` does not exist in the current tree. |
