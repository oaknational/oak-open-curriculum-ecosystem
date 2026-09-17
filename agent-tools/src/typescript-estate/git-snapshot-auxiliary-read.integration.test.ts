import { Buffer } from 'node:buffer';

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  captureGitSnapshot,
  type GitSnapshotLimits,
  type GitSourceSnapshot,
  type SnapshotPathPort,
} from './git-snapshot.js';
import type { ProcessInvocation, ProcessPort, ProcessResult } from './ports.js';

const COMMIT = 'a'.repeat(40);
const TREE = 'b'.repeat(40);
const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const A_SHA256 = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb';
const Z_SHA256 = '594e519ae499312b29433b7dd8a97ff068defcba9755b6d5d00e84c524d67b06';

const LIMITS: GitSnapshotLimits = {
  maxTrackedPaths: 20,
  maxTreeListingBytes: 4096,
  maxGitStderrBytes: 1024,
  maxTotalSourceBytes: 4096,
  maxSourceBytesPerFile: 1024,
  maxTotalAuxiliaryBlobBytes: 4096,
  maxAuxiliaryBlobBytesPerFile: 1024,
};

class StubProcess implements ProcessPort {
  readonly invocations: ProcessInvocation[] = [];
  readonly #results: ProcessResult[];

  constructor(results: readonly ProcessResult[]) {
    this.#results = [...results];
  }

  run(input: ProcessInvocation): ProcessResult {
    this.invocations.push(input);
    return (
      this.#results.shift() ?? {
        status: null,
        signal: null,
        stdout: new Uint8Array(),
        stderr: new Uint8Array(),
        error: new Error('unexpected process invocation'),
      }
    );
  }
}

const pathPort: SnapshotPathPort = {
  canonicalRealpath: (value) => value,
};

