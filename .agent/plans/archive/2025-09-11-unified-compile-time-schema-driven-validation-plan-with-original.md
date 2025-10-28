<!-- markdownlint-disable -->

# Unified Plan: Steps 1–3 (Transport parity and error UX)

Date: 2025-09-11
Owner: Engineering (MCP/Oak SDK)

## Scope

This document exists solely to guide implementation of Steps 1–3:

- Step 1: HTTP server shows tool argument fields (schema parity with STDIO)
- Step 2: Improved error messages in both servers
- Step 3: Merge, publish, and validate the live deployment

All other work is tracked in `shared-mcp-core-and-mcp-server-migration-plan.md` and `mcp-oauth-implementation-plan.md`.

## References

- `.agent/reference-docs/mcp-typescript-sdk-readme.md` (Tool schema, Streamable HTTP, stdio)
- GO.md; docs/agent-guidance/testing-strategy.md; typescript-practice.md; development-practice.md

## Next steps (only remaining tasks)

1. HTTP tool arguments: Streamable HTTP app returns full generated schemas

- Change `apps/oak-curriculum-mcp-streamable-http/src/mcp-tools.ts` to emit `tool.inputSchema` (mirror STDIO).
- Extend e2e tests: `tools/list` properties/required present; `tools/call` negative/positive paths.

2. Error messages: concise, multi‑block in both servers

- Keep validation in generated executors; format at server boundary with blocks:
  - 1: `Error: Invalid arguments for <tool>`
  - 2: `Required: <keys>`
  - 3: Tiny valid example JSON
- Add tests asserting ordering and contents.

3. Merge and publish; validate live

- Merge PR → automatic deploy for HTTP app.
- Live validation: schemas in `tools/list`, Inspector renders fields; `tools/call` behaves; errors show summary + follow‑ups.

## Implementation notes

- Do not build schemas at runtime. Pass through generated `tool.inputSchema`.
- Keep servers thin; adjust only listing and formatting.
- Use British spelling; fail‑fast, clear errors.

## Tests (TDD)

- HTTP e2e: `tools/list` properties/required; `tools/call` negative/positive.
- STDIO/HTTP error UX: summary, `Required:`, tiny example blocks.

## Quality gates (run from repo root)

1. pnpm i
2. pnpm type-gen
3. pnpm build
4. pnpm type-check
5. pnpm lint -- --fix
6. pnpm -F @oaknational/oak-curriculum-sdk docs:all
7. pnpm format
8. pnpm markdownlint
9. pnpm test
10. pnpm test:e2e

## Acceptance criteria

- Streamable HTTP: `tools/list` includes full schemas; Inspector renders fields.
- Both servers: error responses are multi‑block (summary, required, example).
- Live deployment validated post‑merge; smoke checks pass.

---

Archived original plan follows.

<!-- markdownlint-disable -->

# Unified Plan: Compile‑time, Schema‑Driven Validation for Oak Curriculum SDK + MCP

Date: 2025-09-11
Owner: Engineering (MCP/Oak SDK)

## Core References

- GO.md (root)
- .agent/directives-and-memory/rules.md
- docs/agent-guidance/testing-strategy.md
- docs/agent-guidance/typescript-practice.md
- docs/agent-guidance/development-practice.md

## Context and Problem Statement

The SDK currently generates types and partial Zod validators from OpenAPI at compile time, but:

- Tool input schemas surfaced to MCP clients are lossy (types collapsed, enums missing), because the server reconstructs schemas at runtime instead of using generated ones.
- Parameter error messages are generic and unhelpful.
- Response validation is manually mapped and can drift from the OpenAPI/Zod outputs.
- Path formats differ between OpenAPI (curly) and Zod endpoints (colon), risking mismatches.

We will unify compile‑time generation to make tool inputs, error descriptions, path handling, and response validation fully schema‑driven and consistent.

## Updated Priorities (Lint First)

