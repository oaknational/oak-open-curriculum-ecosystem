/**
 * Usage-percentage gauges for the Claude Code statusline.
 *
 * @remarks
 * Pure formatting for the colour-ramped consumed-percentage gauges: the
 * context-window gauge (`ctx:33%`) and the Claude.ai rate-limit gauges
 * (`s:33%(2h)`, `w:55%(3d)`). All share one colour ramp so they read uniformly —
 * higher consumption is closer to the limit (green → yellow → red). A rate-limit
 * gauge appends a DIM reset countdown via {@link formatCountdown}. Holds no I/O.
 *
 * @packageDocumentation
 */

import { DIM, GREEN, RED, RESET, YELLOW } from './statusline-ansi.js';
import { formatCountdown } from './statusline-countdown.js';

/** A usage percentage below this renders in green; from it, yellow. */
const USAGE_ELEVATED_PERCENT = 50;
/** A usage percentage from this upwards renders in red. */
const USAGE_HIGH_PERCENT = 70;

/**
 * A labelled usage percentage, colour-coded as a glance-warning once it climbs:
 * green below {@link USAGE_ELEVATED_PERCENT}, yellow from it, red from
 * {@link USAGE_HIGH_PERCENT}. Shared by every consumed-percentage gauge so they
 * read uniformly (higher = closer to the limit).
 */
function usageColour(pct: number): string {
  if (pct >= USAGE_HIGH_PERCENT) {
    return RED;
  }
  return pct >= USAGE_ELEVATED_PERCENT ? YELLOW : GREEN;
}

function colouredUsage(label: string, usedPercentage: number): string {
  const pct = Math.round(usedPercentage);
  return `${usageColour(pct)}${label}:${pct}%${RESET}`;
}

/** Context-window usage, e.g. `ctx:33%`. */
export function formatContext(usedPercentage: number): string {
  return colouredUsage('ctx', usedPercentage);
}

/**
 * One rate-limit gauge: the colour-ramped `label:pct%` with a DIM `(countdown)`
 * appended when the reset instant is known. `undefined` when the percentage is
 * absent — there is no gauge to show without it.
 */
export function rateLimitGauge(
  label: string,
  percentage: number | undefined,
  resetSeconds: number | undefined,
): string | undefined {
  if (percentage === undefined) {
    return undefined;
  }
  const gauge = colouredUsage(label, percentage);
  return resetSeconds === undefined
    ? gauge
    : `${gauge}${DIM}(${formatCountdown(resetSeconds)})${RESET}`;
}
