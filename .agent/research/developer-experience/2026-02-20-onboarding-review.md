# Developer Onboarding Experience Review

> **Historical snapshot (20 February 2026).** Some findings have since been
> resolved (e.g. the `renderKnowledgeGraph` widget crash was fixed as part of
> the ontology knowledge graph tidy-up). Do not treat this document as
> current-state truth. A fresh review pass should be scheduled to replace
> this snapshot.

Date: 20 February 2026
Reviewer: Codex (GPT-5)
Scope: Follow new developer onboarding from root `README.md`, validate the flow end-to-end, and assess accuracy/helpfulness/completeness.

## Executive Summary

Onboarding documentation quality is now materially better after doc updates made during this review, but the full quality gate (`pnpm qg`) is still not a reliable first-time success path due to two confirmed red suites.

### Current assessment

- Accuracy: 4/5 (improved)
- Helpfulness: 4/5 (improved)
- Completeness: 4/5 (improved)

## What I reviewed

- `README.md`
- `docs/development/onboarding.md`
- `docs/README.md`
- `CONTRIBUTING.md`
- `apps/oak-search-cli/README.md`
- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `apps/oak-curriculum-mcp-stdio/README.md`

## Documentation Improvements Applied During Review

These are documentation-only changes (no code changes):

1. Root onboarding flow clarified in `README.md`

- Added a no-credentials verification stage before env setup: `pnpm test`, `pnpm type-check`, `pnpm lint:fix` (`README.md:76`).
- Made env setup conditional on task needs (`README.md:86`).
- Clarified `pnpm make` as first full pipeline and `pnpm qg` as slower full gate with caveats (`README.md:112`).
- Updated command list to use `pnpm lint:fix` consistently (`README.md:147`).

2. Canonical onboarding guide improved in `docs/development/onboarding.md`

- Reworked early command sequence to install/verify/regenerate in developer-safe order (`docs/development/onboarding.md:53`).
- Moved `pnpm qg` to “when ready” section (`docs/development/onboarding.md:65`).
- Added a dated “Known Gate Caveats” section listing current known failing suites (`docs/development/onboarding.md:75`).

3. Broken docs link fixed in `docs/README.md`

- Corrected Knowledge Graph target to existing file (`docs/README.md:28`).

## Remaining Findings (Prioritized)

### P0: `qg` remains red due confirmed suite failures

#### P0.1 Search CLI e2e failures are environment-file dependent

Confirmed failing suite:

- `apps/oak-search-cli/e2e-tests/bulk-retry-cli.e2e.test.ts`

Root cause:

- `ingest-live.ts` requires `initEnv()` before arg parsing/help handling (`apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-live.ts:192`).
- `initEnv()` fails unless `.env.local` or `.env` file is present (`apps/oak-search-cli/src/lib/elasticsearch/setup/load-app-env.ts:43`), even if required vars are already provided in process env by the test.

Reproduction:

- In clean clone with `.env.local` removed: all 6 tests in `bulk-retry-cli.e2e.test.ts` failed with `Environment not loaded`.
- Restoring `.env.local`: same suite passed (6/6).

Impact:

- First-time contributors can see false-negative e2e failures despite valid injected env vars.

#### P0.2 Streamable HTTP widget UI failures have a single runtime crash

Confirmed failing suite:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (19 failures observed in clean run artifacts)

Root cause:

- Widget script references `renderKnowledgeGraph` in dispatcher (`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts:72`).
- No `renderKnowledgeGraph` function is included in embedded renderer bundle (`apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/index.ts:43`).
- Playwright traces show page-level runtime error on load: `ReferenceError: renderKnowledgeGraph is not defined`.

Evidence:

- Trace files under `/tmp/oak-onboarding-t5fls0/apps/oak-curriculum-mcp-streamable-http/test-results/widget-rendering-*/trace.zip`
- Extracted `pageError` events consistently show the same `ReferenceError`.

Impact:

- Widget script fails before content rendering, causing broad UI expectation failures across renderer scenarios.

### P1: Full-gate prerequisites are better documented but still operationally heavy

The updated docs now correctly frame `pnpm qg` as a “when ready” gate, but contributors still need awareness that full gates span UI/E2E/smoke and may require service/config prerequisites not needed for core unit/type/lint flow.

## Comparison to `ontology-knowledge-graph-tidy-up.md`

Compared against `.agent/plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md`:

- The plan diagnosis matches observed evidence exactly.
- Plan calls out dangling `knowledgeGraph: renderKnowledgeGraph` in `widget-script.ts` (`.agent/plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md:14`).
- Current code still contains that line (`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts:72`).
- Playwright traces confirm runtime `ReferenceError` and global render failure.
- The plan’s “registry cleanup” item also matches current state.
- Plan says remove `'knowledgeGraph'` from `RENDERER_IDS` (`.agent/plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md:18`).
- Current code still includes it (`apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts:29`).
- The plan states `widget-renderers/index.ts` should not change and already has no knowledge-graph renderer (`.agent/plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md:123`).
- This matches current code (`apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/index.ts:43`).

Conclusion:

- The onboarding failure analysis and the active tidy-up plan are consistent.
- The plan is a direct code-level remediation path for the `test:ui` onboarding caveat documented in this review.

## Accuracy, Helpfulness, Completeness Review

### Accuracy

High for architecture and now improved for practical onboarding order. Remaining accuracy gap is not docs wording, but known red suites in required full gates.

### Helpfulness

Improved significantly with explicit no-credential checks, conditional env setup, and caveat callouts. New contributors can now separate local setup validation from higher-cost gate failures.

### Completeness

Now strong for first-pass contribution flow. Remaining completeness gap is ownership/issue linkage for known red suites and expected timeline to green.

## Evidence Log

Validation commands run:

- `pnpm exec markdownlint README.md docs/development/onboarding.md docs/README.md` (passed)
- `pnpm --filter @oaknational/search-cli exec vitest run --config vitest.e2e.config.ts e2e-tests/bulk-retry-cli.e2e.test.ts --reporter=verbose`
  - Passes with `.env.local`
  - Fails without `.env.local` (`Environment not loaded`)
- Trace inspection of widget failures:
  - `unzip -p .../trace.zip 0-trace.trace | rg pageError`
  - Repeated `ReferenceError: renderKnowledgeGraph is not defined`

## Recommendations

1. Keep onboarding docs as updated in this review (already applied).

2. Prioritize code fixes for:

- Search CLI env bootstrap behavior for `--help`/arg-validation e2e path.
- Widget renderer dispatcher/runtime consistency (`knowledgeGraph` reference).

3. Once fixed, remove or update “Known Gate Caveats” in `docs/development/onboarding.md` with exact date and issue references.

## Final Judgement

The onboarding experience is now good for initial contributor productivity and expectation-setting. The main blocker to a fully reliable first-run experience is no longer documentation clarity; it is two concrete, reproducible quality-gate code issues.
