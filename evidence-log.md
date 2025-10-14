# General Snagging

## 2025-10-12

### Baseline Quality Gates

- `pnpm clean`
  - Summary: Turbo ran `clean` across 10 packages with cache bypass, deleting `dist`, `.turbo`, and generated artefacts. No errors reported.
- `pnpm type-gen`
  - Outcome: Failed while running `@oaknational/oak-curriculum-sdk` generator.
  - Error: `ReferenceError: parsedEnumValues is not defined` thrown in `type-gen/typegen/mcp-tools/mcp-tool-generator.ts` during `extractParamMetadata`.
  - Artefact hashes: Not captured (generation aborted before emitting `src/types/generated/**` or `src/mcp/**`).
  - Immediate risks: Type generation currently broken due to undefined `parsedEnumValues`; blocks all downstream quality gates until generator is repaired.
- `pnpm build`
  - Outcome: Multiple package builds failed (`@oaknational/oak-curriculum-sdk`, `@oaknational/oak-curriculum-mcp-stdio`, `@oaknational/oak-curriculum-mcp-streamable-http`, `@oaknational/open-curriculum-semantic-search`).
  - Error theme: Module resolution errors (`Module not found: Can't resolve './src/types/generated/api-schema/mcp-tools/index'`) caused by missing generated artefacts after the failed `type-gen` step.
  - Impact: Confirms downstream packages are tightly coupled to generated literals; we must unblock type generation before any consumer builds will succeed.
- `pnpm type-check`
  - Outcome: Failing across multiple packages due to missing generated artefacts and widened `unknown` types.
  - Key findings:
    - `@oaknational/oak-curriculum-sdk`: 38 errors across generator and runtime layers. Missing `src/types/generated/**` imports, obsolete `.js` import targets, unused imports, references to `zodOutputSchema`, generator tests expecting builders, and literal construction bugs (`parsedEnumValues` undefined, response-map casts). Owner: `type-gen/typegen/mcp-tools/**`, `type-gen/typegen/response-map/**`, `src/mcp/**`, `src/types/**`, `src/validation/**`.
    - `@oaknational/oak-curriculum-mcp-stdio`: 8 errors where tool descriptors are `unknown` within `src/app/server.ts`; owner: runtime consumers awaiting literal descriptors.
    - `@oaknational/open-curriculum-semantic-search`: 18 implicit-`any` lint-type errors in indexing helpers due to absent generated literal typings; owner: app runtime expecting SDK literals.
  - Blockers: Typegen regression cascades into runtime packages; we must restore literal outputs and tighten types to eliminate `unknown` leakage.
  - Log: `logs/type-check-2025-10-12.txt` captures full cross-package failures for traceability.
- `pnpm lint`
  - Outcome: Failing across all major packages, surfacing 258 lint errors tied to absent generated types and `any` leakage.
  - `@oaknational/oak-curriculum-sdk`: 145 issues including unresolved imports to generated literals, numerous `error` typed values, prohibited `Record<string, unknown>`, unused imports, and assertions inside generators. Root cause remains the generator regression plus runtime reliance on non-literal maps.
  - `@oaknational/open-curriculum-semantic-search`: 113 issues focused on unsafe `any` assignments/returns in indexing modules and API routes, again because generated schema typings are missing.
  - Additional packages fail due to cascade; lint confirms the scope of remediation needed once literal artefacts exist.
- `pnpm test`
  - Outcome: Wide failure across SDK and semantic-search suites (25 failing files, 14 failing assertions before abort).
  - Common failure: Vite cannot resolve `./types/generated/api-schema/mcp-tools/index.js` from the SDK bundle, halting most integration suites (`SearchPageClient`, API routes, fixtures).
  - Additional regression: `search-index-target.unit.test.ts` expectation mismatch caused by environment-derived literals not switching to sandbox without generated constants.
  - Upstream mocks (`tests/mocks/oak-curriculum-sdk.ts`) cannot initialise due to missing actual SDK exports; generator repair is prerequisite for meaningful test execution.
