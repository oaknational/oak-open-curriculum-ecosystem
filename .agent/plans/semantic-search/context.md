# Semantic Search Recovery – Companion Notes

> **Primary plan:** `.agent/plans/semantic-search/snagging-resolution-plan.md`. Keep that file focused; record supporting detail here so context survives across sessions without bloating the plan.

## Status At A Glance (2025-10-23)

- **Type generation:** ✅ – semantic search types now flow from the SDK. Manual definitions removed.
- **Sanitisation helpers:** ✅ – all indexing modules, fixtures, and the rebuild-rollup route now normalise via `document-transform-helpers` / support utilities.
- **Quality gates:** `pnpm build` ✅, workspace lint ✅. Repository-wide `pnpm lint` still red because `apps/oak-curriculum-mcp-stdio` and `packages/sdks/oak-curriculum-sdk` carry existing violations.
- **Tests:** Full semantic-search Vitest suite now passes after aligning env handling with sandbox expectations.

## Helper Adoption Matrix

| Area / file                                             | Status      | Notes / required follow-up                                                                        |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `document-transforms.ts`                                | ✅ complete | Uses helpers + treats summary fields as `unknown`. Keep under 250 lines.                          |
| `index-bulk-helpers.ts`                                 | ✅ complete | Migrated to helper-driven normalisation; new `index-bulk-support.ts` keeps helper logic isolated. |
| `sequence-facets.ts` & `sequence-facet-index.ts`        | ✅ complete | Introduced `sequence-facet-utils.ts` to safely traverse sequence payloads.                        |
| API route `app/api/rebuild-rollup/route.ts`             | ✅ complete | Accepts helper-normalised summaries and transcripts.                                              |
| Fixture client `sandbox-fixture.ts`                     | ✅ complete | Returns helper-parsed results with array coercion to `unknown[]`.                                 |
| Unit tests (document transforms, lesson planning, etc.) | ✅ complete | Builders now rely on schema validation; new helper-focused tests assert sanitised behaviour.      |

Legend: ✅ complete · ⚠️ in progress · ❌ not started

## Command Log (2025-10-22)

| Command                                                                                                                                                                                                                                | Result | Notes                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build`                                                                                                                                                                                                                           | ✅     | Full workspace build succeeded post-sanitisation rollout.                                                                                                                                                                   |
| `pnpm --filter @oaknational/open-curriculum-semantic-search lint`                                                                                                                                                                      | ✅     | No remaining lint violations inside the semantic search app.                                                                                                                                                                |
| `pnpm --filter @oaknational/open-curriculum-semantic-search test -- src/lib/indexing/document-transform-helpers.unit.test.ts src/lib/indexing/document-transforms.unit.test.ts src/lib/indexing/lesson-planning-snippets.unit.test.ts` | ❌     | Only failing assertion in `src/lib/search-index-target.unit.test.ts`: expected `oak_sequences_sandbox`, received `oak_sequences`. Behaviour needs revisiting before running the full suite.                                 |
| `pnpm --filter @oaknational/open-curriculum-semantic-search test -- src/lib/env.unit.test.ts`                                                                                                                                          | ✅     | Vitest executed the full workspace suite and passed once the env helpers were simplified for the static Next.js/Vercel deployment model.                                                                                    |
| `pnpm type-gen`                                                                                                                                                                                                                        | ✅     | Regenerated artefacts without diffs beyond transient formatting; all generators completed.                                                                                                                                  |
| `pnpm build` (2025-10-23)                                                                                                                                                                                                              | ✅     | Full workspace build remains green post-env simplification.                                                                                                                                                                 |
| `pnpm type-check`                                                                                                                                                                                                                      | ❌     | Fails on `packages/sdks/oak-curriculum-sdk/type-gen/typegen/response-map/build-response-map.ts` due to `ReferenceObject` handling (Step 3 target).                                                                          |
| `pnpm lint`                                                                                                                                                                                                                            | ❌     | Known historic violations: `apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts` and `packages/sdks/oak-curriculum-sdk/type-gen/zodgen.ts`.                                                                             |
| `pnpm test`                                                                                                                                                                                                                            | ❌     | Failures confined to generator alignment in `@oaknational/oak-curriculum-sdk` and outdated MCP stdio tool expectations; semantic-search suite passes.                                                                       |
| `pnpm test:ui`                                                                                                                                                                                                                         | ❌     | Playwright visual regressions (17 failures) pending fixture refresh; unchanged from prior runs.                                                                                                                             |
| `pnpm test:e2e`                                                                                                                                                                                                                        | ❌     | `@oaknational/oak-curriculum-sdk` flags forbidden `as T` assertions; `@oaknational/oak-curriculum-mcp-stdio` cannot resolve generated request validator types (`dist/validation/types`).                                    |
| `pnpm dev:smoke`                                                                                                                                                                                                                       | ❌     | Script not defined in workspace; command exits with `Command "dev:smoke" not found`.                                                                                                                                        |
| `pnpm lint`                                                                                                                                                                                                                            | ❌     | External failures: `apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts` (always-true condition) and `packages/sdks/oak-curriculum-sdk/type-gen/zodgen.ts` (stringification / `any` assertion). Coordinate with owners. |

## Testing Expectations

- Helper/unit tests now cover sanitised behaviour. Sandbox index naming aligns with updated env helpers; continue to guard against regressions while implementing the SDK generator work.

## Next Session Entry Checklist

1. [x] Decide how to resolve the `search-index-target.unit.test.ts` sandbox expectation (update helper or fixture?).
2. Coordinate with SDK/stdio owners on their lint backlogs blocking repo-wide `pnpm lint`.
3. Execute the Step 3 SDK refinements (response-map narrowing, retire `operation-validators.ts`, generate request-validator map) and log the command outcomes above as each sub-step completes.

Keep updates concise—when a checklist item is complete, tick it here and move the summary into the main plan or evidence log. This keeps the companion doc actionable without becoming another plan.