describe('pinned auxiliary blob reads integration', () => {
  it('caches one successful path, returns defensive bytes, and never invokes Git twice', () => {
    const { process, snapshot } = captureFixture(
      treeEntry('100644', 'blob', 'c'.repeat(40), 3, 'config.json'),
      [success('abc')],
    );

    const first = unwrapOrThrow(snapshot.auxiliary.read('config.json'));
    first.bytes[0] = 0;
    const second = unwrapOrThrow(snapshot.auxiliary.read('config.json'));

    expect([...second.bytes]).toEqual([...Buffer.from('abc')]);
    expect(second.contentSha256).toBe(ABC_SHA256);
    expect(process.invocations).toHaveLength(5);
    expect(process.invocations[4]?.args).toEqual([
      '--no-replace-objects',
      '--no-lazy-fetch',
      '-C',
      '/repo',
      'cat-file',
      'blob',
      `${COMMIT}:config.json`,
    ]);
    expect(unwrapOrThrow(snapshot.auxiliary.ledger())).toEqual([
      {
        path: 'config.json',
        treeEntry: {
          mode: '100644',
          type: 'blob',
          object: 'c'.repeat(40),
          size: 3,
        },
        byteCount: 3,
        contentSha256: ABC_SHA256,
      },
    ]);
  });

  it('preflights per-file and remaining run-wide budgets before Git', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 2, 'a.json'),
      treeEntry('100644', 'blob', 'd'.repeat(40), 2, 'b.json'),
      treeEntry('100644', 'blob', 'e'.repeat(40), 5, 'large.json'),
    ]);
    const perFile = captureFixture(listing, [], {
      ...LIMITS,
      maxTotalAuxiliaryBlobBytes: 3,
      maxAuxiliaryBlobBytesPerFile: 4,
    });

    expect(unwrapErr(perFile.snapshot.auxiliary.read('large.json'))).toMatchObject({
      code: 'RESOURCE_LIMIT',
      message: "auxiliary blob 'large.json' exceeds the per-file byte limit 4",
    });
    expect(perFile.process.invocations).toHaveLength(4);

    const runWide = captureFixture(listing, [success('aa')], {
      ...LIMITS,
      maxTotalAuxiliaryBlobBytes: 3,
      maxAuxiliaryBlobBytesPerFile: 5,
    });

    unwrapOrThrow(runWide.snapshot.auxiliary.read('a.json'));
    expect(unwrapErr(runWide.snapshot.auxiliary.read('b.json'))).toMatchObject({
      code: 'RESOURCE_LIMIT',
      message: "auxiliary blob 'b.json' exceeds the remaining run-wide byte budget 1",
    });
    expect(runWide.process.invocations).toHaveLength(5);
  });

  it('returns typed missing and nonregular refusals without invoking Git', () => {
    const listing = Buffer.concat([
      treeEntry('120000', 'blob', 'c'.repeat(40), 8, 'link.json'),
      treeEntry('100644', 'blob', 'f'.repeat(40), 1, 'ok.json'),
      treeEntry('100644', 'blob', 'd'.repeat(40), '-', 'sizeless.json'),
      treeEntry('160000', 'commit', 'e'.repeat(40), '-', 'submodule'),
    ]);
    const { process, snapshot } = captureFixture(listing, [success('x')]);

    expect(unwrapErr(snapshot.auxiliary.read('missing.json'))).toMatchObject({
      kind: 'missing-path',
      path: 'missing.json',
    });
    expect(unwrapErr(snapshot.auxiliary.read('link.json'))).toMatchObject({
      kind: 'nonregular-entry',
      path: 'link.json',
      treeEntry: { mode: '120000', type: 'blob', size: 8 },
    });
    expect(unwrapErr(snapshot.auxiliary.read('sizeless.json'))).toMatchObject({
      kind: 'nonregular-entry',
      path: 'sizeless.json',
      treeEntry: { mode: '100644', type: 'blob', size: null },
    });
    expect(unwrapErr(snapshot.auxiliary.read('submodule'))).toMatchObject({
      kind: 'nonregular-entry',
      path: 'submodule',
      treeEntry: { mode: '160000', type: 'commit', size: null },
    });
    expect(process.invocations).toHaveLength(4);
    expect(unwrapOrThrow(snapshot.auxiliary.ledger())).toEqual([]);

    unwrapOrThrow(snapshot.auxiliary.read('ok.json'));
    expect(process.invocations).toHaveLength(5);
    expect(unwrapOrThrow(snapshot.auxiliary.ledger()).map(({ path }) => path)).toEqual(['ok.json']);
    expect(unwrapOrThrow(snapshot.auxiliary.observations()).map(({ path }) => path)).toEqual([
      'ok.json',
    ]);
  });

  it('fails the complete run when returned bytes differ from the indexed size', () => {
    const { process, snapshot } = captureFixture(
      treeEntry('100644', 'blob', 'c'.repeat(40), 2, 'config.json'),
      [success('x')],
    );

    const fatal = unwrapErr(snapshot.auxiliary.read('config.json'));
    expect(fatal).toMatchObject({
      code: 'SNAPSHOT_INVALID',
      message: "Git tree size and auxiliary bytes differ for 'config.json'",
    });
    expect(process.invocations).toHaveLength(5);
    expect(unwrapErr(snapshot.auxiliary.ledger())).toBe(fatal);
  });

  it('preserves an operational Git failure as a fatal typed cause', () => {
    const { snapshot } = captureFixture(
      treeEntry('100644', 'blob', 'c'.repeat(40), 2, 'config.json'),
      [failure('fatal: missing promised object')],
    );

    const error = unwrapErr(snapshot.auxiliary.read('config.json'));

    expect(error).toMatchObject({
      code: 'SOURCE_READ_FAILED',
      message: "Git auxiliary blob read 'config.json' failed",
    });
    expect(error.cause).toMatchObject({ message: 'fatal: missing promised object' });
  });

  it('latches the first fatal error across every later read without invoking Git', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 5, 'large.json'),
      treeEntry('100644', 'blob', 'd'.repeat(40), 1, 'later.json'),
    ]);
    const { process, snapshot } = captureFixture(listing, [], {
      ...LIMITS,
      maxAuxiliaryBlobBytesPerFile: 4,
    });

    const fatal = unwrapErr(snapshot.auxiliary.read('large.json'));

    expect(unwrapErr(snapshot.auxiliary.read('later.json'))).toBe(fatal);
    expect(unwrapErr(snapshot.auxiliary.read('missing.json'))).toBe(fatal);
    expect(process.invocations).toHaveLength(4);
  });

  it('refuses ledger and observation finalisation after a fatal auxiliary error', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'first.json'),
      treeEntry('100644', 'blob', 'd'.repeat(40), 2, 'mismatch.json'),
    ]);
    const { snapshot } = captureFixture(listing, [success('a'), success('x')]);

    unwrapOrThrow(snapshot.auxiliary.read('first.json'));
    const fatal = unwrapErr(snapshot.auxiliary.read('mismatch.json'));

    expect(unwrapErr(snapshot.auxiliary.ledger())).toBe(fatal);
    expect(unwrapErr(snapshot.auxiliary.observations())).toBe(fatal);
  });

  it('reuses regular TypeScript bytes, including invalid UTF-8, without charge or ledger rows', () => {
    const invalidUtf8 = Uint8Array.from([0xff]);
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'bad.tsx'),
      treeEntry('100644', 'blob', 'd'.repeat(40), 3, 'good.ts'),
      treeEntry('120000', 'blob', 'e'.repeat(40), 8, 'link.ts'),
    ]);
    const { process, snapshot } = captureFixture(listing, [success(invalidUtf8), success('abc')], {
      ...LIMITS,
      maxTotalAuxiliaryBlobBytes: 1,
      maxAuxiliaryBlobBytesPerFile: 1,
    });

    expect([...unwrapOrThrow(snapshot.auxiliary.read('bad.tsx')).bytes]).toEqual([0xff]);
    expect([...unwrapOrThrow(snapshot.auxiliary.read('good.ts')).bytes]).toEqual([
      ...Buffer.from('abc'),
    ]);
    expect(unwrapErr(snapshot.auxiliary.read('link.ts'))).toMatchObject({
      kind: 'nonregular-entry',
      path: 'link.ts',
    });
    expect(process.invocations).toHaveLength(6);
    expect(unwrapOrThrow(snapshot.auxiliary.ledger())).toEqual([]);
    expect(unwrapOrThrow(snapshot.auxiliary.observations())).toEqual([]);
  });

  it('sorts the successful non-TypeScript ledger by path and preserves indexed identity', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'z.json'),
      treeEntry('100755', 'blob', 'd'.repeat(40), 1, 'a.yaml'),
    ]);
    const { snapshot } = captureFixture(listing, [success('z'), success('a')]);

    unwrapOrThrow(snapshot.auxiliary.read('z.json'));
    unwrapOrThrow(snapshot.auxiliary.read('a.yaml'));

    const observations = unwrapOrThrow(snapshot.auxiliary.observations());
    expect(observations.map(({ path, bytes }) => ({ path, bytes: [...bytes] }))).toEqual([
      { path: 'a.yaml', bytes: [...Buffer.from('a')] },
      { path: 'z.json', bytes: [...Buffer.from('z')] },
    ]);
    const firstObservation = observations[0];
    expect(firstObservation, 'expected the path-sorted a.yaml observation').toBeDefined();
    if (firstObservation !== undefined) {
      firstObservation.bytes[0] = 0;
    }
    expect([...(unwrapOrThrow(snapshot.auxiliary.observations())[0]?.bytes ?? [])]).toEqual([
      ...Buffer.from('a'),
    ]);
    expect(unwrapOrThrow(snapshot.auxiliary.ledger())).toEqual([
      {
        path: 'a.yaml',
        treeEntry: {
          mode: '100755',
          type: 'blob',
          object: 'd'.repeat(40),
          size: 1,
        },
        byteCount: 1,
        contentSha256: A_SHA256,
      },
      {
        path: 'z.json',
        treeEntry: {
          mode: '100644',
          type: 'blob',
          object: 'c'.repeat(40),
          size: 1,
        },
        byteCount: 1,
        contentSha256: Z_SHA256,
      },
    ]);
  });
});