- Resolve linter‑reported complexity issues in scripts and validators first; split complex functions into small, pure functions with unit tests.
- Eliminate type‑destroying anti‑patterns flagged by ESLint: no `as`, no `any`, no `!`, no `Record<string, unknown>`, no `Object.*`, no `Reflect.*`, no generic guards (e.g. `isRecord`).
- No lint rule loosening is permitted; remove any temporary relaxations. Quality gates must run clean under the strict ruleset.

## Goals

- Primary goals (Phase 1 – immediate):
  - Fix Streamable HTTP server tool argument rendering by surfacing full generated `inputSchema` (parity with STDIO), proved with TDD.
  - Improve error messages in both servers with concise first‑line summaries and follow‑up lines for required fields and a tiny example (no code duplication), proved with TDD.
  - Merge and publish; validate the live deployment post‑merge (automatic deploy + smoke checks).

- Supporting goals (SDK compile‑time, already underway in this plan):
  - Generate accurate JSON Schema for each tool’s inputs at compile time and export with each tool.
  - Provide concise, compile‑time error descriptions that include a compact schema and required‑fields summary.
  - Generate response validators (operationId → status → Zod schema) at compile time.
  - Provide canonical path normalisation utilities and validate both curly/colon path styles.
  - Cross‑validate OpenAPI paths/methods against generated endpoints to fail fast on drift.
  - Ensure all types/schemas/validators are created during `pnpm type-gen`.

## Non‑Goals

- Changing the upstream OpenAPI.
- Adding runtime builders. No compatibility layers; replace old code directly.

## Constraints and Principles (Aligned with References)

- TDD always; behaviour‑focussed unit tests first.
- TypeScript best practice: no `any`, no type assertions/casts, use type guards, preserve literals with `as const` for constants.
- Single source of truth for types; data flows from OpenAPI.
- Fail fast with clear error messages; never fail open or silently.
- Quality gates in order: type‑gen → format → type‑check → lint → test → build.
- Servers are thin adaptors. All schema/validation/path logic lives in the SDK (compile‑time). No runtime schema builders.
- Forbid `Object.*`/`Reflect.*` in servers and scripts. Prefer SDK helpers from `packages/sdks/oak-curriculum-sdk/src/types/helpers.ts` (`typeSafeKeys/Values/Entries`, etc.).
- Avoid “hidden” `Record<string, unknown>` via guards (e.g. removed generic `isRecord`). Prefer precise domain types or boundary validation.

## Phase 1: Transport parity and error UX (Primary goals: Steps 1–3)

### P1.1 HTTP tool arguments (TDD)

- Change `apps/oak-curriculum-mcp-streamable-http/src/mcp-tools.ts` to return the generated `tool.inputSchema` (mirror STDIO’s `getMcpTools`).
- Tests:
  - Extend HTTP e2e to assert `tools/list` includes non‑empty `properties` and correct `required` for a representative tool (e.g., `oak-get-lessons-transcript` requires `lesson`).
  - Add a negative `tools/call` test that fails without required args and succeeds with them.
- References: `.agent/reference-docs/mcp-typescript-sdk-readme.md` → Streamable HTTP usage and stateless mode; Tool schema shape in `ToolSchema`.

### P1.2 Error messages (minimal)

- Format multi‑block responses so the first line is concise (Inspector‑visible), followed by “Required:” and a tiny example.
- Keep validation source in generated executors; only adjust formatting at the server boundary.
- Tests:
  - Unit/e2e asserting multi‑block content ordering and presence of required keys/example.

### P1.3 Merge and publish (deployment validation)

- Merge PR → automatic deployment (Vercel for HTTP app).
- Validate live server:
  - Run smoke checks against `POST /mcp` with `tools/list` to verify schemas present.
  - Manual sanity in MCP Inspector (STDIO and remote) for argument forms and error UX.
