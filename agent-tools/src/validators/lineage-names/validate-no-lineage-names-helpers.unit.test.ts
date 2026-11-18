import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  findLineageNameHits,
  lineageNeedles,
  needleDefects,
  scanForLineageNames,
  selectLineageNameBlock,
  type ScanFile,
} from './validate-no-lineage-names-helpers.js';

/**
 * Pure cells over injected blocks and in-memory files; no policy read, no
 * filesystem. The live policy's block is proven where it is used: the gate
 * refuses a missing, doubled, malformed or empty block on every run, and its CLI
 * smoke runs it over the tracked tree.
 */

const BLOCK: ScopedContentBlockGroup = {
  concept: 'lineage-name',
  kind: 'literal',
  patterns: ['exampleorg'],
  include_paths: [''],
  exclude_paths: ['./records/', './content/cv.json'],
  citation: 'a cell fixture',
};

const OTHER: ScopedContentBlockGroup = {
  concept: 'machine-local-path',
  kind: 'regex',
  patterns: ['/Users/[A-Za-z0-9_-]+'],
  include_paths: [''],
  citation: 'a cell fixture',
};

describe('selectLineageNameBlock', () => {
  it('selects the one lineage-name block among the policy blocks', () => {
    expect(unwrap(selectLineageNameBlock([OTHER, BLOCK]))).toBe(BLOCK);
  });

  it('a policy with no lineage-name block declares no lineage names: nothing to check, no refusal', () => {
    expect(unwrap(selectLineageNameBlock([OTHER]))).toBeUndefined();
  });

  it('refuses a policy with two lineage-name blocks: the hook evaluates every group', () => {
    expect(unwrapErr(selectLineageNameBlock([BLOCK, OTHER, { ...BLOCK }]))).toContain(
      '2 `lineage-name` blocks',
    );
  });
});

describe('needleDefects and lineageNeedles', () => {
  it('a padded, empty or duplicate name is a defect: the hook and the gate would read it apart', () => {
    expect(
      needleDefects({ ...BLOCK, patterns: ['exampleorg', ' ExampleOrg ', '', 'ExampleOrg'] }),
    ).toEqual([
      'padded or empty name " ExampleOrg "',
      'duplicate name " ExampleOrg "',
      'padded or empty name ""',
      'duplicate name "ExampleOrg"',
    ]);
    expect(needleDefects(BLOCK)).toEqual([]);
  });

  it('a non-literal block is a defect: the gate matches names, the hook would match a pattern', () => {
    expect(needleDefects({ ...BLOCK, kind: 'regex' })).toEqual([
      'kind "regex" (the gate matches literal names only)',
    ]);
    // An absent kind is the hook's literal default.
    const withoutKind: ScopedContentBlockGroup = {
      concept: BLOCK.concept,
      patterns: BLOCK.patterns,
      include_paths: BLOCK.include_paths,
      citation: BLOCK.citation,
    };
    expect(needleDefects(withoutKind)).toEqual([]);
  });

  it('the needles are the declared names as written', () => {
    expect(lineageNeedles({ ...BLOCK, patterns: ['exampleorg', 'upstream-lineage'] })).toEqual([
      'exampleorg',
      'upstream-lineage',
    ]);
  });
});

describe('findLineageNameHits', () => {
  it('reports the line and column of a hit, case-insensitively, with the text as written', () => {
    const hits = findLineageNameHits('f.md', 'ok\nsee https://github.com/ExampleOrg/x\nok', [
      'exampleorg',
    ]);
    expect(hits).toStrictEqual([{ file: 'f.md', line: 2, column: 24, text: 'ExampleOrg' }]);
  });

  it('records at most one hit per line', () => {
    expect(
      findLineageNameHits('f', 'exampleorg and upstream-lineage', [
        'exampleorg',
        'upstream-lineage',
      ]),
    ).toHaveLength(1);
  });

  it('a name is literal, never a pattern', () => {
    expect(findLineageNameHits('f', 'a.b', ['a.b'])).toHaveLength(1);
    expect(findLineageNameHits('f', 'axb', ['a.b'])).toHaveLength(0);
  });
});

describe('scanForLineageNames', () => {
  const files: readonly ScanFile[] = [
    { path: 'tooling/x/package.json', content: '"url": "https://github.com/exampleorg/x"' },
    { path: 'records/provenance.yml', content: 'repo: exampleorg' },
    { path: 'content/cv.json', content: 'worked at exampleorg' },
    { path: 'src/clean.ts', content: 'nothing here' },
  ];

  it('scans the in-scope files and exempts the excluded ones', () => {
    const hits = scanForLineageNames(files, BLOCK, ['exampleorg']);
    expect(hits.map((hit) => hit.file)).toEqual(['tooling/x/package.json']);
  });
});
