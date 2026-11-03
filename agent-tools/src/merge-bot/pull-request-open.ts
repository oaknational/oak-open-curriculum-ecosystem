import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { readDefaultBranch } from './github-repository.js';
import { restJson, restProbe, unexpectedStatus } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { PullRequestOutcome } from './pull-request-report.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The `open` verb of `merge-bot pull-request`: a DRAFT pull request from a
 * branch into the repository's default branch, written only once four reads
 * hold. The default branch is read, never assumed. The remote must hold the
 * branch; no open pull request may already have it as head; and the open
 * lane count must sit under the limit the seat states, where a coordination
 * branch's pull request and Dependabot's are not lanes and are not counted.
 * Each read that fails its condition is a typed refusal, and nothing is
 * written after one.
 */

/** What the seat asks to open. */
export interface OpenInput {
  readonly branch: string;
  readonly title: string;
  /** The body file's content, verbatim. */
  readonly body: string;
  /** The open lane count at or above which the open refuses. */
  readonly wipLimit: number;
}

/** The outcome of an open: the new pull request, or the refusal. */
export type OpenOutcome = Extract<PullRequestOutcome, { kind: 'opened' | 'refused' }>;

/** Head refs with this prefix are coordination branches, not lanes, and are not counted. */
const COORDINATION_PREFIX = 'coordination/';

/** Dependabot's pull requests are not lanes either (the owner's word, 2026-10-17) and are not counted. */
const DEPENDABOT_LOGIN = 'dependabot[bot]';

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

/** One open pull request as the lane count reads it: its head ref and its author's login. */
interface OpenEntry {
  readonly ref: string;
  readonly author: string | undefined;
}
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
  const listed = await restJson(
    fetchImpl,
    token,
    {
      method: 'GET',
      path: `${repoPath(repo)}/pulls?state=open&head=${encodeURIComponent(`${repo.owner}:${branch}`)}&per_page=1`,
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

/** A lane: an open pull request that is neither a coordination branch's nor Dependabot's. */
function isLane(entry: OpenEntry): boolean {
  return (
    !entry.ref.startsWith(COORDINATION_PREFIX) && entry.author?.toLowerCase() !== DEPENDABOT_LOGIN
  );
}

/** The open lane count, which the limit is read against. */
function laneCount(entries: readonly OpenEntry[]): number {
  return entries.filter((entry) => isLane(entry)).length;
}

/** The three reads that can refuse, in order; undefined when the open may proceed. */
async function refusalBeforeOpen(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  input: OpenInput,
): Promise<Result<OpenOutcome | undefined, Error>> {
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
  const lanes = laneCount(entries.value);
  return ok(
    lanes >= input.wipLimit
      ? refused(
          `${String(lanes)} lane pull requests are open, at or above the --wip-limit of ${String(input.wipLimit)}; land or close one first`,
        )
      : undefined,
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
  if (refusal.value !== undefined) {
    return ok(refusal.value);
  }
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
    ? ok({ kind: 'opened', number: opened.value.number, url: opened.value.html_url })
    : opened;
}
