# Consuming this design system in a Next.js app

For a current-defaults app — `npx create-next-app@latest` with TypeScript, App Router, Tailwind CSS v4, Turbopack. The system needs **no adapter layer**: the token roles are plain CSS custom properties, consumed natively. `demos/oak-curriculum-hub` in the oak-open-curriculum-ecosystem monorepo is a working proof (Next 16 + Tailwind v4 over an export of this system).

Contents: 1 Install · 2 Fonts · 3 Tailwind mapping · 4 Theme controls & detection · 5 Setting the identity (white-label) · 6 Building pages · 7 Creating NEW components · 8 What not to do · 9 Obligations.

## 1. Install (copy the kit in)

Copy from this project into the app, **keeping the folder geometry**:

```
src/oak/colors_and_type.css     ← tier 1+2 tokens, themes, type classes
src/oak/components.css          ← tier 3 tokens + the .oak-* class library
src/oak/print.css               ← print/PDF layer
src/oak/oak-icons.css           ← icon URL tokens (--i-*) + role map (--ic-*)
src/oak/assets/icons/*.svg      ← the official Oak icon set
src/oak/fonts/Lexend-VariableFont_wght.ttf
public/oak-theme.js             ← theme switcher (public/ — loaded unbundled, pre-paint)
```

Then in `app/globals.css`:

```css
@import 'tailwindcss';
@import '../src/oak/colors_and_type.css';
@import '../src/oak/oak-icons.css';
@import '../src/oak/components.css';
@import '../src/oak/print.css';
```

