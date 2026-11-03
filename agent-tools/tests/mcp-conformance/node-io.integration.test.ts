import { join, resolve } from 'node:path';

import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  buildMcpConformanceNodeIo,
  retainOwnerOnlyAt,
  writeRunSummary,
  writeUnder,
} from '../../src/mcp-conformance/node-io.js';
import { type OwnerOnlyWriteOps } from '../../src/mcp-conformance/owner-only-write-ops.js';
import {
  OwnerOnlyModeNotEnforcedError,
  OwnerOnlyModeNotHeldError,
  OwnerOnlyUnavailableError,
  writeOwnerOnly,
} from '../../src/mcp-conformance/owner-only-write.js';

/**
 * A recorder over the whole retention seam — directory creation, the ordered
 * descriptor write, and the rename — capturing both the ORDER of the requested
 * operations and their SUBJECTS: which directory, which path was opened, what
 * content was handed over, and what was renamed where.
 *
 * No test in this file touches a filesystem, because tests are NOT PERMITTED
 * to (`testing-strategy.md` §Test Types; the `no-real-io-in-tests` rule). That
 * is the starting point, not an outcome of how these happened to be written.
 *
 * That claim has to cover the QUIET filesystem access too. Until 2026-09-11 it
 * did not: the `runMcpjam` case below called the real module resolver, and
 * `resolve` walks `node_modules` directories on disk even though no path in the
 * call names a file (review finding, PR #132). A seam takes it now, like every
 * other edge here. A prohibition is not satisfied by an absence of `node:fs`
 * imports; it is satisfied when nothing on the path reaches the disk.
 *
 * Nothing is lost by it. Everything worth describing here is a property of OUR
 * code — the path it resolves, the content it hands over, the order it asks
 * for, and the fact that it never opens the destination. Whether the operating
 * system's `rename` replaces a symbolic link is a property of the operating
 * system; asserting it here would have been testing Node rather than the
 * product, which is why its former test is absent rather than relocated.
 *
 * `reportMode` is the MOUNT: the permission bits `fstat` answers for a given
 * `fchmod` request. The default honours the request, which is what a POSIX
 * filesystem does; a mount that ignores `fchmod` and synthesises a constant
 * mode, or one that reports a different mode than the one asked for, is that
 * same seam with a different function — which is the whole reason the
 * verification exists and the only way to describe it without a filesystem.
 */
function recordingOps(reportMode: (requested: number) => number = (requested) => requested): {
  readonly calls: string[];
  readonly madeDirs: string[];
  readonly opened: string[];
  readonly written: string[];
  readonly renames: { readonly from: string; readonly to: string }[];
  readonly ops: OwnerOnlyWriteOps;
} {
  const calls: string[] = [];
  const madeDirs: string[] = [];
  const opened: string[] = [];
  const written: string[] = [];
  const renames: { from: string; to: string }[] = [];
  let requestedMode = 0;
  const ops: OwnerOnlyWriteOps = {
    mkdir: (path) => {
      calls.push('mkdir');
      madeDirs.push(path);
    },
    open: (path, flags, mode) => {
      calls.push(`open:${flags}:${mode.toString(8)}`);
      opened.push(path);
      return 17;
    },
    fchmod: (fd, mode) => {
      calls.push(`fchmod:${String(fd)}:${mode.toString(8)}`);
      requestedMode = mode;
    },
    fstat: (fd) => {
      calls.push(`fstat:${String(fd)}`);
      // The regular-file type bits ride along, as the real `fstat` reports them.
      return 0o100000 | reportMode(requestedMode);
    },
    write: (fd, content) => {
      calls.push(`write:${String(fd)}`);
      written.push(content);
    },
    close: (fd) => {
      calls.push(`close:${String(fd)}`);
    },
    rename: (from, to) => {
      calls.push('rename');
      renames.push({ from, to });
    },
    unlink: () => {
      calls.push('unlink');
    },
  };
  return { calls, madeDirs, opened, written, renames, ops };
}

