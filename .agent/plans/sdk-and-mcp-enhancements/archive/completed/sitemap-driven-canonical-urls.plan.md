---
name: "Sitemap-Driven Canonical URL Generation"
overview: "Fix incorrect canonical URL patterns by using OWA sitemaps as the authoritative source of truth at codegen time."
todos:
  - id: phase-0-verify
    content: "Phase 0: Verify foundation assumptions and document all URL bugs."
    status: complete
  - id: phase-1-scanner
    content: "Phase 1: Enhance sitemap scanner to capture all URL pattern categories."
    status: complete
  - id: phase-2-codegen
    content: "Phase 2: Integrate sitemap data into sdk-codegen URL helper generation."
    status: complete
  - id: phase-3-consumers
    content: "Phase 3: Fix search-cli canonical-url-generator and response augmentation."
    status: complete
  - id: phase-4-validation
    content: "Phase 4: Quality gates, documentation, and foundation compliance."
    status: complete
---

# Sitemap-Driven Canonical URL Generation

**Last Updated**: 2026-03-06
**Status**: ✅ COMPLETE
**Scope**: Fix incorrect canonical URL patterns across the SDK codegen and search-cli by using the Oak website sitemaps as the authoritative source of truth.

---

## Context

### Investigation Summary (2026-03-05)

A review of canonical URL generation revealed that the SDK codegen and search-cli are producing **dead links** for multiple content types. The bugs were confirmed by:

