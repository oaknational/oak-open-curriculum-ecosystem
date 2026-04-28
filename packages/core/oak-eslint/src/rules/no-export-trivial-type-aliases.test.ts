import { noExportTrivialTypeAliasesRule } from './no-export-trivial-type-aliases.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-export-trivial-type-aliases', noExportTrivialTypeAliasesRule, {
  valid: [
    // Re-exporting a type directly is fine (not an alias)
    "export { Foo } from './foo';",
    // Exporting a non-trivial alias
    'export type Foo = Bar | Baz;',
    // Exporting a generic alias
    'export type Foo<T> = Bar<T>;',
    // Exporting an alias to a non-imported type
    'export type Foo = string;',
    // Exporting an alias to a locally defined type (not imported)
    'type Local = string; export type Foo = Local;',
  ],
  invalid: [
    {
      code: "import { Bar } from './bar'; export type Foo = Bar;",
      errors: [{ messageId: 'aliasNotAllowed' }],
    },
    {
      code: "import { Bar } from './bar'; export type Foo = Bar.Baz;",
      errors: [{ messageId: 'aliasNotAllowed' }],
    },
  ],
});