/**
 * The POSIX platform label every non-Windows test injects: the owner-only
 * contract is proven on any host, while the win32 refusal has its own tests.
 */
const POSIX: NodeJS.Platform = 'linux';

/**
 * The mode the module sets and reads back purely to establish that this mount
 * enforces permission bits rather than reporting them. Pinned here because a
 * change to it is a change to what the verification proves.
 */
const MODE_HONOURED_PROBE = 0o400;

const ORDERED_OWNER_ONLY_WRITE = [
  'mkdir',
  'open:wx:600',
  `fchmod:17:${MODE_HONOURED_PROBE.toString(8)}`,
  'fstat:17',
  'fchmod:17:600',
  'fstat:17',
  'write:17',
  'close:17',
  'rename',
];

/** A mount that answers one mode to every reading, whatever `fchmod` asked for. */
const reportingConstant = (constantMode: number) => (): number => constantMode;

describe('retainRawReport — verbatim retention with caller-shaped paths', () => {
  it('a relative report dir resolves under the repo root while the reported path stays caller-shaped', () => {
    const { madeDirs, renames, written, ops } = recordingOps();
    const io = buildMcpConformanceNodeIo('/repo', join('tmp', 'reports'), ops, POSIX);

    const outcome = io.retainRawReport('protocol', '{"raw":"bytes"}');

    expect(outcome).toEqual({ ok: true, reportedPath: join('tmp', 'reports', 'protocol.json') });
    expect(madeDirs).toEqual([resolve('/repo', join('tmp', 'reports'))]);
    expect(renames.map((move) => move.to)).toEqual([
      join(resolve('/repo', join('tmp', 'reports')), 'protocol.json'),
    ]);
    expect(written).toEqual(['{"raw":"bytes"}']);
  });

  it('an absolute report dir stands as given — written there and reported verbatim', () => {
    const elsewhere = resolve('/evidence', 'run-1');
    const { madeDirs, renames, written, ops } = recordingOps();
    const io = buildMcpConformanceNodeIo('/repo', elsewhere, ops, POSIX);

    const outcome = io.retainRawReport('oauth', 'verbatim');

    expect(outcome).toEqual({ ok: true, reportedPath: join(elsewhere, 'oauth.json') });
    expect(madeDirs).toEqual([elsewhere]);
    expect(renames.map((move) => move.to)).toEqual([join(elsewhere, 'oauth.json')]);
    expect(written).toEqual(['verbatim']);
  });

  it('a directory that cannot be created is a loud retention failure, never a throw', () => {
    const { calls, ops } = recordingOps();
    const blocked: OwnerOnlyWriteOps = {
      ...ops,
      mkdir: () => {
        throw new Error('ENOTDIR: a file where a directory must go');
      },
    };
    const io = buildMcpConformanceNodeIo('/repo', 'blocked', blocked, POSIX);

    const outcome = io.retainRawReport('protocol', 'content');

    expect(outcome).toEqual({ ok: false, error: 'ENOTDIR: a file where a directory must go' });
    expect(calls).not.toContain('open:wx:600');
  });

  it('the aggregate summary lands beside the raw reports with the caller-shaped path', () => {
    const { madeDirs, renames, written, ops } = recordingOps();

    const outcome = writeRunSummary(
      '/repo',
      join('tmp', 'reports'),
      '{"verdict":"pass"}',
      ops,
      POSIX,
    );

    expect(outcome).toEqual({ ok: true, reportedPath: join('tmp', 'reports', 'summary.json') });
    expect(madeDirs).toEqual([resolve('/repo', join('tmp', 'reports'))]);
    expect(renames.map((move) => move.to)).toEqual([
      join(resolve('/repo', join('tmp', 'reports')), 'summary.json'),
    ]);
    expect(written).toEqual(['{"verdict":"pass"}']);
  });

  it('a retained report is owner-only by construction — created at 0600, descriptor tightened and verified before any content lands', () => {
    // Attended runs carry credentials in vendor output. The ordering is the
    // whole guarantee: `mode` applies at creation only, and a chmod AFTER the
    // write would expose the payload in the window between them.
    const { calls, ops } = recordingOps();
    const io = buildMcpConformanceNodeIo('/repo', join('tmp', 'reports'), ops, POSIX);

    const outcome = io.retainRawReport('protocol', '{"raw":"bytes"}');

    expect(outcome.ok).toBe(true);
    expect(calls).toEqual(ORDERED_OWNER_ONLY_WRITE);
  });

  it('the destination is never opened — a temporary sibling is opened and renamed over it', () => {
    // Opening the destination would FOLLOW a symbolic link planted there and
    // truncate its target before the descriptor could be tightened. The
    // module's protection is that the destination is only ever a rename
    // target, which is a property of this code rather than of the OS.
    const { opened, renames, madeDirs, ops } = recordingOps();
    const destination = resolve('/packs', 'reviewer-pack.md');

    const outcome = retainOwnerOnlyAt(destination, 'pack', ops, POSIX);

    expect(outcome).toEqual({ ok: true, reportedPath: destination });
    expect(madeDirs).toEqual([resolve('/packs')]);
    expect(opened).toHaveLength(1);
    expect(opened[0]).not.toBe(destination);
    expect(opened[0]).toMatch(/[\\/]\.reviewer-pack\.md\..*\.tmp$/u);
    expect(renames).toEqual([{ from: opened[0], to: destination }]);
  });

  it('a chmod failure is a loud retention failure before any content lands; the descriptor still closes and no temporary file survives', () => {
    const { calls, ops } = recordingOps();
    const failing: OwnerOnlyWriteOps = {
      ...ops,
      fchmod: () => {
        throw new Error('EPERM: fchmod refused');
      },
    };
    const io = buildMcpConformanceNodeIo('/repo', join('tmp', 'reports'), failing, POSIX);

    const outcome = io.retainRawReport('protocol', 'secret');

    expect(outcome).toEqual({ ok: false, error: 'EPERM: fchmod refused' });
    expect(calls).not.toContain('write:17');
    expect(calls).not.toContain('rename');
    expect(calls).toContain('close:17');
    expect(calls).toContain('unlink');
  });

  it('a filesystem that does not honour the tightening is a loud refusal before any content lands', () => {
    // `fchmod` returns success on mounts that carry no POSIX permission bits,
    // so a successful call is not evidence the file is owner-only. Reading the
    // descriptor back turns a silent false claim into a refusal. This mount
    // tracks the probe but will not go narrower than 0644 — an exFAT or
    // DrvFS-without-metadata shape.
    const { calls, written, ops } = recordingOps((requested) =>
      requested === MODE_HONOURED_PROBE ? requested : 0o644,
    );
    const io = buildMcpConformanceNodeIo('/repo', join('tmp', 'reports'), ops, POSIX);

    const outcome = io.retainRawReport('protocol', 'secret');

    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error).toContain('0644');
    expect(written).toEqual([]);
    expect(calls).not.toContain('rename');
    expect(calls).toContain('close:17');
    expect(calls).toContain('unlink');
  });

  it('the mode refusal is typed, so a caller can tell it from an IO failure', () => {
    const { ops } = recordingOps((requested) =>
      requested === MODE_HONOURED_PROBE ? requested : 0o666,
    );

    expect(() => {
      writeOwnerOnly(resolve('/repo', 'summary.json'), 'secret', ops, POSIX);
    }).toThrow(OwnerOnlyModeNotHeldError);
  });

  it('a mount that REPORTS 0600 without enforcing it is refused, because reading 0600 back proves nothing there', () => {
    // The false claim wearing the right answer: CIFS/SMB without Unix
    // extensions synthesises every mode from `file_mode=`, so `file_mode=0600`
    // answers 0600 to any reading while `fchmod` changes nothing and the
    // server-side ACL still governs who can read the file. A single reading
    // would accept this mount; the probe that precedes it does not.
    const { calls, written, ops } = recordingOps(reportingConstant(0o600));
    const io = buildMcpConformanceNodeIo('/repo', join('tmp', 'reports'), ops, POSIX);

    const outcome = io.retainRawReport('protocol', 'secret');

    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error).toContain('synthetic');
    expect(written).toEqual([]);
    expect(calls).not.toContain('rename');
    // Refused at the FIRST reading: the 0600 tightening is never even asked for.
    expect(calls).not.toContain('fchmod:17:600');
    expect(calls).toContain('close:17');
    expect(calls).toContain('unlink');
  });

  it('the unenforced-mode refusal is typed, so it is distinguishable from a mount that simply reads wide', () => {
    const { ops } = recordingOps(reportingConstant(0o600));

    expect(() => {
      writeOwnerOnly(resolve('/repo', 'summary.json'), 'secret', ops, POSIX);
    }).toThrow(OwnerOnlyModeNotEnforcedError);
  });

  it('on Windows the owner-only write is refused before any file is touched, with a typed error naming the reason', () => {
    // NTFS access control is ACL-based; fchmod cannot set it, so "owner-only"
    // would be a false claim there. The refusal precedes every filesystem
    // operation, so no artefact — protected or not — is ever created.
    const { calls, ops } = recordingOps();

    expect(() => {
      writeOwnerOnly(resolve('/repo', 'summary.json'), 'secret', ops, 'win32');
    }).toThrow(OwnerOnlyUnavailableError);
    expect(calls).toEqual([]);
  });

  it('on Windows every retention entry point yields a failed outcome naming the Windows refusal, and nothing is written', () => {
    const viaAbsolutePath = recordingOps();
    const viaReportDir = recordingOps();

    const packOutcome = retainOwnerOnlyAt(
      resolve('/packs', 'reviewer-pack.md'),
      'pack',
      viaAbsolutePath.ops,
      'win32',
    );
    const reportOutcome = writeUnder(
      '/repo',
      join('tmp', 'reports'),
      'protocol.json',
      'secret',
      viaReportDir.ops,
      'win32',
    );

    for (const outcome of [packOutcome, reportOutcome]) {
      expect(outcome.ok).toBe(false);
      expect(!outcome.ok && outcome.error).toContain('win32');
      expect(!outcome.ok && outcome.error).toContain('ACL');
    }
    // A refusal leaves NOTHING behind. Creating the caller's report directory
    // on the way to reporting that nothing was written is still a mutation of
    // a caller-selected path, so the platform check precedes even the `mkdir`.
    expect(viaAbsolutePath.calls).toEqual([]);
    expect(viaReportDir.calls).toEqual([]);
    expect(viaAbsolutePath.written).toEqual([]);
    expect(viaReportDir.written).toEqual([]);
  });
});

// The resolve-and-spawn happy path is deliberately NOT proven here: test code
// must not spawn child processes (testing-strategy §Rules), and the real bin
// under the real install is exercised live by the scheduled unattended CI
// workflow on every run. This block describes OUR half of the seam only —
// the spawn-free resolution-failure branch.
describe('runMcpjam — bin-resolution failure is loud and spawn-free', () => {
  it('a root without the dependency yields a launch error naming pnpm install', () => {
    // The resolver is injected. Module resolution walks `node_modules` on disk,
    // so calling the real one here would have been filesystem access even
    // though no path in the call names a file — the quiet kind this file must
    // not perform, and the reason it is a seam.
    const absent = (): string => {
      throw new Error("Cannot find module '@mcpjam/cli'");
    };
    const io = buildMcpConformanceNodeIo(
      resolve('/no-such-root'),
      'tmp/unused',
      undefined,
      POSIX,
      absent,
    );

    const error = unwrapErr(io.runMcpjam(['--version']));

    expect(error.message).toContain('pnpm install');
    expect(error.message).toContain('@mcpjam/cli');
  });
});