- Note: This step is complete when the PR is merged and live validation passes.

## Phase 2: Shared MCP core and McpServer migration (preview)

- Extract shared handlers and error formatting into a new internal workspace package to remove duplication across STDIO/HTTP.
- Migrate to `McpServer` with compile‑time generated Zod input schemas, removing duplicate validation while preserving OpenAPI as the single source of truth.
- See the new consolidated plan: `./shared-mcp-core-and-mcp-server-migration-plan.md` (to be added alongside this document).

## High‑Level Approach (Type‑Gen Pipeline Ordering)

1. Generate OpenAPI artefacts + MCP tools (extended to emit inputSchema and error description per tool).
2. Generate Zod artefacts (`schemas.ts`, `endpoints.ts`).
3. Schema ↔ endpoints cross‑validation (curly vs colon mapping; fail with diffs on mismatch).
4. Generate path utilities (`path-utils.ts`) and response‑validator map (`response-validators.ts` with `validateResponse`).

## Work Streams

### A) Compile‑time inputSchema generation (Priority 1) — Status: Completed

- Source: OpenAPI parameters → existing MCP tool metadata (pathParams/queryParams).
- Emit per‑tool JSON Schema:
  - Type mapping: string/number/boolean and array variants.
  - Enumerations from `allowedValues` → `enum`.
  - `required` from parameter `required: true`.
  - `additionalProperties: false`.
- Location: in each generated tool file export `const inputSchema = { ... } as const` and include it in the tool export.
- Server update: remove runtime schema reconstruction; pass through `tool.inputSchema` directly.
- Remove backwards‑compatibility exports and aliases in server tools modules:
  - `apps/oak-curriculum-mcp-stdio/src/tools/runtime/index.ts`: delete `export const tools = getMcpTools();` and related compatibility comments.
  - `apps/oak-curriculum-mcp-stdio/src/tools/index.ts`: delete `export type McpOrgan = McpToolsModule;` and `export function createMcpOrgan(...)`.
- Enrich inputSchema properties:
  - Propagate OpenAPI parameter `description` into JSON Schema property `description`.
  - When OpenAPI defines a `default`, emit `default` in JSON Schema.
  - Keep `additionalProperties: false`.
- Remove server‑side schema helpers used solely for reconstruction (e.g. `schema-utils.ts`) once pass‑through is complete.

### B) Compile‑time error description generation (Priority 2) — Status: Completed

- Replace placeholder `getValidRequestParamsDescription()` with a compile‑time rendered, compact description including:
  - Heading, compact pretty‑printed inputSchema JSON, required fields list.
- Embed as a literal in each generated tool module (no runtime building).

### C) Path normalisation utilities (Priority 1) — Status: Completed

- Generated `src/types/generated/api-schema/path-utils.ts` with `toColon`, `toCurly`, `isColon`, `isCurly`.
- Requests validator now uses `toColon`; responses validator uses `toCurly`.

### D) Response validation map (Priority 2) — Status: Completed

- Built a compile‑time response map (operationId:status → Zod schema) from OpenAPI `$ref` components and emitted `src/types/generated/api-schema/response-map.ts`.
- Responses validator now imports the generated `responseSchemaMap`; manual runtime map removed.
- Non‑200 `$ref` responses are supported and unit‑tested (e.g., 404, 500).

### E) Schema ↔ endpoints cross‑validation (Priority 1) — Status: Completed

- Added compile‑time cross‑validation to compare OpenAPI paths/methods and the generated response map; fails type‑gen with readable diffs on mismatch.

## Deliverables

- Per‑tool `inputSchema` and improved error description embedded in generated tool files.
- Generated `path-utils.ts` used by validators.
- Generated `response-map.ts` (operationId:status → Zod schema) and validators in `src/validation/response-validators.ts` use it via `responseSchemaMap`.
- SDK README updates to document compile‑time generation of input schemas and response validators.
- For Phase 1:
  - HTTP server lists full `inputSchema` (Inspector shows fields).
  - Both servers emit concise, multi‑block error messages with required keys and example.
  - Live deployment validated post‑merge.

