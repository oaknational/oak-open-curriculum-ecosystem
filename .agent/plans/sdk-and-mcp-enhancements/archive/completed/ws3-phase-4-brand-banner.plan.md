---
name: "WS3 Phase 4: Brand Banner"
overview: "When get-curriculum-model fires, the MCP App shows the Oak brand banner — logo + link. No content area. Just branding."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: token-expansion
    content: "Add contrast pairings, font.size-400, and banner component tokens."
    status: completed
  - id: brand-banner
    content: "Implement BrandBanner with inline SVG logo and callback prop."
    status: completed
  - id: follow-ups
    content: "prefers-color-scheme fallback, appInfo.version wiring, plan corrections."
    status: completed
  - id: review
    content: "Targeted specialist review (design-system, a11y, mcp)."
    status: completed
---

# WS3 Phase 4: Brand Banner

**Status**: COMPLETE
**Last Updated**: 2026-04-04

## What Was Delivered

When `get-curriculum-model` fires (a session-start proxy), the MCP App
shows the Oak brand banner — logo + "Oak National Academy" link. No
content area. Just branding. The curriculum-model data serves the agent
via text content; the human sees only the brand banner.

- 4 text-context contrast pairings (accent/accent-strong on surfaces)
- `font.size-400` (1.25rem) palette token + 7 banner component tokens
- Inline SVG acorn logo with `fill="currentColor"` (light/dark/forced-colours)
- `BrandBanner.tsx` — single `<a>` wrapping logo + text (WCAG H2),
  `onOpenLink` callback prop, underlined, display font, focus-visible ring
- `prefers-color-scheme` fallback script in `index.html`
- `appInfo.version` wired to `package.json` via Vite `define`
- Diagnostic scaffold deleted, `AppView` renders only the banner
- 5 pre-implementation specialist reviewers, 3 post-implementation reviewers

## Acceptance Evidence

1. Brand banner renders through the fresh MCP App shell
2. `@oaknational/oak-design-tokens` CSS consumed — no app-local brand values
3. External links via `app.openLink()` callback prop
4. `prefers-color-scheme` fallback applies dark tokens before host context
5. `pnpm check` passes
