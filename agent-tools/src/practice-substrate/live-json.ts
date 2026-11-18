import { readFile } from 'node:fs/promises';

import { type InstanceTierProbe } from './instance-tier.js';
import { evaluateCollaborationRecords } from './live-collaboration-records.js';
import { readCommsEventFiles } from './live-comms-events.js';
import { liveSubstrateReads } from './live-reads.js';
import {
  MANIFEST_PATH,
  MANIFEST_SCHEMA_PATH,
  absolutePath,
  parseFailureFinding,
  parseManifestDocument,
  parseMigrationLedgerDocument,
  type ManifestDocument,
  type ManifestReadResult,
} from './live-types.js';
import {
  collaborationAjv,
  schemaValidationFindings,
  toMigrationLedgerEntry,
} from './live-json-support.js';
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

/**
 * The collaboration JSON surfaces of the repository at `repoRoot`: the claim
 * registries and threads ({@link evaluateCollaborationRecords}), classified by
 * `probe`, then the comms events.
 */
export async function evaluateCollaborationJsonSurfaces(
  repoRoot: string,
  probe: InstanceTierProbe,
): Promise<readonly SubstrateFinding[]> {
  return [
    ...(await evaluateCollaborationRecords({
      reads: liveSubstrateReads(repoRoot),
      schemas: await collaborationAjv(repoRoot),
      probe,
    })),
    ...(await evaluateCommsEvents(repoRoot)),
  ];
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
