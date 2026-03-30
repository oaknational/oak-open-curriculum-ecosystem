import { RuleTester } from 'eslint';
import { describe } from 'vitest';
import { noEslintDisableRule } from './no-eslint-disable.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'off',
  },
});

describe('no-eslint-disable', () => {
  ruleTester.run('no-eslint-disable', noEslintDisableRule, {
    valid: [
      // Normal comment — no disable directive
      { code: '// This is a normal comment\nexport {};' },
      // Enable is allowed
      { code: '/* eslint-enable no-console */\nexport {};' },
      // Block disable with user approval (exact casing)
      { code: '/* eslint-disable no-console -- JC: approved because X */\nexport {};' },
      // Next-line disable with user approval
      { code: '// eslint-disable-next-line no-console -- JC: approved\nexport {};' },
      // Inline disable with user approval
      { code: 'const x = 1; // eslint-disable-line no-console -- JC: approved\nexport {};' },
      // Lowercase approval marker is also accepted
      { code: '/* eslint-disable no-console -- jc: approved */\nexport {};' },
      // Approval marker with description after
      {
        code: '// eslint-disable-next-line no-console -- JC: CLI tooling needs console output\nexport {};',
      },
    ],
    invalid: [
      // Block disable without approval
      {
        code: '/* eslint-disable no-console */\nexport {};',
        errors: [{ messageId: 'eslintDisableBanned' }],
      },
      // Next-line disable without approval
      {
        code: '// eslint-disable-next-line no-console\nexport {};',
        errors: [{ messageId: 'eslintDisableBanned' }],
      },
      // Inline disable without approval
      {
        code: 'const x = 1; // eslint-disable-line no-console\nexport {};',
        errors: [{ messageId: 'eslintDisableBanned' }],
      },
      // ts-ignore is always banned
      {
        code: '// @ts-ignore\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-expect-error directive is always banned
      {
        code: '// @ts-expect-error\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-ignore inline
      {
        code: 'const x = 1; // @ts-ignore\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-expect-error with description is banned
      {
        code: '// @ts-expect-error some description\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-nocheck is banned (file-level suppression)
      {
        code: '// @ts-nocheck\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-ignore with approval marker is STILL banned — TS suppressions have NO exceptions
      {
        code: '// @ts-ignore -- JC: approved\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-expect-error with approval marker is STILL banned
      {
        code: '// @ts-expect-error -- JC: approved\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // ts-nocheck with approval marker is STILL banned — completes the no-exceptions matrix
      {
        code: '// @ts-nocheck -- JC: approved\nconst x = 1;\nexport {};',
        errors: [{ messageId: 'tsDirectiveBanned' }],
      },
      // Multiple violations in one file
      {
        code: '/* eslint-disable no-console */\n// eslint-disable-next-line no-console\nexport {};',
        errors: [{ messageId: 'eslintDisableBanned' }, { messageId: 'eslintDisableBanned' }],
      },
    ],
  });
});
