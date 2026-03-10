import { describe, expect, it } from 'vitest';

import { discoverSessionsWithFs, formatTimestamp } from '../src/core/runtime';

describe('runtime integration', () => {
  it('formats timestamps without milliseconds for any valid ISO value', () => {
    const timestampMs = Date.UTC(2026, 2, 10, 19, 10, 49, 123);
    expect(formatTimestamp(timestampMs)).toBe('2026-03-10 19:10:49 UTC');
  });

  it('returns no sessions when projects path is absent', () => {
    const sessions = discoverSessionsWithFs('/tmp/does-not-exist', '/repo', {
      existsSync: () => false,
      readdirSync: () => [],
      statSync: () => ({ mtimeMs: 0, size: 0, isFile: () => true, isDirectory: () => false }),
      lstatSync: () => ({ isSymbolicLink: () => false }),
      readFileSync: () => '',
    });
    expect(sessions).toEqual([]);
  });

  it('uses session directory mtime for discovered timestamp and skips unreadable entries', () => {
    const root = '/repo/root';
    const projectsRoot = '/projects';
    const sessionId = 'ba250735-a6e1-48db-9a5a-fa7bdb2daa06';
    const brokenSessionId = '9c4b0f24-4769-48ec-b8c3-c95d59f9b29e';
    const expectedTimestampMs = Date.UTC(2024, 0, 2, 3, 4, 5);
    const escapedRoot = root.replaceAll('/', '-');
    const sessionPath = `${projectsRoot}/${escapedRoot}/${sessionId}`;
    const brokenPath = `${projectsRoot}/${escapedRoot}/${brokenSessionId}`;

    const sessions = discoverSessionsWithFs(projectsRoot, root, {
      existsSync: () => true,
      readdirSync: () => [sessionId, brokenSessionId, 'not-a-session-id'],
      statSync: (pathValue) => {
        if (pathValue === brokenPath) {
          throw new Error('unreadable');
        }
        if (pathValue === sessionPath) {
          return {
            mtimeMs: expectedTimestampMs,
            size: 0,
            isFile: () => false,
            isDirectory: () => true,
          };
        }
        return { mtimeMs: 0, size: 0, isFile: () => true, isDirectory: () => false };
      },
      lstatSync: () => ({ isSymbolicLink: () => false }),
      readFileSync: () => '',
    });

    expect(sessions).toHaveLength(1);
    const [session] = sessions;
    expect(session).toBeDefined();
    if (session !== undefined) {
      expect(session.sessionId).toBe(sessionId);
      expect(session.timestampMs).toBe(expectedTimestampMs);
    }
  });
});
