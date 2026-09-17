import { describe, expect, it } from 'vitest';

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { serialiseCanonicalJson } from './canonical-json.js';

const decode = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);
const sparseArray: unknown[] = [1];
sparseArray.length = 3;
sparseArray[2] = 3;

describe('serialiseCanonicalJson', () => {
  it('sorts every object by UTF-16 code units while preserving array order', () => {
    const bytes = unwrapOrThrow(
      serialiseCanonicalJson(
        {
          z: { '2': 'two', '10': 'ten', a: 'letter' },
          a: [{ y: 2, x: 1 }, 'last'],
        },
        1_000,
      ),
    );

    expect(decode(bytes)).toBe(
      [
        '{',
        '  "a": [',
        '    {',
        '      "x": 1,',
        '      "y": 2',
        '    },',
        '    "last"',
        '  ],',
        '  "z": {',
        '    "10": "ten",',
        '    "2": "two",',
        '    "a": "letter"',
        '  }',
        '}',
        '',
      ].join('\n'),
    );
  });

  it.each([
    [{ value: undefined }, 'undefined'],
    [{ value: Number.POSITIVE_INFINITY }, 'non-finite'],
    [sparseArray, 'sparse'],
  ] as const)('refuses non-JSON value %j', (value, message) => {
    const error = unwrapErr(serialiseCanonicalJson(value, 1_000));

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.message).toContain(message);
  });

  it('enforces the limit on the exact terminal-newline UTF-8 bytes', () => {
    expect(decode(unwrapOrThrow(serialiseCanonicalJson({ a: 'é' }, 16)))).toBe(
      '{\n  "a": "é"\n}\n',
    );

    const error = unwrapErr(serialiseCanonicalJson({ a: 'é' }, 15));
    expect(error.code).toBe('RESOURCE_LIMIT');
    expect(error.message).toContain('16 bytes');
  });
});
