import { describe, expect, it } from 'vitest';

import { parseCheckArgs } from './operator-profile-check-args.js';

describe('parseCheckArgs', () => {
  it('accepts no arguments, a root, and repeated emit paths in order', () => {
    expect(parseCheckArgs([])).toStrictEqual({ ok: true, value: { root: undefined, emit: [] } });
    expect(
      parseCheckArgs(['--emit', 'index.md', '--root', '/srv/profile', '--emit', 'repos/a--b.md']),
    ).toStrictEqual({
      ok: true,
      value: { root: '/srv/profile', emit: ['index.md', 'repos/a--b.md'] },
    });
  });

  it('refuses an argument the grammar does not name, so a typo never falls back to the home profile', () => {
    const result = parseCheckArgs(['--rot', '/srv/profile']);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toContain('unknown argument "--rot"');
  });

  it('refuses a trailing positional, a duplicate root, and an option without a value', () => {
    expect(parseCheckArgs(['--root', '/srv/profile', 'extra']).ok).toBe(false);
    const duplicate = parseCheckArgs(['--root', '/a', '--root', '/b']);
    expect(duplicate.ok ? '' : duplicate.error).toContain('--root given more than once');
    const blank = parseCheckArgs(['--root', '']);
    expect(blank.ok ? '' : blank.error).toContain('--root needs a value');
    const flagAsValue = parseCheckArgs(['--emit', '--root']);
    expect(flagAsValue.ok ? '' : flagAsValue.error).toContain('--emit needs a value');
  });
});
