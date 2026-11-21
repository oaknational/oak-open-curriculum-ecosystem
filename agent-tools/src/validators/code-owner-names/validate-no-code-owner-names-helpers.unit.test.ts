import { describe, expect, it } from 'vitest';

import {
  isExemptPath,
  parseCodeOwnerLogins,
  parseExtraNames,
  scanForNames,
  summariseByDirectory,
} from './validate-no-code-owner-names-helpers.js';

describe('parseCodeOwnerLogins', () => {
  it('reads every account a pattern line names, once, in lower case', () => {
    const content = [
      '# Default ownership.',
      '* @A-Person @another-person',
      '',
      '/.github/CODEOWNERS @a-person',
    ].join('\n');

    expect(parseCodeOwnerLogins(content)).toEqual(['a-person', 'another-person']);
  });

  it('leaves out a team, which names no person', () => {
    expect(parseCodeOwnerLogins('* @example-org/a-team @a-person\n')).toEqual(['a-person']);
  });

  it('leaves out an account named only in a comment', () => {
    expect(parseCodeOwnerLogins('# ask @a-person first\n* @another-person\n')).toEqual([
      'another-person',
    ]);
  });

  it('reads no account from a file with no owners', () => {
    expect(parseCodeOwnerLogins('# nothing owned yet\n')).toEqual([]);
  });
});

describe('parseExtraNames', () => {
  it('reads one name per line, skipping blanks and comments', () => {
    expect(
      parseExtraNames('# local additions\n\nexample.invalid\n  A.Person@Example.Invalid  \n'),
    ).toEqual(['example.invalid', 'a.person@example.invalid']);
  });
});

describe('isExemptPath', () => {
  it('exempts the code-owners file and the Practice Core, and nothing else', () => {
    expect(isExemptPath('.github/CODEOWNERS')).toBe(true);
    expect(isExemptPath('.agent/practice-core/provenance.yml')).toBe(true);
    expect(isExemptPath('.agent/practice-core-notes.md')).toBe(false);
    expect(isExemptPath('docs/README.md')).toBe(false);
  });
});

describe('scanForNames', () => {
  const names = ['a-person'];

  it('finds a name whatever its case, with the line it is on', () => {
    const content = 'first line\nreviewed by @A-Person today\n';

    expect(scanForNames('notes.md', content, names)).toEqual([{ path: 'notes.md', line: 2 }]);
  });

  it('finds a name used as a branch prefix, a domain stem and a mail local part', () => {
    const content = [
      'a-person/some-branch',
      'https://a-person.example',
      '1+a-person@example.invalid',
    ].join('\n');

    expect(scanForNames('notes.md', content, names).map((hit) => hit.line)).toEqual([1, 2, 3]);
  });

  it('does not find a name inside a longer account name', () => {
    const content = 'not-a-person and a-personal-site and a-person-bot\n';

    expect(scanForNames('notes.md', content, names)).toEqual([]);
  });

  it('reports a line once however many names it holds', () => {
    const content = '@a-person and @another-person\n';

    expect(scanForNames('notes.md', content, ['a-person', 'another-person'])).toEqual([
      { path: 'notes.md', line: 1 },
    ]);
  });

  it('reads a name literally, so a dot in it matches only a dot', () => {
    const content = 'see example.invalid\nsee exampleXinvalid\n';

    expect(scanForNames('notes.md', content, ['example.invalid'])).toEqual([
      { path: 'notes.md', line: 1 },
    ]);
  });

  it('finds nothing when there are no names to look for', () => {
    expect(scanForNames('notes.md', '@a-person\n', [])).toEqual([]);
  });
});

describe('summariseByDirectory', () => {
  it('counts files and lines per directory, largest first', () => {
    const hits = [
      { path: 'docs/a.md', line: 1 },
      { path: 'docs/a.md', line: 9 },
      { path: 'docs/b.md', line: 2 },
      { path: 'README.md', line: 3 },
    ];

    expect(summariseByDirectory(hits)).toEqual([
      { directory: 'docs', files: 2, lines: 3 },
      { directory: '.', files: 1, lines: 1 },
    ]);
  });
});
