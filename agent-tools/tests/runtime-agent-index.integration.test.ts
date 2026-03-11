import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { listAgentShortIds, resolveAgentJsonlPath } from '../src/core/runtime-agent-index';

const tempHomes: string[] = [];

function createTempHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'agent-tools-home-'));
  tempHomes.push(home);
  return home;
}

function createSubagentJsonl(
  home: string,
  root: string,
  sessionId: string,
  fileName: string,
): string {
  const escapedRoot = root.replaceAll('/', '-');
  const subagentsDir = join(home, '.claude', 'projects', escapedRoot, sessionId, 'subagents');
  mkdirSync(subagentsDir, { recursive: true });
  const pathValue = join(subagentsDir, fileName);
  writeFileSync(pathValue, '{"message":{"stop_reason":"end_turn","content":[]}}\n', 'utf8');
  return pathValue;
}

afterEach(() => {
  for (const home of tempHomes) {
    rmSync(home, { recursive: true, force: true });
  }
  tempHomes.length = 0;
});

describe('runtime agent index', () => {
  it('resolves unique short id to jsonl path', () => {
    const home = createTempHome();
    const root = '/repo/root';
    const sessionId = '11111111-1111-1111-1111-111111111111';
    const expected = createSubagentJsonl(home, root, sessionId, 'agent-abcdef1234567890.jsonl');

    const resolved = resolveAgentJsonlPath(root, 'abcdef12', home);

    expect(resolved).toBe(expected);
  });

  it('returns null when projects path does not exist', () => {
    const home = createTempHome();
    const resolved = resolveAgentJsonlPath('/repo/root', 'abcdef12', home);
    expect(resolved).toBeNull();
  });

  it('returns null when no session file matches the short id', () => {
    const home = createTempHome();
    const root = '/repo/root';
    createSubagentJsonl(
      home,
      root,
      '11111111-1111-1111-1111-111111111111',
      'agent-12345678abcdef00.jsonl',
    );

    const resolved = resolveAgentJsonlPath(root, 'abcdef12', home);
    expect(resolved).toBeNull();
  });

  it('throws when short id is ambiguous across multiple sessions', () => {
    const home = createTempHome();
    const root = '/repo/root';
    createSubagentJsonl(
      home,
      root,
      '11111111-1111-1111-1111-111111111111',
      'agent-abcdef12aaaa0000.jsonl',
    );
    createSubagentJsonl(
      home,
      root,
      '22222222-2222-2222-2222-222222222222',
      'agent-abcdef12bbbb0000.jsonl',
    );

    expect(() => resolveAgentJsonlPath(root, 'abcdef12', home)).toThrow(/ambiguous/);
  });

  it('lists short ids from session subagent files', () => {
    const home = createTempHome();
    const root = '/repo/root';
    createSubagentJsonl(
      home,
      root,
      '11111111-1111-1111-1111-111111111111',
      'agent-12345678abcdef00.jsonl',
    );

    const listed = listAgentShortIds(root, home);

    expect(listed).toContain('12345678');
  });
});
