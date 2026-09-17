import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type TotalsSemanticInput, validateTotalsSemantics } from './semantic-validation.js';

const DEFINITIONS: TotalsSemanticInput['definitions'] = [
  {
    id: 'array',
    class: 'runtime-value-structure',
    astKinds: ['ArrayLiteralExpression'],
    namedReferences: [],
    callNames: [],
  },
  {
    id: 'interface',
    class: 'type-model-structure',
    astKinds: ['InterfaceDeclaration'],
    namedReferences: [],
    callNames: [],
  },
];

const AUTHORED_FILE: TotalsSemanticInput['files'][number] = {
  path: 'a.ts',
  parseStatus: 'parsed',
  provenance: 'authored',
  verificationOnly: 'absent',
  constructCounts: [
    { id: 'array', count: 2 },
    { id: 'interface', count: 1 },
  ],
  typeTruthCounts: [
    { id: 'type-assertion', count: 0 },
    { id: 'any-keyword', count: 1 },
    { id: 'unknown-keyword', count: 2 },
    { id: 'non-null-assertion', count: 3 },
    { id: 'typescript-suppression', count: 4 },
    { id: 'record-string-unknown', count: 5 },
    { id: 'zod-unknown', count: 6 },
  ],
};

const GENERATED_FILE: TotalsSemanticInput['files'][number] = {
  path: 'generated/b.ts',
  parseStatus: 'parsed-with-diagnostics',
  provenance: 'generated-confirmed',
  verificationOnly: 'present',
  constructCounts: [
    { id: 'array', count: 3 },
    { id: 'interface', count: 0 },
  ],
  typeTruthCounts: [
    { id: 'type-assertion', count: 1 },
    { id: 'any-keyword', count: 2 },
    { id: 'unknown-keyword', count: 3 },
    { id: 'non-null-assertion', count: 4 },
    { id: 'typescript-suppression', count: 5 },
    { id: 'record-string-unknown', count: 6 },
    { id: 'zod-unknown', count: 7 },
  ],
};

const UNSUPPORTED_FILE: TotalsSemanticInput['files'][number] = {
  path: 'unsupported.ts',
  parseStatus: 'not-attempted',
  provenance: 'unknown',
  verificationOnly: 'not-probed',
  constructCounts: [],
  typeTruthCounts: [],
};

const CONSTRUCT_TOTALS: TotalsSemanticInput['constructTotals'] = [
  {
    id: 'array',
    total: 5,
    authored: 2,
    generatedConfirmed: 3,
    generatedDeclaredUnconfirmed: 0,
    imported: 0,
    unknown: 0,
    verificationOnly: 3,
    nonVerification: 2,
    verificationUnresolved: 0,
  },
  {
    id: 'interface',
    total: 1,
    authored: 1,
    generatedConfirmed: 0,
    generatedDeclaredUnconfirmed: 0,
    imported: 0,
    unknown: 0,
    verificationOnly: 0,
    nonVerification: 1,
    verificationUnresolved: 0,
  },
];

const TYPE_TRUTH_TOTALS: TotalsSemanticInput['typeTruthTotals'] = [
  { id: 'type-assertion', count: 1 },
  { id: 'any-keyword', count: 3 },
  { id: 'unknown-keyword', count: 5 },
  { id: 'non-null-assertion', count: 7 },
  { id: 'typescript-suppression', count: 9 },
  { id: 'record-string-unknown', count: 11 },
  { id: 'zod-unknown', count: 13 },
];

const VALID_INPUT: TotalsSemanticInput = {
  definitions: DEFINITIONS,
  files: [AUTHORED_FILE, GENERATED_FILE, UNSUPPORTED_FILE],
  constructTotals: CONSTRUCT_TOTALS,
  typeTruthTotals: TYPE_TRUTH_TOTALS,
};

describe('validateTotalsSemantics', () => {
  it('recomputes both independent construct partitions and every type-truth total', () => {
    expect(validateTotalsSemantics(VALID_INPUT)).toEqual({ ok: true, value: undefined });
  });

  it.each([
    {
      name: 'definition order',
      input: { ...VALID_INPUT, definitions: [DEFINITIONS[1], DEFINITIONS[0]] },
      message: 'construct definitions are not in class/id order',
    },
    {
      name: 'parsed-file construct order',
      input: {
        ...VALID_INPUT,
        files: [
          {
            ...AUTHORED_FILE,
            constructCounts: [
              { id: 'interface', count: 1 },
              { id: 'array', count: 2 },
            ],
          },
          GENERATED_FILE,
          UNSUPPORTED_FILE,
        ],
      },
      message: "construct counts do not match definitions for 'a.ts'",
    },
    {
      name: 'unparsed-file counts',
      input: {
        ...VALID_INPUT,
        files: [
          AUTHORED_FILE,
          GENERATED_FILE,
          { ...UNSUPPORTED_FILE, constructCounts: [{ id: 'array', count: 0 }] },
        ],
      },
      message: "non-parsed file 'unsupported.ts' has analysis counts",
    },
    {
      name: 'construct total',
      input: {
        ...VALID_INPUT,
        constructTotals: [{ ...CONSTRUCT_TOTALS[0], total: 4 }, CONSTRUCT_TOTALS[1]],
      },
      message: "construct total 'array' does not match per-file counts",
    },
    {
      name: 'type-truth order',
      input: {
        ...VALID_INPUT,
        files: [
          {
            ...AUTHORED_FILE,
            typeTruthCounts: [
              { id: 'zod-unknown', count: 6 },
              { id: 'record-string-unknown', count: 5 },
              { id: 'typescript-suppression', count: 4 },
              { id: 'non-null-assertion', count: 3 },
              { id: 'unknown-keyword', count: 2 },
              { id: 'any-keyword', count: 1 },
              { id: 'type-assertion', count: 0 },
            ],
          },
          GENERATED_FILE,
          UNSUPPORTED_FILE,
        ],
      },
      message: "type-truth counts are not in vocabulary order for 'a.ts'",
    },
    {
      name: 'type-truth total',
      input: {
        ...VALID_INPUT,
        typeTruthTotals: [
          { id: 'type-assertion', count: 1 },
          { id: 'any-keyword', count: 3 },
          { id: 'unknown-keyword', count: 5 },
          { id: 'non-null-assertion', count: 7 },
          { id: 'typescript-suppression', count: 9 },
          { id: 'record-string-unknown', count: 11 },
          { id: 'zod-unknown', count: 99 },
        ],
      },
      message: "type-truth total 'zod-unknown' does not match per-file counts",
    },
  ] satisfies readonly {
    readonly name: string;
    readonly input: TotalsSemanticInput;
    readonly message: string;
  }[])('rejects a contradictory $name', ({ input, message }) => {
    const error = unwrapErr(validateTotalsSemantics(input));

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.message).toContain(message);
  });
});
