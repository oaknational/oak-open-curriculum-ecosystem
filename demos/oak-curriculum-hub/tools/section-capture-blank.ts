/**
 * The blank-capture decision for a live section capture, kept IO-free: the
 * capture drive (`capture-live-sections.ts`) measures the region through a
 * browser and this module decides, so the decision's test imports no browser,
 * server or filesystem graph (testing-strategy.md §Philosophy: an in-process
 * test never uses or creates IO other than stdio, transitively included).
 */

/** What the drive measures of the content region before deciding. */
export interface RegionMeasure {
  readonly boxHeight: number;
  readonly textLength: number;
}

/**
 * A captured region that is collapsed, textless, or absent is a bad capture:
 * the deep link never swapped the section in, or the shot ran pre-hydration.
 * Pure policy — the drive measures, this decides.
 */
export function sectionCaptureLooksBlank(measure: RegionMeasure | undefined): boolean {
  if (measure === undefined) {
    return true;
  }
  return measure.boxHeight < 100 || measure.textLength < 50;
}
