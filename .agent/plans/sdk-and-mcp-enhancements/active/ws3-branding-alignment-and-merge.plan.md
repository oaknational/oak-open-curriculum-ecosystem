---
name: "Oak Branding Alignment + Merge Readiness"
overview: "Fix the BrandBanner: correct logo, colours, typography, spacing. Add dev infra. Merge to main."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "design-system-reviewer, accessibility-reviewer, mcp-reviewer, react-component-reviewer, code-reviewer, release-readiness-reviewer, architecture-reviewer-barney, architecture-reviewer-wilma, assumptions-reviewer"
supersedes:
  - "../current/ws3-local-widget-development.plan.md"
prerequisites_complete:
  - "../current/ws3-contrast-validation-prerequisite.plan.md"
review_gates:
  - gate: plan-review
    status: passed
    description: "All specialist reviewers must sign off on this plan before P1 implementation begins."
  - gate: post-p1-review
    status: passed
    description: "Code + design system + accessibility + MCP reviewers sign off after P1 implementation."
  - gate: pre-merge-review
    status: pending
    description: "Release readiness reviewer produces GO/NO-GO for merge to main."
todos:
  - id: p0-dev-infra
    content: "P0: Add dev:widget and dev:basic-host scripts."
    status: done
  - id: p1-branding
    content: "P1: Fix branding — real Oak logo SVG, Lexend font, oakGreen #287c34, mint #bef2bd, dark text #222222, dark accent green #008237/#78c85a, minimal banner height."
    status: done
  - id: p0-dev-infra-hardening
    content: "P0 hardening: port conflict detection, bun dependency check, npm install path fix."
    status: done
  - id: p2-host-context
    content: "P2: Remaining host context alignment (SDK variable bridges in widget CSS, CSS fallbacks)."
    status: pending
  - id: p2-sdk-fixes
    content: "P2: SDK audit fixes — isConnected/error, capability checks, prefersBorder, CSP, TSDoc corrections."
    status: pending
  - id: p3-quality-merge
    content: "P3: Quality gates, specialist reviews, merge to main."
    status: pending
isProject: false
---

# Oak Branding Alignment + Merge Readiness

**Last Updated**: 2026-04-07
**Status**: 🟢 IN PROGRESS (P0 done, P1 done + reviewed, P2 next)
**Branch**: `feat/mcp_app_ui`
**Scope**: Fix the BrandBanner to match Oak branding. Merge to `main`.

**Supersedes**: `ws3-local-widget-development.plan.md` (absorbed into P0).

**Prerequisite (complete)**: `ws3-contrast-validation-prerequisite.plan.md`
— WCAG AA contrast validation is built into the design token build.

---

## Review Gate Policy

**Non-trivial plan changes require reviewer sign-off before
implementation.** This plan was reviewed pre-implementation by five
specialist reviewers (assumptions, wilma, design-system, mcp, barney).
All blocking findings from that review are incorporated below.

Review gates are defined in the frontmatter. Each gate must be
explicitly passed before proceeding to the next phase.

---

## What Actually Matters

The banner must show:

