# Oak Design Showcase

A one-page live showcase of the
[Oak Open Curriculum Design System](../../packages/design/oak-design-system/README.md):
plain-CSS kit consumption — no Tailwind, no PostCSS, no mapping layer — with
live identity and theme switching over the kit's own classes and token roles.
One set of markup, many faces: every visible difference between identities
and themes is the token contract at work.

The [Curriculum Hub](../oak-curriculum-hub/README.md) demonstrates the
Tailwind-mapped consumption path; this app demonstrates the plain path. The
kit's `consuming-nextjs.md` names both apps as its worked examples: the hub
for the Tailwind mapping, this app for plain package-entry consumption.

## Run it

From the repo root:

```bash
pnpm design:showcase
```

That starts the dev server on port 3020 and opens the page in your browser.
Inside this workspace, `pnpm dev` starts the server without opening a
browser.

## The page

The kit's region contract (`.oak-canvas` over sibling `data-region`
elements, under the shipped `home` composition map): a utility bar carrying
the switchboard, a masthead, a main with hero and specimen regions (type
ramp, buttons, tags, a card — all `.oak-*` classes), and a footer. The
switchboard drives three axes:

- **Theme** — all five kit themes (light / dark / match-device /
  high-contrast / colour-safe) through the kit's `oak-theme.js` runtime,
  inlined pre-paint in `app/layout.tsx` so a stored choice applies before
  first paint. A theme choice persists (localStorage, the runtime's
  contract). Until a choice is made the control reads "Identity default" —
  the selectable no-choice state where the identity's own polarity governs
  (EMC² is dark-first), and choosing it clears a stored choice (DDR-003
  dated amendment 2026-08-11). High contrast also has an OS-level route
  with no control interaction — a `prefers-contrast: more` request applies
  it without claiming a choice; colour safe is control-only. With
  JavaScript disabled, reduced motion and forced colors still work at the
  CSS level, but the high-contrast and colour-safe themes have no route —
  they need the runtime.
- **Motion** — the orthogonal motion axis (match-device / reduced / full),
  same runtime.
- **Identity** — Oak, plus the kit's two counter-brands (Public Digital Service and
  EMC²), by swapping a `brand.css` link loaded after every bundled sheet so
  the brand wins the cascade at equal specificity.

Two deliberate demo-only properties, recorded so they read as decisions:

- **Identity does not persist across reloads.** Persisting it would need a
  second pre-paint bootstrap to avoid a flash of Oak brand — exactly the
  problem `oak-theme.js` exists to solve for themes. The demo swap is
  in-page state; a reload returns to Oak.
