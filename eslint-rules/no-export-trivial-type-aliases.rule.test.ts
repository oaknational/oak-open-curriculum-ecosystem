import { createRequire } from 'node:module';

import { TSESLint } from '@typescript-eslint/utils';

import { noExportTrivialTypeAliasesRule } from './no-export-trivial-type-aliases.js';

const require = createRequire(import.meta.url);

// RuleTester still expects legacy config shapes in its typings. Supply the flat-config style used by ESLint 9.
// @ts-expect-error -- provide flat config default to support ESLint 9
TSESLint.RuleTester.setDefaultConfig({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
  },
});

const ruleTester = new TSESLint.RuleTester();

ruleTester.run('no-export-trivial-type-aliases', noExportTrivialTypeAliasesRule, {
  valid: [
    {
      code: 'type InlineShape = { scope: string; text: string };',
    },
    {
      code: 'export { SearchStructuredRequest as StructuredBody } from "@oak/foo";',
    },
    {
      code: 'import type { SearchStructuredRequest } from "./types";\nexport type StructuredBody = SearchStructuredRequest & { size: number };',
    },
    {
      code: 'import type { SearchStructuredRequest } from "./types";\ntype StructuredBody = SearchStructuredRequest;',
    },
    {
      code: 'import { z } from "zod";\ndeclare const schema: z.ZodTypeAny;\nexport type Derived = z.infer<typeof schema>;',
    },
  ],
  invalid: [
    {
      code: 'import type { SearchStructuredRequest } from "./types";\nexport type StructuredBody = SearchStructuredRequest;',
      errors: [{ messageId: 'aliasNotAllowed' }],
    },
    {
      code: 'import type { SearchNaturalLanguageRequest } from "./types";\nexport type NaturalBody = SearchNaturalLanguageRequest;',
      errors: [{ messageId: 'aliasNotAllowed' }],
    },
  ],
});
