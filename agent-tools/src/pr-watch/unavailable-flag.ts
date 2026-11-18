import type { UnavailableDeclaration } from './declared-unavailable.js';

/**
 * Parse one `--unavailable <login>=<comment-url>` value: the vendor declared
 * unavailable, and the url of the bot's comment that declares it
 * (`declared-unavailable.ts`). The login holds no `=`; the url may.
 *
 * @param value - The flag's value.
 * @throws when either side is missing or empty.
 */
export function parseUnavailableFlag(value: string): UnavailableDeclaration {
  const at = value.indexOf('=');
  const login = at === -1 ? '' : value.slice(0, at).trim();
  const url = at === -1 ? '' : value.slice(at + 1).trim();
  if (login === '' || url === '') {
    throw new Error(`--unavailable takes <login>=<comment-url>, got "${value}"`);
  }
  return { login, url };
}
