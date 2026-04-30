/**
 * Normalise optional env-style strings for Sentry build-scripts.
 *
 * @remarks Two absent shapes are handled explicitly: the value is not provided
 * (`undefined`), vs it is provided but empty or whitespace-only after
 * {@link String.prototype.trim | trim} (represented as `''` before this
 * function returns).
 */
export function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }

  return trimmed;
}
