/**
 * An error's code, when it is shaped as an error code.
 *
 * @remarks
 * The one owner of which codes may cross from a caught error to a caller.
 * A Node or `node:fs` error's message names the path it failed on, and a
 * code of any other shape could carry one, so only an error-code identifier
 * crosses. Pure: it reads the error it is given, and nothing else.
 *
 * @packageDocumentation
 */

/** An errno or Node error code, such as `ELOOP` or `ERR_INVALID_ARG_TYPE`. */
const ERROR_CODE_SHAPE = /^[A-Z][A-Z0-9_]*$/u;

/**
 * The error's code, when it carries one shaped as an error code.
 *
 * @param error - A caught error.
 * @returns The `code` property when it is a string shaped as an error code
 *   (libuv's own `UNKNOWN` included); `undefined` when it is absent, not a
 *   string, or any other shape.
 */
export function errorCodeOf(error: Error): string | undefined {
  const code = 'code' in error ? error.code : undefined;
  return typeof code === 'string' && ERROR_CODE_SHAPE.test(code) ? code : undefined;
}
