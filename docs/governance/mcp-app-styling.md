# MCP App Styling

How to style MCP Apps correctly, based entirely on the official
`@modelcontextprotocol/ext-apps` SDK patterns and specification.

This document is **implementation-agnostic** — it describes the
canonical approach. How you generate your CSS (DTCG pipeline,
hand-authored, Tailwind, CSS modules) is your concern, as long as the
output follows these patterns.

## Architecture

An MCP App view runs inside a **sandboxed iframe** provided by the
MCP host (Claude Desktop, VS Code Copilot, etc.). The app has no
direct access to the host's DOM, styles, or fonts. The host
communicates styling information via the MCP Apps protocol:

```text
Host (Claude Desktop, etc.)
  │
  ├── Sends: theme ("light" | "dark")
  ├── Sends: styles.variables (standard CSS custom properties)
  ├── Sends: styles.css.fonts (CSS string: @font-face or @import)
  └── Sends: safeAreaInsets (top, right, bottom, left)
  │
  ▼
App iframe (your code)
  │
  ├── Provides: CSS default values for all used variables
  ├── Calls: applyDocumentTheme(ctx.theme)
  ├── Calls: applyHostStyleVariables(ctx.styles.variables)
  ├── Calls: applyHostFonts(ctx.styles.css.fonts)
  └── Applies: safeAreaInsets as padding via React state / inline styles
```

## CSS Custom Properties

### The Standard Variable Names

The SDK defines a closed union of CSS custom property names
(`McpUiStyleVariableKey` in `@modelcontextprotocol/ext-apps`). The
host MAY provide values for any of these. Your app provides defaults.

**Colours** (37 variables):

```text
--color-{background,text,border}-{primary,secondary,tertiary,inverse,ghost,info,danger,success,warning,disabled}
--color-ring-{primary,secondary,inverse,info,danger,success,warning}
```

**Typography** (28 variables):

```text
--font-sans                          Font family (sans-serif)
--font-mono                          Font family (monospace)
--font-weight-{normal,medium,semibold,bold}
--font-text-{xs,sm,md,lg}-size       Body text sizes
--font-text-{xs,sm,md,lg}-line-height
--font-heading-{xs,sm,md,lg,xl,2xl,3xl}-size
--font-heading-{xs,sm,md,lg,xl,2xl,3xl}-line-height
```

**Layout and shadows** (11 variables):

```text
--border-radius-{xs,sm,md,lg,xl,full}
--border-width-regular
--shadow-{hairline,sm,md,lg}
```

### App Brand Defaults

Define the app's brand values in `:root` using the standard names.
Use `light-dark()` for theme-aware defaults. These are the correct
values for your brand — not fallbacks. The host MAY override them
via `applyHostStyleVariables()` (inline styles, higher CSS
specificity) to integrate the app into its own visual language:

```css
:root {
  color-scheme: light dark;

  /* Host may override these — these are YOUR brand defaults */
  --color-text-primary: light-dark(#222222, #f3f4f6);
  --color-background-primary: light-dark(#ffffff, #222222);
  --font-sans: 'Lexend', system-ui, sans-serif;

  /* App-specific variables (not in the SDK's standard) */
  --color-accent: #bef2bd;
}
```

The host MAY call `applyHostStyleVariables()` which sets inline
styles on `document.documentElement`. CSS specificity means inline
styles take precedence over `:root` declarations. This is the
standard CSS cascade — not a fallback mechanism. Both states (with
and without host overrides) are correct and complete.

### Brand-Specific Variables

Variables outside the SDK's standard names are yours. The host will never
override them. Use a namespace prefix (e.g. `--oak-*`) for clarity:

```css
:root {
  --oak-brand-mint: #bef2bd;
  --oak-banner-height: 48px;
}
```

## Theme Support

The host sends a `theme` field (`"light"` or `"dark"`).
`applyDocumentTheme()` sets `data-theme` and `color-scheme` on the
document root. Use `light-dark()` in CSS or `[data-theme="dark"]`
selectors:

```css
/* Preferred: light-dark() — no selector needed */
--color-text-primary: light-dark(#222222, #f3f4f6);

/* Alternative: data-theme selectors */
[data-theme='dark'] {
  --color-text-primary: #f3f4f6;
}
```

