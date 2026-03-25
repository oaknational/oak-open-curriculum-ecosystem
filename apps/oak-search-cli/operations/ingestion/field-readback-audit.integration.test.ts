/**
 * Integration tests for the field readback audit composition root.
 *
 * @remarks
 * These tests prove the command composition resolves env from the script
 * directory and resolves repo-root-relative ledgers through injected fakes,
 * without filesystem or Elasticsearch IO.
 */
import { expect, it } from 'vitest';
import { DEFAULT_FIELD_READBACK_LEDGER_PATH } from './field-readback-audit-cli.js';
import { runFieldReadbackAuditCommand } from './field-readback-audit.js';
import {
  createCommandCallLog,
  createCommandDeps,
  FAILED_RESULT,
  JSON_RESULT,
  REPO_ROOT,
  SCRIPT_DIR,
  TEST_MODULE_URL,
} from './field-readback-audit.test-support.js';

it('loads env from the script directory and resolves explicit relative ledgers from the repo root', async () => {
  const callLog = createCommandCallLog();
  const processEnv = {
    SEARCH_INDEX_VERSION: 'v2026-03-24-123456',
  };

  await runFieldReadbackAuditCommand(
    ['--ledger', 'fixtures/empty-ledger.json', '--target-version', 'v2026-03-24-123456'],
    processEnv,
    TEST_MODULE_URL,
    createCommandDeps(callLog),
  );

  expect(callLog.loadRuntimeConfigProcessEnv).toEqual(processEnv);
  expect(callLog.loadRuntimeConfigStartDir).toBe(SCRIPT_DIR);
  expect(callLog.repoRootLookupStartDir).toBe(SCRIPT_DIR);
  expect(callLog.ledgerPath).toBe('/repo/root/fixtures/empty-ledger.json');
  expect(callLog.targetVersion).toBe('v2026-03-24-123456');
  expect(callLog.stdout).toEqual(['Field readback audit complete. entries=0\n']);
  expect(callLog.exitCodes).toEqual([]);
  expect(callLog.closed).toBe(true);
});

it('uses the default repo-root-relative ledger path when --ledger is omitted', async () => {
  const callLog = createCommandCallLog();

  await runFieldReadbackAuditCommand([], {}, TEST_MODULE_URL, createCommandDeps(callLog));

  expect(callLog.ledgerPath).toBe(`${REPO_ROOT}/${DEFAULT_FIELD_READBACK_LEDGER_PATH}`);
  expect(callLog.attempts).toBe(6);
  expect(callLog.intervalMs).toBe(5000);
  expect(callLog.targetVersion).toBeUndefined();
  expect(callLog.exitCodes).toEqual([]);
  expect(callLog.closed).toBe(true);
});

it('fails fast on env validation errors before attempting ledger IO', async () => {
  const callLog = createCommandCallLog();
  const commandDeps = createCommandDeps(callLog);

  await expect(
    runFieldReadbackAuditCommand(['--ledger', 'fixtures/empty-ledger.json'], {}, TEST_MODULE_URL, {
      ...commandDeps,
      loadRuntimeConfig: () => ({
        ok: false as const,
        error: {
          message: 'Set OAK_API_KEY.',
          diagnostics: [],
        },
      }),
    }),
  ).rejects.toThrow('Environment validation failed: Set OAK_API_KEY.');

  expect(callLog.ledgerPath).toBeUndefined();
  expect(callLog.closed).toBe(false);
  expect(callLog.repoRootLookupStartDir).toBeUndefined();
  expect(callLog.stdout).toEqual([]);
});

it('emits JSON output when requested', async () => {
  const callLog = createCommandCallLog();

  await runFieldReadbackAuditCommand(
    ['--emit-json'],
    {},
    TEST_MODULE_URL,
    createCommandDeps(callLog, JSON_RESULT),
  );

  expect(callLog.stdout).toEqual([`${JSON.stringify(JSON_RESULT, null, 2)}\n`]);
  expect(callLog.exitCodes).toEqual([]);
  expect(callLog.closed).toBe(true);
});

it('writes failure output and sets exit code for unsuccessful text-mode audits', async () => {
  const callLog = createCommandCallLog();

  await runFieldReadbackAuditCommand(
    [],
    {},
    TEST_MODULE_URL,
    createCommandDeps(callLog, FAILED_RESULT),
  );

  expect(callLog.stdout).toEqual([
    'Field readback audit complete. entries=0\n',
    'Missing mapping for oak_lessons.category\n',
  ]);
  expect(callLog.exitCodes).toEqual([1]);
  expect(callLog.closed).toBe(true);
});

it('emits JSON and sets exit code for unsuccessful JSON-mode audits', async () => {
  const callLog = createCommandCallLog();

  await runFieldReadbackAuditCommand(
    ['--emit-json'],
    {},
    TEST_MODULE_URL,
    createCommandDeps(callLog, FAILED_RESULT),
  );

  expect(callLog.stdout).toEqual([`${JSON.stringify(FAILED_RESULT, null, 2)}\n`]);
  expect(callLog.exitCodes).toEqual([1]);
  expect(callLog.closed).toBe(true);
});
