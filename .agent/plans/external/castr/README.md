# Castr validation fixtures (Oak Open Curriculum)

## Intent

Provide canonical inputs for validating `@engraph/castr` against a real, schema-first pipeline. These two JSON files are the ground truth for the Oak Open Curriculum API in this repo: every generated type, validator, and MCP tool ultimately flows from them (see `.agent/directives-and-memory/rules.md` and `.agent/directives-and-memory/schema-first-execution.md`). The SDK-decorated schema is the input passed to castr; the original schema is retained for provenance and upstream feedback.

## Contents

- `api-schema-original.json`
  - Source: `packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json`
  - Meaning: upstream OpenAPI schema as returned by the Oak API (no local decoration)
- `api-schema-sdk.json`
  - Source: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`
  - Meaning: SDK-enhanced OpenAPI schema with canonical URL metadata and temporary 404 documentation applied
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

## Potential avenues for use (automated checks)

- **IR determinism**: parse `api-schema-sdk.json` and assert stable, sorted IR output across runs.
- **Emitter parity**: emit Zod v4 and TypeScript from castr and compare structural parity against the SDK artefacts.
- **Endpoint map validation**: ensure method + path -> operationId and response status mappings match SDK outputs.
- **Decoration checks**: verify `canonicalUrl` injection and the transcript 404 response are present only in the SDK schema.
- **Round-trip safety**: OpenAPI -> IR -> OpenAPI normalised output must be lossless against the SDK schema.

## Contract files

- `castr-ir.schema.json` defines the minimal IR shape required to reproduce the Oak SDK outputs, including strictness and lossless OpenAPI requirements.
- `castr-bundle.schema.json` defines a required manifest that points to IR and emitter outputs for automated checks (OpenAPI output is mandatory).

## Requirements (Oak contract)

- Castr consumes the SDK-decorated schema (`api-schema-sdk.json`), not the upstream original.
- Output must be strict: object schemas reject unknown keys and fail fast with explicit errors.
- Output must be lossless: normalised OpenAPI output must be identical to the SDK input schema.
- Ordering must be deterministic for schema and endpoint registries.
- Bundle manifest is required for validation runs.
- TypeScript output must export `paths` and `components` types for the SDK client and public API.

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

## Local castr checkout

Target path for local development: `~/code/personal/castr` (repo: `git@github.com:EngraphCode/castr.git`).

## Refresh guidance

These are snapshots. Refresh by running `pnpm -F @oaknational/oak-curriculum-sdk type-gen`, then re-copy the two files into this folder.