## Current Status and Progress (as of 2025‑09‑11 18:03)

- SDK
  - Implemented `buildInputSchemaObject` and unit tests for types/enums/required/description/default.
  - `emit-schema.ts` now embeds `const inputSchema` per tool; `emit-index.ts` exports `inputSchema` on each tool object.
  - Build succeeded: `pnpm build` green for SDK.
  - Response‑map builder tests include non‑200 `$ref` statuses; cross‑validation unit tests enhanced for Missing/Extra reporting.
- Server (stdio)
  - `getMcpTools()` now passes through `tool.inputSchema` from SDK; runtime reconstruction removed.
  - Backwards‑compat exports removed: `export const tools = getMcpTools()` (runtime) and `McpOrgan`/`createMcpOrgan` (index).
  - Build succeeded: `pnpm build` green for stdio.
- Lint/typing follow‑ups (known)
  - Eliminate all uses of generic `isRecord` guards (these imply `Record<string, unknown>`). Replace with precise domain narrowers (e.g. `isOperationObject`, path‑item/response guards) and property‑descriptor checks that return primitives/unknown rather than Records. No generic `Record<>` returns from guards.
  - Replace residual `Record<string, unknown>` across SDK and generated tool files with precise compile‑time types (generated param maps) or unknown+targeted guards. Update emitters so generated files do not declare `Record<string, unknown>` for request params.
  - Remove the remaining type assertion in `scripts/typegen.ts` (OpenAPI3 cast) by introducing a runtime `isOpenAPI3()` validator (Zod or equivalent) and narrow via predicate.
  - Resolve complexity and assertion lints in scripts by extracting pure helpers (notably `scripts/generate-ai-doc.ts`, `scripts/typegen/validation/cross-validate.ts`, and any remaining generator functions).
  - Temporary ESLint relaxation for `@typescript-eslint/no-restricted-types` is still enabled (scripts/src). Plan to remove it after refactors above restore strict typing; keep all other relaxations removed.
  - Ensure no `Object.*`/`Reflect.*` usages remain in servers; when iterating unknowns at boundaries, use typed helpers from `src/types/helpers.ts`.

Next up

- Remove generic `isRecord` usage across scripts and SDK; introduce precise, domain‑specific type guards and descriptor‑based accessors. Prohibit any guard that returns `Record<string, unknown>`.
- Update the MCP tool emitters to generate precise param types and guards so generated tool files no longer reference `Record<string, unknown>` in `ValidRequestParams` or internal validators.
- Replace the last type assertion in `scripts/typegen.ts` by adding a proper OpenAPI3 schema runtime validator and narrowing `maybeSchema` via a predicate (no `as`).
- Refactor high‑complexity functions (especially in `scripts/generate-ai-doc.ts`) into smaller pure helpers to satisfy complexity limits without relaxing rules.
- Remove the temporary `no-restricted-types` relaxation (scripts/src) once the above refactors land; gates must remain green.
- Documentation and ADR updates to reflect strict type‑safety practices (no `any`, no `as`, no generic Records), and how compile‑time artefacts are consumed.

## TDD Plan (Strict Unit Tests)

REMINDER: Use british spelling

