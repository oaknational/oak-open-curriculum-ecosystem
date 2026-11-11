import { ok } from '@oaknational/result';

import type { PrStateReading } from '../../pr-watch/state-types.js';
import type { MergeExecutionInput } from '../merge.js';
import type { GithubApiFetch } from '../mint-installation-token.js';

/**
 * The canonical `runMergeExecution` input for the merge-bot integration suites:
 * one minted token, the reading injected as a constant, the fetch port the
 * caller's. One owner (consolidate-at-second-consumer): the execution suite
 * and the records-class suite share the premise, and variation is expressed
 * through `overrides` at call sites, never by editing this base.
 */
export function makeInput(
  reading: PrStateReading,
  fetchImpl: GithubApiFetch,
  overrides: Partial<MergeExecutionInput> = {},
): MergeExecutionInput {
  return {
    identity: { appId: '1', keyPath: '/dev/null', owner: 'acme', repoName: 'widgets' },
    appSlug: 'acme-bot',
    prNumber: 42,
    expectedReviewers: ['copilot-pull-request-reviewer'],
    nowIso: '2026-08-06T09:00:00Z',
    seams: {
      mint: () =>
        Promise.resolve(
          ok({ token: 'test-token-value', expiresAt: '2026-08-06T10:00:00Z', installationId: 7 }),
        ),
      readReading: () => ok(reading),
      fetchImpl,
    },
    ...overrides,
  };
}
