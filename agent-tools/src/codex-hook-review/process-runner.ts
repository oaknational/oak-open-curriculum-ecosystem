import { spawn } from 'node:child_process';

import {
  createManagedChildSession,
  manageChildProcess,
  type ManagedChildProcess,
  type ManagedChildListeners,
  type ManagedTimer,
  type OwnedProcessController,
  productionOwnedProcessController,
} from './owned-process.js';
import { type CodexProtocolError } from './protocol.js';

export const CODEX_PROCESS_TIMEOUT_MS = 4_000;
export const CODEX_PROCESS_STREAM_LIMIT_BYTES = 16 * 1_024;

export interface CodexProcessRequest {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<NodeJS.ProcessEnv>;
  readonly stdin: string;
  readonly inspectStdoutLine?: (line: string) => CodexProtocolError | undefined;
}

export type CodexProcessFailureReason =
  | 'hard-timeout'
  | 'stdout-limit'
  | 'stderr-limit'
  | 'process-error'
  | 'non-zero-exit'
  | CodexProtocolError['kind'];

export type CodexProcessOutcome =
  | { readonly kind: 'completed'; readonly stdout: string; readonly durationMs: number }
  | {
      readonly kind: 'failed';
      readonly reason: CodexProcessFailureReason;
      readonly durationMs: number;
    };

export interface CodexProcessRunner {
  readonly run: (request: CodexProcessRequest) => Promise<CodexProcessOutcome>;
}

interface CodexSpawnRequest {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<NodeJS.ProcessEnv>;
}

export interface CodexProcessDependencies {
  readonly spawn: (request: CodexSpawnRequest) => ManagedChildProcess;
  readonly ownedProcesses: OwnedProcessController;
  readonly startTimeout: (callback: () => void, durationMs: number) => ManagedTimer;
  readonly now: () => bigint;
}

type TerminalOutcome =
  | { readonly kind: 'completed'; readonly stdout: string }
  | { readonly kind: 'failed'; readonly reason: CodexProcessFailureReason };

interface CodexOutputState {
  readonly stdoutChunks: Buffer[];
  readonly inspection: StdoutInspectionState;
  stdoutBytes: number;
  stderrBytes: number;
}

