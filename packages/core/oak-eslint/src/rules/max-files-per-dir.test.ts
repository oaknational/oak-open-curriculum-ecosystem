import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from './max-files-per-dir.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

import { createRequire } from 'node:module';
import { afterAll, describe, it } from 'vitest';

const require = createRequire(import.meta.url);

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
  },
});

function withTmpDir(setup: (dir: string) => string[]) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'max-files-'));
  const files = setup(tmp);
  return {
    dir: tmp,
    files,
    cleanup: () => fs.rmSync(tmp, { recursive: true, force: true }),
  };
}

ruleTester.run('max-files-per-dir', rule, {
  valid: [
    (() => {
      const { dir, cleanup } = withTmpDir((d) => {
        fs.writeFileSync(path.join(d, 'a.ts'), 'export {};');
        fs.writeFileSync(path.join(d, 'b.ts'), 'export {};');
        return ['a.ts', 'b.ts'];
      });
      return {
        code: 'export {};',
        filename: path.join(dir, 'a.ts'),
        options: [{ maxFiles: 2 }],
        after: cleanup,
      };
    })(),
  ],
  invalid: [
    (() => {
      const { dir, cleanup } = withTmpDir((d) => {
        fs.writeFileSync(path.join(d, 'a.ts'), 'export {};');
        fs.writeFileSync(path.join(d, 'b.ts'), 'export {};');
        fs.writeFileSync(path.join(d, 'c.ts'), 'export {};');
        return ['a.ts', 'b.ts', 'c.ts'];
      });
      return {
        code: 'export {};',
        filename: path.join(dir, 'a.ts'), // Anchor file
        options: [{ maxFiles: 2 }],
        errors: [{ messageId: 'tooManyFiles' }],
        after: cleanup,
      };
    })(),
  ],
});
