import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { readDefaultBranch } from './github-repository.js';
import { restJson, restProbe, unexpectedStatus } from './github-rest.js';
import { laneCount, type OpenEntry } from './lane-count.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { PullRequestOutcome } from './pull-request-report.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The `open` verb of `merge-bot pull-request`: a DRAFT pull request from a
 * branch into the repository's default branch, written only once four reads
 * hold. The default branch is read, never assumed. The remote must hold the
 * branch; no open pull request may already have it as head; and the open
 * lane count must sit under the limit the seat states. A lane is an open
 * pull request by one of the authors this clone counts as its own, on a
 * branch that is not a coordination branch: the limit is on this clone's
 * work in progress, and other people's pull requests in a shared repository
 * are not part of it. Each read that fails its condition is a typed
 * refusal, and nothing is written after one.
 */

/** What the seat asks to open. */
export interface OpenInput {
  readonly branch: string;
  readonly title: string;
  /** The body file's content, verbatim. */
  readonly body: string;
  /** The open lane count at or above which the open refuses. */
  readonly wipLimit: number;
  /**
   * The GitHub logins whose open pull requests count as this clone's lanes,
   * compared without regard to case. An app's login carries its `[bot]`
   * suffix, as GitHub reports a pull request's author.
   */
  readonly laneAuthors: readonly string[];
}

/** The outcome of an open: the new pull request, or the refusal. */
export type OpenOutcome = Extract<PullRequestOutcome, { kind: 'opened' | 'refused' }>;

/** GitHub lists at most this many per page; a full page means another may follow. */
const PAGE_SIZE = 100;

const headListSchema = z.array(z.object({ number: z.number().int().positive() }));
const openListSchema = z.array(
  z.object({
    head: z.object({ ref: z.string() }),
    /** GitHub answers null for an author whose account is gone. */
    user: z.object({ login: z.string() }).nullable(),
  }),
);

const openedSchema = z.object({
  number: z.number().int().positive(),
  html_url: z.string().min(1),
});

function refused(reason: string): OpenOutcome {
  return { kind: 'refused', reason };
}

function repoPath(repo: BotRepository): string {
  return `/repos/${repo.owner}/${repo.repoName}`;
}

/** Whether the remote holds the branch: a 200 says yes, a 404 says no, anything else fails. */
async function remoteHoldsBranch(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  branch: string,
): Promise<Result<boolean, Error>> {
  const label = 'GET /repos/{owner}/{repo}/branches/{branch}';
  const probe = await restProbe(fetchImpl, token, {
    method: 'GET',
    path: `${repoPath(repo)}/branches/${encodeURIComponent(branch)}`,
    label,
  });
  if (!probe.ok) {
    return probe;
  }
  if (probe.value.status === 200) {
    return ok(true);
  }
  return probe.value.status === 404
    ? ok(false)
    : err(unexpectedStatus(label, probe.value.status, probe.value.detail));
}

/** The number of the open pull request whose head is this branch of this repository, if any. */
async function openPullRequestWithHead(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  branch: string,
): Promise<Result<number | undefined, Error>> {
  const head = encodeURIComponent(`${repo.owner}:${branch}`);
  const listed = await restJson(
    fetchImpl,
    token,
    {
      method: 'GET',
      path: `${repoPath(repo)}/pulls?state=open&head=${head}&per_page=1`,
      label: 'GET /repos/{owner}/{repo}/pulls?head=',
    },
    200,
    headListSchema,
  );
  return listed.ok ? ok(listed.value[0]?.number) : listed;
}

/** Every open pull request's head ref and author, following the listing while a page is full. */
async function openEntries(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
): Promise<Result<readonly OpenEntry[], Error>> {
  const entries: OpenEntry[] = [];
  for (let page = 1; ; page += 1) {
    const listed = await restJson(
      fetchImpl,
      token,
      {
        method: 'GET',
        path: `${repoPath(repo)}/pulls?state=open&per_page=${String(PAGE_SIZE)}&page=${String(page)}`,
        label: 'GET /repos/{owner}/{repo}/pulls?state=open',
      },
      200,
      openListSchema,
    );
    if (!listed.ok) {
      return listed;
    }
    entries.push(
      ...listed.value.map((entry) => ({ ref: entry.head.ref, author: entry.user?.login })),
    );
    if (listed.value.length < PAGE_SIZE) {
      return ok(entries);
    }
  }
}

/** The three reads that can refuse, in order; the open lane count when the open may proceed. */
async function refusalBeforeOpen(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  input: OpenInput,
): Promise<Result<OpenOutcome | number, Error>> {
  const held = await remoteHoldsBranch(fetchImpl, token, repo, input.branch);
  if (!held.ok) {
    return held;
  }
  if (!held.value) {
    return ok(refused(`the remote does not hold branch "${input.branch}"; push it first`));
  }
  const existing = await openPullRequestWithHead(fetchImpl, token, repo, input.branch);
  if (!existing.ok) {
    return existing;
  }
  if (existing.value !== undefined) {
    return ok(
      refused(`pull request #${String(existing.value)} is already open from "${input.branch}"`),
    );
  }
  const entries = await openEntries(fetchImpl, token, repo);
  if (!entries.ok) {
    return entries;
  }
  const lanes = laneCount(entries.value, input.laneAuthors);
  return ok(
    lanes >= input.wipLimit
      ? refused(
          `lane pull requests open: ${String(lanes)} (authors counted: ${input.laneAuthors.join(', ')}), at or above the --wip-limit of ${String(input.wipLimit)}; land or close one first`,
        )
      : lanes,
  );
}

/**
 * Open a draft pull request as the bot, once the reads hold.
 *
 * @param fetchImpl - GitHub, over the port.
 * @param token - The installation token minted for this invocation.
 * @param repo - The bot identity's repository.
 * @param input - The branch, the title, the body and the limit.
 * @returns The new pull request's number and URL, or the typed refusal; a
 *   failure when GitHub answered a status other than the expected one.
 */
export async function openPullRequest(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  input: OpenInput,
): Promise<Result<OpenOutcome, Error>> {
  const base = await readDefaultBranch(fetchImpl, token, repo);
  if (!base.ok) {
    return base;
  }
  const refusal = await refusalBeforeOpen(fetchImpl, token, repo, input);
  if (!refusal.ok) {
    return refusal;
  }
  if (typeof refusal.value !== 'number') {
    return ok(refusal.value);
  }
  const lanes = refusal.value;
  const opened = await restJson(
    fetchImpl,
    token,
    {
      method: 'POST',
      path: `${repoPath(repo)}/pulls`,
      body: {
        title: input.title,
        head: input.branch,
        base: base.value,
        body: input.body,
        draft: true,
      },
      label: 'POST /repos/{owner}/{repo}/pulls',
    },
    201,
    openedSchema,
  );
  return opened.ok
    ? ok({
        kind: 'opened',
        number: opened.value.number,
        url: opened.value.html_url,
        labels: [],
        laneCount: lanes,
      })
    : opened;
}
