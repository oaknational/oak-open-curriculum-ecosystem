import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { postGraphql } from './github-graphql.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { BotRepository } from './resolve-identity.js';
import type { PlannedDelete } from './retire-decision.js';
import type { DefaultBranchReading, RemoteRefReading } from './retire-parse.js';

/**
 * The retire command's two calls to GitHub, both GraphQL (`github-graphql.ts`)
 * so the branch name travels in a JSON body and never in a URL path (where
 * git-legal `#` and `%` would be read as something else).
 *
 * The delete is `updateRefs` with `beforeOid`: a server-side compare-and-swap,
 * so a push landing after the proof is kept, not deleted. A stale `beforeOid`
 * is answered by a generic GraphQL error, not a named mismatch (the
 * `branch-retire` scope row records the probe), so the caller never reads the
 * outcome from this answer: it reads the ref back.
 */

const ZERO_OID = '0'.repeat(40);

const REMOTE_REF_QUERY = `query($owner: String!, $name: String!, $ref: String!) {
  repository(owner: $owner, name: $name) {
    id
    defaultBranchRef { name target { oid } }
    ref(qualifiedName: $ref) { target { oid } }
  }
}`;

const DELETE_MUTATION = `mutation($id: ID!, $ref: GitRefname!, $before: GitObjectID!, $after: GitObjectID!) {
  updateRefs(input: { repositoryId: $id, refUpdates: [{ name: $ref, beforeOid: $before, afterOid: $after }] }) { clientMutationId }
}`;

const targetSchema = z.object({ oid: z.string().regex(/^[0-9a-f]{40}$/) });

const remoteRefSchema = z.object({
  data: z.object({
    repository: z.object({
      id: z.string().min(1),
      defaultBranchRef: z.object({ name: z.string().min(1), target: targetSchema }).nullable(),
      ref: z.object({ target: targetSchema }).nullable(),
    }),
  }),
});

const deleteSchema = z.object({ data: z.object({ updateRefs: z.looseObject({}) }) });

/** The repository's node id, its default branch, and the remote ref, as GitHub reads them. */
export interface RemoteRefState {
  readonly repositoryId: string;
  /** Undefined when the repository has no default branch (an empty repository). */
  readonly defaultBranch: DefaultBranchReading | undefined;
  readonly ref: RemoteRefReading;
}

/** Read the remote ref, the default branch, and the node id the delete needs, through the identity's own repository. */
export async function readRemoteRefByApi(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  branch: string,
): Promise<Result<RemoteRefState, Error>> {
  const body = await postGraphql(fetchImpl, token, 'the remote ref read', {
    query: REMOTE_REF_QUERY,
    variables: { owner: repo.owner, name: repo.repoName, ref: `refs/heads/${branch}` },
  });
  if (!body.ok) {
    return body;
  }
  const parsed = remoteRefSchema.safeParse(body.value);
  if (!parsed.success) {
    return err(new Error('the remote ref read answered an unrecognised body'));
  }
  const { id, defaultBranchRef, ref } = parsed.data.data.repository;
  return ok({
    repositoryId: id,
    defaultBranch:
      defaultBranchRef === null
        ? undefined
        : { name: defaultBranchRef.name, sha: defaultBranchRef.target.oid },
    ref: ref === null ? { kind: 'absent' } : { kind: 'present', sha: ref.target.oid },
  });
}

/** Ask GitHub to delete the planned ref only if it is still at the proven sha. */
export async function requestRefDelete(
  fetchImpl: GithubApiFetch,
  token: string,
  repositoryId: string,
  target: PlannedDelete,
): Promise<Result<undefined, Error>> {
  const body = await postGraphql(fetchImpl, token, 'the remote delete', {
    query: DELETE_MUTATION,
    variables: { id: repositoryId, ref: target.ref, before: target.expectedSha, after: ZERO_OID },
  });
  if (!body.ok) {
    return body;
  }
  return deleteSchema.safeParse(body.value).success
    ? ok(undefined)
    : err(new Error('the remote delete answered an unrecognised body'));
}