- A.1 `emit-input-schema.unit.test.ts`: correct types/enums/required/additionalProperties for representative operations.
- A.2 Server `tools-list.unit.test.ts`: server lists `inputSchema` exactly as generated (no transformation).
- B.1 `emit-error-description.unit.test.ts`: description includes compact JSON schema and required list.
- C.1 `path-utils.unit.test.ts`: toColon/toCurly round‑trip, idempotency, detectors’ behaviour.
- D.1 `response-map.unit.test.ts`: map builder prefers component `$ref`, falls back to endpoints.response; errors on missing 200.
- D.2 `response-emitter.unit.test.ts`: emitted TS contains expected imports/exports, no assertions.
- D.3 `response-wrapper-behaviour.unit.test.ts`: success returns ok/value; invalid data returns structured issues; accepts both colon/curly inputs.
- E.1 `cross-validate.unit.test.ts`: matching sets pass; mismatches produce descriptive diffs.
- P1 HTTP/Errors (new):
  - `apps/oak-curriculum-mcp-streamable-http` e2e: `tools/list` exposes properties/required; `tools/call` missing required fails; present succeeds.
  - STDIO/HTTP error UX tests: first line summary + required keys + tiny example across both transports.

Naming: unit tests end with `*.unit.test.ts`; integration `*.integration.test.ts`; E2E `*.e2e.test.ts`.

## Implementation Steps

1. Write tests (RED) for A–E in scripts/typegen and server areas as specified.
2. Implement generators/emitters as pure functions:
   - `scripts/typegen/mcp-tools/emit-input-schema.ts`
   - `scripts/typegen/mcp-tools/emit-error-description.ts`
   - `scripts/typegen/paths/generate-path-utils.ts`
   - `scripts/typegen/response-map/build-response-map.ts`
   - `scripts/typegen/response-map/emit-response-validators.ts`
   - `scripts/typegen/validation/cross-validate.ts`
3. Wire into `scripts/typegen-core.ts` with ordered execution and fail‑fast validation.

4) Replace server schema reconstruction with pass‑through `tool.inputSchema` (no compatibility layer).
   - Remove compatibility exports/aliases from server tools modules; update imports accordingly.
   - Remove `apps/oak-curriculum-mcp-stdio/src/tools/runtime/schema-utils.ts` if only used for reconstruction.
5) Ensure `tsup.config.ts` includes entries for the new generated modules (`path-utils.ts`, `response-map.ts`, tool files exposing `inputSchema`).

6) Documentation updates pending in SDK README and ADR cross‑references.

7) Phase 1 (Primary) – HTTP parity + error UX + deployment validation (see Phase 1 section above for details and tests).

### D) Response validation map + validators (Priority 1) — Status: Completed

- Generated compile‑time response map (operationId → status → componentName) and emitted `responseSchemaMap` used by `validateResponse`.
- Replaced manual response map population with generated artefacts.
- Wired cross‑validation between OpenAPI responses and generated map; fails fast on drift.

### E) Lint‑first remediation and type integrity (Priority 0) — Status: Substantially Completed

- Removed type‑destroying patterns across SDK scripts: no `as`, no `any`, no `Record<string, unknown>`, no `Object.*`/`Reflect.*` in hand‑written code.
- Reduced complexity by extracting pure helpers (notably `generate-ai-doc.ts`, cross‑validation, extraction helpers, type formatting).
- Replaced generic guards with descriptor‑based primitives accessors via `src/types/helpers.ts`.
- Unit tests updated to avoid direct property access on unknown; use safe descriptor checks.

### F) MCP tool generator alignment (Priority 1) — Status: Completed

- Emit precise `ValidRequestParams` per tool:
  - `path` required only when a tool has path params; omitted otherwise.
  - `query` required only when any query param is required; optional when all are optional; omitted when none.
  - Property types use concrete primitives and literal unions derived from OpenAPI (no unknown widening).
- Added per‑tool `invoke(client, params: unknown)` wrapper:
  - Validates with generated `isValidRequestParams` then calls the executor.
  - Allows call sites to pass unknown without compile‑time mismatch, while preserving runtime validation.
- Executors now use `client[path][METHOD]` directly (no `Record<>` casts).

## Quality Gates

- Run sequentially: `pnpm type-gen` → `pnpm build` → `pnpm type-check` → `pnpm lint` → `pnpm test`.
- Type‑gen requires `OAK_API_KEY` and network for `tsx`.
  - Latest SDK run: Type‑gen OK, Build OK (tsup + tsc declarations), Lint OK (strict, no relaxations).