Before the host connects, detect OS preference as a default (the
canonical HTML entry point does this in a blocking `<script>`).

## Font Loading

### Self-Contained Embedding (ADR-151)

MCP App HTML is served as a resource — the iframe may have strict
CSP. External network requests (Google Fonts CDN) may be blocked.
Embed fonts as `@font-face` with base64-encoded WOFF2:

```css
@font-face {
  font-family: 'Lexend';
  src: url(data:font/woff2;base64,...) format('woff2');
  font-display: swap;
}
```

`vite-plugin-singlefile` inlines everything into one HTML file.

### Host-Provided Fonts

The host MAY provide font CSS via `hostContext.styles.css.fonts`.
`applyHostFonts()` injects a `<style>` tag with this CSS. If the
host provides a font, it takes precedence via CSS specificity.

The embedded font is the app's brand-correct typography. It is not a
default — it is the design. The host override is an optional
integration point for hosts that want visual consistency with their
own UI.

## React Pattern (Canonical)

From `ext-apps/docs/patterns.md`:

```tsx
import {
  applyDocumentTheme,
  applyHostStyleVariables,
  applyHostFonts,
  type McpUiHostContext,
} from '@modelcontextprotocol/ext-apps';
import { useApp } from '@modelcontextprotocol/ext-apps/react';
import { useEffect, useState } from 'react';

function MyApp() {
  const [hostContext, setHostContext] = useState<McpUiHostContext>();

  const { app } = useApp({
    appInfo: { name: 'MyApp', version: '1.0.0' },
    capabilities: {},
    onAppCreated: (app) => {
      app.onhostcontextchanged = (ctx) => {
        setHostContext((prev) => ({ ...prev, ...ctx }));
      };
      // ... other handlers
    },
  });

  // Initial context after connection
  useEffect(() => {
    if (app) setHostContext(app.getHostContext());
  }, [app]);

  // Apply host styling imperatively
  useEffect(() => {
    if (hostContext?.theme) applyDocumentTheme(hostContext.theme);
    if (hostContext?.styles?.variables) {
      applyHostStyleVariables(hostContext.styles.variables);
    }
    if (hostContext?.styles?.css?.fonts) {
      applyHostFonts(hostContext.styles.css.fonts);
    }
  }, [hostContext]);

  return (
    <div
      style={{
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      {/* Your app content */}
    </div>
  );
}
```

## CSP Declarations for External Resources

MCP hosts enforce Content Security Policy based on `_meta.ui.csp`
declared in the resource `contents[]` return. If the widget loads
external resources (fonts, stylesheets, APIs), declare the origins:

```typescript
contents: [
  {
    uri: WIDGET_URI,
    mimeType: RESOURCE_MIME_TYPE,
    text: getWidgetHtml(),
    _meta: {
      ui: {
        csp: {
          resourceDomains: ['https://fonts.googleapis.com',
                            'https://fonts.gstatic.com'],
        },
      },
    },
  },
],
```

- `resourceDomains`: scripts, stylesheets, images, fonts
- `connectDomains`: fetch/XHR/WebSocket requests
- Include `localhost` origins during development

Without CSP declarations, hosts may block external requests.

## What Not to Do

- **Do not invent custom host integration** — use the three SDK
  functions (`applyDocumentTheme`, `applyHostStyleVariables`,
  `applyHostFonts`) and nothing else.
- **Do not ignore the standard names** — provide defaults for
  every variable you use. The host expects to override these.
- **Do not hardcode colours in components** — use CSS custom
  properties everywhere so the host theme system works.
- **Do not load external resources without CSP declarations** —
  declare all external origins in `_meta.ui.csp`.

## Reference

- SDK API docs: <https://apps.extensions.modelcontextprotocol.io/api/>
- Patterns guide: clone the SDK repo and read `docs/patterns.md`
- Standard variable names: `McpUiStyleVariableKey` in
  `@modelcontextprotocol/ext-apps`
- React example: `ext-apps/examples/basic-server-react/`
- Vanilla JS example: `ext-apps/examples/basic-server-vanillajs/`
