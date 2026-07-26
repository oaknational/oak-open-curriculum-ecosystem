import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  findAddedBlockedContent,
  findAddedScopedBlock,
  isPathInScope,
  lineIsPredominantlyCodeShaped,
  parseBlockedContentPolicy,
  parseHookInput,
  parseScopedContentBlocks,
  readStreamText,
} from '../../src/hook-policy/check-blocked-content.js';

const EMPTY_STDIN_CHUNKS: readonly Buffer[] = [];

async function* fakeStdin(): AsyncGenerator<Buffer> {
  yield Buffer.from('first ');
  yield Buffer.from('second');
}

async function* emptyStdin(): AsyncGenerator<Buffer> {
  yield* EMPTY_STDIN_CHUNKS;
}

describe('parseHookInput', () => {
  it('parses valid JSON text', () => {
    expect(unwrap(parseHookInput('{"tool_name":"Write"}'))).toStrictEqual({
      tool_name: 'Write',
    });
  });

  it('returns a helpful error for invalid JSON', () => {
    expect(unwrapErr(parseHookInput('{')).message).toContain(
      'PreToolUse hook input was not valid JSON:',
    );
  });
});

describe('findAddedBlockedContent', () => {
  it('detects a blocked pattern present in new content but absent from prior', () => {
    expect(findAddedBlockedContent('some forbidden-word here', '', ['forbidden-word'])).toBe(
      'forbidden-word',
    );
  });

  it('returns null when the blocked pattern already existed in prior content', () => {
    expect(
      findAddedBlockedContent('some forbidden-word here', 'already had forbidden-word', [
        'forbidden-word',
      ]),
    ).toBeNull();
  });

  it('returns null when no blocked pattern matches', () => {
    expect(findAddedBlockedContent('clean content', '', ['forbidden-word'])).toBeNull();
  });

  it('performs case-insensitive matching', () => {
    expect(findAddedBlockedContent('FORBIDDEN-WORD', '', ['forbidden-word'])).toBe(
      'forbidden-word',
    );
  });

  it('returns the first matching pattern when multiple match', () => {
    expect(findAddedBlockedContent('has alpha and beta', '', ['alpha', 'beta'])).toBe('alpha');
  });
});

describe('buildPreToolUseDenyResponse', () => {
  it('frames the owner-approval marker as an owner-only permission', () => {
    expect(
      buildPreToolUseDenyResponse({ kind: 'owner-marker', pattern: 'OWNER_MARKER' }),
    ).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: content contains the owner-approval marker "OWNER_MARKER". Only the project owner may author this marker.',
      },
    });
  });

  it('frames a concept block with the concept name, reappraisal direction, and citation', () => {
    const reason = buildPreToolUseDenyResponse({
      kind: 'concept',
      pattern: 'carve out',
      concept: 'expediency-hedging',
      citation: 'PDR-044; principles.md §Architectural Excellence Over Expediency',
      reappraisal:
        'Re-assess whether the design is uniform, or whether you are encoding expediency.',
    }).hookSpecificOutput.permissionDecisionReason;

    expect(reason).toContain('"carve out" is a write-time fingerprint of expediency-hedging.');
    expect(reason).toContain(
      'Re-assess whether the design is uniform, or whether you are encoding expediency.',
    );
    expect(reason).toContain('do not substitute a synonym to bypass it');
    expect(reason).toContain(
      'Citation: PDR-044; principles.md §Architectural Excellence Over Expediency.',
    );
  });

  it('does not carry the owner-only permission clause onto a doctrine concept block', () => {
    const reason = buildPreToolUseDenyResponse({
      kind: 'concept',
      pattern: 'carve out',
      concept: 'expediency-hedging',
      citation: 'PDR-044',
      reappraisal: 'Re-assess the concept.',
    }).hookSpecificOutput.permissionDecisionReason;

    expect(reason).not.toContain('Only the project owner');
  });

  it('falls back to a generic reappraisal when the concept omits one', () => {
    const reason = buildPreToolUseDenyResponse({
      kind: 'concept',
      pattern: 'carve out',
      concept: 'expediency-hedging',
      citation: 'PDR-044',
    }).hookSpecificOutput.permissionDecisionReason;

    expect(reason).toContain('reappraise');
    expect(reason).toContain('Citation: PDR-044.');
  });
});