1. Fetching URLs from the live Oak website — multiple patterns return 404
2. Checking the OWA source code at `src/pages/teachers/` in [Oak-Web-Application](https://github.com/oaknational/Oak-Web-Application)
3. Comparing the generated URLs against actual OWA routing

### Issue 1: Sequence URLs use wrong base path

**Evidence**: `urlForSequence` in the generated `url-helpers.ts` produces:

```text
https://www.thenational.academy/teachers/programmes/{slug}/units → 404
```

Correct URL (confirmed live + OWA source `src/pages/teachers/curriculum/[subjectPhaseSlug]/[...slugs].tsx`):

```text
https://www.thenational.academy/teachers/curriculum/{slug}/units → 200
```

**Root Cause**: The codegen template in `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts` line 48 hard-codes `/programmes/` instead of `/curriculum/`.

**Existing Capabilities**: The sitemap scanner script `apps/oak-search-cli/scripts/scan-teacher-sitemaps.mjs` already traverses the OWA sitemaps and builds URL maps, but its output is not consumed by the codegen pipeline.

### Issue 2: Unit URLs use wrong base path

**Evidence**: `urlForUnit` produces:

```text
https://www.thenational.academy/teachers/programmes/{subject}-{phase}/units/{unitSlug} → 404
```

Correct URL (confirmed from OWA page fetch at `/teachers/curriculum/art-secondary/units`):

```text
https://www.thenational.academy/teachers/curriculum/{sequenceSlug}/units/{unitSlug} → 200
```

Units also appear at programme-context URLs:

```text
https://www.thenational.academy/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons → 200
```

**Root Cause**: Same template hard-codes the wrong path, and constructs `{subject}-{phase}` instead of using the actual sequence slug.

### Issue 3: Thread URLs generate dead links in search-cli

**Evidence**: `generateThreadCanonicalUrl` in `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` produces:

```text
https://www.thenational.academy/teachers/curriculum/threads/{threadSlug} → 404
```

No thread routes exist in OWA source. Threads are organisational concepts used as highlight filters within the curriculum unit sequence view (`[subjectPhaseSlug]/[...slugs].tsx`), not standalone pages.

**Root Cause**: Assumed URL pattern for a route that doesn't exist.

### Issue 4: URL patterns are hard-coded assumptions that can drift

All URL generation currently relies on hard-coded patterns in two places:

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts` (codegen template)
- `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` (search indexing)

Neither verifies patterns against the actual website. When OWA routing changes, these break silently.

---

## Verified URL Pattern Reference

Confirmed against OWA source (`src/pages/teachers/`) and live website on 2026-03-05:

| Content Type | URL Pattern | Status in Codegen |
|---|---|---|
| Lesson (canonical) | `/teachers/lessons/{lessonSlug}` | Correct |
| Lesson (in programme) | `/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons/{lessonSlug}` | Not generated (correct — canonical is sufficient) |
| Sequence (curriculum view) | `/teachers/curriculum/{sequenceSlug}/units` | **BUG**: generates `/programmes/{slug}/units` |
| Unit (in curriculum) | `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` | **BUG**: generates `/programmes/{subject}-{phase}/units/{unitSlug}` |
| Unit (in programme) | `/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons` | Not generated (exists on OWA) |
| Programme | `/teachers/programmes/{programmeSlug}/units` | Not generated (exists on OWA; programme slugs include key stage, tier, exam board context) |
| Subject | `/teachers/key-stages/{ks}/subjects/{subject}/programmes` | Correct |
| Thread | None — no OWA route exists | Correct in codegen (`null`); **BUG** in search-cli (generates dead URL) |

### Programme vs Sequence URL distinction

- **Sequences** (API-level): `art-secondary`, `maths-primary`, `science-secondary-aqa` → live at `/teachers/curriculum/{sequenceSlug}/units`
- **Programmes** (OWA user-facing): `maths-secondary-ks4-higher`, `biology-secondary-ks4-foundation-aqa`, `cooking-nutrition-primary-ks1` → live at `/teachers/programmes/{programmeSlug}/units`

Programme = Sequence + Context Filters (key stage, tier, exam board, pathway, legacy flag). See `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md` for the full mapping.

---

## Solution Architecture

### Key Insight

The OWA sitemaps at `https://www.thenational.academy/sitemap.xml` are the **canonical source of truth** for all valid teacher-facing URLs. The sitemap is a superset of what the API exposes (the API filters out lessons with complex copyright). By fetching sitemaps at codegen time, we get an authoritative, verified set of URL patterns instead of maintaining hard-coded assumptions.

### Strategy

1. **Enhance the sitemap scanner** to capture `/curriculum/` URLs (currently only captures `/programmes/` and `/lessons/`)
2. **Run the scanner at codegen time** (`pnpm sdk-codegen`) to produce a fresh `canonical-url-map.json`
3. **Generate URL helpers from sitemap data** — pattern extraction, not hard-coded strings
4. **Fix the search-cli** generators to use the same patterns or import from the SDK

**Non-Goals** (YAGNI):

- ❌ Building a reverse-routing engine from OWA source code
- ❌ Generating programme-level URLs (the API doesn't expose programme slugs; that's an upstream API wishlist item)
- ❌ Generating pupil-facing URLs (out of scope for teacher tools)
- ❌ Runtime sitemap fetching (codegen time only)
- ✅ Fixing the three known broken URL patterns
- ✅ Making the scanner the single source of truth for URL patterns
- ✅ Ensuring future OWA routing changes are caught at codegen time

---

## Quality Gate Strategy

**Critical**: URL generation feeds the response augmentation middleware, the search index, and MCP tool output. Broken URLs are surfaced to teachers. Run ALL quality gates across ALL workspaces after EACH sub-task.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After Each Phase

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/rules.md` — Cardinal Rule: types flow from the schema
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at all levels
3. **Re-read** `.agent/directives/schema-first-execution.md` — generator-first flow
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions (~30 min)

**Foundation Check-In**: Re-read `rules.md` sections on Cardinal Rule and Fail Fast.

#### Task 0.1: Run the existing sitemap scanner and audit its output

**Current Assumption**: The scanner captures all relevant URL categories.

**Validation Required**: Run `scan-teacher-sitemaps.mjs`, inspect output, confirm what URL categories are missing.

**Acceptance Criteria**:

1. ✅ Scanner runs successfully and produces `reference/canonical-url-map.json`
2. ✅ Output is audited: which URL categories are captured, which are missing
3. ✅ `/teachers/curriculum/` URLs are confirmed missing from current output
4. ✅ Total URL count and content type breakdown documented

**Deterministic Validation**:

```bash
cd apps/oak-search-cli
node scripts/scan-teacher-sitemaps.mjs
# Expected: exit 0, writes reference/canonical-url-map.json

cat reference/canonical-url-map.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['totals'], indent=2))"
# Expected: totals with urls, programmes, lessons, units, subjects counts

rg '/curriculum/' reference/canonical-url-map.json | head -5
# Expected: no matches (confirming /curriculum/ URLs are NOT captured)
```

**Task Complete When**: Scanner output audited, missing categories documented.

#### Task 0.2: Verify all URL bug claims against live site

**Acceptance Criteria**:

1. ✅ Each of the 3 broken URL patterns confirmed with `curl -sI` (404 response)
2. ✅ Each correct URL pattern confirmed (200 response)
3. ✅ Any new patterns discovered during verification are documented

**Deterministic Validation**:

```bash
# Broken patterns (expect 404 or redirect)
curl -sI 'https://www.thenational.academy/teachers/programmes/art-secondary/units' | head -1
curl -sI 'https://www.thenational.academy/teachers/programmes/maths-primary/units/place-value' | head -1
curl -sI 'https://www.thenational.academy/teachers/curriculum/threads/algebra' | head -1

