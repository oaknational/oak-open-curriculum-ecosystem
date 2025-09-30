# Elasticsearch Serverless Sandbox Ingestion Harness

## Purpose

Establish a repeatable sandbox ingestion workflow that exercises the full indexing pipeline against Elasticsearch Serverless without touching production indices. The harness must:

- Seed a tiny, deterministic set of Oak curriculum data into `_sandbox` indices so developers can validate mappings, analyzers, and cache invalidation locally.
- Run entirely via the official `@elastic/elasticsearch` client with structured logging and a dry-run mode for inspections.
- Rely on the existing ingestion helpers (`buildIndexBulkOps`, `esBulk`) so behaviour mirrors production code paths.
- Provide automated coverage by stubbing the Oak SDK client and Elasticsearch transport, plus a manual drill for end-to-end verification against a real Serverless deployment.

## Components

### Fixture dataset

- Location: `apps/oak-open-curriculum-semantic-search/fixtures/sandbox/`.
- Files:
  - `key-stages.json` – list of key stage slugs included in the fixture (e.g. `ks2`).
  - `subjects.json` – subject slugs covered (e.g. `history`).
  - `units.json` – array of unit descriptors `{ keyStage, subject, unitSlug, unitTitle }`.
  - `lessons.json` – grouped lesson descriptors `{ keyStage, subject, unitSlug, lessons: [...] }` mirroring `GetLessonsFn` output.
  - `unit-summaries.json` – keyed by unit slug; each entry satisfies the SDK `unitSummarySchema`.
  - `lesson-summaries.json` – keyed by lesson slug; each entry satisfies the SDK `lessonSummarySchema`.
  - `lesson-transcripts.json` – keyed by lesson slug with `{ transcript, vtt }` payloads consumed by `getLessonTranscript`.
  - `subject-sequences.json` – map of subject slug → sequences array validated by `subjectSequencesSchema`.
  - `sequence-units.json` – map of `sequenceSlug` → raw payload consumed by `extractSequenceFacetSource` (stored as arrays for easy traversal).
- Each file contains a single KS2 history programme (one unit, two lessons) so the harness exercises lessons, unit rollups, and sequence facets without slowing tests.
- Fixtures are consumed directly by `createFixtureOakClient`, and `sandbox-harness.unit.test.ts` verifies the dataset remains compliant with the generated Zod schemas.

### Index targeting helper

- New module `src/lib/search-index-target.ts` exposes:
  - `type SearchIndexTarget = 'primary' | 'sandbox'`.
  - `resolveSearchIndexName(kind, target)` returning the correct index (`oak_lessons` or `oak_lessons_sandbox`).
  - `coerceSearchIndexTarget({ envValue, flag })` to derive the desired target from the `SEARCH_INDEX_TARGET` env var or CLI flag.
  - `rewriteBulkOperations(ops, target)` to rewrite `_index` values inside bulk action objects.
- All ingestion/search modules will import this helper instead of hard-coding index names. For read paths (search, suggestions) the helper returns the correct index at request-build time.
- `env.ts` will gain an optional `SEARCH_INDEX_TARGET` field defaulting to `primary`, validated with Zod.

### Harness orchestrator

- Module `src/lib/indexing/sandbox-harness.ts` exports `createSandboxHarness(options)` where `options` include:
  - `fixtureRoot` – defaults to the bundled fixture directory.
  - Optional overrides for `client`, `keyStages`, `subjects`, `es` transport, and `logger` (defaults to `sandboxLogger`).
  - `target` – defaults to the current environment target but overridable per invocation.
- API surface:
  - `prepareBulkOperations()` – builds primary bulk operations, rewrites `_index` values via `rewriteBulkOperations`, and returns `{ operations, summary }` (with per-index counts and total docs).
  - `ingest({ dryRun, verbose })` – calls `prepareBulkOperations`, logs summary metadata, previews NDJSON when requested, and POSTs to `/_bulk` when not in dry-run mode.
- `createFixtureOakClient` loads the JSON fixtures, satisfies the `OakClient` interface, and returns the key stage + subject lists required by `buildIndexBulkOps`.

### CLI entry point

- Script: `scripts/sandbox/ingest.ts`, wired via `pnpm -C apps/oak-open-curriculum-semantic-search sandbox:ingest` (uses `tsx`).
- Flags:
  - `--target <primary|sandbox>` – override the index target for a single run.
  - `--dry-run` – skip the Elasticsearch `_bulk` request while still producing summary logs.
  - `--verbose` – log the first few NDJSON lines for inspection.
  - `--fixture <path>` – point at an alternate fixture root.
- The CLI logs inputs and outcomes through `sandboxLogger` and exits non-zero on failure so automation can detect issues quickly.

### Logging & telemetry

- Logs emitted through `@oaknational/mcp-logger` with structure:
  - `info`: summary counts per index, target, dry-run flag.
  - `debug`: detailed bulk line preview (first N lines) when `--verbose`.
  - `error`: failures with contextual metadata (target, subject, keyStage).
- CLI will surface an explicit success message containing document counts so manual drills can compare against Elasticsearch stats.

## Testing Strategy

- **Unit tests** (`sandbox-harness.unit.test.ts`):
  - Exercise the harness against the bundled fixtures to validate per-index counts and `_sandbox` rewrites.
  - Stub the Elasticsearch transport to verify NDJSON dispatch on real runs and absence of calls during dry-run execution.
- Additional CLI integration coverage can be layered if future work requires end-to-end invocation checks.

## Manual drill

1. Provision an Elasticsearch Serverless project (or dedicated sandbox endpoint) and capture the URL + API key.
2. Export env vars (including `SEARCH_INDEX_TARGET=sandbox` and fixture path if customised).
3. Run `pnpm -C apps/oak-open-curriculum-semantic-search sandbox:ingest --target sandbox --verbose`.
4. Verify CLI summary output matches fixture expectations (`lessons=2`, `units=1`, `unit_rollup=1`, `sequence_facets=1`).
5. Use Kibana Dev Tools or `@elastic/elasticsearch` client to query `_cat/indices/oak_lessons_sandbox` etc., confirming document totals and mappings.
6. Run `pnpm -C apps/oak-open-curriculum-semantic-search sandbox:ingest --target sandbox --dry-run` to ensure dry-run path emits NDJSON without mutating indices.
7. Record drill outcome in `.agent/plans/semantic-search/semantic-search-target-alignment-context.md`.

## Follow-up tasks

- Extend the CLI with an option to emit counts as JSON for pipeline consumption (optional).
- Layer an integration test that drives the CLI entrypoint once end-to-end verification is required.
- Surface sandbox index metrics in the admin dashboard so operators can compare primary vs sandbox populations (tracked in the broader admin telemetry work).
