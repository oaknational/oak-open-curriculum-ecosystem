import type { HttpDevCommand, HttpDevExecutionPlan } from './http-dev-contract.js';

/**
 * Completion status for a spawned child process.
 */
export type ProcessCompletion =
  | {
      readonly kind: 'exit';
      readonly code: number | null;
      readonly signal: NodeJS.Signals | null;
    }
  | {
      readonly kind: 'error';
      readonly error: Error;
    };

/**
 * Minimal child-process contract used by the orchestration layer.
 */
export interface ManagedProcess {
  readonly completed: Promise<ProcessCompletion>;
  terminate(signal: NodeJS.Signals): void;
}

/**
 * Abstraction for spawning child processes during HTTP dev orchestration.
 */
export interface ProcessRunner {
  spawn(command: HttpDevCommand): ManagedProcess;
}

/**
 * Signal registration function used by the session orchestrator.
 */
export type SignalRegistrar = (signal: NodeJS.Signals, handler: () => void) => void;

/**
 * Dependencies required to run the HTTP dev orchestration.
 */
export interface RunHttpDevSessionOptions {
  readonly executionPlan: HttpDevExecutionPlan;
  readonly processRunner: ProcessRunner;
  readonly onSignal: SignalRegistrar;
}

type SessionOutcome =
  | {
      readonly kind: 'signal';
      readonly signal: NodeJS.Signals;
    }
  | {
      readonly kind: 'watch';
      readonly completion: ProcessCompletion;
    }
  | {
      readonly kind: 'server';
      readonly completion: ProcessCompletion;
    };

type SignalOutcome = Extract<SessionOutcome, { kind: 'signal' }>;

/**
 * Runs the HTTP dev orchestration for the provided execution plan.
 */
export async function runHttpDevSession({
  executionPlan,
  processRunner,
  onSignal,
}: RunHttpDevSessionOptions): Promise<number> {
  const activeProcesses = new Set<ManagedProcess>();
  const shutdownSignalPromise = createShutdownSignalPromise(onSignal, activeProcesses);

  const initialWidgetBuild = spawnAndTrack(
    processRunner,
    executionPlan.initialWidgetBuild,
    activeProcesses,
  );
  const initialBuildOutcome = await Promise.race([
    initialWidgetBuild.completed,
    shutdownSignalPromise,
  ]);

  activeProcesses.delete(initialWidgetBuild);

  if (isSignalOutcome(initialBuildOutcome)) {
    await awaitProcessShutdown(activeProcesses);
    return signalToExitCode(initialBuildOutcome.signal);
  }

  const initialBuildExitCode = completionToExitCode(initialBuildOutcome);
  if (initialBuildExitCode !== 0) {
    return initialBuildExitCode;
  }

  const widgetWatch = spawnAndTrack(processRunner, executionPlan.widgetWatch, activeProcesses);
  const server = spawnAndTrack(processRunner, executionPlan.server, activeProcesses);
  const sessionOutcome = await Promise.race([
    widgetWatch.completed.then((completion) => ({ kind: 'watch', completion }) as const),
    server.completed.then((completion) => ({ kind: 'server', completion }) as const),
    shutdownSignalPromise,
  ]);

  if (isSignalOutcome(sessionOutcome)) {
    await awaitProcessShutdown(activeProcesses);
    return signalToExitCode(sessionOutcome.signal);
  }

  return await handleSessionOutcome(sessionOutcome, activeProcesses, widgetWatch, server);
}

function createShutdownSignalPromise(
  onSignal: SignalRegistrar,
  activeProcesses: ReadonlySet<ManagedProcess>,
): Promise<SignalOutcome> {
  return new Promise<SignalOutcome>((resolve) => {
    let resolved = false;

    const handleSignal = (signal: NodeJS.Signals) => {
      if (resolved) {
        return;
      }

      resolved = true;
      terminateProcesses(activeProcesses);
      resolve({ kind: 'signal', signal });
    };

    onSignal('SIGINT', () => {
      handleSignal('SIGINT');
    });
    onSignal('SIGTERM', () => {
      handleSignal('SIGTERM');
    });
  });
}

async function handleSessionOutcome(
  sessionOutcome: Exclude<SessionOutcome, { kind: 'signal' }>,
  activeProcesses: Set<ManagedProcess>,
  widgetWatch: ManagedProcess,
  server: ManagedProcess,
): Promise<number> {
  if (sessionOutcome.kind === 'server') {
    activeProcesses.delete(server);
    terminateProcesses([widgetWatch]);
    activeProcesses.delete(widgetWatch);
    await awaitProcessShutdown([widgetWatch]);
    return completionToExitCode(sessionOutcome.completion);
  }

  activeProcesses.delete(widgetWatch);
  terminateProcesses([server]);
  activeProcesses.delete(server);
  await awaitProcessShutdown([server]);

  const watchExitCode = completionToExitCode(sessionOutcome.completion);
  return watchExitCode === 0 ? 1 : watchExitCode;
}

function spawnAndTrack(
  processRunner: ProcessRunner,
  command: HttpDevCommand,
  activeProcesses: Set<ManagedProcess>,
): ManagedProcess {
  const processHandle = processRunner.spawn(command);
  activeProcesses.add(processHandle);
  return processHandle;
}

function isSignalOutcome(
  outcome: ProcessCompletion | SessionOutcome | SignalOutcome,
): outcome is SignalOutcome {
  return 'signal' in outcome && outcome.kind === 'signal';
}

function completionToExitCode(completion: ProcessCompletion): number {
  if (completion.kind === 'error') {
    return 1;
  }

  return completion.code ?? 1;
}

function signalToExitCode(signal: NodeJS.Signals): number {
  return signal === 'SIGINT' ? 130 : 143;
}

function terminateProcesses(processes: Iterable<ManagedProcess>): void {
  for (const processHandle of processes) {
    processHandle.terminate('SIGTERM');
  }
}

async function awaitProcessShutdown(processes: Iterable<ManagedProcess>): Promise<void> {
  const completions: Promise<ProcessCompletion>[] = [];

  for (const processHandle of processes) {
    completions.push(processHandle.completed);
  }

  await Promise.allSettled(completions);
}
