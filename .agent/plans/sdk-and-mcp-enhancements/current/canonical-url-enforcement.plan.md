---
name: "Canonical URL Validation Enforcement"
overview: "Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage"
todos:
  - id: ws1-red
    content: "WS1 (RED): Write failing tests for configurable validation strictness and ingestion-time URL validation."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): Implement configurable gate in codegen and ingestion-time validation in document builders."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): TSDoc, NL guidance, README updates for the enforcement layer."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (sdk-codegen through smoke:dev:stub)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews. Document findings."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to ADR-132 and relevant READMEs."
    status: pending
isProject: false
---

# Canonical URL Validation Enforcement

**Last Updated**: 2026-03-10
**Status**: QUEUED
**Scope**: Promote canonical URL validation from observation (warn-only) to
enforcement (configurable gate), and extend validation into the search
ingestion pipeline so invalid URLs are caught before reaching Elasticsearch.

---

## Context

### What Exists

The canonical URL validation layer (WS1-WS5 of the predecessor plan) provides:

1. **Binary search validation** (`validate-canonical-urls.ts`) — O(log n) lookup
   against the sorted `teacherPaths` array from the sitemap reference map.
2. **Codegen integration** (`codegen.ts`) — post-generation step validates
   sequence and programme URLs, logs warnings for invalid URLs.
3. **Typed error handling** — `SitemapRefError` discriminated union with four
   error kinds (`file_not_found`, `invalid_json`, `schema_mismatch`,
   `unsorted_paths`).
4. **25 tests** (12 unit, 13 integration) with fail-fast behaviour.

### Problem Statement

The validation layer **observes** but does not **enforce**. Specifically:

1. **Codegen continues on invalid URLs** — invalid sequence/programme URLs are
   logged as warnings but codegen completes successfully. The SDK ships with
   URLs that are known to be wrong.
2. **Search ingestion is unprotected** — the ingestion pipeline generates URLs
   from slugs (`canonical-url-generator.ts`) and writes them directly to ES
   documents. No validation occurs. A bad slug produces a bad URL in the live
   search index.
3. **Two URL generation paths, zero validation** — the API path trusts
   `SearchUnitSummary.canonicalUrl` from the curriculum-sdk; the bulk path
   generates URLs deterministically. Neither path validates against the
   sitemap reference.

### Current URL Flow (No Enforcement)

```text
Codegen: generate-url-helpers.ts → validate-canonical-urls.ts → WARN only
                                                                    ↓
Ingestion (API):  curriculum-sdk → document-transforms.ts → ES  [no check]
Ingestion (Bulk): slug → canonical-url-generator.ts → ES        [no check]
```

### Target URL Flow (With Enforcement)

```text
Codegen: generate-url-helpers.ts → validate-canonical-urls.ts → FAIL on invalid
                                                                    ↓
Ingestion (API):  curriculum-sdk → validateUrl() → document → ES [checked]
Ingestion (Bulk): slug → generate URL → validateUrl() → ES      [checked]
```

---

## Design Principles

1. **Fail fast, not fail silent** — invalid URLs should stop the pipeline,
   not propagate silently. This aligns with the core principle: "Detect
   problems early, fail immediately, be specific, guide resolution."
2. **Generator-first** — validation logic lives in `sdk-codegen` and is
   consumed by apps. The generator is the single source of truth.
3. **Configurable strictness** — codegen and ingestion accept a
   `--strict-urls` / `--skip-url-validation` flag to control whether invalid
   URLs cause failure. Default: strict in CI, warn in local dev.
4. **Reuse existing primitives** — `validateUrl()` and `loadSitemapReference()`
   already exist and are tested. Extend, don't rebuild.

**Non-Goals** (YAGNI):

- Adding a `validation_status` field to ES documents — if a URL is invalid,
  don't store it; don't store it with a "bad" flag.
- Runtime URL validation in MCP tool responses — too slow, requires network
  or reference map at runtime.
- Automatic sitemap refresh in CI — the scan hits the live site; manual
  refresh remains safer.
- Validating lesson direct URLs — these are a known sitemap gap (ADR-132);
  the sitemap does not contain `/teachers/lessons/{slug}` paths.

---

## WS1 — Test Specification (RED)

All tests MUST FAIL at the end of WS1.

### 1.1: Configurable Codegen Gate

**Tests**: `validate-canonical-urls.unit.test.ts` (extend existing)

- Given `strictMode: true` and invalid URLs detected,
  `runSitemapValidation` returns an error Result (not just a warning report)
- Given `strictMode: false` and invalid URLs detected,
  `runSitemapValidation` returns ok with the report (current behaviour)
- Given `strictMode: true` and all URLs valid,
  `runSitemapValidation` returns ok

### 1.2: Ingestion-Time URL Validation

**Tests**: `canonical-url-generator.unit.test.ts` (new or extend existing)

- Given a generated unit URL and a loaded sitemap reference, `validateUrl`
  returns `{ valid: true }` when the URL exists in `teacherPaths`
- Given a generated unit URL with a bad slug, `validateUrl` returns
  `{ valid: false, reason }` and the document builder receives the error
