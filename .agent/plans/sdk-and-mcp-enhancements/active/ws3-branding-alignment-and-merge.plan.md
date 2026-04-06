---
name: "Oak Branding Alignment + Merge Readiness"
overview: "Fix the BrandBanner: correct logo, colours, typography, spacing. Add dev infra. Merge to main."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "design-system-reviewer, accessibility-reviewer, mcp-reviewer, react-component-reviewer, code-reviewer, release-readiness-reviewer"
supersedes:
  - "../current/ws3-local-widget-development.plan.md"
prerequisites_complete:
  - "../current/ws3-contrast-validation-prerequisite.plan.md"
todos:
  - id: p0-dev-infra
    content: "P0: Add dev:widget and dev:basic-host scripts."
    status: done
  - id: p1-branding
    content: "P1: Fix branding — real Oak logo SVG, Lexend font, mint #bef2bd, dark text #222222, minimal banner height."
    status: pending
  - id: p2-host-context
    content: "P2: Align host context handling with official SDK patterns."
    status: pending
  - id: p3-quality-merge
    content: "P3: Quality gates, specialist reviews, merge to main."
    status: pending
isProject: false
---

# Oak Branding Alignment + Merge Readiness

**Last Updated**: 2026-04-06
**Status**: 🟢 IN PROGRESS (P0 done, P1 next)
**Branch**: `feat/mcp_app_ui`
**Scope**: Fix the BrandBanner to match Oak branding. Merge to `main`.

**Supersedes**: `ws3-local-widget-development.plan.md` (absorbed into P0).

**Prerequisite (complete)**: `ws3-contrast-validation-prerequisite.plan.md`
— WCAG AA contrast validation is built into the design token build.

---

## What Actually Matters

The banner must show:

1. The **real Oak logo** (not a hand-drawn approximation)
2. **Lexend** font (Oak's brand typeface)
3. **Mint #bef2bd** as the brand green (background/surface use only)
4. **#222222** dark text (body, links, logo via `currentColor`)
5. **Minimal banner height** — compact, not centred in a full viewport

And the design token pipeline must produce the correct CSS custom
properties to achieve this, using the MCP Apps SDK's 73 standard
host style variable names as the app's brand defaults (the host MAY
override these via CSS specificity for visual integration).

---

## How the SDK Styling System Works

The official pattern (from `ext-apps/docs/patterns.md`):

1. **App brand defaults**: App defines CSS custom properties in
   `:root` using the SDK's standard names (`--color-text-primary`,
   `--font-sans`, etc.) with `light-dark()` for theme support.
   These are the correct Oak brand values — complete and correct
   on their own.
2. **Host overrides** (optional): The host MAY send
   `hostcontextchanged` with theme, `styles.variables`, and
   `styles.css.fonts`. The app applies them via `applyDocumentTheme`,
   `applyHostStyleVariables`, `applyHostFonts`. Inline styles take
   precedence via CSS specificity. This is not a fallback mechanism —
   both states (with and without host overrides) are correct.
3. **Safe area insets**: Applied as inline styles via React state.

Our DTCG token pipeline generates CSS custom properties. As long as
the output provides the correct values, how we generate them is our
concern. The pipeline should also emit the SDK's standard variable
names so the host can override them for visual integration.

### SDK Standard Variable Names (closed union of 73)

Colours: `--color-{text,background,border,ring}-{primary,secondary,...}`
Typography: `--font-{sans,mono}`, `--font-weight-{normal,medium,...}`,
  `--font-{text,heading}-{xs..3xl}-{size,line-height}`
Layout: `--border-radius-{xs..full}`, `--border-width-regular`

Full list: `McpUiStyleVariableKey` in `@modelcontextprotocol/ext-apps`.

---

## Design Direction (confirmed by user)

- Logo: Real Oak SVG from Oak-Web-Application sprite sheet
- Brand colour: `#bef2bd` (mint) — surfaces/backgrounds only
- Text/links: `#222222` — dark text, not coloured accents
- Font: Lexend, embedded as `@font-face` (self-contained per ADR-151)
- Banner: minimally tall — logo + text on one compact line

---

