import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runFileBackedChild, type FileBackedChildReplaySinks } from '../src/core/file-backed-child';

/**
 * F-112 invariant tests for {@link runFileBackedChild} — real `spawn`,
 * deterministic synthetic children, no git, no global state.
 *
 * The pinned F-112 mechanism: Node-created pipes on a spawned
 * `git commit` stdio poison the pre-commit hook chain (the hook shell
 * takes SIGPIPE at the depcruise→turbo handover and its `set -e` exits 1
 * silently, so no commit lands), while file-backed stdio is immune. The
 * no-pipes test below is the deterministic regression guard for that
 * mechanism; the signal-fidelity tests guard the faithful exit/signal
 * reporting the pre-fix implementation lost (any signal collapsed to a
 * bare `128` with no signal field).
 */

const node = process.execPath;
const cwd = tmpdir();

interface CollectedReplay {
  readonly sinks: FileBackedChildReplaySinks;
  stdoutText(): string;
  stderrText(): string;
}

function collectReplay(): CollectedReplay {
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];
  return {
    sinks: {
      stdout: { write: (content: Buffer) => stdoutChunks.push(content) },
      stderr: { write: (content: Buffer) => stderrChunks.push(content) },
    },
    stdoutText: () => Buffer.concat(stdoutChunks).toString('utf8'),
    stderrText: () => Buffer.concat(stderrChunks).toString('utf8'),
  };
}

function run(script: string, sinks: FileBackedChildReplaySinks = collectReplay().sinks) {
  return runFileBackedChild({ command: node, args: ['-e', script], cwd, replaySinks: sinks });
}

describe('runFileBackedChild (F-112 invariants)', () => {
  it('never hands the child Node pipes for stdout/stderr', async () => {
    // Node's child-stdio "pipes" are socketpairs (libuv), so the guard
    // must refuse sockets AND FIFOs — file-backed stdio is neither.
    const result = await run(
      `const { fstatSync } = require('node:fs');
       const piped = (fd) => { const s = fstatSync(fd); return s.isFIFO() || s.isSocket(); };
       process.exit(piped(1) || piped(2) ? 7 : 0);`,
    );

    expect(result.exitCode).toBe(0);
    expect(result.signal).toBeNull();
  });

  it('conserves a high-volume bursty stderr stream from a completing child', async () => {
    const result = await run(
      String.raw`const chunk = 'x'.repeat(8192);
       for (let i = 0; i < 64; i += 1) process.stderr.write(chunk);
       process.stderr.write('\nF112-STDERR-END-MARKER\n');`,
    );

    expect(result.exitCode).toBe(0);
    expect(result.signal).toBeNull();
    expect(result.stderr.length).toBeGreaterThanOrEqual(64 * 8192);
    expect(result.stderr).toContain('F112-STDERR-END-MARKER');
  });

  it('replays each captured stream to its own sink', async () => {
    const replayed = collectReplay();
    await run(
      String.raw`process.stdout.write('F112-OUT-CONTENT\n');
       process.stderr.write('F112-ERR-CONTENT\n');`,
      replayed.sinks,
    );

    expect(replayed.stdoutText()).toBe('F112-OUT-CONTENT\n');
    expect(replayed.stderrText()).toBe('F112-ERR-CONTENT\n');
  });

  it('keeps stderr capture faithful under interleaved stdout/stderr bursts', async () => {
    const result = await run(
      String.raw`for (let i = 0; i < 32; i += 1) {
         process.stdout.write('o'.repeat(4096));
         process.stderr.write('e'.repeat(4096));
       }
       process.stderr.write('\nF112-MIXED-END-MARKER\n');`,
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('F112-MIXED-END-MARKER');
    expect(result.stderr).not.toContain('o'.repeat(4096));
  });

  it('interleaves both streams in write order under combinedOutput, through the stdout sink alone', async () => {
    // One shared file description: the kernel orders writes as a terminal
    // would, so a failing gate's stderr verdict stays beside the stdout
    // that explains it (the merge-bot push's transcript shape).
    const replayed = collectReplay();
    const result = await runFileBackedChild({
      command: node,
      args: [
        '-e',
        `process.stdout.write('OUT-1|'); process.stderr.write('ERR-1|'); process.stdout.write('OUT-2');`,
      ],
      cwd,
      combinedOutput: true,
      replaySinks: replayed.sinks,
    });

    expect(replayed.stdoutText()).toBe('OUT-1|ERR-1|OUT-2');
    expect(replayed.stderrText()).toBe('');
    expect(result.stderr).toBe('');
  });

  it('reports the child real exit code', async () => {
    const result = await run('process.exit(7);');

    expect(result.exitCode).toBe(7);
    expect(result.signal).toBeNull();
  });

  it('reports a signal-killed child distinctly, never as a bare 128', async () => {
    // The kill comes from the PARENT via the runner's abort seam: that is
    // the one termination every platform reports with the signal named — a
    // child terminating itself surfaces on Windows as a plain exit carrying
    // no signal at all, so a self-kill fixture could never prove this
    // contract there.
    const controller = new AbortController();
    const pending = runFileBackedChild({
      command: node,
      args: ['-e', 'setTimeout(() => {}, 60000);'],
      cwd,
      replaySinks: collectReplay().sinks,
      abortSignal: controller.signal,
    });
    setTimeout(() => {
      controller.abort();
    }, 200);

    const result = await pending;

    expect(result.signal).toBe('SIGTERM');
    expect(result.exitCode).toBe(128);
  });

  it('passes a provided child environment through', async () => {
    // The env option arrived with the merge-bot push consumer (its git child
    // carries the credential-file path in env).
    const explicit = collectReplay();
    await runFileBackedChild({
      command: node,
      args: ['-e', `process.stdout.write(String(process.env.F112_PROBE));`],
      cwd,
      env: { F112_PROBE: 'explicit-env-arrived' },
      replaySinks: explicit.sinks,
    });

    expect(explicit.stdoutText()).toBe('explicit-env-arrived');
  });

  it('inherits the parent environment when env is omitted', async () => {
    // The pre-option behaviour must hold: an omitted env inherits — the
    // mutant `env: options.env ?? {}` would strip PATH/HOME from the commit
    // workflow's git child. The CHILD reads its own PATH here (the string is
    // evaluated in the child, not the test process); the assertion leans on
    // the ambient fact that every runner environment sets PATH.
    const inherited = collectReplay();
    await runFileBackedChild({
      command: node,
      args: ['-e', `process.stdout.write(String(process.env.PATH ? 'inherited' : 'empty'));`],
      cwd,
      replaySinks: inherited.sinks,
    });

    expect(inherited.stdoutText()).toBe('inherited');
  });

  it('rejects on an unspawnable command without corrupting later use', async () => {
    await expect(
      runFileBackedChild({
        command: join(cwd, 'f112-no-such-binary'),
        args: [],
        cwd,
        replaySinks: collectReplay().sinks,
      }),
    ).rejects.toThrow(/ENOENT/);
  });
});
