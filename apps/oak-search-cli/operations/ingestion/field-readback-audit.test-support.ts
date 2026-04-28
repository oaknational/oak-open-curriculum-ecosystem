import { ok } from '@oaknational/result';
import { SearchCliEnvSchema } from '../../src/env.js';
import type { SearchCliRuntimeConfig } from '../../src/runtime-config.js';
import type { FieldReadbackAuditCommandDeps } from './field-readback-audit.js';
import type {
  GapLedger,
  ReadbackAuditDependencies,
  ReadbackAuditResult,
} from './field-readback-audit-lib.js';

export const TEST_MODULE_URL =
  'file:///repo/root/apps/oak-search-cli/operations/ingestion/field-readback-audit.ts';
export const SCRIPT_DIR = '/repo/root/apps/oak-search-cli/operations/ingestion';
export const REPO_ROOT = '/repo/root';

const EMPTY_LEDGER: GapLedger = {
  statuses: ['must_be_populated'],
  fields: [],
};

const SUCCESS_RESULT: ReadbackAuditResult = {
  ok: true,
  entries: [],
  failures: [],
};

export const FAILED_RESULT: ReadbackAuditResult = {
  ok: false,
  entries: [],
  failures: ['Missing mapping for oak_lessons.category'],
};

export const JSON_RESULT: ReadbackAuditResult = {
  ok: true,
  entries: [
    {
      indexFamily: 'lessons',
      fieldName: 'category',
      alias: 'oak_lessons',
      resolvedIndex: 'oak_lessons_v2026_03_24',
      mappingExists: true,
      mappingType: 'keyword',
      existsCount: 12,
      missingCount: 0,
      attemptsUsed: 1,
    },
  ],
  failures: [],
};

const TEST_RUNTIME_CONFIG: SearchCliRuntimeConfig = {
  env: SearchCliEnvSchema.parse({
    ELASTICSEARCH_URL: 'http://localhost:9200',
    ELASTICSEARCH_API_KEY: 'test-api-key-123',
    OAK_API_KEY: 'test-oak-key',
    SEARCH_API_KEY: 'test-search-key-123',
  }),
  logLevel: 'info',
  version: '0.0.0',
  versionSource: 'APP_VERSION_OVERRIDE',
};

export interface FieldReadbackAuditCommandCallLog {
  auditDependencies?: ReadbackAuditDependencies;
  attempts?: number;
  closed: boolean;
  exitCodes: number[];
  intervalMs?: number;
  ledger?: GapLedger;
  ledgerPath?: string;
  loadRuntimeConfigProcessEnv?: Readonly<Record<string, string | undefined>>;
  loadRuntimeConfigStartDir?: string;
  repoRootLookupStartDir?: string;
  runtimeConfig?: SearchCliRuntimeConfig;
  stdout: string[];
  targetVersion?: string;
}

export function createCommandCallLog(): FieldReadbackAuditCommandCallLog {
  return {
    closed: false,
    exitCodes: [],
    stdout: [],
  };
}

function createAuditDependencies(): ReadbackAuditDependencies {
  return {
    resolveAlias: async () => 'unused-index',
    getMappingProperties: async () => ({}),
    getExistsCount: async () => 0,
    getMissingCount: async () => 0,
    sleep: async () => undefined,
  };
}

export function createCommandDeps(
  callLog: FieldReadbackAuditCommandCallLog,
  result: ReadbackAuditResult = SUCCESS_RESULT,
): FieldReadbackAuditCommandDeps {
  return {
    createResources: (runtimeConfig, targetVersion) => {
      callLog.runtimeConfig = runtimeConfig;
      callLog.targetVersion = targetVersion;
      return {
        auditDependencies: createAuditDependencies(),
        client: {
          close: async () => {
            callLog.closed = true;
          },
        },
      };
    },
    findRepoRoot: (startDir) => {
      callLog.repoRootLookupStartDir = startDir;
      return REPO_ROOT;
    },
    loadRuntimeConfig: (options) => {
      callLog.loadRuntimeConfigProcessEnv = options.processEnv;
      callLog.loadRuntimeConfigStartDir = options.startDir;
      return ok(TEST_RUNTIME_CONFIG);
    },
    parseLedger: async (ledgerPath) => {
      callLog.ledgerPath = ledgerPath;
      return EMPTY_LEDGER;
    },
    runFieldReadbackAudit: async (ledger, attempts, intervalMs, deps) => {
      callLog.ledger = ledger;
      callLog.attempts = attempts;
      callLog.auditDependencies = deps;
      callLog.intervalMs = intervalMs;
      return result;
    },
    setExitCode: (exitCode) => {
      callLog.exitCodes.push(exitCode);
    },
    writeStdout: (message) => {
      callLog.stdout.push(message);
    },
  };
}
