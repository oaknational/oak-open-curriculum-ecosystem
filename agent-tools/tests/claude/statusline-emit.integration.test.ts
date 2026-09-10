import { emitStatusline, type EmitDeps } from '../../src/claude/statusline-emit';

/**
 * Constant success deps, branch-free; failure tests override the single
 * member they break (testing-strategy branch-free fake rule; ADR-078).
 * These tests pin the COMPOSITION contracts the pure helpers cannot:
 * append-before-planning, and the invalid-config warning preceding every
 * outcome — noop, render, and render-throw alike.
 */
function fakeDeps(): {
  deps: EmitDeps;
  appended: { path: string; payload: string; nowIso: string }[];
} {
  const appended: { path: string; payload: string; nowIso: string }[] = [];
  return {
    appended,
    deps: {
      env: {},
      nowIso: () => '2026-08-12T09:00:00.000Z',
      appendEntry(path, payload, nowIso) {
        appended.push({ path, payload, nowIso });
      },
      render: () => 'RENDERED\n',
    },
  };
}

describe('emitStatusline', () => {
  it('logs the raw payload before planning — malformed and noop payloads are exactly the ones a diagnosis needs', () => {
    const { deps, appended } = fakeDeps();
    const out = emitStatusline('not json {{{', {
      ...deps,
      env: { OAK_STATUSLINE_LOG_FILE: '/d/s.log' },
    });
    expect(appended).toEqual([
      { path: '/d/s.log', payload: 'not json {{{', nowIso: '2026-08-12T09:00:00.000Z' },
    ]);
    expect(out).toBe('');
  });

  it('emits the misconfiguration warning alone on a noop payload — silence must never read as "nothing arrived"', () => {
    const { deps } = fakeDeps();
    const out = emitStatusline('{}', { ...deps, env: { OAK_STATUSLINE_LOG_FILE: '/d/notes.txt' } });
    expect(out).toContain('OAK_STATUSLINE_LOG_FILE');
    expect(out.endsWith('\n')).toBe(true);
  });

  it('renders with the warning prefixed when the config is invalid and the payload renders', () => {
    const { deps } = fakeDeps();
    const out = emitStatusline('{"session_id":"c32a7d1d-a40b-4864-b4cd-bc4332a3e362"}', {
      ...deps,
      env: { OAK_STATUSLINE_LOG_FILE: '/d/notes.txt' },
    });
    expect(out).toContain('OAK_STATUSLINE_LOG_FILE');
    expect(out).toContain('RENDERED');
    expect(out.indexOf('OAK_STATUSLINE_LOG_FILE')).toBeLessThan(out.indexOf('RENDERED'));
  });

  it('keeps the warning when rendering throws — the fault token joins it, never replaces it', () => {
    const { deps } = fakeDeps();
    const out = emitStatusline('{"session_id":"c32a7d1d-a40b-4864-b4cd-bc4332a3e362"}', {
      ...deps,
      env: { OAK_STATUSLINE_LOG_FILE: '/d/notes.txt' },
      render: () => {
        throw new Error('render exploded');
      },
    });
    expect(out).toContain('OAK_STATUSLINE_LOG_FILE');
    expect(out).toContain('render exploded');
    expect(out.indexOf('OAK_STATUSLINE_LOG_FILE')).toBeLessThan(out.indexOf('render exploded'));
  });

  it('renders cleanly with no logging and no warning under an unset environment', () => {
    const { deps, appended } = fakeDeps();
    const out = emitStatusline('{"session_id":"c32a7d1d-a40b-4864-b4cd-bc4332a3e362"}', deps);
    expect(appended).toEqual([]);
    expect(out).toBe('RENDERED\n');
  });
});

describe('cloud-seat seed through the composed path', () => {
  it('renders from the stripped platform session id, not the harness payload id', () => {
    const { deps } = fakeDeps();
    let seenSeed: string | undefined;
    const out = emitStatusline(JSON.stringify({ session_id: 'harness-uuid' }), {
      ...deps,
      env: { CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72' },
      render: (inputs) => {
        seenSeed = inputs.seed;
        return 'RENDERED\n';
      },
    });

    expect(out).toBe('RENDERED\n');
    expect(seenSeed).toBe('01FV6rZz5BjSkApAUL6FAj72');
  });
});

describe('explicit Practice seed precedence through the composed path', () => {
  it('an explicit PRACTICE_AGENT_SESSION_ID_CLAUDE outranks the ambient platform id', () => {
    const { deps } = fakeDeps();
    let seenSeed: string | undefined;
    emitStatusline(JSON.stringify({ session_id: 'harness-uuid' }), {
      ...deps,
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'explicit-operator-seed',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      },
      render: (inputs) => {
        seenSeed = inputs.seed;
        return 'RENDERED\n';
      },
    });

    expect(seenSeed).toBe('explicit-operator-seed');
  });
});
