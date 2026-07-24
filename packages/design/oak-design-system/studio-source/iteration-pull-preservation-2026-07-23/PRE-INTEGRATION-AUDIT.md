# Pre-integration accessibility audit — MCP-128 studio design (2026-07-23)

Owner-directed audit before integration ("better to catch stuff before we
integrate it"). Two instruments: mechanical (axe WCAG A/AA, four themes,
accordions opened; computed-contrast walk over 228 text nodes × 4 themes;
independent recomputation of the overlay's contrast arithmetic) and an
accessibility-expert judgment pass (focus states, reflow, forced-colors,
AT semantics, script-blocked behaviour). Verdict: the studio claim
"WCAG 2.2 AA across all four themes" is FALSIFIED on three points; the
token-level work is otherwise verified sound.

## Confirmed failures (cure before the page ships; ADR-147 blocking class)

1. **SC 1.4.10 Reflow (all themes).** At 320px the masthead nav forces
   603px horizontal scroll (`.site-nav`: no flex-wrap; `.oak-btn` is
   `white-space: nowrap`; select `min-width` 120px). Cure: wrap the nav,
   let/shorten the long button label at narrow widths; verify
   `scrollWidth === 320`. Applies equally to all five templates (same
   masthead pattern).
2. **SC 1.4.11/2.4.7 Focus indicator, dark theme tab bar.** Dark flips
   the tab band to white; the primary tab's lemon focus ring reads
   1.33:1 and the grey halo 1.06:1 against it — invisible to low-vision
   keyboard users. Generator: `--shadow-ground` flips with the CANVAS
   while `--bg-btn-primary` flips AGAINST it; the two collide on
   composed chrome. Cure (token-tier-clean): band-local
   `.site-tabs { --shadow-ground: light-dark(var(--oak-grey20), var(--oak-grey60)) }`
   (grey60 on white band = 7.2:1). Upstream note: fourth instance of the
   green-parts-red-composition pattern, now in token space.
3. **Colour-safe theme unreachable.** The theme select omits
   `colour-safe` (theme-control.js already whitelists it). The CVD theme
   exists but no user can reach it. Cure: add the option (page + all
   five templates).

## Notable best-practice cures (fold into the Slice B encoding)

- Initialise the theme select from the live `data-theme` attribute, not
  only localStorage (4.1.2 state-mismatch risk in server-rendered pages).
- 24 identical "How to use" summaries → visually-hidden per-tool suffix.
- `aria-current="page"` on the Teachers tab (different page) → `"true"`
  or drop; masthead nav aria-label names the brand, not the purpose.
- `aria-label` on `<pre>` is naming-prohibited → `<figure>` or hidden
  heading.
- Meta line (`oak-body-4` 12px/300 on tinted band) passes contrast but
  breaches the system's own floors ("body ≥16px"; "never 300 <18px on
  pastel fills") → smallest conforming class at encoding.
- `<h2>` inside `<summary>`: verify with VoiceOver+NVDA at integration;
  restructure only if AT flattens it.

## Verified sound (claims checked, not inherited)

axe: zero A/AA violations, four themes. Contrast walk: zero fails,
228 nodes × 4 themes. Overlay arithmetic recomputed independently and
exact (4.34 → 5.48 dark link-on-band; 10.01 canvas; 12.57 lemon accent).
Dark link/lemon-band/tag/code-surface compositions all pass with margin.
Skip link, landmarks, heading order, address, breadcrumbs, forced-colors
rendering, touch targets, reduced-motion: verified. The "near-white dark
accordion cards" concern was a stale-screenshot artefact (theme-flip
transition contamination); settled dark cards are border-grammar #222 on
#222 — correct.

## Methodological notes for future sync-backs

- Screenshot evidence of theme switching must settle ≥150ms after the
  `data-theme` flip (120ms button transition) or load the theme
  statically — both this audit's first probe and the earlier preview
  screenshots were contaminated.
- Studio conformance claims are verified mechanically at every sync-back;
  this audit is the worked instance.

Expert evidence artefacts: focus-*.png, reflow-320.png,
forced-colors-masthead.png, probe scripts (session scratchpad).
