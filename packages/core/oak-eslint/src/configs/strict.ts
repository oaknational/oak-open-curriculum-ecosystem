import type { Linter } from 'eslint';
import { recommended, RECOMMENDED_RESTRICTED_TYPES } from './recommended.js';

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
            ...RECOMMENDED_RESTRICTED_TYPES,
            'Record<string, unknown>': {
              message:
                'FORBIDDEN: Record<string, unknown> destroys type information. ' +
                'Use a specific type, Zod schema, or generic parameter. ' +
                'See rules.md "No type shortcuts".',
            },
            'Record<string, any>': {
              message:
                'FORBIDDEN: Record<string, any> destroys type information. ' +
                'Use a specific type, Zod schema, or generic parameter. ' +
                'See rules.md "No type shortcuts".',
            },
            object: {
              message:
                'FORBIDDEN: object type is too vague. ' +
                'Use a specific type that describes the actual shape.',
            },
            Object: {
              message:
                'FORBIDDEN: Object accepts any non-nullish value (identical to {}). ' +
                'Use a specific type that describes the actual shape.',
            },
            Function: {
              message:
                'FORBIDDEN: Function accepts any callable with no parameter or return type safety. ' +
                'Use a specific function signature, e.g. (arg: string) => number.',
            },
            'unknown[]': {
              message:
                'FORBIDDEN: unknown[] destroys type information. ' +
                'What is the real shape of the data? Use a specific array type.',
            },
            '{}': {
              message:
                'FORBIDDEN: {} accepts any non-nullish value — it destroys type information. ' +
                'Use a specific type that describes the actual shape.',
            },
          },
        },
      ],
    },
  },
];
