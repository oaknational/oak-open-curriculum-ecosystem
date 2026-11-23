/**
 * The span attribute names under which HTTP instrumentation writes cookies:
 * the whole header under the prefix itself, or one attribute per cookie as
 * `<prefix>.<cookie name>`. The last segment is then a cookie name, which no
 * list of sensitive keys can cover, so the prefix decides.
 */
const COOKIE_ATTRIBUTE_PREFIXES = [
  'http.request.header.cookie',
  'http.response.header.set_cookie',
] as const;

/**
 * Whether a telemetry key names a cookie written as a span attribute.
 *
 * @param normalisedKey - The key, already lower-cased
 * @returns `true` for a cookie attribute prefix or any key beneath one
 */
export function isCookieAttributeKey(normalisedKey: string): boolean {
  return COOKIE_ATTRIBUTE_PREFIXES.some(
    (prefix) => normalisedKey === prefix || normalisedKey.startsWith(`${prefix}.`),
  );
}
