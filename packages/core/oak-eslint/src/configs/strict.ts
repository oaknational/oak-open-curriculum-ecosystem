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
          property: 'get',
          message: 'Use typeSafeGet() instead of Reflect.get for type safety.',
        },
        {
          object: 'Reflect',
          property: 'set',
          message: 'Use typeSafeSet() instead of Reflect.set for type safety.',
        },
        {
          object: 'Reflect',
          property: 'has',
          message: 'Use typeSafeHas() instead of Reflect.has for type safety.',
        },
        {
          object: 'Reflect',
          property: 'ownKeys',
          message: 'Use typeSafeKeys() instead of Reflect.ownKeys for type safety.',
        },
        {
          object: 'Reflect',
          property: 'defineProperty',
          message: 'Avoid Reflect.defineProperty; prefer Object.defineProperty with type checks.',
        },
        {
          object: 'Reflect',
          property: 'deleteProperty',
          message: 'Avoid Reflect.deleteProperty; prefer type-safe deletion patterns.',
        },
        {
          object: 'Reflect',
          property: 'getOwnPropertyDescriptor',
          message: 'Avoid Reflect.getOwnPropertyDescriptor; prefer type-safe alternatives.',
        },
        {
          object: 'Reflect',
          property: 'getPrototypeOf',
          message: 'Avoid Reflect.getPrototypeOf; prefer type-safe alternatives.',
        },
        {
          object: 'Reflect',
          property: 'isExtensible',
          message: 'Avoid Reflect.isExtensible; prefer type-safe alternatives.',
        },
        {
          object: 'Reflect',
          property: 'preventExtensions',
          message: 'Avoid Reflect.preventExtensions; prefer type-safe alternatives.',
        },
        {
          object: 'Reflect',
          property: 'setPrototypeOf',
          message: 'Avoid Reflect.setPrototypeOf; prefer type-safe alternatives.',
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
            'unknown[]': {
              message:
                'unknown[] is not permitted. It destroys type information. What is the real shape of the data?',
            },
          },
        },
      ],
    },
  },
];
