import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { listAgentShortIds, resolveAgentJsonlPath } from './runtime-agent-index.js';
import { escapedRepoPath } from './runtime-paths.js';
import {
  inMemorySyncFileSystem,
  type InMemoryTree,
} from './test-helpers/in-memory-sync-file-system.js';

const HOME = join('/', 'home', 'seat');
const ROOT = join('/', 'repo', 'root');
const SESSION_A = '11111111-1111-1111-1111-111111111111';
const SESSION_B = '22222222-2222-2222-2222-222222222222';

/** The projects directory the harness keeps for `ROOT` under `HOME`. */
const PROJECTS = join(HOME, '.claude', 'projects', escapedRepoPath(ROOT));

/** The subagents directory of one session. */
function subagentsDir(sessionId: string): string {
  return join(PROJECTS, sessionId, 'subagents');
}

/** A home holding the given subagent files per session, as empty files. */
function homeWithSessions(files: Readonly<Record<string, readonly string[]>>): InMemoryTree {
  const entries: Record<string, string> = {};
  for (const [sessionId, names] of Object.entries(files)) {
    for (const name of names) {
      entries[join(subagentsDir(sessionId), name)] = '';
    }
  }
  return { directories: [PROJECTS], files: entries };
}

describe('resolveAgentJsonlPath', () => {
  it('resolves a unique short id to its jsonl path', () => {
    const fs = inMemorySyncFileSystem(
      homeWithSessions({ [SESSION_A]: ['agent-abcdef1234567890.jsonl'] }),
    );

    expect(resolveAgentJsonlPath(ROOT, 'abcdef12', HOME, fs)).toBe(
      join(subagentsDir(SESSION_A), 'agent-abcdef1234567890.jsonl'),
    );
  });

  it('returns null when the projects directory does not exist', () => {
    expect(resolveAgentJsonlPath(ROOT, 'abcdef12', HOME, inMemorySyncFileSystem({}))).toBeNull();
  });

  it('returns null when no session file matches the short id', () => {
    const fs = inMemorySyncFileSystem(
      homeWithSessions({ [SESSION_A]: ['agent-12345678abcdef00.jsonl'] }),
    );

    expect(resolveAgentJsonlPath(ROOT, 'abcdef12', HOME, fs)).toBeNull();
  });

  it('throws when the short id is ambiguous across sessions', () => {
    const fs = inMemorySyncFileSystem(
      homeWithSessions({
        [SESSION_A]: ['agent-abcdef12aaaa0000.jsonl'],
        [SESSION_B]: ['agent-abcdef12bbbb0000.jsonl'],
      }),
    );

    expect(() => resolveAgentJsonlPath(ROOT, 'abcdef12', HOME, fs)).toThrow(/ambiguous/);
  });

  it('ignores compaction agents and files that are not jsonl', () => {
    const fs = inMemorySyncFileSystem(
      homeWithSessions({
        [SESSION_A]: ['agent-abcdef12-compact.jsonl', 'agent-abcdef12aaaa0000.meta.json'],
      }),
    );

    expect(resolveAgentJsonlPath(ROOT, 'abcdef12', HOME, fs)).toBeNull();
  });
});

describe('listAgentShortIds', () => {
  it('lists the short ids of every session subagent file, sorted', () => {
    const fs = inMemorySyncFileSystem(
      homeWithSessions({
        [SESSION_A]: ['agent-ffffffffabcdef00.jsonl'],
        [SESSION_B]: ['agent-12345678abcdef00.jsonl'],
      }),
    );

    expect(listAgentShortIds(ROOT, HOME, fs)).toEqual(['12345678', 'ffffffff']);
  });

  it('includes the agent worktrees of the checkout', () => {
    const worktrees = join(ROOT, '.claude', 'worktrees');
    const fs = inMemorySyncFileSystem({
      directories: [join(worktrees, 'agent-c0ffee00'), join(worktrees, 'main')],
    });

    expect(listAgentShortIds(ROOT, HOME, fs)).toEqual(['c0ffee00']);
  });
});
