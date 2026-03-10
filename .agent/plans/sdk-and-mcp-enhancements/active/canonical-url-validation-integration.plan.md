---
name: "Canonical URL Validation via Sitemap Reference Data"
overview: "Integrate the OWA sitemap reference map into codegen to validate generated canonical URLs"
todos:
  - id: ws1-red
    content: "WS1 (RED): Write tests for URL validation at codegen time — reject URLs absent from sitemap."
    status: done
  - id: ws2-green
    content: "WS2 (GREEN): Implement validation logic that loads the sitemap reference map and checks generated URLs."
    status: done
  - id: ws3-refactor
    content: "WS3 (REFACTOR): TSDoc, NL guidance, README updates for the new validation pipeline."
    status: done
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain."
    status: done
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews."
    status: done
  - id: ws6-doc-propagation
    content: "WS6: Propagate outcomes to ADR-047 and relevant READMEs."
    status: done
isProject: false
---

# Canonical URL Validation via Sitemap Reference Data

**Last Updated**: 2026-03-10
**Status**: WS1-WS5 COMPLETE, pending commit
**Scope**: Wire the OWA sitemap reference map into the codegen pipeline so that
generated canonical URLs can be validated against the live site's URL inventory.

---

## Context

The MCP server generates canonical URLs for Oak curriculum resources (lessons,
units, programmes, sequences) from API data. These URLs must point to real pages
on `thenational.academy`. Today there is no automated check that a generated URL
actually exists on the live site.

### What Exists

1. **Sitemap scanner** (`packages/sdks/oak-sdk-codegen/code-generation/sitemap-scanner.ts`)
   fetches the OWA sitemap and writes a categorised reference map to
   `reference/canonical-url-map.json`. The map contains:
   - `teacherPaths` — sorted array of all 27,797 teacher-facing URL paths
   - Slug lookup maps (lesson, programme, sequence, unit, specialist, beta)
   - Route category totals

2. **Canonical URL generation** exists in the codegen pipeline
   (`code-generation/typegen/routing/`) which constructs URL helpers from the
   OpenAPI schema.

3. **ADR-047** established that canonical URLs should be generated at codegen
   time rather than constructed at runtime.

### Problem Statement

Generated canonical URLs are never validated against the live site. If the URL
construction logic has a bug, or if the site's routing changes, the MCP server
silently serves broken links. The sitemap reference data is the missing
validation layer.

### Key Observations from Sense-Checking

The live sitemap reveals important structural facts:
- **0 direct `/teachers/lessons/` paths** — all lessons are accessed via
  programme context (`/teachers/programmes/{p}/units/{u}/lessons/{l}`)
- **0 lesson sub-pages** (`/downloads`, `/media`, `/share`) in sitemap
- **0 key-stage/subject/programme browse pages** — the sitemap contains only
  the 5 top-level `/teachers/key-stages/{ks}/subjects` pages but NOT the
  deeper `/teachers/key-stages/{ks}/subjects/{subj}/programmes` pages. These
  are dynamically rendered by the OWA Next.js app and not included in the
  static sitemap. This is a **known gap**: the sitemap cannot validate the
  subject-to-programme browse URL tier.
- **19 specialist programme slugs** and **55 curriculum sequences** are present
- Total: 27,797 teacher paths, 18,000 unique lesson slugs, 159 programmes

### Sitemap Coverage Gaps

URLs that exist on the live site but are absent from the sitemap:

| Route pattern | Reason absent | Impact |
|---|---|---|
| `/teachers/lessons/{slug}` (direct) | Not in sitemap; lessons only via programme | Cannot validate direct lesson URLs |
| `/teachers/lessons/{slug}/downloads\|media\|share` | Not in sitemap | Cannot validate lesson sub-pages |
| `/teachers/key-stages/{ks}/subjects/{subj}/programmes` | Intentional — OWA uses programme-centric canonical URLs to avoid duplicates; key-stage browse is a secondary navigation route | Cannot validate browse tier (not a bug) |
| `/teachers/curriculum/{slug}/units/{unitSlug}` | Catch-all route, no deep paths in sitemap | Cannot validate unit-in-curriculum URLs |

These gaps mean the sitemap validation is **necessary but not sufficient** —
it catches URLs that are definitely wrong but cannot confirm all valid URLs.
Future work could supplement the sitemap with API-derived URL construction
to close these gaps.

---

## Design Principles

1. **Validation is a codegen-time check** — not a runtime check. The reference
   map is loaded during `pnpm sdk-codegen` and any URL that fails validation
   produces a build-time warning or error.
