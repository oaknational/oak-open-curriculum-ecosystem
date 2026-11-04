import { describe, expect, it } from 'vitest';

import { parseReviewConfiguration, reviewConfigurationEvidence } from './review-configuration.js';

describe('parseReviewConfiguration', () => {
  it('reads the copilot_code_review rule as configured, with both switches', () => {
    expect(
      parseReviewConfiguration([
        { type: 'deletion' },
        {
          type: 'copilot_code_review',
          parameters: { review_on_push: false, review_draft_pull_requests: false },
        },
      ]),
    ).toStrictEqual({
      ok: true,
      value: { kind: 'configured', reviewOnPush: false, reviewDraft: false },
    });
  });

  it('reads a review on push by any of several Copilot rules as a review on push', () => {
    const parsed = parseReviewConfiguration([
      {
        type: 'copilot_code_review',
        parameters: { review_on_push: false, review_draft_pull_requests: true },
      },
      {
        type: 'copilot_code_review',
        parameters: { review_on_push: true, review_draft_pull_requests: false },
      },
    ]);
    expect(parsed).toStrictEqual({
      ok: true,
      value: { kind: 'configured', reviewOnPush: true, reviewDraft: true },
    });
  });

  it('reads a branch without the rule as absent, and refuses a rule without readable parameters', () => {
    expect(parseReviewConfiguration([{ type: 'required_status_checks' }])).toStrictEqual({
      ok: true,
      value: { kind: 'absent' },
    });
    expect(parseReviewConfiguration([{ type: 'copilot_code_review' }]).ok).toBe(false);
    expect(parseReviewConfiguration([{ type: 'copilot_code_review', parameters: {} }]).ok).toBe(
      false,
    );
    expect(parseReviewConfiguration({ message: 'Not Found' }).ok).toBe(false);
  });

  it('names each state in one evidence line, carrying the decision tokens', () => {
    expect(reviewConfigurationEvidence({ kind: 'unread', reason: 'no gh' })).toContain(
      'unread (no gh)',
    );
    expect(reviewConfigurationEvidence({ kind: 'absent' })).toContain(
      'no copilot_code_review rule',
    );
    const configured = reviewConfigurationEvidence({
      kind: 'configured',
      reviewOnPush: false,
      reviewDraft: true,
    });
    expect(configured).toContain('review_on_push=false');
    expect(configured).toContain('review_draft_pull_requests=true');
  });
});
