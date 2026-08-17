# DDR-010 — Comparison is visual first, statistics direct the looking

- **Status**: accepted (owner-directed, 2026-08-10)
- **IRI**: `urn:uuid:1f8a4c6e-4b0d-4f2f-9d5b-7c2e8a913d47`
- **Depends on**: [DDR-009 — measurement happens at canonical widths](009-measurement-happens-at-canonical-widths.md)

## Decision

Judging whether a rebuild matches its reference is done on **rendered
images, looked at**, never on markup, styling, or computed styles alone —
and the looking is directed by **windowed statistical rejection**, not by
linear pixel subtraction.

The method, end to end:

1. **Capture a pair at a matched canonical width** (DDR-009's set; the
   enforcement seam refuses free-hand widths). Same-width pairs are the
   only fair comparison — a mismatched simulated width once manufactured
   four phantom deltas in one screenshot ("black outlines, curved
   corners, smaller fonts" were a single 1440-vs-1280 scale artefact).
2. **Run the rejection statistics** (`visual-stats` in
   `@oaknational/fidelity-review`): per-pixel luma differences, a ROBUST
   noise scale (median absolute deviation × 1.4826 — divergent regions
   cannot hide themselves by inflating a naive σ), and per-window
   z-scores. A window "rejects being trivially different" at the stated
   threshold (default 6σ, 32px windows).
3. **Look at three images with the stats beside them**: left, right, and
   the heatmap (rejecting windows tinted ∝ z). The σ-scores are ordinal
   attention weights, not calibrated probabilities — pixel noise is
   neither independent nor Gaussian — so they ORDER the looking; the
   verdict on each region (matched-by-intent / divergent / instrument
   artefact) is the reader's, human or LLM.
4. **Corroborate with computed styles** to name the causal property once
   a region is flagged — computed probes localise causes, they never
   decide matches. The recorded failure mode: a computed-style probe
   over matched selectors reported near-total equality while the
   rendered pair showed an inverted band, a 64px inset, and a rhythm
   divergence the probe's selectors never framed.

## Reading discipline

- **The causal frontier**: one vertical offset shifts everything below
  it, so every later window rejects too. Read from the FIRST rejecting
  row downward (the tool prints it); the deepest-red window is rarely
  the cause.
- **Ruled divergences stay divergent**: a rejecting window over a
  register-dispositioned divergence is the instrument working, not a
  finding — adjudicate against the register, never re-tune the
  threshold to make ruled differences disappear (thresholds are method
  constants, not per-pair knobs).

## Instrument

`demos/oak-design-showcase/tools/capture-pair.ts`
(`pnpm exec tsx tools/capture-pair.ts --left <url> --right <url>
--width <canonical> --out <dir>`) writes
`<tag>-{left,right,heatmap}.png` + `<tag>-stats.json` and prints the
summary with the causal frontier. The statistics and PNG codec live in
`@oaknational/fidelity-review` (`/visual-stats`, `/png-codec`) — the
estate's one home for pixel machinery; the fidelity pipeline's
pixelmatch diff remains the regression-mass instrument, this method the
attention instrument.

## Known limits and the calibration requirement (owner-directed, 2026-08-11)

Every claim the instrument makes — naive or calibrated — covers only
the captures' COMMON region: both arms crop to the minimum height, so
content below the shorter capture is compared nowhere and appears in no
written PNG. The stdout summary announces a partial comparison first
(a `height mismatch` caveat; on the calibrated arm additionally a
`settle variance` caveat when left repeats disagree, which inflates the
pooled null and makes calibrated verdicts conservative) — dated
amendment 2026-08-13, the review-fleet F04 cure.

Full-page pairs cascade after the first structural offset, and the v1
σ-scores are ordinal only. The owner's standing direction: **σ should at
least approximate the meaning of calibrated probabilities** — a stated
significance should mean roughly what it says. The named candidate
methods, to be selected and landed as design-lane work:

- **Per-region alignment**: anchor on structural landmarks (band
  boundaries, headings), align region-by-region, then score within
  aligned regions — removes the cascade that currently inflates every
  window below the first offset.
- **Empirical null calibration**: estimate the real noise distribution
  from same-page repeat-capture pairs (anti-aliasing, font raster
  jitter, animation settle) and convert window scores to empirical
  p-values against that null, rather than assuming independent
  Gaussian pixels.
- **Correlation-aware effective n**: pixel noise is spatially
  correlated, so the √n in the current standard error overstates
  information; an effective-sample-size correction brings the z-scale
  towards honest magnitudes.

Until that lands, read v1 scores as attention ordering only — the
frontier discipline above is the safeguard.

## Dated amendment — empirical null calibration landed (2026-08-11)

The calibration backbone is live: `capture-pair --null-runs k` (floor
k ≥ 2) repeat-captures the LEFT url k extra times through the identical
settle recipe — that identity is the exchangeability warrant — and
calibrates the live pair against the pooled same-page null
(`@oaknational/fidelity-review/visual-calibration`). What the numbers
now mean:

- Each full window carries `empiricalP = (1 + count(null ≥ observed)) /
(N + 1)` — an exact continuity-corrected rank of the RAW mean
  difference (never z, so the σ₀ floor cannot contaminate p) — and
  `calibratedSigma = Φ⁻¹(1 − p)`.
- **Calibrated σ saturates at Φ⁻¹(N/(N+1)) ≈ 4 for any feasible null**,
  so under calibration the naive `--threshold` is INERT: the rejection
  predicate is `meanAbsDiff` beyond the observed null maximum, with the
  floor 1/(N+1) and the saturation printed. The naive z rides
  alongside; a z of 100 against a calibrated σ of 4 disagreeing loudly
  IS the honesty this amendment exists for.
- The pooled null licenses the MARGINAL claim ("exceeds all-but-p of
  same-page null windows anywhere"), full windows only; partial edge
  windows are marked uncalibrated with the reason. Exceedance
  (meanAbsDiff / nullMax) orders rejections and drives the heatmap.
- A deterministic page yields a DEGENERATE null (the settle recipe
  makes repeat captures byte-stable; first live run: nullMax = 0) — any
  nonzero window then rejects with no exceedance ratio, the honest
  verdict on a byte-stable page.

Correlation diagnostics remain a reporting concern inside the null
summary (the empirical quantiles already absorb correlation; correcting
twice would double-count), and per-region alignment stays the named
follow-on with every non-zero offset a first-class structural-shift
finding.

## Dated amendment — correlation diagnostics landed (2026-08-12)

The null summary now carries the diagnostics
(`@oaknational/fidelity-review/visual-correlation`): lag-1 row/column
autocorrelation of the pooled same-page diff fields, and an
effective-sample ratio n_eff/n under a separable AR(1) model — valid
only for non-negative lag-1 in both directions, and OMITTED with the
named reason outside that domain (inside the product formula a
negative factor is its mirror's reciprocal, so ρ_row = −ρ_col reads as
exactly 1 on a maximally correlated field). A null whose every pair
has a CONSTANT diff field — byte-stable repeats, or a uniform shift
whose constant difference is equally information-free — names itself
not estimable (discriminant `zero-variance-diff-fields`) rather than
falling silent. Reporting only, structurally: the calibrated rank
never reads the block — the diagnostic exists so the naive-z reader
can see how much √n overstates information. Replacing the modelled
ratio with a directly measured one stays the named follow-on (Director
adjudication, 2026-08-12); its mechanics live with that cycle.