1. The **real Oak acorn logo** (from `Oak-Web-Application` sprite sheet)
2. **Lexend** font (Oak's brand typeface, weight 300 default, 700 bold)
3. **oakGreen #287C34** as the primary accent (links, buttons)
4. **Mint #bef2bd** as the brand surface colour (backgrounds only)
5. **#222222** dark text (body text — Oak calls this "black")
6. **Minimal banner height** — compact, not centred in a full viewport

And the design token pipeline must produce the correct CSS custom
properties to achieve this. The widget CSS (not the token build)
bridges SDK standard variable names to `--oak-*` tokens for host
override support.

---

## Source of Truth: Oak-Web-Application Brand Assets

Extracted from the Oak-Web-Application repository (sibling repo):

### Logo

- File: `src/image-data/generated/inline-sprite.svg`, `id="logo"`
- ViewBox: `0 0 32 42`
- Fill: `#222` → convert to `currentColor` for theme adaptability
- Single `<path>` element (filled, not stroked)

### Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| oakGreen | `#287C34` | Primary brand green (links, buttons) |
| mint | `#bef2bd` | Signature surface colour |
| black | `#222222` | Primary text colour |
| white | `#ffffff` | Inverse text |
| grey10 | `#F9F9F9` | Lightest background |

Oak's text-on-background mapping: mint background → black text,
oakGreen background → white text.

### Typography

- Font: Lexend (Google Font)
- Import: `next/font/google` in Oak-Web-Application; we use
  `@import url(...)` with CSP declaration
- Default weight: **300** (light)
- Bold weight: **700**
- All text uses Lexend (no heading/body font distinction)

### Button Hover Pattern

Oak uses **drop-shadow** effects for button hover
(`8px 5px 13px 1px #0b4413` for oakGreen buttons), NOT background
colour shifts. For our
token-driven CSS, we use a darker green variant for `accent-strong`
to provide visible hover state differentiation, with a note that the
canonical Oak pattern uses shadow.

---

## How the SDK Styling System Works

The official pattern (from `ext-apps/docs/patterns.md`):

1. **App brand defaults**: App defines CSS custom properties in
   `:root` using the SDK's standard names (`--color-text-primary`,
   `--font-sans`, etc.). These are correct Oak brand values.
2. **Host overrides** (optional): The host MAY send
   `hostcontextchanged` with theme, `styles.variables`, and
   `styles.css.fonts`. The app applies them via `applyDocumentTheme`,
   `applyHostStyleVariables`, `applyHostFonts`. Inline styles take
   precedence via CSS specificity.
3. **Safe area insets**: Applied as inline styles via React state.

### SDK Variable Bridge Location

**The bridge lives in `widget/src/index.css`, NOT in the token build
pipeline.** The design token package (`packages/design/`) is
infrastructure consumed by apps. The MCP Apps SDK is an app-layer
dependency. Making `build-css.ts` aware of SDK variable names would
create a reverse dependency (design → app-protocol). Static CSS in the
widget is the correct seam: app-layer knowledge (SDK protocol) meets
infrastructure-layer output (token CSS).

The `var()` references resolve correctly under both `:root` and
`[data-theme='dark']` because they point to already-theme-aware
`--oak-semantic-*` properties.

### SDK Standard Variable Names (closed union)

Colours: `--color-{text,background,border,ring}-{primary,secondary,...}`
Typography: `--font-{sans,mono}`, `--font-weight-{normal,medium,...}`,
  `--font-{text,heading}-{xs..3xl}-{size,line-height}`
Layout: `--border-radius-{xs..full}`, `--border-width-regular`

Full list: `McpUiStyleVariableKey` in `@modelcontextprotocol/ext-apps`.

---

## P0 — Dev Infrastructure (DONE)

Completed in commit `9e3c0712`. Scripts `dev:widget` and
`dev:basic-host` added, turbo entries, README workflow documented.

---

## P1 — Fix Branding

This is the core work. All changes flow through the design token
pipeline. All semantic tokens reference palette tokens via `{color.xxx}`
syntax — **no hardcoded hex values at the semantic tier** (ADR-148
three-tier referencing rule).

### 1.1: Import Lexend web font

Add Google Fonts `@import` in `widget/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;700&display=swap');
```

