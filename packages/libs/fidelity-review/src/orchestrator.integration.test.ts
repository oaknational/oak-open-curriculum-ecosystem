import { err, ok, type Result } from '@oaknational/result';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';

import type { DevServerHandle } from './dev-server';
import {
  buildAndWriteReport,
  captureAndReport,
  collectPairResults,
  diffPair,
  type CaptureRun,
  type EvidenceIo,
  type RunFlags,
} from './orchestrator';
import { contentHashOf } from './capture-manifest';
import type { FidelityPair } from './pairing-types';
import type { PairResult } from './report';

/* The teardown bracket is the no-unbounded-host-load invariant: a
 * spawned dev server must be reaped on EVERY exit path. Collaborators
 * are injected, so the bracket proves with plain-function fakes and no
 * real processes, sockets, or filesystem — and diffPair's four
 * outcomes prove the same way, with in-memory PNGs. */

const FLAGS: RunFlags = {
  base: 'http://localhost:3020',
  width: 1440,
  reportOnly: false,
  keepServer: false,
};

function spawnedHandle(stopResult: Result<void, string> = ok(undefined)): {
  handle: DevServerHandle;
  stops: () => number;
} {
  let stops = 0;
  return {
    handle: {
      mode: 'spawned',
      stop: () => {
        stops += 1;
        return Promise.resolve(stopResult);
      },
    },
    stops: () => stops,
  };
}

function runWith(overrides: Partial<CaptureRun>): CaptureRun {
  return {
    assertServerUp: () => Promise.resolve(ok(undefined)),
    capturePhase: () => Promise.resolve(ok(undefined)),
    report: () => ok(undefined),
    ...overrides,
  };
}

describe('captureAndReport', () => {
  it('captures, reports with the server mode, and stops a spawned server', async () => {
    const { handle, stops } = spawnedHandle();
    const modes: string[] = [];

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({
        report: (serverMode) => {
          modes.push(serverMode);
          return ok(undefined);
        },
      }),
    );

    expect(outcome.ok).toBe(true);
    expect(modes).toEqual(['spawned']);
    expect(stops()).toBe(1);
  });

  it('fails the run when the report arm fails, still stopping the spawned server', async () => {
    const { handle, stops } = spawnedHandle();

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({ report: () => err('fidelity: register not found at /nowhere') }),
    );

    expect(outcome.ok ? undefined : outcome.error).toBe('fidelity: register not found at /nowhere');
    expect(stops()).toBe(1);
  });

  it('stops the spawned server when the capture phase fails, preserving the failure', async () => {
    const { handle, stops } = spawnedHandle();

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({ capturePhase: () => Promise.resolve(err('a live page capture looked blank')) }),
    );

    expect(outcome.ok ? undefined : outcome.error).toBe('a live page capture looked blank');
    expect(stops()).toBe(1);
  });

  it('stops the spawned server when reachability fails, and never captures', async () => {
    const { handle, stops } = spawnedHandle();
    let captured = 0;

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({
        assertServerUp: () => Promise.resolve(err('no server reachable at http://localhost:3020')),
        capturePhase: () => {
          captured += 1;
          return Promise.resolve(ok(undefined));
        },
      }),
    );

    expect(outcome.ok ? undefined : outcome.error).toContain('no server reachable');
    expect(captured).toBe(0);
    expect(stops()).toBe(1);
  });

  it('stops the spawned server when a capture arm throws, converting to a mechanical failure', async () => {
    const { handle, stops } = spawnedHandle();

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({
        capturePhase: () => Promise.reject(new Error('page.goto: net::ERR_CONNECTION_RESET')),
      }),
    );

    expect(outcome.ok ? undefined : outcome.error).toContain('ERR_CONNECTION_RESET');
    expect(stops()).toBe(1);
  });

  it('honours --keep-server by leaving the spawned server running', async () => {
    const { handle, stops } = spawnedHandle();

    const outcome = await captureAndReport({ ...FLAGS, keepServer: true }, handle, runWith({}));

    expect(outcome.ok).toBe(true);
    expect(stops()).toBe(0);
  });

  it('never stops an attached server (it was not ours to stop)', async () => {
    const outcome = await captureAndReport(FLAGS, { mode: 'attached' }, runWith({}));

    expect(outcome.ok).toBe(true);
  });

  it('composes a teardown failure onto an earlier failure instead of masking either', async () => {
    const { handle } = spawnedHandle(err('pid 123 did not release the port'));

    const outcome = await captureAndReport(
      FLAGS,
      handle,
      runWith({ capturePhase: () => Promise.resolve(err('capture failed')) }),
    );

    expect(outcome.ok ? undefined : outcome.error).toBe(
      'capture failed; then pid 123 did not release the port',
    );
  });

  it('surfaces a teardown failure even when the run itself succeeded', async () => {
    const { handle } = spawnedHandle(err('pid 123 did not release the port'));

    const outcome = await captureAndReport(FLAGS, handle, runWith({}));

    expect(outcome.ok ? undefined : outcome.error).toBe('pid 123 did not release the port');
  });
});