- `pnpm --filter @oaknational/oak-curriculum-sdk lint`
  - Outcome: 145 lint errors reproduced in isolation; highlights unresolved imports, unsafe `error` typed flows, and prohibited `Record<string, unknown>` usage rooted in missing literal artefacts.
  - Ownership: Generator emitters (`type-gen/typegen/mcp-tools/**`, `type-gen/typegen/response-map/**`, `type-gen/zodgen-core.ts`), runtime consumers (`src/mcp/**`, `src/validation/**`), and configuration (`src/config/index.ts`).
- `pnpm --filter @oaknational/oak-curriculum-sdk test`
  - Outcome: 12 failing files / 6 failed assertions.
  - Key failures:
    - Generator unit tests (`emit-error-description`, `emitters`, `generate-tool-file`) still expect runtime builders instead of literal emitters.
    - `build-response-map.unit.test.ts` throws `Missing component schema` due to literal path expecting resolved components that are absent in fixtures.
    - Runtime suites (`src/index`, `src/mcp/execute-tool-call`, `src/validation/**`) fail because generated literal files (`curriculumZodSchemas`, `mcp-tools/index.js`) were not emitted.
  - Action: Restore literal generation and update tests to assert literal structures, removing legacy builder expectations.
- Quality gate summary
  - All baseline gates fail, each citing missing generated literals or `unknown` types as root cause.
  - Priority action is restoring literal generation (Phase 1 tasks) to unblock downstream build, lint, type-check, and test suites.
- Baseline synthesis
  - Type generation failure is the primary blocker; it propagates to build and type-check, leaving `src/app/server.ts` and indexing helpers without the literal types they expect.
  - Immediate remediation focus: fix `parsedEnumValues` bug, regenerate literal artefacts, then update generators to eliminate runtime builders/`unknown`s per plan.

## 2025-10-13

### Phase 4 – Regenerate & Inspect

