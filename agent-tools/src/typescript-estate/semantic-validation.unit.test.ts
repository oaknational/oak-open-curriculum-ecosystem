import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type CoverageSemanticInput, validateCoverageSemantics } from './semantic-validation.js';

const READ_FILE = { path: 'a.ts', readStatus: 'read', parseStatus: 'parsed' } as const;
const INVALID_UTF8_FILE = {
  path: 'nested/b.tsx',
  readStatus: 'invalid-utf8',
  parseStatus: 'not-attempted',
} as const;
const UNSUPPORTED_FILE = {
  path: 'unsupported.ts',
  readStatus: 'unsupported-mode',
  parseStatus: 'not-attempted',
} as const;

const VALID_INPUT: CoverageSemanticInput = {
  coverage: {
    denominator: 3,
    readable: 1,
    parsed: 1,
    parsedWithDiagnostics: 0,
    invalidUtf8: 1,
    unsupportedModes: 1,
    pathsSha256: '2b3f2090c53f3ff0ffb3fc643ba4a624ade137a0a4a562a2ace324824384b4a7',
  },
  files: [READ_FILE, INVALID_UTF8_FILE, UNSUPPORTED_FILE],
};

describe('validateCoverageSemantics', () => {
  it('accepts an exact ordered denominator and independently recomputed state totals', () => {
    expect(validateCoverageSemantics(VALID_INPUT)).toEqual({ ok: true, value: undefined });
  });

  it.each([
    {
      name: 'denominator length',
      input: { ...VALID_INPUT, coverage: { ...VALID_INPUT.coverage, denominator: 4 } },
      message: 'denominator does not equal files.length',
    },
    {
      name: 'read partition',
      input: { ...VALID_INPUT, coverage: { ...VALID_INPUT.coverage, invalidUtf8: 0 } },
      message: 'read-status partition does not equal denominator',
    },
    {
      name: 'parsed total',
      input: { ...VALID_INPUT, coverage: { ...VALID_INPUT.coverage, parsed: 0 } },
      message: 'parsed does not equal readable files',
    },
    {
      name: 'diagnostic total',
      input: {
        ...VALID_INPUT,
        coverage: { ...VALID_INPUT.coverage, parsedWithDiagnostics: 1 },
      },
      message: 'parsedWithDiagnostics does not equal file states',
    },
    {
      name: 'read-status observations',
      input: {
        ...VALID_INPUT,
        files: [READ_FILE, { ...INVALID_UTF8_FILE, readStatus: 'read' }, UNSUPPORTED_FILE],
      },
      message: 'read-status counts do not equal file states',
    },
    {
      name: 'read/parse pairing',
      input: {
        ...VALID_INPUT,
        files: [
          { ...READ_FILE, parseStatus: 'not-attempted' },
          { ...INVALID_UTF8_FILE, parseStatus: 'parsed' },
          UNSUPPORTED_FILE,
        ],
      },
      message: 'read and parse states disagree',
    },
    {
      name: 'path order',
      input: { ...VALID_INPUT, files: [INVALID_UTF8_FILE, READ_FILE, UNSUPPORTED_FILE] },
      message: 'denominator paths must be in strict ascending UTF-16 order',
    },
    {
      name: 'path digest',
      input: {
        ...VALID_INPUT,
        coverage: {
          ...VALID_INPUT.coverage,
          pathsSha256: '0000000000000000000000000000000000000000000000000000000000000000',
        },
      },
      message: 'pathsSha256 does not match the ordered denominator',
    },
  ] satisfies readonly {
    readonly name: string;
    readonly input: CoverageSemanticInput;
    readonly message: string;
  }[])('rejects a contradictory $name', ({ input, message }) => {
    const error = unwrapErr(validateCoverageSemantics(input));

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.message).toContain(message);
  });
});
