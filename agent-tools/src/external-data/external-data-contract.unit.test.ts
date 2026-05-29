import { describe, expect, it } from 'vitest';

import {
  findExternalDataViolations,
  formatExternalDataViolations,
  hasProvenanceDocstring,
} from './external-data-contract.js';

const PATH = 'pkg/src/toolkit.external-data.ts';

function checkRules(content: string): readonly string[] {
  return findExternalDataViolations([{ path: PATH, content }]).map((violation) => violation.rule);
}

describe('findExternalDataViolations', () => {
  it('passes a compliant file: provenance docstring plus an `: unknown` data export', () => {
    const content = [
      '/**',
      ' * Example external snapshot.',
      ' * Provenance: downloaded from example.org on 2026-01-01.',
      ' */',
      "export const EXAMPLE_RAW: unknown = { a: 1, b: ['x'] };",
      '',
    ].join('\n');

    expect(findExternalDataViolations([{ path: PATH, content }])).toStrictEqual([]);
  });

  it('does not over-reach: a function nested inside `: unknown` data is allowed', () => {
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = { transform: () => 1 };',
      '',
    ].join('\n');

    expect(findExternalDataViolations([{ path: PATH, content }])).toStrictEqual([]);
  });

  it('flags a data export with no type annotation', () => {
    expect(
      checkRules(['/** Provenance: x */', 'export const RAW = { a: 1 };', ''].join('\n')),
    ).toStrictEqual(['data-export-must-be-unknown']);
  });

  it('flags a data export typed as something other than `unknown`', () => {
    expect(
      checkRules(
        ['/** Provenance: x */', 'export const RAW: { a: number } = { a: 1 };', ''].join('\n'),
      ),
    ).toStrictEqual(['data-export-must-be-unknown']);
  });

  it('flags a file with no exported data binding', () => {
    expect(
      checkRules(['/** Provenance: x */', 'const internal = 1;', ''].join('\n')),
    ).toStrictEqual(['no-unknown-data-export']);
  });

  it('flags a missing provenance docstring', () => {
    expect(
      checkRules(
        ['/** Just a note, no source. */', 'export const RAW: unknown = {};', ''].join('\n'),
      ),
    ).toStrictEqual(['missing-provenance-docstring']);
  });

  it.each([
    { label: 'function declaration', logic: 'export function helper() { return 1; }' },
    { label: 'class declaration', logic: 'export class Helper {}' },
    { label: 'enum declaration', logic: 'export enum Helper { A }' },
    { label: 'arrow-function const', logic: 'export const helper = () => 1;' },
    {
      label: 'function-expression const',
      logic: 'export const helper = function () { return 1; };',
    },
    { label: 'default function', logic: 'export default function () { return 1; }' },
    { label: 'default arrow function', logic: 'export default () => 1;' },
  ])('forbids exported logic: $label', ({ logic }) => {
    const content = ['/** Provenance: x */', 'export const RAW: unknown = {};', logic, ''].join(
      '\n',
    );

    expect(checkRules(content)).toStrictEqual(['logic-export-forbidden']);
  });

  it('reports the offending line and a descriptive detail for logic exports', () => {
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = {};',
      'export function helper() {}',
      '',
    ].join('\n');

    const violations = findExternalDataViolations([{ path: PATH, content }]);

    expect(
      violations.map((violation) => ({ rule: violation.rule, line: violation.line })),
    ).toStrictEqual([{ rule: 'logic-export-forbidden', line: 3 }]);
    expect(violations[0]?.detail).toContain('helper');
  });

  it('reports every violation in a multiply non-compliant file', () => {
    const content = ['export const RAW = {};', 'export function f() {}', ''].join('\n');

    expect(new Set(checkRules(content))).toStrictEqual(
      new Set([
        'data-export-must-be-unknown',
        'logic-export-forbidden',
        'missing-provenance-docstring',
      ]),
    );
  });
});

describe('hasProvenanceDocstring', () => {
  it('accepts a block comment documenting provenance', () => {
    expect(
      hasProvenanceDocstring('/** Provenance: example.org */\nexport const X: unknown = {};'),
    ).toBe(true);
  });

  it('rejects a block comment that does not mention provenance', () => {
    expect(hasProvenanceDocstring('/** A plain note. */\nexport const X: unknown = {};')).toBe(
      false,
    );
  });

  it('does not count the word appearing inside a string literal in the data', () => {
    expect(
      hasProvenanceDocstring('export const X: unknown = { note: "provenance pending" };'),
    ).toBe(false);
  });
});

describe('formatExternalDataViolations', () => {
  it('renders path, optional line, rule, and detail one per line', () => {
    expect(
      formatExternalDataViolations([
        { path: 'a.external-data.ts', rule: 'no-unknown-data-export', detail: 'msg' },
        { path: 'b.external-data.ts', rule: 'logic-export-forbidden', detail: 'oops', line: 5 },
      ]),
    ).toBe(
      '  a.external-data.ts  [no-unknown-data-export] msg\n  b.external-data.ts:5  [logic-export-forbidden] oops',
    );
  });
});