**Vite singlefile verification (BLOCKING)**: After build, inspect
`dist/mcp-app.html` to confirm the `@import` is either preserved
with the absolute URL or inlined correctly. If the singlefile plugin
breaks the `@import`, the fallback is a `<link>` tag in
`widget/index.html` (the Vite HTML entry point):

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;700&display=swap">
```

This verification is tied to the post-P1 review gate — reviewers
must confirm font loading works in the built output.

**Font fallback behaviour**: If Lexend fails to load (CDN down,
CSP blocked), `system-ui` takes over. System fonts default to
weight 400, not 300. This creates minor visual divergence (slightly
heavier text) which is acceptable — readability is preserved and
the layout remains stable thanks to `display=swap`.

Update palette tokens:

- `font.family-body`: `"Lexend", system-ui, sans-serif`
- `font.family-display`: `"Lexend", system-ui, sans-serif`
- Rename `font.weight-regular` → `font.weight-light`: `300`
  (Oak's default body weight; "light" matches CSS convention)
- Rename `font.weight-semibold` → `font.weight-bold`: `700`
  (Oak's emphasis weight; "bold" matches CSS convention)

Add `$description` to both family tokens documenting that they
intentionally share a value for the current Oak brand but are kept
as separate seams for future typographic divergence.

**Note on weight token renaming**: The semantic and component layers
reference these tokens (e.g. `{font.weight-regular}`). All
references must be updated atomically: palette rename + semantic
update + component update in the same commit.

### 1.2: Replace logo SVG

Extract the real Oak acorn logo from `Oak-Web-Application`
(`src/image-data/generated/inline-sprite.svg`, `id="logo"`,
`viewBox="0 0 32 42"`). Convert `fill="#222"` to
`fill="currentColor"` for theme adaptability.

In `BrandBanner.tsx`:

- Replace the three stroke-based `<path>` elements with the single
  filled path from the sprite sheet
- Update `viewBox` from `"0 0 100 100"` to `"0 0 32 42"`
- Adjust dimensions proportionally (e.g. `width="20" height="26"`)
- **Preserve** `aria-hidden="true"` on the SVG
- **Preserve** the single-link wrapping pattern (WCAG H2)

### 1.3: Adjust palette colours

In `packages/design/oak-design-tokens/src/tokens/palette.json`:

**Add:**

- `oak-black`: `#222222` — Oak's primary text colour ("black")
- `oak-green-500`: `#287C34` — Oak's primary brand green
- `oak-green-600`: `#22692C` — Darker variant for hover/active states
- `mint-300`: `#bef2bd` — Oak's signature mint surface
- `green-700`: `#2a5c3a` — Dark-mode surface-accent

**Keep unchanged:**

- `ink-950`: `#102033` — Dark-mode page background (NOT changed to
  `#222222`; this breaks cross-theme coupling identified by Wilma,
  assumptions-reviewer, and design-system-reviewer)
- `ink-800`, `ink-700`, `ink-500` — dark-mode supporting palette
- `paper-050`, `paper-100`, `paper-200`, `paper-400` — light surfaces
- `sun-300`, `sun-400` — dark-mode accent
- `sky-400`, `sky-600` — focus ring
- `danger-300`, `danger-500` — error states

**Remove:**

- `fern-500` — replaced by `oak-green-500`; unreferenced after
  semantic remapping
- `fern-600` — replaced by `oak-green-600`; unreferenced after
  semantic remapping

**Update:**

- `shadow.card`: review whether `rgba(16, 32, 51, 0.12)` (derived
  from old `ink-950`) should be updated for visual coherence. The
  shadow is a palette-level raw value, not a tier violation, but
  should be assessed.

### 1.4: Update semantic token mappings

**Light theme** (`semantic.light.json`):

