# Integration readiness — oak-curriculum-hub (the consuming app)

Grounded in the live consumer: `demos/oak-curriculum-hub` in [oak-open-curriculum-ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem) — Next 16, React 19, Tailwind v4, strict TS, WCAG 2.2 AA, currently a *visual-fidelity reproduction* of a Claude Design export of this system (untracked `claude-design-canonical-export/`; its `_ds/*` files feed the hub's `tool:token-audit`; divergences tracked in `fidelity-register.json`). Integration = the hub stops mirroring values and starts consuming this kit.

## What the hub does today (read July 2026)

- `app/globals.css` re-declares ~30 Oak values as **raw hex literals** in a Tailwind `@theme` block (`--color-oak-lemon: #ffe555` …) — a hand-kept mirror, no themes, no re-brand path.
- Lexend via `next/font/google`, exposed as `--font-lexend` (already matches our §2 recipe).
- Its own **single navy focus ring** (`:focus-visible { outline: 3px solid var(--color-oak-navy) }`) — AA, but not the system's double ring, and unaware of forced-colors.
- A blanket `prefers-reduced-motion` `!important` collapse — correct floor, but no `data-motion` axis, no stored user choice.
- No `data-theme` (light only), no region contract, no icon roles.

## The migration (maps §-by-§ onto docs/consuming-nextjs.md)

1. **Install the kit** (§1): copy `colors_and_type.css` + `components.css` + `print.css` + `oak-icons.css` (root-adjacent — KNOWN-ISSUES #10) + `assets/icons/` + `fonts/`; `public/oak-theme.js`. Import order: Tailwind → Oak sheets.
2. **Fonts** (§2): keep their `next/font` Lexend; re-point `--font-sans: var(--font-lexend), …` after the imports; drop our `@font-face` + `fonts/` copy. (Their weights list includes 300 — keep the pastel-fill weight rule: 300 never below 18px.)
3. **Tailwind mapping** (§3): replace the literal `@theme` block with `docs/nextjs-theme-mapping.css` (`@theme inline` aliases onto roles — now incl. warning/info colours + the signature offset shadows). Every `--color-oak-*` literal dies. NOTE their utility names differ from the alias names (`bg-oak-lemon` → `bg-decorative-*`/accent aliases; `shadow-oak-lemon` → `shadow-accent-brand`): the migration is a find-and-replace RENAME per utility, mechanical but not zero-diff — map each `--color-oak-*` to its role first (lemon→accent, mint/aqua/lavender/pink/amber→decorative ramp, cream→bg-primary, navy→link) so hue names stop appearing in markup.
4. **Theme + motion wiring** (§4): `oak-theme.js` beforeInteractive + `suppressHydrationWarning`; replace the blanket reduced-motion block with the `data-motion` axis (OS-following default preserved); add the theme/motion controls (copy `docs/nextjs-theme-switcher.tsx.txt` in as `ThemeSwitcher.tsx`).
5. **Focus ring**: delete their `:focus-visible` rule — the kit's double ring + transparent forced-colors outline takes over. This is a visible change; record it in `fidelity-register.json` as `deliberate` (upgrade, not divergence).
6. **Components**: their hand-built views (`SiteNav`, `ResultCards`, quiz blocks…) keep their markup, swap literal styles for `.oak-*` classes + tokens per §6; new hard widgets follow §5b (Base UI default — see `pairing-base-ui.md`; dates → `pairing-react-aria.md`; non-React surfaces → `pairing-ark-ui.md`) and §7b, gated by `wrapped-widget-a11y-checklist.md`.
7. **Audit hookup**: port `dtcg/contrast-pairings.json` into their CI (their `tool:token-audit` already reads export `_ds/*` — point it at the kit copy instead of the untracked export snapshot, which removes the re-obtain step from the loop).

## Refresh + versioning contract

- The hub re-obtains exports via the claude-design MCP; **CHANGELOG.md top entry** says what changed since their snapshot; the public surface + deprecation policy (CHANGELOG preamble) is what they can rely on. Current version: see CHANGELOG.
- Oak marks: the hub keeps brand assets untracked (their README licence section; our `LICENCES.md` states the same boundary). Curriculum DATA is OGL v3.0 with required attribution — that's their data plane, not this kit, but the attribution line must survive any footer restyle.

## Our side — readiness checklist (state at hand-off)

- [x] Compiler clean; manifest in sync; 4 components, 70 cards, 2 templates.
- [x] Consumption docs complete: consuming-nextjs.md §1–§9 incl. §5b picks/matrix/version-watch + §7b worked example; three pairing guides; wrapped-widget checklist; console-tui-tones.
- [x] `LICENCES.md` (third-party + Oak-marks boundary), README file index current.
- [x] Audits: Oak 32/32, EMC² 32/32 AA ×4 themes; **PDS v7 full audit re-run July 19: 34/34 AA ×4 themes** (brand-full.css verified loaded in-page); failing-example still fails (negative control).
- [x] `dtcg/` current: no token-value changes since its 1.6.2 spot-fixes (1.6.3–1.7.0 were icons + docs; icon URL tokens deliberately unexported — dtcg/README).
- [x] `docs/nextjs-theme-mapping.css` extended for the hub: `--color-warning`/`--color-info` + `--shadow-accent-brand`/`--shadow-neutral-brand` aliases (the hub's signature offset shadows re-brand with the tokens).
- [x] Known bundle note: reveal.js vendor 115KB rides in `_ds_bundle.js` (KNOWN-ISSUES #9) — irrelevant to the hub (it consumes CSS + docs, not the bundle).

## Sequence recommendation

§1+§3 first (kit in, literals out — mechanical, big diff, no behaviour change) → §4+§5 (theme/motion/focus — visible, small diff) → §6 incrementally per component → §7 audit-in-CI last, so it gates the tail of the migration rather than blocking the start.
