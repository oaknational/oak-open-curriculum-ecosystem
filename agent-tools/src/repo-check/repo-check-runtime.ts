import { spawn, spawnSync, type SpawnSyncReturns } from 'node:child_process';

import { writeErrorLine } from '../core/terminal-output.js';
import { resolveTrustedGit } from '../core/trusted-git.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';

import type { RepoCheckRuntime } from './repo-check-types.js';

/**
 * Environment for spawning the RESOLVED standalone pnpm. The corepack
 * variables inherited from an outer corepack-shimmed pnpm chain must be
 * stripped: under `COREPACK_ROOT` the standalone binary refuses to
 * self-switch to the repo's pinned `packageManager` version and fails the
 * devEngines pin (observed first-hand: an 11.9.0 standalone refusing the
 * 11.8.0 pin inside a hook chain); without them it self-switches per the pin.
 */
function pnpmSpawnEnvironment(): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  delete environment.COREPACK_ROOT;
  delete environment.COREPACK_ENABLE_AUTO_PIN;
  delete environment.COREPACK_ENABLE_DOWNLOAD_PROMPT;
  // COREPACK_HOME redirects which cached package-manager build corepack
  // executes — an env knob over code selection, stripped with its siblings
  // (2026-08-12 security review).
  delete environment.COREPACK_HOME;
  return environment;
}

/**
 * Resolve `pnpm` to its trusted absolute path at this real I/O edge — the
 * agent-tools invariant (see `spawn/pnpm-path.ts`): bare `pnpm` never reaches
 * spawn, so a writable PATH entry cannot shadow it. Other commands pass
 * through unchanged; injected fake runtimes never hit this edge. Returns the
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
      environment: pnpmSpawnEnvironment(),
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
