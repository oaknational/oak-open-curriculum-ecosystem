# Session notes — MCP-128 landing conversion (2026-07-23)

## Round 2 (owner direction): match www.thenational.academy

Owner ruled: page ships at www.thenational.academy/mcp and must look like a
real Oak page (reference: /teachers/programmes/maths-secondary/units), with
site chrome faked by links rather than real nav. Grounded in OWA source
(TopNavMinimal.tsx, TabLink.tsx, Header.tsx, LayoutSiteFooter.tsx):

- **Masthead** = OWA TopNav grammar: black tab bar (`--bg-btn-primary`,
  pt 16, ph 20/40, square-bottomed `oak-btn` tabs — "Teachers" selected
  as secondary/white, "Go to pupils" primary), then white logo bar
  (border-bottom 1px `--border-neutral-lighter`, Oak logo-with-text svg
  copied from oak-components `assets/logo.svg`), with a right-aligned
  "Back to the main Oak website" link standing in for SubNav/search.
  `oak-skip-link` added.
- **Hero** = OWA programme Header: mint band (`--band-pad` 40 mobile /
  64 desktop, matching Header.tsx pv), breadcrumbs row (body-3, Home ›
  page), 24px-gap left-aligned column, `oak-heading-1` h1 (heading-4 on
  mobile), `oak-body-2` summary. Illustration slot REMOVED per owner —
  simplest page, no artwork.
- **Footer** = simplified LayoutSiteFooter: header-underline squiggle rule
  (svg copied from oak-components), logo + © company line + address
  (copy verbatim from the real footer). No link columns invented.
- Tag copy is owner-edited: "Invite Only Private Beta".

## Round 3 (owner direction): colour + polish pass

- Tab bar: "Go to pupils" → "Back to www" (→ homepage); Teachers tab → /teachers.
- Nav right link → pill-shaped small secondary button (Oak chip treatment).
- Connect section → full-bleed lemon band (`--surface-decorative-5-subtle`),
  homepage grammar; h2 bumped to heading-4; code surfaces flip to white on
  the band. Documentation card → aqua.
- Rhythm: `--main-gap` 40/56 between hero and content, 56 above the card
  stack, 80 below content before the footer.
- A11y: tabs wrapped in labelled `<nav>`, `role="list"` restored on the
  de-bulleted resources list (Safari), footer address in `<address>`,
  skip link + landmark labels verified.

## Round 4 (owner direction): icons, themes, hint removal

- "Click to expand" hints REMOVED (owner delegated the call): the accordion
  chevron carries the affordance; the hint duplicated it in the page's
  weakest type. Resolves the standing question.
- Real Oak icons hotlinked from OWA's Cloudinary set (external icon on the
  back pill; search/filter/warning/chevrons on the search template).
- Theme audit (light/dark/high-contrast/colour-safe): black logo svg,
  footer squiggle, and bare hotlinked icons now carry
  `filter: var(--filter-icon)` so they invert in dark; verified by
  screenshot in all four themes.
- Candidate pages a/b: patched the missing `--band-pad` override and
  region padding (the "weird formatting" — they predated the page override).

## Round 5 (owner direction): theme control + token enhancements

- Theme control (Light/Dark/System/High contrast `oak-select`) added to the
  masthead of this page and every template; shared `theme-control.js` sets
  root `data-theme`, persists to localStorage, event-delegated.
- Dark-theme token review (`explorations/dark-theme-token-review.md`)
  APPLIED as `theme-enhancements.css`, loaded after the bundle on every
  page. Set-then-override is deliberate and temporary: the synced bundle
  stays pristine, the overlay IS the upstream diff, and it gets DELETED
  (file + link + ds-base lines) once /design-sync lands the values in the
  bundle. Light theme untouched (official Oak ground truth); HC/CS verified
  unreachable by the overlay by construction.

## Round 1 (kept)

- Google Fonts import removed (fonts ship locally).
- Nested Tools/Resources disclosures: stood down the descendant-scoped
  `.oak-accordion summary` inheritance (double markers, centered labels,
  ancestor-driven chevron rotation); dense token-built rows with
  self-scoped chevrons.
- Legacy interior CSS → tokens throughout (type ramp, `--text-subdued`,
  `--border-neutral-lighter`, gap-based stacks); prefers-color-scheme
  block removed (role tokens theme themselves).
- Inline `code` chips + `pre` panel from tokens (`--bg-subtle`,
  `--radius-xs`/`--radius-container`, `--font-mono`).
- Accordions use `.oak-accordion__body`; card inset governs combined
  `oak-card oak-accordion`.
- Dead CSS removed (`.expandable*`, `.sr-only`, `.prompt-args`).

## Judged but left alone

- The two flagged system gaps (`--band-pad: 0` default, `.oak-main`
  missing `align-content: start`): permanent cures belong upstream via
  /design-sync — this page carries the intended values until they land;
  band-pad retuned to 40/64 to match OWA header padding.
- Favicon links point at production paths — 404 in preview, correct on
  deploy.

## Handoff targets

- Most consuming apps: TypeScript Next.js on Vercel — see
  `templates/oak-site-page/README.md` for the porting contract.
- **This MCP page's consumer is an Express app using React** (no Next):
  the page already fits — plain `<a>` anchors (no `next/link` /
  `resolveOakHref`), absolute www URLs for chrome links, and the DS is one
  static `styles.css` (+ fonts) to serve; `assets/logo.svg` and
  `assets/header-underline.svg` need serving alongside. `class`→`className`
  and inline styles→style objects when lifted into JSX.

## Upstream ledger — everything /design-sync should carry back

1. `.oak-accordion summary` → `.oak-accordion > summary` (nested-details bug).
2. `--band-pad: 0` default and `.oak-main` missing `align-content: start`.
3. New components proven here: code chip/block surface, breadcrumbs,
   `oak-band` tone modifiers, masthead/footer chrome (+ `logo.svg`,
   `header-underline.svg` assets).
4. Local mask-icon set (`assets/icons/` for the `--ic-*` contract) — until
   then, ink-carrying assets need `filter: var(--filter-icon)` and icons
   are hotlinked from OWA's Cloudinary (network dependency).
5. Dark-theme token changes per `explorations/dark-theme-token-review.md`
   (dark link ramp, dark red tints, -6-soft alias + capped-ramp comment,
   dark-shadow comment). On landing: DELETE every `theme-enhancements.css`,
   its `<link>` on this page, and the ds-base.js overlay lines.

## Questions for the owner

(none open — the accordion selector fix is item 1 of the ledger)
