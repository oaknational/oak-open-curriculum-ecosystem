import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { err, ok, unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { EstateReviewError } from '../dist/src/typescript-estate/errors.js';
import { classifySnapshotFiles } from '../dist/src/typescript-estate/file-classification.js';
import { ValidatedDetectorConfig } from '../dist/src/typescript-estate/validated-detector-config.js';

const CONFIG_PATH = fileURLToPath(
  new URL(
    '../../.agent/reports/typescript-estate-consolidation-review/detector-config.json',
    import.meta.url,
  ),
);
const SCHEMA_PATH = fileURLToPath(
  new URL(
    '../../.agent/reports/typescript-estate-consolidation-review/detector-config.schema.json',
    import.meta.url,
  ),
);
const configText = readFileSync(CONFIG_PATH, 'utf8');
const schemaText = readFileSync(SCHEMA_PATH, 'utf8');

const changedIdentity = unwrapErr(
  ValidatedDetectorConfig.fromFrozenTexts({ configText: `${configText}\n`, schemaText }),
);
if (changedIdentity.code !== 'IDENTITY_INVALID') {
  fail(`changed detector bytes were not refused: ${changedIdentity.code}`);
}

const config = unwrapOrThrow(ValidatedDetectorConfig.fromFrozenTexts({ configText, schemaText }));
const classificationConfig = config.classification();
const manifestText = 'packages:\n  - packages/*\n';
const manifestBytes = new TextEncoder().encode(manifestText);
const sourceText = 'const value = 1;';
const sourceBytes = new TextEncoder().encode(sourceText);
const sourcePath = 'tools/classification-smoke.ts' as const;
const manifestPath = 'pnpm-workspace.yaml' as const;
const treePaths = [
  sourcePath,
  manifestPath,
  ...classificationConfig.generatedOutputRules.flatMap(({ producerEvidence }) => producerEvidence),
];
const treeEntries = [...new Set(treePaths)].map((path) => ({
  path,
  treeEntry: regularBlob(path === manifestPath ? manifestBytes.byteLength : 1),
}));
const manifestBlob = {
  path: manifestPath,
  treeEntry: regularBlob(manifestBytes.byteLength),
  bytes: manifestBytes,
  byteCount: manifestBytes.byteLength,
  contentSha256: sha256(manifestBytes),
} as const;

const classified = unwrapOrThrow(
  classifySnapshotFiles({
    config,
    snapshot: {
      invokingGitRoot: '/smoke/repo',
      record: {
        inputRef: 'smoke',
        commit: 'a'.repeat(40),
        tree: 'b'.repeat(40),
        source: 'git-tree',
      },
      treeEntries,
      files: [
        {
          path: sourcePath,
          extension: '.ts',
          treeEntry: regularBlob(sourceBytes.byteLength),
          bytes: sourceBytes,
          text: sourceText,
          sourceFile: createSourceFile(
            sourcePath,
            sourceText,
            ScriptTarget.Latest,
            true,
            ScriptKind.TS,
          ),
          read: {
            status: 'read',
            contentSha256: sha256(sourceBytes),
            byteCount: sourceBytes.byteLength,
            lineCount: 1,
          },
        },
      ],
      auxiliary: {
        read(path) {
          return path === manifestPath
            ? ok(manifestBlob)
            : err(new EstateReviewError('SNAPSHOT_INVALID', `unexpected smoke read '${path}'`));
        },
        ledger: () => ok([]),
        observations: () => ok([]),
      },
    },
  }),
);

const observed = classified.map(({ source, classification }) => ({
  path: source.path,
  classification,
}));
const expected = [
  {
    path: sourcePath,
    classification: {
      workspace: null,
      provenance: 'authored',
      provenanceSignals: [],
      roles: ['implementation-source'],
    },
  },
];
if (JSON.stringify(observed) !== JSON.stringify(expected)) {
  fail(`built classification smoke mismatch: ${JSON.stringify(observed)}`);
}

process.stdout.write(
  'typescript-estate classification boundary smoke: exact config, strict schema, and validated facade passed\n',
);

function regularBlob(size: number) {
  return { mode: '100644' as const, type: 'blob' as const, object: 'c'.repeat(40), size };
}

function sha256(bytes: Uint8Array) {
  return createHash('sha256').update(bytes).digest('hex');
}

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
