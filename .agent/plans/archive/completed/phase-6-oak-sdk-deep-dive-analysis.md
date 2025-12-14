# Phase 6 — Oak Curriculum API SDK Deep Dive Analysis

Status: draft
Owner: Cascade
Scope: Reference SDK at `reference/oak-curriculum-api-client`

This report documents a grounded deep-dive of the Oak Curriculum API SDK. It captures architecture, code structure, type-generation/validation, runtime design, tests/tooling, risks, and an actionable migration plan for integration into the MCP ecosystem. The plan includes grounding steps and explicit sub-agent review checkpoints per GO.md and AGENT.md.

---

## Executive Summary

- The SDK is a strict TypeScript, ESM-only client built on `openapi-fetch`, exposing two factory-created client styles: method-based and path-indexed.
- Strong typing comes from generated OpenAPI types and a companion generated module providing path parameter enums and runtime guards.
- Core API auth uses a simple `Authorization: Bearer` middleware.
- The design aims to be environment-agnostic for API key handling (explicit injection), but the base URL currently comes via `process.env` in `reference/oak-curriculum-api-client/config/index.ts`, which may not be Edge/Workers-safe.
- Unit tests cover generated path parameters and validators. Additional integration tests and fetch-mocking would improve robustness.
- Migration into MCP is straightforward: wrap the factory clients behind MCP tools, inject API key via MCP secrets, remove env reads from the core surface, and add quality gates per GO.md.
- MVP explicitly excludes ElasticSearch integration. Phase 5.5 runtime isolation is a hard prerequisite and a gate for Phase 6.

---

## Architecture and Design

- **Factory entrypoints** (`reference/oak-curriculum-api-client/src/index.ts`, `reference/oak-curriculum-api-client/src/client/index.ts`)
  - `createOakClient(apiKey: string)` returns an OpenAPI-Fetch style client.
  - `createOakPathBasedClient(apiKey: string)` returns a path-indexed client using `wrapAsPathBasedClient`.
  - Classes are not exported; consumers use factories only.

- **Core client wrapper** (`reference/oak-curriculum-api-client/src/client/oak-base-client.ts`)
  - Constructs a base `openapi-fetch` client bound to `apiUrl` and attaches auth middleware.
  - Exposes both the method-based client (`client`) and path-based client (`pathBasedClient`).

- **Auth middleware** (`reference/oak-curriculum-api-client/src/client/middleware/auth.ts`)
  - `createAuthMiddleware(apiKey)` injects `Authorization: Bearer <apiKey>` on all requests.
  - No environment reads; API key must be passed explicitly.

- **Configuration** (`reference/oak-curriculum-api-client/config/index.ts`)
  - Computes `apiUrl` and `apiSchemaUrl` from `process.env` with defaults.
  - Note: using `process.env` at module evaluation time may not be Edge/Workers-safe.

- **Logging (Node-only contexts)** (`reference/oak-curriculum-api-client/src/utils/logging.ts`)
  - Minimal Winston logger gated by `process.env.DEBUG`. Used by scripts/examples; not imported by core client.

---

## Type Generation and Validation

- **Type generation script** (`reference/oak-curriculum-api-client/scripts/api-types/typegen.ts`)
  - Fetches schema from `config/apiSchemaUrl` and calls `generateSchemaArtifacts()`.

- **Typegen core** (`reference/oak-curriculum-api-client/scripts/api-types/typegen-core.ts`)
  - Emits:
    - `src/types/generated/api-schema/api-schema.json` (raw schema)
    - `src/types/generated/api-schema/api-schema.ts` (runtime object `schema` and `Schema` type)
    - `src/types/generated/api-schema/api-paths-types.ts` (OpenAPI-TS types for `openapi-fetch`)
    - `src/types/generated/api-schema/path-parameters.ts`:
      - `PATHS` mapping of valid keys
      - `allowedMethods`, `isAllowedMethod`
      - `PathReturnTypes` mapping `[P in ValidPath]['get']` return types
      - Enum arrays: `KEY_STAGES`, `SUBJECTS`, etc. with `isKeyStage`, `isSubject`, …
      - `PATH_PARAMETERS` and `isValidParameterType`, `isValidPathParameter`
      - `VALID_PATHS_BY_PARAMETERS` grouping (e.g., `NO_PARAMS`, `keyStage_AND_subject`, …)

- **Path utilities**
  - `reference/oak-curriculum-api-client/src/paths/types.ts`:
    - Lightweight parameter object types and type guards (`isKeyStagePathParameters`, `isKeyStageSubjectPathParameters`, `isLessonPathParameters`, `isPathParameters`).
  - `reference/oak-curriculum-api-client/src/paths/validators.ts`:
    - `validateKeyStage`, `validateSubject`, combination validator, and
    - `validatePathWithParameters(path, parameters?)`, `assertValidPath(path, parameters?)` built atop generated guards.

- **Design note**
  - For non-enum path parameters (`lesson`, `unit`, `sequence`, `threadSlug`), generator uses an “accept-any string” fallback by schema design. Consumers should layer extra constraints if needed.

