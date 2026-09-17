import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { readJsonBody, sendGithubRequest, type GithubApiFetch } from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The merge execution's two REST calls: the settings-gate read and the merge
 * PUT. Split from `merge.ts` to keep both files inside the size gates. Every
 * response body goes through the Result-translating reader — an unreadable
 * answer to the PUT, and any 5xx answer readable or not, reports the merge
 * state as UNKNOWN (security D2): the call was sent, so anything firmer
 * invites a supervisor retry against an already-merged PR.
 */

const GITHUB_API = 'https://api.github.com';

/** Only the field this gate consumes; unknown repo fields are irrelevant here. */
const mergeSettingsSchema = z.object({ allow_merge_commit: z.boolean() });

const mergeResponseSchema = z.object({ merged: z.literal(true), sha: z.string().min(1) });

/** The real fetch, wrapped to the port shape at this one boundary. */
export function realFetch(): GithubApiFetch {
  return async (url, init) => {
    const response = await fetch(url, init);
    return { status: response.status, json: () => response.json() };
  };
}

function apiHeaders(token: string): Record<string, string> {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  };
}

/** Read the repo's `allow_merge_commit` — REQUIRED; a missing field refuses, never assumes. */
export async function readMergeSettings(
  fetchImpl: GithubApiFetch,
  token: string,
  identity: BotIdentity,
): Promise<Result<boolean, Error>> {
  const sent = await sendGithubRequest(
    fetchImpl,
    `${GITHUB_API}/repos/${identity.owner}/${identity.repoName}`,
    { method: 'GET', headers: apiHeaders(token) },
    'repo settings read',
  );
  if (!sent.ok) {
    return sent;
  }
  const response = sent.value;
  if (response.status !== 200) {
    return err(new Error(`repo settings read answered ${response.status}`));
  }
  const body = await readJsonBody(response, 'repo settings read');
  if (!body.ok) {
    return body;
  }
  const parsed = parseWithSchema({
    label:
      'repo merge settings (allow_merge_commit is REQUIRED — a missing field refuses, never assumes)',
    schema: mergeSettingsSchema,
    value: body.value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  return ok(parsed.value.allow_merge_commit);
}

interface MergeCallInput {
  readonly identity: BotIdentity;
  readonly prNumber: number;
  readonly headRefOid: string;
}

/**
 * The one merge-state-UNKNOWN wording, shared by every failure AFTER the PUT
 * left: it names the PR, the verdicted tip, and the re-read instruction, so a
 * supervisor never retries blind against a merge that may already have landed.
 */
function mergeStateUnknown(input: MergeCallInput, detail: string): Error {
  return new Error(
    `merge state UNKNOWN for PR #${input.prNumber} at tip ${input.headRefOid} — the PUT was sent and ${detail}; re-read the PR before retrying`,
  );
}

/**
 * Send the merge PUT. A REJECTED request is not a request that never
 * happened: a connection dropping while the response headers were in flight
 * can follow a merge that LANDED, so it reports the same indeterminate state
 * as an unreadable body — never an ordinary operational failure.
 */
async function sendMergePut(
  fetchImpl: GithubApiFetch,
  token: string,
  input: MergeCallInput,
): Promise<Result<Awaited<ReturnType<GithubApiFetch>>, Error>> {
  const sent = await sendGithubRequest(
    fetchImpl,
    `${GITHUB_API}/repos/${input.identity.owner}/${input.identity.repoName}/pulls/${input.prNumber}/merge`,
    {
      method: 'PUT',
      headers: apiHeaders(token),
      body: JSON.stringify({ merge_method: 'merge', sha: input.headRefOid }),
    },
    'the merge PUT',
  );
  return sent.ok ? sent : err(mergeStateUnknown(input, sent.error.message));
}

/**
 * Translate a READABLE non-200 answer to the PUT: only 4xx is the endpoint's
 * own deterministic refusal (405 method disallowed, 409 moved tip) — the
 * merge did not happen, and saying so plainly is safe. A readable 5xx proves
 * NOTHING: a gateway can answer 502/503 after the upstream accepted the PUT.
 */
function readableFailure(input: MergeCallInput, status: number, bodyValue: unknown): Error {
  const message = z.object({ message: z.string() }).safeParse(bodyValue);
  const detail = message.success ? message.data.message : 'no message';
  if (status >= 500) {
    return mergeStateUnknown(input, `it answered ${status} (${detail})`);
  }
  return new Error(
    `merge endpoint answered ${status} for verdicted tip ${input.headRefOid}: ${detail}`,
  );
}

/** PUT the merge (method `merge`, the VERDICTED tip's sha); returns the merge-commit sha. */
export async function putMerge(
  fetchImpl: GithubApiFetch,
  token: string,
  input: MergeCallInput,
): Promise<Result<string, Error>> {
  const sent = await sendMergePut(fetchImpl, token, input);
  if (!sent.ok) {
    return sent;
  }
  const response = sent.value;
  const body = await readJsonBody(response, 'merge response');
  if (!body.ok) {
    // The PUT was SENT: an unreadable answer (edge drop mid-body, gateway
    // HTML) leaves the merge state indeterminate.
    return err(
      mergeStateUnknown(
        input,
        `it answered ${response.status} with an unreadable body (${body.error.message})`,
      ),
    );
  }
  if (response.status !== 200) {
    return err(readableFailure(input, response.status, body.value));
  }
  const parsed = parseWithSchema({
    label: 'merge response',
    schema: mergeResponseSchema,
    value: body.value,
  });
  if (!parsed.ok) {
    // The invariant after the PUT leaves: only 200-and-schema-valid is
    // MERGED, only a readable 4xx is definitely-not-merged, and EVERYTHING
    // else — including a 200 whose body does not say `merged: true` — is
    // indeterminate.
    return err(
      mergeStateUnknown(
        input,
        `it answered 200 with an unrecognisable body (${parsed.error.message})`,
      ),
    );
  }
  return ok(parsed.value.sha);
}
