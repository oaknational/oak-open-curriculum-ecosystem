import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { isBranchName, parseRequiredChecks } from '../pr-watch/required-checks.js';
import { GITHUB_API } from './merge-github-api.js';
import {
  githubHeaders,
  readJsonBody,
  sendGithubRequest,
  type GithubApiFetch,
} from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The base branch's required contexts over the merge bot's fetch port: the
 * pull request's base ref, then EVERY page of that branch's rules (the
 * endpoint pages at 30 by default, and a required-status-checks rule on a
 * later page is still a rule), parsed by the reader the fold clock shares.
 * Split from `merge-records-checks.ts` at the file-size gate.
 */

export interface RulesTarget {
  readonly identity: BotIdentity;
  readonly prNumber: number;
}

const pullBaseSchema = z.object({ base: z.object({ ref: z.string().min(1) }) });
const rulesPageSchema = z.array(z.unknown());
const RULES_PER_PAGE = 100;
/** More rules pages than any branch ruleset the estate could carry. */
const RULES_MAX_PAGES = 10;

/** Every page of the branch's rules (the endpoint pages at 30 by default; a rule on a later page is still a rule). */
async function readRulesPages(
  fetchImpl: GithubApiFetch,
  token: string,
  rulesUrl: string,
): Promise<Result<readonly unknown[], Error>> {
  const rules: unknown[] = [];
  for (let page = 1; page <= RULES_MAX_PAGES; page += 1) {
    // Pages are sequential by nature: the next request exists only when this one was full.
    const body = await readJson(
      fetchImpl,
      token,
      `${rulesUrl}?per_page=${RULES_PER_PAGE}&page=${page}`,
      'branch rules read',
    );
    if (!body.ok) {
      return body;
    }
    const parsed = parseWithSchema({
      label: `branch rules page ${page}`,
      schema: rulesPageSchema,
      value: body.value,
    });
    if (!parsed.ok) {
      return parsed;
    }
    rules.push(...parsed.value);
    if (parsed.value.length < RULES_PER_PAGE) {
      return ok(rules);
    }
  }
  return err(new Error(`branch rules read exceeded ${RULES_MAX_PAGES} pages`));
}

async function readJson(
  fetchImpl: GithubApiFetch,
  token: string,
  url: string,
  surface: string,
): Promise<Result<unknown, Error>> {
  const sent = await sendGithubRequest(
    fetchImpl,
    url,
    { method: 'GET', headers: githubHeaders(token) },
    surface,
  );
  if (!sent.ok) {
    return sent;
  }
  if (sent.value.status !== 200) {
    return err(new Error(`${surface} answered ${sent.value.status}`));
  }
  return readJsonBody(sent.value, surface);
}

/** The base branch's required contexts: the pull request's base ref, then that branch's rules. */
export async function readRequiredContexts(
  fetchImpl: GithubApiFetch,
  token: string,
  target: RulesTarget,
): Promise<Result<readonly string[], Error>> {
  const repo = `${GITHUB_API}/repos/${target.identity.owner}/${target.identity.repoName}`;
  const pull = await readJson(
    fetchImpl,
    token,
    `${repo}/pulls/${target.prNumber}`,
    'base ref read',
  );
  if (!pull.ok) {
    return pull;
  }
  const base = parseWithSchema({
    label: 'pull request base',
    schema: pullBaseSchema,
    value: pull.value,
  });
  if (!base.ok) {
    return base;
  }
  const ref = base.value.base.ref;
  if (!isBranchName(ref)) {
    return err(new Error(`the base ref '${ref}' is not a branch name`));
  }
  const rules = await readRulesPages(
    fetchImpl,
    token,
    `${repo}/rules/branches/${encodeURIComponent(ref)}`,
  );
  return rules.ok ? parseRequiredChecks(rules.value) : rules;
}
