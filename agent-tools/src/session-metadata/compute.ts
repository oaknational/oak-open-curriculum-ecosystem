/**
 * Pure computation of session context metadata from occupancy + window size.
 *
 * @remarks
 * Maps raw occupancy onto the owner-taught effectiveness curve in five bands:
 * healthy (under 40%), peak (40 to 50%), past-peak (50 to 65%), mistake-prone
 * (65 to 80%), degraded (80% and above). The zone is INFORMATION: every zone's
 * advice is to carry on, with records current past the peak (PDR-063 §Context
 * readings never stop a seat). From 30% the advice adds PDR-052's deferral of
 * directive-file edits to the next compaction. Pure: no IO, no global state.
 *
 * @packageDocumentation
 */

/**
 * Effectiveness zone derived from context occupancy, as information. Module-private:
 * it surfaces structurally through {@link SessionContextMetadata.zone}; no
 * external consumer names it directly yet (re-export when one does).
 */
type EffectivenessZone = 'healthy' | 'peak' | 'past-peak' | 'mistake-prone' | 'degraded';

/** Structured session context metadata. */
export interface SessionContextMetadata {
  readonly usedTokens: number;
  readonly windowTokens: number;
  readonly remainingTokens: number;
  readonly pctUsed: number;
  readonly pctRemaining: number;
  readonly zone: EffectivenessZone;
  readonly advice: string;
}

interface ZoneAdvice {
  readonly zone: EffectivenessZone;
  readonly advice: string;
}

/**
 * Compute session context metadata from occupancy and window size.
 *
 * @param input - `usedTokens` (current occupancy) and `windowTokens` (model window).
 * @returns Structured metadata including remaining tokens, percentages, and the
 *   effectiveness zone with its advice.
 */
export function computeMetadata(input: {
  readonly usedTokens: number;
  readonly windowTokens: number;
}): SessionContextMetadata {
  const remainingTokens = Math.max(0, input.windowTokens - input.usedTokens);
  const exactPctUsed = percentage(input.usedTokens, input.windowTokens);
  const pctUsed = roundTo1(exactPctUsed);
  // Derive from the floored remaining so the two never disagree when occupancy
  // exceeds the window (a caller can pass a smaller window than the real one).
  const pctRemaining = roundTo1(percentage(remainingTokens, input.windowTokens));
  // Classify on the exact figure: rounding 29.95% up to 30.0 must not cross a floor.
  const { zone, advice } = classifyZone(exactPctUsed);

  return {
    usedTokens: input.usedTokens,
    windowTokens: input.windowTokens,
    remainingTokens,
    pctUsed,
    pctRemaining,
    zone,
    advice,
  };
}

function percentage(used: number, window: number): number {
  return window <= 0 ? 0 : (used / window) * 100;
}

/** PDR-052's floor: directive-file edits wait for the next compaction from here. */
const DIRECTIVE_EDIT_FLOOR_PCT = 30;

function classifyZone(pctUsed: number): ZoneAdvice {
  const { zone, advice } = zoneAdvice(pctUsed);
  return pctUsed < DIRECTIVE_EDIT_FLOOR_PCT
    ? { zone, advice }
    : { zone, advice: `${advice}; directive edits wait for the next compaction` };
}

function zoneAdvice(pctUsed: number): ZoneAdvice {
  if (pctUsed < 40) {
    return { zone: 'healthy', advice: 'full capacity; carry on' };
  }
  if (pctUsed < 50) {
    return { zone: 'peak', advice: 'best work; carry on' };
  }
  if (pctUsed < 65) {
    return { zone: 'past-peak', advice: 'past peak; carry on with records current' };
  }
  if (pctUsed < 80) {
    return { zone: 'mistake-prone', advice: 'mistake odds rising; carry on with records current' };
  }
  return { zone: 'degraded', advice: 'degraded; carry on with records current' };
}

function roundTo1(value: number): number {
  return Math.round(value * 10) / 10;
}
