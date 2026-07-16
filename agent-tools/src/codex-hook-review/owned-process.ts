import { type ChildProcessWithoutNullStreams } from 'node:child_process';

export interface OwnedChildProcess {
  readonly pid?: number;
  readonly kill: (signal: NodeJS.Signals) => boolean;
}

export interface ManagedChildProcess extends OwnedChildProcess {
  readonly endStdin: (payload: string) => void;
  readonly onStdoutData: (listener: (chunk: Buffer) => void) => void;
  readonly offStdoutData: (listener: (chunk: Buffer) => void) => void;
  readonly onStderrData: (listener: (chunk: Buffer) => void) => void;
  readonly offStderrData: (listener: (chunk: Buffer) => void) => void;
  readonly onError: (listener: (error: unknown) => void) => void;
  readonly offError: (listener: (error: unknown) => void) => void;
  readonly onStdinError: (listener: (error: unknown) => void) => void;
  readonly offStdinError: (listener: (error: unknown) => void) => void;
  readonly onClose: (listener: (exitCode: number | null) => void) => void;
  readonly offClose: (listener: (exitCode: number | null) => void) => void;
}

export interface ManagedTimer {
  readonly cancel: () => void;
  readonly unref: () => void;
}

export interface ManagedChildListeners {
  readonly stdoutData: (chunk: Buffer) => void;
  readonly stderrData: (chunk: Buffer) => void;
  readonly error: (error: unknown) => void;
  readonly stdinError: (error: unknown) => void;
  readonly close: (exitCode: number | null) => void;
}

export interface ManagedChildSession<TOutcome> {
  readonly start: (input: {
    readonly listeners: ManagedChildListeners;
    readonly payload: string;
    readonly timeoutMs: number;
    readonly onTimeout: () => void;
  }) => void;
  readonly finish: (outcome: TOutcome, terminate: boolean) => void;
}

interface ManagedChildSessionInput<TOutcome> {
  readonly child: ManagedChildProcess;
  readonly ownedProcesses: OwnedProcessController;
  readonly startTimeout: (callback: () => void, durationMs: number) => ManagedTimer;
  readonly resolve: (outcome: TOutcome) => void;
}

type OwnedProcessEvent = 'exit' | 'SIGINT' | 'SIGTERM';

export interface OwnedProcessRuntime {
  readonly platform: NodeJS.Platform;
  readonly pid: number;
  readonly once: (event: OwnedProcessEvent, listener: () => void) => void;
  readonly off: (event: OwnedProcessEvent, listener: () => void) => void;
  readonly kill: (pid: number, signal: NodeJS.Signals) => boolean;
}

export interface OwnedProcessController {
  readonly register: (child: OwnedChildProcess) => () => void;
  readonly terminate: (child: OwnedChildProcess) => void;
}

const productionRuntime: OwnedProcessRuntime = {
  platform: process.platform,
  pid: process.pid,
  once: (event, listener) => process.once(event, listener),
  off: (event, listener) => process.off(event, listener),
  kill: (pid, signal) => process.kill(pid, signal),
};

/** Own child process groups behind one set of outer-process lifecycle listeners. */
export function createOwnedProcessController(runtime: OwnedProcessRuntime): OwnedProcessController {
  const owned = new Set<OwnedChildProcess>();
  const terminate = (child: OwnedChildProcess): void => terminateChild(runtime, child);
  const terminateAll = (): void => {
    const children = [...owned];
    owned.clear();
    removeHandlers();
    for (const child of children) {
      terminate(child);
    }
  };
  const onExit = (): void => terminateAll();
  const onSigint = (): void => terminateAndRelay('SIGINT');
  const onSigterm = (): void => terminateAndRelay('SIGTERM');
  const addHandlers = (): void => {
    runtime.once('exit', onExit);
    runtime.once('SIGINT', onSigint);
    runtime.once('SIGTERM', onSigterm);
  };
  function removeHandlers(): void {
    runtime.off('exit', onExit);
    runtime.off('SIGINT', onSigint);
    runtime.off('SIGTERM', onSigterm);
  }
  function terminateAndRelay(signal: 'SIGINT' | 'SIGTERM'): void {
    terminateAll();
    runtime.kill(runtime.pid, signal);
  }
  return {
    register: (child) => {
      const first = owned.size === 0;
      owned.add(child);
      if (first) {
        addHandlers();
      }
      let registered = true;
      return () => {
        if (!registered) {
          return;
        }
        registered = false;
        owned.delete(child);
        if (owned.size === 0) {
          removeHandlers();
        }
      };
    },
    terminate,
  };
}

