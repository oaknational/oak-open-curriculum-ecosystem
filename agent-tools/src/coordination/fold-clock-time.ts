/**
 * Instant arithmetic for the fold clock: validated ISO strings in, minutes to
 * one decimal and orderings out. Shared by the clock's compute and its
 * review-round pairing.
 */

const MILLIS_PER_MINUTE = 60_000;
const TENTHS = 10;

/** Minutes from `from` to `to`, to one decimal; both are validated ISO instants. */
export function minutesBetween(from: string, to: string): number {
  const raw = (Date.parse(to) - Date.parse(from)) / MILLIS_PER_MINUTE;
  return Math.round(raw * TENTHS) / TENTHS;
}

function later(a: string, b: string): boolean {
  return Date.parse(a) > Date.parse(b);
}

export function latest(instants: readonly string[]): string | undefined {
  return instants.reduce<string | undefined>(
    (best, instant) => (best === undefined || later(instant, best) ? instant : best),
    undefined,
  );
}

export function earliest(instants: readonly string[]): string | undefined {
  return instants.reduce<string | undefined>(
    (best, instant) => (best === undefined || later(best, instant) ? instant : best),
    undefined,
  );
}
