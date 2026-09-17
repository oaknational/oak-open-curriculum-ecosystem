import { err, ok, unwrapErr, unwrapOrThrow, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { WorkspaceAttributionConfig } from './config-classification-model.js';
import {
  EstateReviewError,
  MissingAuxiliaryBlobRefusal,
  type AuxiliaryBlobReadRefusal,
} from './errors.js';
import type {
  AuxiliaryBlobRead,
  GitSnapshotAuxiliaryReader,
  TrackedTreeEntry,
} from './git-snapshot-model.js';
import { discoverWorkspaces } from './workspace-manifest.js';

const CONFIG: WorkspaceAttributionConfig = {
  manifestPath: 'pnpm-workspace.yaml',
  manifestTreeRequirement: 'pinned regular blob',
  utf8Decoding: 'fatal',
  yamlParser: {
    package: 'yaml',
    version: '2.9.0',
    entrypoint: 'parseAllDocuments',
    options: {
      version: '1.2',
      schema: 'core',
      strict: true,
      uniqueKeys: true,
      stringKeys: false,
      merge: false,
      resolveKnownTags: false,
      customTags: [],
      intAsBigInt: false,
      prettyErrors: false,
      logLevel: 'silent',
    },
  },
  documentRule: 'one document',
  rootRule: 'one packages key',
  packagesRule: 'string sequence',
  patternGrammar: 'literal segments or whole *',
  candidateManifestRule: 'matched non-root package.json',
  packageJsonRule: 'strict JSON and duplicate decoded key detection',
  packageNamePattern:
    '^(?:[A-Za-z0-9_~-][A-Za-z0-9._~-]*|@[A-Za-z0-9_~-][A-Za-z0-9._~-]*/[A-Za-z0-9_~-][A-Za-z0-9._~-]*)$',
  packageNameRule: 'valid unique name',
  attributionRule: 'deepest containing root',
  dependencyRule: 'pinned reads only',
};

describe('discoverWorkspaces', () => {
  it('discovers the exact matched manifest set in frozen UTF-16 order', () => {
    const result = discover([
      textFile(
        'pnpm-workspace.yaml',
        'packages:\n  - packages/*\n  - packages/a\n  - packages/nested/*\n  - empty/*\n',
      ),
      textFile('package.json', '{"name":"root-is-excluded"}'),
      textFile('packages/z/package.json', '{"name":"@oak/z"}'),
      textFile('packages/a/package.json', '{"name":"a"}'),
      textFile('packages/a/Package.json', '{"name":"wrong-case"}'),
      textFile('packages/nested/b/package.json', '{"name":"b"}'),
      textFile('packages/𐀀/package.json', '{"name":"astral"}'),
      textFile('packages//package.json', '{"name":"bmp"}'),
      textFile('outside/package.json', '{"name":"outside"}'),
    ]);

    expect(unwrapOrThrow(result)).toEqual([
      { root: 'packages/a', name: 'a', manifestPath: 'packages/a/package.json' },
      { root: 'packages/nested/b', name: 'b', manifestPath: 'packages/nested/b/package.json' },
      { root: 'packages/z', name: '@oak/z', manifestPath: 'packages/z/package.json' },
      { root: 'packages/𐀀', name: 'astral', manifestPath: 'packages/𐀀/package.json' },
      { root: 'packages/', name: 'bmp', manifestPath: 'packages//package.json' },
    ]);
  });

  it.each([
    '',
    '/apps/*',
    'apps/*/',
    'apps/**',
    'apps/foo?',
    'apps/.',
    'apps/..',
    'apps//x',
    String.raw`apps\x`,
    'apps/{x}',
    'apps/!x',
    'apps/[x]',
    'apps/x*y',
    'apps/\u0000x',
  ])('rejects unsupported package-pattern syntax %j', (pattern) => {
    const manifest = `packages:\n  - ${JSON.stringify(pattern)}\n`;
    expect(unwrapErr(discover([textFile('pnpm-workspace.yaml', manifest)]))).toMatchObject({
      code: 'SNAPSHOT_INVALID',
    });
  });

  it('matches exact case and exact code units without normalisation', () => {
    const result = discover([
      textFile('pnpm-workspace.yaml', 'packages:\n  - Packages/*\n  - café/*\n'),
      byteFile('packages/a/package.json', new Uint8Array([0xff])),
      textFile('café/a/package.json', 'not JSON'),
    ]);
    expect(unwrapOrThrow(result)).toEqual([]);
  });

  it.each([
    ['', 'zero documents'],
    ['packages: []\n---\npackages: []\n', 'multiple documents'],
    ['%YAML 1.2\n---\npackages: []\n', 'YAML directive'],
    ['%TAG !e! tag:example.com,2000:app/\n---\npackages: []\n', 'TAG directive'],
    ['%TAG !! tag:yaml.org,2002:\n---\npackages: []\n', 'default TAG directive'],
    ['packages: &items [apps/*]\n', 'anchor'],
    ['packages: [apps/*]\ncopy: *items\n', 'alias'],
    ['packages: [!!str apps/*]\n', 'explicit tag'],
    ['packages: [!unknown apps/*]\n', 'parser warning'],
    ['packages: [\n', 'parser error'],
    ['- packages\n', 'non-mapping root'],
    ['other: true\n', 'missing packages'],
    ['packages: {}\n', 'non-sequence packages'],
    ['packages: [1]\n', 'coerced package item'],
    ['packages: [apps/*, "apps/\\u002a"]\n', 'duplicate decoded pattern'],
    ['packages: []\n"pack\\u0061ges": []\n', 'duplicate decoded packages key'],
    ['packages: []\nother: { <<: value }\n', 'merge key'],
  ])('rejects %s (%s)', (yaml) => {
    expect(unwrapErr(discover([textFile('pnpm-workspace.yaml', yaml)]))).toMatchObject({
      code: 'SNAPSHOT_INVALID',
    });
  });

  it.each([
    ['[]', 'array'],
    ['null', 'null'],
    ['{"name":1}', 'non-string name'],
    ['{"name":""}', 'empty name'],
    ['{"name":"bad name"}', 'invalid name'],
    ['{"name":"@scope"}', 'incomplete scoped name'],
    ['{"name":"a",}', 'non-strict JSON'],
    [String.raw`{"name":"a","nested":{"x":1,"\u0078":2}}`, 'nested duplicate decoded key'],
  ])('rejects a malformed matched package manifest: %s (%s)', (json) => {
    const result = discover([
      textFile('pnpm-workspace.yaml', 'packages: [packages/*]\n'),
      textFile('packages/a/package.json', json),
    ]);
    expect(unwrapErr(result)).toMatchObject({ code: 'SNAPSHOT_INVALID' });
  });

  it('rejects duplicate admitted package names', () => {
    const result = discover([
      textFile('pnpm-workspace.yaml', 'packages: [packages/*]\n'),
      textFile('packages/a/package.json', '{"name":"same"}'),
      textFile('packages/b/package.json', '{"name":"same"}'),
    ]);
    expect(unwrapErr(result)).toMatchObject({ code: 'SNAPSHOT_INVALID' });
  });

  it('requires the workspace file and every matched manifest to be pinned regular blobs', () => {
    expect(
      unwrapErr(
        run([], constantReader(err(new MissingAuxiliaryBlobRefusal('pnpm-workspace.yaml')))),
      ),
    ).toMatchObject({ code: 'SNAPSHOT_INVALID' });
    const manifest = textFile('pnpm-workspace.yaml', 'packages: [packages/*]\n');
    expect(
      unwrapErr(
        run([manifest.entry, nonregular('packages/a/package.json')], exactReader([manifest])),
      ),
    ).toMatchObject({ code: 'SNAPSHOT_INVALID' });
  });

  it('converts a required-path refusal but preserves a fatal auxiliary error exactly', () => {
    const manifest = textFile('pnpm-workspace.yaml', 'packages: []\n');
    const refusal = err(new MissingAuxiliaryBlobRefusal('pnpm-workspace.yaml'));
    expect(unwrapErr(run([manifest.entry], constantReader(refusal)))).toMatchObject({
      code: 'SNAPSHOT_INVALID',
    });
    const fatal = new EstateReviewError('RESOURCE_LIMIT', 'frozen auxiliary limit exceeded');
    expect(unwrapErr(run([manifest.entry], constantReader(err(fatal))))).toBe(fatal);
  });

  it('rejects invalid UTF-8 in either required manifest class', () => {
    const invalid = Uint8Array.from([0xff]);
    expect(unwrapErr(discover([byteFile('pnpm-workspace.yaml', invalid)]))).toMatchObject({
      code: 'SNAPSHOT_INVALID',
    });
    expect(
      unwrapErr(
        discover([
          textFile('pnpm-workspace.yaml', 'packages: [packages/*]\n'),
          byteFile('packages/a/package.json', invalid),
        ]),
      ),
    ).toMatchObject({ code: 'SNAPSHOT_INVALID' });
  });
});

interface FixtureFile {
  readonly entry: TrackedTreeEntry;
  readonly read: AuxiliaryBlobRead;
}
type AuxiliaryResult = Result<AuxiliaryBlobRead, EstateReviewError | AuxiliaryBlobReadRefusal>;
type BlobEntry = readonly [string, AuxiliaryBlobRead];
function textFile(path: string, text: string): FixtureFile {
  return byteFile(path, new TextEncoder().encode(text));
}

function byteFile(path: string, bytes: Uint8Array): FixtureFile {
  const treeEntry = {
    mode: '100644',
    type: 'blob',
    object: 'a'.repeat(40),
    size: bytes.byteLength,
  } as const;
  return {
    entry: { path, treeEntry },
    read: { path, treeEntry, bytes, byteCount: bytes.byteLength, contentSha256: 'b'.repeat(64) },
  };
}

function nonregular(path: string): TrackedTreeEntry {
  return { path, treeEntry: { mode: '120000', type: 'blob', object: 'a'.repeat(40), size: 5 } };
}

function discover(files: readonly FixtureFile[]) {
  return run(
    files.map(({ entry }) => entry),
    exactReader(files),
  );
}

function run(treeEntries: readonly TrackedTreeEntry[], auxiliary: GitSnapshotAuxiliaryReader) {
  return discoverWorkspaces({ config: CONFIG, treeEntries, auxiliary });
}

function exactReader(files: readonly FixtureFile[]): GitSnapshotAuxiliaryReader {
  const entries = files.map(({ entry, read }) => [entry.path, read] satisfies BlobEntry);
  const reads = Object.freeze(Object.fromEntries(entries));
  return {
    // The injected boundary resolves an exact pinned path to its immutable fixture blob.
    read: (path) => ok(reads[path]),
    ledger: () => ok([]),
    observations: () => ok([]),
  };
}

function constantReader(response: AuxiliaryResult): GitSnapshotAuxiliaryReader {
  return { read: () => response, ledger: () => ok([]), observations: () => ok([]) };
}
