import { describe, expect, it } from 'vitest';
import {
  evaluateMaxFilesPerDir,
  maxFilesPerDirRule,
  type DirectoryInventory,
} from './max-files-per-dir.js';
import { ruleTester } from '../test-support/rule-tester.js';

const SAMPLE_INVENTORIES: readonly DirectoryInventory[] = [
  {
    directory: '/repo/packages/core/oak-eslint/src/rules',
    files: ['a.ts', 'b.ts', 'c.ts'],
  },
  {
    directory: '/repo/ignored',
    files: ['a.ts', 'b.ts', 'c.ts'],
  },
  {
    directory: '/repo/packages/core/oak-eslint/src/configs',
    files: ['index.ts', 'strict.ts'],
  },
];

describe('evaluateMaxFilesPerDir', () => {
  it('reports the alphabetically first matching file for an overfull directory inventory', () => {
    expect(
      evaluateMaxFilesPerDir({
        filePath: '/repo/packages/core/oak-eslint/src/rules/a.ts',
        inventories: SAMPLE_INVENTORIES,
        pattern: '*.ts',
        maxFiles: 2,
        ignoreDirs: [],
      }),
    ).toEqual({
      dir: '/repo/packages/core/oak-eslint/src/rules',
      actual: 3,
      pattern: '*.ts',
      max: 2,
    });
  });

  it('ignores non-anchor files, ignored directories, and directories within the cap', () => {
    expect(
      evaluateMaxFilesPerDir({
        filePath: '/repo/packages/core/oak-eslint/src/rules/b.ts',
        inventories: SAMPLE_INVENTORIES,
        pattern: '*.ts',
        maxFiles: 2,
        ignoreDirs: [],
      }),
    ).toBeNull();

    expect(
      evaluateMaxFilesPerDir({
        filePath: '/repo/ignored/a.ts',
        inventories: SAMPLE_INVENTORIES,
        pattern: '*.ts',
        maxFiles: 2,
        ignoreDirs: ['/repo/ignored'],
      }),
    ).toBeNull();

    expect(
      evaluateMaxFilesPerDir({
        filePath: '/repo/packages/core/oak-eslint/src/configs/index.ts',
        inventories: SAMPLE_INVENTORIES,
        pattern: '*.ts',
        maxFiles: 2,
        ignoreDirs: [],
      }),
    ).toBeNull();
  });
});

ruleTester.run('max-files-per-dir', maxFilesPerDirRule, {
  valid: [
    {
      code: 'export {};',
      filename: '/repo/packages/core/oak-eslint/src/configs/index.ts',
      options: [{ maxFiles: 2, pattern: '*.ts', inventories: SAMPLE_INVENTORIES }],
    },
    {
      code: 'export {};',
      filename: '/repo/packages/core/oak-eslint/src/rules/b.ts',
      options: [{ maxFiles: 2, pattern: '*.ts', inventories: SAMPLE_INVENTORIES }],
    },
    {
      code: 'export {};',
      filename: '/repo/ignored/a.ts',
      options: [
        {
          maxFiles: 2,
          pattern: '*.ts',
          inventories: SAMPLE_INVENTORIES,
          ignoreDirs: ['/repo/ignored'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'export {};',
      filename: '/repo/packages/core/oak-eslint/src/rules/a.ts',
      options: [{ maxFiles: 2, pattern: '*.ts', inventories: SAMPLE_INVENTORIES }],
      errors: [{ messageId: 'tooManyFiles' }],
    },
  ],
});
