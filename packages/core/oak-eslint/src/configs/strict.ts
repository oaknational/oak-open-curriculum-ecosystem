import tseslint from 'typescript-eslint';
import vitestPlugin from '@vitest/eslint-plugin';
import { recommended, RECOMMENDED_RESTRICTED_TYPES } from './recommended.js';

/**
 * Strict shared lint config for Oak workspaces.
 *
 * @remarks
 * Composes the recommended config with strict-only escalations and the
 * vitest test-shape immune surface (PDR-044 § Memetic Immune System,
 * principles.md § Architectural Excellence Over Expediency,
 * principles.md § Code Quality "no skipped tests"). The
 * `vitest/no-disabled-tests` and `vitest/no-focused-tests` rules at
 * `'error'` severity prevent reintroduction of `it.skip`,
 * `describe.skip`, `it.only`, `describe.only`, and adjacent
 * skipping/focusing mechanisms after the binary deletion of those
 * patterns recorded in the plan
 * `agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md`
 * (§Issue 1). The behaviour is exercised by `strict.unit.test.ts`.
 *
 * Per PDR-038 §2026-05-04 amendment, doctrine without enforcement is a
 * net liability at maturity; this config is the structural reciprocation
 * for the stated principle.
 */
/**
 * Minimum length for the substantive description that must accompany a
 * `@ts-expect-error` directive. The threshold is matched against the
 * `@typescript-eslint/ban-ts-comment` rule's `minimumDescriptionLength`
 * option.
 *
 * Ten characters is sufficient to filter trivial annotations ("TODO",
 * "fix", "later") while permitting genuine one-sentence rationales such
 * as "upstream type mismatch" or "schema regen pending". The contract
 * is exercised by `strict.unit.test.ts`.
 *
 * Anchors: PDR-044 (Memetic Immune System) §Innate immunity;
 * principles.md §Compiler Time Types and Runtime Validation; the
 * doctrine-enforcement-quick-wins plan §Issue 2.
 */
const TS_EXPECT_ERROR_MINIMUM_DESCRIPTION_LENGTH = 10;

export const strict = tseslint.config(
  recommended,
  {
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: TS_EXPECT_ERROR_MINIMUM_DESCRIPTION_LENGTH,
        },
      ],
    },
  },
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
                'See principles.md "No type shortcuts".',
            },
            'Record<string, any>': {
              message:
                'FORBIDDEN: Record<string, any> destroys type information. ' +
                'Use a specific type, Zod schema, or generic parameter. ' +
                'See principles.md "No type shortcuts".',
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
);
