import { describe, expect, it } from 'vitest';

import { textHasher } from './content-fixture.js';
import type { GhCommandExecutor } from './gh.js';
import { readPrStateReading } from './state-gh.js';
import { graphqlPayload, HEAD, viewPayload } from './test-helpers/state-gh-payloads.js';
import type { StateViewSeed } from './state-view-fixture.js';

/**
 * The review-configuration leg of `readPrStateReading`: the base branch's
 * rules, at the base the view names, in the repository the target or the pull
 * request's URL names; a refused or unreadable read degrades typed (`unread`,
 * with its reason) and the reading still composes. The owner's framing of
 * 2026-10-16: what a tip is owed is derived from the repository's review
 * configuration, never assumed.
 */

/** The base branch's rules as `gh api --paginate --slurp` returns them: one page, one Copilot rule. */
function rulesPayload(reviewOnPush = false): string {
  const parameters = { review_on_push: reviewOnPush, review_draft_pull_requests: false };
  return JSON.stringify([[{ type: 'copilot_code_review', parameters }]]);
}

interface Fake {
  readonly view?: Partial<StateViewSeed>;
  /** The one rules path the repository serves; any other `repos/` path is refused as unknown. */
  readonly rulesPath: string;
  readonly rules: string | Error;
}

/** The rules the repository serves at one path; any other path is unknown, as GitHub answers. */
function rulesAnswer(fake: Fake, path: string): string {
  if (path !== fake.rulesPath) {
    throw new Error(`HTTP 404: no such branch rules (${path})`);
  }
  if (fake.rules instanceof Error) {
    throw fake.rules;
  }
  return fake.rules;
}

/** A repository that serves exactly one branch's rules; every other leg answers quietly. */
function fakeGithub(fake: Fake): GhCommandExecutor {
  return (_file, args) => {
    if (args[0] === 'pr') {
      return viewPayload(HEAD, fake.view ?? {});
    }
    if (args[0] === 'api' && String(args[1]).startsWith('repos/')) {
      return rulesAnswer(fake, String(args[1]));
    }
    const query = args.find((arg) => arg.startsWith('query='));
    if (args[0] === 'api' && query !== undefined) {
      return graphqlPayload(query);
    }
    if (args[0] === 'agent-task') {
      return JSON.stringify([]);
    }
    throw new Error(`unexpected gh argv: ${args.join(' ')}`);
  };
}

const ghSeam = { ghPath: '/usr/bin/gh', exists: () => true, patchIdOf: textHasher };
const MAIN_RULES = 'repos/oaknational/oak-open-curriculum-ecosystem/rules/branches/main';

describe('readPrStateReading — the review-configuration leg', () => {
  it("reads the configuration of the base branch the view names, in the repository the pull request's URL names", () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({ rulesPath: MAIN_RULES, rules: rulesPayload() }),
    });
    expect(reading.reviewConfiguration).toEqual({
      kind: 'configured',
      reviewOnPush: false,
      reviewDraft: false,
    });
  });

  it("a target naming the repository reads that repository's rules", () => {
    const reading = readPrStateReading({
      target: { number: 461, repo: 'acme/widgets' },
      ...ghSeam,
      execFileSync: fakeGithub({
        view: { url: 'https://github.com/acme/widgets/pull/461' },
        rulesPath: 'repos/acme/widgets/rules/branches/main',
        rules: rulesPayload(true),
      }),
    });
    expect(reading.reviewConfiguration).toMatchObject({ kind: 'configured', reviewOnPush: true });
  });

  it('a pull request against another base reads that base, so a release branch is never read as main', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({
        view: { baseRefName: 'release/2026-10' },
        rulesPath:
          'repos/oaknational/oak-open-curriculum-ecosystem/rules/branches/release%2F2026-10',
        rules: JSON.stringify([[]]),
      }),
    });
    expect(reading.reviewConfiguration).toEqual({ kind: 'absent' });
  });

  it('degrades typed when the rules cannot be read: unread with the reason, and the reading still composes', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({ rulesPath: MAIN_RULES, rules: new Error('HTTP 502') }),
    });
    expect(reading.reviewConfiguration).toEqual({
      kind: 'unread',
      reason: 'branch rules read failed: HTTP 502',
    });
    expect(reading.headRefOid).toBe(HEAD);
  });

  it('a malformed Copilot rule reads unread with the parse refusal, never as an unconfigured branch', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({
        rulesPath: MAIN_RULES,
        rules: JSON.stringify([[{ type: 'copilot_code_review', parameters: {} }]]),
      }),
    });
    expect(reading.reviewConfiguration).toEqual({
      kind: 'unread',
      reason: 'a copilot_code_review rule carries no readable parameters',
    });
  });

  it('a view whose URL is not a pull-request URL, with no repository on the target, reads unread and names the grammar', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({
        view: { url: 'https://example.com/not-a-pull-request' },
        rulesPath: MAIN_RULES,
        rules: rulesPayload(),
      }),
    });
    expect(reading.reviewConfiguration).toMatchObject({ kind: 'unread' });
    expect(JSON.stringify(reading.reviewConfiguration)).toContain(
      'github.com/<owner>/<repo>/pull/<n>',
    );
  });

  it('a base that is not a branch name reads unread and names the ref', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: fakeGithub({
        view: { baseRefName: 'main..other' },
        rulesPath: MAIN_RULES,
        rules: rulesPayload(),
      }),
    });
    expect(reading.reviewConfiguration).toEqual({
      kind: 'unread',
      reason: "the base ref 'main..other' is not a branch name",
    });
  });
});
