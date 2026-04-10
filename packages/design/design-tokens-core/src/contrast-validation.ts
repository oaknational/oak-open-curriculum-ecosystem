/**
 * Contrast manifest validation — evaluates pairings against WCAG thresholds.
 *
 * @remarks
 * Composes the low-level WCAG computation functions from `contrast.ts` with
 * resolved token hex values to validate contrast pairings declared in a
 * human-authored manifest.
 *
 * @packageDocumentation
 */
import { type Result, err, ok } from '@oaknational/result';
import {
  checkNonTextContrast,
  checkWcagAA,
  contrastRatio,
  hexToSrgb,
  srgbToRelativeLuminance,
} from './contrast.js';
import type {
  ContrastManifest,
  ContrastPair,
  ContrastReport,
  ContrastReportEntry,
  ContrastValidationError,
} from './contrast-types.js';

// ---------------------------------------------------------------------------
// Pairing evaluation helpers
// ---------------------------------------------------------------------------

/** WCAG AA threshold for a given context (4.5 for text, 3 for non-text/large, 0 for informational). */
function requiredRatioForContext(
  context: 'text' | 'non-text' | 'large-text' | 'informational',
): number {
  if (context === 'text') {
    return 4.5;
  }

  if (context === 'informational') {
    return 0;
  }

  return 3;
}

/** Check whether a ratio passes its applicable WCAG AA threshold. Informational entries always pass. */
function passesThreshold(
  ratio: number,
  context: 'text' | 'non-text' | 'large-text' | 'informational',
): boolean {
  if (context === 'informational') {
    return true;
  }

  if (context === 'text') {
    return checkWcagAA(ratio, 'normal');
  }

  if (context === 'large-text') {
    return checkWcagAA(ratio, 'large');
  }

  return checkNonTextContrast(ratio);
}

/** Expand triadic entries in a manifest into flat pairwise checks. */
function expandManifestPairs(manifest: ContrastManifest): readonly ContrastPair[] {
  return [
    ...manifest.pairs,
    ...manifest.triads.flatMap((triad) => [
      { foreground: triad.foreground, background: triad.middle, context: triad.contexts.fgMid },
      { foreground: triad.middle, background: triad.background, context: triad.contexts.midBg },
      { foreground: triad.foreground, background: triad.background, context: triad.contexts.fgBg },
    ]),
  ];
}

/** Evaluate a single contrast pair against resolved hex values. */
function evaluatePair(
  pair: ContrastPair,
  resolvedTokens: ReadonlyMap<string, string>,
): Result<ContrastReportEntry, ContrastValidationError> {
  const fgHex = resolvedTokens.get(pair.foreground);
  const bgHex = resolvedTokens.get(pair.background);

  if (fgHex === undefined || bgHex === undefined) {
    return err({
      kind: 'unresolved_token',
      foreground: pair.foreground,
      background: pair.background,
    });
  }

  const fgLuminance = srgbToRelativeLuminance(hexToSrgb(fgHex));
  const bgLuminance = srgbToRelativeLuminance(hexToSrgb(bgHex));
  const ratio = contrastRatio(fgLuminance, bgLuminance);

  return ok({
    foreground: pair.foreground,
    background: pair.background,
    foregroundHex: fgHex,
    backgroundHex: bgHex,
    ratio: Math.round(ratio * 100) / 100,
    requiredRatio: requiredRatioForContext(pair.context),
    context: pair.context,
    pass: passesThreshold(ratio, pair.context),
  });
}

// ---------------------------------------------------------------------------
// Top-level validator
// ---------------------------------------------------------------------------

/**
 * Validate all contrast pairings in a manifest against resolved token hex values.
 *
 * @remarks
 * Expands triads into their constituent pairs, computes WCAG contrast ratios
 * for each, and returns a structured report. Contrast failures are encoded as
 * entries with `pass: false`. Informational entries are always marked as
 * passing. If a manifest token path cannot be resolved to a hex value (a
 * manifest authoring error), returns an `Err` with the unresolved token
 * details.
 *
 * @param resolvedTokens - Map from token dot-path to resolved hex colour
 * @param manifest - The contrast pairings manifest
 * @param theme - Theme identifier for the report (e.g. `"light"`, `"dark"`)
 * @returns Ok with the contrast report, or Err with the first unresolved token
 */
export function validateContrastPairings(
  resolvedTokens: ReadonlyMap<string, string>,
  manifest: ContrastManifest,
  theme: string,
): Result<ContrastReport, ContrastValidationError> {
  const pairs = expandManifestPairs(manifest);
  const entries: ContrastReportEntry[] = [];

  for (const pair of pairs) {
    const result = evaluatePair(pair, resolvedTokens);

    if (!result.ok) {
      return result;
    }

    entries.push(result.value);
  }

  const passed = entries.filter((entry) => entry.pass).length;

  return ok({
    timestamp: new Date().toISOString(),
    theme,
    results: entries,
    summary: {
      total: entries.length,
      passed,
      failed: entries.length - passed,
    },
  });
}