describe('isPathInScope', () => {
  it('returns false when filePath is undefined', () => {
    expect(isPathInScope(undefined, ['.agent/'])).toBe(false);
  });

  it('matches a substring include path', () => {
    expect(isPathInScope('/repo/.agent/practice-core/PDR-x.md', ['.agent/practice-core/'])).toBe(
      true,
    );
  });

  it('matches a `**/*.suffix` include path via endsWith', () => {
    expect(isPathInScope('/repo/.agent/plans/foo.plan.md', ['**/*.plan.md'])).toBe(true);
  });

  it('returns false when no include path matches', () => {
    expect(isPathInScope('/repo/src/index.ts', ['.agent/practice-core/', '**/*.plan.md'])).toBe(
      false,
    );
  });

  it('returns false when an exclude path matches even if an include matches', () => {
    expect(
      isPathInScope('/repo/.agent/plans/foo.plan.md', ['.agent/'], ['/plans/foo.plan.md']),
    ).toBe(false);
  });
});

describe('findAddedScopedBlock', () => {
  const carveOutGroup = {
    concept: 'expediency-hedging',
    patterns: ['carve out'],
    include_paths: ['.agent/practice-core/', '**/*.plan.md'],
    exclude_paths: [],
    citation: 'PDR-044; principles.md §Architectural Excellence Over Expediency',
  };

  it('returns the group and the matched text when a pattern is added inside the include scope', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out an exception here',
        'we will not yet decide',
        '/repo/.agent/plans/foo.plan.md',
        [carveOutGroup],
      ),
    ).toStrictEqual({ group: carveOutGroup, matchedText: 'carve out' });
  });

  it('returns null when the pattern is added on a path outside the include scope', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out an exception here',
        'we will not yet decide',
        '/repo/src/index.ts',
        [carveOutGroup],
      ),
    ).toBeNull();
  });

  it('returns null when the pattern already existed in prior content (even on doctrine paths)', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out a tweak today',
        'we will carve out a tweak yesterday',
        '/repo/.agent/practice-core/foo.md',
        [carveOutGroup],
      ),
    ).toBeNull();
  });

  it('returns null when filePath is undefined', () => {
    expect(
      findAddedScopedBlock('we will carve out today', '', undefined, [carveOutGroup]),
    ).toBeNull();
  });

  it('honours exclude_paths so that doctrine-defining surfaces are not self-tripped', () => {
    const groupWithExclusion = {
      ...carveOutGroup,
      include_paths: ['.agent/'],
      exclude_paths: ['.agent/directives/principles.md'],
    };
    expect(
      findAddedScopedBlock(
        'add carve out to the trip-list',
        'old',
        '/repo/.agent/directives/principles.md',
        [groupWithExclusion],
      ),
    ).toBeNull();
  });

  it('matches a later pattern in the group, not only the first, and reports the text that fired', () => {
    const multiPatternGroup = { ...carveOutGroup, patterns: ['carve out', 'good enough'] };
    expect(
      findAddedScopedBlock('this is good enough', '', '/repo/foo.plan.md', [multiPatternGroup]),
    ).toStrictEqual({ group: multiPatternGroup, matchedText: 'good enough' });
  });

  it('checks groups in declaration order and returns the first that matches', () => {
    const second = { ...carveOutGroup, concept: 'second' };
    const result = findAddedScopedBlock('we carve out a path', '', '/repo/foo.plan.md', [
      carveOutGroup,
      second,
    ]);
    expect(result?.group.concept).toBe('expediency-hedging');
  });
});

