import { noConditionalTestsRule } from './no-conditional-tests.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-conditional-tests', noConditionalTestsRule, {
  valid: [
    // Deterministic enumeration over a literal dataset registers every row on
    // every host, which is what the dividing line actually asks for.
    {
      code: "it.each([1, 2])('doubles %i', (n) => {\n  expect(n * 2).toBe(n + n);\n});",
    },
    {
      code: "describe.each(['a', 'b'])('case %s', (letter) => {\n  it('holds', () => {});\n});",
    },
    // The member name alone is not the offence — it has to hang off a test callee.
    {
      code: 'const scheduler = { skipIf: () => undefined };\nscheduler.skipIf();',
    },
    {
      code: "it('runs everywhere', () => {\n  expect(true).toBe(true);\n});",
    },
    // A namespace import of something that is not Vitest does not make every
    // `.skipIf` on it a test guard.
    {
      code: "import * as scheduler from 'node:timers';\nscheduler.it.skipIf(slow)('x', () => {});",
    },
    // A LOCAL that happens to be spelled like a Vitest entry point is not one.
    // This rule is error-level for the whole repository, so a bare name match
    // would fail lint on unrelated code.
    {
      code: 'const test = scheduler;\ntest.skipIf(slow);',
    },
    {
      code: 'function run(describe) {\n  describe.runIf(live);\n}',
    },
    {
      code: "import { it } from './my-own-helpers.js';\nit.skipIf(slow)('x', () => {});",
    },
    // The SAME shadowing question on the namespace branch, which a spelling
    // test answered wrongly for one round after it was fixed on the other.
    {
      code: "import * as vitest from 'vitest';\nfunction run(vitest) {\n  vitest.it.skipIf(slow)('x', () => {});\n}",
    },
    {
      code: "import * as vitest from 'vitest';\nconst render = (vitest) => vitest['it'].runIf(live)('y', () => {});",
    },
  ],
  invalid: [
    // The exact shape a succession record handed a seat on 2026-09-11.
    {
      code: "it.skipIf(process.platform === 'win32')('writes 0600', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "test.skipIf(process.env.CI)('local only', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "describe.runIf(hasNetwork)('live calls', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    // Chained forms bottom out at the same callee and must not slip through.
    {
      code: "it.each([1])('case %i', (n) => {});\nit.concurrent.skipIf(slow)('later', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    // `suite` is Vitest's own alias for `describe`; banning one spelling of a
    // construct and not the other is not a ban.
    {
      code: "suite.skipIf(process.platform === 'win32')('windows', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    // An import alias renames the identifier, not the construct. Recognising
    // only the exported spellings leaves the gate open to ordinary, legal
    // syntax — which would make the rule file's enforcement claim false.
    {
      code: "import { it as spec } from 'vitest';\nspec.skipIf(process.platform === 'win32')('writes 0600', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "import { describe as group } from 'vitest';\ngroup.runIf(hasNetwork)('live', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    // Reached through a namespace import, including the chained form.
    {
      code: "import * as vitest from 'vitest';\nvitest.it.skipIf(slow)('x', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "import * as vitest from 'vitest';\nvitest.describe.concurrent.runIf(live)('y', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    // Bracketed access is the same call in different syntax, at the guard and
    // at the namespace root alike.
    {
      code: "it['skipIf'](process.platform === 'win32')('writes 0600', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "import { it as spec } from 'vitest';\nspec['runIf'](live)('x', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
    {
      code: "import * as vitest from 'vitest';\nvitest['it'].skipIf(slow)('x', () => {});",
      errors: [{ messageId: 'conditionalTestBanned' }],
    },
  ],
});
