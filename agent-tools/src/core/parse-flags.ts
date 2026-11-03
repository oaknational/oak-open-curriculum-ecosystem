import { parseArgs, type ParseArgsConfig } from 'node:util';

import { err, ok, type Result } from '@oaknational/result';

/** One of parseArgs' own refusals of its input: an unknown flag, a missing value, a positional. */
function isInputRefusal(cause: unknown): cause is TypeError {
  return (
    cause instanceof TypeError &&
    'code' in cause &&
    typeof cause.code === 'string' &&
    cause.code.startsWith('ERR_PARSE_ARGS_')
  );
}

/**
 * Parse a CLI's flags with `node:util` `parseArgs`, returning its refusal of the operator's
 * input (an unknown flag, a flag missing its value, a stray positional) as an input error,
 * `Invalid flags: …`, for the caller's concise stderr line, never a stack trace. A defect in
 * the caller's own options is a program bug no input can cure, so it is rethrown.
 *
 * @param config - The `parseArgs` configuration; `args` defaults to the process arguments.
 * @returns The parsed values, or the refusal as an error whose `cause` is parseArgs' error.
 */
export function parseFlags<const T extends ParseArgsConfig>(
  config: T,
): Result<ReturnType<typeof parseArgs<T>>['values'], Error> {
  try {
    return ok(parseArgs(config).values);
  } catch (cause) {
    if (isInputRefusal(cause)) {
      return err(new Error(`Invalid flags: ${cause.message}`, { cause }));
    }
    throw cause;
  }
}
