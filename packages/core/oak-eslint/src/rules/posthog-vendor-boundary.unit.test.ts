import { Linter } from '@typescript-eslint/utils/ts-eslint';
import type { Linter as ESLintLinter } from 'eslint';
import { plugin as typescriptEslintPlugin } from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { strict } from '../configs/strict.js';
import {
  appArchitectureRules,
  coreBoundaryRules,
  createLibBoundaryRules,
  createSdkBoundaryRules,
} from './boundary.js';

const VENDOR_IMPORT_SPECIFIERS = [
  'posthog-node',
  'posthog-node/lib',
  '@posthog/mcp',
  '@posthog/mcp/instrumentation',
] as const;

const DENIED_BOUNDARIES = [
  ['app', appArchitectureRules],
  ['core', coreBoundaryRules],
  ['SDK', createSdkBoundaryRules('runtime')],
  ['foundation library', createLibBoundaryRules('logger')],
  ['other adapter', createLibBoundaryRules('sentry-node')],
  ['strict shared config', strictVendorBoundaryRules()],
] as const;

const linter = new Linter({ configType: 'flat' });

function strictVendorBoundaryRules(): Partial<ESLintLinter.RulesRecord> {
  for (let index = strict.length - 1; index >= 0; index -= 1) {
    const rule = strict[index]?.rules?.['@typescript-eslint/no-restricted-imports'];
    if (rule !== undefined) {
      return { '@typescript-eslint/no-restricted-imports': rule };
    }
  }
  return {};
}

function lintVendorImport(
  rules: Partial<ESLintLinter.RulesRecord>,
  specifier: (typeof VENDOR_IMPORT_SPECIFIERS)[number],
) {
  const restrictedImports = rules['@typescript-eslint/no-restricted-imports'];
  if (restrictedImports === undefined) {
    throw new Error('Expected the boundary to configure no-restricted-imports');
  }

  return linter.verify(
    `import vendorDefault from '${specifier}';\nvoid vendorDefault;`,
    [
      {
        files: ['**/*.ts'],
        plugins: {
          '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
          '@typescript-eslint/no-restricted-imports': restrictedImports,
        },
      },
    ],
    { filename: 'src/fixture.ts' },
  );
}

describe('exclusive PostHog vendor boundary', () => {
  describe.each(DENIED_BOUNDARIES)('%s consumer', (_name, rules) => {
    it.each(VENDOR_IMPORT_SPECIFIERS)('rejects %s', (specifier) => {
      const issues = lintVendorImport(rules, specifier);

      expect(issues).toHaveLength(1);
      const issue = issues[0];
      expect(issue).toMatchObject({
        column: 1,
        line: 1,
        ruleId: '@typescript-eslint/no-restricted-imports',
        severity: 2,
      });
      expect(issue?.message).toContain(specifier);
      expect(issue?.message).toContain('packages/libs/posthog-node');
    });
  });

  it.each(VENDOR_IMPORT_SPECIFIERS)('allows the posthog-node adapter to import %s', (specifier) => {
    expect(lintVendorImport(createLibBoundaryRules('posthog-node'), specifier)).toStrictEqual([]);
  });
});
