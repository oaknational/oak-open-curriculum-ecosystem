import { join } from 'node:path';

import { unwrapErr } from '@oaknational/result';
import { afterEach, describe, expect, it } from 'vitest';

import { buildMcpConformanceNodeIo, writeRunSummary } from '../../src/mcp-conformance/node-io.js';
import { type OwnerOnlyWriteOps } from '../../src/mcp-conformance/owner-only-write.js';
import {
  cleanupSandboxes,
  readSandboxFile,
  sandbox,
  writeSandboxFile,
} from './test-helpers/io-sandbox.js';

afterEach(() => {
  cleanupSandboxes();
});

/**
 * A pure recorder over the descriptor-ordered write operations. On-disk mode
 * bits are a POSIX observable (NTFS reports every writable file identically),
 * so the owner-only guarantee is proven at the level the product actually
 * controls: WHAT it requested and IN WHAT ORDER — created at 0600, descriptor
 * tightened before any content, closed, never re-opened by path.
 */
function recordingOps(): { readonly calls: string[]; readonly ops: OwnerOnlyWriteOps } {
  const calls: string[] = [];
  const ops: OwnerOnlyWriteOps = {
    open: (_path, _flags, mode) => {
      calls.push(`open:${mode.toString(8)}`);
      return 17;
    },
    fchmod: (fd, mode) => {
      calls.push(`fchmod:${String(fd)}:${mode.toString(8)}`);
    },
    write: (fd) => {
      calls.push(`write:${String(fd)}`);
    },
    close: (fd) => {
      calls.push(`close:${String(fd)}`);
    },
  };
  return { calls, ops };
}

describe('retainRawReport — verbatim retention with caller-shaped paths', () => {
  it('a relative report dir writes under the repo root and reports the relative path', () => {
    const root = sandbox();
    const io = buildMcpConformanceNodeIo(root, join('tmp', 'reports'));
    const outcome = io.retainRawReport('protocol', '{"raw":"bytes"}');
    expect(outcome).toEqual({ ok: true, reportedPath: join('tmp', 'reports', 'protocol.json') });
    expect(readSandboxFile(root, 'tmp', 'reports', 'protocol.json')).toBe('{"raw":"bytes"}');
  });

  it('an absolute report dir stands as given — written there and reported verbatim', () => {
    const root = sandbox();
    const elsewhere = join(sandbox(), 'evidence');
    const io = buildMcpConformanceNodeIo(root, elsewhere);
    const outcome = io.retainRawReport('oauth', 'verbatim');
    expect(outcome).toEqual({ ok: true, reportedPath: join(elsewhere, 'oauth.json') });
    expect(readSandboxFile(elsewhere, 'oauth.json')).toBe('verbatim');
  });

  it('an unwritable target is a loud retention failure, never a throw', () => {
    const root = sandbox();
    // Occupy the report-dir path with a FILE so mkdir cannot create it.
    writeSandboxFile('a file where a directory must go', root, 'blocked');
    const io = buildMcpConformanceNodeIo(root, 'blocked');
    const outcome = io.retainRawReport('protocol', 'content');
    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error.length > 0).toBe(true);
  });

  it('the aggregate summary lands beside the raw reports with the caller-shaped path', () => {
    const root = sandbox();
    const outcome = writeRunSummary(root, join('tmp', 'reports'), '{"verdict":"pass"}');
    expect(outcome).toEqual({ ok: true, reportedPath: join('tmp', 'reports', 'summary.json') });
    expect(readSandboxFile(root, 'tmp', 'reports', 'summary.json')).toBe('{"verdict":"pass"}');
  });

  it('a retained report is owner-only by construction — created at 0600, descriptor tightened before any content lands', () => {
    // Attended runs carry credentials in vendor output. The ordering is the
    // whole guarantee: `mode` applies at creation only, and a chmod AFTER the
    // write would expose the payload in the window between them — so the
    // contract proven here, THROUGH the production retention surface, is
    // open(0600) → fchmod(0600) → write → close on one descriptor, never a
    // path re-open. (On-disk mode bits are a POSIX observable NTFS cannot
    // express, so the requested-operations ordering is the invariant.)
    const root = sandbox();
    const { calls, ops } = recordingOps();
    const io = buildMcpConformanceNodeIo(root, join('tmp', 'reports'), ops);

    const outcome = io.retainRawReport('protocol', '{"raw":"bytes"}');

    expect(outcome.ok).toBe(true);
    expect(calls).toEqual(['open:600', 'fchmod:17:600', 'write:17', 'close:17']);
  });

  it('the aggregate summary is owner-only through the same ordered write', () => {
    const root = sandbox();
    const { calls, ops } = recordingOps();

    const outcome = writeRunSummary(root, join('tmp', 'reports'), '{"verdict":"pass"}', ops);

    expect(outcome.ok).toBe(true);
    expect(calls.indexOf('fchmod:17:600')).toBeGreaterThan(calls.indexOf('open:600'));
    expect(calls.indexOf('fchmod:17:600')).toBeLessThan(calls.indexOf('write:17'));
  });

  it('a chmod failure is a loud retention failure before any content lands, and the descriptor still closes', () => {
    const root = sandbox();
    const { calls, ops } = recordingOps();
    const failing: OwnerOnlyWriteOps = {
      ...ops,
      fchmod: () => {
        throw new Error('EPERM: fchmod refused');
      },
    };
    const io = buildMcpConformanceNodeIo(root, join('tmp', 'reports'), failing);

    const outcome = io.retainRawReport('protocol', 'secret');

    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error).toContain('fchmod refused');
    expect(calls).not.toContain('write:17');
    expect(calls).toContain('close:17');
  });
});

// The resolve-and-spawn happy path is deliberately NOT proven here: test code
// must not spawn child processes (testing-strategy §Rules), and the real bin
// under the real install is exercised live by the scheduled unattended CI
// workflow on every run. This block describes OUR half of the seam only —
// the spawn-free resolution-failure branch.
describe('runMcpjam — bin-resolution failure is loud and spawn-free', () => {
  it('a root without the dependency yields a launch error naming pnpm install', () => {
    const emptyRoot = sandbox();
    const io = buildMcpConformanceNodeIo(emptyRoot, 'tmp/unused');
    const error = unwrapErr(io.runMcpjam(['--version']));
    expect(error.message).toContain('pnpm install');
  });
});