interface CapturedFixture {
  readonly process: StubProcess;
  readonly snapshot: GitSourceSnapshot;
}

function captureFixture(
  listing: Uint8Array,
  reads: readonly ProcessResult[],
  limits: GitSnapshotLimits = LIMITS,
): CapturedFixture {
  const process = new StubProcess([
    success('/repo\n'),
    success(`${COMMIT}\n`),
    success(`${TREE}\n`),
    success(listing),
    ...reads,
  ]);
  const snapshot = unwrapOrThrow(
    captureGitSnapshot({
      callerCwd: '/repo',
      inputRef: 'HEAD',
      gitExecutable: '/trusted/git',
      inheritedEnvironment: {},
      limits,
      process,
      paths: pathPort,
    }),
  );
  return { process, snapshot };
}

function success(stdout: string | Uint8Array): ProcessResult {
  return {
    status: 0,
    signal: null,
    stdout: typeof stdout === 'string' ? Buffer.from(stdout) : stdout,
    stderr: new Uint8Array(),
    error: undefined,
  };
}

function failure(message: string): ProcessResult {
  return {
    status: 128,
    signal: null,
    stdout: new Uint8Array(),
    stderr: Buffer.from(message),
    error: undefined,
  };
}

function treeEntry(
  mode: string,
  type: string,
  object: string,
  size: number | '-',
  path: string,
): Uint8Array {
  return Buffer.concat([
    Buffer.from(`${mode} ${type} ${object} ${String(size)}\t${path}`),
    Buffer.from([0]),
  ]);
}
