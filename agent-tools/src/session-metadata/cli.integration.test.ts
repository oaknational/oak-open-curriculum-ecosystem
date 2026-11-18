import { describe, expect, it } from 'vitest';

import { runSessionMetadataCli, type SessionMetadataCliInput } from './cli.js';
import type { SessionMetadataFileSystem } from './file-system.js';
import { SESSION_METADATA_HELP_TEXT } from './cli-options.js';

function transcript(usedInput: number, cacheCreation: number, cacheRead: number): string {
  return [
    JSON.stringify({ type: 'user', message: { role: 'user' } }),
    JSON.stringify({
      type: 'assistant',
      message: {
        usage: {
          input_tokens: usedInput,
          cache_creation_input_tokens: cacheCreation,
          cache_read_input_tokens: cacheRead,
          output_tokens: 1234,
        },
      },
    }),
  ].join('\n');
}

function fakeFs(content: string | Error): SessionMetadataFileSystem & { readonly calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    readFileUtf8: async (absolutePath) => {
      calls.push(absolutePath);
      if (content instanceof Error) {
        throw content;
      }
      return content;
    },
  };
}

const baseInput = (
  argv: readonly string[],
  fs: SessionMetadataFileSystem,
): SessionMetadataCliInput => ({
  argv,
  cwd: '/ws/code/oak.repo',
  env: { HOME: '/h' },
  fs,
});

describe('runSessionMetadataCli', () => {
  it('renders text output for a valid session, reading the derived transcript path', async () => {
    const fs = fakeFs(transcript(300_000, 50_000, 22_025));
    const result = await runSessionMetadataCli(
      baseInput(
        ['--vendor', 'claude', '--model', 'claude-opus-4-8[1m]', '--session-id', 'sess-1'],
        fs,
      ),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      [
        'session    sess-1',
        'vendor     claude',
        'model      claude-opus-4-8[1m]',
        'context    372025 / 1000000 tokens (37.2% used, 62.8% remaining)',
        'zone       healthy',
        'advice     full capacity; carry on; directive edits wait for the next compaction',
        '',
      ].join('\n'),
    );
    expect(fs.calls).toStrictEqual(['/h/.claude/projects/-ws-code-oak-repo/sess-1.jsonl']);
  });

  it('renders JSON output with a fixed shape under --json', async () => {
    const fs = fakeFs(transcript(300_000, 50_000, 22_025));
    const result = await runSessionMetadataCli(
      baseInput(
        [
          '--vendor',
          'claude',
          '--model',
          'claude-opus-4-8[1m]',
          '--session-id',
          'sess-1',
          '--json',
        ],
        fs,
      ),
    );

    const expected = {
      vendor: 'claude',
      model: 'claude-opus-4-8[1m]',
      sessionId: 'sess-1',
      windowTokens: 1_000_000,
      usedTokens: 372_025,
      remainingTokens: 627_975,
      pctUsed: 37.2,
      pctRemaining: 62.8,
      zone: 'healthy',
      advice: 'full capacity; carry on; directive edits wait for the next compaction',
    };
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toStrictEqual(expected);
    // Pin the bytes too (2-space indent, trailing newline, fixed key order).
    expect(result.stdout).toBe(`${JSON.stringify(expected, null, 2)}\n`);
  });

  it('prints help without touching the filesystem', async () => {
    const fs = fakeFs(new Error('should not be read'));
    const result = await runSessionMetadataCli(baseInput(['--help'], fs));

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(`${SESSION_METADATA_HELP_TEXT}\n`);
    expect(fs.calls).toStrictEqual([]);
  });

  it('exits 2 when a required option is missing', async () => {
    const fs = fakeFs(transcript(1, 0, 0));
    const result = await runSessionMetadataCli(baseInput([], fs));

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr.startsWith('--vendor is required')).toBe(true);
  });

  it('exits 2 for an unknown model', async () => {
    const fs = fakeFs(transcript(1, 0, 0));
    const result = await runSessionMetadataCli(
      baseInput(['--vendor', 'claude', '--model', 'made-up', '--session-id', 'sess-1'], fs),
    );

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toBe('unknown model: made-up (no window size registered)\n');
  });

  it('exits 2 for an unsupported vendor', async () => {
    const fs = fakeFs(transcript(1, 0, 0));
    const result = await runSessionMetadataCli(
      baseInput(['--vendor', 'codex', '--model', 'claude-opus-4-8', '--session-id', 'sess-1'], fs),
    );

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toBe('unsupported vendor: codex (supported: claude)\n');
  });

  it('exits 2 when the transcript cannot be read', async () => {
    const fs = fakeFs(new Error('ENOENT'));
    const result = await runSessionMetadataCli(
      baseInput(['--vendor', 'claude', '--model', 'claude-opus-4-8', '--session-id', 'sess-1'], fs),
    );

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('failed to read transcript');
    expect(result.stderr).toContain('ENOENT');
  });

  it('exits 2 when HOME is not set, before any filesystem read', async () => {
    const fs = fakeFs(transcript(1, 0, 0));
    const result = await runSessionMetadataCli({
      argv: ['--vendor', 'claude', '--model', 'claude-opus-4-8', '--session-id', 'sess-1'],
      cwd: '/ws/code/oak.repo',
      env: {},
      fs,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toBe('HOME environment variable is not set\n');
    expect(fs.calls).toStrictEqual([]);
  });

  it('exits 2 when the transcript carries no usage', async () => {
    const fs = fakeFs(JSON.stringify({ type: 'user', message: { role: 'user' } }));
    const result = await runSessionMetadataCli(
      baseInput(['--vendor', 'claude', '--model', 'claude-opus-4-8', '--session-id', 'sess-1'], fs),
    );

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('no context usage found in transcript');
  });
});
