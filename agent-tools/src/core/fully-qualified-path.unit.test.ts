import { describe, expect, it } from 'vitest';

import { fullyQualifiedWin32 } from './fully-qualified-path.js';

describe('fullyQualifiedWin32', () => {
  it.each([
    { candidate: String.raw`C:\x`, qualified: true, label: 'drive letter with backslash' },
    { candidate: 'C:/x', qualified: true, label: 'drive letter with forward slash' },
    {
      candidate: 'C:x',
      qualified: false,
      label: 'drive-relative (no separator after the drive)',
    },
    { candidate: String.raw`\x`, qualified: false, label: 'rooted drive-relative (backslash)' },
    { candidate: '/x', qualified: false, label: 'rooted drive-relative (forward slash)' },
    { candidate: String.raw`\\host\share`, qualified: false, label: 'UNC network share' },
  ])('$label: $candidate is $qualified', ({ candidate, qualified }) => {
    expect(fullyQualifiedWin32(candidate)).toBe(qualified);
  });
});
