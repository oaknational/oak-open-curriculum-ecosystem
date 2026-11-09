import { execFileSync } from 'node:child_process';

import { z } from 'zod';

import { GH_EXEC_OPTIONS, type GhCommandExecutor } from '../pr-watch/gh.js';
import { parseRecordedHarvest, type RecordedHarvest } from '../pr-tally/harvest.js';

/**
 * The live inputs the gate reads: the pull request's recording (the pr-tally
 * recording query, every connection with its page info — a truncated read is
 * refused, never counted short), its description, and a diff reader over the
 * local repository. Everything else in the gate is pure.
 *
 * The commits connection is read page by page, since a pull request's history
 * can outgrow one page (a fork's merge back carries thousands of commits).
 * GitHub serves at most a pull request's newest 250 commits, so on a longer
 * history the first commit served is not the branch's first. The reviewed
 * heads the gate prices are recent, so they fall inside what is served.
 * Every other connection is read once, and any connection still truncated is
 * refused by the parser.
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

/** One further page of the commits connection, after a cursor. */
const COMMIT_PAGE_QUERY = `query($owner: String!, $name: String!, $number: Int!, $after: String!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      commits(first: 100, after: $after) { pageInfo { hasNextPage endCursor } nodes { commit { oid committedDate } } }
    }
  }
}`;

/** Pages read after the first before the harvest stops, leaving the parser to refuse the rest: 20,000 commits. */
const MAX_FURTHER_COMMIT_PAGES = 200;

const COMMITS = z.object({
  pageInfo: z.object({ hasNextPage: z.boolean(), endCursor: z.string().nullable() }),
  nodes: z.array(z.unknown()),
});

type Commits = z.infer<typeof COMMITS>;

const COMMIT_PAGE = z.object({
  data: z.object({ repository: z.object({ pullRequest: z.object({ commits: COMMITS }) }) }),
});

/**
 * The whole commits connection: the first page, then each further page while
 * GitHub says there is one, up to the cap. A cursorless "next page", or one
 * past the cap, leaves `hasNextPage` true, so the parser refuses it.
 */
function readAllCommits(first: Commits, readPage: (after: string) => Commits): Commits {
  const nodes = [...first.nodes];
  let pageInfo = first.pageInfo;
  for (let read = 0; read < MAX_FURTHER_COMMIT_PAGES; read += 1) {
    if (!pageInfo.hasNextPage || pageInfo.endCursor === null) {
      break;
    }
    const next = readPage(pageInfo.endCursor);
    nodes.push(...next.nodes);
    pageInfo = next.pageInfo;
  }
  return { pageInfo, nodes };
}

interface LiveHarvest {
  readonly harvest: RecordedHarvest;
  readonly body: string;
  /** The tip of the pull request's base branch as GitHub holds it; undefined when the base is gone. */
  readonly baseRefOid: string | undefined;
}

interface HarvestOptions {
  readonly number: number;
  readonly repo: string;
  readonly run?: GhCommandExecutor;
}

// The GraphQL envelope around the recording; the recording itself is parsed by pr-tally.
const ENVELOPE = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.looseObject({
        body: z.string().nullable(),
        baseRef: z.object({ target: z.object({ oid: z.string().min(1) }) }).nullable(),
        commits: COMMITS,
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
  const [owner, name] = options.repo.split('/');
  const graphql = (fields: readonly string[]): unknown =>
    JSON.parse(
      run(
        'gh',
        [
          'api',
          'graphql',
          ...fields,
          '-F',
          `owner=${owner ?? ''}`,
          '-F',
          `name=${name ?? ''}`,
          '-F',
          `number=${String(options.number)}`,
        ],
        GH_EXEC_OPTIONS,
      ),
    );
  const envelope = ENVELOPE.parse(graphql(['-f', `query=${RECORDING_QUERY}`]));
  const pullRequest = envelope.data.repository.pullRequest;
  const commits = readAllCommits(
    pullRequest.commits,
    (after) =>
      COMMIT_PAGE.parse(graphql(['-f', `query=${COMMIT_PAGE_QUERY}`, '-f', `after=${after}`])).data
        .repository.pullRequest.commits,
  );
  return {
    harvest: parseRecordedHarvest({ ...pullRequest, commits }),
    body: pullRequest.body ?? '',
    baseRefOid: pullRequest.baseRef?.target.oid,
  };
}

/** The open pull request whose head is the given branch, or null when none is open. */
export function openPullRequestFor(
  branch: string,
  repo: string,
  run: GhCommandExecutor = execFileSync,
): number | null {
  const open = OPEN_PULL_REQUESTS.parse(
    JSON.parse(
      run(
        'gh',
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
  run: GhCommandExecutor = execFileSync,
): ListedPullRequest[] {
  return PULL_REQUEST_LIST.parse(
    JSON.parse(
      run(
        'gh',
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
export function currentRepo(run: GhCommandExecutor = execFileSync): string {
  return run(
    'gh',
    ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'],
    GH_EXEC_OPTIONS,
  ).trim();
}
