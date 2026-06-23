import { noThrowStatementRule } from './no-throw-statement.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-throw-statement', noThrowStatementRule, {
  valid: [
    {
      // A function that fails returns a Result instead of throwing.
      code: 'export function parse(n: number): { ok: boolean } {\n  return { ok: n >= 0 };\n}',
    },
    {
      code: 'export const noop = (): void => {};',
    },
    {
      // A try/catch that returns instead of re-throwing is the sanctioned shape.
      code: 'export function safe(run: () => number): number {\n  try {\n    return run();\n  } catch {\n    return 0;\n  }\n}',
    },
  ],
  invalid: [
    {
      code: "export function parse(n: number): number {\n  if (n < 0) {\n    throw new Error('negative');\n  }\n  return n;\n}",
      errors: [{ messageId: 'throwBanned' }],
    },
    {
      code: "export function boom(): never {\n  throw new TypeError('unreachable');\n}",
      errors: [{ messageId: 'throwBanned' }],
    },
    {
      // A re-throw inside a catch is still a throw the Result pattern replaces.
      code: 'export function wrap(run: () => void): void {\n  try {\n    run();\n  } catch (cause) {\n    throw cause;\n  }\n}',
      errors: [{ messageId: 'throwBanned' }],
    },
  ],
});