2. **Superset validation** — the sitemap is a superset of API-constructable
   URLs. A URL not in the sitemap is definitely wrong. A URL in the sitemap
   might still be unreachable from the API, but that's a different concern.
3. **Graceful degradation** — if the reference map is stale or absent, codegen
   should warn but not block. Fresh scans are opt-in via `pnpm scan:sitemap`.

**Non-Goals** (YAGNI):

- Runtime URL validation (too slow, requires network)
- Automatic sitemap refresh during CI (the scan hits the live site; manual refresh is safer)
- Full integration with the search ingestion pipeline (separate concern)

---

## WS1 — Test Specification (RED)

All tests MUST FAIL at the end of WS1.

### 1.1: URL Validation Function

**Tests**: `code-generation/typegen/routing/validate-canonical-urls.unit.test.ts`

- Given a generated URL path and a loaded `teacherPaths` array, return
  `{ valid: true }` or `{ valid: false, reason: string }`
- Given a missing reference map file, return a warning result (not an error)
- Given an empty `teacherPaths` array, treat all URLs as unvalidated (warn)

### 1.2: Integration with Codegen Pipeline

**Tests**: `code-generation/typegen/routing/validate-canonical-urls.integration.test.ts`

- After codegen runs, if `reference/canonical-url-map.json` exists, validate
  that all generated canonical URL helpers produce paths present in the map
- Report a summary of valid/invalid/unvalidated counts

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests fail for the expected reason
3. No existing tests broken

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: URL Validation Core

**File**: `code-generation/typegen/routing/validate-canonical-urls.ts`

**Changes**:

- `loadSitemapReference(refPath: string): Result<SitemapScanOutput, string>` —
  loads the JSON file with graceful failure
- `validateUrl(path: string, teacherPaths: readonly string[]): ValidationResult` —
  binary search against the sorted `teacherPaths` array
- `validateGeneratedUrls(urls: string[], refPath: string): ValidationSummary` —
  orchestrator that loads the map and checks all URLs

### 2.2: Wire into Codegen Pipeline

**File**: `code-generation/codegen-core.ts` or a new post-generation step

**Changes**:

- After URL helpers are generated, load the reference map and validate the
  generated URL patterns
- Log warnings for any URLs not found in the sitemap
- Do not fail the build (warnings only) — this is a new capability and we
  need confidence before making it blocking

### 2.3: Sitemap Refresh Guidance

**File**: `packages/sdks/oak-sdk-codegen/README.md`

- Document the `scan:sitemap` command
- Explain when to refresh (after OWA routing changes, periodically)
- Note that `reference/canonical-url-map.json` should be committed

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: TSDoc and NL Guidance

- TSDoc on all new functions and types
- NL guidance in MCP tool descriptions if canonical URL validation affects
  tool output

### 3.2: Documentation

- Update `packages/sdks/oak-sdk-codegen/README.md` with the new sitemap
  scanning and URL validation workflow
- Consider whether ADR-047 needs an addendum about validation

---

## WS4 — Quality Gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

Invoke specialist reviewers. Document findings. Create follow-up plan if
blockers found.

Recommended reviewers:
- `architecture-reviewer-fred` — ADR compliance for the validation boundary
- `architecture-reviewer-wilma` — failure modes (stale map, missing map, partial map)
- `type-reviewer` — type flow from JSON → validation → reporting
- `test-reviewer` — test coverage adequacy

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Stale reference map produces false positives | Warn-only mode; `generatedAt` timestamp visible in output |
| Sitemap changes break categorisation regexes | Unit tests cover all route patterns; OWA source is reference |
| Large JSON file (7.5 MB) slows codegen | Lazy-load only when validation is requested |
| Specialist/beta routes missing from sitemap | Already handled — catch-all patterns extract available data |

---

## Foundation Alignment

- **ADR-047**: Canonical URL generation at codegen time — this plan extends
  the ADR by adding validation
- **ADR-029/030/031**: Schema as single source of truth — the sitemap provides
  an external validation layer, not a replacement for schema-driven generation
- **Generator-first mindset**: Validation runs in the generator, not at runtime

---

## Dependencies

**Blocking**: None — the sitemap scanner is already implemented and working.

**Related Plans**:

- `sitemap-driven-canonical-urls.plan.md` (archived/completed) — the original
  plan that introduced sitemap scanning
- Unified versioned ingestion plan — may benefit from URL validation for
  search index canonical URLs
- `canonical-url-enforcement.plan.md` (current/, queued) — follow-on plan
  that promotes validation from warn-only to configurable gate and extends
  into the search ingestion pipeline