- **Client-side identity switching is the showcase's mechanism, not the
  production shape.** The kit's `consuming-nextjs.md` §5 productionises
  identity as one server-emitted static sheet per tenant ("no flash, no
  client logic"); a cookie + refresh shape was weighed and rejected here
  because a live switchboard should not pay a server round trip per flick.
  Production consumers should follow §5.

The masthead is text-only by design: the kit's brand-asset mechanism is
file replacement (`brand.css`: "replace assets/logo-\*.svg"), and no token
role carries the logo, so a live three-identity logo swap has no kit
mechanism to ride — a text brand-name keeps the markup honest under every
identity.

## Consumption mechanism

`app/globals.css` starts with one import: the kit's exported aggregate
stylesheet (`@oaknational/oak-design-system/styles.css`), the package's
single entry point and the source of truth for sheet composition and order.
Fonts are the kit's own self-hosted faces — no `next/font`, no network at
build. Page markup uses `.oak-*` classes and token roles only; the
page-level hook rules in `globals.css` (for example `.mast`, which
PDS's expression layer restyles into the GDS masthead grammar)
compose token roles and keywords exclusively. The utility bar deliberately
is not an inverted band: controls on inverted surfaces need the kit's
inverted focus ring, and a brand that re-polarises the band has no token
to restore it — the footer, which carries one link and no controls beyond
it, is the page's one inverted surface and scopes the inverted ring onto
that link.

The counter-brand sheets reference their own web fonts and icon CDNs at
browser time (kit-authored content, copied verbatim); the test suite aborts
every non-same-origin request and asserts no unexpected third-party origin
ever appears.

## Kit-asset copies

`public/oak-theme.js` and `public/brands/*/…` are tracked byte-copies of
kit files, serving constraints only (the pre-paint script is inlined by a
plain file read; the brand sheets are swapped by URL). The workspace
package stays the single source: `pnpm validate-kit-assets` (chained into
the root `repo-validators:check` gate) fails on any byte drift AND
recomputes each sheet's local import/url() closure so an incompletely
copied set fails loudly. The manifest is repo-scoped, not
showcase-scoped: it also carries the hub's serving copy of the theme
runtime (`../oak-curriculum-hub/public/oak-theme.js`), so the whole
copy-set has one guard home.

## No hardcoded design values

Owner invariant: everywhere the showcase uses a value it must come from the
design system. Enforced by instrument, not review vigilance:

- **TSX**: the `style` attribute is banned outright (ESLint
  `no-restricted-syntax`) — presentation lives in `globals.css` hooks
  composed from token roles, never inline where a brand's expression layer
  cannot reach it.
- **CSS**: `pnpm validate-authored-css` (same root gate) parses every
  authored stylesheet with postcss and fails on any literal design value —
  hex colours, colour functions, unit-carrying numbers — including inside
  `var()` fallbacks. Kit-authored copies under `public/` are definitions,
  not consumption, and are owned by the parity validator instead.

## Tests

- `pnpm test` — unit tests (happy-dom): component contracts as
  assistive-tech roles and structure through the view + binder split (the
  switchboard renders from an injected fake runtime store), the theme
  store's choice-snapshot and notification contract, the instrument
  classifiers, and the opener-command platform mapping.
- `pnpm test:ui` — Playwright against the BUILT page (`pnpm start`): region
  contract in effect (live grid areas), theme/identity/motion switches
  proven through the real controls (attribute + cascade + computed-style
  assertions), pre-paint persistence, and the dark-first counter-brand's
  polarity.
- `pnpm test:a11y` — axe WCAG 2.2 AA across the full identity × theme
  matrix (15 cells; the match-device cells run under an emulated dark OS —
  under the default light emulation they would replay the light cells by
  construction), 320px reflow per identity, the OS accessibility signals
  (`prefers-contrast: more` auto-selecting high-contrast; forced colors),
  and keyboard focus visibility in both polarities. The `system`-follows-
  device ride itself is a behaviour test in the UI suite.

  The suite is fully green: the six pds specimen cells that were declared
  known-red on 2026-08-13 (inverted masthead ink on a non-inverted surface,
  exactly 1:1) were cured the same day at the cascade generator — the page
  sheet had declared the masthead surface at higher specificity than the
  hook-clean contract brand expression layers assume (`specimen.css`, the
  `.mast` split carries the record). Any red is new information.

## Rendering and test gotchas (proven in this workspace)

Each of these cost a real investigation in the 2026-08-18/19 review
rounds; the cure is stated so the next round does not re-derive it.

- **Cross-realm `instanceof`**: a frame's elements are instances of the
  FRAME's classes, so a parent-realm `instanceof HTMLElement` silently
  rejects every cross-document node. Null-check typed `querySelector`
  results instead.
- **`light-dark()` resolves at the DECLARING element**: a subtree
  `data-theme` cannot flip `:root`-declared tokens; theme the document
  root (the composition exhibit's applier pattern).
- **Focus-scroll is the "scroll reset"**: focusing an offscreen control
  scrolls it into view, so arrow-key radio groups at the top of the page
  reset the scroll unless the control bar is sticky (always in view means
  no jump); residual drift is scroll anchoring doing its job.
- **React-owned nodes are never removed**: a server-rendered `<link>` is
  React's — retire it with `disabled = true`, never `.remove()` (React
  restores hoistables). React 19 hoists stylesheets only under a
  `precedence` prop; otherwise they render in place in the body. And "a
  request is not application": the binder stamps
  `data-oak-brand-applied` at swap completion because DOM presence is not
  cascade state (`link.sheet` mints ~135 ms before load).
- **Playwright proves the BUILT artefact**: the suites run `next start` on
  `.next` — rebuild before re-running or you test the previous code.
- **Auto-margin grid items shrink to fit**: a grid item with
  `margin-inline: auto` does not stretch to its track; `/tokens` had only
  ever looked right by accident.
- **The layout viewport is not the visual viewport**: macOS overlay
  scrollbars leave `clientWidth` at 320 while Linux classic scrollbars
  narrow it (~305), so an SC 1.4.10 pass at exactly 320 with zero slack is
  a latent CI red. Probe BELOW the boundary and measure the floor.
- **A scroll container must be the containing block for its own
  absolutely positioned descendants** (`position: relative` on the
  scroller), or their static positions ride the content past the clip
  and tax the document's scroll width (two instances: a 228 px sideways
  scroll, then a 312 px floor from visually-hidden helpers).
- **`overflow-x: auto` computes the unspecified axis to `auto`**: a
  "horizontal-only" scroller picked up ~3 px of rounded-border scroll
  slack vertically and axe rightly demanded keyboard access to it. Close
  the artifact axis explicitly (`overflow: auto hidden`) when height is
  content-driven; a scroll container's contract names both axes.
- **Decorative motion must be overflow-closed**: a transformed box extends
  scrollable overflow, so plate inset must be at least the translate
  amplitude or SC 1.4.10 becomes a function of animation phase.
- **Content-sized columns plus `nowrap` crush siblings**: a `color-mix`
  token resolves to a long `oklab()` string with no hex form; the strip's
  auto value column took ~250 px of a 288 px frame and the name column
  went 0 px wide by 440 px tall. Bounded tracks that give by wrapping (a
  2:1 `fr` split), never by vanishing.
- **Sonar duplicate-selector findings can be live bugs**: a second `.mast`
  block silently overrode the strip-offset declaration to 0 (the later
  block wins). Merging to one block is correctness work.
- **One document, one holder**: two well-meaning theme holds on the same
  root correct each other forever; ownership is decided by context
  (standalone: the page holds itself; framed: the parent holds). The
  showcase applies context-decides-the-owner three ways — theme mode,
  breadcrumbs, holds.
- **Three stacked cures on one element is a solution-class signal**:
  containing-block positioning, an artifact-axis close, and measured
  conditional focusability on `tok-scroll` are each correct; their
  accumulation is the trigger for a design look at "every family is its
  own scroll container" BEFORE a fourth cure lands.

## Fidelity review

- `pnpm tool:fidelity` — captures the Claude Design canonical export (served
  over the studio overlay: `studio-source/` falling back to the
  design-system package root for kit CSS, fonts and assets) and the running
  showcase at matched geometry (1440 CSS px, 2x scale), perceptually diffs
  every declared pair, and writes the review surface to
  `demo-evidence/fidelity-report/index.html` beside the disposition register
  (`fidelity-register.json`). Diff magnitude never gates: non-zero exit
  means a mechanical failure only. Flags: `--base <url>`, `--width <px>`,
  `--report-only`, `--keep-server`. Until the `/identity-switchboard` routes
  land, a FULL run fails at the live-capture arm (the routes 404 and the
  blank self-check refuses them — by design); use `--report-only` to build
  the report from whatever evidence exists, which shows the live side as
  missing.
