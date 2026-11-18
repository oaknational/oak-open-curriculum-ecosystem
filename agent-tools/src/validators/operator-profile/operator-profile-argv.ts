/**
 * Operator profile — the one reading of "the value after a flag" that both
 * CLIs' argument grammars share, so the check and the sync cannot drift
 * into validating one reading of argv and acting on another.
 */

/**
 * The value after a flag.
 *
 * @param argv - the arguments being parsed
 * @param index - the position the value would occupy
 * @returns the value, or undefined when it is absent, blank, or itself a flag
 */
export function valueAfter(argv: readonly string[], index: number): string | undefined {
  const value = argv[index];
  return value === undefined || value.trim() === '' || value.startsWith('--') ? undefined : value;
}
