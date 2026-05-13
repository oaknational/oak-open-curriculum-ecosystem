import { readFile } from 'node:fs/promises';

import type Ajv from 'ajv/dist/2020.js';

import { renderSharedCommsLog } from '../collaboration-state/comms.js';
import {
  parseClosedClaimsArchive,
  parseCollaborationRegistry,
} from '../collaboration-state/state-io.js';
import { readCommsEventFiles } from './live-comms-events.js';
import {
  ACTIVE_CLAIMS_PATH,
  CLOSED_CLAIMS_PATH,
  CONVERSATIONS_ROOT,
  ESCALATIONS_ROOT,
  MANIFEST_PATH,
  MANIFEST_SCHEMA_PATH,
  SHARED_COMMS_LOG,
  absolutePath,
  parseFailureFinding,
  parseManifestDocument,
  parseMigrationLedgerDocument,
  type ManifestDocument,
  type ManifestReadResult,
} from './live-types.js';
import {
  collaborationAjv,
  listJsonFiles,
  parseJsonText,
  schemaValidationFindings,
  toMigrationLedgerEntry,
  validateWithAjv,
} from './live-json-support.js';
import { evaluateGeneratedReadModelDrift } from './structural-evaluators.js';
import { evaluateMigrationLedgerSnapshot, type JsonFieldMap } from './report-evaluators.js';
import { type SubstrateFinding } from './types.js';

export async function readManifest(repoRoot: string): Promise<ManifestReadResult> {
  const manifestJson = await readJsonFile(repoRoot, MANIFEST_PATH, 'substrate-inventory');
  if (manifestJson.value === undefined) {
    return { findings: manifestJson.findings };
  }

  const schemaJson = await readJsonFile(repoRoot, MANIFEST_SCHEMA_PATH, 'substrate-inventory');
  const manifest = parseManifestDocument(manifestJson.value);
  if (schemaJson.value === undefined) {
    return { manifest, findings: schemaJson.findings };
  }

  return {
    manifest,
    findings: [
      ...manifestJson.findings,
      ...schemaValidationFindings({
        surface: 'substrate-inventory',
        path: MANIFEST_PATH,
        schema: schemaJson.value,
        value: manifestJson.value,
      }),
    ],
  };
}

export async function evaluateMigrationLedgers(
  repoRoot: string,
  manifest: ManifestDocument,
): Promise<readonly SubstrateFinding[]> {
  const ledgerPaths = manifest.discovery?.migration_ledgers ?? [];
  const findings: SubstrateFinding[] = [];

  for (const ledgerPath of ledgerPaths) {
    const ledgerJson = await readJsonFile(
      repoRoot,
      ledgerPath,
      'legacy-comms-events-migration-ledger',
    );
    findings.push(...ledgerJson.findings);
    if (ledgerJson.value !== undefined) {
      const ledger = parseMigrationLedgerDocument(ledgerJson.value);
      findings.push(...(await evaluateMigrationLedger(repoRoot, ledgerPath, ledger)));
    }
  }

  return findings;
}

export async function evaluateCollaborationJsonSurfaces(
  repoRoot: string,
): Promise<readonly SubstrateFinding[]> {
  const ajv = await collaborationAjv(repoRoot);

  return [
    ...(await evaluateClaimSurfaces(repoRoot, ajv)),
    ...(await evaluateThreadDirectory(repoRoot, ajv, CONVERSATIONS_ROOT)),
    ...(await evaluateThreadDirectory(repoRoot, ajv, ESCALATIONS_ROOT)),
    ...(await evaluateCommsEvents(repoRoot)),
  ];
}

export async function evaluateSharedCommsLog(
  repoRoot: string,
): Promise<readonly SubstrateFinding[]> {
  const events = await readCommsEventFiles(repoRoot);
  if (events.findings.length > 0) {
    return events.findings;
  }

  const committedText = await readFile(absolutePath(repoRoot, SHARED_COMMS_LOG), 'utf8');
  return evaluateGeneratedReadModelDrift({
    surface: 'collaboration-shared-comms-log',
    outputPath: SHARED_COMMS_LOG,
    committedText,
    regeneratedText: renderSharedCommsLog({
      events: [...events.narrative, ...events.lifecycle, ...events.directed],
    }),
  });
}

async function evaluateClaimSurfaces(
  repoRoot: string,
  ajv: Ajv,
): Promise<readonly SubstrateFinding[]> {
  return [
    ...(await evaluateJsonFileWithSchema({
      repoRoot,
      ajv,
      surface: 'collaboration-active-claims',
      path: ACTIVE_CLAIMS_PATH,
      schemaId: 'active-claims.schema.json',
      parser: parseCollaborationRegistry,
    })),
    ...(await evaluateJsonFileWithSchema({
      repoRoot,
      ajv,
      surface: 'collaboration-closed-claims',
      path: CLOSED_CLAIMS_PATH,
      schemaId: 'closed-claims.schema.json',
      parser: parseClosedClaimsArchive,
    })),
  ];
}

async function evaluateThreadDirectory(
  repoRoot: string,
  ajv: Ajv,
  root: string,
): Promise<readonly SubstrateFinding[]> {
  const surface =
    root === CONVERSATIONS_ROOT ? 'collaboration-conversations' : 'collaboration-escalations';
  const schemaId =
    root === CONVERSATIONS_ROOT ? 'conversation.schema.json' : 'escalation.schema.json';
  const files = await listJsonFiles(repoRoot, root);
  const liveFiles = files.filter((file) => !file.endsWith('.example.json'));
  const findings = await Promise.all(
    liveFiles.map((path) => evaluateJsonFileWithSchema({ repoRoot, ajv, surface, path, schemaId })),
  );

  return findings.flat();
}

async function evaluateMigrationLedger(
  repoRoot: string,
  ledgerPath: string,
  ledger: { readonly entries?: readonly JsonFieldMap[] },
): Promise<readonly SubstrateFinding[]> {
  const entries = await Promise.all(
    (ledger.entries ?? []).map((entry) => toMigrationLedgerEntry(repoRoot, entry)),
  );

  return evaluateMigrationLedgerSnapshot({
    ledgerPath,
    expectedEntryCount: 114,
    entries,
  });
}

async function evaluateCommsEvents(repoRoot: string): Promise<readonly SubstrateFinding[]> {
  return (await readCommsEventFiles(repoRoot)).findings;
}

async function evaluateJsonFileWithSchema(input: {
  readonly repoRoot: string;
  readonly ajv: Ajv;
  readonly surface: string;
  readonly path: string;
  readonly schemaId: string;
  readonly parser?: (text: string) => unknown;
}): Promise<readonly SubstrateFinding[]> {
  const text = await readFile(absolutePath(input.repoRoot, input.path), 'utf8');
  const parsed = parseJsonText(input.surface, input.path, text);
  if (parsed.value === undefined) {
    return parsed.findings;
  }
  if (input.parser !== undefined) {
    try {
      input.parser(text);
    } catch (error) {
      return [parseFailureFinding(input.surface, input.path, error)];
    }
  }

  return validateWithAjv(input.ajv, input.schemaId, input.surface, input.path, parsed.value);
}

async function readJsonFile(
  repoRoot: string,
  path: string,
  surface: string,
): Promise<{ readonly value?: unknown; readonly findings: readonly SubstrateFinding[] }> {
  try {
    return {
      value: JSON.parse(await readFile(absolutePath(repoRoot, path), 'utf8')),
      findings: [],
    };
  } catch (error) {
    return { findings: [parseFailureFinding(surface, path, error)] };
  }
}
