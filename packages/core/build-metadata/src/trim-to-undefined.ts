/**
 * Normalise an environment-style string input: surrounding whitespace is
 * trimmed, and an absent or blank value becomes `undefined`.
 *
 * @remarks
 * A blank variable means "unset" to every reader of the build and deployment
 * environment, so `''` folds into `undefined` here rather than at each call
 * site. This module is the single home of that shape for the metadata
 * resolvers in this package and for the consumers that read the same
 * environment surface (`.agent/rules/consolidate-at-second-consumer.md`).
 *
 * @param value - The raw environment value, possibly undefined
 * @returns The trimmed value, or `undefined` when nothing meaningful was set
 */
export function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === '' ? undefined : trimmed;
}