export const productionOwnedProcessController = createOwnedProcessController(productionRuntime);

/** Bind one child to deterministic timeout, listener cleanup, ownership, and settlement. */
export function createManagedChildSession<TOutcome>(
  input: ManagedChildSessionInput<TOutcome>,
): ManagedChildSession<TOutcome> {
  const unregister = input.ownedProcesses.register(input.child);
  let listeners: ManagedChildListeners | undefined;
  let timer: ManagedTimer | undefined;
  let settled = false;
  const detach = (): void => {
    if (listeners === undefined) {
      return;
    }
    input.child.offStdoutData(listeners.stdoutData);
    input.child.offStderrData(listeners.stderrData);
    input.child.offError(listeners.error);
    input.child.offStdinError(listeners.stdinError);
    input.child.offClose(listeners.close);
  };
  const finish = (outcome: TOutcome, terminate: boolean): void => {
    if (settled) {
      return;
    }
    settled = true;
    if (terminate) {
      input.ownedProcesses.terminate(input.child);
    }
    timer?.cancel();
    unregister();
    detach();
    input.resolve(outcome);
  };
  return {
    finish,
    start: (startInput) => {
      listeners = startInput.listeners;
      timer = input.startTimeout(startInput.onTimeout, startInput.timeoutMs);
      timer.unref();
      if (settled) {
        timer.cancel();
        return;
      }
      attachListeners(input.child, listeners);
      try {
        input.child.endStdin(startInput.payload);
      } catch (error) {
        listeners.stdinError(error);
      }
    },
  };
}

/** Adapt the narrow lifecycle surface used by bounded child runners. */
export function manageChildProcess(child: ChildProcessWithoutNullStreams): ManagedChildProcess {
  return {
    get pid() {
      return child.pid;
    },
    kill: (signal) => child.kill(signal),
    endStdin: (payload) => child.stdin.end(payload),
    onStdoutData: (listener) => child.stdout.on('data', listener),
    offStdoutData: (listener) => child.stdout.off('data', listener),
    onStderrData: (listener) => child.stderr.on('data', listener),
    offStderrData: (listener) => child.stderr.off('data', listener),
    onError: (listener) => child.on('error', listener),
    offError: (listener) => child.off('error', listener),
    onStdinError: (listener) => child.stdin.on('error', listener),
    offStdinError: (listener) => child.stdin.off('error', listener),
    onClose: (listener) => child.on('close', listener),
    offClose: (listener) => child.off('close', listener),
  };
}

function terminateChild(runtime: OwnedProcessRuntime, child: OwnedChildProcess): void {
  if (child.pid !== undefined && child.pid > 0 && runtime.platform !== 'win32') {
    try {
      if (runtime.kill(-child.pid, 'SIGKILL')) {
        return;
      }
    } catch {
      // The group may have exited between settlement and termination.
    }
  }
  try {
    child.kill('SIGKILL');
  } catch {
    // A direct child may also have exited before the fallback reaches it.
  }
}

function attachListeners(child: ManagedChildProcess, listeners: ManagedChildListeners): void {
  child.onStdoutData(listeners.stdoutData);
  child.onStderrData(listeners.stderrData);
  child.onError(listeners.error);
  child.onStdinError(listeners.stdinError);
  child.onClose(listeners.close);
}