## Acceptance Criteria

- Tools expose `inputSchema` with correct types, enums, required, and `additionalProperties: false` (verified by unit/E2E tests).
- Parameter error descriptions include compact schema and required list.
- Response validators auto‑generated and used; representative operations validate correctly against Zod.
- Path normalisation works for both styles; request/response validators share the same utilities.
- Cross‑validation enforces parity between OpenAPI paths and generated endpoints; type‑gen fails on drift.
- No `any`, no type assertions (except `as const` for literals); predicates and literal types used per TypeScript Practice.
- No `isRecord` guards anywhere; no functions that return or expose `Record<string, unknown>` from guards.
- No `Record<string, unknown>` (or `Record<string, any>`) in SDK source or generated outputs; generated tools use precise param maps and typed guards.
- No server‑side schema reconstruction remains; server passes through SDK `inputSchema`.
- No backwards‑compatibility exports remain in `apps/oak-curriculum-mcp-stdio/src/tools/index.ts` and `apps/oak-curriculum-mcp-stdio/src/tools/runtime/index.ts`; all consumers use `createMcpToolsModule` and `getMcpTools`.
- OpenAPI parameter descriptions appear as JSON Schema `description` in `tools/list` and are visible in MCP Inspector; defaults appear where defined.
- ESLint strict rules enforced with zero relaxations or disables; complexity thresholds respected across source and generators.
- Generated tools expose `invoke(client, unknown)` wrapper that validates params and preserves type safety; executor calls align with `openapi-fetch` endpoint signatures.
- Phase 1 (Primary):
  - HTTP server lists full schemas; Inspector displays argument fields.
  - Error messages: concise first line; follow‑up lines include required keys and an example; verified in both servers.
  - Deployment validated live post‑merge (smoke checks pass).

## Risks and Mitigations

- OZC template drift: response mapping prioritises OpenAPI components; endpoints fallback is secondary.
- Large error messages: use compact, shallow printing.
- Build ordering: enforce pipeline order; guard with tests.
- Public API wiring: ensure tsup includes generated files; re‑export via stable paths.
- Strict `additionalProperties: false` may block unforeseen parameters:
  - Mitigation: ensure all parameters are enumerated from OpenAPI; if the upstream schema adds fields, type‑gen will regenerate; avoid runtime overrides.
- Packaging/exports drift:
  - Mitigation: add unit or script checks that imports from `src/index.ts` resolve the new generated modules; fail CI on drift.
- Server type erosion via `Object.*`/`Reflect.*` or generic guards:
  - Mitigation: ban at lint; rely on SDK typed helpers and domain types; validate raw inputs at boundaries only.

## Rollout

- Feature branch; PR(s) with green gates.
- Commit generated artefacts to ensure CI reproducibility.
- Manual sanity checks in MCP Inspector to confirm enums/required/defaults and validation behaviour.
- Repo‑wide search confirms removal of `createMcpOrgan`, `McpOrgan`, and runtime schema helpers.
- Repo‑wide search confirms absence of `isRecord` and generic `Record<string, unknown>` in SDK source and generated code; `no-restricted-types` relaxation removed.

## Todo List (Grounded, Actionable, Self‑Reviewed)

Intent: Get quality gates green by resolving linter complexity and type integrity issues first, ensuring types flow from OpenAPI to generated artefacts to servers without erosion.

1. ACTION: Identify all files/functions breaching ESLint complexity/cognitive thresholds (scripts + validators) using `pnpm lint` output; list targets.
   REVIEW: Self‑review – confirm list matches linter report; no misses.
2. GROUNDING: read GO.md and follow all instructions.
3. ACTION: Refactor first complex function group into small pure helpers with unit tests (`*.unit.test.ts`), no side effects.
   REVIEW: Self‑review – verify tests prove behaviour; complexity warnings resolved.
