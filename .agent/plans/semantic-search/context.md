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
| `pnpm test` (2025-10-24)                                                                                                                                                                                                               | ✅     | Full workspace suite green after consolidating the OpenAI connector logic into the universal tool executor and updating the SDK/app tests accordingly.                                                                     |
| `pnpm type-gen` (2025-10-24)                                                                                                                                                                                                           | ✅     | Regenerated SDK artefacts without the legacy OpenAI connector generator; search/fetch aggregators now flow through the universal tool metadata.                                                                            |
| `pnpm type-check` (2025-10-24)                                                                                                                                                                                                         | ❌     | Still blocked by existing cross-workspace issues (SDK dist not built, semantic-search imports unresolved, legacy lint debt). The new universal-tool changes compile locally once the SDK is built.                           |
| `pnpm lint` (2025-10-24)`                                                                                                                                                                                                              | ❌     | Remaining violations: `packages/sdks/oak-curriculum-sdk/src/index.ts` exceeds max-lines; `src/mcp/execute-tool-call.ts` still triggers `no-unnecessary-condition`/type assertion warnings pending refactor. |
| `pnpm type-check` (2025-10-24)`                                                                                                                                                                                                        | ❌     | SDK `execute-tool-call.ts` pending union-safe invocation path; helper refactor still required to eliminate type assertions without breaking TypeScript compatibility.                                       |
| `pnpm type-gen` (2025-10-24)                                                                                                                                                                                                           | ✅     | Regenerated artefacts and emitted the new request-parameter map; SDK `dist/validation` now contains `request-parameter-map.js`.                                                                             |
| `pnpm build` (2025-10-24)                                                                                                                                                                                                              | ✅     | Repo-wide build succeeds; semantic-search app now resolves the generated request-parameter map via the SDK dist bundle.                                                                                     |
| `pnpm type-check` (2025-10-24)                                                                                                                                                                                                         | ✅     | All packages pass after the generator/runtime adjustments.                                                                                                                                                  |
| `pnpm lint` (2025-10-24)                                                                                                                                                                                                               | ❌     | SDK: `src/index.ts` exceeds `max-lines`; `src/mcp/execute-tool-call.ts` triggers `no-unnecessary-condition` and `consistent-type-assertions`. Stdio app still reports the historic `always-true` branch.    |
| `pnpm test:ui`                                                                                                                                                                                                                         | ❌     | Playwright visual regressions (17 failures) pending fixture refresh; unchanged from prior runs.                                                                                                             |
| `pnpm test:e2e`                                                                                                                                                                                                                        | ❌     | `@oaknational/oak-curriculum-sdk` flags forbidden `as T` assertions; `@oaknational/oak-curriculum-mcp-stdio` cannot resolve generated request validator types (`dist/validation/types`).                    |
| `pnpm dev:smoke`                                                                                                                                                                                                                       | ❌     | Script not defined in workspace; command exits with `Command "dev:smoke" not found`.                                                                                                                        |
| `pnpm lint` (2025-10-24)                                                                                                                                                                                                               | ❌     | Remaining blockers: `packages/sdks/oak-curriculum-sdk/src/index.ts` (max-lines) and `src/mcp/execute-tool-call.ts` (needs assertion-free invocation). Legacy stdio/sdk lint debt unchanged.                 |

## Testing Expectations

- Helper/unit tests now cover sanitised behaviour. Sandbox index naming aligns with updated env helpers; continue to guard against regressions while implementing the SDK generator work.

## Next Session Entry Checklist (to carry into fresh chat)

1. [x] Decide how to resolve the `search-index-target.unit.test.ts` sandbox expectation (update helper or fixture?).
2. Coordinate with SDK/stdio owners on their lint backlogs blocking repo-wide `pnpm lint`.
3. Execute the Step 3 SDK refinements (response-map narrowing, retire `operation-validators.ts`, generate request-validator map) and log the command outcomes above as each sub-step completes.
4. Run the full quality gate sequence from the repo root (clean → type-gen → build → type-check → lint → test) and capture the outcomes, now that the generated request-parameter map is included in the SDK dist bundle but lint/tests are still red.

Keep updates concise—when a checklist item is complete, tick it here and move the summary into the main plan or evidence log. This keeps the companion doc actionable without becoming another plan.

### Step 3 Execution Checklist (SDK generator focus)

1. Revert any runtime-side hacks in `build-response-map.ts`, `src/validation/request-validators.ts`, and `src/mcp/execute-tool-call.ts` so they reflect the last generator outputs.
2. Step back and consider if we are following the spirit as well as the letter of `snagging-resolution-plan.md` and the `rules.md`.
3. Extend the type-gen response-map pipeline to dereference `$ref`s via generated helpers, yielding pure `SchemaObject` data with no runtime assertions.
4. Delete `type-gen/typegen/operations/operation-validators.ts`; migrate required guards into the generator flow.
5. Step back and consider if we are following the spirit as well as the letter of `snagging-resolution-plan.md` and the `rules.md`.
6. Emit a generated `(method, colonPath) → zod schema` map (plus types) during type-gen.
7. Consume the generated map in `src/validation/request-validators.ts`, keeping the DAG flow (general types → constants → runtime helpers).
8. Step back and consider if we are following the spirit as well as the letter of `snagging-resolution-plan.md` and the `rules.md`.
9. Run `pnpm type-gen`, inspect artefacts, and ensure runtime modules only import generated code.
10. Update generator/runtime tests to prove the new artefacts, then run the SDK test suite.
11. Step back and consider if we are following the spirit as well as the letter of `snagging-resolution-plan.md` and the `rules.md`.
12. Re-run `pnpm type-check` and `pnpm lint`; record outcomes and follow up on any remaining cross-workspace failures.