- `surface-accent`: `{color.mint-300}` — mint surface
- `accent`: `{color.oak-green-500}` — links, button backgrounds
- `accent-strong`: `{color.oak-green-600}` — hover/active states
- `text-primary`: `{color.oak-black}` — body text (#222222)

All other light semantic tokens unchanged.

**Dark theme** (`semantic.dark.json`):

- `surface-accent`: `{color.green-700}` — dark forest green

All other dark semantic tokens unchanged. `surface-page` remains
`{color.ink-950}` (#102033), `text-inverse` remains `{color.ink-950}`.

**Remove:**

- `attention` semantic token — no component-layer consumer. Dead
  token in **both** `semantic.light.json` AND `semantic.dark.json`;
  remove from both files.

**Critical constraint**: `oak-black` (#222222) is referenced ONLY by
light-theme `text-primary`. Dark theme continues to use `ink-950`
for its own palette. No cross-theme coupling.

### 1.5: Update contrast pairings

Add to `contrast-pairings.ts`:

- `text-primary` on `surface-accent` (text on mint) — both themes
- `text-inverse` on `surface-accent` (text on accent surface) — both
  themes (documents dark-mode pairing for safety)
- `accent` on `surface-page` (green links on page background) — text
- `accent` on `surface-panel` (green links on panel) — text
- `accent-strong` on `surface-page` (hover green on page) — text
- `text-inverse` on `accent` (white text on green button) — text

**Focus ring on mint — FAILS at ~2.79:1** (below 3:1 non-text
threshold). `sky-600` (#3d8fb5) is too light against `mint-300`
(#bef2bd). Resolution: use `oak-green-500` (#287C34, ~3.96:1 on
mint) as the focus ring colour on accent surfaces. Add a
`focus-ring-on-accent` semantic token referencing `{color.oak-green-500}`
in light mode. Dark mode retains `sky-400`. Update the focus-visible
CSS to use `var(--oak-semantic-focus-ring)` which already works for
page/panel surfaces; accent surfaces override via a CSS class or
contextual custom property.

Remove or update any pairings that referenced `fern-500`/`fern-600`.

**Implementation ordering**: Add new palette tokens (`oak-black`,
`oak-green-500`, `oak-green-600`, `mint-300`, `green-700`) BEFORE
updating semantic references, and update semantic references BEFORE
removing `fern-500`/`fern-600`. All changes in tasks 1.3 and 1.4
must land in a single commit to avoid broken intermediate states.

Run `pnpm --filter @oaknational/oak-design-tokens build` to validate.

### 1.6: Make banner minimally tall

In `index.css`, the current `.oak-app` uses `min-height: 100vh` with
`align-items: center`. Change to:

- Remove `min-height: 100vh` and centring
- Banner sits at the top, compact height
- Padding from design tokens

### 1.7: Verify

1. Build widget, check in basic-host
2. Light theme: mint surface where appropriate, dark text, Lexend,
   real logo, compact banner
3. Dark theme: acceptable contrast, logo adapts via `currentColor`
4. `dist/contrast-report.json`: all pairings pass
5. **Vite singlefile check**: `@import` survives in built HTML

### 1.8: Update tests

- Update `BrandBanner` tests for new SVG markup (single filled path
  replacing three stroked paths)
- Update any design-tokens-core unit tests that hardcode `#102033`
  as `ink-950` (these tests should use the palette source, not
  hardcoded hex, but that is a pre-existing test quality issue —
  fix if in scope, track if not)

**Key files**:

- `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/index.css`
- `packages/design/oak-design-tokens/src/tokens/palette.json`
- `packages/design/oak-design-tokens/src/tokens/semantic.light.json`
- `packages/design/oak-design-tokens/src/tokens/semantic.dark.json`
- `packages/design/oak-design-tokens/src/tokens/contrast-pairings.ts`

---

## P2 — SDK Alignment and Audit Fixes

### 2.1: SDK variable bridges in widget CSS (F3/F5)

In `widget/src/index.css`, after the token import, add a static
CSS block mapping SDK standard variable names to Oak tokens:

```css
/* SDK standard variable bridges — enables host override via
   applyHostStyleVariables(). Host inline styles win via specificity. */
:root {
  --color-text-primary: var(--oak-semantic-text-primary);
  --color-background-primary: var(--oak-semantic-surface-page);
  --color-background-secondary: var(--oak-semantic-surface-panel);
  --color-border-primary: var(--oak-semantic-border-subtle);
  --font-sans: var(--oak-semantic-font-body-family);
}
```

Only bridge the SDK variables actually consumed by this widget's CSS.
Each must include a fallback value:
`var(--font-sans, "Lexend", system-ui, sans-serif)`.

### 2.2: Handle `isConnected` and `error` from `useApp` (A5)

Destructure all three fields from `useApp`:

```typescript
const { app, isConnected, error } = useApp({...});
```

Render error and connecting states per the SDK's canonical React
pattern:

```tsx
if (error) return <div className="oak-app oak-app--error">...</div>;
if (!isConnected) return <div className="oak-app oak-app--connecting">...</div>;
```

`error` is typed `Error | null` — no narrowing needed.

### 2.3: Capability check before `openLink` (B8)

Check `app.getHostCapabilities()?.openLinks` (note: **plural**
`openLinks`, not `openLink`) before calling `app.openLink()`. The
SDK's internal `assertCapabilityForMethod` **throws** if the host
lacks the capability — pre-checking is essential, not optional.

```typescript
const capabilities = app.getHostCapabilities();
if (capabilities?.openLinks) {
  event.preventDefault();
  void app.openLink({ url });
}
// else: native <a href> fallback navigates
```

### 2.4: CSP and `prefersBorder` on widget resource (B5/B6)

Add `_meta.ui` to the content item in `register-resources.ts`:

```typescript
contents: [{
  uri: WIDGET_URI,
  mimeType: RESOURCE_MIME_TYPE,
  text: getWidgetHtml(),
  _meta: {
    ui: {
      csp: {
        resourceDomains: [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
      },
      prefersBorder: true,
    },
  },
}]
```

Verify that `wrapResourceHandler` return type propagates
`McpUiReadResourceResult` (not just `ReadResourceResult`) so
`_meta.ui` compiles without type assertions.

### 2.5: TSDoc corrections (A1/A3)

- A1: Correct single-callback-slot TSDoc in `App.tsx` — SDK has
  `addEventListener`, we compose in one handler for simplicity
- A3: Remove specific count from TSDoc — say "standard names"
  not "73" or "65"

### 2.6: Update README (A4)

Update "no external network requests" text after Google Fonts
`@import` is added.

### 2.7: Reconcile governance document

Update `docs/governance/mcp-app-styling.md` to resolve the
contradiction between "Self-Contained Embedding" (base64 WOFF2)
and the CSP section (`@import` + `resourceDomains`). The canonical
approach is `@import` + CSP for standard web fonts (per user
feedback). Update the "Self-Contained Embedding" section to reflect
this.

**Key files**:

- `apps/oak-curriculum-mcp-streamable-http/widget/src/index.css`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `docs/governance/mcp-app-styling.md`

---

## P3 — Quality Gates + Merge

### 3.1: Full quality gate chain

```bash
pnpm check
```

### 3.2: Specialist reviews (post-p1-review gate)

- `code-reviewer` (gateway)
- `design-system-reviewer` (token changes, contrast, dead tokens)
- `accessibility-reviewer` (WCAG compliance, logo a11y, contrast)
- `react-component-reviewer` (BrandBanner, App.tsx changes)
- `mcp-reviewer` (CSP, prefersBorder, capability checking, SDK
  compliance)
- `architecture-reviewer-barney` (boundary/simplification check)

### 3.3: Pre-merge review (pre-merge-review gate)

- `release-readiness-reviewer` (merge go/no-go)
- Check divergence from `main` and merge if needed

### 3.4: Merge

After all gates green and release-readiness GO:
merge `feat/mcp_app_ui` to `main`.

---

## Explicitly Deferred

Items consciously excluded from this branch to prevent scope creep:

- **B4: `downloadFile` wiring** — New feature plumbing (requires
  widget to react to tool results and call `app.downloadFile()` with
  `EmbeddedResource | ResourceLink` types). Deferred to Phase 5.
- **B7: `sendLog` adoption** — API uses `{ level, data, logger? }`
  not `{ level, message }`. Low-priority, deferred to Phase 5.
- **B2: `containerDimensions`** — Phase 5 (interactive search view)
- **B3: `displayMode`/`requestDisplayMode`** — Phase 5
- **B9–B14**: Platform capabilities, locale, updateModelContext,
  sendMessage, streaming preview, per-tool auth — all Phase 5
- **`getUiCapability`** — Incompatible with per-request stateless
  server (ADR-112). Decision documented.
- **Dark theme full brand pass** — Current dark theme is functional
  but not fully audited against Oak's brand. Separate workstream.
- **Grey-scale alignment** — Oak uses `#F9F9F9` (grey10) as lightest
  background vs our `#fcfbf8` (paper-050). Minor; separate scope.

---

## Reviewer Finding Resolution Log

Findings from pre-implementation review (2026-04-06) by 5 specialists:

| # | Finding | Source | Resolution |
|---|---|---|---|
| 1 | ink-950 cross-theme coupling | Wilma, Assumptions, Design System | NEW: `oak-black` token for #222222. ink-950 unchanged at #102033. |
| 2 | Tier-skip: hardcoded hex in semantic | Design System | All semantic tokens reference palette via `{color.xxx}`. |
| 3 | SDK bridge in wrong location | Barney, Wilma, Assumptions | Bridge lives in `widget/src/index.css`, not `build-css.ts`. |
| 4 | No hover state on buttons | Design System, Barney, Assumptions | NEW: `oak-green-600` (#22692C) for `accent-strong`. Oak uses shadow; we use colour variant. |
| 5 | Dead fern-500/fern-600 tokens | Barney | Removed; replaced by `oak-green-500`/`oak-green-600`. |
| 6 | Dead `attention` semantic token | Barney | Removed. |
| 7 | Governance doc contradiction | Assumptions, Barney | Task 2.7: reconcile mcp-app-styling.md. |
| 8 | Vite singlefile + @import | Wilma | Verification step added to 1.7. |
| 9 | `openLinks` (plural) capability key | MCP Reviewer | Corrected in 2.3. |
| 10 | `openLink` throws without capability | MCP Reviewer | Pre-check mandatory in 2.3. |
| 11 | Focus ring on mint FAILS ~2.79:1 | Design System (R2) | Concrete fix in 1.5: `focus-ring-on-accent` token using oakGreen. |
| 12 | Shadow token drift | Assumptions, Design System | No change needed — ink-950 unchanged, shadow coherent. |
| 13 | `sendLog` API shape wrong | MCP Reviewer | Corrected in Deferred section. |
| 14 | `downloadFile` needs MCP resource types | MCP Reviewer | Corrected in Deferred section. |
| 15 | Font family seam | Barney | Keep two tokens with `$description`. |
| 16 | Accent was wrongly #222222 | Assumptions, Design System | Corrected: accent is oakGreen #287C34. |
| 17 | Unit tests hardcode #102033 | Design System | Noted in 1.8. |
| 18 | `prefersBorder` placement | MCP Reviewer | Combined with CSP in same `_meta.ui` object (2.4). |
| 19 | `wrapResourceHandler` return type | MCP Reviewer | Verification in 2.4. |
| 20 | Reviewer sign-off requirement | User directive | Review gates added to frontmatter. |
| 21 | `attention` removal: both theme files | Design System (R2) | Clarified in 1.4: remove from light AND dark. |
| 22 | Implementation ordering: add before remove | Design System (R2) | Ordering note added to 1.5. |
| 23 | Vite fallback path underspecified | Wilma (R2) | Fallback `<link>` in `widget/index.html` documented in 1.1. |
| 24 | Font weight fallback 300→400 | Wilma (R2) | Documented in 1.1 as acceptable trade-off. |
| 25 | Font weight token naming | Assumptions (R2) | Renamed to `weight-light` (300) and `weight-bold` (700). |
| 26 | Absolute path in plan | Assumptions (R2) | Replaced with relative reference. |
| 27 | text-inverse on surface-accent contrast | Wilma (R2) | Added to contrast pairings in 1.5. |
| 28 | oakGreen on paper-100 marginal 4.58:1 | Design System (R2) | Build pipeline validates; monitored. |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Mint #bef2bd fails as text colour | Surface-only; all text is #222 (≈8.4:1 on mint) |
| Dark theme contrast breaks | ink-950 unchanged; dark theme palette untouched |
| Google Fonts CDN unavailable | Fallback: `system-ui, sans-serif` in stack; `display=swap` |
| Vite singlefile breaks @import | Verify in 1.7; fallback: `<link>` in `widget/index.html` |
| Focus ring on mint fails (~2.79:1) | `focus-ring-on-accent` semantic token using oakGreen (~3.96:1) |
| oakGreen on paper-100 marginal (4.58:1) | Build pipeline validates exact ratio; monitored |
| Font CDN down: weight 300→400 shift | Documented as acceptable; readability preserved |
| Host ignores CSP resourceDomains | Font fallback stack provides graceful degradation |
| basic-host clone workflow cumbersome | Documented; MCPJam as alternative |
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
  styling patterns from the official SDK (to be reconciled in 2.7)

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent umbrella
- `ws3-mcp-apps-sdk-audit.plan.md` — SDK audit companion plan
- `ws3-phase-5-interactive-user-search-view.plan.md` — next consumer
- `ws3-phase-6-docs-gates-review-commit.plan.md` — final closure