4. QUALITY-GATE: Run `pnpm -F @oaknational/oak-curriculum-sdk type-gen && pnpm type-check && pnpm lint` and capture remaining complexity/type errors.
5. ACTION: Refactor remaining complex hotspots iteratively (scripts/typegen/_ and src/validation/_) until complexity warnings are zero.
   REVIEW: Self‑review – ensure functions have single responsibility, clear names, and jsdoc.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Remove all ESLint relaxations and local disables related to types/complexity; update code to satisfy rules without exceptions.
   REVIEW: Self‑review – grep for `eslint-disable`, confirm none remain except justified non‑type items.
8. QUALITY-GATE: Run `pnpm lint` to verify zero disables and zero complexity warnings remain.
9. ACTION: Eliminate type‑destroying anti‑patterns across repo: remove `as`, `any`, `!`, `Record<string, unknown>`, `Object.*`, `Reflect.*`, and generic guards; replace with precise types, generated guards, and typed helpers.
   REVIEW: Self‑review – spot‑check diffs for preserved literal types and guard predicates.
10. GROUNDING: read GO.md and follow all instructions.
11. ACTION: Replace `as OpenAPI3` with runtime validator + predicate narrow in type‑gen loader; add unit tests for validator.
    REVIEW: Self‑review – confirm no remaining `as` in loader; tests prove behaviour.
12. QUALITY-GATE: Run full gates in order: `pnpm -F @oaknational/oak-curriculum-sdk type-gen` → `pnpm build` → `pnpm type-check` → `pnpm lint` → `pnpm test`.
13. ACTION: Ensure generated MCP tool files emit precise param map types (explicit keys) and generated guards; remove any `Record<>` from generated outputs; add generator tests. (Completed)
    REVIEW: Self‑review – inspect generated outputs; unit tests cover shape/guards. Add tests for required/optional query and the `invoke` wrapper.
14. GROUNDING: read GO.md and follow all instructions.
15. ACTION: Update documentation (SDK README, ADRs) to codify strict typing rules and compile‑time artefacts; add inline jsdoc to new/changed modules per rules.
    REVIEW: Self‑review – docs accurately reflect code; references to guidance included.
16. QUALITY-GATE: Final repo‑wide gates (`pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`).

## Hand‑Off Notes (resume in new chat)

- Environment
  - Ensure `OAK_API_KEY` is present in the repo root `.env`.
  - Type‑gen uses `tsx` (requires network + IPC access).

- Validate current state
  - `pnpm -F @oaknational/oak-curriculum-sdk type-gen`
  - `pnpm build`
  - `pnpm type-check`
  - `pnpm lint`
  - `pnpm test`
  - SDK status: type‑gen OK; build OK; lint OK (strict).

- Intended next steps
  - Extend response map generator to include non‑200 error responses where OpenAPI uses `$ref` components; add unit tests.
  - (Optional) Enrich cross‑validation to assert that every emitted response map entry resolves to an existing Zod schema import.
  - Remove any temporary ESLint relaxations added during migration (now mandatory; no relaxations allowed).
  - Update SDK README and ADRs to document compile‑time artefacts (`inputSchema`, `path-utils`, `response-map`) and server consumption patterns.

- Server guidance
  - Keep servers as thin adaptors: pass through SDK `inputSchema`; do not build schemas at runtime.
  - Avoid `Object.*`/`Reflect.*`; when iterating unknown input at boundaries, use typed helpers from the SDK.

## Grounding and Self‑Reviews

- Follow GO.md: keep TODOs actionable with immediate self‑review after every action and frequent quality gates; include regular grounding steps.
- Replace sub‑agent reviews with explicit self‑review checklists tied to acceptance criteria and lint/type outputs.
- Keep changes minimal, pure, and focussed. When in doubt, make it simpler without compromising quality.