- `pnpm type-gen`
  - Outcome: Success after fixing enum metadata handling in `extractParamMetadata`. All generators completed with literal outputs.
  - Hashes:
    - `src/types/generated/api-schema/api-paths-types.ts`: `9bbdee899e289e21e82e684ba3d4e7062b4f47549f3b3f224a961b0422d030ba`
    - `src/types/generated/api-schema/api-schema-base.ts`: `cd281418deef874202d6c86ba1ed88175bd3a984db59325a845edcf48aa9ce64`
    - `src/types/generated/api-schema/api-schema-original.json`: `a67cd379254227245982f191beb5e1a36012c842431fcf8b2fe48ea1b98d3daa`
    - `src/types/generated/api-schema/api-schema-sdk.json`: `1cc041bc845c426b719bba17d5f0bc1eade82379b5e35c37489e0325e40bdc91`
    - `src/types/generated/api-schema/path-parameters.ts`: `8016f6eac3e92511c69cdb504850c70957a4b3482c02279bc525f8afdaa5c724`
    - `src/types/generated/api-schema/path-utils.ts`: `2b83b627cbb8cead4ce8f7d0276d249a7788224bd706a9cd8910c95a0ba642bd`
    - `src/types/generated/api-schema/response-map.ts`: `68e3573107b5dd65cc7cc6d4057e452d602e0f6b49247fe67b88c994b3c07d43`
    - `src/types/generated/api-schema/routing/url-helpers.ts`: `220b2eb38e61956d9c9e0a3d967c17bc31b097ba7f8973266cbe7e6a118a46c8`
    - `src/types/generated/zod/search/index.ts`: `50da23f2f6c10f35f97a568ddddb1b385614d2a7bda93887a64212e03f7a1298`
    - `src/types/generated/zod/search/output/index.ts`: `79d13a09387083ee068362fde4efe84a3be84ce16a3384cda585a10c61971621`
    - `src/types/generated/zod/search/output/sequence-facets.ts`: `3671e31a3d9c64deb56b979c91250e3288e70217defe126b6c66be17af060e6e`
    - `src/mcp/execute-tool-call.ts`: `59dce475b74b4f46e7e896d56be026c4baf64514f96e9c71fe97e0ad97de225c`
    - `src/mcp/execute-tool-call.unit.test.ts`: `dc7d987ecfffd04546b31f779e1e7ebce7e7441c3bd19c574337cc14ee42f86e`
    - `src/mcp/universal-tools.ts`: `5fb059dec275535712876cac98f9ab90bc48acd20d7b57a50200331c652d123e`
    - `src/mcp/universal-tools.unit.test.ts`: `d84e75ed0e1cbc0c6d2235e3f3112baae25c0473476992f4e617232f9188d495`
    - `src/mcp/zod-input-schema.ts`: `c30f4698ed684f998ce65530dfc0e4481eb55dd03f30865513f133b99053a3b6`
  - Follow-up evidence (Step 8):
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/get-changelog.ts`
      - SHA256 `f88515f7d2befe0f214b90b3d95d8976c2f9f1424379d0b4f8d7ceddf73cd10c`
      - Notes: zero-parameter tool retains optional `params?`, descriptor literal unchanged.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
      - SHA256 `156c41bfb07749b2c47b25722379eb2aafcc8e22dbe9e7999b41f906681454c7`
      - Notes: path + query metadata emitted with enum unions; Zod schema mirrors optional query block.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
      - SHA256 `9297e338358d61c67d7851c349293227050d38174e3a86cacf892326ca7997b9`
      - Notes: path-only interface emitted; validation enforces string slug literal.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/index.ts`
      - SHA256 `1a0c9be57b9e4dd436902bcf9f546eb90ac45236f54acf2f2355be9d33536470`
      - Notes: now a barrel re-export of `definitions.js` literals and derived types.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/types.ts`
      - SHA256 `4a7c5658618d9e3f1da1fc95fc0b133635ebb64bb8153178231ec964a54dfaa1`
      - Notes: imports `MCP_TOOLS` from `definitions`, retains literal tool name array.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/definitions.ts`
      - SHA256 `f07ddf2c76b27f56b84921f8aac885ad6a17a43ce5e6236a9f65445563fd22aa`
      - Notes: canonical literal map and `TOOL_NAMES` array.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/lib.ts`
      - SHA256 `cf7a9816c6ef6c536ef018e3887f23fb2fe86cbe5570626bbdff03f92d1d3896`
      - Notes: imports descriptors from `definitions.js`, iterates newline splits safely.
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/get-search-lessons.ts`
      - SHA256 `c32e035d677d9894b748e60d5e8a52aa034ad00cf3eb89be0e63ad656ff1dfa7`
      - Notes: complex query params with literals (arrays/enums); JSON schema and Zod stay literal.
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/*.unit.test.ts`
  - Outcome: All MCP generator suites green after enum metadata fix.
  - Notable logs: Synonym config warnings expected (indicates unused config keys).

### Phase 1 – Generator Integrity (MCP literals)

- `pnpm type-gen`
  - Outcome: Succeeded after emitter refinements; regenerated literal artefacts emitted `.js` imports for definitions and `.ts` response-map references.
  - Artefact hashes:
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/types.ts` `b705e280a1e8ffe1893fea7ee0398b492aefc01496e281fd99efd8d633f98e87`
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/definitions.ts` `d9a0f979f2b423198ad165ff0abee2958b25410fb5c0c5709d7772d0ecb0b4dc`
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/lib.ts` `b2f96a513afcd2ef7041300256f8f2fc3605efdf6befdfcb99c110916355e712`
    - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/index.ts` `579b4011ee991e38ef6e40d1d5b8b07fe86027832caad13bdc56e506219a021d`
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/*.unit.test.ts`
  - Outcome: Passed (2 tests). Warning about unused synonym config keys persists (tracked separately); no regressions in descriptor threading checks.
  - Notes: Fixture expectations updated to the `.js` import path.
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.unit.test.ts`
  - Outcome: Passed (2 tests). Confirms `generate-index` emitter now omits legacy `outputSchema` field and imports `ToolDescriptor` from canonical definitions.
  - Artefact hashes: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts` `5230a116e1b6e80a8b64c7e5b56a0efbbd8c4a0bc87451a08a6a43ab3b972483`.
  - Risks: Synonym config warnings persist; tracked for later deduping but non-blocking.
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.invoke.unit.test.ts`
  - Outcome: Passed (1 test) after updating expectations to the literal descriptor shape.
  - Notes: Verifies generated invoke wrapper ties to `ToolDescriptor` literal and excludes removed `outputSchema` field.
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/*.unit.test.ts`
  - Outcome: Passed (2 tests across suite). Confirms all MCP generator emitters green after descriptor refactor.
  - Artefact hashes: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-file.ts` `4f3ffa96a2e6cafb16f24451e438d8676848d67cf985234516eec5e243249133`.

### Phase 2 – SDK Runtime Alignment

- Runtime audit: Checked `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts` and `src/mcp/universal-tools.ts`; both consume `MCP_TOOLS` literals directly (no casts, no dynamic builders). Execution validation uses generated Zod schemas and descriptor metadata exclusively.
- `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/*.unit.test.ts`
  - Outcome: Passed (13 tests across `execute-tool-call` and `universal-tools`). Confirms literal descriptors and validator wiring hold under unit coverage.

### Phase 5 – Quality Gates (2025-10-13)

- `pnpm type-check` (rerun after emitter/lib fixes)
  - Outcome: **Failed**. Remaining errors fall into three groups:
    - Generated `mcp-tools/lib.ts` still mis-emits `message.split('\n')`, leaving unterminated string literals. Need to adjust `generate-lib-file.ts` emission to keep newline escapes intact.
    - `apps/oak-curriculum-mcp-stdio/src/app/server.ts` treats entries from `Object.entries(MCP_TOOLS)` as `unknown`; must iterate using literal `toolEntries` or otherwise preserve `ToolDescriptor` typing.
    - Semantic-search indexing helpers (`document-transforms.ts`, `lesson-planning-snippets.ts`, `index-bulk-helpers.ts`, `sequence-facets.ts`) retain implicit `any` parameters; update to consume generated SDK types.
  - Action: fix generator newline emission, refactor stdio server to use literal descriptors, thread types into semantic-search helpers, then rerun type-check.

## 2025-10-14

### Phase 1 – Guardrails Before Fixes

- `pnpm build`
  - Outcome: Failed. Next.js emitted `Module not found: Can't resolve './packages/sdks/oak-curriculum-sdk/src/types/generated/search/fixtures.ts'` and similar errors because generated search barrels still reference `.ts` specifiers.
  - Evidence: Turbo logs captured cascading `module-not-found` stack frames for every search export consumer.

- `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index.unit.test.ts`
  - Outcome: First run **failed**, proving the new guard detects `.ts` specifiers in the generated index.
  - Follow-up: After updating `generate-search-index.ts` to emit `.js` imports and running `pnpm type-gen`, the test now passes (green), confirming the generator fix.

- `pnpm type-gen`
  - Outcome: Successful regeneration. Search barrel and downstream generated files now emit `.js` specifiers, aligning with ESM expectations.

## Code

The apps/oak-open-curriculum-semantic-search/app/ui directory is full of lone components without organisation. What is the principle here? Please pick an organisational principle and apply it, consistently.

- 2025-10-31: Schema ingress Phase 1A complete – guard/constructor wired into `typegen.ts`, `pnpm type-gen` run captured with new artefact outputs.
- 2025-10-13: `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen-core.test.ts` — verifies `writeMcpToolsDirectory` writes every artefact (`definitions.ts`, barrel, tools) after refactor.
- 2025-10-13: `pnpm type-gen` — canonical MCP definitions now emitted to `src/types/generated/api-schema/mcp-tools/definitions.ts` (`sha256=249ef7b082841518944955f096eee63adee675d9a899c984087d8dbb65da51ab`).
- 2025-10-13: `pnpm vitest run packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-lib-file.unit.test.ts` — new generator tests for `generateLibFile` verifying literal imports and guards (2 passed).
- 2025-10-13: `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/*.unit.test.ts` — initial run surfaced output validation mismatch in `execute-tool-call`, prompting literal descriptor wiring updates (5 failing cases recorded).
- 2025-10-13: `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/*.unit.test.ts` — runtime suites now green after refactoring `execute-tool-call`/`universal-tools` to consume generated literals with new mocks (13 passed).
- 2025-10-13: Audited `src/index.ts`, `src/validation/**`, and MCP runtime exports: confirmed modules now import literal helpers directly, no ad-hoc maps remain.
- 2025-10-13: `pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/*.unit.test.ts` — verification run post-audit kept suites green (13 passed).