Order matters twice over: Oak sheets **after** Tailwind (so role-driven classes win over preflight), and `oak-icons.css` **adjacent to `components.css` in the same import layer** (KNOWN-ISSUES #10: a `url()` held in a custom property may resolve against the declaring or the consuming sheet depending on engine; the bundler rewrites both to emitted URLs from the same base, which settles it). The bundler copies `assets/icons/` and `fonts/` and rewrites every `url()` — no path editing needed.

**No-build alternative**: put the whole kit under `public/oak/` unchanged and load the four sheets as plain `<link rel="stylesheet" href="/oak/…">` in the root layout, in the same order. Same geometry, zero bundling.

## 2. Fonts

The kit ships Lexend via `@font-face` in `colors_and_type.css`; the bundler serves it as-is — nothing to do. If you prefer `next/font` (zero-layout-shift, self-hosted by Next):

```tsx
// app/layout.tsx
import { Lexend } from 'next/font/google';
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });
// <html className={lexend.variable}>
```

```css
/* after the Oak imports in globals.css */
:root { --font-sans: var(--font-lexend), system-ui, sans-serif; }
```

Then delete the `@font-face` block and `fonts/` from your copy. Re-pointing `--font-sans` is the sanctioned lever — everything downstream (type classes, slots, components) follows.

## 3. Map Tailwind's theme onto the roles

Tailwind v4 is CSS-first: an `@theme` block defines the utility vocabulary. Copy `docs/nextjs-theme-mapping.css` into `globals.css` (after the Oak imports) so `text-ink`, `bg-surface`, `border-line`, `rounded-card` emit `var(--text-primary)` and friends. Two rules:

- **`@theme inline` is required** for the aliases — values must resolve at point of use, after `light-dark()` and `[data-theme]` have had their say.
- **Tailwind-side names must differ from role names** (`--font-sans: var(--font-sans)` is circular; hence `--font-oak-sans`).

Utilities built this way stay theme-live, print-correct and re-brandable. Tailwind's own palette (`bg-slate-100`…) stays banned in Oak UI — if it isn't a role, it doesn't theme, print, or re-brand.

## 4. Theme controls & detection

`oak-theme.js` is the single owner of theme state. It: applies the stored choice pre-paint; auto-maps an OS `prefers-contrast: more` request to `high-contrast` when the user hasn't chosen (live-updating); leaves `data-theme` absent when there's no choice (so a brand's polarity default applies); and exposes the motion axis (`data-motion`) the same way. Dark detection needs no JS at all — `data-theme="system"` (or no attribute) rides `color-scheme` + `light-dark()`.

Root layout wiring — `beforeInteractive` (no theme flash) + `suppressHydrationWarning` (the script mutates `<html>` before React hydrates):

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <Script src="/oak-theme.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
```

User-facing controls — copy `docs/nextjs-theme-switcher.tsx.txt` into `components/` (as `ThemeSwitcher.tsx` — the `.txt` suffix only keeps it out of this project's compiled bundle). It is a client component that renders after mount (theme state lives in `localStorage`, so server HTML must not guess), uses a labelled `<select>` per axis (theme + motion), and calls `window.oakTheme`. Every app that offers themes must offer all five: light / dark / system / high-contrast / colour-safe — the access themes are not optional extras.

Detection summary (all handled, know what handles what):

| Signal | Handled by |
|---|---|
| OS dark mode | CSS (`color-scheme` + `light-dark()`) — under `system` or a dark-first brand |
| OS `prefers-contrast: more` | `oak-theme.js` → `high-contrast` (until an explicit choice) |
| Windows High Contrast / `forced-colors` | CSS (`forced-colors` rules in components.css) — orthogonal to themes |
| OS `prefers-reduced-motion` | CSS (motion tokens collapse) — `data-motion` is the in-product override |
| Stored user choice | `oak-theme.js`, pre-paint, always wins |

Do **not** add `next-themes`: two owners of `data-theme` will fight. If it's already in the app, configure it to write these exact `data-theme` values and delete `oak-theme.js`.

SSR note: theme is client state by design (localStorage). Server-rendered HTML is theme-neutral and correct under the default; the pre-paint script upgrades it before first paint, so there is no flash and no need to mirror the theme into cookies. Only reach for a cookie if you must render *theme-dependent markup* server-side — and prefer not to have any.

## 5. Setting the identity (white-label)

One app, one identity: copy `brand.css` (the documented override contract) as your starting point, fill in Part A (~16 tokens: fonts, accent trio, decorative ramp, display face) and as much of Part B as the brand needs, and import it **last**:

```css
@import '../src/oak/components.css';
@import '../src/oak/print.css';
@import './brand.css';   /* later at equal specificity = the brand wins */
```

Everything in §4 keeps working unchanged — themes are orthogonal to identity. Rules that travel with the contract:

- Override **canonical roles only** (`--surface-decorative-1`, not the `--surface-mint` alias).
- A dark-first identity sets `color-scheme: dark` on `:root` — an explicit user theme choice still wins (the guards are specificity-correct; don't "fix" load order).
- Icon identity: re-point the 16 `--ic-*` role tokens to your set's SVG URLs (absolute CDN URLs or bundler-resolved imports — see both counter-brands' `brand-full.css`). Shared markup references roles (`.ic-search`), never sets.
- **A11y is a condition of the contract**: focus ring, targets, motion behaviour and state-not-colour-alone are off the override surface, and the re-brand is not done until the contrast audit passes in **every** theme (open `preview/contrast-audit.html` from this project with your brand.css in its cascade, or port its pair list into a test).

Multi-tenant (identity per request — the specimen's `?brand=` pattern, productionised): keep per-tenant sheets in `public/brands/<slug>/brand.css` and emit the link server-side:

```tsx
// app/layout.tsx (server component)
import { headers } from 'next/headers';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const slug = (await headers()).get('x-tenant') ?? null; // or subdomain/route param
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>{slug && <link rel="stylesheet" href={`/brands/${slug}/brand.css`} />}</head>
      <body>…</body>
    </html>
  );
}
```

Static identity CSS per tenant — no flash, no client logic, cacheable. Multi-tenancy is a first-class target; the rest of the tenant surface:

- **Tenant assets**: logo + `--ic-*` icon URLs live in the tenant's brand.css (absolute or `/brands/<slug>/…` paths); the shared markup never names a tenant.
- **Fonts**: a tenant's `@font-face`/`@import` belongs at the top of its brand.css (Part A) — loaded only for that tenant.
- **Polarity/density/composition** all ride the same sheet (they're tokens); no per-tenant components, no per-tenant markup.
- **Caching**: the sheet is static — CDN-cache per path; vary the layout on the tenant header only.
- **Validation is per-tenant and gating**: run the contrast audit against EVERY tenant sheet in every theme (port `dtcg/contrast-pairings.json` into a CI check, or run `preview/contrast-audit.html` with the tenant css in its cascade). A tenant that fails is not live — the a11y condition doesn't scale away.

## 5b. Pairing with an accessible component library

The kit is not a behaviour library — and the answer to "do we need one?" is: **headless yes (when you need complex widgets), pre-styled no.**

- **No clash — headless/unstyled libraries**: they own *behaviour* (focus management, keyboard interaction, ARIA wiring, portalling); this system owns *all appearance* (`.oak-*` classes + tokens on their rendered elements). That split is exactly the system's own native-first philosophy extended: we already lean on `<dialog>`/`<details>` for the simple cases; reach for headless primitives for combobox, menus, tabs-with-automatic-activation, toasts. **The chooser (owner direction, July 2026 — research in `docs/headless-a11y-frameworks.html`):**

  | Library | When | Guide |
  |---|---|---|
  | **Base UI** (`@base-ui/react`) | **Default** for React apps — menus, combobox, dialog, tabs, toast | `docs/pairing-base-ui.md` |
  | **React Aria Components** | Date/time + locale-aware widgets; surfaces with contractual WAI-ARIA conformance needs. Not the default (preference + ceremony) but documented and supported — scope it by capability alongside Base UI, never duplicating a widget class | `docs/pairing-react-aria.md` |
  | **Ark UI / Zag.js** | Non-React, multi-framework, or web-component surfaces — same machines everywhere | `docs/pairing-ark-ui.md` |

  Radix Primitives: acceptable in existing code only (maintenance slowed post-WorkOS); Base UI is its successor. Two rules when styling whichever you use: keep the double focus ring (`--focus-ring` + transparent outline) on whatever element receives focus, and keep state changes token-driven (fill + border + icon + text, never colour alone).
- **Native first — the decision matrix.** Reach for the platform before the library; import Base UI per *widget*, not wholesale:

  | Need | Use | Why |
  |---|---|---|
  | Modal / confirm | `<dialog>` + `showModal()` | Focus trap, `Esc`, top-layer, inert backdrop are free |
  | Disclosure / accordion | `<details>`/`<summary>` | Built-in state + semantics |
  | Tooltip-ish hint, anchored panel | `popover` attribute (+ CSS anchor positioning where supported) | Top-layer + light-dismiss, no JS |
  | Simple select (no filtering) | `<select>` | Best mobile + AT support of anything |
  | Menu, combobox/autocomplete, tabs-with-automatic-activation, toast, slider, listbox multi-select | **Base UI** | The genuinely-hard interaction patterns — this is what the library is for |

- **Version watch.** Pin what you vet, per guide: Base UI pinned at **v1.3** (behaviour changes in v1.x point releases — 1.3 changed Checkbox/Switch unchecked form submission and Tabs `keepMounted`); React Aria Components and Ark UI pinned at adoption (record in their pairing guides). Read release notes on every bump and re-run `docs/wrapped-widget-a11y-checklist.md` on upgraded widgets. Date/time pickers are React Aria's territory — don't hand-roll one, and don't force them out of Base UI.
- **Clash — pre-styled libraries** (MUI, Chakra, Mantine, shadcn defaults, Bootstrap): they ship a second styling system — their own tokens, focus indicators, motion and density — which forks the tier-3 contract, and their focus/target/motion defaults silently replace the invariants this system deliberately keeps off the override surface. "Accessible" claims don't transfer either: their AA is against their palette, not yours, and not across our five themes.
- Whatever you add, the charter split still applies: a library gives you correct *widgets*; page structure, labels, reflow, reading level and the per-theme contrast audit remain the app's obligations (§9). Per-widget screen-reader spot-checks are enumerated in `docs/wrapped-widget-a11y-checklist.md` — a wrapped widget isn't done until its class's checks pass with a real SR.

## 6. Building pages

- **Compose, don't invent**: the `.oak-*` classes are the component layer (buttons, tags, cards, chips, fields, choice controls, banners, quiz answers, modal, accordion, table, skeleton, empty state, layout primitives `oak-stack/cluster/grid/box`, type classes `oak-heading-1…7`/`oak-body-1…4`). They're plain classes — use them straight in TSX `className`.
- **Page shells** follow the region contract: `.oak-canvas` > `[data-region="utility|masthead|main|footer"]`; `<main class="oak-main oak-region" data-region="main">` > sibling `[data-region]` sections; declare `data-page="<type>"` and scope any new composition map under it — never `:root`. Regions must stay siblings; DOM order is reading order.
- **Icons by role** in shared/product UI: `<span className="oak-icon--mask ic-search" aria-hidden="true" />` next to real text, or `aria-label` on the control. Reach for a named icon (`--i-*`) only in Oak-only UI.
- The compiled React components in `components/` here (OakButton etc.) are this workspace's bundle format — in Next, copy their **markup patterns** (or wrap the classes in your own thin TSX), don't import the `.jsx`. The tier-3 tokens are the contract that keeps you aligned.

## 7. Creating NEW components (when the kit genuinely lacks one)

The set here aims to cover any reasonable web app — check `components.css` and the specimen cards first, and prefer *composing* primitives (stack/cluster/grid/box + type classes + roles) over inventing. When something is genuinely new, this is the recipe that keeps it a citizen of the system rather than a fork:

1. **Semantic HTML first.** Real `<button>`/`<a>`/`<label>`/`<dialog>`/`<details>`; headings in order; ARIA only for genuine gaps.
2. **Declare tier-3 component tokens; consume roles and scales — never literals.**

```css
/* app/components/stepper.css — pattern for any new component */
:root {
  --stepper-size: var(--size-target);          /* tier 3 = roles + scales only */
  --stepper-gap: var(--gap-s);
  --stepper-ring: var(--border-solid-m) solid var(--border-primary);
}
.oak-stepper { display: flex; align-items: center; gap: var(--stepper-gap); }
.oak-stepper__step {
  width: var(--stepper-size); height: var(--stepper-size);
  border: var(--stepper-ring); border-radius: var(--radius-control);
  background: var(--bg-primary); color: var(--text-primary);
  font: var(--type-label); display: grid; place-content: center;
}
.oak-stepper__step[aria-current="step"] { background: var(--color-accent-subtle); border-width: var(--border-solid-l); }
.oak-stepper__step:focus-visible { outline: var(--focus-outline); outline-offset: var(--focus-outline-offset); box-shadow: var(--focus-ring); }
@media (prefers-reduced-motion: reduce) { .oak-stepper__step { transition-duration: var(--motion-instant); } }
```

   If a value you need has no token, **add a token** (a tier-3 `--<component>-*` composed from roles/scales, or — if the *concept* recurs — propose a tier-2 role upstream). A raw value at point of use is never the answer; that's what keeps every theme, brand, and medium working.
3. **State is never colour alone** — pair fills with borders + icons + text (`aria-current` above changes border *and* fill; add a visually-hidden "current step").
4. **Keep the non-negotiables**: the double focus ring exactly as shown (plus transparent outline for forced-colors), targets ≥44px (`--size-target*`), motion via the verbs (`--motion-enter/exit/emphasis`) collapsing under reduced motion, icons via `--ic-*` roles, text on pastel fills at weight 400+.
5. **Theme-proof before shipping**: render in all five themes × your brand stages; check `forced-colors`; if the component introduces a new colour *pairing*, add it to the contrast-audit pair list and re-run — a component whose pairings aren't in the audit isn't finished.
6. **Name and document like the system**: `.oak-<name>__<part>` classes, `--<name>-*` tokens, sentence-case labels, a usage comment at the top of its CSS. If it's generally useful, contribute it back to this project (class in `components.css`, tier-3 block, a specimen card, a CHANGELOG entry) so the next app doesn't rebuild it.

### 7b. Wrapping a headless primitive (Base UI) — the same recipe, applied

When the new component is a *hard interaction pattern* (§5b matrix), wrap Base UI instead of hand-rolling the behaviour. Everything above still applies; the only new move is that styling lands on the library's parts and `data-*` state attributes:

```tsx
// app/components/subject-combobox.tsx — Base UI supplies behaviour; tokens supply everything visible
import { Combobox } from '@base-ui/react/combobox';

