import { createRequire } from 'node:module';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

const require = createRequire(import.meta.url);

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

export const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: require('@typescript-eslint/parser'),
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'off',
  },
});
