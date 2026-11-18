import { ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { restJson } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The repository as GitHub holds it: what the pull-request verbs read of it
 * before they write. The `open` verb needs the default branch as its base;
 * the `dispatch-workflow` verb needs it as the ref the dispatch runs on.
 * Hoisted out of `pull-request-open.ts` at the second consumer.
 */

const repositorySchema = z.object({ default_branch: z.string().min(1) });

/** The repository's default branch, as GitHub holds it now; never assumed. */
export async function readDefaultBranch(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
): Promise<Result<string, Error>> {
  const read = await restJson(
    fetchImpl,
    token,
    {
      method: 'GET',
      path: `/repos/${repo.owner}/${repo.repoName}`,
      label: 'GET /repos/{owner}/{repo}',
    },
    200,
    repositorySchema,
  );
  return read.ok ? ok(read.value.default_branch) : read;
}
