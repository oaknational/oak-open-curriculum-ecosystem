import { describe, expect, it } from 'vitest';

import { snapshotEnvironment } from './environment.js';

const TRANSPORT_VARIABLES = [
  'CLAUDE_CODE_MESSAGING_TOKEN',
  'CLAUDE_CODE_MESSAGING_SOCKET',
  'CLAUDE_CODE_SSE_PORT',
];

describe('snapshotEnvironment', () => {
  it('records allowlisted identifiers, withholds other values by name, and ignores other namespaces', () => {
    const snapshot = snapshotEnvironment({
      CLAUDE_PROJECT_DIR: '/work/project',
      CLAUDE_CODE_SESSION_ID: 'session-1',
      PRACTICE_AGENT_SESSION_ID_CLAUDE: 'seed-1',
      CLAUDE_CODE_SOMETHING_NEW: 'unreviewed value',
      PRACTICE_OTHER_SETTING: 'unreviewed value',
      PATH: '/usr/bin',
      CLAUDECODE: '1',
    });

    expect(snapshot).toStrictEqual({
      recorded: {
        CLAUDE_CODE_SESSION_ID: 'session-1',
        CLAUDE_PROJECT_DIR: '/work/project',
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'seed-1',
      },
      withheld: ['CLAUDE_CODE_SOMETHING_NEW', 'PRACTICE_OTHER_SETTING'],
    });
  });

  it('records the session-shape flags with their values, because the value is the finding', () => {
    const flags = {
      CLAUDE_CODE_CHILD_SESSION: '1',
      CLAUDE_CODE_SESSION_ATTENDED: '0',
      CLAUDE_CODE_ENTRYPOINT: 'cli',
      CLAUDE_EFFORT: 'high',
      CLAUDE_PID: '4242',
    };

    expect(snapshotEnvironment(flags)).toStrictEqual({ recorded: flags, withheld: [] });
  });

  it.each(TRANSPORT_VARIABLES)('never records %s, neither its name nor its value', (name) => {
    const sentinel = 'sentinel-7f3a9c-must-not-be-recorded';

    const serialised = JSON.stringify(
      snapshotEnvironment({ CLAUDE_CODE_SESSION_ID: 'session-1', [name]: sentinel }),
    );

    expect(serialised).not.toContain(sentinel);
    expect(serialised).not.toContain(name);
  });

  it('serialises in UTF-16 code-unit name order, whatever the listing order or the locale', () => {
    const snapshot = snapshotEnvironment({
      PRACTICE_OTHER_SETTING: 'x',
      PRACTICE_AGENT_SESSION_ID_CLAUDE: 'seed-1',
      CLAUDE_PROJECT_DIR: '/work/project',
      CLAUDE_CODE_FOO: 'x',
      CLAUDE_CODE_SESSION_ID: 'session-1',
      CLAUDE_CODEX_FOO: 'x',
    });

    // Code-unit order puts CLAUDE_CODEX_FOO first ('X' is below '_'); locale order would not.
    expect(JSON.stringify(snapshot)).toBe(
      JSON.stringify({
        recorded: {
          CLAUDE_CODE_SESSION_ID: 'session-1',
          CLAUDE_PROJECT_DIR: '/work/project',
          PRACTICE_AGENT_SESSION_ID_CLAUDE: 'seed-1',
        },
        withheld: ['CLAUDE_CODEX_FOO', 'CLAUDE_CODE_FOO', 'PRACTICE_OTHER_SETTING'],
      }),
    );
  });

  it('treats a variable with no value as unset, neither recorded nor withheld', () => {
    const snapshot = snapshotEnvironment({
      CLAUDE_EFFORT: undefined,
      CLAUDE_CODE_SOMETHING_NEW: undefined,
    });

    expect(snapshot).toStrictEqual({ recorded: {}, withheld: [] });
  });
});
