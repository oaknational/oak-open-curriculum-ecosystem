/**
 * The one lowercase-UUID check. Several guards rest on it: a Codex thread id
 * before it reaches an argv, a runtime session id before it names a path,
 * and an event id before a status line names it. Their copies must not drift
 * apart, so each calls this.
 *
 * @packageDocumentation
 */

/**
 * ASCII lowercase hex in the 8-4-4-4-12 form, any version, anchored at both
 * ends. There are no flags: without `m`, `$` matches only at the end of the
 * input, so a trailing newline is refused.
 */
const LOWERCASE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Whether a string is exactly one lowercase UUID, of any version, with
 * nothing before or after it.
 *
 * @param value - The string to check.
 */
export function isLowercaseUuid(value: string): boolean {
  return LOWERCASE_UUID.test(value);
}
