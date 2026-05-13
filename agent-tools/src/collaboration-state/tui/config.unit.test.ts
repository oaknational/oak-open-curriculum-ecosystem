import { describe, expect, it } from 'vitest';

import { parseOptions } from '../cli-options.js';
import { collaborationTuiConfig } from './config.js';

describe('collaborationTuiConfig', () => {
  it('derives sensible collaboration-state defaults from the repo root', () => {
    const config = collaborationTuiConfig(parseOptions(['tui', '--repo-root', '/workspace']), {
      cwd: '/elsewhere',
    });

    expect(config).toEqual({
      activePath: '/workspace/.agent/state/collaboration/active-claims.json',
      closedPath: '/workspace/.agent/state/collaboration/closed-claims.archive.json',
      commsDir: '/workspace/.agent/state/collaboration/comms',
      pollMs: 500,
    });
  });

  it('keeps explicit state paths, refresh interval, and clock value when provided', () => {
    const config = collaborationTuiConfig(
      parseOptions([
        'tui',
        '--repo-root',
        '/workspace',
        '--active',
        '/state/active.json',
        '--closed',
        '/state/closed.json',
        '--comms-dir',
        '/state/comms',
        '--poll-ms',
        '250',
        '--now',
        '2026-05-13T17:50:00Z',
      ]),
      { cwd: '/elsewhere' },
    );

    expect(config).toEqual({
      activePath: '/state/active.json',
      closedPath: '/state/closed.json',
      commsDir: '/state/comms',
      pollMs: 250,
      nowIso: '2026-05-13T17:50:00Z',
    });
  });
});
