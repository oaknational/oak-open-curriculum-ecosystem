import type { Linter } from 'eslint';
import { recommended } from './recommended.js';

export const strict: Linter.Config[] = [
  ...recommended,
  {
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Object',
          property: 'keys',
          message:
            'Use typeSafeKeys<T>() for typed keys. Object.keys() returns string[] which loses type information.',
        },
        {
          object: 'Object',
          property: 'values',
          message: 'Use typeSafeValues<T>() for typed values.',
        },
        {
          object: 'Object',
          property: 'entries',
          message: 'Use typeSafeEntries<T>() for typed entries.',
        },
        {
          object: 'Reflect',
          message: 'Avoid Reflect API as it bypasses type safety.',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            'Record<string, unknown>': {
              message:
                'Avoid Record<string, unknown>. It destroys type information. Refactor or use a defined type.',
            },
            object: {
              message: 'Avoid object type. It is too vague.',
            },
          },
        },
      ],
    },
  },
];
