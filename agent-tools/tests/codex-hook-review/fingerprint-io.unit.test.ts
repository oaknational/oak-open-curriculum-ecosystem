import { describe, expect, it } from 'vitest';

import { supportsSafeClaudeAsyncOutput } from '../../src/codex-hook-review/fingerprint-io.js';

describe('supportsSafeClaudeAsyncOutput', () => {
  it.each([
    ['2.1.201 (Claude Code)', false],
    ['2.1.202 (Claude Code)', true],
    ['2.1.211 (Claude Code)', true],
    ['2.2.0', true],
    ['3.0.0', true],
    ['unknown', false],
  ])('classifies %s', (version, expected) => {
    expect(supportsSafeClaudeAsyncOutput(version)).toBe(expected);
  });
});
