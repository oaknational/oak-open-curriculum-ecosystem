import { execFileSync } from 'node:child_process';

import { z } from 'zod';

import { GH_EXEC_OPTIONS, resolveGhPath, type GhCommandExecutor } from '../pr-watch/gh.js';
import { parseRecordedHarvest, type RecordedHarvest } from '../pr-tally/harvest.js';

/**
 * The live inputs the gate reads: the pull request's recording (the pr-tally
 * recording query, every connection with its page info — a truncated read is
 * refused, never counted short), its description, and a diff reader over the
 * local repository. Everything else in the gate is pure.
 */

const RECORDING_QUERY = `query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number headRefOid baseRefName body
      baseRef { target { oid } }
      mergeCommit { oid }
      commits(first: 100) { pageInfo { hasNextPage endCursor } nodes { commit { oid committedDate } } }
      reviewThreads(first: 100) { pageInfo { hasNextPage endCursor } nodes {
        id isResolved isOutdated path line originalLine startLine originalStartLine
        comments(first: 50) { pageInfo { hasNextPage endCursor } nodes {
          databaseId author { login } createdAt body pullRequestReview { id commit { oid } } } } } }
      reviews(first: 100) { pageInfo { hasNextPage endCursor } nodes {
        id databaseId author { login } state commit { oid } submittedAt body } }
      comments(first: 100) { pageInfo { hasNextPage endCursor } nodes { databaseId author { login } createdAt body } }
    }
  }
}`;

interface LiveHarvest {
  readonly harvest: RecordedHarvest;
  readonly body: string;
  /** The tip of the pull request's base branch as GitHub holds it; undefined when the base is gone. */
  readonly baseRefOid: string | undefined;
}

interface HarvestOptions {
  readonly number: number;
  readonly repo: string;
  readonly ghPath?: string;
  readonly run?: GhCommandExecutor;
}

// The GraphQL envelope around the recording; the recording itself is parsed by pr-tally.
const ENVELOPE = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.looseObject({
        body: z.string().nullable(),
        baseRef: z.object({ target: z.object({ oid: z.string().min(1) }) }).nullable(),
      }),
    }),
  }),
});

const OPEN_PULL_REQUESTS = z.array(z.object({ number: z.number().int().positive() }));

const PULL_REQUEST_LIST = z.array(
  z.object({
    number: z.number().int().positive(),
    state: z.string(),
    title: z.string(),
    mergedAt: z.string().nullable(),
  }),
);

export type ListedPullRequest = z.infer<typeof PULL_REQUEST_LIST>[number];

/** Read the pull request's recording and description through `gh`. */
export function readLiveHarvest(options: HarvestOptions): LiveHarvest {
  const run = options.run ?? execFileSync;
  const gh = resolveGhPath(options.ghPath);
  const [owner, name] = options.repo.split('/');
  const envelope = ENVELOPE.parse(
    JSON.parse(
      run(
        gh,
        [
          'api',
          'graphql',
          '-f',
          `query=${RECORDING_QUERY}`,
          '-F',
          `owner=${owner ?? ''}`,
          '-F',
          `name=${name ?? ''}`,
          '-F',
          `number=${String(options.number)}`,
        ],
        GH_EXEC_OPTIONS,
      ),
    ),
  );
  const pullRequest = envelope.data.repository.pullRequest;
  return {
    harvest: parseRecordedHarvest(pullRequest),
    body: pullRequest.body ?? '',
    baseRefOid: pullRequest.baseRef?.target.oid,
  };
}

/** The open pull request whose head is the given branch, or null when none is open. */
export function openPullRequestFor(
  branch: string,
  repo: string,
  ghPath?: string,
  run: GhCommandExecutor = execFileSync,
): number | null {
  const gh = resolveGhPath(ghPath);
  const open = OPEN_PULL_REQUESTS.parse(
    JSON.parse(
      run(
        gh,
        [
          'pr',
          'list',
          '--repo',
          repo,
          '--head',
          branch,
          '--state',
          'open',
          '--json',
          'number',
          '--limit',
          '1',
        ],
        GH_EXEC_OPTIONS,
      ),
    ),
  );
  return open[0]?.number ?? null;
}

/** Every pull request updated on or after the date (ISO day), newest first, any state. */
export function pullRequestsSince(
  since: string,
  repo: string,
  ghPath?: string,
  run: GhCommandExecutor = execFileSync,
): ListedPullRequest[] {
  const gh = resolveGhPath(ghPath);
  return PULL_REQUEST_LIST.parse(
    JSON.parse(
      run(
        gh,
        [
          'pr',
          'list',
          '--repo',
          repo,
          '--state',
          'all',
          '--search',
          `updated:>=${since}`,
          '--json',
          'number,state,title,mergedAt',
          '--limit',
          '100',
        ],
        GH_EXEC_OPTIONS,
      ),
    ),
  );
}

/** The repository's `owner/repo` from `gh`, when the caller does not name it. */
export function currentRepo(ghPath?: string, run: GhCommandExecutor = execFileSync): string {
  const gh = resolveGhPath(ghPath);
  return run(
    gh,
    ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'],
    GH_EXEC_OPTIONS,
  ).trim();
}