export function SubjectCombobox({ subjects }: { subjects: string[] }) {
  return (
    <Combobox.Root items={subjects}>
      <label className="oak-field__label" htmlFor="subject">Subject</label>
      <Combobox.Input id="subject" className="oak-field__input cb-input" />
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup className="cb-popup">
            <Combobox.Empty className="cb-empty">No subjects match.</Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item} className="cb-item">
                  <span className="oak-icon--mask ic-tick cb-item__tick" aria-hidden="true"></span>{item}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
```

```css
/* tier-3 tokens + parts — roles and scales only, states on data-attributes */
:root {
  --cb-popup-bg: var(--bg-raised); --cb-popup-border: var(--border-solid-m) solid var(--border-primary);
  --cb-item-pad: var(--space-8) var(--space-12); --cb-item-selected-bg: var(--color-accent-subtle);
}
.cb-input:focus-visible { outline: var(--focus-outline); outline-offset: var(--focus-outline-offset); box-shadow: var(--focus-ring); }
.cb-popup { background: var(--cb-popup-bg); border: var(--cb-popup-border); border-radius: var(--radius-container); box-shadow: var(--shadow-raised); }
.cb-item { padding: var(--cb-item-pad); min-height: var(--size-target); display: flex; align-items: center; gap: var(--gap-s); color: var(--text-primary); }
.cb-item__tick { visibility: hidden; }
.cb-item[data-selected] { background: var(--cb-item-selected-bg); border-inline-start: var(--border-solid-l) solid var(--border-primary); }
.cb-item[data-selected] .cb-item__tick { visibility: visible; } /* state = fill + border + icon, never colour alone */
.cb-item[data-highlighted] { background: var(--state-hover); }
.cb-item[data-highlighted]:not([data-selected]) { outline: var(--focus-outline); outline-offset: calc(-1 * var(--focus-outline-offset)); }
```

The three checks that make it done: the double focus ring is on the input AND visible on the highlighted item (headless parts are invisibly focusable until you style them); the `--cb-item-selected-bg`/`--text-primary` pairing is in the contrast audit ×4 themes; the combobox section of `docs/wrapped-widget-a11y-checklist.md` passes with a real screen reader. Verify part/prop names against the pinned Base UI version's docs (§5b version watch) — they shift in v1.x point releases.

## 8. What not to do

- **No JS token objects** (`theme.colors.primary`) — they fork the source of truth. Read tokens from CSS.
- **No component re-wrapping layer** for its own sake — compose the classes; thin TSX wrappers are fine, parallel style systems are not.
- **No Tailwind palette / arbitrary values** (`bg-slate-100`, `p-[13px]`) in Oak UI.
- **No second theme owner** (`next-themes` alongside `oak-theme.js`).
- **No CSS reordering of regions** that breaks DOM/reading order — recompose only via the map tokens.

## 9. Obligations that travel with the kit

The consuming app owns the build side of the a11y charter (`preview/a11y-charter.html`): semantic structure, labels and error wiring, focus order and no traps, announcements for dynamic changes, reflow to 320px/400%, plain language at the audience's reading age, no time limits on learning tasks, performance on low-end devices (define `--budget-*` tokens in the app), and a contrast-audit pass in every theme after any brand override. The system guarantees its half; nothing here makes an app accessible by itself.
