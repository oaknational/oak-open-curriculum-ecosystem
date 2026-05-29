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

  it('forbids logic nested inside `: unknown` data (file-wide invariant)', () => {
    // Reverses the prior "nested function in data is allowed" decision: the
    // file-level cpd-exclusion means a function-valued property still ships its
    // duplicable body past the gate. A faithful snapshot is serialisable data,
    // so the stricter rule has no false-positive cost. (Owner-directed
    // strictness, 2026-05-29.)
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = { a: 1 };',
      'export const TAINTED: unknown = { transform: () => 1 };',
      '',
    ].join('\n');

    expect(checkRules(content)).toStrictEqual(['logic-export-forbidden']);
  });

  it('does not over-reach: a deep literal data tree with no functions is allowed', () => {
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = { a: [1, 2, { b: "x", c: [true, null] }], d: { e: 3 } };',
      '',
    ].join('\n');

    expect(findExternalDataViolations([{ path: PATH, content }])).toStrictEqual([]);
  });

  it('does not over-reach: a type-only re-export is allowed (erased at emit)', () => {
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = {};',
      "export type { Foo } from './types.js';",
      '',
    ].join('\n');

    expect(findExternalDataViolations([{ path: PATH, content }])).toStrictEqual([]);
  });

  it('does not over-reach: an ambient `declare` block is allowed (erased at emit)', () => {
    const content = [
      '/** Provenance: x */',
      'export const RAW: unknown = {};',
      'declare namespace Types {',
      '  export function helper(): number;',
      '}',
      '',
    ].join('\n');

    // Ambient declarations carry no runtime, so they cannot bypass the gate.
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

  it.each([
    {
      label: 'namespace with a function',
      logic: 'export namespace Evil { export function fn() { return 1; } }',
    },
    {
      label: 'module with a function',
      logic: 'export module Evil { export function fn() { return 1; } }',
    },
    { label: 'non-exported arrow helper', logic: 'const helper = () => 1;' },
    { label: 'non-exported function declaration', logic: 'function helper() { return 1; }' },
    { label: 'named value re-export', logic: "export { thing } from './logic.js';" },
    { label: 'star value re-export', logic: "export * from './logic.js';" },
    { label: 'import-equals require', logic: "import lib = require('./logic.js');" },
    {
      label: 'export-default object with a method',
      logic: 'export default { run() { return 1; } };',
    },
    { label: 'export-default identifier', logic: 'export default RAW;' },
    {
      label: 'IIFE initialiser',
      logic: 'export const X: unknown = (function () { return 1; })();',
    },
    {
      label: 'cast-wrapped function value',
      logic: 'export const Y: unknown = (() => 1) as unknown;',
    },
    { label: 'function nested in an array', logic: 'export const Z: unknown = [1, () => 2];' },
  ])('forbids runtime logic anywhere in the file: $label', ({ logic }) => {
    const content = ['/** Provenance: x */', 'export const RAW: unknown = {};', logic, ''].join(
      '\n',
    );

    // The clean `RAW` baseline satisfies the data requirement, so the logic
    // vector is the sole expected violation — assert exactly, not just contains.
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
