# Deep Review Report (25 February 2026)

## Execution Mode

This is the post-move update for the **Boundary Move Wave + ADR Provenance Link Remediation** (items 1 and 3).

- Scope executed: boundary move wave + ADR stale plan-link clean-up
- Move execution: applied from `output/move-proposals.tsv`
- Commit strategy: none (no commits created)
- Quality suite scope: full one-gate-at-a-time suite deferred by decision
- Provenance policy: hybrid; direct archive links where available, stable plan indexes otherwise

## Baseline vs Post-Move Delta

| Metric | Baseline | Post-move | Delta |
| --- | --- | --- | --- |
| Primary docs in scope | 33 | 35 | +2 |
| Primary lines in scope | 6,829 | 7,006 | +177 |
| Missing local links | 9 | 0 | -9 |
| Move-map rows applied | 0 | 25 | +25 |
| Old-path references (active surfaces) | 224 | 0 | -224 |

Supporting artefacts:

- `output/move-wave-old-path-reference-baseline.tsv`
- `output/move-wave-old-path-reference-after.tsv`
- `output/missing-link-summary.tsv`
- `evidence/missing-links.tsv`
- `evidence/evidence-summary.md`

## Findings Status Delta

Resolved in this wave:

- S1 resolved: `DF-001`, `DF-002`, `DF-005`, `DF-006`, `DF-008`
- S2 resolved: `DF-003`, `DF-004`, `DF-007`, `DF-009`, `DF-011`, `DF-012`
- S3 resolved: `DF-010` (boundary ownership now explicit via boundary directories and entrypoint metadata)

Authoritative statuses:

- `output/doc-findings.tsv`
- `output/doc-findings.md`

## What Changed in Docs

1. Executed all non-retain move rows from `output/move-proposals.tsv` (25 moves).
2. Added boundary entrypoint indices:
   - `docs/foundation/README.md`
   - `docs/operations/README.md`
3. Applied boundary frontmatter metadata to boundary entrypoints and retained `docs/README.md` as cross-boundary gateway.
4. Rewrote active references to moved paths and re-established zero missing local links.
5. Remediated targeted ADR stale plan links using archive-completed links:
   - `docs/architecture/architectural-decisions/026-openapi-code-generation-strategy.md`
   - `docs/architecture/architectural-decisions/028-zod-validation-deferral.md`
   - `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md`

## Artefacts Updated in This Pass

- `evidence/primary-docs.txt`
- `evidence/primary-docs-overview.tsv`
- `evidence/related-links.tsv`
- `evidence/related-outside-docs.txt`
- `evidence/missing-links.tsv`
- `evidence/evidence-summary.md`
- `output/missing-link-summary.tsv`
- `output/missing-link-triage.tsv`
- `output/doc-findings.tsv`
- `output/doc-findings.md`
- `output/deep-review-report.md`

## Reorganisation State

Boundary-led reorganisation is now implemented for item 1 scope, with item 3 ADR provenance remediations complete.

- Move map source remains: `output/move-proposals.tsv`
- Navigation continuity maintained through `docs/README.md` and boundary entrypoints
