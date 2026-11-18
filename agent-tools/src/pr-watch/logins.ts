/**
 * The reviewer identities `pr state` compares and names: the one login
 * comparison, and the Codex connector's login, which a comment trigger and a
 * ready-for-review event are attributed to, since neither names a reviewer
 * of its own.
 */

// GitHub logins are case-insensitive; compare through one casing so a declared
// `--expect jimcresswell` matches the API's `jimCresswell` (display keeps the
// declared form).
/** The one login comparison every reader of a reviewer's result shares. */
export function normaliseLogin(login: string): string {
  return login.toLowerCase();
}

/** The Codex connector's login, as the GraphQL harvests carry it. */
export const CODEX_CONNECTOR_LOGIN = 'chatgpt-codex-connector';
