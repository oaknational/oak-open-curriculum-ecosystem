import { spawnSync } from 'node:child_process';

import { runFileBackedChild } from '../core/file-backed-child.js';

/**
 * The one boundary where `merge-bot push` meets a real git child process, and
 * the two ways it may consume that child's output.
 *
 * The split is not stylistic. R1 binds output whose VOLUME the tool does not
 * control, and the push has exactly one such child: git, running the
 * repository's whole pre-push gate chain underneath it. That output is
 * conserved in temporary FILES and replayed to the sink on completion —
 * never carried on Node pipes, which poison the hook chain underneath git
 * (F-112; see `fileBackedGitCall`). `rev-parse --abbrev-ref HEAD` answers
 * with a branch name, which the tool does control, and is captured.
 */

/** The fields of a completed git invocation the push action reads. */
export interface GitCommandResult {
  /**
   * The process exit status; `128` with `signal` named when the child was
   * killed; negative when the binary could not be run at all.
   */
  readonly status: number;
  /** The killing signal, named distinctly (F-112); `null` on a normal exit. */
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
}

interface GitCallOptions {
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /**
   * Kill the child after this many milliseconds (SIGTERM — spawnSync's own
   * timeout on the capturing arm; an abort bridge on the file-backed arm).
   * Also the seam that lets the signal-reporting contract be proven on
   * every platform, because a Node-initiated kill is the one termination
   * Windows reports with the signal named.
   */
  readonly timeoutMs?: number;
}

/**
 * The git seam, execFile-shaped and VALUE-returning (ADR-088): a non-zero
 * exit is a result to read, never a throw to catch.
 *
 * A caller may answer synchronously; the real executor answers with a Promise
 * on the file-backed arm, so every call site awaits.
 */
export type GitExecutor = (
  file: string,
  args: readonly string[],
  options: GitCallOptions & {
    /**
     * Sink for output whose volume this tool does not control. When supplied,
     * the executor conserves the child's streams in temporary files and
     * forwards them here in full on completion — no Node pipe ever stands
     * between git and the operator (F-112) — and the returned
     * `stdout`/`stderr` are empty.
     */
    readonly onOutput?: (chunk: string) => void;
  },
) => GitCommandResult | Promise<GitCommandResult>;

/**
 * Capture the whole of a child's output into the result. Sound ONLY where
 * this tool controls the volume, because the buffer here is `spawnSync`'s
 * 1 MiB default — a runtime's choice, and therefore never a limit this tool
 * may rely on for anything it does not bound itself (R2).
 */
/**
 * Names the cause when the executor's own timeout delivered the kill —
 * without it a timeout kill and an externally delivered signal would be
 * indistinguishable in the result.
 */
function timeoutNoteFor(error: Error | undefined, timeoutMs: number | undefined): string {
  return error !== undefined && 'code' in error && error.code === 'ETIMEDOUT'
    ? `\ngit killed by executor timeout after ${String(timeoutMs)}ms`
    : '';
}

function capturingGitCall(
  file: string,
  args: readonly string[],
  options: GitCallOptions,
): GitCommandResult {
  const result = spawnSync(file, [...args], {
    cwd: options.cwd,
    env: { ...options.env },
    encoding: 'utf8',
    timeout: options.timeoutMs,
  });
  // Signal first: a timeout kill sets BOTH `error` (ETIMEDOUT) and `signal`,
  // and a child that ran and was killed is a signal death (the 128 sentinel,
  // signal named) — never the -1 reserved for a binary that could not run.
  if (result.signal !== null) {
    return {
      status: 128,
      signal: result.signal,
      stdout: result.stdout ?? '',
      stderr: `${result.stderr ?? ''}${timeoutNoteFor(result.error, options.timeoutMs)}`,
    };
  }
  if (result.error !== undefined) {
    return {
      status: -1,
      signal: null,
      stdout: '',
      stderr: `cannot run git: ${result.error.message}`,
    };
  }
  return {
    status: result.status ?? -1,
    signal: result.signal,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

/**
 * Conserve a child's output in temporary FILES and replay it to `onOutput`
 * in full on completion, holding none of it in a Node pipe.
 *
 * This is the push's path, and the file backing is load-bearing twice over.
 * First the ceiling: the repository's pre-push gate chain emitted 1,852,962
 * bytes on a GREEN run (measured 2026-08-06, turbo leg only — a lower bound)
 * against `spawnSync`'s 1 MiB default; the result was ENOBUFS, SIGTERM, and
 * a push that reported failure while never landing. The file moves the
 * ceiling to the replay buffer, orders of magnitude above any gate chain.
 * Second the poisoning: Node's child-stdio pipes are libuv socketpairs, and
 * a socketpair on the spawned git's stderr poisons the hook chain underneath
 * it (F-112) — observed on this path 2026-08-07: the pre-push chain's knip
 * child died without a verdict, diagnosis lines written to stderr were
 * themselves eaten, and git's exit arrived as a bare null, while the
 * identical hook chain run outside the wrapper passed green. A file
 * descriptor cannot be poisoned this way at any depth of the chain, and the
 * child's exit code and killing signal are reported distinctly.
 */
function fileBackedGitCall(
  file: string,
  args: readonly string[],
  options: GitCallOptions & { readonly onOutput: (chunk: string) => void },
  runner: typeof runFileBackedChild,
): Promise<GitCommandResult> {
  const sink = { write: (content: Buffer) => options.onOutput(content.toString('utf8')) };
  // Honour the caller's bound on this arm too (via the runner's abort seam)
  // so `timeoutMs` is never a silently dropped option; the timer is unref'd
  // and cleared so it cannot hold the process open.
  const controller = options.timeoutMs === undefined ? undefined : new AbortController();
  const timer =
    controller === undefined
      ? undefined
      : setTimeout(() => {
          controller.abort();
        }, options.timeoutMs).unref();
  return runner({
    command: file,
    args,
    cwd: options.cwd,
    env: options.env,
    // One shared capture file: the kernel interleaves the gate chain's
    // stdout and stderr in write order, so a failing gate's stderr verdict
    // stays next to the stdout that explains it.
    combinedOutput: true,
    replaySinks: { stdout: sink, stderr: sink },
    abortSignal: controller?.signal,
  })
    .finally(() => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    })
    .then(
      (outcome) => ({
        status: outcome.exitCode,
        signal: outcome.signal,
        stdout: '',
        stderr: '',
      }),
      (cause: unknown) => ({
        status: -1,
        signal: null,
        stdout: '',
        stderr: `cannot run git: ${cause instanceof Error ? cause.message : String(cause)}`,
      }),
    );
}

/**
 * The real `child_process` translation, choosing its arm by the sink's
 * presence. The `runner` parameter exists for the spawn-free tier tests
 * (ADR-078); production callers pass nothing and get the file-backed
 * runner — the default binding is itself pinned by the stdio-topology
 * test, the one place a pipe-backed mutant dies.
 */
export function realGitExecutor(
  runner: typeof runFileBackedChild = runFileBackedChild,
): GitExecutor {
  return (file, args, options) => {
    const { onOutput } = options;
    return onOutput === undefined
      ? capturingGitCall(file, args, options)
      : fileBackedGitCall(file, args, { cwd: options.cwd, env: options.env, onOutput }, runner);
  };
}
