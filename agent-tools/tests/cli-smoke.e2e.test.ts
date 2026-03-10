import { execSync, spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

describe('CLI smoke', () => {
  it('prints help for claude-agent-ops', () => {
    const output = execSync('pnpm tsx src/bin/claude-agent-ops.ts help', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(output).toContain('claude-agent-ops');
  });

  it('prints usage for cursor-session-from-claude-session', () => {
    const output = execSync(
      'pnpm tsx src/bin/cursor-session-from-claude-session.ts find --last-hours 1',
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    expect(
      output.includes('No matching Claude sessions found.') || output.includes('- session:'),
    ).toBe(true);
  });

  it('fails diff for an invalid agent id', () => {
    const result = spawnSync('pnpm', ['tsx', 'src/bin/claude-agent-ops.ts', 'diff', '../bad'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('No worktree found for agent: ../bad');
  });
});
