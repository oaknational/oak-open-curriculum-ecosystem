import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import type { CloneStatements } from './clone-statements.js';
import { restJson } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { openPullRequest, type OpenInput, type OpenOutcome } from './pull-request-open.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The labels this clone's bot puts on a pull request it opens.
 *
 * The labels come from the clone's own merge-bot config
 * (`pullRequestLabels` in `.github/merge-bot.json`, per-checkout and never
 * tracked), so they follow the bot and not the tool: another person's clone
 * of this repository names its own app in its own config and applies its own
 * labels, or none. Nothing here names a label.
 */

const labelledSchema = z.array(z.object({ name: z.string() }));

/**
 * Open a draft pull request, then add the clone's configured labels to it.
 *
 * With no labels configured this is the open and nothing more. The labels
 * are added after the open because GitHub's create call takes none. If the
 * open succeeds and the labelling does not, the result is a failure that
 * names the pull request that now exists, so the seat labels it by hand and
 * does not open a second one.
 *
 * @param fetchImpl - GitHub, over the port.
 * @param token - The installation token minted for this invocation.
 * @param repo - The bot identity's repository.
 * @param input - The branch, the title, the body and the limit.
 * @param clone - What the clone states: the labels to add, which may be
 *   empty, and the authors whose open pull requests the limit counts.
 * @returns The open's outcome, carrying the labels GitHub says are now on
 *   the pull request, or the failure described above.
 */
export async function openLabelledPullRequest(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  input: Omit<OpenInput, 'laneAuthors'>,
  { labels, laneAuthors }: CloneStatements,
): Promise<Result<OpenOutcome, Error>> {
  const opened = await openPullRequest(fetchImpl, token, repo, { ...input, laneAuthors });
  if (!opened.ok || opened.value.kind !== 'opened' || labels.length === 0) {
    return opened;
  }
  const labelled = await restJson(
    fetchImpl,
    token,
    {
      method: 'POST',
      path: `/repos/${repo.owner}/${repo.repoName}/issues/${String(opened.value.number)}/labels`,
      body: { labels },
      label: 'POST /repos/{owner}/{repo}/issues/{number}/labels',
    },
    200,
    labelledSchema,
  );
  return labelled.ok
    ? ok({ ...opened.value, labels: labelled.value.map((label) => label.name) })
    : err(
        new Error(
          `pull request #${String(opened.value.number)} was opened (${opened.value.url}) but its labels (${labels.join(', ')}) were not added: ${labelled.error.message}; add them by hand, do not open it again`,
          { cause: labelled.error },
        ),
      );
}
