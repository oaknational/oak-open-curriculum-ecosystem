# Handoff: Oak Open Curriculum Design System → Claude Code

## What this is

The complete white-label-ready Oak design system, **v1.7.0** (see `CHANGELOG.md`). Destination: the [oak-open-curriculum-ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem) monorepo; first consumer: `demos/oak-curriculum-hub`.

## What is production code vs design reference

Unlike a typical design hand-off, **the kit itself is production CSS/JS — ship it as-is**:

- **Ship directly**: `colors_and_type.css`, `components.css`, `print.css`, `oak-icons.css` (must stay root-adjacent to components.css — KNOWN-ISSUES #10), `oak-theme.js`, `assets/icons/`, `fonts/`, `brand.css` (the white-label override surface), `dtcg/` (generated token JSON). `styles.css` is the @import entry point for external consumers.
- **Design references / proofs — do NOT ship, use as fidelity targets**: `preview/` (70 specimen cards), `Identity White-Labelling.html`, `Identity Switchboard.html`, `Example Front Pages.html`, `whitelabel/` (two counter-brand proofs + `failing-example.css`, the deliberate negative control — it must keep failing the audit), `ui_kits/`, `templates/`, `reference/`, `uploads/` (provenance), `thumbnail.html`, `_ds_*`/`_adherence*`/`support.js` (this workspace's compiler output — regenerate nothing, copy nothing from these into the repo).

## Fidelity

High-fidelity. The proof pages are pixel-accurate renders of the system's own classes and tokens — recreating a page means using the shipped classes, not copying markup values.

## Start here (reading order for implementation)

1. `README.md` — system overview, class library, token tiers, file index.
2. `docs/integration-oak-curriculum-hub.md` — **the implementation plan**: §-by-§ migration of the live consumer (replace its literal Tailwind `@theme` mirror with the kit + `docs/nextjs-theme-mapping.css` aliases; theme/motion wiring; the double focus ring supersedes the hub's single ring — record as `deliberate` in its fidelity register). Recommended sequence is at the end of that doc.
3. `docs/consuming-nextjs.md` — the full consumption contract (§1 install geometry, §4 hydration-safe theme wiring, §5 multi-tenant identity, §5b behaviour-library chooser, §7 new-component recipe).
4. `CLAUDE.md` + `preview/a11y-charter.html` — the non-negotiables (WCAG 2.2 AA floor, double focus ring, ≥44px targets, state never colour alone, the app-side obligations).
5. `KNOWN-ISSUES.md` before debugging anything; `DECISIONS.md` before changing architecture.

## Design tokens

Three strict tiers, CSS custom properties, 590 tokens: tier-1 `--oak-*` primitives (private) → tier-2 roles (`--text-*`, `--bg-*`, `--surface-*` — the public surface) → tier-3 component tokens. Themes via `[data-theme]` (light/dark/system/high-contrast/colour-safe), motion via `[data-motion]`. Canonical source is the CSS; `dtcg/` is generated from it. Never read tokens into JS objects; never use raw values at point of use. Semver contract + deprecation policy: `CHANGELOG.md` preamble.

## Behaviour libraries (for widgets the kit doesn't ship)

Chooser in `docs/consuming-nextjs.md` §5b: native elements first; **Base UI** default (`docs/pairing-base-ui.md`); React Aria scoped to date/locale/conformance surfaces (`docs/pairing-react-aria.md`); Ark UI/Zag for non-React (`docs/pairing-ark-ui.md`); Ink for console TUIs (`docs/console-tui-tones.md`). Gate every wrapped widget with `docs/wrapped-widget-a11y-checklist.md`. Pairing-guide code is research-grounded — verify part/prop names against the pinned versions' docs on first install.

## Assets & licensing

`LICENCES.md` is the register. **Oak marks (logo, `assets/icons/`, brand imagery) are NOT open-licensed** — mirror the repo's `BRANDING.md` handling (untracked or explicitly licensed); everything else is OFL/Apache-2.0/MIT as listed.

## Validation that must survive the port

`preview/contrast-audit.html` logic (or port `dtcg/contrast-pairings.json` into CI): every role pairing AA in all four themes, per brand — a re-brand that fails is not done. Current state: Oak 32/32, EMC² 32/32, PDS 34/34, all ×4 themes; `failing-example.css` fails (control intact).