/** A valid single-pixel PNG, encoded in memory. */
function onePixelPng(): Buffer {
  const png = new PNG({ width: 1, height: 1 });
  png.data[0] = 255;
  png.data[1] = 0;
  png.data[2] = 0;
  png.data[3] = 255;
  return PNG.sync.write(png);
}

const PAIR: FidelityPair = {
  id: 'picker-oak-fold',
  kind: 'page-abovefold',
  exportPng: 'demo-evidence/export-picker-oak-fold.png',
  livePng: 'demo-evidence/live-picker-oak-fold.png',
  liveRoute: '/specimen',
  diffEligible: true,
};

/** A manifest whose entries hash the fixture evidence exactly — the
 *  cohort the default fakes serve. */
function manifestFor(pair: FidelityPair): string {
  const hash = contentHashOf(onePixelPng());
  return JSON.stringify({
    version: 1,
    base: 'http://localhost:3020',
    startedAt: '2026-08-09T17:00:00Z',
    promotedAt: '2026-08-09T17:03:00Z',
    entries: [pair.exportPng, pair.livePng].map((relativePath) => ({
      relativePath,
      widthCssPx: 1440,
      deviceScaleFactor: 2,
      contentHash: hash,
    })),
  });
}

function ioWith(overrides: Partial<EvidenceIo>): EvidenceIo {
  return {
    exists: () => true,
    read: () => ok(onePixelPng()),
    writeDiff: () => ok(undefined),
    readRegister: () => ok('{"version":1,"entries":[]}'),
    writeReportFile: () => ok(undefined),
    readManifest: () => ok(manifestFor(PAIR)),
    ...overrides,
  };
}

