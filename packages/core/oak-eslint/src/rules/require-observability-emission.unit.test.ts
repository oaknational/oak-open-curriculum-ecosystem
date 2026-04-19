import { RuleTester } from 'eslint';
import { describe } from 'vitest';
import { requireObservabilityEmissionRule } from './require-observability-emission.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

const APP_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.ts';
const SDK_FILE = 'packages/sdks/oak-curriculum-sdk/src/handlers/example.ts';
const OUT_OF_SCOPE_CORE_FILE = 'packages/core/foo/src/bar.ts';
const OUT_OF_SCOPE_LIB_FILE = 'packages/libs/sentry-node/src/bar.ts';
const APP_TEST_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.test.ts';
const APP_UNIT_TEST_FILE =
  'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.unit.test.ts';
// Absolute-path filename — exercises the `(?:^|/)` branch of the scope regex,
// which is the code path that fires in real ESLint runs (physicalFilename is
// always absolute outside of RuleTester).
const APP_FILE_ABSOLUTE =
  '/Users/example/repo/apps/oak-curriculum-mcp-streamable-http/src/handlers/absolute.ts';

describe('require-observability-emission', () => {
  ruleTester.run('require-observability-emission', requireObservabilityEmissionRule, {
    valid: [
      // 1. Exported async function in apps/** with logger.info.
      {
        filename: APP_FILE,
        code: `
          export async function handleRequest() {
            logger.info('request received');
          }
        `,
      },
      // 2. Exported async function in packages/sdks/** with Sentry.captureException.
      {
        filename: SDK_FILE,
        code: `
          export async function fetchThing() {
            try { return await doIt(); } catch (error) { Sentry.captureException(error); throw error; }
          }
        `,
      },
      // 3. Exported async function with any Sentry.* call.
      {
        filename: APP_FILE,
        code: `
          export async function doThing() {
            Sentry.addBreadcrumb({ message: 'x' });
          }
        `,
      },
      // 4a. logger.error / logger.warn / logger.debug.
      {
        filename: APP_FILE,
        code: `
          export async function a() { logger.error('x'); }
          export async function b() { logger.warn('y'); }
          export async function c() { logger.debug('z'); }
        `,
      },
      // 4b. Bare log() call.
      {
        filename: APP_FILE,
        code: `export async function withBareLog() { log('x'); }`,
      },
      // 5. Private (non-exported) async function with no emission — out of scope.
      {
        filename: APP_FILE,
        code: `async function privateFn() { return 42; }`,
      },
      // 6a. Test file (`.test.ts`) — exempt regardless of scope.
      {
        filename: APP_TEST_FILE,
        code: `export async function testHelper() { return 42; }`,
      },
      // 6b. `.unit.test.ts` — exempt.
      {
        filename: APP_UNIT_TEST_FILE,
        code: `export async function anotherTestHelper() { return 42; }`,
      },
      // 7a. Out-of-scope core path — exempt.
      {
        filename: OUT_OF_SCOPE_CORE_FILE,
        code: `export async function coreFn() { return 42; }`,
      },
      // 7b. Out-of-scope lib path — exempt.
      {
        filename: OUT_OF_SCOPE_LIB_FILE,
        code: `export async function libFn() { return 42; }`,
      },
      // 8a. Delegate-call pattern: injected logger.
      {
        filename: APP_FILE,
        code: `
          export async function handleWithDeps(deps) {
            deps.logger.info('delegated');
          }
        `,
      },
      // 8b. Delegate-call pattern: observability adapter with emit().
      {
        filename: SDK_FILE,
        code: `
          export async function doWork(observability) {
            observability.emit({ name: 'thing' });
          }
        `,
      },
      // 8c. Delegate-call pattern: span-based trace emission via withSpan.
      //     Represents apps/oak-curriculum-mcp-streamable-http/src/app/upstream-metadata-fetch.ts
      //     `fetchUpstreamMetadata` and apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-proxy.ts
      //     `proxyUpstreamAsset`, which emit solely through withSpan.
      {
        filename: APP_FILE,
        code: `
          export async function fetchThing(deps) {
            return deps.observability.withSpan({ name: 'fetch' }, async () => {
              return { ok: true };
            });
          }
        `,
      },
      // 8d. Delegate-call pattern: span.setAttribute.
      {
        filename: APP_FILE,
        code: `
          export async function tagSpan(span) {
            span.setAttribute('user.id', 'redacted');
          }
        `,
      },
      // 9. Sentinel opt-out comment.
      {
        filename: APP_FILE,
        code: `
          // observability-emission-exempt: pure formatter, no side effects
          export async function pureFormatter(input) {
            return String(input);
          }
        `,
      },
      // Sanity: default-export async arrow with logger call.
      {
        filename: APP_FILE,
        code: `export default async () => { logger.info('default'); };`,
      },
      // Sanity: exported const with async arrow and logger call.
      {
        filename: APP_FILE,
        code: `export const run = async () => { logger.info('run'); };`,
      },
      // Absolute-path filename with emission — scope regex must match via the
      // `^|/` branch, not the `^` branch.
      {
        filename: APP_FILE_ABSOLUTE,
        code: `export async function absoluteOk() { logger.info('abs'); }`,
      },
    ],
    invalid: [
      // Invalid 1: Exported async function in apps/** with no emission.
      {
        filename: APP_FILE,
        code: `export async function doesNothing() { return 42; }`,
        errors: [{ messageId: 'requireEmission', data: { name: 'doesNothing' } }],
      },
      // Invalid 2: Exported async arrow assigned to const in apps/** with no emission.
      {
        filename: APP_FILE,
        code: `export const runsNothing = async () => { return 42; };`,
        errors: [{ messageId: 'requireEmission', data: { name: 'runsNothing' } }],
      },
      // Invalid 3: Exported async in sdks/** calling only console.log (not an emission).
      {
        filename: SDK_FILE,
        code: `export async function logsToConsole() { console.log('not an emission'); }`,
        errors: [{ messageId: 'requireEmission', data: { name: 'logsToConsole' } }],
      },
      // Invalid 4: Default-export async function declaration with no emission.
      {
        filename: APP_FILE,
        code: `export default async function namedDefault() { return 1; }`,
        errors: [{ messageId: 'requireEmission', data: { name: 'namedDefault' } }],
      },
      // Invalid 5: Sentinel with wrong keyword is not an exemption.
      {
        filename: APP_FILE,
        code: `
          // not-the-exempt-keyword: something
          export async function stillRequired() { return 1; }
        `,
        errors: [{ messageId: 'requireEmission', data: { name: 'stillRequired' } }],
      },
      // Invalid 6: Absolute-path filename with no emission — ensures the
      // scope regex's leading-`/` branch fires for real ESLint runs.
      {
        filename: APP_FILE_ABSOLUTE,
        code: `export async function absoluteGap() { return 1; }`,
        errors: [{ messageId: 'requireEmission', data: { name: 'absoluteGap' } }],
      },
    ],
  });
});

// Wave 2 unlock (scheduled, not yet authored):
// Schema-usage detection cases for `@oaknational/observability-events` will be
// added when that workspace exists. They will cover patterns like
// `eventEmit(tool_invoked, { ... })` where `tool_invoked` is a schema import.
// Per `.agent/rules/no-skipped-tests.md`, those cases are NOT stubbed as
// `it.skip` — they are deferred from this file entirely until Wave 2 authors
// them alongside the workspace. See
// `.agent/plans/observability/current/observability-events-workspace.plan.md`.
