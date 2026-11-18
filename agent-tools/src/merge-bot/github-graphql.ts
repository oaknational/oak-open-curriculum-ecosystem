import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { printable } from '../pr-watch/printable.js';
import { githubJsonHeaders } from './github-fetch.js';
import { unexpectedStatus } from './github-rest.js';
import {
  githubErrorDetailOf,
  readJsonBody,
  sendGithubRequest,
  type GithubApiFetch,
} from './mint-installation-token.js';

/**
 * The one GraphQL POST behind the merge-bot's GraphQL calls: the retire
 * action reads and deletes a ref through it, the pull-request action
 * resolves a thread and marks a draft ready. Hoisted from
 * `retire-github-api.ts` when the pull-request writes became the second
 * consumer (`consolidate-at-second-consumer`).
 *
 * GitHub answers a GraphQL failure with a 200 and an `errors` array as often
 * as with a non-200, so the errors are read first on every answer, and a
 * body carrying them is a failure whatever the status. A non-200 without
 * them fails naming the status and GitHub's message, as the REST calls do,
 * so a 403 reads as the wrong-scope symptom it is and not as a bare number.
 */

const GRAPHQL_URL = 'https://api.github.com/graphql';

/** One GraphQL document and its variables; every variable is a string (an id, a name). */
export interface GraphqlDocument {
  readonly query: string;
  readonly variables: Readonly<Record<string, string>>;
}

const errorsSchema = z.object({ errors: z.array(z.object({ message: z.string() })).min(1) });

/** POST one GraphQL document; returns the parsed JSON body of a 200, or a failure naming GitHub's words. */
export async function postGraphql(
  fetchImpl: GithubApiFetch,
  token: string,
  label: string,
  document: GraphqlDocument,
): Promise<Result<unknown, Error>> {
  const sent = await sendGithubRequest(
    fetchImpl,
    GRAPHQL_URL,
    { method: 'POST', headers: githubJsonHeaders(token), body: JSON.stringify(document) },
    label,
  );
  if (!sent.ok) {
    return sent;
  }
  const body = await readJsonBody(sent.value, label);
  if (!body.ok) {
    return sent.value.status === 200
      ? body
      : err(unexpectedStatus(label, sent.value.status, ` — ${body.error.message}`));
  }
  const errors = errorsSchema.safeParse(body.value);
  if (errors.success) {
    const messages = errors.data.errors.map((entry) => printable(entry.message)).join('; ');
    return err(new Error(`${label} answered with GraphQL errors: ${messages}`));
  }
  if (sent.value.status !== 200) {
    return err(unexpectedStatus(label, sent.value.status, githubErrorDetailOf(body.value)));
  }
  return ok(body.value);
}

/** {@link postGraphql}, then the body read through `schema`; a body outside it fails naming the label. */
export async function graphqlJson<TSchema extends z.ZodType>(
  fetchImpl: GithubApiFetch,
  token: string,
  label: string,
  document: GraphqlDocument,
  schema: TSchema,
): Promise<Result<z.output<TSchema>, Error>> {
  const body = await postGraphql(fetchImpl, token, label, document);
  return body.ok ? parseWithSchema({ label, schema, value: body.value }) : body;
}
