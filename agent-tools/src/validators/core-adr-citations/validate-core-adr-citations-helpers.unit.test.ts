import { describe, expect, it } from 'vitest';

import {
  findAdrCitations,
  findCoreCitations,
  isCorePath,
} from './validate-core-adr-citations-helpers.js';

/**
 * Pure cells over in-memory documents; no filesystem. The entry point's run
 * over the tracked tree is proven by its CLI smoke.
 */

const PDR_A = '.agent/practice-core/decision-records/PDR-001-a.md';
const PDR_B = '.agent/practice-core/decision-records/PDR-002-b.md';
const CHANGELOG = '.agent/practice-core/CHANGELOG.md';

describe('isCorePath', () => {
  it('admits every file under the Core, at any depth', () => {
    expect(isCorePath(PDR_A)).toBe(true);
    expect(isCorePath(CHANGELOG)).toBe(true);
    expect(isCorePath('.agent/practice-core/incoming/.gitkeep')).toBe(true);
  });

  it('refuses a file outside the Core, including a look-alike prefix', () => {
    expect(isCorePath('.agent/rules/practice-core-portability.md')).toBe(false);
    expect(isCorePath('.agent/practice-core-archive/x.md')).toBe(false);
    expect(isCorePath('docs/architecture/decision-records/001-x.md')).toBe(false);
  });
});

describe('findAdrCitations', () => {
  it('finds every citation with its line, its column and its text as written', () => {
    expect(findAdrCitations('intro\nsee ADR-150 and ADR-7.\nend')).toEqual([
      { line: 2, column: 5, text: 'ADR-150' },
      { line: 2, column: 17, text: 'ADR-7' },
    ]);
  });

  it.each([
    ['in a code span', '`ADR-12`', 'ADR-12'],
    ['in underscore emphasis', '_ADR-12_', 'ADR-12'],
    ['in lower case', 'adr-12', 'adr-12'],
    ['after an en dash', 'ADR\u201312', 'ADR\u201312'],
    ['after a non-breaking hyphen', 'ADR\u201112', 'ADR\u201112'],
    ['after a space', 'ADR 12', 'ADR 12'],
    ['after a no-break space', 'ADR\u00A012', 'ADR\u00A012'],
    ['with a leading zero', 'ADR-012', 'ADR-012'],
  ])('reads a citation %s', (_label, content, written) => {
    expect(findAdrCitations(content).map((citation) => citation.text)).toEqual([written]);
  });

  it.each([
    ['a PDR number', 'PDR-105'],
    ['a longer word', 'MADR-2'],
    ['the plural word', 'ADRs'],
    ['the bare word', 'an ADR is local'],
    ['a separator with no number after it', 'ADR- 5'],
    ['a number running into a letter', 'ADR-12a'],
  ])('does not read %s as a citation', (_label, content) => {
    expect(findAdrCitations(content)).toEqual([]);
  });
});

describe('findCoreCitations', () => {
  it('places every citation in its file, by file in the order given, then in reading order', () => {
    expect(
      findCoreCitations([
        { path: PDR_A, content: 'ADR-9, then\nADR-3' },
        { path: PDR_B, content: 'clean' },
        { path: CHANGELOG, content: 'Host phenotype: ADR-221' },
      ]),
    ).toEqual([
      { file: PDR_A, line: 1, column: 1, text: 'ADR-9' },
      { file: PDR_A, line: 2, column: 1, text: 'ADR-3' },
      { file: CHANGELOG, line: 1, column: 17, text: 'ADR-221' },
    ]);
  });
});
