import { describe, expect, it } from 'vitest';

import { runMergeBotTopic } from './agent-tools-cli-topics.js';

/**
 * The topic layer's output-channel contract for `merge-bot`: a caller-supplied
 * live stdout streams mid-run (the merge poll emits progress lines), and the
 * returned `result.stdout` is then EMPTY — the bin edge prints `result.stdout`
 * after the run (`agent-tools.ts`), so text must travel through exactly one of
 * the two channels, never both.
 */

describe('runMergeBotTopic', () => {
  it('streams through a live stdout and returns an empty result.stdout — no double print', async () => {
    let live = '';
    const result = await runMergeBotTopic(
      {
        argv: [],
        env: {},
        cwd: '/x',
        repoRoot: '/repo',
        stdout: {
          write(chunk: string): boolean {
            live += chunk;
            return true;
          },
        },
      },
      ['--help'],
    );

    expect(result.exitCode).toBe(0);
    expect(live).toContain('merge --pr');
    expect(result.stdout).toBe('');
  });

  it('buffers stdout into the result when no live stream is provided', async () => {
    const result = await runMergeBotTopic({ argv: [], env: {}, cwd: '/x', repoRoot: '/repo' }, [
      '--help',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('merge --pr');
  });
});
