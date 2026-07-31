# @oaknational/sdk-codegen

Generation-time workspace for the Oak Curriculum SDK, implementing
[ADR-108 Step 1](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

## Status

**Phases 0–6 complete** — workspace hosts both data pipelines (API
and bulk), all generated artefacts, 11 subpath exports, and ESLint
boundary rules. Phase 7 (CI drift check) remains.

## Two Data Pipelines

This workspace hosts two internally partitioned data pipelines
that run during `pnpm sdk-codegen`:

- **API pipeline** (`code-generation/`, `schema-cache/`,
  `src/types/generated/`): OpenAPI spec to TypeScript types, Zod
  schemas, MCP tool descriptors, and response validators. The
  **response-map** subsystem (`code-generation/typegen/response-map/`)
  builds a flat map of operation/status entries, consolidates
  shared error schemas into wildcards, and emits Zod-based
  response validators. Component names from `$ref` are sanitised
  to match Zod registry keys. Consumed by the curriculum SDK
  runtime and MCP server apps.

- **Bulk pipeline** (`vocab-gen/`, `src/bulk/`,
  `src/generated/vocab/`): bulk download JSON files to types,
  extractors, Elasticsearch mappings, knowledge graphs, and
  vocabulary artefacts. Consumed by the search SDK and search CLI.

### Typegen vs codegen naming

Within `code-generation/`, modules are named by responsibility:

- **`typegen-*`** — type-focused: extract and emit TypeScript types from the
  OpenAPI schema (`typegen-extraction.ts`, `typegen-writers.ts`,
  `typegen-interface-gen.ts`, etc.)
- **`codegen-*`** — orchestration and broad code generation: entry point,
  pipeline coordination, validators, MCP tools (`codegen.ts`, `codegen-core.ts`,
  etc.)
- **`typegen/`** — directory of generator templates (paths, parameters, mcp-tools)

## Subpath Exports

Generated artefacts are exposed through subpath exports rather than a
single monolithic barrel. Subpaths are one level deep only.

| Subpath                                     | Domain                                               | Barrel                    |
| ------------------------------------------- | ---------------------------------------------------- | ------------------------- |
| `@oaknational/sdk-codegen`                  | curated subset                                       | `src/index.ts`            |
| `@oaknational/sdk-codegen/api-schema`       | API types, paths, routing, validation, errors        | `src/api-schema.ts`       |
| `@oaknational/sdk-codegen/mcp-tools`        | tool descriptors, execution, stubs, scopes           | `src/mcp-tools.ts`        |
| `@oaknational/sdk-codegen/search`           | index docs, scopes, facets, suggestions, ES mappings | `src/search.ts`           |
| `@oaknational/sdk-codegen/zod`              | Zod schemas                                          | `src/zod.ts`              |
| `@oaknational/sdk-codegen/bulk`             | bulk pipeline APIs, schemas, types                   | `src/bulk.ts`             |
| `@oaknational/sdk-codegen/vocab`            | types, concept graph ontology                        | `src/vocab.ts`            |
| `@oaknational/sdk-codegen/vocab-data`       | runtime graph data (large generated structures)      | `src/vocab-data.ts`       |
| `@oaknational/sdk-codegen/query-parser`     | query parser types                                   | `src/query-parser.ts`     |
| `@oaknational/sdk-codegen/observability`    | zero-hit telemetry                                   | `src/observability.ts`    |
| `@oaknational/sdk-codegen/admin`            | admin fixtures                                       | `src/admin.ts`            |
| `@oaknational/sdk-codegen/widget-constants` | widget URI                                           | `src/widget-constants.ts` |

## Boundary Rules

Enforced by ESLint SDK boundary rules (`createSdkBoundaryRules`
in `@oaknational/eslint-plugin-standards`):

- **This workspace cannot import from the runtime SDK**
  (`@oaknational/curriculum-sdk`). The dependency direction is
  one-way: runtime depends on generation, not vice versa.

- **Consumers must use barrel imports only** via the subpath
  exports listed above. Deep paths into internal directories are
  blocked by the `@oaknational/sdk-codegen/*/**`
  ESLint pattern.

## Scripts

```bash
pnpm build        # Build with tsup + tsc declarations
pnpm clean        # Remove dist and turbo cache
pnpm sdk-codegen  # Regenerate types from OpenAPI schema (runs generate:clean first)
pnpm type-check   # Type-check without emitting
pnpm lint         # Lint with ESLint
pnpm lint:fix     # Lint and auto-fix
pnpm scan:sitemap # Refresh canonical URL sitemap reference data (network required)
pnpm test         # Run tests
```

`scan:sitemap` generates `reference/canonical-url-map.json` from the live OWA
sitemap and is used by the canonical URL validation workflow (ADR-132). It is
an operator/maintenance command, not part of CI.

During `pnpm sdk-codegen`, the code-generation pipeline also runs a
post-generation sitemap reference validation step (`runSitemapValidation`).
This is currently a soft gate: malformed reference data still emits warnings,
but an absent local reference file is logged as informational output with
regeneration guidance rather than failing code generation. Programme listing
validation is strict: it only validates slugs whose canonical
`/teachers/programmes/{slug}/units` listing page exists in the sitemap
reference. Deep programme lesson routes on their own do not create a listing
validation target.

### `generate:clean` caveat

`generate:clean` removes `src/types/generated/` before regeneration. If
`sdk-codegen` fails after the clean step, the workspace is left without
generated artefacts and will not compile. Re-run `pnpm sdk-codegen` from the
repo root to recover. A future improvement could use atomic
write-to-temp-then-rename to prevent this intermediate broken state.

## Responding to Upstream Spec Changes

The cardinal rule promises that `pnpm sdk-codegen` followed by `pnpm build`
realigns every workspace when the upstream OpenAPI spec changes. This section
is the operational runbook for that moment, grounded in the 2026-06-12
alignment with the upstream description rewrite (oak-openapi pull request 269).

### Characterise the drift first-hand before regenerating

1. **Fetch and normalise both specs.** The live spec is
   `https://open-api.thenational.academy/api/v0/swagger.json`; the committed
   baseline is `schema-cache/api-schema-original.json`. Normalise both through
   `jq -S .` and diff.
2. **Separate structural from documentation drift.** Strip prose fields and
   diff again — when this second diff is empty apart from `info.version`, the
   change is documentation-only and no type, schema, or runtime behaviour can
   be affected:

   ```bash
   jq -S 'walk(if type == "object" then del(.description, .summary) else . end)' <spec>
   ```

3. **Read the change at source.** `info.version` embeds the upstream deploy's
   commit SHA (`0.7.0-<sha>`). With an `oak-openapi` checkout available,
   `git log <cached-sha>..<live-sha>` names the exact upstream commits. The
   API's own changelog (`GET /changelog/latest`) records _versioned_ changes
   only — documentation-only deploys move the build hash without a changelog
   entry, so an empty changelog delta does not mean an unchanged spec.
4. **Classify structural drift as additive or consumer-breaking.** Separating
   structural from documentation drift (step 2) is not enough — a structural
   change still divides into two kinds, and the distinction is what a consumer
   needs to know:
   - **Additive** — a new path, a new optional parameter, a widened response.
     Existing callers keep working.
   - **Consumer-breaking** — a path or parameter renamed or removed, a parameter
     made required, a response type narrowed. Existing callers that named the old
     shape must change. A rename flows through codegen cleanly and type-checks
     green (the flow below), yet it _is_ a contract change for callers: e.g. the
     2026-06-18 `/sequences/{slug}` → `/sequences/{sequence}` rename is
     consumer-breaking at the MCP tool input boundary even though it cost zero
     hand-edits. For the MCP transport the break is self-healing (agents read the
     live `inputSchema` each session); for any pinned SDK consumer it is not.
     Record consumer-breaking changes in the changelog / PR description with a
     one-line migration note, even when the in-repo blast radius is zero.

### Run the designed alignment path

Run `pnpm sdk-codegen` from the repo root, then the ordinary gate chain. Two
behaviours to know:

- **Cached everywhere, refresh deliberately.** Every build environment —
  local, CI, and deployment builds alike — reads the committed
  `schema-cache/api-schema-original.json` (MCP-130): codegen is hermetic and
  deterministic, and an upstream schema update never changes a build as a
  side-effect. The schema cache is a committed artefact: refreshing and
  committing it IS the alignment act. The deliberate refresh path is the root
  `pnpm sdk-codegen:refresh` — it fetches the live spec (online mode, with
  `--force=true` so a turbo cache replay cannot mask the fetch) and then runs
  the full build for immediate compile feedback. The CI schema-drift check
  surfaces when the committed cache is behind upstream.
- **Verifying a refresh.** After `pnpm sdk-codegen:refresh`, check
  `info.version` moved in both the schema cache and
  `src/types/generated/api-schema/api-schema-original.json`.
- **Expect a schema-vs-tools delta.** Generation runs on the upstream document minus the
  paths declared in `code-generation/excluded-paths.ts`, so a path present in the schema
  cache with no generated type, Zod schema, or MCP tool is by design, not drift. Each
  constant's TSDoc names the generators it binds and says whether it is a permanent design
  exclusion or a deferral with a ticket to lift it.

### The spec→input-parameter flow is compile-time-enforced, not test-enforced

Every API (path-proxying) tool's input parameters flow automatically from the
spec, and that flow is guaranteed by three layers — **none of which is a runtime
test**:

- **Single-source codegen.** A generated tool's input schema comes only from its
  generated descriptor (`requireGeneratedToolInputShape`); generated files are
  `DO NOT EDIT` and reproduced by the generator. There is no seam through which a
  hand-authored API-tool parameter can enter. (The four aggregated tools —
  `search`, `fetch`, `get-curriculum-model`, `download-asset` — are
  application-level composites with no single upstream path; their hand-written
  schemas are a distinct class, not API-endpoint parameters.)
- **The type checker.** Each tool's nested `ToolPathParams` is
  `satisfies ToolDescriptor<…>` against the spec-typed `api-paths-types.ts`, and
  `transformFlatToNestedArgs(flat): ToolArgs` is typed so the flat→nested
  round-trip will not compile if it drifts. This includes the deliberate
  `normaliseParamName` simplification (the `Slug` suffix is stripped for the
  MCP-facing flat name, e.g. `threadSlug` → `thread`, while the spec-faithful
  name stays in the nested schema). A deliberate `sequence`→`slug` drift in a
  generated tool fails `tsc` with `error TS2322` — proof the flow is held at
  compile time.
- **Codegen idempotency.** Re-running `sdk-codegen` reproduces byte-identical
  output, so the committed generated files _are_ the current spec.

Do **not** add a Vitest test asserting that tool parameters match the spec. Such
a test proves configuration and duplicates the type checker — types are the type
checker's job. If you want to confirm the invariant holds, run `type-check`, not
a unit test. The path toward fully automating spec-change handling is captured in
[`upstream-spec-change-automation.plan.md`](../../../.agent/plans-backlog-2026-07/sdk-and-mcp-enhancements/future/upstream-spec-change-automation.plan.md).

### Expect the correction-layer tripwires to fire

Codegen carries correction layers for known-false upstream claims, each
guarded by a removal-condition test that reads the schema cache
(`param-description-overrides.ts` is the live exemplar). When upstream fixes
or rewords a corrected claim, the guard test FAILS on the first post-refresh
run — by design. The failure message names the cure: delete the correction
entry (retiring the whole mechanism when its map empties — git history
preserves it) or re-ground it against the new wording. Treat these failures
as the lifecycle signal they are, not as regressions.

### Verify the served surface, not just the gates

Generated MCP tool descriptions are the agent-facing product surface.
After regeneration, read at least one changed descriptor under
`src/types/generated/api-schema/mcp-tools/tools/` end-to-end and confirm the
decoration layers (prerequisite guidance, per-tool enhancement notes) still
compose correctly with the new upstream text.

## Design Decisions

Evaluated during Phase 6 of [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

### F12 — Barrel auto-generation

**Decision: keep manual.** Barrel files (`src/mcp-tools.ts`, `src/search.ts`,
etc.) are maintained by hand. Auto-generating them was evaluated and
rejected: the barrels are few (11), change infrequently, and manually
curating named exports prevents accidental public-API expansion. When
adding generated artefacts, update the corresponding barrel file and
run `pnpm build` to verify the export map.

### F13 — Subpath granularity

**Decision: keep as-is.** Each subpath currently exports 8–18 symbols,
which balances discoverability against import specificity. Splitting
further (e.g. per-tool subpaths) was evaluated and rejected: it would
multiply configuration surface in `package.json` exports without
meaningful tree-shaking benefit, since consumers already import only
the symbols they need from each barrel.

### F14 — OakApiPathBasedClient

**Decision: keep in codegen.** `OakApiPathBasedClient` is a
schema-derived type (parameterised over generated API paths) and
belongs in the generation workspace. It was evaluated for migration
to the runtime SDK but rejected because the type's definition depends
on generated path literals that are only available at codegen time.

## Upstream-refresh guard

A naive regeneration against a refreshed upstream API can mint an
UNCALLABLE tool: a new POST/`requestBody` endpoint flowing through the
read-shaped path would be advertised with `readOnlyHint: true` and a
GET-shaped input surface (risk recorded on MCP-152, 2026-07-2x). At every
upstream refresh, diff the endpoint METHOD set first — any new non-GET
endpoint needs deliberate handling (a write-shaped registration or an
explicit exclusion) before the generated surface ships.

## References

- [ADR-108: SDK Workspace Decomposition](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [ADR-065: Turbo Task Dependencies](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)
- [ADR-086: Vocab Mining and Graph Export](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)
- SDK Workspace Separation Plan (archived as
  `.agent/plans/semantic-search/archive/completed/sdk-workspace-separation.md`)
