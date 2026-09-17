---
name: visual-comparison
classification: active
description: >-
  Judge whether a rebuilt page matches its visual reference: capture both
  sides as images at the same canonical width, run the windowed rejection
  statistics, and read the pair with the heatmap and σ-scores directing
  attention. Use whenever comparing a rebuild against a design export,
  a reference render, or a prior capture — fidelity reviews, visual
  regression triage, and owner-reported "looks different" reports.
---

# Visual comparison

The method is DDR-010's
([docs/design/design-decisions/010-comparison-is-visual-first.md](../../../../../docs/design/design-decisions/010-comparison-is-visual-first.md)):
comparison is VISUAL FIRST — rendered images, looked at — with windowed
statistics directing the looking and computed styles corroborating causes.
Never conclude "matches" from markup, styling, or computed styles alone.

## Procedure

1. **Render both sides first** (the
   [`render-the-reference-before-reproducing`](../../../../rules/render-the-reference-before-reproducing.md)
   rule): the reference must be served STYLED — for the Claude Design
   export use the two-root overlay server
   (`demos/oak-design-showcase/tools/export-server.ts`); a single-root
   static serve renders it unstyled and silently poisons every capture.
2. **Capture the pair at one canonical width** (DDR-009; the tool
   refuses free-hand widths):

   ```bash
   cd demos/oak-design-showcase
   pnpm exec tsx tools/capture-pair.ts \
     --left <rebuild-url> --right <reference-url> \
     --width 1280 --out <dir> --tag <name>
   ```

3. **Read the stats summary**: start at the printed
   `first-rejecting-row` and read top-down — one vertical offset makes
   everything below it reject, so the deepest-red window is rarely the
   cause. σ-scores are ordinal attention weights, not probabilities.
4. **Look at all three images** (left, right, heatmap) with your own
   eyes, region by region. For each rejecting region, name a verdict:
   *matched-by-intent* (a ruled register divergence — cite the entry),
   *divergent* (a finding: cure or disposition it), or *instrument
   artefact* (say why, first-hand).
5. **Corroborate causes with computed styles** on the flagged regions
   only — `getBoundingClientRect`/`getComputedStyle` name the property
   that moved; they never decide a match.
6. **Record**: divergences land in the fidelity register with verified
   evidence, or as cures; never silently.

## Refusals

- Do not compare pairs captured at different widths — recapture.
- Do not re-tune `--threshold` to make a ruled divergence disappear;
  thresholds are method constants, adjudication happens against the
  register.
- Do not report "no visual difference" without having looked at the
  images themselves.
- Do not report a match when the summary carries a `height mismatch`
  caveat — the comparison covered only the common region, and the
  uncompared tail is absent from every written PNG; recapture (or
  adjudicate the tail by eye at the live surfaces) before any verdict.
- Do not adjudicate calibrated numbers under a `settle variance`
  caveat — varying left-repeat heights inflate the pooled null, so the
  calibrated verdicts are conservative and real divergence can hide;
  recapture first.
