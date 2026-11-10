/**
 * The repo-check runtime's real I/O edge. Every command runs by name, with
 * `PATH` as the trust root. A missing binary fails loudly through each
 * runner's own launch-failure path. Injected fake runtimes never reach this
 * edge.
 *
 * @packageDocumentation
 */
import { spawn, spawnSync, type ChildProcess, type SpawnSyncReturns } from 'node:child_process';

import { writeErrorLine } from '../core/terminal-output.js';
import { childEnvironment } from '../spawn/child-environment.js';
import { signalProcessGroup, type SignalOutcome } from '../spawn/process-group.js';

import type { RepoCheckRuntime } from './repo-check-types.js';

/** How an inherited-stdio child ended: an exit status, or the signal that killed it. */
export interface InheritedProcessEnd {
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
}

/** How {@link spawnInheritedProcess} starts its child. */
export interface InheritedProcessOptions {
  /** The child's working directory; defaults to this process's. */
  readonly cwd?: string;
  /** Variables set over the environment the child would otherwise get. */
  readonly extraEnv?: Readonly<Record<string, string>>;
  /**
   * Start the child as the leader of its own process group (and session),
   * and hand `onSpawn` a kill for the whole group once it is spawned, so the
   * caller can forward signals to it, bound its lifetime and sweep it. A
   * signal sent to one pid reaches only that process: the pnpm launcher on
   * this estate's hosts is a shell script that runs pnpm without exec, so a
   * gate's real work sits two levels below it. The kill returns the kernel's
   * answer. The child also leaves the controlling terminal, so a terminal's
   * Ctrl-C reaches it only through the caller.
   */
  readonly processGroup?: {
    readonly onSpawn: (killGroup: (signal: NodeJS.Signals) => SignalOutcome) => void;
  };
}

/**
 * Spawn a command with inherited stdio and report how it ended.
 *
 * A signal death is reported as such (`status` null, `signal` named), never
 * folded into an exit code: a gate that says "exit 1" for a child the OOM
 * killer took misclassifies a crash as a finding (F-112). A launch failure,
 * whether spawn reports it or throws it, is written to stderr and reported as
 * status 1.
 *
 * @param command - The command, run by name.
 * @param args - Arguments.
 * @param options - The child's working directory, extra environment, group and kill seam.
 */
export function spawnInheritedProcess(
  command: string,
  args: readonly string[],
  options: InheritedProcessOptions = {},
): Promise<InheritedProcessEnd> {
  return new Promise((resolve) => {
    let child: ChildProcess;
    try {
      child = spawn(command, args, {
        stdio: 'inherit',
        env: childEnvironment({ ambient: process.env, extra: options.extraEnv }),
        cwd: options.cwd,
        detached: options.processGroup !== undefined,
      });
    } catch (error: unknown) {
      writeErrorLine(`${command}: ${error instanceof Error ? error.message : String(error)}`);
      resolve({ status: 1, signal: null });
      return;
    }
    const leader = child.pid;
    options.processGroup?.onSpawn((signal) => signalProcessGroup(leader, signal));
    child.on('close', (status, signal) => resolve({ status, signal }));
    child.on('error', (error) => {
      writeErrorLine(`${command}: ${error.message}`);
      resolve({ status: 1, signal: null });
    });
  });
}

/** Spawn with inherited stdio and reduce the end to an exit code (a signal death reads as 1). */
export async function runInheritedProcess(
  command: string,
  args: readonly string[],
): Promise<number> {
  const end = await spawnInheritedProcess(command, args);
  return end.status ?? 1;
}

export function runCapturedProcess(
  command: string,
  args: readonly string[],
): SpawnSyncReturns<string> {
  return normaliseSpawnResult(
    command,
    spawnSync(command, args, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 50,
    }),
  );
}

/**
 * A spawnSync result as it truthfully arrives: on a LAUNCH failure (resolved
 * file exists but cannot be spawned — lost execute bit, missing shebang
 * target) the streams are null at runtime even though the library type says
 * string.
 */
export type RawSpawnResult = Omit<SpawnSyncReturns<string>, 'stdout' | 'stderr'> & {
  readonly stdout: string | null;
  readonly stderr: string | null;
};

/**
 * Normalise a spawnSync result so a launch failure surfaces as a diagnosable
 * non-zero result: on `error`, spawnSync returns null status and null
 * streams, which downstream stream reads would mask with a TypeError
 * instead of the actual failure.
 */
export function normaliseSpawnResult(
  command: string,
  result: RawSpawnResult,
): SpawnSyncReturns<string> {
  const stdout = result.stdout ?? '';
  const failure = result.error === undefined ? '' : `${command}: ${result.error.message}\n`;
  const stderr = `${failure}${result.stderr ?? ''}`;
  const status = result.error === undefined ? result.status : (result.status ?? 1);

  return { ...result, stdout, stderr, status };
}

export const defaultRuntime: RepoCheckRuntime = {
  runCaptured: runCapturedProcess,
  runInherited: runInheritedProcess,
};
