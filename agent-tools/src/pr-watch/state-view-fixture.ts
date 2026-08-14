/** Shared gh `pr view` payload fixture for the state-parser specs —
 *  shapes mirror gh 2.x verified live on 2026-07-21 (PR #461). */

/** The seed's own shape: named fields the specs override, with the
 *  variable-shape legs held as `unknown` exactly as the boundary parser
 *  receives them. */
export interface StateViewSeed {
  readonly number: number;
  readonly url: string;
  readonly state: string;
  readonly isDraft: boolean;
  readonly mergeable: string;
  readonly mergeStateStatus: string;
  readonly headRefOid: string;
  readonly statusCheckRollup: readonly unknown[];
  readonly autoMergeRequest: unknown;
  readonly reviewRequests: readonly unknown[];
}

export function stateViewFixture(): StateViewSeed {
  return {
    number: 461,
    url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/461',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: 'f'.repeat(40),
    statusCheckRollup: [
      {
        __typename: 'CheckRun',
        name: 'secret-scan',
        workflowName: 'CI',
        status: 'COMPLETED',
        conclusion: 'SUCCESS',
        completedAt: '2026-07-21T10:33:35Z',
      },
      {
        __typename: 'CheckRun',
        name: 'run-quality-gates',
        workflowName: 'CI',
        status: 'COMPLETED',
        conclusion: 'SUCCESS',
        completedAt: '2026-07-21T10:41:02Z',
      },
      { __typename: 'StatusContext', context: 'legacy/status', state: 'SUCCESS' },
    ],
    autoMergeRequest: null,
    reviewRequests: [{ __typename: 'User', login: 'jimCresswell' }],
  };
}
