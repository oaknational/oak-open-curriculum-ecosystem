# ADR-156: Embed Widget HTML as Committed TypeScript Constant

**Status**: Accepted
**Date**: 2026-04-10
**Related**: [ADR-078](078-dependency-injection-for-testability.md) —
dependency injection for testability,
[ADR-154](154-separate-framework-from-consumer.md) — framework/consumer
separation

## Context

The MCP App widget is a self-contained React application built by Vite into
a single HTML file (via `vite-plugin-singlefile`). Prior to this decision,
the build pipeline emitted the widget HTML to `dist/oak-banner.html` and the
runtime read it from the filesystem using `readFileSync`:

```typescript
const html = readFileSync(resolve(process.cwd(), 'dist/oak-banner.html'), 'utf-8');
```

This caused Vercel preview deployment crashes because:

1. Vercel Lambda sets `process.cwd()` to `/var/task`, not the app directory.
2. Vercel's Node File Tracing (NFT) does not trace dynamically constructed
   `readFileSync` paths, so `dist/oak-banner.html` was not included in the
   deployment bundle.

The result was an `ENOENT` crash on the first `resources/read` request for
the widget resource in every Vercel preview deployment.

## Decision

Embed the widget HTML as a committed TypeScript constant generated at
codegen time, following the same pattern as `WIDGET_URI`, tool descriptions,
and documentation content.

The pipeline is:

1. **Vite** builds the widget to `.widget-build/oak-banner.html`
   (intermediate, gitignored).
2. **`scripts/embed-widget-html.js`** reads the intermediate HTML and writes
   `src/generated/widget-html-content.ts` — a committed TypeScript module
   exporting `WIDGET_HTML_CONTENT`.
3. **tsup** bundles the committed constant into `dist/index.js` via normal
   TypeScript imports.

The constant is consumed via dependency injection (ADR-078):

- `src/index.ts` imports `WIDGET_HTML_CONTENT` and provides
  `getWidgetHtml: () => WIDGET_HTML_CONTENT` to `createApp`.
- `server-runtime.ts` remains generic — it does not know about widget HTML
  (ADR-154).
- Tests inject trivial fakes: `getWidgetHtml: () => '<html>test</html>'`.

## Consequences

### Positive

- **Vercel crash eliminated**: No filesystem dependency at runtime; the HTML
  is a string constant in the JS bundle.
- **Consistent codegen pattern**: Widget HTML follows the same committed
  constant pattern as all other generated metadata.
- **Simplified DI**: `getWidgetHtml` is synchronous (`() => string`) rather
  than async (`() => Promise<string>`), reducing complexity in the resource
  handler chain.
- **Framework/consumer separation preserved**: `server-runtime.ts` accepts
  a generic `CreateAppFn`; widget-specific concerns are closed over by the
  entry point.

### Negative

- **Stale constant risk**: Widget source changes require running
  `pnpm build:widget` and committing the regenerated
  `widget-html-content.ts`. Forgetting this step results in silent stale UI,
  not a build failure.
- **Larger bundle**: `dist/index.js` grows by ~345KB (the embedded HTML).
  This is acceptable for a Vercel Node.js function but would be problematic
  for edge functions or size-constrained environments.
- **Noisy diffs**: Widget changes produce large diffs in the generated file.

### Mitigations

- A CI drift check can verify `widget-html-content.ts` is up to date by
  running `pnpm build:widget` and asserting `git diff` is empty.
- The generated file has a clear `GENERATED FILE — DO NOT EDIT` header.

## Alternatives Considered

1. **Runtime `readFileSync` with corrected path resolution**: Would fix the
   `process.cwd()` issue but still relies on NFT tracing the HTML file.
   Fragile across deployment targets.
2. **Inline `import` of HTML as string (bundler plugin)**: Would require a
   custom tsup/esbuild plugin for `.html` imports. Non-standard, harder to
   debug, and not consistent with the existing codegen pattern.
3. **Base64 encoding in environment variable**: Size limits and operational
   complexity make this impractical for ~345KB of HTML.
