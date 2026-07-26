import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractBashCommand,
  findBlockedPattern,
  parseBlockedPatternPolicy,
  parseHookInput,
} from './check-blocked-patterns.js';

describe('findBlockedPattern', () => {
  it('matches dangerous git flags even when arguments appear between tokens', () => {
    const blockedPatterns = ['git push --force', 'git reset --hard'];

    expect(findBlockedPattern('git push origin HEAD --force', blockedPatterns)).toStrictEqual({
      pattern: 'git push --force',
    });
    expect(findBlockedPattern('git reset HEAD~1 --hard', blockedPatterns)).toStrictEqual({
      pattern: 'git reset --hard',
    });
  });

  it('returns null when no blocked pattern matches', () => {
    expect(findBlockedPattern('pnpm lint', ['git push --force'])).toBeNull();
  });

  it('matches substring-mode patterns inside quoted arguments (the 2026-06-11 founding DOS shape)', () => {
    const blockedPatterns = [
      { pattern: 'for(;;)', match: 'substring' as const },
      { pattern: 'while(1)', match: 'substring' as const },
    ];

    expect(
      findBlockedPattern('node -e "for(;;){Math.sqrt(Math.random())}"', blockedPatterns),
    ).toStrictEqual({ pattern: 'for(;;)', match: 'substring' });
    expect(findBlockedPattern("node -e 'while(1){}' &", blockedPatterns)).toStrictEqual({
      pattern: 'while(1)',
      match: 'substring',
    });
  });

  it('substring-mode matching tolerates whitespace inside the shape (spaced busy-loops)', () => {
    const blockedPatterns = [
      { pattern: 'for(;;)', match: 'substring' as const },
      { pattern: 'while(1)', match: 'substring' as const },
    ];

    expect(findBlockedPattern('node -e "for (;;) {}"', blockedPatterns)).toStrictEqual({
      pattern: 'for(;;)',
      match: 'substring',
    });
    expect(findBlockedPattern('node -e "while ( 1 ) {}"', blockedPatterns)).toStrictEqual({
      pattern: 'while(1)',
      match: 'substring',
    });
  });

  it('substring-mode matches a load tool however it is pathed', () => {
    const blockedPatterns = [{ pattern: 'stress-ng', match: 'substring' as const }];

    expect(findBlockedPattern('./tools/stress-ng --cpu 8', blockedPatterns)).toStrictEqual({
      pattern: 'stress-ng',
      match: 'substring',
    });
  });

  it('substring-mode matching is case-insensitive and leaves benign commands alone', () => {
    const blockedPatterns = [{ pattern: 'for(;;)', match: 'substring' as const }];

    expect(findBlockedPattern('node -e "FOR(;;){}"', blockedPatterns)).toStrictEqual({
      pattern: 'for(;;)',
      match: 'substring',
    });
    expect(findBlockedPattern('node -e "console.log(1)"', blockedPatterns)).toBeNull();
    expect(findBlockedPattern('for i in 1 2 3; do echo $i; done', blockedPatterns)).toBeNull();
  });

  it('regex-mode matches the pattern against the raw command, boundary-aware', () => {
    const ripgrepReplace = {
      pattern: String.raw`(?:^|[^\w-])rg\s+(?:-\S+\s+)*-r`,
      match: 'regex' as const,
    };

    // The shapes the fingerprint exists to catch: clustered replace-flag
    // first, bare short-replace, a later clustered flag, and the pathed,
    // piped, and quoted invocation forms.
    expect(findBlockedPattern('rg -riln "pattern" .agent/', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
    expect(findBlockedPattern('rg -r il "pattern" docs/', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
    expect(findBlockedPattern('rg -i -rn "pattern" docs/', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
    expect(findBlockedPattern('cat file | rg -r foo', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
    expect(findBlockedPattern('sh -c "rg -riln pattern ."', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
    expect(findBlockedPattern('./tools/rg -r foo docs/', [ripgrepReplace])).toStrictEqual(
      ripgrepReplace,
    );
  });

  it('regex-mode does not fire on unrelated tokens that a whitespace-stripped substring would hit', () => {
    const ripgrepReplace = {
      pattern: String.raw`(?:^|[^\w-])rg\s+(?:-\S+\s+)*-r`,
      match: 'regex' as const,
    };

    // The founding false-positive class (PR #304 Bugbot): a token merely
    // ENDING in "rg" followed by a -r flag is not a ripgrep invocation.
    expect(findBlockedPattern('xorg -restart config', [ripgrepReplace])).toBeNull();
    expect(findBlockedPattern('pnpm --filter org -r build', [ripgrepReplace])).toBeNull();
    // The taught safe forms stay allowed: separated flags; the explicit long form.
    expect(findBlockedPattern('rg -i -l -n "pattern" docs/', [ripgrepReplace])).toBeNull();
    expect(findBlockedPattern('rg --replace=X "pattern" docs/', [ripgrepReplace])).toBeNull();
  });

  it('regex-mode fails open on an invalid pattern instead of bricking the guard', () => {
    const invalidRegex = { pattern: '(unclosed', match: 'regex' as const };

    expect(findBlockedPattern('rg -riln "pattern" .agent/', [invalidRegex])).toBeNull();
  });

  it('limits guardrail-bypass flags to git commands when the policy requires git', () => {
    expect(findBlockedPattern('git commit --no-verify', ['git --no-verify'])).toStrictEqual({
      pattern: 'git --no-verify',
    });
    expect(findBlockedPattern('pnpm publish --no-verify', ['git --no-verify'])).toBeNull();
  });

  it('carries the citation through when the entry is an object', () => {
    expect(
      findBlockedPattern('git add .', [
        { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
      ]),
    ).toStrictEqual({
      pattern: 'git add .',
      citation: 'distilled.md §Stage by explicit pathspec',
    });
  });

  it('does not match `git add .` against explicit-pathspec staging', () => {
    const wildcardPattern = 'git add .';
    expect(findBlockedPattern('git add packages/core/foo.ts', [wildcardPattern])).toBeNull();
    expect(findBlockedPattern('git add ./packages/core/foo.ts', [wildcardPattern])).toBeNull();
    expect(findBlockedPattern('git add .gitignore', [wildcardPattern])).toBeNull();
  });
});

describe('extractBashCommand', () => {
  it('returns the Bash command from Claude hook input', () => {
    const hookInput = {
      tool_name: 'Bash',
      tool_input: {
        command: 'git commit --no-verify',
      },
    };

    expect(extractBashCommand(hookInput)).toBe('git commit --no-verify');
  });

  it('accepts command-bearing input from runners that flatten the payload', () => {
    const hookInput = {
      command: 'git push origin HEAD --force',
    };

    expect(extractBashCommand(hookInput)).toBe('git push origin HEAD --force');
  });

  it('throws when the hook input does not contain a Bash command', () => {
    const hookInput = {
      tool_name: 'Bash',
      tool_input: {},
    };

    expect(() => extractBashCommand(hookInput)).toThrow(
      'Claude PreToolUse hook input did not include a Bash command.',
    );
  });
});

describe('parseHookInput', () => {
  it('returns a helpful error for invalid JSON', () => {
    expect(unwrapErr(parseHookInput('{')).message).toContain(
      'PreToolUse hook input was not valid JSON:',
    );
  });
});

describe('parseBlockedPatternPolicy', () => {
  it('extracts blocked command patterns from policy data', () => {
    expect(
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: ['git push --force', 'git --no-verify'],
          },
        },
      }),
    ).toStrictEqual(['git push --force', 'git --no-verify']);
  });

  it('accepts entries that pair a pattern with a doctrinal citation', () => {
    expect(
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [
              'git push --force',
              { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
            ],
          },
        },
      }),
    ).toStrictEqual([
      'git push --force',
      { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
    ]);
  });

  it('throws when an object entry omits the pattern field', () => {
    expect(() =>
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [{ citation: 'orphan citation' }],
          },
        },
      }),
    ).toThrow('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  });

  it('throws when an object entry has a non-string citation', () => {
    expect(() =>
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [{ pattern: 'git add .', citation: 42 }],
          },
        },
      }),
    ).toThrow('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  });

  it('throws when policy data has no blocked_patterns array', () => {
    expect(() => parseBlockedPatternPolicy({ hooks: {} })).toThrow(
      'The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.',
    );
  });

  it('degrades an unknown match kind to the default mode instead of failing the guard closed', () => {
    // A policy newer than the built dist must not brick every Bash command
    // (lived instance 2026-07-06: a stale-dist guard met a policy naming a
    // then-unknown match kind and denied everything, including the rebuild).
    const parsed = parseBlockedPatternPolicy({
      hooks: {
        preToolUse: {
          blocked_patterns: [{ pattern: 'rg -r', match: 'some-future-mode' }],
        },
      },
    });

    expect(parsed).toStrictEqual([{ pattern: 'rg -r', match: undefined }]);
  });
});

describe('buildPreToolUseDenyResponse', () => {
  it('returns the structured deny payload Claude expects', () => {
    expect(buildPreToolUseDenyResponse({ pattern: 'git push --force' })).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: matched dangerous pattern "git push --force".',
      },
    });
  });

  it('appends the doctrinal citation to the reason when present', () => {
    expect(
      buildPreToolUseDenyResponse({
        pattern: 'git add .',
        citation: 'distilled.md §Stage by explicit pathspec',
      }),
    ).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: matched dangerous pattern "git add .". Citation: distilled.md §Stage by explicit pathspec.',
      },
    });
  });

  it('frames the block as a concept to reappraise when the entry carries a concept', () => {
    const response = buildPreToolUseDenyResponse({
      pattern: 'git reset --hard',
      concept: 'history-destruction',
      reappraisal:
        'Preserve in-flight work; never use git to remove work — make forward-going filesystem changes instead.',
      citation: '.agent/rules/never-use-git-to-remove-work.md',
    });

    expect(response.hookSpecificOutput.permissionDecision).toBe('deny');
    const reason = response.hookSpecificOutput.permissionDecisionReason;
    // The reason must TEACH, not only refuse: name the pattern and its concept,
    // carry the positive reappraisal direction and the citation, and steer the
    // agent away from swapping in a sibling destructive command.
    expect(reason).toContain('git reset --hard');
    expect(reason).toContain('history-destruction');
    expect(reason).toContain('never use git to remove work');
    expect(reason).toContain('not a command to swap for a sibling');
    expect(reason).toContain('Citation: .agent/rules/never-use-git-to-remove-work.md');
  });

  it('falls back to a default reappraisal when a concept entry omits its own', () => {
    const reason = buildPreToolUseDenyResponse({
      pattern: 'git clean -fd',
      concept: 'worktree-destruction',
    }).hookSpecificOutput.permissionDecisionReason;

    expect(reason).toContain('worktree-destruction');
    expect(reason).toContain('Step back and reappraise');
  });
});