---

## Environment and Runtime Considerations

- **API key handling**: fully explicit injection via factory functions; no env reads in auth middleware or client factories.
- **Base URL handling**: `apiUrl` currently computed in `config/index.ts` using `process.env`; this is Node-centric and may break in Edge runtimes if `process` is unavailable.
- **Node engine** in `package.json`: `>=22`. MCP runtime compatibility must be confirmed; we may need a broader build target (Node 18/20 LTS) depending on deployment constraints.
- **Bundling**: `tsup` builds ESM with types; sideEffects: false; good for tree-shaking.

---

## Testing and Quality Gates

- **Unit tests** (Vitest):
  - `tests/unit/generated/path-parameters.test.ts`: enums, guards, grouped paths.
  - `tests/unit/paths/assert-valid-path.test.ts`: `assertValidPath` behavior including accept-any fallback for non-enum parameters.
  - `tests/unit/paths/types.test.ts`: parameter type guards across shapes.
  - `tests/unit/paths/validators.test.ts`: validator surface.
- **Gaps**:
  - No fetch-mocked integration tests for `openapi-fetch` client behavior.
  - No e2e smoke against the live API (could be optional/recorded).
- **Tooling**:
  - ESLint (import-x, sonarjs, unicorn), Prettier, TypeScript strict, Husky + commitlint.
  - `typegen` idempotence can be checked in CI by diffing generated artifacts.

---

## Examples and Usage

- `examples/oak-client.ts`: method-based client demo (`client.GET('/key-stages')`).
- `examples/oak-path-client.ts`: path-indexed demo (`client['/key-stages'].GET()`).
- `examples/README.md`: cautions against `.env` in Edge; dotenv used only for Node local dev convenience.

---

## Findings and Reflections

- **Strengths**
  - Factory-only surface, no class exports; clear DI point for creds and future options.
  - Strong OpenAPI-typed client via `openapi-fetch` and `openapi-typescript`.
  - Generated runtime guards for valid paths/parameters provide safe dynamic construction.
  - Path-indexed client improves discoverability; method-based client offers performance.
  - Node-only utilities (logger) are segregated from core imports.

- **Weaknesses / Risks**
  - `config/index.ts` uses `process.env` in a module imported by the core client (`apiUrl`), which is not Edge/Workers-safe.
  - Accept-any fallback for non-enum params could mask invalid user inputs; downstream tooling should validate more strictly where appropriate.
  - Engine pin `>=22` may limit consumer environments; consider broader targets if MCP runtime differs.
  - Limited integration tests; network behavior (errors, retries, rate limits) not covered.

- **Opportunities**
  - Refactor base URL to be injected via factories with a safe default; avoid `process.env` in core code.
  - Provide fetch-mock-based tests for error mapping, retries, and rate limits.
  - Centralize error translation for MCP tool UX (e.g., input validation vs transport vs API errors).

---

## Actionable Migration Plan (MVP)

Preconditions:

- Phase 5.5 runtime isolation is a hard prerequisite (no waiver). Do not release Phase 6 artifacts until isolation is in place.
- ElasticSearch integration is OUT of MVP. Defer to post-MVP enhancement.

### A. SDK Consumption Strategy

- **A1. Dependency**: Treat `reference/oak-curriculum-api-client` as the authoritative local package for now.
- **A2. Build Target**: Validate MCP runtime Node version; if <22, add tsup target override and CI matrix for Node 18/20/22.
- **A3. Base URL Injection**: Extend factories to accept `baseUrl?: string` with a default of `https://open-api.thenational.academy/api/v0/`; avoid env reads in core. Use dependency injection in MCP layer until upstream refactor lands.

### B. MCP Tooling Wrapper (MVP subset of endpoints)

- **B1. Tool Surface**: Provide tools for read-only endpoints likely needed first:
  - `GET /key-stages`
  - `GET /subjects`
  - `GET /subjects/{subject}/key-stages`
  - `GET /key-stages/{keyStage}/subject/{subject}/units`
  - `GET /units/{unit}/summary`
- **B2. Input Validation**: Use `validatePathWithParameters` and enum-backed guards; for non-enum parameters, add MCP-level stricter validators where feasible.
- **B3. Secrets**: Inject API key from MCP secrets store; never read env in the tool implementation.
- **B4. Error Mapping**: Normalize transport errors vs API errors (non-200) with clear messages and structured error codes.

### C. Quality Gates and TDD

- **C1. Tests**: Vitest unit tests for each tool, mocking `fetch` to verify request composition and error handling. Contract tests for validator wrappers.
- **C2. Lint/Type**: ESLint + TypeScript strict in CI pipeline; `tsc --noEmit`, `vitest run`, `tsup build`.
- **C3. Typegen Checks**: If relying on local SDK, add a CI check that `pnpm typegen && git diff --exit-code` is clean.

### D. Observability and Limits

