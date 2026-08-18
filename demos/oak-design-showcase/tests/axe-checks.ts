/**
 * The suite's one axe surface: a single mode-observing pass, its
 * self-retiring companion probe, and the per-cell mode-intent assert.
 * Split from apply-state.ts so the a11y instrument reads as one unit;
 * the pure contrast classification it consumes lives in
 * tools/axe-verdicts.ts with its own unit cells.
 */
import { AxeBuilder } from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  ADJUDICATED_UNMEASURED_CONTRAST,
  incompleteOutsideContrast,
  measuredContrastFailures,
  novelUnmeasuredContrast,
} from '../tools/axe-verdicts';

/** The one axe pass for every mode, criterion-scoped by OBSERVED state.
 *
 *  Forced colours: color-contrast is disabled ONLY when the page itself
 *  reports `forced-colors: active` — WCAG 1.4.3 measures the author
 *  palette, which is not painting there, and axe-core 4.12.1 measures
 *  the wrong layer in that mode anyway
 *  (https://github.com/dequelabs/axe-core/issues/3978, since v4.6: the
 *  foreground reads -webkit-text-fill-color, which forced colours does
 *  not replace, so the ratio mixes author ink with forced paper). Live
 *  probes here reproduced the signature (2026-08-10; re-verified
 *  2026-08-13 on all three identities). The matchMedia gate fails SAFE:
 *  a dead emulation re-enables the rule. The disable is paired with the
 *  self-retiring artefact probe (colorContrastArtefactPresent) per
 *  docs/governance/accessibility-practice.md — the ONLY sanctioned
 *  disableRules call; widening it is prohibited.
 *
 *  Incomplete bucket (the F15 cure): an incomplete result is NOT a
 *  pass. axe withholds some MEASURED failures from `violations` (an
 *  exact 1:1 files as equalRatio-incomplete — how invisible masthead
 *  text passed CI), so measured-and-failing nodes fail here wherever
 *  axe filed them; unmeasured nodes are bounded to the adjudicated
 *  reason set; every other rule's incomplete must be empty. Residual,
 *  stated: gradient-backed text is not machine-verified for 1.4.3 (a
 *  named ledger finding, not a tolerance) — and under forced colours
 *  the disable means this guard has nothing to bite on by
 *  construction. */
export async function expectNoAxeViolations(page: Page): Promise<void> {
  const forcedColoursActive = await page.evaluate(
    () => matchMedia('(forced-colors: active)').matches,
  );
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .disableRules(forcedColoursActive ? ['color-contrast'] : [])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(
    incompleteOutsideContrast(results),
    'axe filed these rules as incomplete — some rules file outright failures there; adjudicate each with evidence, never widen this assertion',
  ).toEqual([]);
  expect(
    measuredContrastFailures(results),
    'WCAG 1.4.3 (AA): axe MEASURED these ratios below the requirement and filed them as incomplete rather than violation — a measured failing ratio is a failure; cure the contrast at the token or cascade level (suppression paths are prohibited by docs/governance/accessibility-practice.md)',
  ).toEqual([]);
  expect(
    novelUnmeasuredContrast(results, ADJUDICATED_UNMEASURED_CONTRAST),
    'axe could not measure these nodes for a reason outside the adjudicated set — adjudicate the new reason class with evidence in tools/axe-verdicts.ts, never absorb it silently',
  ).toEqual([]);
}

/** The self-retiring half of the forced-colours criterion scoping: runs
 *  color-contrast ALONE and reports whether the axe-core#3978 artefact
 *  is present — any node axe measured (either bucket) failing its own
 *  expectation. Under a genuine upstream fix axe reads the forced
 *  palette and every measured ratio passes, so the artefact vanishes on
 *  every identity and the probe cells fail — retiring the
 *  MEASUREMENT-BUG leg of the scoping's rationale. The criterion-scope
 *  leg (WCAG 1.4.3 measures the author palette, which is not painting)
 *  is independent and is re-adjudicated, never deleted on sight. The
 *  union-of-buckets predicate absorbs bucket migration (exactly-white
 *  author ink files as equalRatio-incomplete at 1.00; near-white files
 *  as a violation at 1.08) and is not blocked by unmeasured gradient
 *  noise, which carries no ratio. */
export async function colorContrastArtefactPresent(page: Page): Promise<boolean> {
  const probe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  return measuredContrastFailures(probe).length > 0;
}

/** Every cell states its forced-colours INTENT; the observed mode must
 *  match it. Positive cells catch silent emulation death (the in-repo
 *  precedent: a Playwright release dropped the test-level forcedColors
 *  key and ignored it without error — the cell would replay the default
 *  palette and pass as a duplicate). Negative cells catch mode leakage
 *  into cells that would then silently test the forced palette with
 *  color-contrast disabled. Under forced colours the criterion-scoping
 *  argument additionally rests on ZERO author opt-outs, so the cell
 *  asserts no element computes forced-color-adjust: none. */
export async function assertForcedColorsMode(page: Page, expected: boolean): Promise<void> {
  const observed = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
  expect(
    observed,
    expected
      ? 'forced-colors emulation is DEAD — this cell is replaying the default palette, not the forced one'
      : 'forced-colors mode leaked into a cell that does not declare it',
  ).toBe(expected);
  if (expected) {
    const optOuts = await page.evaluate(
      () =>
        [...document.querySelectorAll('*')].filter(
          (element) => getComputedStyle(element).getPropertyValue('forced-color-adjust') === 'none',
        ).length,
    );
    expect(
      optOuts,
      'forced-color-adjust: none re-enters the author palette, where WCAG 1.4.3 applies in full — the color-contrast scoping in expectNoAxeViolations rests on zero opt-outs',
    ).toBe(0);
  }
}
