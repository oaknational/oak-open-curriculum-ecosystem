import { describe, expect, it } from 'vitest';

import { defaultExpectedReviewers } from './expected-reviewers.js';
import type { HarvestedReview } from './reviewer-legs.js';

/**
 * The expected reviewer set DEFAULTED when none is declared, over literal
 * inputs: outstanding requests plus the authors of landed reviews that are
 * neither signed self-replies nor empty-bodied.
 */

const TIP = 'a'.repeat(40);

function review(author: string, body: string, state = 'COMMENTED'): HarvestedReview {
  return { author, state, body, commitOid: TIP, submittedAt: '2026-07-21T12:00:00Z' };
}

describe('defaultExpectedReviewers', () => {
  it('unions outstanding requests with the authors of landed reviews, once each', () => {
    const reviews = [
      review('copilot-pull-request-reviewer', 'Reviewed.'),
      review('copilot-pull-request-reviewer', 'Reviewed again.'),
    ];
    expect(defaultExpectedReviewers(['jimCresswell'], reviews)).toEqual([
      'jimCresswell',
      'copilot-pull-request-reviewer',
    ]);
  });

  it('drops an author seen only through EMPTY-bodied reviews, keeping one with any non-empty review', () => {
    // The empty body is a thread reply's artefact, not a round: its author
    // would otherwise mint a phantom OWED leg.
    const reviews = [
      review('el-graphael', ''),
      review('copilot-pull-request-reviewer', '  \n '),
      review('copilot-pull-request-reviewer', 'Reviewed.'),
    ];
    expect(defaultExpectedReviewers([], reviews)).toEqual(['copilot-pull-request-reviewer']);
  });

  it('drops signed self-replies, unsubmitted drafts and deleted-account authors', () => {
    const reviews = [
      review('jimCresswell', 'Fixed at source.\n\n— Moth mends Dreamscape (92e9d6)'),
      review('claude', 'Draft.', 'PENDING'),
      review('unknown', 'Reviewed.'),
    ];
    expect(defaultExpectedReviewers([], reviews)).toEqual([]);
  });
});