## P0 — Dev Infrastructure

### 0.1: `dev:widget` script

```json
"dev:widget": "vite dev --config widget/vite.config.ts"
```

If `vite-plugin-singlefile` breaks dev mode, create a minimal
`widget/vite.dev.config.ts` without the singlefile plugin.

### 0.2: `dev:basic-host` script

basic-host is not published to npm. Clone the ext-apps repo:

```bash
git clone --branch "v$(npm view @modelcontextprotocol/ext-apps version)" \
  --depth 1 https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps
cd /tmp/mcp-ext-apps/examples/basic-host && npm install
SERVERS='["http://localhost:3333/mcp"]' npm run start
```

Add a convenience script that documents this workflow, or add a
`dev:basic-host` script that wraps the clone-and-run.

### 0.3: Turbo pipeline

Ensure dev scripts are NOT in the Turbo build pipeline.

### 0.4: Verify

1. Terminal 1: `dev:auth:stub` (port 3333)
2. Terminal 2: basic-host (`http://localhost:8080`)
3. Confirm banner renders in the basic-host iframe

### 0.5: Document

Update workspace README: dev workflow, MCPJam for visual review.

**Key files**: `apps/oak-curriculum-mcp-streamable-http/package.json`,
`apps/oak-curriculum-mcp-streamable-http/README.md`

---

## P1 — Fix Branding

This is the core work. All changes flow through the design token
pipeline.

### 1.1: Embed Lexend font

Download Lexend Latin variable WOFF2. Add `@font-face` declaration
to the widget CSS (or a `fonts.css` imported by it). The font data
will be inlined by `vite-plugin-singlefile` into the single HTML.

Update the palette token `font.family-body` and `font.family-display`
to `"Lexend", system-ui, sans-serif`.

The SDK's `--font-sans` variable should also resolve to Lexend. The
component token or the CSS should set:

```css
--font-sans: "Lexend", system-ui, sans-serif;
```

If a host provides its own font via `applyHostFonts`, that overrides.

### 1.2: Replace logo SVG

Extract the real Oak logo path from Oak-Web-Application
(`src/image-data/generated/inline-sprite.svg`, id="logo", 32x42
viewBox). Convert `fill="#222"` to `fill="currentColor"` for theme
adaptability.

In `BrandBanner.tsx`:

- Replace the three `<path>` elements with the real logo's single path
- Update `viewBox` from `"0 0 100 100"` to `"0 0 32 42"`
- Adjust `width`/`height` proportionally (e.g. `width="20" height="26"`)
- **Preserve** `aria-hidden="true"` on the SVG
- **Preserve** the single-link wrapping pattern (WCAG H2)

### 1.3: Adjust palette colours

In `packages/design/oak-design-tokens/src/tokens/palette.json`:

- Add `mint-300`: `#bef2bd` (light-mode surface/background)
- Add `green-700`: `#2a5c3a` (dark-mode surface-accent)
- Change `ink-950` from `#102033` to `#222222` (match Oak text)
- Keep `fern-500`/`fern-600` if still referenced; remove if unused
  after semantic mapping

### 1.4: Update semantic token mappings

**Light theme** (`semantic.light.json`):

- `surface-accent`: reference `mint-300` (`#bef2bd`)
- `accent`: `#222222` (dark text doubles as accent)
- `accent-strong`: `#222222` (same — no hover colour shift needed
  for text links; underline provides affordance)
- `text-primary`: references `ink-950` (now `#222222`)

**Dark theme** (`semantic.dark.json`):

- `surface-accent`: `#2a5c3a` (dark forest green — green-family
  echo of mint, 7.5:1 contrast for light text on it)
- `accent`: keep `sun-300` (`#f0c974`, golden yellow)
- `accent-strong`: keep `sun-400` (`#e0b85a`)
- `text-primary`: keep `paper-050` (`#fcfbf8`)

**Critical constraint**: `#222222` is a LIGHT-THEME-ONLY text colour.
Dark theme semantic tokens retain their current light-on-dark values.

### 1.5: Update contrast pairings

Add to `contrast-pairings.ts`:

