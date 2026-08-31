import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  checkCarriage,
  collectCarriedFiles,
  syncCarriage,
  type CarriageReadFs,
  type CarriageWriteFs,
  type FsRead,
} from '../../src/skills-adapter-generate/carriage';

const encoder = new TextEncoder();

function bytes(text: string): Uint8Array {
  return encoder.encode(text);
}

const ok = <T>(value: T): FsRead<T> => ({ kind: 'ok', value });

// The product joins with the HOST separator (correct for real fs access);
// these fakes are keyed and asserted in POSIX form for readability, so
// lookups, recorded writes, and reported paths all normalise first.
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

/** Re-key a fixture map into POSIX form so host-joined and literal keys meet. */
const posixKeyed = <V>(entries: ReadonlyMap<string, V>): ReadonlyMap<string, V> =>
  new Map([...entries].map(([key, value]) => [posixPath(key), value]));

/** Re-key a fixture set into POSIX form. */
const posixKeyedSet = (entries: ReadonlySet<string>): ReadonlySet<string> =>
  new Set([...entries].map(posixPath));

/** Normalise product-reported paths (and messages naming them) to POSIX form. */
const posixStrings = (values: readonly string[]): string[] => values.map(posixPath);

const posixCheck = (
  result: Awaited<ReturnType<typeof checkCarriage>>,
): Awaited<ReturnType<typeof checkCarriage>> => ({
  ...result,
  missing: posixStrings(result.missing),
  drifted: posixStrings(result.drifted),
  orphaned: posixStrings(result.orphaned),
  refused: posixStrings(result.refused),
});

const posixSync = (
  outcome: Awaited<ReturnType<typeof syncCarriage>>,
): Awaited<ReturnType<typeof syncCarriage>> => ({
  ...outcome,
  carried: posixStrings(outcome.carried),
  pruned: posixStrings(outcome.pruned),
  refused: posixStrings(outcome.refused),
});

const posixCarried = (
  carried: Awaited<ReturnType<typeof collectCarriedFiles>>,
): Awaited<ReturnType<typeof collectCarriedFiles>> => ({
  ...carried,
  files: posixStrings(carried.files),
  refused: posixStrings(carried.refused),
});

/** Optional fixture facets beyond the flat byte map. */
interface FsFixtureOptions {
  /** Absolute paths listed as non-regular entries (symlinks etc.). */
  readonly others?: ReadonlySet<string>;
  /** Absolute paths whose executable bit reads true. */
  readonly executables?: ReadonlySet<string>;
}

/**
 * In-memory read-side carriage fs derived from a flat file map, so directory
 * listings can never disagree with the files they claim to hold. Non-regular
 * entries and executable bits are declared facets, not parallel stores.
 */
