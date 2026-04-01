---
fitness_line_target: 315
fitness_line_limit: 425
fitness_char_limit: 25500
fitness_line_length: 100
split_strategy: 'Extract workspace-specific troubleshooting to workspace READMEs'
---

# Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the Oak Open Curriculum Ecosystem. Follow the steps in order for each issue.

## Quick Diagnostics

Run these commands from the repo root to check your setup:

```bash
node --version           # Should be 24.x
pnpm --version           # Should be 10.x
pnpm install             # Install dependencies
pnpm sdk-codegen         # Generate types from OpenAPI schema
pnpm build               # Build all workspaces
pnpm type-check          # Verify no type errors
pnpm test                # Run unit and integration tests
```

## Common Issues

### Credential policy

Real credentials must be kept in local `.env` / `.env.local` files only.
Those files are gitignored and should never be committed.
Use `.env.example` and other docs as placeholders.

### Type Generation Fails

**Symptoms**: `pnpm sdk-codegen` fails or produces unexpected output.

**Steps**:

1. Ensure `OAK_API_KEY` is set in root `.env` (or `.env.e2e`)
2. Check network access to `open-api.thenational.academy`
3. Run `pnpm clean && pnpm sdk-codegen` for a fresh generation

### Build Fails After Type Generation

**Symptoms**: `pnpm build` fails after successful `pnpm sdk-codegen`.

**Steps**:

1. Run `pnpm clean` then `pnpm sdk-codegen && pnpm build` in sequence
2. Check for circular dependencies: generated types should flow from SDK to apps
3. Verify `tsconfig.json` references are correct in the failing workspace

### E2E Tests Fail

**Symptoms**: `pnpm test:e2e` fails with connection or auth errors.

**Steps**:

1. Ensure the app builds successfully: `pnpm build`
2. For streamable-http E2E tests: no env vars needed (tests use DI with isolated config)
3. For smoke tests: ensure `OAK_API_KEY` and `CLERK_*` keys are set
4. Check that no other process is using port 3333 (streamable-http default)

### Smoke Tests Fail

**Symptoms**: `pnpm smoke:dev:stub` fails.

**Steps**:

1. Ensure `pnpm build` succeeds first (smoke tests depend on built artefacts)
2. Check that all E2E tests pass first (`pnpm test:e2e`)
3. For live smoke tests (`smoke:dev:live`): ensure `OAK_API_KEY` is set

### ESLint Reports Boundary Violations

**Symptoms**: `pnpm lint:fix` reports import boundary errors.

**Steps**:

1. Apps must not import from other apps
2. SDKs must not import from apps
3. Core packages must not import from SDKs or apps
4. Check that imports flow in the correct direction: core -> libs -> sdks -> apps

### Missing Environment Variables

**Symptoms**: App fails to start with "required variable" error.

**Steps**:

1. Copy `.env.example` to `.env` at the repo root
2. For search CLI: copy `apps/oak-search-cli/.env.example` to `apps/oak-search-cli/.env.local`
3. See [environment-variables.md](./environment-variables.md) for the complete reference

## Search Reindex Boundary

When deploying code changes that affect how search documents are built or how
canonical URLs are generated, some improvements only take effect in the search
index after a full re-ingest. This section separates deploy-safe correctness
from stale-index evidence so operators know what to expect at each stage.

### Deploy-safe code correctness

These URL fields are generated correctly by current code in
`apps/oak-search-cli/src/lib/indexing/`. Any documents created by a fresh
ingest will have correct values:

All `generate*CanonicalUrl()` functions are defined in `canonical-url-generator.ts`
and called from the respective document builders/cores listed below.