- `text-primary` on `surface-accent` (text on mint) — both themes
- `focus-ring` on `surface-accent` (non-text on mint)
- Any other foreground/mint combinations

Run `pnpm --filter @oaknational/oak-design-tokens build` to validate.

### 1.6: Make banner minimally tall

In `index.css`, the current `.oak-app` uses `min-height: 100vh` with
`align-items: center` — this centres the banner vertically in a full
viewport. Change to:

- Remove `min-height: 100vh` and centring
- Banner sits at the top, compact height
- Padding from design tokens

### 1.7: Verify

- Build widget, check in basic-host
- Light theme: mint surface where appropriate, dark text, Lexend,
  real logo, compact banner
- Dark theme: acceptable contrast, logo adapts via `currentColor`
- `dist/contrast-report.json`: all pairings pass

**Key files**:

- `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/index.css`
- `packages/design/oak-design-tokens/src/tokens/palette.json`
- `packages/design/oak-design-tokens/src/tokens/semantic.light.json`
- `packages/design/oak-design-tokens/src/tokens/semantic.dark.json`
- `packages/design/oak-design-tokens/src/tokens/contrast-pairings.ts`

---

## P2 — Align Host Context with Official SDK Pattern

Our `App.tsx` is close to the canonical pattern but should match it
exactly (from `ext-apps/docs/patterns.md`):

1. `onhostcontextchanged` stores context in React state
2. A `useEffect` on that state calls `applyDocumentTheme()`,
   `applyHostStyleVariables()`, and `applyHostFonts()` imperatively
3. Safe area insets applied as inline styles
4. Initial context applied via `useEffect` on `app`

Also ensure the CSS provides the SDK's standard variable names as
app brand defaults so the host can override them for visual
integration. Our DTCG pipeline can generate these alongside the
`--oak-*` variables.

**Key files**: `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`

---

## P3 — Quality Gates + Merge

### 3.1: Full quality gate chain

```bash
pnpm check
```

### 3.2: Specialist reviews

- `code-reviewer` (gateway)
- `design-system-reviewer` (token changes, contrast)
- `accessibility-reviewer` (WCAG compliance, logo a11y)
- `react-component-reviewer` (BrandBanner, App.tsx changes)
- `mcp-reviewer` (host context pattern, SDK compliance)
- `release-readiness-reviewer` (merge go/no-go)

### 3.3: Merge

After all gates green and release-readiness GO:
merge `feat/mcp_app_ui` to `main`.

---

## Deferred

- `getUiCapability` — incompatible with per-request stateless server
  (ADR-112). The correct approach is already in place: always register
  App tools with `_meta.ui.resourceUri` AND include `content[]` text
  text content. Non-UI hosts ignore the `_meta.ui` field. No code change
  needed. Document this decision.
- WS3 Phase 5 (interactive user search view)
- Browser proof surfaces per ADR-147
- Dark theme full brand pass

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Mint #bef2bd fails as text colour | Surface-only; all text is #222 (12.6:1 on mint) |
| Dark theme contrast breaks | Do not apply #222 to dark theme; validate via build |
| Lexend WOFF2 bloats single-file HTML | Variable font ~25KB; measure before/after |
| basic-host clone workflow cumbersome | Document clearly; consider MCPJam as alternative |
| Branch divergence from `main` | Check divergence and merge `main` before P3 |

---

## Foundation Alignment

- **Principles**: Off-the-shelf patterns, no custom plumbing,
  token-driven, WCAG AA enforced
- **Testing Strategy**: Update BrandBanner tests for new SVG markup.
  Dev scripts verified manually (long-running processes).
- **ADR-148**: Design token architecture (three-tier DTCG)
- **ADR-151**: MCP App styling independence (self-contained HTML)
- **ADR-147**: Browser accessibility as blocking quality gate
- **ADR-112**: Per-request stateless server (getUiCapability deferred)
- **MCP App Styling**: `docs/governance/mcp-app-styling.md` — canonical
  styling patterns from the official SDK

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent umbrella
- `ws3-phase-5-interactive-user-search-view.plan.md` — next consumer
- `ws3-phase-6-docs-gates-review-commit.plan.md` — final closure
