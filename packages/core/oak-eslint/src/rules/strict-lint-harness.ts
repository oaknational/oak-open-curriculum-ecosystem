import { Linter } from '@typescript-eslint/utils/ts-eslint';

import { strict } from '../configs/strict.js';

/**
 * Shared engine harness for the vendor-boundary integration pins.
 *
 * Lints a fixture through the REAL strict config with a later
 * `no-restricted-imports` override layered on, proving a dedicated fence
 * survives flat-config replacement semantics. Homed once for the
 * vendor-fence family (consolidate-at-second-consumer; extracted when the
 * `@vercel/functions` fence became the family's second member).
 */

/**
 * Strict-config fixture noise silenced so boundary pins assert only the
 * fence under test, never unrelated strictness on the synthetic fixture.
 */
const STRICT_FIXTURE_RULES_OFF = {
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-deprecated': 'off',
  '@typescript-eslint/consistent-return': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  'sonarjs/no-alphabetical-sort': 'off',
  'sonarjs/void-use': 'off',
  '@typescript-eslint/prefer-optional-chain': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/no-base-to-string': 'off',
  '@typescript-eslint/no-redundant-type-constituents': 'off',
  'sonarjs/concise-regex': 'off',
  'sonarjs/prefer-regexp-exec': 'off',
  'sonarjs/no-redundant-optional': 'off',
  'sonarjs/no-selector-parameter': 'off',
  'sonarjs/regex-complexity': 'off',
  'sonarjs/no-misleading-array-reverse': 'off',
  // Not a typed rule: it resolves the fixture's path against the package on
  // disk to find the test framework, which an in-memory fixture path cannot
  // satisfy.
  'sonarjs/prefer-specific-assertions': 'off',
} as const;

const linter = new Linter({ configType: 'flat' });

export function lintStrictVendorImport(
  specifier: string,
  filename: string,
  source = `import vendorDefault from '${specifier}';\nvoid vendorDefault;`,
) {
  return linter.verify(
    source,
    [
      ...strict,
      {
        rules: {
          '@typescript-eslint/no-restricted-imports': [
            'error',
            {
              paths: [{ name: 'zod', message: "Import from 'zod/v4' instead." }],
            },
          ],
        },
      },
      { rules: STRICT_FIXTURE_RULES_OFF },
    ],
    { filename },
  );
}
