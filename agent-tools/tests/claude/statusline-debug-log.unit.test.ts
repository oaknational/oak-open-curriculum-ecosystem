import {
  debugLogLine,
  invalidConfigWarningLine,
  resolveDebugLogConfig,
} from '../../src/claude/statusline-debug-log';

describe('resolveDebugLogConfig', () => {
  it('resolves disabled when PRACTICE_STATUSLINE_LOG_FILE is unset', () => {
    expect(resolveDebugLogConfig({})).toEqual({ kind: 'disabled' });
  });

  it('resolves disabled for an empty or whitespace-only value', () => {
    expect(resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '' })).toEqual({
      kind: 'disabled',
    });
    expect(resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '   ' })).toEqual({
      kind: 'disabled',
    });
  });

  it('resolves enabled with the path when the value ends with .log', () => {
    expect(resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '/tmp/statusline.log' })).toEqual({
      kind: 'enabled',
      path: '/tmp/statusline.log',
    });
  });

  it('trims surrounding whitespace from the value — a padded shell export must not leak into the path', () => {
    // Untrimmed, '  /tmp/x.log' has dirname '  /tmp' and mkdir would create a
    // directory literally named with a leading space, relative to the cwd.
    expect(
      resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '  /tmp/statusline.log  ' }),
    ).toEqual({
      kind: 'enabled',
      path: '/tmp/statusline.log',
    });
  });

  it('resolves invalid, with a renderable warning, for a set value without the .log suffix', () => {
    // Set-but-wrong is a misconfiguration and must fail loud: silence here
    // would read as "the harness sent nothing" — a false diagnosis from the
    // diagnostic instrument itself.
    expect(resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '/tmp/notes.txt' })).toEqual({
      kind: 'invalid',
      warning: 'PRACTICE_STATUSLINE_LOG_FILE must name a *.log path — logging disabled',
    });
    expect(resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '/tmp/log' }).kind).toBe(
      'invalid',
    );
  });
});

describe('invalidConfigWarningLine', () => {
  const ansi = { red: '<R>', bold: '<B>', reset: '<X>' };

  it('renders the loud one-line warning for an invalid config — it must precede ANY adapter outcome, including noop', () => {
    // The operator who set PRACTICE_STATUSLINE_LOG_FILE must never read silence as
    // "the harness sent nothing": the warning renders even when the payload
    // itself plans to noop.
    const config = resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '/tmp/notes.txt' });
    const line = invalidConfigWarningLine(config, ansi);
    expect(line).toContain('PRACTICE_STATUSLINE_LOG_FILE');
    expect(line.startsWith('<R><B>')).toBe(true);
    expect(line.endsWith('<X>\n')).toBe(true);
  });

  it('renders empty for enabled and disabled configs', () => {
    expect(
      invalidConfigWarningLine(
        resolveDebugLogConfig({ PRACTICE_STATUSLINE_LOG_FILE: '/tmp/a.log' }),
        ansi,
      ),
    ).toBe('');
    expect(invalidConfigWarningLine(resolveDebugLogConfig({}), ansi)).toBe('');
  });
});

describe('debugLogLine', () => {
  const now = '2026-08-07T15:00:00.000Z';

  it('is one line: the timestamp, a space, the payload, a newline', () => {
    expect(debugLogLine('{"a":1}', now)).toBe(`${now} {"a":1}\n`);
  });

  it('collapses line breaks so one invocation is one greppable line', () => {
    expect(debugLogLine('{\n"a": 1\n}', now)).toBe(`${now} { "a": 1 }\n`);
  });

  it('trims the trailing newline the harness sends, keeping the entry one line', () => {
    expect(debugLogLine('{"a":1}\n', now)).toBe(`${now} {"a":1}\n`);
  });

  it('preserves internal whitespace — the logged payload stays faithful to what arrived', () => {
    expect(debugLogLine('{"cwd":"/a  b/c"}', now)).toBe(`${now} {"cwd":"/a  b/c"}\n`);
  });

  it('preserves leading and trailing non-linebreak whitespace — only line breaks are transformed', () => {
    expect(debugLogLine('  {"a":1}\t \n', now)).toBe(`${now}   {"a":1}\t \n`);
  });
});