describe('findAddedScopedBlock — regex with context-aware exclusions (WS4)', () => {
  const shaGroup = {
    concept: 'sha-in-permanent-doc',
    patterns: [String.raw`\b[a-f0-9]{7,40}\b`],
    kind: 'regex' as const,
    include_paths: ['docs/architecture/architectural-decisions/', '.agent/practice-core/'],
    exclude_paths: [],
    excludes_inline_code: true,
    excludes_lines_with: ['(historical reference)'],
    citation: 'distilled.md §Moving targets do not belong in permanent docs',
  };

  it('returns the group and the matched SHA when a 7-character hex SHA is added on a permanent-doc path', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change.',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toStrictEqual({ group: shaGroup, matchedText: 'abc1234' });
  });

  it('returns the group with the matched SHA when a 40-character SHA is added on a permanent-doc path', () => {
    const fortyCharSha = '0123456789abcdef0123456789abcdef01234567';
    expect(
      findAddedScopedBlock(
        `See commit ${fortyCharSha} for the change.`,
        'See some commit for the change.',
        '/repo/.agent/practice-core/PDR-x.md',
        [shaGroup],
      ),
    ).toStrictEqual({ group: shaGroup, matchedText: fortyCharSha });
  });

  it('detects a SHA wrapped in inline code on a prose-narrative line (cure for the WS4 over-strip bug)', () => {
    // Per PDR-053-adjacent cure: backticked SHAs in prose-narrative
    // context are intentional moving-target pointers and the rule must
    // fire. The earlier blanket inline-code strip gave a false negative
    // on this shape.
    expect(
      findAddedScopedBlock(
        'See commit `abc1234` for the change.',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toStrictEqual({ group: shaGroup, matchedText: 'abc1234' });
  });

  it('does not detect a SHA wrapped in inline code on a data-shaped line (excludes_inline_code: true)', () => {
    expect(
      findAddedScopedBlock(
        '  commit_sha: `abc1234`',
        '  commit_sha: `older000`',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA on a line containing the historical-reference marker', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change. (historical reference)',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA inside a fenced code block', () => {
    const newContent = ['Some prose introducing context.', '```', 'abc1234', '```'].join('\n');
    expect(
      findAddedScopedBlock(
        newContent,
        'Some prose introducing context.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toBeNull();
  });

  it('returns null when the SHA already existed in prior content (not a new addition)', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 — and another mention of abc1234.',
        'See commit abc1234 was the original.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaGroup],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA on out-of-scope paths', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change.',
        'See some commit for the change.',
        '/repo/src/index.ts',
        [shaGroup],
      ),
    ).toBeNull();
  });
});

describe('parseScopedContentBlocks', () => {
  it('returns an empty array when scoped_blocks is omitted', () => {
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { blocked_patterns: [] } },
      }),
    ).toStrictEqual([]);
  });

  it('parses a well-formed scoped block group', () => {
    const group = {
      concept: 'expediency-hedging',
      patterns: ['carve out'],
      include_paths: ['.agent/practice-core/'],
      citation: 'PDR-044',
    };
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { scoped_blocks: [group] } },
      }),
    ).toStrictEqual([group]);
  });

  it('accepts an optional reappraisal on a group', () => {
    const group = {
      concept: 'expediency-hedging',
      patterns: ['carve out'],
      include_paths: ['.agent/practice-core/'],
      citation: 'PDR-044',
      reappraisal: 'Re-assess the concept.',
    };
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { scoped_blocks: [group] } },
      }),
    ).toStrictEqual([group]);
  });

  it('throws when a group is missing the citation', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [{ concept: 'x', patterns: ['carve out'], include_paths: ['.agent/'] }],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when a group is missing patterns', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [{ concept: 'x', include_paths: ['.agent/'], citation: 'y' }],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when include_paths is empty', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              { concept: 'x', patterns: ['carve out'], include_paths: [], citation: 'x' },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when kind has an unsupported value', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                concept: 'x',
                patterns: ['carve out'],
                kind: 'magic',
                include_paths: ['.agent/'],
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('accepts a regex group with excludes_inline_code and excludes_lines_with', () => {
    const regexGroup = {
      concept: 'sha-in-permanent-doc',
      patterns: [String.raw`\b[a-f0-9]{7,40}\b`],
      kind: 'regex',
      include_paths: ['docs/architecture/architectural-decisions/'],
      excludes_inline_code: true,
      excludes_lines_with: ['(historical reference)'],
      citation: 'distilled.md §Moving targets do not belong in permanent docs',
    };
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { scoped_blocks: [regexGroup] } },
      }),
    ).toStrictEqual([regexGroup]);
  });

  it('throws when a regex group has an unparseable pattern', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                concept: 'x',
                patterns: ['[unclosed'],
                kind: 'regex',
                include_paths: ['docs/'],
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when excludes_inline_code is not a boolean', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                concept: 'x',
                patterns: ['x'],
                include_paths: ['docs/'],
                excludes_inline_code: 'yes',
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });
});

