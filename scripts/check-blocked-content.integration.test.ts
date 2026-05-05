import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  loadScopedContentBlocks,
  runPreToolUseContentGuard,
} from './check-blocked-content.js';

async function* stdinFromJson(payload: unknown): AsyncGenerator<Buffer> {
  yield Buffer.from(JSON.stringify(payload));
}

async function* stdinFromText(text: string): AsyncGenerator<Buffer> {
  yield Buffer.from(text);
}

describe('runPreToolUseContentGuard', () => {
  it('writes a deny payload when new content introduces a blocked pattern', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'code with secret-marker added',
          old_string: 'original code without marker',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['secret-marker'],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    expect(JSON.parse(stdoutChunks.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse('secret-marker'),
    );
  });

  it('produces no output when the pattern already existed in prior content', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'code with existing-marker still',
          old_string: 'code with existing-marker here',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['existing-marker'],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks).toStrictEqual([]);
  });

  it('uses an injected prior-content reader for Write payloads', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          content: 'code with existing-marker still',
          file_path: '/repo/src/example.ts',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['existing-marker'],
      readPriorContent: () => 'code with existing-marker already',
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks).toStrictEqual([]);
  });

  it('returns exitCode 2 and writes to stderr on error', async () => {
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromText('not valid json {{{'),
      stdout: { write: () => {} },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['irrelevant'],
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderrChunks.length).toBe(1);
    expect(stderrChunks[0]).toContain('Claude PreToolUse hook input was not valid JSON:');
  });

  it('writes a scoped-block deny payload when hedging vocabulary is added on a doctrine path', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'we will carve out an allowance for this case',
          old_string: 'we will not yet decide',
          file_path: '/repo/.agent/plans/example.plan.md',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: [],
      scopedBlocks: [
        {
          pattern: 'carve out',
          include_paths: ['**/*.plan.md'],
          citation: 'PDR-044; principles.md §Architectural Excellence Over Expediency',
        },
      ],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    expect(JSON.parse(stdoutChunks.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse(
        'carve out',
        'PDR-044; principles.md §Architectural Excellence Over Expediency',
      ),
    );
  });

  it('does not deny scoped-block hedging vocabulary on out-of-scope paths', async () => {
    const stdoutChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'we will carve out an allowance for this case',
          old_string: 'we will not yet decide',
          file_path: '/repo/src/index.ts',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: { write: () => {} },
      blockedPatterns: [],
      scopedBlocks: [
        {
          pattern: 'carve out',
          include_paths: ['**/*.plan.md', '.agent/practice-core/'],
          citation: 'PDR-044',
        },
      ],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
  });
});

describe('canonical policy: hedging-vocabulary trip-list (WS3)', () => {
  const expectedCitation = 'PDR-044; principles.md §Architectural Excellence Over Expediency';

  it('the canonical policy registers a hedging-vocabulary trip-list scoped to doctrine surfaces', async () => {
    const blocks = await loadScopedContentBlocks();
    const literalBlocks = blocks.filter((block) => (block.kind ?? 'literal') === 'literal');

    const patterns = literalBlocks.map((block) => block.pattern);
    expect(patterns).toEqual(
      expect.arrayContaining([
        'carve out',
        'carve-out',
        'carve around',
        'an exception to',
        'with the exception of',
        'for these arcs',
        'honest framing for',
        'permitted variant',
        'land it then iterate',
        'cheap cure',
        'good enough',
        'quick fix',
      ]),
    );

    for (const block of literalBlocks) {
      expect(block.citation).toBe(expectedCitation);
      expect(block.include_paths.length).toBeGreaterThan(0);
    }
  });
});

describe('canonical policy: SHA-in-permanent-doc regex (WS4)', () => {
  it('registers a regex scoped block detecting 7- to 40-char hex with code-block and historical-reference exclusions', async () => {
    const blocks = await loadScopedContentBlocks();
    const regexBlocks = blocks.filter((block) => block.kind === 'regex');

    expect(regexBlocks.length).toBeGreaterThanOrEqual(1);
    const shaBlock = regexBlocks.find((block) => /\[0-9a-f\]/u.test(block.pattern));
    expect(shaBlock).toBeDefined();
    expect(shaBlock?.excludes_inline_code).toBe(true);
    expect(shaBlock?.excludes_lines_with).toEqual(
      expect.arrayContaining(['(historical reference)']),
    );
    expect(shaBlock?.include_paths).toEqual(
      expect.arrayContaining([
        'docs/architecture/architectural-decisions/',
        '.agent/practice-core/',
      ]),
    );
    expect(shaBlock?.citation).toContain('Moving targets');
  });

  it('the wired-up guard denies a SHA added on a permanent-doc path and surfaces the citation', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'See commit abc1234 for context.',
          old_string: 'See an unspecified commit for context.',
          file_path: '/repo/docs/architecture/architectural-decisions/ADR-200-example.md',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: [],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    const denyPayload = JSON.parse(stdoutChunks.join(''));
    expect(denyPayload.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(denyPayload.hookSpecificOutput.permissionDecisionReason).toContain('Citation:');
    expect(denyPayload.hookSpecificOutput.permissionDecisionReason).toContain('Moving targets');
  });

  it('the wired-up guard does NOT deny an all-decimal token on a permanent-doc path (no a-f hex char)', async () => {
    const stdoutChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'The metric reading was 1765098000000 last quarter.',
          old_string: 'The metric reading was unspecified last quarter.',
          file_path: '/repo/docs/architecture/architectural-decisions/ADR-200-example.md',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: { write: () => {} },
      blockedPatterns: [],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
  });

  it('the wired-up guard does NOT deny a SHA wrapped in inline code on a permanent-doc path', async () => {
    const stdoutChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        tool_input: {
          new_string: 'See commit `abc1234` for context.',
          old_string: 'See an unspecified commit for context.',
          file_path: '/repo/docs/architecture/architectural-decisions/ADR-200-example.md',
        },
      }),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: { write: () => {} },
      blockedPatterns: [],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
  });
});
