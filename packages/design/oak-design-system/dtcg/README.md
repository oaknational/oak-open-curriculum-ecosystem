# DTCG token export

Machine-readable [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) JSON, generated from the CSS source of truth (`colors_and_type.css`, `components.css`, `styles.css`). **The CSS is canonical; regenerate these files after any token change** — do not hand-edit.

Built for convergence with `packages/design/oak-design-tokens` in the [oak-open-curriculum-ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem) monorepo, whose build (`design-tokens-core`) flattens DTCG trees to CSS variables and validates WCAG contrast pairings at build time.

## Files

- `palette.json` — tier-1 colour primitives (`--oak-*`), as `oak.color.<name>`.
- `primitives.json` — tier-1 non-colour scales: `space`, `radius`, `font`, `weight`, `leading`, `tracking`, `layer`, `measure`, `motion`, `ease`, `border.solid-*`. Theme-invariant.
- `semantic.light.json` / `semantic.dark.json` — tier-2 roles. The CSS composes these via `light-dark(a, b)`; the generator split each into `a` (light) and `b` (dark). 64 roles were split this way.
- `semantic.high-contrast.json` / `semantic.colour-safe.json` — the two extra theme trees, from the `[data-theme]` scopes. **These have no counterpart in oak-design-tokens yet** (its pipeline emits light/dark only); adding them there means two more semantic tree merges in `build-css.ts`.
- `component.json` — tier-3 component tokens from `components.css` (`btn`, `input`, `gap`, `inset`, `modal`, …).

## Conventions and deltas vs oak-design-tokens

- **Path → variable**: a token at `text.primary` flattens to `--text-primary` (path segments joined with `-`). This round-trips our CSS names exactly.
- **Prefix delta**: our colour primitives are `--oak-<name>`; oak-design-tokens' palette inliner matches `--oak-color-<name>`. This export already uses `oak.color.<name>` paths, so flattened output lands on their convention — but the CSS here still declares `--oak-<name>`. Converging fully means either renaming here or widening their `PALETTE_VARIABLE_PATTERN`.
- **References**: `var(--x)` became DTCG `{path.to.token}` references throughout, so `validateTierReferences` can check the tier graph.
- **Functional values**: 24 tokens carry functional CSS expressions (`color-mix()`, `calc()`, `clamp()`, `min()`, `minmax()` — state overlays, hover derivation, density-derived layout, the fluid heading slots) verbatim in `$value` — DTCG has no function syntax. A consuming build should pass them through untouched.
- **Regeneration route**: no in-repo generator writes these trees (the estate's build reads them to produce CSS, never the reverse; the generator that wrote them is studio-side). Until a studio round-trip regenerates them, changes land as hand-synchronised edits in the same commit as their CSS counterpart, held equal by the consistency validator — the recorded exception to the no-hand-editing rule above, scoped to exactly that validator-guarded pairing.
- **`[data-theme="system"]`** is not a token tree: it re-enables OS-following `color-scheme` (3 declarations). Behaviour, not data — lives in `oak-theme.js`.
- **Icon URL tokens (`--i-*` and the `--ic-*` roles, `oak-icons.css`) are deliberately not exported**: they are asset paths (environment-relative `url()`s), not design decisions — a consuming build ships the SVGs, not the URLs.
- **`$type`** is heuristic (`color`/`dimension`/`duration`/`fontWeight`/`number`/`cubicBezier`); composite values (shadows, font shorthands) omit it.

## Contrast pairings

`contrast-pairings.json` is the machine-readable manifest (the `ContrastManifest` shape from `design-tokens-core/contrast-types.ts`: `{pairs, triads}` with token dot-paths and `text`/`non-text` contexts), generated from the pair lists in `preview/contrast-audit.html` — 33 text pairs (≥4.5:1) + 9 non-text pairs (≥3:1) — counts derived from the manifest; recount on regeneration, all paths verified against the trees in this folder. `triads` is empty so far; the audit card checks flat pairs. The live audit remains the four-theme AA/AAA view; this manifest is what plugs those same checks into the monorepo's build-time gate (`validateContrastPairings`) — which would need to run it against all four theme trees, not just light/dark.
