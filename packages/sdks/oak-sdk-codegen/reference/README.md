# Reference Data

This directory contains generated reference data used by the codegen pipeline
for validation. Files here are **not committed to git** — they are regenerated
on demand.

## Version control

At the repository root, [`.gitignore`](../../../../.gitignore) ignores
`packages/sdks/oak-sdk-codegen/reference/*.json` so generated maps (including
`canonical-url-map.json`) stay local and CI regenerates or validates as needed.
This `README.md` remains tracked.

**Contrast** — Agent-facing long-lived reference docs live under
[`.agent/reference/`](../../../../.agent/reference/README.md). Local-only
drops belong under [`.agent/reference-local/`](../../../../.agent/reference-local/README.md).

## canonical-url-map.json

A comprehensive map of all teacher-facing URL paths from the OWA sitemap.
Used to validate that canonical URLs constructed from the API point to real
pages on the live site.

### Regeneration

```sh
pnpm -F @oaknational/sdk-codegen scan:sitemap
```

### Validation (CI)

```sh
pnpm -F @oaknational/sdk-codegen scan:sitemap -- --validate
```

Exits non-zero if expected URL pattern categories (lessons, programmes,
curriculum sequences) are absent from the sitemap.

### Contents

- `teacherPaths` — Sorted array of all teacher URL paths (~27K entries)
- `totals` — Summary counts by category
- Slug lookup maps for lessons, programmes, units, sequences
- `generatedAt` — ISO 8601 timestamp of when the scan was performed

### See Also

- [ADR-132: Sitemap Scanner](../../../../docs/architecture/architectural-decisions/132-sitemap-scanner-for-canonical-url-validation.md)
- [ADR-047: Canonical URL Generation](../../../../docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md)
