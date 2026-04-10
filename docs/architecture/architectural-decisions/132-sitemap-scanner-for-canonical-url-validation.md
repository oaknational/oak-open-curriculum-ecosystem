# ADR-132: Sitemap Scanner for Canonical URL Validation

## Status

Accepted

## Date

2026-03-10

## Context

The MCP server and SDK codegen pipeline construct canonical URLs for Oak
teacher-facing resources (lessons, programmes, units, curriculum sequences).
These constructed URLs must be valid — pointing to real pages on the OWA site.
Invalid URLs degrade the user experience and undermine trust in the system.

ADR-047 established that canonical URL generation should happen at codegen time.
However, there was no mechanism to **validate** that constructed URLs correspond
to URLs that actually exist on the live site.

Note: [ADR-145](145-oak-url-naming-collision-remediation.md) renamed the SDK
concept from `canonicalUrl` to `oakUrl` to resolve a naming collision with the
upstream API's `canonicalUrl` (which has different semantics). References to
"canonical URL" in this ADR refer to the Oak URL concept (now named `oakUrl` in
the SDK). The sitemap scanner validates these slug-based teacher URLs regardless
of their field name.

The OWA publishes a sitemap index at `https://www.thenational.academy/sitemap.xml`
containing sub-sitemaps for all teacher-facing pages. This sitemap provides a
comprehensive, authoritative list of valid teacher URLs — a natural validation
source.

## Decision

We introduce a **sitemap scanner** as a reference-data tool in the codegen
workspace (`packages/sdks/oak-sdk-codegen`). The scanner:

1. **Fetches** the OWA sitemap index and discovers teacher-facing sub-sitemaps.
2. **Extracts** all teacher URL paths using regex-based `<loc>` extraction.
3. **Categorises** paths by route type using a table-driven dispatch against
   patterns derived from the OWA Next.js pages router.
4. **Writes** a reference map (`reference/canonical-url-map.json`) containing
   the sorted path list, slug lookup maps, and summary totals.
5. **Validates** (via `--validate` flag) that the expected URL pattern categories
   are present, suitable for CI integration.

### Architecture

The scanner follows the established pure/IO split:

- **`sitemap-scanner-core.ts`** — Pure functions (`extractLocs`,
  `categoriseTeacherPaths`, `validateScanResult`). Table-driven route dispatch.
  Fully testable without network IO.
- **`sitemap-scanner-types.ts`** — Type definitions for `SitemapCategorisation`
  and `SitemapScanOutput`.
- **`sitemap-scanner.ts`** — Entry point handling network IO, file writes, and
  CLI arguments. Uses the Result pattern (ADR-088) for error propagation.

### Resilience

- Exponential backoff with jitter on transient fetch failures.
- Content-type validation to reject HTML error pages before XML parsing.
- Fetch timeout (`AbortSignal.timeout`) to prevent indefinite hangs.
- Partial failure threshold: if >20% of sub-sitemaps fail, the scan aborts
  rather than writing an incomplete reference map.

### Known Limitations

The sitemap provides a **superset** of canonical resource URLs but does not
contain all valid teacher-facing URLs. Known gaps:

| Route pattern                                          | Reason absent                                           |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `/teachers/lessons/{slug}` (direct)                    | Not in sitemap; lessons only via programme              |
| `/teachers/lessons/{slug}/downloads\|media\|share`     | Not in sitemap                                          |
| `/teachers/key-stages/{ks}/subjects/{subj}/programmes` | Intentional — OWA uses programme-centric canonical URLs |

This means sitemap validation is **necessary but not sufficient** — it catches
URLs that are definitely wrong but cannot confirm all valid URLs. Future work
(WS3-WS6 in the integration plan) will supplement with API-derived URL
construction to close these gaps.

## Consequences

- Canonical URLs constructed from the API can be validated against the reference
  map at codegen time — any URL not present is instantly rejected.
- The scanner runs as a standalone tool (`pnpm -F @oaknational/sdk-codegen scan:sitemap`),
  not as part of the automated build, since it requires network access.
- The reference map is gitignored and must be regenerated when URL patterns change.
- The `--validate` flag enables CI integration for monitoring sitemap health.
- The table-driven route dispatch makes adding new route categories a one-line
  table entry change.

## Related

- ADR-047: Canonical URL Generation at Codegen Time
- ADR-088: Result Pattern for Error Handling
- Integration plan: `.agent/plans/sdk-and-mcp-enhancements/active/canonical-url-validation-integration.plan.md`
