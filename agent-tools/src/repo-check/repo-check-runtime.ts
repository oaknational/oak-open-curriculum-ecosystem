import { spawn, spawnSync, type SpawnSyncReturns } from 'node:child_process';

import { writeErrorLine } from '../core/terminal-output.js';
import { resolveTrustedGit } from '../core/trusted-git.js';
import { pnpmSpawnEnvironment } from '../spawn/pnpm-env.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';

import type { RepoCheckRuntime } from './repo-check-types.js';

/**
 * Resolve `pnpm` to its trusted launchable invocation (an executable file
 * plus leading arguments — the file may be the running Node binary when the
 * resolved pnpm is a JS entry point) at this real I/O edge — the agent-tools
 * invariant (see `spawn/pnpm-path.ts`): bare `pnpm` never reaches spawn, so
 * a writable PATH entry cannot shadow it. Other commands pass through
 * unchanged; injected fake runtimes never hit this edge. Returns the
 * resolution error message alongside the command when pnpm is not found, so
 * callers fail loudly through their normal non-zero paths (never a throw).
 */
function trustedSpawnTarget(command: string): {
  readonly command: string;
  readonly leadingArgs?: readonly string[];
  readonly environment?: NodeJS.ProcessEnv;
  readonly error?: string;
} {
  if (command === 'pnpm') {
    const resolved = resolvePnpm(process.env);

    if (!resolved.ok) {
      return { command, error: resolved.error.message };
    }

    return {
      command: resolved.value.file,
      leadingArgs: resolved.value.leadingArgs,
      environment: pnpmSpawnEnvironment(process.env),
    };
  }

  if (command === 'git') {
    return trustedGitTarget(command);
  }

  return { command };
}

/**
 * `resolveTrustedGit` throws on failure (its documented contract); this
 * single boundary translates that into the runtime's loud non-zero error
 * shape instead of letting the throw escape.
 */
function trustedGitTarget(command: string): { readonly command: string; readonly error?: string } {
  try {
    return { command: resolveTrustedGit() };
  } catch (cause) {
    return { command, error: cause instanceof Error ? cause.message : String(cause) };
  }
}

export function runInheritedProcess(command: string, args: readonly string[]): Promise<number> {
  const trusted = trustedSpawnTarget(command);

  if (trusted.error !== undefined) {
    writeErrorLine(`${command}: ${trusted.error}`);
    return Promise.resolve(1);
  }

  return new Promise((resolve) => {
    const child = spawn(trusted.command, [...(trusted.leadingArgs ?? []), ...args], {
      stdio: 'inherit',
      env: trusted.environment,
    });
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
  const trusted = trustedSpawnTarget(command);

  if (trusted.error !== undefined) {
    return {
      pid: 0,
      output: [],
      stdout: '',
      stderr: `${command}: ${trusted.error}`,
      status: 1,
      signal: null,
    };
  }

  return normaliseSpawnResult(
    command,
    spawnSync(trusted.command, [...(trusted.leadingArgs ?? []), ...args], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 50,
      env: trusted.environment,
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