# Correct patterns (expect 200)
curl -sI 'https://www.thenational.academy/teachers/curriculum/art-secondary/units' | head -1
curl -sI 'https://www.thenational.academy/teachers/lessons/adding-fractions-with-same-denominator' | head -1
curl -sI 'https://www.thenational.academy/teachers/programmes/maths-secondary-ks4-higher/units' | head -1
```

**Task Complete When**: All 3 bugs confirmed, correct patterns confirmed, no new surprises.

---

### Phase 1: Enhance Sitemap Scanner (~1 hour)

**Foundation Check-In**: Re-read `testing-strategy.md` — TDD: write tests first.

#### Task 1.1: Add `/curriculum/` URL extraction to the scanner

The current scanner at `apps/oak-search-cli/scripts/scan-teacher-sitemaps.mjs` captures:

- `/teachers/lessons/{lessonSlug}` ✅
- `/teachers/programmes/{programmeSlug}/...` ✅
- `/teachers/key-stages/{ks}/subjects/{subject}/programmes` ✅

Missing:

- `/teachers/curriculum/{sequenceSlug}/units` — sequence curriculum view
- `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` — unit within curriculum view

**Changes**:

- Add regex to capture `/teachers/curriculum/{slug}/units` and `/teachers/curriculum/{slug}/units/{unitSlug}`
- Add `sequenceToPath` and `unitToCurriculumUrl` to output
- Keep existing mappings unchanged (backward compatible)

**Acceptance Criteria**:

1. ✅ Scanner captures `/curriculum/` URLs in output
2. ✅ New `sequenceToPath` mapping in output JSON
3. ✅ New `unitToCurriculumUrl` mapping in output JSON
4. ✅ Existing mappings unchanged
5. ✅ `totals` updated to include new categories

#### Task 1.2: Move scanner output to a codegen-accessible location

Currently outputs to `apps/oak-search-cli/reference/canonical-url-map.json`. The codegen pipeline lives in `packages/sdks/oak-sdk-codegen/`. Options:

- **Option A**: Move the scanner to `packages/sdks/oak-sdk-codegen/scripts/` so it's co-located with codegen
- **Option B**: Keep in search-cli, have codegen read from a shared location
- **Option C**: Extract URL pattern constants from the scanner output into a generated TypeScript file consumed by both

**Recommended**: Option A — the scanner is a codegen input, not a search concern. Move it to the codegen package.

**Acceptance Criteria**:

1. ✅ Scanner script lives in `packages/sdks/oak-sdk-codegen/scripts/`
2. ✅ Output goes to `packages/sdks/oak-sdk-codegen/reference/sitemap-url-patterns.json`
3. ✅ `pnpm sdk-codegen` runs the scanner as a pre-step (or the scanner is invocable separately)
4. ✅ Old location in search-cli either removed or updated to import from new location

---

### Phase 2: Integrate Sitemap Data into Codegen (~2 hours)

**Foundation Check-In**: Re-read `schema-first-execution.md` — types flow from generation.

#### Task 2.1: Generate URL helpers from sitemap-derived patterns

Instead of hard-coding URL templates in `generate-url-helpers.ts`, derive them from the sitemap data:

1. Parse `sitemap-url-patterns.json` at codegen time
2. Extract URL pattern templates: `lesson → /teachers/lessons/{slug}`, `sequence → /teachers/curriculum/{slug}/units`, etc.
3. Generate `url-helpers.ts` with correct patterns

**Acceptance Criteria**:

1. ✅ `urlForSequence` generates `/teachers/curriculum/{slug}/units` (not `/programmes/`)
2. ✅ `urlForUnit` generates `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` when sequence context is available
3. ✅ `urlForLesson` unchanged (already correct)
4. ✅ Thread handling unchanged (`null`)
5. ✅ `pnpm sdk-codegen` regenerates `url-helpers.ts` with correct patterns
6. ✅ All existing tests updated to expect new URL patterns

**Deterministic Validation**:

```bash
pnpm sdk-codegen
rg '/programmes/' packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts
# Expected: no matches for sequence URLs (only urlForSubject may still reference /programmes/ pattern — verify)

rg '/curriculum/' packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts
# Expected: matches for sequence and unit URL functions