describe('parseBlockedContentPolicy', () => {
  it('extracts blocked content patterns from policy data', () => {
    expect(
      parseBlockedContentPolicy({
        hooks: {
          preToolUseContent: {
            blocked_patterns: ['pattern-a', 'pattern-b'],
          },
        },
      }),
    ).toStrictEqual(['pattern-a', 'pattern-b']);
  });

  it('throws when policy data has no blocked_patterns array', () => {
    expect(() => parseBlockedContentPolicy({ hooks: {} })).toThrow(
      'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
    );
  });
});

describe('readStreamText', () => {
  it('reads all text from an async iterable stream', async () => {
    await expect(readStreamText(fakeStdin())).resolves.toBe('first second');
  });

  it('returns empty string for an empty stream', async () => {
    await expect(readStreamText(emptyStdin())).resolves.toBe('');
  });
});

describe('lineIsPredominantlyCodeShaped', () => {
  it('treats prose with a backticked SHA as prose-narrative', () => {
    expect(lineIsPredominantlyCodeShaped('see commit `abc1234` for the original change')).toBe(
      false,
    );
  });

  it('treats a YAML-style data line with a backticked SHA as code-shaped', () => {
    expect(lineIsPredominantlyCodeShaped('  commit_sha: `abc1234`')).toBe(true);
  });

  it('treats a markdown table cell as code-shaped when the prose run is short', () => {
    expect(lineIsPredominantlyCodeShaped('| 2026-05-04 | `abc1234` | landed |')).toBe(true);
  });

  it('treats a sentence with multiple natural-language words as prose', () => {
    expect(
      lineIsPredominantlyCodeShaped(
        'the rule was added in commit `abc1234` to address the moving-target failure mode',
      ),
    ).toBe(false);
  });

  it('treats a JSON line as code-shaped', () => {
    expect(lineIsPredominantlyCodeShaped('"sha": "abc1234"')).toBe(true);
  });

  it('treats a list item that is mostly a code reference as code-shaped', () => {
    expect(lineIsPredominantlyCodeShaped('- `abc1234`')).toBe(true);
  });
});

describe('regex matching with prose-vs-code distinction', () => {
  const shaGroup = {
    concept: 'sha-in-permanent-doc',
    patterns: [String.raw`\b[0-9a-f]{7,40}\b`],
    kind: 'regex' as const,
    include_paths: ['**/*.md'],
    excludes_inline_code: true,
    citation: 'no moving targets in permanent docs',
  };

  it('fires the SHA matcher on prose-narrative backticked SHAs when excludes_inline_code is set', () => {
    const result = findAddedScopedBlock(
      'See commit `abc1234` for the original change to the auth flow.',
      '',
      '/workspace/x.md',
      [shaGroup],
    );

    expect(result?.group.concept).toBe('sha-in-permanent-doc');
    expect(result?.matchedText).toBe('abc1234');
  });

  it('does not fire the SHA matcher on YAML-style data lines with backticked SHAs', () => {
    expect(
      findAddedScopedBlock('  commit_sha: `abc1234`', '', '/workspace/x.md', [shaGroup]),
    ).toBeNull();
  });
});
