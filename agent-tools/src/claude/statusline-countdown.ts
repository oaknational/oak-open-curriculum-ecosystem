/**
 * Pure countdown formatting for the Claude Code statusline rate-limit gauges.
 *
 * @remarks
 * Renders a duration-until-reset as the coarsest single unit that rounds to at
 * least one — days, then hours, then minutes — e.g. `2h`, `23m`, `3d`. Rounding
 * cascades through unit rollovers (round to minutes; if that reaches an hour,
 * round to hours; if that reaches a day, round to days) so a near-boundary
 * duration never renders the degenerate `60m` or `24h`. A non-positive remaining
 * (a window that has just reset, or clock skew) clamps to `0m`.
 *
 * The input is seconds because the statusline source reports each window's reset
 * instant as a Unix epoch **seconds** value (`rate_limits.*.resets_at`); the
 * impure adapter subtracts the current time and passes the remainder here.
 *
 * @packageDocumentation
 */

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

/**
 * Format a duration-until-reset as a single rounded unit (`Nd` / `Nh` / `Nm`).
 *
 * @param secondsRemaining - Seconds until the window resets; a non-positive value
 *   clamps to `0m`.
 * @returns The compact countdown, e.g. `2h`, `23m`, `1d`.
 */
export function formatCountdown(secondsRemaining: number): string {
  const minutes = Math.max(0, Math.round(secondsRemaining / SECONDS_PER_MINUTE));
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}m`;
  }
  const hours = Math.round(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) {
    return `${hours}h`;
  }
  return `${Math.round(hours / HOURS_PER_DAY)}d`;
}
