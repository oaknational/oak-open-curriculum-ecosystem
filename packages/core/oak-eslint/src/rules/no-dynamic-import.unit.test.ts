import { noDynamicImportRule } from './no-dynamic-import.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-dynamic-import', noDynamicImportRule, {
  valid: [
    {
      code: "import { readFile } from 'node:fs/promises';\nawait readFile('package.json', 'utf8');",
    },
    {
      code: "import './bootstrap.js';\nexport const ready = true;",
    },
  ],
  invalid: [
    {
      code: "const module = await import('./module.js');\nexport { module };",
      errors: [{ messageId: 'dynamicImportBanned' }],
    },
    {
      code: "const loader = () => import('./module.js');\nexport { loader };",
      errors: [{ messageId: 'dynamicImportBanned' }],
    },
  ],
});