pnpm type-check
pnpm test
```

#### Task 2.2: Update response augmentation to use new URL patterns

The response augmentation middleware in `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` calls `generateCanonicalUrlWithContext` from the generated helpers. Once the helpers are fixed, response augmentation should produce correct URLs automatically.

**Acceptance Criteria**:

1. ✅ Response augmentation integration tests pass with new URL patterns
2. ✅ No code changes needed in response augmentation (it delegates to helpers)
3. ✅ If test fixtures contain old URL patterns, update them

**Deterministic Validation**:

```bash
pnpm test --filter @oaknational/curriculum-sdk
# Expected: all tests pass, response augmentation tests reflect new URLs
```

---

### Phase 3: Fix Search-CLI Generators (~1 hour)

**Foundation Check-In**: Re-read `rules.md` — no duplication, single source of truth.

#### Task 3.1: Fix `canonical-url-generator.ts` in search-cli

File: `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts`

**Changes**:

1. `generateSequenceCanonicalUrl`: change `/programmes/` to `/curriculum/`
2. `generateUnitCanonicalUrl`: change to use `/curriculum/{sequenceSlug}/units/{unitSlug}` pattern (requires sequence context)
3. `generateThreadCanonicalUrl`: change to return `null` (no OWA route exists) — or remove entirely and log a warning

**Acceptance Criteria**:

1. ✅ `generateSequenceCanonicalUrl` produces `/teachers/curriculum/{slug}/units`
2. ✅ `generateThreadCanonicalUrl` returns `null` or is removed
3. ✅ Unit URL generation uses curriculum path
4. ✅ All search-cli tests updated and passing
5. ✅ Thread document builder tests updated (currently assert dead URL)

**Deterministic Validation**:

```bash
pnpm test --filter oak-search-cli
# Expected: all tests pass

rg 'teachers/programmes' apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts
# Expected: no matches (all patterns corrected)
```

#### Task 3.2: Consider importing from SDK instead of maintaining duplicate generators

The search-cli has its own `canonical-url-generator.ts` that duplicates logic from the SDK's generated `url-helpers.ts`. Evaluate whether the search-cli can import from `@oaknational/sdk-codegen/api-schema` instead.

**Acceptance Criteria**:

1. ✅ Decision documented: import from SDK or keep separate (with justification)
2. ✅ If importing: search-cli generators replaced with SDK imports
3. ✅ If keeping separate: patterns verified to match SDK output

---

### Phase 4: Validation (~30 min)

**Foundation Check-In**: Re-read all three foundation documents. Verify all principles followed.

#### Task 4.1: End-to-end URL verification

**Acceptance Criteria**:

1. ✅ All generated sequence URLs return 200 when checked against live site (spot check 3-5)
2. ✅ All generated lesson URLs return 200 (spot check 3-5)
3. ✅ Thread content types produce `null` canonical URL
4. ✅ Full quality gates pass: `pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint && pnpm test`

#### Task 4.2: Foundation document compliance checklist

- [ ] **rules.md — Cardinal Rule**: Types flow from generation (URL helpers are generated, not ad-hoc)
- [ ] **rules.md — No Type Shortcuts**: No `as`, `any`, `Record<string, unknown>` added
- [ ] **rules.md — Fail Fast**: Invalid URL patterns fail at codegen time, not at runtime
- [ ] **rules.md — Quality Gates**: All gates pass across all workspaces
- [ ] **testing-strategy.md — TDD**: Tests written/updated before implementation
- [ ] **testing-strategy.md — Test Behavior**: Tests validate URL output, not implementation details
- [ ] **schema-first-execution.md — Generator First**: URL patterns derived from sitemap data at generation time

**Task Complete When**: All checklist items checked, all quality gates pass.

---

## Testing Strategy

### Unit Tests

**Existing Coverage**:

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts` — tests URL augmentation
- `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` (no test file — needs one)
- `apps/oak-search-cli/src/lib/indexing/thread-document-builder.unit.test.ts` — asserts thread URL (currently dead URL)

**New Tests Required**:

- Unit test for `canonical-url-generator.ts` — verify all 5 content type URL patterns
- Unit test for the enhanced sitemap scanner output shape
- Update `thread-document-builder.unit.test.ts` to expect `null` or removed URL

### Integration Tests

**Existing Coverage**:

- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts`

**Changes Required**:

- Update expected URL patterns in integration test fixtures

### E2E Tests

**Existing Coverage**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/` — may contain canonical URL assertions

**Changes Required**:

- Update any E2E assertions that check canonical URL values

---

## Success Criteria

### Phase 0

- ✅ All 3 URL bugs confirmed with evidence
- ✅ Scanner output audited and gaps documented

