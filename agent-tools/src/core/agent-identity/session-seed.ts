/**
 * Platform session-id seed normalisation (PDR-027, cloud-seat clause).
 *
 * @remarks
 * Cloud seats expose the platform session id with a leading type tag whose
 * spelling varies by surface: the container environment carries
 * `CLAUDE_CODE_REMOTE_SESSION_ID=cse_<id>` while session URLs and
 * Claude-Session commit trailers carry `session_<id>` — the same payload
 * under different tags. The PDR-027 identity seed is the untagged payload,
 * so registry rows, commit trailers, and the owner-visible session URL all
 * join on one key.
 */

const SESSION_ID_TAG_PATTERN = /^[a-z]+_(?<payload>.+)$/u;

/**
 * Strip one leading lowercase type tag (for example `cse_` or `session_`)
 * from a platform session id.
 *
 * @param value - Raw session id, possibly tagged and possibly padded with
 * whitespace.
 * @returns The untagged payload; the trimmed input when no single
 * lowercase-alphabetic tag is present or stripping would empty the seed.
 *
 * @example
 * ```ts
 * stripSessionIdTag('cse_01FV6rZz5BjSkApAUL6FAj72');
 * // => "01FV6rZz5BjSkApAUL6FAj72"
 * ```
 */
export function stripSessionIdTag(value: string): string {
  const trimmed = value.trim();
  const payload = SESSION_ID_TAG_PATTERN.exec(trimmed)?.groups?.['payload'];
  if (payload === undefined || payload.length === 0) {
    return trimmed;
  }
  return payload;
}

/**
 * Optional-input companion to {@link stripSessionIdTag}: strips the tag when
 * a non-blank value is present, and resolves `undefined` for absent or
 * blank input so env-cascade callers can splice it directly.
 */
export function stripSessionIdTagIfPresent(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed.length === 0) {
    return undefined;
  }
  return stripSessionIdTag(trimmed);
}