function makeReadFs(
  files: ReadonlyMap<string, Uint8Array>,
  options: FsFixtureOptions = {},
): CarriageReadFs {
  const byPath = posixKeyed(files);
  const others = posixKeyedSet(options.others ?? new Set<string>());
  const executables = posixKeyedSet(options.executables ?? new Set<string>());
  return {
    async listSubdirectoryNames(path) {
      const names = new Set<string>();
      const prefix = `${posixPath(path)}/`;
      for (const entryPath of [...byPath.keys(), ...others]) {
        if (!entryPath.startsWith(prefix)) {
          continue;
        }
        const remainder = entryPath.slice(prefix.length);
        const separatorIndex = remainder.indexOf('/');
        if (separatorIndex > 0) {
          names.add(remainder.slice(0, separatorIndex));
        }
      }
      return ok([...names]);
    },
    async listFileNames(path) {
      const names: string[] = [];
      const prefix = `${posixPath(path)}/`;
      for (const filePath of byPath.keys()) {
        if (filePath.startsWith(prefix) && !filePath.slice(prefix.length).includes('/')) {
          names.push(filePath.slice(prefix.length));
        }
      }
      return ok(names);
    },
    async listOtherEntryNames(path) {
      const names: string[] = [];
      const prefix = `${posixPath(path)}/`;
      for (const entryPath of others) {
        if (entryPath.startsWith(prefix) && !entryPath.slice(prefix.length).includes('/')) {
          names.push(entryPath.slice(prefix.length));
        }
      }
      return ok(names);
    },
    async readFileBytesOrUndefined(path) {
      return ok(byPath.get(posixPath(path)));
    },
    async entryKind(path) {
      // Flat-map semantics: a file key is a regular file, a declared
      // "other" is a non-regular entry, an implied ancestor is a
      // directory, anything else is absent.
      const posix = posixPath(path);
      if (byPath.has(posix)) {
        return ok('file' as const);
      }
      if (others.has(posix)) {
        return ok('other' as const);
      }
      const prefix = `${posix}/`;
      const isDirectory = [...byPath.keys(), ...others].some((entryPath) =>
        entryPath.startsWith(prefix),
      );
      return ok(isDirectory ? ('directory' as const) : ('absent' as const));
    },
    async isExecutableOrUndefined(path) {
      const posix = posixPath(path);
      return ok(byPath.has(posix) ? executables.has(posix) : undefined);
    },
    async resolveRealPath(path) {
      return ok(path); // the flat-map fixture holds no symlinked ancestors
    },
  };
}

/** Mutable write-side fs over the same derived-listing model; records the
 * operation order so prune-before-copy stays provable. */
function makeWriteFs(
  files: Map<string, Uint8Array>,
  options: FsFixtureOptions & { readonly operationLog?: string[] } = {},
): CarriageWriteFs {
  const liveOthers = new Set([...(options.others ?? [])].map(posixPath));
  const log = options.operationLog;
  const readFs = (): CarriageReadFs =>
    makeReadFs(files, { ...options, others: new Set([...liveOthers]) });
  return {
    async listSubdirectoryNames(path) {
      return readFs().listSubdirectoryNames(path);
    },
    async listFileNames(path) {
      return readFs().listFileNames(path);
    },
    async listOtherEntryNames(path) {
      return readFs().listOtherEntryNames(path);
    },
    async readFileBytesOrUndefined(path) {
      return ok(files.get(posixPath(path)));
    },
    async entryKind(path) {
      return readFs().entryKind(path);
    },
    async isExecutableOrUndefined(path) {
      return readFs().isExecutableOrUndefined(path);
    },
    async resolveRealPath(path) {
      return ok(path);
    },
    async copyFileWithParents(sourcePath, targetPath) {
      // Writes land POSIX-keyed so the test's post-state map reads stay in
      // the fixtures' own key form.
      const source = posixPath(sourcePath);
      const target = posixPath(targetPath);
      log?.push(`copy:${target}`);
      // A missing source is a fixture defect; plant a loud sentinel so the
      // test's byte assertions fail visibly rather than throwing here.
      files.set(target, files.get(source) ?? bytes(`FIXTURE-MISSING:${source}`));
    },
    async removeFile(path) {
      const posix = posixPath(path);
      log?.push(`remove:${posix}`);
      files.delete(posix);
      liveOthers.delete(posix);
    },
    async removeDirectoryIfEmpty() {
      // Derived listings cannot hold an empty directory; real-fs empty-dir
      // cleanup is proven in the integration suite.
    },
    async removeEntryRecursive(path) {
      const posix = posixPath(path);
      log?.push(`remove-recursive:${posix}`);
      for (const filePath of [...files.keys()]) {
        if (filePath === posix || filePath.startsWith(`${posix}/`)) {
          files.delete(filePath);
        }
      }
      liveOthers.delete(posix);
    },
  };
}

