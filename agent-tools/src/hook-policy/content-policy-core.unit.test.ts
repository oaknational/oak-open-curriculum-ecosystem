import { describe, expect, it } from 'vitest';

import { evaluateContentPolicy } from './content-policy-core.js';

describe('evaluateContentPolicy', () => {
  it('returns the first owner-marker denial across canonical changes', () => {
    expect(
      evaluateContentPolicy(
        [
          { newContent: 'clean', priorContent: '', filePath: '/repo/clean.md' },
          {
            newContent: 'new owner marker',
            priorContent: 'old content',
            filePath: '/repo/blocked.md',
          },
        ],
        ['owner marker'],
        [],
      ),
    ).toStrictEqual({
      kind: 'deny',
      deny: { kind: 'owner-marker', pattern: 'owner marker' },
    });
  });

  it('returns the first scoped denial across canonical changes', () => {
    expect(
      evaluateContentPolicy(
        [
          {
            newContent: 'this is good enough',
            priorContent: 'undecided',
            filePath: '/repo/example.plan.md',
          },
        ],
        [],
        [
          {
            concept: 'expediency-hedging',
            patterns: ['good enough'],
            include_paths: ['**/*.plan.md'],
            citation: 'PDR-044',
            reappraisal: 'Re-assess the design.',
          },
        ],
      ),
    ).toStrictEqual({
      kind: 'deny',
      deny: {
        kind: 'concept',
        pattern: 'good enough',
        concept: 'expediency-hedging',
        citation: 'PDR-044',
        reappraisal: 'Re-assess the design.',
      },
    });
  });

  it('returns allow when canonical changes add no blocked content', () => {
    expect(
      evaluateContentPolicy(
        [{ newContent: 'clean', priorContent: '', filePath: '/repo/clean.md' }],
        ['owner marker'],
        [],
      ),
    ).toStrictEqual({ kind: 'allow' });
  });
});
