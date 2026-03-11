import { execSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

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

  it('prints help for claude-agent-ops --help and -h aliases', () => {
    const longHelpOutput = execSync('pnpm tsx src/bin/claude-agent-ops.ts --help', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const shortHelpOutput = execSync('pnpm tsx src/bin/claude-agent-ops.ts -h', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(longHelpOutput).toContain('claude-agent-ops');
    expect(shortHelpOutput).toContain('claude-agent-ops');
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

  it('inspects a valid session ID outside the find time window', () => {
    const root = execSync('git rev-parse --show-toplevel', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .trim()
      .replaceAll('\\', '/');
    const escapedRoot = root.replaceAll('/', '-');
    const sessionId = 'ba250735-a6e1-48db-9a5a-fa7bdb2daa06';
    const tenHoursAgoMs = Date.now() - 10 * 60 * 60 * 1000;
    const tempDir = mkdtempSync(join(tmpdir(), 'cursor-session-smoke-'));
    const historyPath = join(tempDir, 'history.jsonl');
    const projectsRoot = join(tempDir, 'projects');
    writeFileSync(
      historyPath,
      `${JSON.stringify({
        sessionId,
        timestamp: tenHoursAgoMs,
        display: 'old explicit session',
        project: root,
      })}\n`,
      'utf8',
    );
    const output = execSync(
      `pnpm tsx src/bin/cursor-session-from-claude-session.ts inspect ${sessionId.slice(0, 8)} --last-hours 1 --history-path "${historyPath}" --projects-root "${projectsRoot}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    expect(output).toContain(`session: ${sessionId}`);
    expect(output).toContain(`path: ${join(projectsRoot, escapedRoot, sessionId)}`);
  });

  it('keeps find filtering tied to explicit needles only', () => {
    const root = execSync('git rev-parse --show-toplevel', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .trim()
      .replaceAll('\\', '/');
    const sessionId = '37f6d8f2-b79b-4f62-97ca-19fa4f7ba01b';
    const nowMs = Date.now();
    const tempDir = mkdtempSync(join(tmpdir(), 'cursor-session-find-'));
    const historyPath = join(tempDir, 'history.jsonl');
    const projectsRoot = join(tempDir, 'projects');
    writeFileSync(
      historyPath,
      `${JSON.stringify({
        sessionId,
        timestamp: nowMs - 1_000,
        display: 'edited README.md',
        project: root,
      })}\n`,
      'utf8',
    );

    const noNeedleOutput = execSync(
      `pnpm tsx src/bin/cursor-session-from-claude-session.ts find --last-hours 1 --history-path "${historyPath}" --projects-root "${projectsRoot}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    expect(noNeedleOutput).toContain(sessionId);

    const withNeedleOutput = execSync(
      `pnpm tsx src/bin/cursor-session-from-claude-session.ts find --file "does/not/exist.ts" --last-hours 1 --history-path "${historyPath}" --projects-root "${projectsRoot}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    expect(withNeedleOutput).toContain('No matching Claude sessions found.');

    const matchingNeedleOutput = execSync(
      `pnpm tsx src/bin/cursor-session-from-claude-session.ts find --file "README.md" --last-hours 1 --history-path "${historyPath}" --projects-root "${projectsRoot}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    expect(matchingNeedleOutput).toContain(sessionId);
  });
});
