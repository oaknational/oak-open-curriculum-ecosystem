import { githubHeaders, type GithubApiFetch } from './mint-installation-token.js';

/**
 * The one real `fetch` behind the merge-bot's GitHub port, and the headers
 * of a call that sends a JSON body. The mint pipeline, `merge-bot merge` and
 * `merge-bot retire` all reach GitHub through these, so the wrapping and the
 * header set are written once.
 */

/** Every GitHub call ends inside this bound, so a stalled connection never holds a live token open on an unattended seat. */
const GITHUB_CALL_TIMEOUT_MS = 120_000;

/** The real fetch, wrapped to the port shape at this one boundary, each call under {@link GITHUB_CALL_TIMEOUT_MS}. */
export function realFetch(): GithubApiFetch {
  return async (url, init) => {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(GITHUB_CALL_TIMEOUT_MS),
    });
    return { status: response.status, json: () => response.json() };
  };
}

/** {@link githubHeaders} for a call whose body is JSON. */
export function githubJsonHeaders(bearer: string): Readonly<Record<string, string>> {
  return { ...githubHeaders(bearer), 'content-type': 'application/json' };
}