describe('diffPair', () => {
  it('reports absent evidence as a missing-evidence row naming the absent paths', () => {
    const outcome = diffPair(PAIR, ioWith({ exists: (candidate) => candidate === PAIR.exportPng }));

    expect(outcome.ok ? outcome.value : undefined).toEqual({
      pair: PAIR,
      status: 'missing-evidence',
      missing: [PAIR.livePng],
    });
  });

  it('reports an ineligible pair as reference-only without touching the images', () => {
    let reads = 0;
    const outcome = diffPair(
      { ...PAIR, diffEligible: false },
      ioWith({
        read: () => {
          reads += 1;
          return ok(onePixelPng());
        },
      }),
    );

    expect(outcome.ok ? outcome.value.status : undefined).toBe('reference-only');
    expect(reads).toBe(0);
  });

  it('diffs eligible evidence and writes the diff PNG named by pair id', () => {
    const written: string[] = [];
    const outcome = diffPair(
      PAIR,
      ioWith({
        writeDiff: (name) => {
          written.push(name);
          return ok(undefined);
        },
      }),
    );

    expect(outcome.ok ? outcome.value.status : undefined).toBe('diffed');
    expect(outcome.ok ? outcome.value.diff?.changedRatio : undefined).toBe(0);
    expect(written).toEqual(['diff-picker-oak-fold.png']);
  });

  it('fails the run on corrupt evidence — never a normal report row', () => {
    const outcome = diffPair(PAIR, ioWith({ read: () => ok(Buffer.from('not a png')) }));

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('corrupt evidence');
    expect(outcome.ok ? undefined : outcome.error).toContain(PAIR.id);
  });

  it('fails the run when existing evidence is unreadable — the io failure carries through', () => {
    const outcome = diffPair(
      PAIR,
      ioWith({ read: () => err('evidence unreadable at x — EACCES') }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('unreadable');
  });

  it('fails the run when the diff PNG cannot be written', () => {
    const outcome = diffPair(
      PAIR,
      ioWith({ writeDiff: () => err('diff write failed at d — ENOSPC') }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('diff write failed');
  });

  it('reports a non-zero changed ratio for differing evidence — magnitude flows, never gates', () => {
    // onePixelPng is a red opaque pixel; the export side here is GREEN,
    // so the single compared pixel differs and the ratio is exactly 1.
    const green = new PNG({ width: 1, height: 1 });
    green.data[1] = 255;
    green.data[3] = 255;
    const outcome = diffPair(
      PAIR,
      ioWith({
        read: (candidate) =>
          candidate === PAIR.exportPng ? ok(PNG.sync.write(green)) : ok(onePixelPng()),
      }),
    );

    expect(outcome.ok ? outcome.value.status : undefined).toBe('diffed');
    expect(outcome.ok ? outcome.value.diff?.changedRatio : undefined).toBe(1);
  });
});

describe('buildAndWriteReport (injected io, manifest-enforced)', () => {
  const CFG = {
    map: { version: 1 as const, pairs: [PAIR], exemptSurfaces: [] },
    demoDir: '/demo',
  };

  it('writes results.json and index.html, with report meta derived from the MANIFEST', () => {
    const written = new Map<string, string>();
    const outcome = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({
        writeReportFile: (name, content) => {
          written.set(name, content);
          return ok(undefined);
        },
      }),
    );

    expect(outcome.ok).toBe(true);
    expect([...written.keys()]).toEqual(['results.json', 'index.html']);
    // The meta is the manifest's capture provenance, not this invocation's.
    expect(written.get('results.json')).toContain('"base": "http://localhost:3020"');
    expect(written.get('results.json')).toContain('"widthCssPx": 1440');
  });

  it('refuses to report with NO capture manifest — a cohort must have been promoted', () => {
    const outcome = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readManifest: () => ok(undefined) }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('no capture manifest');
  });

  it('refuses a malformed or invalid manifest by name', () => {
    const notJson = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readManifest: () => ok('not json {') }),
    );
    const invalid = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readManifest: () => ok('{"version":2}') }),
    );

    expect(notJson.ok).toBe(false);
    expect(invalid.ok).toBe(false);
  });

  it('refuses TAMPERED evidence — canonical bytes that no longer hash to the manifest', () => {
    const green = new PNG({ width: 1, height: 1 });
    green.data[1] = 255;
    green.data[3] = 255;
    const outcome = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ read: () => ok(PNG.sync.write(green)) }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('does not match');
  });

  it('refuses an absent register by name — dispositions are the report, not an optional extra', () => {
    const outcome = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readRegister: () => ok(undefined) }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('register not found');
  });

  it('fails on an unreadable or invalid register', () => {
    const unreadable = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readRegister: () => err('register unreadable at r — EACCES') }),
    );
    const invalid = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ readRegister: () => ok('{"nope":true}') }),
    );

    expect(unreadable.ok).toBe(false);
    expect(invalid.ok).toBe(false);
  });

  it('fails the run when a report file cannot be written — the mutant a void writer would hide', () => {
    const outcome = buildAndWriteReport(
      'report-only',
      '2026-08-09T18:00:00Z',
      CFG,
      ioWith({ writeReportFile: () => err('report write failed at index.html — ENOSPC') }),
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('report write failed');
  });
});

const pairOf = (id: string): FidelityPair => ({ ...PAIR, id });

describe('collectPairResults (early stop)', () => {
  it('stops at the first mechanical failure and reports it', () => {
    const seen: string[] = [];
    const diffOne = (pair: FidelityPair): Result<PairResult, string> => {
      seen.push(pair.id);
      return pair.id === 'b' ? err('corrupt evidence for pair b') : ok({ pair, status: 'diffed' });
    };

    const outcome = collectPairResults([pairOf('a'), pairOf('b'), pairOf('c')], diffOne);

    expect(outcome.ok ? undefined : outcome.error).toBe('corrupt evidence for pair b');
    // 'c' is never diffed: the failure is run-fatal, not a report row.
    expect(seen).toEqual(['a', 'b']);
  });
});
