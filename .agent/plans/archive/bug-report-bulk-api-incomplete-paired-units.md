# Bug Report: Oak Bulk API Returns Incomplete Data for Paired RE Units

**Date**: 2026-01-21  
**Reporter**: Semantic Search Team  
**Severity**: Medium (causes GT validation failures, search/bulk data misalignment)  
**Component**: Oak Open API - Bulk Download Endpoint (`/api/bulk`)

---

## Summary

The Oak Bulk API (`POST /api/bulk`) returns incomplete data for Religious Education paired units. When units exist in multiple exam board variants (e.g., "Buddhism and Islam: Practices"), the bulk download only returns **one variant** (Islam lessons), while the live Oak API search endpoint returns lessons from **both variants**.

---

## Steps to Reproduce

1. Download bulk data for Religious Education secondary:

   ```bash
   curl -X POST https://open-api.thenational.academy/api/bulk \
     -H "Authorization: Bearer $OAK_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"subjects": ["religious-education-secondary"]}'
   ```

2. Extract and examine units containing "Buddhism" or "Islam" in the practices area:

   ```bash
   jq '.sequence[] | select(.unitSlug | test("islam-practices|buddhism.*practices"; "i")) | {unitSlug, unitTitle, lessonCount: (.unitLessons | length)}' religious-education-secondary.json
   ```

3. Compare with live API search:

   ```bash
   # Via MCP or direct API call
   GET /search/lessons?q=samatha+meditation&keyStage=ks4&subject=religious-education
   ```

---

## Expected Behavior

The bulk download should include **all lessons** available in the curriculum for a given subject/phase combination, matching what the search API returns.

---

## Actual Behavior

### Bulk Download Returns (as of 2026-01-15):

| Unit Slug | Unit Title | Lesson Count | Content |
|-----------|------------|--------------|---------|
| `buddhism-and-islam-practices-5086` | "Islam: Practices" | 11 | Only Islam lessons |
| `islam-practices-5081` | "Islam: Practices" | 15 | Only Islam lessons |

**Missing entirely:**

- `buddhism-and-islam-practices-5085` → "Buddhism: Practices"
- `islam-practices-5082` → "Buddhism: Practices"

### Search API Returns:

The search API correctly returns Buddhism meditation lessons:

- `samatha-meditation` (unit: "Buddhism: Practices")
- `vipassana-meditation` (unit: "Buddhism: Practices")
- `forms-of-meditation-samatha-and-mettabhavana` (unit: "Buddhism: Practices")
- `forms-of-meditation-vipassana` (unit: "Buddhism: Practices")
- Plus many more Buddhism-specific lessons

---

## Impact

1. **Search Index Misalignment**: ES indexes populated from bulk data will be missing entire units of content
2. **Ground Truth Validation Failures**: Lessons returned by search don't exist in bulk data, causing `invalid-slug` errors
3. **Incomplete Curriculum Coverage**: Teachers searching for Buddhism content in RE will find it via search but it won't be in bulk-sourced systems

---

## Technical Details

### Lesson Count Comparison (RE Secondary):

| Source | Count |
|--------|-------|
| Bulk Download | 396 lessons |
| ES Index (from older/different source) | 395 lessons |

The ES index contains Buddhism lessons that don't exist in the current bulk download, suggesting either:

1. The bulk API previously returned complete data
2. The ES index was populated from a different source

### Unit Slug Pattern Analysis:

The paired units appear to use different suffix numbers for each variant:

- **Islam variant**: `5081`, `5086`
- **Buddhism variant**: `5082`, `5085`

The bulk download only returns the Islam variant slugs.

---

## Suggested Fix

When generating bulk download files for subjects with paired/combined units (like RE's "Buddhism and Islam" units), include **all exam board variants** of each unit, not just one.

Alternatively, document this as a known limitation if the filtering is intentional (e.g., TPC licensing).

---

## Workaround

For now, the semantic search team will:

1. Accept that GT validation may show artificially low metrics for queries that should match Buddhism content
2. Document affected queries in GT expected files
3. Re-evaluate after bulk API is fixed

---

## Related Files

- Bulk download manifest: `apps/oak-search-cli/bulk-downloads/manifest.json` (downloaded 2026-01-15)
- Affected GT file: `religious-education/secondary/imprecise-input.expected.ts`
- ADR reference: `docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md`

---

## Contact

For questions about this report, contact the semantic search team or reference this file in `.agent/plans/bug-report-bulk-api-incomplete-paired-units.md`.
