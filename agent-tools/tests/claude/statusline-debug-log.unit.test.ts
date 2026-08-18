import {
  invalidConfigWarningLine,
  resolveDebugLogConfig,
} from '../../src/claude/statusline-debug-log';

describe('resolveDebugLogConfig', () => {
  it('resolves disabled when OAK_STATUSLINE_LOG_FILE is unset', () => {
    expect(resolveDebugLogConfig({})).toEqual({ kind: 'disabled' });
  });

  it('resolves disabled for an empty or whitespace-only value', () => {
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '' })).toEqual({ kind: 'disabled' });
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '   ' })).toEqual({ kind: 'disabled' });
  });

  it('resolves enabled with the path when the value ends with .log', () => {
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '/tmp/statusline.log' })).toEqual({
      kind: 'enabled',
      path: '/tmp/statusline.log',
    });
  });

  it('trims surrounding whitespace from the value — a padded shell export must not leak into the path', () => {
    // Untrimmed, '  /tmp/x.log' has dirname '  /tmp' and mkdir would create a
    // directory literally named with a leading space, relative to the cwd.
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '  /tmp/statusline.log  ' })).toEqual({
      kind: 'enabled',
      path: '/tmp/statusline.log',
    });
  });

  it('resolves invalid, with a renderable warning, for a set value without the .log suffix', () => {
    // Set-but-wrong is a misconfiguration and must fail loud: silence here
    // would read as "the harness sent nothing" — a false diagnosis from the
    // diagnostic instrument itself.
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '/tmp/notes.txt' })).toEqual({
      kind: 'invalid',
      warning: 'OAK_STATUSLINE_LOG_FILE must name a *.log path — logging disabled',
    });
    expect(resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '/tmp/log' }).kind).toBe('invalid');
  });
});

describe('invalidConfigWarningLine', () => {
  const ansi = { red: '<R>', bold: '<B>', reset: '<X>' };

  it('renders the loud one-line warning for an invalid config — it must precede ANY adapter outcome, including noop', () => {
    // The operator who set OAK_STATUSLINE_LOG_FILE must never read silence as
    // "the harness sent nothing": the warning renders even when the payload
    // itself plans to noop.
    const config = resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '/tmp/notes.txt' });
    const line = invalidConfigWarningLine(config, ansi);
    expect(line).toContain('OAK_STATUSLINE_LOG_FILE');
    expect(line.startsWith('<R><B>')).toBe(true);
    expect(line.endsWith('<X>\n')).toBe(true);
  });

  it('renders empty for enabled and disabled configs', () => {
    expect(
      invalidConfigWarningLine(
        resolveDebugLogConfig({ OAK_STATUSLINE_LOG_FILE: '/tmp/a.log' }),
        ansi,
      ),
    ).toBe('');
    expect(invalidConfigWarningLine(resolveDebugLogConfig({}), ansi)).toBe('');
  });
});
