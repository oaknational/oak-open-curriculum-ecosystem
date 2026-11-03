import { GH_EXEC_OPTIONS, parseGhJson, parsePrTarget, type GhCommandExecutor } from './gh.js';
import { parseReviewConfiguration, type ReviewConfiguration } from './review-configuration.js';

/**
 * The review-configuration leg of `pr state` over gh: the base branch's rules
 * (`gh api repos/{owner}/{repo}/rules/branches/{base} --paginate --slurp`, a
 * list of pages) parsed into the one configuration the legs read against.
 * Degrades typed: a refused read, a repository the target does not name, or
 * a base that is not a branch name yields `unread` with its reason, and the
 * verdict names it; it never throws, since a verdict without the
 * configuration is still a verdict, only a conservative one.
 *
 * @packageDocumentation
 */

// A base ref the rules API can be asked about: a branch name, never a flag,
// a traversal or a range (the same grammar the sibling estate's required-checks reader holds).
const BRANCH_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;

function isBranchName(ref: string): boolean {
  return BRANCH_NAME_PATTERN.test(ref) && !ref.includes('..');
}

/**
 * The configuration is the base branch's, not the tip's: read once per
 * reading, from the view the reading composes from (the repository from the
 * target or the pull request's own URL through the one validated target
 * grammar, the base from the view).
 */
export function readReviewConfigurationLeg(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly repo: string | undefined;
  readonly view: { readonly url: string; readonly baseRefName: string };
}): ReviewConfiguration {
  try {
    const repo = input.repo ?? parsePrTarget(input.view.url).repo;
    const base = input.view.baseRefName;
    if (repo === undefined) {
      return { kind: 'unread', reason: 'the target names no repository' };
    }
    if (!isBranchName(base)) {
      return { kind: 'unread', reason: `the base ref '${base}' is not a branch name` };
    }
    const raw = input.run(
      input.gh,
      ['api', `repos/${repo}/rules/branches/${encodeURIComponent(base)}`, '--paginate', '--slurp'],
      GH_EXEC_OPTIONS,
    );
    const pages = parseGhJson(raw, 'branch rules');
    const rules = Array.isArray(pages) ? pages.flat(1) : pages;
    const parsed = parseReviewConfiguration(rules);
    return parsed.ok ? parsed.value : { kind: 'unread', reason: parsed.error.message };
  } catch (cause) {
    return {
      kind: 'unread',
      reason: `branch rules read failed: ${cause instanceof Error ? cause.message : String(cause)}`,
    };
  }
}