| Field          | Source file                    | Status                                                 |
| -------------- | ------------------------------ | ------------------------------------------------------ |
| `lesson_url`   | `lesson-document-builder.ts`   | Required; emitted via `generateLessonCanonicalUrl()`   |
| `unit_url`     | `unit-document-core.ts`        | Required; emitted via `generateUnitCanonicalUrl()`     |
| `unit_urls`    | `lesson-document-core.ts`      | Required; array of canonical unit URLs                 |
| `sequence_url` | `sequence-document-builder.ts` | Required; emitted via `generateSequenceCanonicalUrl()` |
| `thread_url`   | `thread-document-builder.ts`   | Intentionally omitted (threads have no Oak web page)   |

The `thread_url` field remains in the Elasticsearch mapping and Zod schema as
optional for backward compatibility with existing indexed documents (see
`packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/curriculum.ts`).

### Stale index evidence

After deploying code that changes URL generation or document-building logic,
existing indexed documents retain their old field values until a re-ingest
replaces them. Common symptoms of stale index data:

- Search results contain `thread_url` values even though current code omits
  the field — these are legacy documents from before the field was dropped.
- `lesson_url` values use an older URL pattern — documents indexed before the
  canonical URL fix still carry the previous format.

These are **not** code bugs. They clear after a re-ingest.

### Post-deploy reindex validation

After deploying code changes that affect document building or URL generation,
run the following from the `apps/oak-search-cli` workspace to refresh the
indices.

**Authoritative source**: The complete ingestion workflow, CLI flags, and
architecture details are documented in
[apps/oak-search-cli/operations/ingestion/README.md](../../apps/oak-search-cli/operations/ingestion/README.md).
The commands below are a summary — consult the ingestion README for the full
reference.

**Full re-ingest** (replaces all documents):

```bash
# 1. Ensure Redis is running (required for SDK response caching)
pnpm redis:status   # check if already running
pnpm redis:up       # start if not

# 2. Re-download bulk data from the upstream API
pnpm bulk:download

# 3. Regenerate codegen artefacts from fresh bulk data
pnpm bulk:codegen

# 4. Reset indices and re-create mappings from current schema
pnpm es:setup reset

# 5. Full re-ingest all subjects (API mode)
pnpm es:ingest -- --api --all --verbose

# 6. Verify document counts and coverage
pnpm ingest:verify

# 7. Check index health
pnpm es:status
```

**Targeted thread-only re-ingest** (if only thread documents are stale):

```bash
pnpm es:ingest -- --index threads --verbose
```

**Validation checklist** after re-ingest:

1. Run `pnpm ingest:verify` — all subjects should report expected counts.
2. Run `pnpm es:status` — all indices should be green with expected document
   counts.
3. Spot-check search results for `thread_url` — field should be absent from
   newly indexed thread documents.
4. Spot-check `lesson_url`, `unit_url`, `sequence_url` values — all should
   use the current canonical URL format.

## Known Gate Caveats

As of **25 February 2026**, `pnpm qg` is known to fail in clean local runs:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (fails in `pnpm qg` via `test:ui`)

If `pnpm qg` fails, run the affected suite directly and check latest issues/ADRs/plans before assuming local setup problems.

## Quick Fixes

