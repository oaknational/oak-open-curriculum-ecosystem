import { spawn } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Destinations for the replayed child streams. Defaults to the parent's
 * own stdio; tests inject collectors so replay is assertable and the
 * runner's logs stay clean.
 */
export interface FileBackedChildReplaySinks {
  readonly stdout: { write(content: Buffer): unknown };
  readonly stderr: { write(content: Buffer): unknown };
}

export interface FileBackedChildOptions {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  /** The child's environment; omitted, the child inherits the parent's. */
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly replaySinks?: FileBackedChildReplaySinks;
  /**
   * One capture file for BOTH streams: the child's stdout and stderr share
   * one file description, so the kernel interleaves them in write order —
   * the transcript a terminal would show. Replayed through the stdout sink
   * alone; the result's `stderr` is empty. For callers that present one
   * merged transcript (the merge-bot push).
   */
  readonly combinedOutput?: boolean;
  /**
   * Aborting kills the child (Node's own spawn option, SIGTERM). Passed
   * through verbatim so callers can bound a child's lifetime; also the seam
   * that lets the signal-reporting contract be proven on every platform — a
   * PARENT-initiated kill is the one termination Windows reports with the
   * signal named (a child terminating itself surfaces there as a plain
   * exit, carrying no signal at all).
   */
  readonly abortSignal?: AbortSignal;
}

/**
 * Structured outcome of a child process run through
 * {@link runFileBackedChild}.
 *
 * `exitCode` is the child's real exit code; when the child was killed by
 * a signal it carries the `128` sentinel and `signal` names the signal
 * distinctly, so no termination information is lost (F-112 faithful
 * exit/signal reporting).
 */
export interface FileBackedChildResult {
  readonly exitCode: number;
  readonly signal: NodeJS.Signals | null;
  readonly stderr: string;
}

/**
 * Runs a child process with its stdout/stderr redirected to temporary
 * FILES, replayed to the parent's streams on completion.
 *
 * The child's stdio must NEVER be Node-created pipes (F-112). Node's
 * child-stdio "pipes" are libuv socketpairs; a socketpair on a spawned
 * `git commit`'s stderr poisons the pre-commit hook chain — the hook
 * shell takes SIGPIPE at the depcruise→turbo handover and the hook's
 * `set -e` turns the failed write into a silent exit 1, so no commit
 * lands. Every reproduction carried the socketpair on the child's
 * stderr; plain file descriptors are immune, and the full stream is
 * conserved and replayed, so the caller still sees everything — on
 * completion rather than live.
 *
 * Second worked instance (2026-08-07, the push path): `merge-bot push`
 * spawned git with pipe stdio and the pre-push chain's knip child died
 * without a verdict while diagnosis lines written to stderr were
 * themselves eaten — the identical hook chain run outside the wrapper
 * passed green. That instance moved this runner here to `core/` as its
 * shared home; the commit workflow, the commit-advisories checker, and
 * the merge-bot push executor all run their children through it.
 *
 * The replay ceiling is the capture buffer (`readFileSync` materialises
 * each stream), orders of magnitude above any gate chain's output —
 * spawnSync's 1 MiB default was the ceiling this replaced.
 */
/**
 * An abort-kill is a NORMAL termination for this runner: the close event
 * still fires with the signal, and the F-112 contract (128 sentinel + named
 * signal) reports it — rejecting on the accompanying `AbortError` would
 * replace that structured outcome with a throw.
 */
function isAbortKill(error: Error): boolean {
  return error.name === 'AbortError';
}

export async function runFileBackedChild(
  options: FileBackedChildOptions,
): Promise<FileBackedChildResult> {
  const captureDir = mkdtempSync(join(tmpdir(), 'agent-tools-child-io-'));
  const sinks = options.replaySinks ?? { stdout: process.stdout, stderr: process.stderr };
  const combined = options.combinedOutput === true;
  // Opened fds are tracked so a partial open (fd exhaustion on the second)
  // still closes the first and removes the capture dir in the finally.
  const openFds: number[] = [];

  try {
    const files = openCaptureFiles(captureDir, combined, openFds);

    return await new Promise((resolve, reject) => {
      let settled = false;

      const child = spawn(options.command, options.args, {
        cwd: options.cwd,
        env: options.env,
        stdio: ['ignore', files.stdoutFd, files.stderrFd],
        signal: options.abortSignal,
      });

      child.on('error', (error) => {
        if (settled || isAbortKill(error)) {
          return;
        }
        settled = true;
        reject(error);
      });

      // A failed spawn emits BOTH 'error' and 'close'; the settled guard
      // keeps this handler off that path so it never reads a capture the
      // rejection already abandoned.
      child.on('close', (code, signal) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(settleFromCapture(files, combined, sinks, code, signal));
      });
    });
  } finally {
    for (const fd of openFds) {
      closeSync(fd);
    }
    rmSync(captureDir, { recursive: true, force: true });
  }
}

interface CaptureFiles {
  readonly stdoutPath: string;
  readonly stderrPath: string;
  readonly stdoutFd: number;
  readonly stderrFd: number;
}

/** Open the capture file(s); combined mode shares ONE file description. */
function openCaptureFiles(captureDir: string, combined: boolean, openFds: number[]): CaptureFiles {
  const stdoutPath = join(captureDir, combined ? 'combined.log' : 'stdout.log');
  const stdoutFd = openSync(stdoutPath, 'w');
  openFds.push(stdoutFd);
  if (combined) {
    return { stdoutPath, stderrPath: stdoutPath, stdoutFd, stderrFd: stdoutFd };
  }
  const stderrPath = join(captureDir, 'stderr.log');
  const stderrFd = openSync(stderrPath, 'w');
  openFds.push(stderrFd);
  return { stdoutPath, stderrPath, stdoutFd, stderrFd };
}

/** Replay the capture and shape the result; combined replays once, stderr empty. */
function settleFromCapture(
  files: CaptureFiles,
  combined: boolean,
  sinks: FileBackedChildReplaySinks,
  code: number | null,
  signal: NodeJS.Signals | null,
): FileBackedChildResult {
  replay(sinks.stdout, readFileSync(files.stdoutPath));
  let stderrText = '';
  if (!combined) {
    const stderrContent = readFileSync(files.stderrPath);
    replay(sinks.stderr, stderrContent);
    stderrText = stderrContent.toString('utf8');
  }
  // One convention across both arms (the #820 review's finding A): a signal
  // death is the 128 sentinel with the signal named; the (null, null) cell —
  // unreachable in Node's close-event contract, probe-proven across six
  // termination modes — maps to the -1 could-not-run sentinel, never to
  // success. A failure must not be readable as success even from a cell
  // that should not exist.
  return { exitCode: code ?? (signal === null ? -1 : 128), signal, stderr: stderrText };
}

function replay(sink: FileBackedChildReplaySinks['stdout'], content: Buffer): void {
  if (content.length === 0) {
    return;
  }
  try {
    sink.write(content);
  } catch {
    // A synchronously-failing sink write (e.g. a sync EPIPE) must not
    // corrupt the child's faithfully-captured result (F-112). Async
    // stream errors follow the parent's own stream handling, as before.
  }
}
