# Dark theme — reflective token review (2026-07-23)

> **Status: APPLIED** in this project as `theme-enhancements.css` (loaded after
> the bundle by every template and the MCP page). Light theme untouched — it is
> the official Oak ground truth. Finding 3 was re-framed during application:
> the -6 base is *deliberately* capped below full amber (the warning hue), so
> the ramp is completed with a `-soft` alias + documentation instead of a
> light-theme change. Permanent home for all of it: upstream via /design-sync.

Scope: the dark reading of every colour role in `_ds_bundle.css` (roles are
`light-dark(light, dark)` pairs on one canonical layer; `[data-theme='dark']`
flips `color-scheme` plus three icon-filter tokens). Contrast figures are
WCAG 2.x relative-luminance ratios computed from the shipped hex values.

## 1. What the dark tokens are, and the intent behind them

- **Dark is a paired reading, not a second stylesheet.** Every role carries
  its dark answer in the same declaration. A role cannot be added without
  answering "and in dark?" — the architecture makes drift impossible.
- **Neutrals invert around soft black.** `#222` canvas (never `#000`),
  elevation by *lightening* (`bg-raised` grey70) because shadows carry less
  on dark — the veil shadows stay light-tuned, and the raised-surface rule
  compensates. Deliberate, documented.
- **Decorative pastels have a bespoke dark palette** (`--oak-dark-*`), not an
  algorithmic darkening. The pastels are identity in light; in dark they
  become deep quiet hues that keep the *categorical* job (6 distinguishable
  families, same base/soft/subtle ramp grammar) while ceding luminance to
  content. Component code never knows the polarity.
- **Roles keep their function, not their hue.** Links go navy→lavender
  because navy dies on `#222`. The visited/hover ramp inverts direction
  (darker-over-time in light, lighter-over-time in dark) — same semantic
  gradient, mirrored polarity. This is the clearest evidence the palette
  was *designed* per polarity rather than transformed.
- **One invariant: the lemon accent.** Signature shadows, focus rings,
  selection — lemon in both polarities (12.5:1 on `#222`, better than in
  light). The system knows what is invariant (accent, grammar, geometry)
  and what is covariant (ink, surfaces).

## 2. What the contemplation teaches

Light mode forgives an unfinished role layer; **dark mode audits it.**
Every dark defect found this week was really a *role-layer gap wearing a
dark-mode costume*: black SVG assets broke first in dark because images sat
outside the token system; the candidates' zero band padding looked worst on
dark screenshots but was a spacing gap in any theme. The dark theme's
deepest value to a decades-long foundation is diagnostic: **anything that
carries colour but is not expressed as a role is a latent dark bug.** The
discipline that follows: no colour outside a role; no meaning sharing a hex
with decoration; every exception recorded beside its reason (this bundle
already does the last one unusually well).

## 3. Findings — changes proposed (upstream via /design-sync)

1. **Dark links fail AA on decorative surfaces.** `--text-link` dark =
   lavender `#a0b6f2`: 7.9:1 on the `#222` canvas ✓, but **4.34:1 on the
   dark-mint band** (`#2e5338`) and 4.25:1 on dark-lavender — below 4.5:1
   for body text, and live on the MCP hero ("openly licenced" link).
   Light mode passes the same composition at 8.1:1. Proposal: shift the
   dark link ramp one tint lighter — base `lavender50 #bdcdf5` (10:1 on
   canvas, ≥5.3:1 on every dark decorative base), hover `lavender30`, and
   mint a visited tint above it. One-line role change, cures every
   link-on-band composition at once.
2. **Error surfaces collapse into decoration in dark.**
   `--bg-error-subtle` and `--bg-incorrect` dark both reuse
   `--oak-dark-pink50` — hex-identical to decorative-4's soft surface. In
   light they are distinct (red30 vs pink30). Meaning must never share a
   hex with decoration; propose true `--oak-dark-red30/50` tints.
3. **Decorative-6 ramp is irregular.** `-6` uses its 50-tint as base and
   has no `-soft`, in both polarities. Complete the ramp so consumers never
   special-case amber.
4. **Assets are colour outside the role system.** Logos, the underline
   rule, hotlinked icons — all black ink that dark can't reach. Interim
   cure everywhere in this project: `filter: var(--filter-icon)`. Permanent
   cure: ship the local icon set as mask+currentColor roles (`--ic-*`
   contract already exists; `assets/icons/` didn't sync) and document the
   filter requirement for any raster/ink asset.
5. **Document (not change) the dark shadow story.** `--shadow-standard`'s
   light-tuned veil is near-invisible on dark — intended, since elevation
   lightens surfaces instead; the accent shadows carry the signature. Worth
   one comment line so a future maintainer doesn't "fix" it.

## 4. Verified sound (no change)

- Neutral text ramp on dark canvas: subdued 12.5:1, disabled 9.7:1.
- `--border-neutral` ≥3:1 in both polarities as promised; `-lighter`
  correctly documented as decorative-only (2.2:1 dark).
- `--border-inverted` holds its ≥3:1 both-polarities covenant (3.9/4.0).
- Warning pairing in dark (amber50 on dark-amber30): 8.3:1.
- Error text on error-subtle dark: 4.98:1 — passes, but sits on the line;
  re-check after finding 2 lands.
- Button roles mirror perfectly (primary white-on-dark, hover greys step
  the right way); selected/lemon states pair fills with borders per the
  "never colour alone" doctrine.

## 5. High-contrast appendix (audited on request)

HC re-declares every role under `:root[data-theme='high-contrast']` guards
that outrank the overlay, and pins `color-scheme: light` — so none of the
dark-polarity changes can reach it, and the -6-soft alias resolves to HC's
stripped-white decoratives correctly. Measured: link ink navy120 15.2:1,
hc-red 10.2:1, hc-green ~9:1, disabled ink 9.7:1, grey fills always paired
with black borders per the never-colour-alone doctrine. One deliberate trait
documented rather than changed: HC visited links share the unvisited ink —
visited-state distinction is traded for maximum contrast. The lemon accent
survives in HC only inside the press shadow + focus halo, layered on black:
the signature reduced to its safest expression.
