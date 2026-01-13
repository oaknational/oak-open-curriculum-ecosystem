# Castr validation fixtures (Oak Open Curriculum)

## Intent

Provide canonical inputs for validating `@engraph/castr` against a real, schema-first pipeline. These OpenAPI fixtures are the ground truth for the Oak Open Curriculum API in this repo: every generated type, validator, and MCP tool ultimately flows from them (see `.agent/directives-and-memory/rules.md` and `.agent/directives-and-memory/schema-first-execution.md`). The SDK-decorated schema is the input passed to castr; the original schema is retained for provenance and upstream feedback. OpenAPI 3.0 inputs are preserved alongside OpenAPI 3.1 upgrades used for stricter, fully valid checks. These fixtures define the contract Castr must satisfy for the current systems, not an implementation detail of the harness.

## Contents

- `api-schema-original.json`
  - Source: `packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json`
  - Meaning: upstream OpenAPI schema as returned by the Oak API (no local decoration)
- `api-schema-sdk.json`
  - Source: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`
  - Meaning: SDK-enhanced OpenAPI schema with canonical URL metadata and temporary 404 documentation applied
- `api-schema-original-3.1.json`
  - Source: upgraded from `api-schema-original.json`
  - Meaning: OpenAPI 3.1 version of the upstream schema (no local decoration)
- `api-schema-sdk-3.1.json`
  - Source: upgraded from `api-schema-sdk.json`
  - Meaning: OpenAPI 3.1 version of the SDK-enhanced schema
- `castr-ir.schema.json`
  - Meaning: JSON Schema contract for castr IR output
- `castr-bundle.schema.json`
  - Meaning: JSON Schema contract for castr bundle manifests
- `castr-bundle.sample.json`
  - Meaning: Example castr bundle manifest with placeholder values
- `verify-castr-fixtures.mjs`
  - Meaning: Minimal verification harness for the fixtures and optional castr bundle manifests

## How these schemas are acquired and processed

### Original schema (upstream truth)

- Entry point: `packages/sdks/oak-curriculum-sdk/type-gen/typegen.ts`
- Online fetch (default): `https://open-api.thenational.academy/api/v0/swagger.json` using `OAK_API_KEY`
- Validation: `packages/sdks/oak-curriculum-sdk/type-gen/schema-validator.ts` ensures minimal OpenAPI 3 structure
- Caching: `packages/sdks/oak-curriculum-sdk/type-gen/schema-cache.ts` writes to `schema-cache/api-schema-original.json`
- CI/offline mode: reads the cached original schema from `schema-cache/api-schema-original.json`

### SDK schema (local enhancement)

- Construction: `packages/sdks/oak-curriculum-sdk/type-gen/schema-separation-core.ts`
  - `decorateCanonicalUrls` in `schema-separation-decorators.ts` injects `canonicalUrl` fields into response schemas
    - Thread responses are typed as `null` for `canonicalUrl` (threads have no site URL)
  - `add404ResponsesWhereExpected` in `schema-enhancement-404.ts` documents legitimate 404s for `/lessons/{lesson}/transcript`
- Output: `generateSchemaArtifacts` in `typegen-core.ts` writes `api-schema-sdk.json` into `src/types/generated/api-schema`

### OpenAPI 3.1 fixtures (castr upgrade expectations)

`api-schema-original-3.1.json` and `api-schema-sdk-3.1.json` are the strict counterparts to the 3.0 fixtures. They reflect the required castr upgrade step:

- `openapi` is upgraded to `3.1.0` and `jsonSchemaDialect` is set to draft 2020-12.
- `nullable: true` is replaced with JSON Schema null unions (for example, `type: ["object", "null"]`).
- No other semantic changes are applied; these are behavioural expectations, not formatting or ordering constraints.
The verification harness does not attempt upgrades or normalisation; castr is responsible for producing these 3.1 outputs.

## Potential avenues for use (automated checks)

- **IR determinism**: parse `api-schema-sdk.json` and assert stable, sorted IR output across runs.
- **Emitter parity**: emit Zod v4 and TypeScript from castr and compare structural parity against the SDK artefacts.
- **Endpoint map validation**: ensure method + path -> operationId and response status mappings match SDK outputs.
- **Decoration checks**: verify `canonicalUrl` injection and the transcript 404 response are present only in the SDK schema.
- **Round-trip safety**: OpenAPI -> IR -> OpenAPI output must preserve semantics against the SDK schema (byte equivalence is not required).

## Contract files

- `castr-ir.schema.json` defines the minimal IR shape required to reproduce the Oak SDK outputs, including strictness and lossless OpenAPI requirements.
- `castr-bundle.schema.json` defines a required manifest that points to IR and emitter outputs for automated checks (OpenAPI output is mandatory).

## Requirements (Oak contract)

- Castr consumes the SDK-decorated schema (`api-schema-sdk.json`), not the upstream original.
- OpenAPI 3.0.x is allowed as input, but castr must upgrade to fully valid OpenAPI 3.1.x before the schema enters IR or emitters.
- OpenAPI output must be valid 3.1.x; normalisation is expected, byte equivalence is not.
- Output must be strict: object schemas reject unknown keys and fail fast with explicit errors.
- Output must preserve schema semantics and operation coverage (no data loss).
- Ordering must be deterministic for schema and endpoint registries.
- Bundle manifest is required for validation runs.
- TypeScript output must export `paths`, `components`, and `operations` types for the SDK client and public API.

## Invariant checks (non-exhaustive, non-formatting)

Endpoints are complete and deterministic:
- Every OpenAPI operation is present in `endpoints.json`.
- No extra operations appear in `endpoints.json`.
- Endpoints are sorted by `method + path`.

Schema registry integrity:
- All schema references in endpoints resolve to `schemas.json`.
- Object schemas are explicitly strict (`additionalProperties: false` or `unevaluatedProperties: false`).
- Schemas are sorted by name.

Response completeness:
- Every response entry includes either `schemaRef` or `jsonSchema`.

Lossless OpenAPI output:
- `emit.openapi` must preserve schema semantics and operation coverage against `api-schema-sdk.json` (byte stability is not required).
## Verification harness

Run from repo root:

```bash
node .agent/plans/external/castr/verify-castr-fixtures.mjs
```

Optional arguments:

```bash
node .agent/plans/external/castr/verify-castr-fixtures.mjs --dir .agent/plans/external/castr
node .agent/plans/external/castr/verify-castr-fixtures.mjs --bundle /path/to/castr-bundle.json
```

The harness also validates `castr-bundle.sample.json` if present to prove the bundle schema wiring.
It prints a short human summary to stderr (eslint-style counts + failures) and the full JSON report to stdout.

By default the sample bundle only checks shape (not file existence). Use `--strict-sample` to enforce asset existence:

```bash
node .agent/plans/external/castr/verify-castr-fixtures.mjs --strict-sample
```

## Local castr checkout

Target path for local development: `~/code/personal/castr` (repo: `git@github.com:EngraphCode/castr.git`).

## Refresh guidance

These are static snapshots. Refresh only when the upstream schema changes and the contract must move in lockstep; update the 3.0 and 3.1 fixtures together.
