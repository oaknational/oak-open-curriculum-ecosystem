/**
 * The repo-check runtime's real I/O edge. Every command runs by name,
 * inheriting the parent's environment, with `PATH` as the trust root. A
 * missing binary fails loudly through each runner's own launch-failure path.
 * Injected fake runtimes never reach this edge.
 *
 * @packageDocumentation
 */
import { spawn, spawnSync, type SpawnSyncReturns } from 'node:child_process';

import { writeErrorLine } from '../core/terminal-output.js';

import type { RepoCheckRuntime } from './repo-check-types.js';

export function runInheritedProcess(command: string, args: readonly string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', (error) => {
      writeErrorLine(`${command}: ${error.message}`);
      resolve(1);
    });
  });
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
