import { noAgentSubstrateAccessRule } from './no-agent-substrate-access.js';
import { ruleTester } from '../test-support/rule-tester.js';

// ESLint's file engine supplies ABSOLUTE physical paths in production, so the
// fixtures mirror that. The read boundary is architectural: it applies to
// product AND test files alike.
const APP_TEST_FILE = '/repo/apps/oak-search-cli/src/lib/indexing/example.integration.test.ts';
const APP_PRODUCT_FILE = '/repo/apps/oak-search-cli/src/lib/indexing/loader.ts';
const AGENT_TOOLS_FILE = '/repo/agent-tools/src/repo-check/repo-check.ts';

ruleTester.run('no-agent-substrate-access', noAgentSubstrateAccessRule, {
  valid: [
    // A `.agent/` string asserted as data, not read — not flagged.
    {
      filename: APP_TEST_FILE,
      code: `expect(citation).toBe('.agent/rules/never-disable-checks.md');`,
    },
    // An fs read of a non-substrate path — the rule discriminates on the path,
    // not on "any fs read".
    {
      filename: APP_PRODUCT_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('fixtures/sample.json', 'utf8');`,
    },
    // A generic `.open()` on a non-fs receiver — not an fs read, so not flagged
    // (the discrimination half that pairs with the `fs.open` invalid case).
    {
      filename: APP_PRODUCT_FILE,
      code: `window.open('.agent/rules/index.md');`,
    },
    // agent-tools (the sanctioned operator) reading the substrate — exempt.
    {
      filename: AGENT_TOOLS_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('.agent/state/collaboration/active-claims.json', 'utf8');`,
    },
  ],

  invalid: [
    // An fs read of the substrate in PRODUCT code — fires (architectural, not
    // test-hygiene), via a bare named fs import.
    {
      filename: APP_PRODUCT_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('.agent/memory/active/distilled.md', 'utf8');`,
      errors: [{ messageId: 'agentSubstrateRead' }],
    },
    // `fs.open` of the substrate — fires via a member call on an fs binding.
    // Pairs with the `window.open` valid case: the fs binding decides, not the
    // generic method name.
    {
      filename: APP_PRODUCT_FILE,
      code: `import fs from 'node:fs';\nfs.open('.agent/state/socket', () => {});`,
      errors: [{ messageId: 'agentSubstrateRead' }],
    },
    // new URL into the substrate (the gap-ledger construction shape).
    {
      filename: APP_TEST_FILE,
      code: `const ledger = new URL('.agent/plans/x/field-gap-ledger.json', 'file:///repo/');`,
      errors: [{ messageId: 'agentSubstrateUrl' }],
    },
  ],
});
