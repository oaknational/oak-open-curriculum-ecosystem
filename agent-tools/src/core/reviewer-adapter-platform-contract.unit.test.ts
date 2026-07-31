import { describe, expect, it } from 'vitest';

import { getReviewerAdapterPlatformViolation } from './reviewer-adapter-platform-contract.js';

describe('getReviewerAdapterPlatformViolation', () => {
  it('accepts adapters that match their declared platform support', () => {
    expect(getReviewerAdapterPlatformViolation('code-expert', 'codex', true)).toBeNull();
    expect(
      getReviewerAdapterPlatformViolation('cricket-judgement-high', 'codex', false),
    ).toBeNull();
  });

  it('classifies a missing adapter on a supported platform', () => {
    expect(getReviewerAdapterPlatformViolation('code-expert', 'codex', false)).toStrictEqual({
      kind: 'missing',
      reviewerName: 'code-expert',
      platform: 'codex',
    });
  });

  it('classifies an adapter present on an unsupported platform', () => {
    expect(
      getReviewerAdapterPlatformViolation('cricket-judgement-high', 'codex', true),
    ).toStrictEqual({
      kind: 'unsupported',
      reviewerName: 'cricket-judgement-high',
      platform: 'codex',
    });
  });
});