- Given `strictMode: true`, the document builder throws on an invalid URL
- Given `strictMode: false`, the document builder logs a warning and
  proceeds with the URL

### 1.3: Ingestion Harness Integration

**Tests**: `ingest-harness-ops.unit.test.ts` (extend existing)

- Given a sitemap reference path is configured, the ingestion harness loads
  the reference and passes `teacherPaths` to document builders
- Given no sitemap reference path, the ingestion harness skips validation
  (graceful degradation)

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests fail for the expected reason
3. No existing tests broken

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Export Validation Primitives from sdk-codegen

**File**: `packages/sdks/oak-sdk-codegen/src/index.ts` (or appropriate barrel)

**Changes**:

- Export `validateUrl`, `loadSitemapReference`, `validateGeneratedUrls` from
  the public API so that `oak-search-cli` can import them
- These are already pure functions with no side effects — safe to export

### 2.2: Configurable Strictness in Codegen

**File**: `code-generation/typegen/routing/validate-canonical-urls.ts`

**Changes**:

- Add optional `strict` parameter to `runSitemapValidation`
- When `strict: true` and `invalidCount > 0`, return an error Result
- When `strict: false` (default), return ok with the report (current behaviour)

**File**: `code-generation/codegen.ts`

**Changes**:

- Read `--strict-urls` CLI flag or `SDK_CODEGEN_STRICT_URLS` env var
- Pass strictness to `runSitemapValidation`
- When strict and validation fails, throw (build fails)
- Default: strict in CI (`process.env.CI === 'true'`), warn in local dev

### 2.3: Ingestion-Time Validation

**File**: `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts`

**Changes**:

- Accept optional `teacherPaths: readonly string[]` parameter
- When provided, call `validateUrl(url, teacherPaths)` before returning
- When invalid and strict mode: throw with specific error
- When invalid and non-strict: log warning, return URL anyway

**File**: `apps/oak-search-cli/src/lib/indexing/run-versioned-ingest.ts`

**Changes**:

- At ingestion start, attempt to load the sitemap reference via
  `loadSitemapReference()`
- Pass the loaded `teacherPaths` array through to document builders
- If reference file not found: log warning, proceed without validation
  (graceful degradation — same as codegen behaviour)

### 2.4: Document Builder Integration

**Files**: `unit-document-core.ts`, `sequence-document-builder.ts`,
`lesson-document-core.ts`

**Changes**:

- Accept optional `teacherPaths` in builder params
- Validate URLs before including in documents
- Use consistent error/warning behaviour based on strictness config

**Deterministic Validation**:

```bash
# Codegen strict mode — fails on invalid URLs
pnpm -F @oaknational/curriculum-sdk code-generation --strict-urls
# Expected: build fails if any sequence/programme URL is invalid

# Ingestion with validation — logs warnings for invalid URLs
pnpm oaksearch admin ingest --dry-run --verbose
# Expected: validation summary in output when reference map exists
```

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: TSDoc and NL Guidance

- TSDoc on all new/modified function signatures
- Document the `--strict-urls` flag in codegen help text
- Document the reference map loading in ingestion CLI help text

### 3.2: Documentation

- Update `packages/sdks/oak-sdk-codegen/README.md` — add enforcement
  section explaining strict vs warn modes
- Update ADR-132 — add "Enforcement" section documenting the promotion
  from warn-only to configurable gate

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Invoke specialist reviewers. Document findings. Create follow-up plan
if blockers found.

Recommended reviewers:

- `architecture-reviewer-fred` — boundary discipline for exports across
  sdk-codegen → search-cli
- `architecture-reviewer-wilma` — failure modes when reference map is
  stale, absent, or loading fails mid-ingestion
- `test-reviewer` — coverage adequacy for the new validation paths
- `code-reviewer` — gateway review for all changes

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Strict mode breaks CI when reference map is stale | Default to warn when reference map is absent; strict only when map exists and URLs fail |
| Cross-package import from sdk-codegen to search-cli | Export only pure functions; no side effects; validates at architectural boundary |
| Performance: loading 7.5 MB reference map during ingestion | Load once at start, pass `teacherPaths` array through — O(1) per-URL validation via binary search |
| Known sitemap gaps cause false failures | Only validate route categories covered by the sitemap (sequences, programmes); skip lessons (ADR-132 gap) |
| Ingestion interrupted by strict validation | Configurable: `--skip-url-validation` bypasses; default is warn in interactive, strict in CI |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **Principles.md**: Fail fast with helpful errors; generator-first mindset;
  no silent failures
- **Testing Strategy**: TDD throughout; pure function unit tests for
  validation logic; integration tests for pipeline flow
- **Schema-First Execution**: Validation primitives generated/maintained in
  sdk-codegen; apps consume without duplication
- **ADR-088**: Result pattern for all error paths
- **ADR-132**: Extends the validation layer from observation to enforcement

---

## Dependencies

**Blocking**:

- Canonical URL validation layer (predecessor plan) — **COMPLETE** (WS1-WS5)

**Related Plans**:

- `canonical-url-validation-integration.plan.md` (predecessor, WS1-WS5 complete)
  — the observation layer this plan promotes to enforcement
- Unified versioned ingestion plan — ingestion pipeline where URL validation
  will be integrated
