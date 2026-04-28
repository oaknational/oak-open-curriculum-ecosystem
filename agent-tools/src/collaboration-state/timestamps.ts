const UTC_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;

/**
 * Validate a collaboration-state timestamp before it is written.
 */
export function assertUtcTimestampNotFuture(input: {
  readonly label: string;
  readonly value: string;
  readonly nowIso: string;
}): void {
  if (!UTC_ISO_PATTERN.test(input.value)) {
    throw new Error(`${input.label} must be UTC ISO 8601 with trailing Z`);
  }
  if (Number.isNaN(Date.parse(input.value))) {
    throw new Error(`${input.label} must be a valid UTC timestamp`);
  }
  if (Date.parse(input.value) > Date.parse(input.nowIso)) {
    throw new Error(`${input.label} must not be in the future`);
  }
}

/**
 * Determine whether a claim or attention record has exceeded its freshness TTL.
 */
export function isExpired(input: {
  readonly startedAtIso: string;
  readonly freshnessSeconds: number;
  readonly nowIso: string;
}): boolean {
  return Date.parse(input.startedAtIso) + input.freshnessSeconds * 1000 < Date.parse(input.nowIso);
}