| Symptom                                                 | Fix                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm publish --dry-run` fails with uncommitted changes | Add `--no-git-checks` flag                                      |
| `pnpm benchmark` not found                              | The command is `pnpm benchmark` (not `pnpm eval:benchmark`)     |
| E2E `tool-examples-metadata` flaky                      | SSE payload timing issue — retry once before investigating      |
| Test upstream API status codes                          | `curl -s -w "\n%{http_code}" <url>` to see both body and status |

## Quality Gate Failures

If any quality gate fails, run the full chain in order to isolate the issue:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Each gate may fix issues for subsequent gates (e.g. `format:root` fixes formatting that `lint:fix` then passes).

### CI Passes Locally but Fails in CI

Check CI logs for "cache hit, replaying logs" — stale remote Turbo cache. Ensure `turbo.json` `inputs` use `**/*.ts` not directory enumeration.

### Pre-Commit Hook Output Too Large

Turbo replays all cached logs during the hook. Redirect output to a file and read the end for the actual error.

### Pre-Commit Blocks Partial Fixes

The hook runs full `type-check lint test` across all packages. On lint-red branches, fix ALL lint errors before attempting any commit — partial fixes will still be blocked by errors elsewhere.

### ESLint Complexity Threshold on Short Functions

`??` and `?.` each count as branches toward the complexity limit. A 15-line function can hit complexity 10 from nullish coalescing alone. Extract an options-resolver helper to move the coalescing out of the main function.

## File Move and Refactoring Issues

### ESLint Rule Overrides After File Moves

When moving files between workspaces, ESLint rule overrides must also move — otherwise lint errors appear silently in the destination. Also check that relative links in README files adjust for directory depth changes (e.g. `../../../docs/` may become `../../../../docs/`).

### Stale tsup Entry Points

Stale tsup entries match nothing silently after file moves — remove dead entry points promptly.

### Stale ADR File Paths

ADR Implementation sections have file paths that go stale when packages are moved. Always grep ADRs for old paths after a move. Similarly, check TSDoc `@see` links for old GitHub repo URLs when removing a workspace.

### Cross-Package Function Moves

After moving functions between packages (e.g. from `search-cli` to `curriculum-sdk`), rebuild the source package (`pnpm --filter <pkg> build`) before downstream tests will see the new exports via `dist/`. Turborepo cache may hide the issue until a clean build.

### Second-Level Barrels

When migrating facade imports, check for second-level barrels (e.g. `oak.ts` re-exporting from the facade) — they add hidden consumers that do not appear in a direct grep for the facade file.

### TS2209 rootDir Ambiguity

When `tsconfig.build.json` narrows `include` from a wide base, add explicit `rootDir: "./src"` for export map resolution.

### Vitest v4 Test Filtering

`--testPathPattern` fails in vitest v4. Use file paths as positional args instead: `pnpm vitest run path/to/test.ts`.

## Agent Workflow Issues

### Background Reviewer Agents Not Returned

Reviewer sub-agents dispatched near the end of a conversation turn may be lost when the turn completes. Re-invoke in the next session.

### MCP Tool Call Fails with Wrong Param Type

Always read tool descriptors before calling — parameter types are explicit in the schema. Do not guess parameter shapes.

### Commitlint Rejects Commit

See CONTRIBUTING.md §Code Standards for `subject-case` and `body-max-line-length` rules.

### Worktree Agent Patches Don't Apply to Feature Branch

Worktree agents branch from `main`, not the current feature branch. When `main` and feature have diverged, manual file copy and reconciliation is needed.

### Codex Reviewer Not Resolved

Resolve every reviewer with `pnpm agent-tools:codex-reviewer-resolve <name>` before trusting a Codex review. The underlying `tsx` call may need escalation because it opens a local IPC pipe under `/var/folders/...`.

### StrReplace Fails on Plan Files

Unicode quotes (U+2019, U+201C/D) block exact string matching. Copy the target string from the file rather than typing it.

### Reviewer Reports Failures That Seem Wrong

Re-run specific gates to verify — reviewers may read stale output. Verify reviewer claims with `glob` or `ls`; they produce consistent false positives on file names and repo names.

## TSDoc Issues

- `{@link ./path}` is NOT valid TSDoc — use backtick references for module paths.
- Braces `{ }` in TSDoc trigger malformed inline tag errors.
- `>` in TSDoc examples needs backslash escape.
- Never use `\x00` in regex — use string-based placeholders (e.g. `___TSDOC_SAFE_N___`).
- `openapiTS` emits `@constant` as both single-line (`/** @constant */`) and multi-line — regex must handle both forms.
- ESLint plugins using dynamic file resolution (`@microsoft/tsdoc-config`) must be marked `external` in tsup bundles.
- `tsdoc.json` `extends` works with `@microsoft/tsdoc-config` 0.18.0; `TSDocConfigFile.findConfigPathForFolder` stops at `package.json`/`tsconfig.json` boundaries — each workspace needs its own `tsdoc.json` with `extends`.