describe('collectCarriedFiles', () => {
  const canonicalDir = '/repo/.agent/skills/cognition/parallax';

  it('collects files under every carried directory, nested arbitrarily deep, sorted', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/SKILL-CANONICAL.md`, bytes('canonical')],
        [`${canonicalDir}/references/orchestration.md`, bytes('a')],
        [`${canonicalDir}/references/family/graphs/catalogue.json`, bytes('b')],
        [`${canonicalDir}/scripts/render_graph.py`, bytes('c')],
        [`${canonicalDir}/assets/inquiry-charter.yaml`, bytes('d')],
      ]),
    );

    const carried = posixCarried(await collectCarriedFiles(canonicalDir, fs));

    expect(carried.refused).toEqual([]);
    expect(carried.files).toEqual([
      'assets/inquiry-charter.yaml',
      'references/family/graphs/catalogue.json',
      'references/orchestration.md',
      'scripts/render_graph.py',
    ]);
  });

  it('returns an empty list for a skill with no supporting directories', async () => {
    const fs = makeReadFs(new Map([[`${canonicalDir}/SKILL-CANONICAL.md`, bytes('canonical')]]));

    const carried = posixCarried(await collectCarriedFiles(canonicalDir, fs));

    expect(carried).toEqual({ files: [], refused: [] });
  });

  it('never collects evals, evaluations, or any other non-carried directory', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/evals/evals.json`, bytes('e')],
        [`${canonicalDir}/evaluations/routing/evals.json`, bytes('f')],
        [`${canonicalDir}/shared/notes.md`, bytes('g')],
        [`${canonicalDir}/references/kept.md`, bytes('h')],
      ]),
    );

    const carried = posixCarried(await collectCarriedFiles(canonicalDir, fs));

    expect(carried.files).toEqual(['references/kept.md']);
  });

  it('refuses a canonical-side non-regular entry, naming the path', async () => {
    const fs = makeReadFs(new Map([[`${canonicalDir}/references/real.md`, bytes('real')]]), {
      others: new Set([`${canonicalDir}/references/smuggled.md`]),
    });

    const carried = posixCarried(await collectCarriedFiles(canonicalDir, fs));

    expect(carried.files).toEqual(['references/real.md']);
    expect(carried.refused).toHaveLength(1);
    expect(carried.refused[0]).toMatch(/symlink/);
    expect(carried.refused[0]).toContain(`${canonicalDir}/references/smuggled.md`);
  });
});