- **D1. Basic Logging**: Interface-based logger abstraction; fallback to `console` for Edge/runtime neutrality.
- **D2. Rate Limits**: Surface `/rate-limit` endpoint via a tool; add polite backoff guidance in error messages. Retries can be added later.

### E. Documentation

- **E1. README**: Usage examples for MCP tools; explicit note about base URL and API key injection.
- **E2. Security**: Document secret handling and zero env reads in core tool code.

---

## Atomic, Measurable, Provable Tasks (with Acceptance Criteria)

Numbered to support grounding cadence (every third task has grounding + sub-agent review).

1. Create MCP Oak client wrapper module that accepts `{ apiKey, baseUrl }` and constructs the method-based client.

- Accept: Unit test verifies header injection and baseUrl usage via mocked fetch.

2. Implement validators module that re-exports `validateKeyStage`, `validateSubject`, and adds stricter checks for non-enum IDs (`unit`, `sequence`, `lesson`).

- Accept: Unit tests cover happy/invalid paths; no `any` used.

3. Implement tool: `listKeyStages` using `client.GET('/key-stages')`.

- Accept: Vitest with mocked fetch; returns typed payload.
- GROUND + REVIEW: Cite `GO.md` for atomicity; run architecture-reviewer sub-agent to confirm API boundaries.

4. Implement tool: `listSubjects` and `listKeyStagesForSubject(subject)`.

- Accept: Tests verify validation and mapping; consistent error messages.

5. Implement tool: `listUnitsForKeyStageSubject({ keyStage, subject })` with strict validation.

- Accept: Tests verify invalid enum rejection; end-to-end mocked response.
- GROUND + REVIEW: Reference `AGENT.md` on prime directive; run code-reviewer sub-agent for TDD adherence.

6. Implement tool: `getUnitSummary(unit)` with stricter `unit` validation policy and error mapping.

- Accept: Tests verify input policy and response typing.

7. Add CI workflow: lint, type-check, test, build; add typegen idempotence check when SDK package is updated.

- Accept: CI passes; generated artifacts stable.
- GROUND + REVIEW: Confirm against `GO.md` quality gates; run release-checker sub-agent.

8. Documentation pass for MCP tools with examples, security posture, and runtime notes.

- Accept: README updated and validated by docs-checker sub-agent.

Pre-release Gate: Confirm Phase 5.5 runtime isolation is satisfied before publishing MCP tools.

---

## Risks and Mitigations

- **Env access in core path**: `config/index.ts` env reads may break Edge.
  - Mitigate: Inject `baseUrl` via factory; do not import `config` in MCP wrapper; optionally upstream refactor.
- **Engine constraints**: Node 22-only engines may not match MCP runtime.
  - Mitigate: Configure tsup/tsconfig targets for Node 18/20 if needed; CI matrix.
- **Validation gaps for non-enums**: Accept-any fallback can admit bad inputs.
  - Mitigate: Add MCP-level constraints and tests; consider future schema enrichments.
- **Network variability**: No retry/backoff or circuit breaker in MVP.
  - Mitigate: Clear error surfaces; add `/rate-limit` introspection tool.

---

## Open Questions

- What is the target Node runtime for MCP deployment (18/20/22)?
- Should the MCP layer hardcode the public base URL or accept DI with a safe default?
- Which endpoints must be in the MVP vs post-MVP (beyond those listed)?
- Any additional security constraints (e.g., IP allow lists) to account for?

---

## Grounding and Sub-agent Checkpoints

We will follow GO.md and AGENT.md:

- Every third task includes a GROUNDING step citing relevant directives.
- Sub-agent checkpoints:
  - After task 3: architecture-reviewer.
  - After task 5: code-reviewer.
  - After task 7: release-checker.
  - After task 8: docs-checker.

Each checkpoint must confirm:

- No env reads in core MCP tool code.
- Tests (Vitest) present and passing; TDD adhered to.
- Types are strict; no `any`; prefer type guards.
- Atomicity and measurability per GO.md.

---

## References (inspected files)

- Entry/factories: `reference/oak-curriculum-api-client/src/index.ts`, `reference/oak-curriculum-api-client/src/client/index.ts`
- Core client: `reference/oak-curriculum-api-client/src/client/oak-base-client.ts`
- Middleware: `reference/oak-curriculum-api-client/src/client/middleware/auth.ts`
- Config: `reference/oak-curriculum-api-client/config/index.ts`
- Typegen: `reference/oak-curriculum-api-client/scripts/api-types/typegen.ts`, `typegen-core.ts`
- Generated: `reference/oak-curriculum-api-client/src/types/generated/api-schema/path-parameters.ts`, `api-paths-types.ts`, `api-schema.ts`
- Paths utils: `reference/oak-curriculum-api-client/src/paths/types.ts`, `validators.ts`
- Logging: `reference/oak-curriculum-api-client/src/utils/logging.ts`
- Examples: `reference/oak-curriculum-api-client/examples/*`
- Tests: `reference/oak-curriculum-api-client/tests/unit/*`
