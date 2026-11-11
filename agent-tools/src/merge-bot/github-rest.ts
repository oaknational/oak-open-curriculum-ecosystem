import { err, ok, type Result } from '@oaknational/result';
import type { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { githubJsonHeaders } from './github-fetch.js';
import {
  githubErrorDetail,
  githubHeaders,
  readJsonBody,
  sendGithubRequest,
  type GithubApiFetch,
} from './mint-installation-token.js';

/**
 * The REST calls behind `merge-bot pull-request`: one shape for a call that
 * expects one status and a JSON body of a known schema, and one for a probe
 * whose status is the answer. Every failure names the call, the status
 * GitHub answered and GitHub's own message, so an operator reads the cause
 * and not a bare number. The URL is built here from a path the caller has
 * already bound every segment of (an integer, a name the grammar admitted).
 */

const GITHUB_API = 'https://api.github.com';

/** One REST call: its method, its path under the API root, and the JSON body a write sends. */
export interface RestCall {
  readonly method: 'GET' | 'POST' | 'PATCH';
  readonly path: string;
  readonly body?: Readonly<Record<string, string | boolean>>;
  /** Names the call in every failure. */
  readonly label: string;
}

async function send(
  fetchImpl: GithubApiFetch,
  token: string,
  call: RestCall,
): Promise<Result<Awaited<ReturnType<GithubApiFetch>>, Error>> {
  return sendGithubRequest(
    fetchImpl,
    `${GITHUB_API}${call.path}`,
    call.body === undefined
      ? { method: call.method, headers: githubHeaders(token) }
      : {
          method: call.method,
          headers: githubJsonHeaders(token),
          body: JSON.stringify(call.body),
        },
    call.label,
  );
}

/** The status GitHub answered, with its message when the body carries one. */
export interface RestProbe {
  readonly status: number;
  /** GitHub's own words, or an empty string when the body carries none. */
  readonly detail: string;
}

/** Send the call and read its status: for a call whose status IS the answer (a 404 that means absent). */
export async function restProbe(
  fetchImpl: GithubApiFetch,
  token: string,
  call: RestCall,
): Promise<Result<RestProbe, Error>> {
  const sent = await send(fetchImpl, token, call);
  if (!sent.ok) {
    return sent;
  }
  return ok({ status: sent.value.status, detail: await githubErrorDetail(sent.value) });
}

/** The failure for a status other than the expected one: the call, the status, GitHub's words. */
export function unexpectedStatus(label: string, status: number, detail: string): Error {
  return new Error(`${label} answered HTTP ${String(status)}${detail}`);
}

/**
 * Send the call, require `expect` as its status, and read the body through
 * `schema`. Any other status fails with GitHub's message; a body outside the
 * schema fails naming the call.
 */
export async function restJson<TSchema extends z.ZodType>(
  fetchImpl: GithubApiFetch,
  token: string,
  call: RestCall,
  expect: number,
  schema: TSchema,
): Promise<Result<z.output<TSchema>, Error>> {
  const sent = await send(fetchImpl, token, call);
  if (!sent.ok) {
    return sent;
  }
  if (sent.value.status !== expect) {
    return err(
      unexpectedStatus(call.label, sent.value.status, await githubErrorDetail(sent.value)),
    );
  }
  const body = await readJsonBody(sent.value, call.label);
  return body.ok ? parseWithSchema({ label: call.label, schema, value: body.value }) : body;
}
