# Curriculum export missing-version redirect probe

## Question

When curriculum materialized-view refresh metadata is absent, does the export handler stabilize on one fallback version or redirect again when the redirected request is followed?

This tests [V009](../investigations/validation-register.md) against OWA commit [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5).

## Method

**Observed source contract:** `getMvRefreshTime` returns `Date.now()` when the refresh query has no rows ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/downloads/getMvRefreshTime.ts#L4-L31)). The handler redirects before loading export data whenever the requested version differs from that value ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L229-L275)).

The historical Jest characterization fixture:

1. mocked `refreshedMVTime` to return `{ data: [] }`;
2. mocked `Date.now()` to return `1000`, then `1001`;
3. invoked the real handler with requested version `0`;
4. followed its target using requested version `1000`; and
5. asserted both responses and redirect targets.

Its exact body is retained through the
[redirect-probe provenance](../../evidence-harness-provenance.md#curriculum-export-redirect-probe).
The two import placeholders are replaced with the selected OWA checkout's paths
when the harness staged the test in the operating system's temporary directory.
The probe used OWA's installed Jest and configuration, recorded the OWA
revision and worktree status, normalizes machine paths in its JSON output, and
restored or removed the `.env.local` file created while that configuration
loaded.

## Result

**Observed, 2026-07-19:** Jest `29.7.0` passed the one test in 1.712 seconds. The first handler response was HTTP `307` with `mvRefreshTime=1000`; the followed request was another HTTP `307` with `mvRefreshTime=1001`.

The historical harness reproduced both assertions again at the pinned revision.
Its elapsed time is reported in generated JSON but is not a product measurement.

Jest also emitted the repository's existing duplicate-manual-mock warning for the two generated `index` mocks. It did not affect this assertion.

The run used Darwin 25.5.0 arm64, Node `v24.16.0` and Next.js `15.5.15`. The temporary test and the `.env.local` generated while Next's Jest configuration loaded were removed. Both source repositories remained clean.

## Conclusion and limits

**Observed:** the handler does not stabilize its fallback cache identity while time advances and refresh metadata remains absent. V009 is reproduced at the handler boundary.

**Observed narrowing:** the redirect occurs before curriculum/CMS loading and document generation. Each repeat performs version lookup, error reporting and redirect handling, not artifact generation.

**Unknown:** CDN caching, millisecond timing, redirect limits and deployed error handling determine production frequency and user impact. A deployed request trace with the refresh source controlled or observed empty is required before claiming a production redirect loop or incident.
