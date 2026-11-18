import { describe, expect, it } from 'vitest';

import { atxHeadings } from './markdown-headings.js';
import {
  changelogRepositories,
  findHostNameHeadingHits,
  hostNeedles,
  isScannedCorePath,
  provenanceRepositories,
  scanCoreHeadings,
  type ScanFile,
} from './validate-no-host-names-in-core-headings-helpers.js';

/**
 * Pure cells over in-memory documents; no provenance read, no git, no
 * filesystem. The live tree is proven where the gate runs: its CLI smoke runs
 * the entry point over the tracked Core and expects the green line.
 */

const PROVENANCE = [
  '# Practice Core Provenance',
  "attribution: 'created by someone'",
  '',
  'practice.md:',
  '  - id: 9bc58220-1b8b-47c2-9696-0218abc2ad38',
  '    repo: example-site.net',
  '    date: 2026-06-21',
  '    purpose: >-',
  '      a purpose whose text says repo: not-a-field',
  '  - id: f8d9f57f-9604-4326-b430-fd9adf89bc78',
  "    repo: 'castr'",
  '  - id: 084f1543-fdab-4904-8af4-0727b47cefd2',
  '    repo: "Example-Site.net"',
  '  - id: dd2df794-5c6a-4605-9edb-c50bf02147da',
  '    repo: algo-experiments',
].join('\n');

describe('isScannedCorePath', () => {
  it('reads Core markdown documents and nothing else', () => {
    expect(isScannedCorePath('.agent/practice-core/decision-records/PDR-008-x.md')).toBe(true);
    expect(isScannedCorePath('.agent/practice-core/practice.md')).toBe(true);
    expect(isScannedCorePath('.agent/practice-core/provenance.yml')).toBe(false);
    expect(isScannedCorePath('.agent/rules/some-rule.md')).toBe(false);
    expect(isScannedCorePath('docs/architecture/decision-records/023-x.md')).toBe(false);
  });

  it('exempts the changelog, whose headings tag the writing repository by convention', () => {
    expect(isScannedCorePath('.agent/practice-core/CHANGELOG.md')).toBe(false);
  });
});

describe('provenanceRepositories', () => {
  it('reads every repo field once, quoted or bare, keeping the first spelling', () => {
    expect(provenanceRepositories(PROVENANCE)).toEqual([
      'example-site.net',
      'castr',
      'algo-experiments',
    ]);
  });

  it('reads nothing from a file with no repo field', () => {
    expect(provenanceRepositories('attribution: x\npractice.md: []\n')).toEqual([]);
  });
});

describe('changelogRepositories', () => {
  it('reads every entry tag once; an owner/name tag yields the owner, the name and the slug', () => {
    const changelog = [
      '# Practice Core Changelog',
      '',
      '## [example-site.net] 2026-10-02 — an entry',
      '',
      '- a bullet whose text says ## [not-a-tag] in prose',
      '',
      '## [ExampleOwner/castr] 2026-09-28 — another entry',
      '',
      '## [Example-Site.net] 2026-09-14 — a third, the same host in another case',
      '',
      '### 2026-09-14 — a level-three heading is not an entry',
    ].join('\n');
    expect(changelogRepositories(changelog)).toEqual([
      'example-site.net',
      'ExampleOwner',
      'castr',
      'ExampleOwner/castr',
    ]);
  });
});

describe('hostNeedles', () => {
  it('joins the origin owner and name to the declared names, without duplicating one', () => {
    expect(
      hostNeedles(['example-site.net', 'castr'], {
        owner: 'ExampleOwner',
        repoName: 'Example-Site.net',
      }),
    ).toEqual(['example-site.net', 'castr', 'ExampleOwner']);
  });
});

describe('atxHeadings', () => {
  it('returns the ATX headings with their line numbers and skips fenced code', () => {
    const content = [
      '# Title',
      'prose',
      '```md',
      '## not a heading, it is quoted',
      '```',
      '### Real',
      '~~~~',
      '# still fenced, a tilde fence',
      '```',
      '# still fenced: a shorter backtick fence does not close a tilde fence',
      '~~~~',
      '#### Last',
      '#NoSpace is not a heading',
    ].join('\n');
    expect(atxHeadings(content)).toEqual([
      { line: 1, text: '# Title' },
      { line: 6, text: '### Real' },
      { line: 12, text: '#### Last' },
    ]);
  });

  it('a closing run followed by text does not close the fence (CommonMark)', () => {
    const content = ['```', '```not-a-closer', '## still quoted', '```', '## Real'].join('\n');
    expect(atxHeadings(content)).toEqual([{ line: 5, text: '## Real' }]);
  });

  it('closes a fence and reads the headings of CRLF Markdown', () => {
    const content = ['```', '## quoted', '```', '## Real'].join('\r\n');
    expect(atxHeadings(content)).toEqual([{ line: 4, text: '## Real' }]);
  });

  it('a backtick run whose info string carries a backtick opens no fence', () => {
    const content = ['``` `inline` ```', '## Real heading', '```', '## quoted', '```'].join('\n');
    expect(atxHeadings(content)).toEqual([{ line: 2, text: '## Real heading' }]);
  });

  it('a tilde opener may carry a backtick in its info string', () => {
    const content = ['~~~ `x`', '## quoted', '~~~', '## Real'].join('\n');
    expect(atxHeadings(content)).toEqual([{ line: 4, text: '## Real' }]);
  });
});

describe('findHostNameHeadingHits', () => {
  const needles = ['example-site.net', 'castr', 'ExampleOwner'];

  it('reports a host name in a heading with its line, column and text as written', () => {
    const content = ['## Amendment Log', '', '### 2026-09-14 — Example-Site.net: a ruling'].join(
      '\n',
    );
    expect(findHostNameHeadingHits('PDR-x.md', content, needles)).toStrictEqual([
      { file: 'PDR-x.md', line: 3, column: 18, text: 'Example-Site.net' },
    ]);
  });

  it('ignores a host name in body text: only headings carry the record of adoption', () => {
    const content = ['# A decision', 'Worked instance: example-site.net adopted it.'].join('\n');
    expect(findHostNameHeadingHits('f.md', content, needles)).toEqual([]);
  });

  it('matches a name as a whole token, never inside a longer word', () => {
    expect(findHostNameHeadingHits('f.md', '## the castr estate', needles)).toHaveLength(1);
    expect(findHostNameHeadingHits('f.md', '## to castrate a word', needles)).toEqual([]);
    expect(findHostNameHeadingHits('f.md', '## [castr] tagged', needles)).toHaveLength(1);
  });

  it('records at most one hit per heading', () => {
    expect(
      findHostNameHeadingHits('f.md', '## castr and example-site.net together', needles),
    ).toHaveLength(1);
  });

  it('a name is literal, never a pattern', () => {
    expect(findHostNameHeadingHits('f.md', '## example-siteXnet', ['example-site.net'])).toEqual(
      [],
    );
  });
});

describe('scanCoreHeadings', () => {
  const files: readonly ScanFile[] = [
    { path: '.agent/practice-core/decision-records/PDR-a.md', content: '### 2026 — castr: x' },
    { path: '.agent/practice-core/practice.md', content: '# The Practice\ncastr in prose' },
    { path: '.agent/practice-core/decision-records/PDR-b.md', content: '## ExampleOwner rules' },
  ];

  it('reports the hits by file in the order given', () => {
    expect(scanCoreHeadings(files, ['castr', 'ExampleOwner']).map((hit) => hit.file)).toEqual([
      '.agent/practice-core/decision-records/PDR-a.md',
      '.agent/practice-core/decision-records/PDR-b.md',
    ]);
  });
});
