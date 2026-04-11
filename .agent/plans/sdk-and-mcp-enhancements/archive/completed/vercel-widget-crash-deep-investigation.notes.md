---
name: "Vercel widget crash deep investigation notes"
status: "active"
last_updated: "2026-04-10"
---

# Vercel widget crash deep investigation notes

## Objective

Establish runtime-evidence-backed root cause for preview-only crashes where the
Express MCP HTTP server fails during `initializeCoreEndpoints` when the widget
resource is enabled.

## Confirmed baseline evidence

1. Vercel deployment resolves and reports `READY` for deployment
   `dpl_LuHvjnukFy7RjQuetxmNk7tmBsDP`.
2. Runtime log stream shows repeated `500` responses across `/`, `/mcp`,
   `/.well-known/*`, and static favicon paths with failure substring tied to
   `initializeCoreEndpoints`.
3. Existing active plan evidence already records a specific startup failure
   message: widget HTML missing at runtime from
   `apps/oak-curriculum-mcp-streamable-http/dist/oak-banner.html`.
4. Build pipeline includes widget generation (`tsup && pnpm build:widget`) and
   prior evidence indicates `dist/oak-banner.html` is emitted in build logs.

## Active hypotheses

- **H1 (bundle tracing omission)**: `dist/oak-banner.html` is generated during
  build but excluded from deployed function bundle/tracing, so runtime fs lookup
  fails.
- **H2 (cwd/path mismatch)**: runtime `process.cwd()` differs between local and
  deployed environments, yielding path resolution drift.
- **H3 (build command divergence)**: effective Vercel build command for this
  deployment does not reliably include widget build in all lanes.
- **H4 (bootstrap ordering/contract issue)**: startup validation executes before
  the runtime artefact contract is actually valid for the deployed runtime.
- **H5 (resource read path variance)**: startup validation path and runtime read
  path diverge subtly under deployment packaging.

## Instrumentation added (debug session `ae9818`)

- `src/application.ts`
  - bootstrap entry log for `initializeCoreEndpoints` with `process.cwd()`,
    `WIDGET_HTML_PATH`, and `useStubTools` (H4).
- `src/validate-widget-html.ts`
  - existence-check result log before fail-fast throw (H1).
- `src/register-widget-resource.ts`
  - path-resolution log from `resolveWidgetHtmlPath` (H2).
  - read-attempt log from `readBuiltWidgetHtml` (H5).

All logs use `runId: "pre-fix"` and include `hypothesisId`.

## Next evidence step

Run a clean reproduction with instrumentation active and capture NDJSON logs in
`.cursor/debug-ae9818.log`, then classify each hypothesis as
CONFIRMED/REJECTED/INCONCLUSIVE before making any architectural fix.
