import { err, ok, type Result } from '@oaknational/result';

export interface MarkerRange {
  readonly startIndex: number;
  readonly endIndex: number;
}

interface RequiredMarkerErrors {
  readonly count: (startCount: number, endCount: number) => string;
  readonly order: string;
  readonly standalone: string;
}

interface OptionalMarkerErrors {
  readonly duplicate: string;
  readonly incomplete: string;
  readonly order: string;
  readonly standalone: string;
}

export function findRequiredStandaloneMarkerRange(
  value: string,
  startMarker: string,
  endMarker: string,
  errors: RequiredMarkerErrors,
): Result<MarkerRange, Error> {
  const startCount = occurrenceCount(value, startMarker);
  const endCount = occurrenceCount(value, endMarker);
  if (startCount !== 1 || endCount !== 1) {
    return err(new Error(errors.count(startCount, endCount)));
  }
  return locateStandaloneMarkerRange(value, startMarker, endMarker, errors);
}

export function findOptionalStandaloneMarkerRange(
  value: string,
  startMarker: string,
  endMarker: string,
  errors: OptionalMarkerErrors,
): Result<MarkerRange | undefined, Error> {
  const startCount = occurrenceCount(value, startMarker);
  const endCount = occurrenceCount(value, endMarker);
  if (startCount > 1 || endCount > 1) {
    return err(new Error(errors.duplicate));
  }
  if (startCount !== endCount) {
    return err(new Error(errors.incomplete));
  }
  if (startCount === 0) {
    return ok(undefined);
  }
  return locateStandaloneMarkerRange(value, startMarker, endMarker, errors);
}

function locateStandaloneMarkerRange(
  value: string,
  startMarker: string,
  endMarker: string,
  errors: Pick<RequiredMarkerErrors, 'order' | 'standalone'>,
): Result<MarkerRange, Error> {
  const startIndex = value.indexOf(startMarker);
  const endIndex = value.indexOf(endMarker);
  if (endIndex <= startIndex) {
    return err(new Error(errors.order));
  }
  if (
    !isStandaloneMarker(value, startIndex, startMarker) ||
    !isStandaloneMarker(value, endIndex, endMarker)
  ) {
    return err(new Error(errors.standalone));
  }
  return ok({ startIndex, endIndex });
}

function isStandaloneMarker(value: string, index: number, marker: string): boolean {
  const before = index === 0 ? undefined : value.at(index - 1);
  const afterIndex = index + marker.length;
  const after = afterIndex === value.length ? undefined : value.at(afterIndex);
  return (before === undefined || before === '\n') && (after === undefined || after === '\n');
}

function occurrenceCount(value: string, needle: string): number {
  return value.split(needle).length - 1;
}