const productionDependencies: CodexProcessDependencies = {
  spawn: (request) =>
    manageChildProcess(
      spawn(request.command, [...request.args], {
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
  now: () => process.hrtime.bigint(),
};

/** Construct a runner around explicit process, ownership, timer, and clock boundaries. */
export function createCodexProcessRunner(
  dependencies: CodexProcessDependencies,
): CodexProcessRunner {
  return { run: (request) => executeCodexProcess(request, dependencies) };
}

export const productionCodexProcessRunner = createCodexProcessRunner(productionDependencies);

function executeCodexProcess(
  request: CodexProcessRequest,
  dependencies: CodexProcessDependencies,
): Promise<CodexProcessOutcome> {
  const startedAt = dependencies.now();
  return new Promise((resolve) => {
    let child: ManagedChildProcess;
    try {
      child = dependencies.spawn(request);
    } catch {
      resolve(withDuration({ kind: 'failed', reason: 'process-error' }, startedAt, dependencies));
      return;
    }
    observeChild(child, request, startedAt, dependencies, resolve);
  });
}

function observeChild(
  child: ManagedChildProcess,
  request: CodexProcessRequest,
  startedAt: bigint,
  dependencies: CodexProcessDependencies,
  resolve: (outcome: CodexProcessOutcome) => void,
): void {
  const output: CodexOutputState = {
    stdoutChunks: [],
    inspection: { pending: Buffer.alloc(0) },
    stdoutBytes: 0,
    stderrBytes: 0,
  };
  const session = createManagedChildSession({
    child,
    ownedProcesses: dependencies.ownedProcesses,
    startTimeout: dependencies.startTimeout,
    resolve: (outcome: TerminalOutcome) => resolve(withDuration(outcome, startedAt, dependencies)),
  });
  const fail = (reason: CodexProcessFailureReason): void => {
    session.finish({ kind: 'failed', reason }, true);
  };
  const listeners = createCodexListeners(output, request.inspectStdoutLine, fail, finishFromClose);
  function finishFromClose(exitCode: number | null): void {
    const rejection = inspectFinalStdoutLine(output.inspection, request.inspectStdoutLine);
    const outcome: TerminalOutcome =
      rejection !== undefined
        ? { kind: 'failed', reason: rejection }
        : toExitOutcome(exitCode, output.stdoutChunks);
    session.finish(outcome, true);
  }
  session.start({
    listeners,
    payload: request.stdin,
    timeoutMs: CODEX_PROCESS_TIMEOUT_MS,
    onTimeout: () => fail('hard-timeout'),
  });
}

function createCodexListeners(
  output: CodexOutputState,
  inspect: CodexProcessRequest['inspectStdoutLine'],
  fail: (reason: CodexProcessFailureReason) => void,
  finish: (exitCode: number | null) => void,
): ManagedChildListeners {
  return {
    stdoutData: (chunk) => receiveStdout(output, chunk, inspect, fail),
    stderrData: (chunk) => {
      output.stderrBytes += chunk.byteLength;
      if (output.stderrBytes > CODEX_PROCESS_STREAM_LIMIT_BYTES) {
        fail('stderr-limit');
      }
    },
    error: () => fail('process-error'),
    stdinError: () => fail('process-error'),
    close: finish,
  };
}

function receiveStdout(
  output: CodexOutputState,
  chunk: Buffer,
  inspect: CodexProcessRequest['inspectStdoutLine'],
  fail: (reason: CodexProcessFailureReason) => void,
): void {
  output.stdoutBytes += chunk.byteLength;
  if (output.stdoutBytes > CODEX_PROCESS_STREAM_LIMIT_BYTES) {
    fail('stdout-limit');
    return;
  }
  output.stdoutChunks.push(chunk);
  const rejection = inspectStdoutChunk(output.inspection, chunk, inspect);
  if (rejection !== undefined) {
    fail(rejection);
  }
}

interface StdoutInspectionState {
  pending: Buffer;
}

function inspectStdoutChunk(
  state: StdoutInspectionState,
  chunk: Buffer,
  inspect: CodexProcessRequest['inspectStdoutLine'],
): CodexProtocolError['kind'] | undefined {
  if (inspect === undefined) {
    return undefined;
  }
  state.pending = Buffer.concat([state.pending, chunk]);
  let newline = state.pending.indexOf(0x0a);
  while (newline >= 0) {
    const line = state.pending.subarray(0, newline).toString('utf8');
    state.pending = state.pending.subarray(newline + 1);
    const rejection = inspect(line)?.kind;
    if (rejection !== undefined) {
      return rejection;
    }
    newline = state.pending.indexOf(0x0a);
  }
  return undefined;
}

function inspectFinalStdoutLine(
  state: StdoutInspectionState,
  inspect: CodexProcessRequest['inspectStdoutLine'],
): CodexProtocolError['kind'] | undefined {
  if (inspect === undefined || state.pending.length === 0) {
    return undefined;
  }
  const line = state.pending.toString('utf8');
  state.pending = Buffer.alloc(0);
  return inspect(line)?.kind;
}

function toExitOutcome(exitCode: number | null, stdoutChunks: readonly Buffer[]): TerminalOutcome {
  return exitCode === 0
    ? { kind: 'completed', stdout: Buffer.concat(stdoutChunks).toString('utf8') }
    : { kind: 'failed', reason: 'non-zero-exit' };
}

function withDuration(
  outcome: TerminalOutcome,
  startedAt: bigint,
  dependencies: CodexProcessDependencies,
): CodexProcessOutcome {
  const durationMs = Number((dependencies.now() - startedAt) / 1_000_000n);
  return { ...outcome, durationMs };
}