### Phase 1

- ✅ Scanner captures `/curriculum/` URLs
- ✅ Scanner relocated to codegen package

### Phase 2

- ✅ Generated `url-helpers.ts` produces correct URLs for all content types
- ✅ Response augmentation produces correct URLs without code changes

### Phase 3

- ✅ Search-cli canonical URL generation fixed
- ✅ No dead links in search index documents

### Phase 4

- ✅ Spot-check URLs against live site — all return 200
- ✅ Full quality gates pass
- ✅ Foundation compliance verified

### Overall

- ✅ Zero dead links produced by URL generation
- ✅ Sitemap is the single source of truth for URL patterns
- ✅ Future OWA routing changes caught at codegen time

---

## Dependencies

**Blocking**: None — all code is in this repo.

**Related Plans**:

- `.agent/plans/external/ooc-api-wishlist/06-response-metadata-and-caching.md` — upstream API canonical URL support (long-term; this plan is the interim fix)
- `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md` — sequence vs programme analysis
- `.agent/research/owa-programme-slug-analysis.md` — programme slug patterns from sitemap
- ADR-047 — Canonical URL generation at sdk-codegen time

**Prerequisites**:

- ✅ Sitemap scanner exists: `apps/oak-search-cli/scripts/scan-teacher-sitemaps.mjs`
- ✅ URL helper codegen exists: `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts`
- ✅ Response augmentation uses generated helpers
- ✅ OWA sitemaps are publicly accessible

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OWA sitemap format changes | Low | Medium | Scanner has retry logic; fail codegen loudly if sitemap unavailable |
| Sitemap fetch fails during CI | Medium | High | Cache last-known-good `sitemap-url-patterns.json` in repo; use cached if fetch fails |
| URL patterns have edge cases not in sitemap | Low | Low | Spot-check against live site in Phase 4; sitemap is authoritative |
| Moving scanner breaks search-cli workflows | Low | Medium | Verify search-cli doesn't depend on scanner location; update any references |

---

## Notes

### Why This Matters

**Immediate Value**:

- **Teachers**: Canonical URLs in MCP tool output and search results actually work (no 404s)
- **Search quality**: Elasticsearch documents contain valid URLs for all content types
- **Developer confidence**: URL generation is verified, not assumed

**System-Level Impact**:

- **Single source of truth**: Sitemap-driven generation eliminates the class of "wrong pattern" bugs
- **Drift detection**: If OWA changes routes, codegen catches it immediately
- **Foundation alignment**: URL patterns flow from generation (Cardinal Rule), not ad-hoc strings

**Risk of Not Doing**:

- **Dead links to teachers**: Current sequence and unit URLs return 404
- **Silent drift**: OWA routing changes break URLs with no warning
- **Duplicate maintenance**: Two independent URL generators that can diverge

### Key Files

| File | Role |
|------|------|
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts` | Codegen template — generates `url-helpers.ts` |
| `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts` | Generated output — consumed by response augmentation |
| `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` | Runtime URL decoration middleware |
| `apps/oak-search-cli/scripts/scan-teacher-sitemaps.mjs` | Sitemap scanner (to be enhanced and relocated) |
| `apps/oak-search-cli/src/lib/indexing/canonical-url-generator.ts` | Search-cli URL generators (duplicate, to be fixed) |
| `apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts` | Thread document builder (uses dead thread URL) |

### Session Context (for next session pickup)

This plan was created after a thorough investigation in [Security and URL audit session](73d46300-ba20-4234-a13d-1603212ecd4e). The investigation:

1. Started from reviewing the `canonicalUrl?: null` typing issue during the openapi-fetch 0.17 upgrade
2. Led to the user clarifying the two-spec architecture (as-served vs enhanced with decorations)
3. Verified all URL patterns against the live Oak website and OWA source code (`src/pages/teachers/`)
4. Confirmed that 164 threads exist (fetched via `get-threads` MCP tool) but none have OWA pages
5. Confirmed sequences have pages at `/teachers/curriculum/{sequenceSlug}/units` (not `/programmes/`)
6. Found the existing sitemap scanner and the user proposed using it at codegen time

---

## References

- ADR-047: `docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md`
- Sequence vs Programme research: `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md`
- OWA programme slug analysis: `.agent/research/owa-programme-slug-analysis.md`
- OWA source: `https://github.com/oaknational/Oak-Web-Application` (`src/pages/teachers/`)
- OWA sitemap: `https://www.thenational.academy/sitemap.xml`
- Foundation documents:
  - `.agent/directives/rules.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
