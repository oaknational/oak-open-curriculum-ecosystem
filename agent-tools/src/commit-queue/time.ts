const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-](\d{2}):(\d{2}))$/u;

/**
 * Require an explicit ISO date-time string before queue freshness decisions.
 */
export function requireIsoDateTime(value: string, fieldName: string): string {
  if (!hasValidIsoDateTimeShape(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error(`invalid ISO date-time for ${fieldName}: ${value}`);
  }

  return value;
}

/**
 * Compute queue expiry seconds with invalid timestamps treated as hard errors.
 */
export function secondsUntilExpiry(expiresAt: string, nowIso: string): number {
  return Math.floor(
    (parseIsoDateTime(expiresAt, 'expires_at') - parseIsoDateTime(nowIso, 'now')) / 1000,
  );
}

function parseIsoDateTime(value: string, fieldName: string): number {
  requireIsoDateTime(value, fieldName);
  return Date.parse(value);
}

function hasValidIsoDateTimeShape(value: string): boolean {
  const match = ISO_DATE_TIME_PATTERN.exec(value);
  if (match === null) {
    return false;
  }

  const year = numberCapture(match, 1);
  const month = numberCapture(match, 2);
  const day = numberCapture(match, 3);
  const hour = numberCapture(match, 4);
  const minute = numberCapture(match, 5);
  const second = numberCapture(match, 6);
  const offsetHour = match[8] === undefined ? 0 : numberCapture(match, 8);
  const offsetMinute = match[9] === undefined ? 0 : numberCapture(match, 9);

  return (
    isValidCalendarDate({ year, month, day }) &&
    isValidClockTime({ hour, minute, second }) &&
    isValidOffset({ offsetHour, offsetMinute })
  );
}

function isValidCalendarDate(input: {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}): boolean {
  if (input.month < 1 || input.month > 12 || input.day < 1) {
    return false;
  }

  return input.day <= new Date(Date.UTC(input.year, input.month, 0)).getUTCDate();
}

function isValidClockTime(input: {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}): boolean {
  return input.hour <= 23 && input.minute <= 59 && input.second <= 59;
}

function isValidOffset(input: {
  readonly offsetHour: number;
  readonly offsetMinute: number;
}): boolean {
  return input.offsetHour <= 23 && input.offsetMinute <= 59;
}

function numberCapture(match: RegExpExecArray, index: number): number {
  return Number(match[index] ?? Number.NaN);
}