describe('checkCarriage', () => {
  const canonicalDir = '/repo/.agent/skills/cognition/parallax';
  const adapterDir = '/repo/.claude/skills/oak-parallax';

  it('is clean when every carried file exists byte-identically and nothing else is present', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/a.md`, bytes('alpha')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/references/a.md`, bytes('alpha')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result).toEqual({
      missing: [],
      drifted: [],
      orphaned: [],
      refused: [],
      carriedCount: 1,
    });
  });

  it('reports a carried file missing from the projection', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/a.md`, bytes('alpha')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.missing).toEqual([`${adapterDir}/references/a.md`]);
    expect(result.drifted).toEqual([]);
  });

  it('reports byte drift on a mutated carried file', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/a.md`, bytes('alpha')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/references/a.md`, bytes('alpha — mutated')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.drifted).toEqual([`${adapterDir}/references/a.md`]);
    expect(result.missing).toEqual([]);
  });

  it('detects a same-length byte difference (length comparison alone cannot)', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/a.md`, bytes('alpha')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/references/a.md`, bytes('alphz')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.drifted).toEqual([`${adapterDir}/references/a.md`]);
  });

  it('reports an orphan: a projection file whose canonical source is gone', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/kept.md`, bytes('kept')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/references/kept.md`, bytes('kept')],
        [`${adapterDir}/references/deleted-upstream.md`, bytes('stale')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.orphaned).toEqual([`${adapterDir}/references/deleted-upstream.md`]);
    expect(result.drifted).toEqual([]);
  });

  it('treats projection evals content as orphaned — evals are never carried', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/evals/evals.json`, bytes('cases')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/evals/evals.json`, bytes('cases')],
      ]),
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.orphaned).toEqual([`${adapterDir}/evals/evals.json`]);
  });

  it('never counts the adapter SKILL.md itself as an orphan', async () => {
    const fs = makeReadFs(new Map([[`${adapterDir}/SKILL.md`, bytes('adapter')]]));

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result).toEqual({
      missing: [],
      drifted: [],
      orphaned: [],
      refused: [],
      carriedCount: 0,
    });
  });

  it('reports a projection-side non-regular entry as orphaned, never comparing through it', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/references/a.md`, bytes('alpha')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/references/a.md`, bytes('alpha')],
      ]),
      { others: new Set([`${adapterDir}/references/link-to-elsewhere`]) },
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.orphaned).toEqual([`${adapterDir}/references/link-to-elsewhere`]);
  });

  it('surfaces a seam read failure as a refusal instead of reading it as absence', async () => {
    const failing: CarriageReadFs = {
      ...makeReadFs(new Map([[`${canonicalDir}/references/a.md`, bytes('alpha')]])),
      async listFileNames() {
        return { kind: 'failure', message: 'EACCES: permission denied' };
      },
    };

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, failing));

    expect(result.refused.some((message) => message.includes('EACCES'))).toBe(true);
  });

  it('reports executable-bit drift on a byte-identical carried copy', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/scripts/tool.py`, bytes('print("hi")\n')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/scripts/tool.py`, bytes('print("hi")\n')],
      ]),
      { executables: new Set([`${canonicalDir}/scripts/tool.py`]) },
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.drifted).toEqual([`${adapterDir}/scripts/tool.py`]);
  });

  it('stays clean when the executable bit matches on both sides', async () => {
    const fs = makeReadFs(
      new Map([
        [`${canonicalDir}/scripts/tool.py`, bytes('print("hi")\n')],
        [`${adapterDir}/SKILL.md`, bytes('adapter')],
        [`${adapterDir}/scripts/tool.py`, bytes('print("hi")\n')],
      ]),
      {
        executables: new Set([`${canonicalDir}/scripts/tool.py`, `${adapterDir}/scripts/tool.py`]),
      },
    );

    const result = posixCheck(await checkCarriage(canonicalDir, adapterDir, fs));

    expect(result.drifted).toEqual([]);
  });
});

describe('syncCarriage', () => {
  const canonicalDir = '/repo/.agent/skills/cognition/parallax';
  const adapterDir = '/repo/.claude/skills/oak-parallax';

  it('copies every carried file into the projection byte-stably', async () => {
    const files = new Map([
      [`${canonicalDir}/references/a.md`, bytes('alpha')],
      [`${canonicalDir}/scripts/tool.py`, bytes('print("hi")\n')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
    ]);

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, makeWriteFs(files)));

    expect(outcome.carried).toEqual([
      `${adapterDir}/references/a.md`,
      `${adapterDir}/scripts/tool.py`,
    ]);
    expect(outcome.pruned).toEqual([]);
    expect(outcome.refused).toEqual([]);
    expect(files.get(`${adapterDir}/references/a.md`)).toEqual(bytes('alpha'));
    expect(files.get(`${adapterDir}/scripts/tool.py`)).toEqual(bytes('print("hi")\n'));
  });

  it('overwrites a drifted projection copy with the canonical bytes', async () => {
    const files = new Map([
      [`${canonicalDir}/references/a.md`, bytes('canonical')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
      [`${adapterDir}/references/a.md`, bytes('drifted')],
    ]);

    await syncCarriage(canonicalDir, adapterDir, makeWriteFs(files));

    expect(files.get(`${adapterDir}/references/a.md`)).toEqual(bytes('canonical'));
  });

  it('prunes orphans whose canonical source is gone, leaving SKILL.md untouched', async () => {
    const files = new Map([
      [`${canonicalDir}/references/kept.md`, bytes('kept')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
      [`${adapterDir}/references/kept.md`, bytes('kept')],
      [`${adapterDir}/references/deleted-upstream.md`, bytes('stale')],
      [`${adapterDir}/evals/evals.json`, bytes('never carried')],
    ]);

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, makeWriteFs(files)));

    expect(outcome.pruned).toEqual([
      `${adapterDir}/evals/evals.json`,
      `${adapterDir}/references/deleted-upstream.md`,
    ]);
    expect(files.has(`${adapterDir}/references/deleted-upstream.md`)).toBe(false);
    expect(files.has(`${adapterDir}/evals/evals.json`)).toBe(false);
    expect(files.get(`${adapterDir}/SKILL.md`)).toEqual(bytes('adapter'));
    expect(files.get(`${adapterDir}/references/kept.md`)).toEqual(bytes('kept'));
  });

  it('carries nothing and prunes nothing for a skill with no supporting content', async () => {
    const files = new Map([[`${adapterDir}/SKILL.md`, bytes('adapter')]]);

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, makeWriteFs(files)));

    expect(outcome).toEqual({ carried: [], pruned: [], refused: [] });
  });

  it('prunes every orphan before copying anything, so shape transitions never collide', async () => {
    const files = new Map([
      [`${canonicalDir}/references/topic/deep.md`, bytes('now a directory')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
      [`${adapterDir}/references/topic`, bytes('was a file')],
    ]);
    const operationLog: string[] = [];

    await syncCarriage(canonicalDir, adapterDir, makeWriteFs(files, { operationLog }));

    expect(operationLog).toEqual([
      `remove:${adapterDir}/references/topic`,
      `copy:${adapterDir}/references/topic/deep.md`,
    ]);
  });

  it('prunes a non-regular projection entry even when it sits at an expected carried path', async () => {
    const files = new Map([
      [`${canonicalDir}/scripts/tool.py`, bytes('print("hi")\n')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
    ]);
    const operationLog: string[] = [];
    const fs = makeWriteFs(files, {
      others: new Set([`${adapterDir}/scripts/tool.py`]),
      operationLog,
    });

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, fs));

    expect(outcome.pruned).toEqual([`${adapterDir}/scripts/tool.py`]);
    expect(operationLog).toEqual([
      `remove:${adapterDir}/scripts/tool.py`,
      `copy:${adapterDir}/scripts/tool.py`,
    ]);
  });

  it('refuses the whole sync before any destructive work on a canonical-side non-regular entry', async () => {
    const files = new Map([
      [`${canonicalDir}/references/real.md`, bytes('real')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
      [`${adapterDir}/references/stale-would-be-pruned.md`, bytes('stale')],
    ]);
    const operationLog: string[] = [];
    const fs = makeWriteFs(files, {
      others: new Set([`${canonicalDir}/references/smuggled.md`]),
      operationLog,
    });

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, fs));

    expect(outcome.carried).toEqual([]);
    expect(outcome.pruned).toEqual([]);
    expect(outcome.refused).toHaveLength(1);
    expect(operationLog).toEqual([]);
    expect(files.has(`${adapterDir}/references/stale-would-be-pruned.md`)).toBe(true);
  });

  it('refuses the whole sync on a seam read failure instead of pruning a partially observed tree', async () => {
    const files = new Map([
      [`${canonicalDir}/references/a.md`, bytes('alpha')],
      [`${adapterDir}/SKILL.md`, bytes('adapter')],
      [`${adapterDir}/references/a.md`, bytes('alpha')],
    ]);
    const operationLog: string[] = [];
    const fs: CarriageWriteFs = {
      ...makeWriteFs(files, { operationLog }),
      async listFileNames() {
        return { kind: 'failure', message: 'EIO: i/o error' };
      },
    };

    const outcome = posixSync(await syncCarriage(canonicalDir, adapterDir, fs));

    expect(outcome.refused.some((message) => message.includes('EIO'))).toBe(true);
    expect(outcome.pruned).toEqual([]);
    expect(operationLog).toEqual([]);
  });
});
