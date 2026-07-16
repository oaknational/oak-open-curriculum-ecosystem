import { spawn } from 'node:child_process';
import { lstat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import {
  createManagedChildSession,
  manageChildProcess,
  type ManagedChildProcess,
  type ManagedChildListeners,
  type ManagedTimer,
  type OwnedProcessController,
  productionOwnedProcessController,
} from './owned-process.js';

export const GITLEAKS_ADAPTER_TIMEOUT_MS = 250;
const GITLEAKS_OUTPUT_LIMIT_BYTES = 4_096;
export const GITLEAKS_ARGS = [
  'stdin',
  '--ignore-gitleaks-allow',
  '--redact=100',
  '--no-banner',
  '--no-color',
  '--log-level=error',
  '--exit-code=3',
  '--timeout=1',
] as const;

export type SecretScanOutcome =
  | { readonly kind: 'clean' }
  | {
      readonly kind: 'skipped';
      readonly reason:
        | 'secret'
        | 'missing'
        | 'timeout'
        | 'scanner-error'
        | 'output-limit'
        | 'ambient-config';
    };

export type GitleaksProcessOutcome =
  | { readonly kind: 'completed'; readonly exitCode: number | null }
  | { readonly kind: 'missing' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'output-limit' }
  | { readonly kind: 'error' };

interface GitleaksProcessInput {
  readonly payload: string;
  readonly cwd: string;
  readonly env: Readonly<NodeJS.ProcessEnv>;
  readonly executable: string;
}

export interface GitleaksProcessRunner {
  readonly run: (input: GitleaksProcessInput) => Promise<GitleaksProcessOutcome>;
}

export interface GitleaksCwdInspection {
  readonly isClean: (cwd: string) => Promise<boolean>;
}

interface GitleaksSpawnRequest {
  readonly executable: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<NodeJS.ProcessEnv>;
}

export interface GitleaksProcessDependencies {
  readonly spawn: (request: GitleaksSpawnRequest) => ManagedChildProcess;
  readonly ownedProcesses: OwnedProcessController;
  readonly startTimeout: (callback: () => void, durationMs: number) => ManagedTimer;
}

const productionDependencies: GitleaksProcessDependencies = {
  spawn: (request) =>
    manageChildProcess(
      spawn(request.executable, [...request.args], {
        cwd: request.cwd,
        detached: process.platform !== 'win32',
        env: { ...request.env },
        shell: false,
        stdio: ['pipe', 'pipe', 'pipe'],
      }),
    ),
  ownedProcesses: productionOwnedProcessController,
  startTimeout: (callback, durationMs) => {
    const timer = setTimeout(callback, durationMs);
    return { cancel: () => clearTimeout(timer), unref: () => timer.unref() };
  },
};

/** Construct a scanner runner around explicit process, ownership, and timer boundaries. */
export function createGitleaksProcessRunner(
  dependencies: GitleaksProcessDependencies,
): GitleaksProcessRunner {
  return { run: (input) => executeGitleaksProcess(input, dependencies) };
}

const productionGitleaksRunner = createGitleaksProcessRunner(productionDependencies);

const productionCwdInspection: GitleaksCwdInspection = {
  isClean: hasNoAmbientGitleaksFiles,
};

export async function scanOutboundPayload(input: {
  readonly payload: string;
  readonly isolatedCwd: string;
  readonly env: Readonly<NodeJS.ProcessEnv>;
  readonly executable: string;
  readonly runner?: GitleaksProcessRunner;
  readonly cwdInspection?: GitleaksCwdInspection;
}): Promise<SecretScanOutcome> {
  if (!isAbsolute(input.executable)) {
    return { kind: 'skipped', reason: 'missing' };
  }
  if (!(await (input.cwdInspection ?? productionCwdInspection).isClean(input.isolatedCwd))) {
    return { kind: 'skipped', reason: 'ambient-config' };
  }
  const outcome = await (input.runner ?? productionGitleaksRunner).run({
    payload: input.payload,
    cwd: input.isolatedCwd,
    env: input.env,
    executable: input.executable,
  });
  return toSecretScanOutcome(outcome);
}

function toSecretScanOutcome(outcome: GitleaksProcessOutcome): SecretScanOutcome {
  if (outcome.kind === 'completed' && outcome.exitCode === 0) {
    return { kind: 'clean' };
  }
  if (outcome.kind === 'completed' && outcome.exitCode === 3) {
    return { kind: 'skipped', reason: 'secret' };
  }
  if (outcome.kind === 'missing' || outcome.kind === 'timeout' || outcome.kind === 'output-limit') {
    return { kind: 'skipped', reason: outcome.kind };
  }
  return { kind: 'skipped', reason: 'scanner-error' };
}

function executeGitleaksProcess(
  input: GitleaksProcessInput,
  dependencies: GitleaksProcessDependencies,
): Promise<GitleaksProcessOutcome> {
  return new Promise((resolve) => {
    let child: ManagedChildProcess;
    try {
      child = dependencies.spawn({ ...input, args: GITLEAKS_ARGS });
    } catch (error) {
      resolve(isMissingExecutableError(error) ? { kind: 'missing' } : { kind: 'error' });
      return;
    }
    observeChild(child, input.payload, dependencies, resolve);
  });
}

function observeChild(
  child: ManagedChildProcess,
  payload: string,
  dependencies: GitleaksProcessDependencies,
  resolve: (outcome: GitleaksProcessOutcome) => void,
): void {
  let outputBytes = 0;
  const session = createManagedChildSession({
    child,
    ownedProcesses: dependencies.ownedProcesses,
    startTimeout: dependencies.startTimeout,
    resolve,
  });
  const fail = (outcome: GitleaksProcessOutcome): void => {
    session.finish(outcome, true);
  };
  const listeners: ManagedChildListeners = {
    stdoutData: countOutput,
    stderrData: countOutput,
    error: (error) => {
      fail(isMissingExecutableError(error) ? { kind: 'missing' } : { kind: 'error' });
    },
    stdinError: () => fail({ kind: 'error' }),
    close: (exitCode) => session.finish({ kind: 'completed', exitCode }, true),
  };
  function countOutput(chunk: Buffer): void {
    outputBytes += chunk.byteLength;
    if (outputBytes > GITLEAKS_OUTPUT_LIMIT_BYTES) {
      fail({ kind: 'output-limit' });
    }
  }
  session.start({
    listeners,
    payload,
    timeoutMs: GITLEAKS_ADAPTER_TIMEOUT_MS,
    onTimeout: () => fail({ kind: 'timeout' }),
  });
}

function isMissingExecutableError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

async function hasNoAmbientGitleaksFiles(cwd: string): Promise<boolean> {
  for (const basename of ['.gitleaks.toml', '.gitleaksignore']) {
    try {
      await lstat(join(cwd, basename));
      return false;
    } catch (error: unknown) {
      if (!isMissingExecutableError(error)) {
        return false;
      }
    }
  }
  return true;
}
