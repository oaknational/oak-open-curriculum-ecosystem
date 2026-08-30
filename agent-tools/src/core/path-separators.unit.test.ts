import { describe, expect, it } from 'vitest';

import { isFilesystemRoot, trimTrailingSeparators } from './path-separators.js';

describe('isFilesystemRoot', () => {
  // The win32 rows are the point: a guard that trims first and then checks
  // for emptiness catches `/` but not `C:\`, because that trims to `C:` —
  // drive-RELATIVE, resolving against the current directory on that drive.
  it.each([
    { label: 'posix root', value: '/' },
    { label: 'posix root with repeated separators', value: '///' },
    // A trailing backslash cannot be written with String.raw: it escapes the
    // closing backtick even there, so these rows use quoted escapes.
    { label: 'windows drive root, backslash', value: 'C:\\' },
    { label: 'windows drive root, forward slash', value: 'C:/' },
    { label: 'windows drive root, lower case', value: 'c:\\' },
    { label: 'bare drive designator', value: 'C:' },
    // `path.win32.parse` treats a share as a root, so a caller promising to
    // refuse roots must catch these too — trimming `\\server\share\` and
    // joining would otherwise compose a child directly in the share root.
    { label: 'a UNC share root', value: String.raw`\\server\share` },
    { label: 'a UNC share root with a trailing separator', value: '\\\\server\\share\\' },
    { label: 'a UNC share root in forward-slash form', value: '//server/share/' },
    { label: 'a bare UNC host', value: String.raw`\\server` },
  ])('classifies $label as a root', ({ value }) => {
    expect(isFilesystemRoot(value)).toBe(true);
  });

  it.each([
    { label: 'a directory under the posix root', value: '/comms-seen' },
    { label: 'a directory under a drive root', value: String.raw`C:\comms-seen` },
    { label: 'a directory below a UNC share root', value: String.raw`\\server\share\comms-seen` },
    { label: 'a relative path', value: 'comms-seen' },
    { label: 'the empty string', value: '' },
  ])('does not classify $label as a root', ({ value }) => {
    expect(isFilesystemRoot(value)).toBe(false);
  });
});

describe('trimTrailingSeparators', () => {
  it.each([
    {
      label: 'a backslash tail',
      value: 'C:\\comms-seen\\',
      expected: String.raw`C:\comms-seen`,
    },
    { label: 'a forward-slash tail', value: '/comms/seen/', expected: '/comms/seen' },
    { label: 'a mixed run', value: '/comms/seen\\/\\', expected: '/comms/seen' },
    { label: 'no tail', value: '/comms/seen', expected: '/comms/seen' },
    { label: 'only separators', value: '///', expected: '' },
    { label: 'the empty string', value: '', expected: '' },
  ])('trims $label', ({ value, expected }) => {
    expect(trimTrailingSeparators(value)).toBe(expected);
  });

  // A caller may name the separator it means: with only `/` accepted, a
  // trailing backslash is an ordinary character and survives. (The expected
  // value ends in a backslash, which String.raw cannot express.)
  it('trims only the separators the supplied predicate accepts', () => {
    expect(trimTrailingSeparators(String.raw`/repo/a\/`, (character) => character === '/')).toBe(
      '/repo/a\\',
    );
  });

  // A long separator run is where the former `[\\/]+$` replace backtracked
  // super-linearly; the scan is linear, so this returns immediately.
  it('handles a long separator run without super-linear cost', () => {
    expect(trimTrailingSeparators(`/base${'/'.repeat(50_000)}`)).toBe('/base');
  });
});