<!-- Consolidated progress integrated into the Work Streams and Hand‑Off sections above -->

- Cross‑validation implemented:
  - Compile‑time checks compare OpenAPI paths/methods against generated endpoint lists; wired via `runAllCrossValidations()` in `scripts/typegen-core.ts`.

- Error status coverage:
  - Extend response map generation to include non‑200 responses (401/403/500) where OpenAPI has `$ref` components; add tests.

  - All ESLint relaxations are removed. No rule weakening is permitted.

- Ensure all apps remove compatibility layers and runtime builders:
  - Stdio app updated. Confirm other apps don’t reconstruct schemas or expose compatibility exports. All consumers should use `createMcpToolsModule` and SDK‑generated artefacts.

### Current Context (how to resume)

- Environment:
  - Requires `OAK_API_KEY` in repo root `.env` to fetch schema during `pnpm type-gen` or SDK `prebuild`.
  - Network + IPC required for `tsx` during type‑gen (OpenAPI fetch).

- Key Commands:
  - `pnpm type-gen` (or `pnpm -F @oaknational/oak-curriculum-sdk type-gen`)
  - `pnpm build`
  - `pnpm type-check`
  - `pnpm lint -- --fix`
  - `pnpm test`
  - Optional docs (SDK): `pnpm -F @oaknational/oak-curriculum-sdk docs:all`

- Notable new files (generators):
  - Path utils: `scripts/typegen/paths/generate-path-utils.ts` (+ unit test)
  - Response map: `scripts/typegen/response-map/build-response-map.ts`, `scripts/typegen/response-map/emit-response-validators.ts` (+ unit test)

- Notable generated files:
  - `src/types/generated/api-schema/path-utils.ts`
  - `src/types/generated/api-schema/response-map.ts`

- Refactors completed:
  - Request validator uses `toColon`; old normaliser removed.
  - Response validator imports `responseSchemaMap` and `toCurly`; manual map removed.
  - Stdio app: removed runtime schema reconstruction; now passes through SDK `inputSchema`.
  - MCP tool generator now emits precise parameter shapes and an `invoke` wrapper; executors use `client[path][METHOD]`.

### Next Steps

1. Remove `isRecord` usage across scripts/SDK and replace with precise domain narrowers and descriptor‑based primitives accessors (no generic `Record<>`).
2. Change MCP tool emitters to output precise param map types (keys from OpenAPI) and generated guards, removing `Record<string, unknown>` from generated files; re‑generate and verify gates.
3. Replace the `as OpenAPI3` assertion in `scripts/typegen.ts` with a runtime validator and predicate narrow (no `as`).
4. Refactor high‑complexity functions (notably `scripts/generate-ai-doc.ts`, cross‑validation/reporting helpers) into smaller pure functions to satisfy complexity limits.
5. Remove the temporary `no-restricted-types` relaxation and keep lint/type‑check green; add guardrails to prevent regressions.
6. Documentation: update README/ADRs to codify strict type‑safety (no `any`, no `as`, no `Record<>`, no generic guards), and explain compile‑time artefacts and consumption; document the new `invoke` wrapper and parameter shape rules.
7. Validate consumers: confirm all apps import generated tool metadata directly and use `invoke` (or equivalent); no runtime builders or compatibility layers.

## Progress Update (2025‑09‑11)

- Lint‑first pass completed across SDK with strict rules; removed `Record<>`, `Object.*`, assertions, and high‑complexity functions.
- Added robust helper set in `src/types/helpers.ts` and refactored call sites.
- Cross‑validation and response map generation wired and enforced during type‑gen; fails fast on drift.
- MCP tool generation updated to emit precise `ValidRequestParams` and `invoke` wrapper; executors align with `openapi-fetch` endpoint signatures without casts.
- SDK gates green locally (type‑gen, build, lint). Type‑check is covered by build’s declaration step.
