import {
  type ManagedChildProcess,
  type ManagedTimer,
  type OwnedChildProcess,
  type OwnedProcessController,
} from '../../src/codex-hook-review/owned-process.js';

type DataListener = (chunk: Buffer) => void;
type ErrorListener = (error: unknown) => void;
type CloseListener = (exitCode: number | null) => void;

/** In-memory child-process contract fake; it never starts or signals an operating-system process. */
export class InMemoryManagedChild implements ManagedChildProcess {
  readonly pid: number | undefined;
  readonly killedSignals: NodeJS.Signals[] = [];
  readonly stdinWrites: string[] = [];
  readonly #stdoutListeners = new Set<DataListener>();
  readonly #stderrListeners = new Set<DataListener>();
  readonly #errorListeners = new Set<ErrorListener>();
  readonly #stdinErrorListeners = new Set<ErrorListener>();
  readonly #closeListeners = new Set<CloseListener>();

  constructor(pid: number | undefined = 101) {
    this.pid = pid;
  }

  kill(signal: NodeJS.Signals): boolean {
    this.killedSignals.push(signal);
    return true;
  }

  endStdin(payload: string): void {
    this.stdinWrites.push(payload);
  }

  onStdoutData(listener: DataListener): void {
    this.#stdoutListeners.add(listener);
  }

  offStdoutData(listener: DataListener): void {
    this.#stdoutListeners.delete(listener);
  }

  onStderrData(listener: DataListener): void {
    this.#stderrListeners.add(listener);
  }

  offStderrData(listener: DataListener): void {
    this.#stderrListeners.delete(listener);
  }

  onError(listener: ErrorListener): void {
    this.#errorListeners.add(listener);
  }

  offError(listener: ErrorListener): void {
    this.#errorListeners.delete(listener);
  }

  onStdinError(listener: ErrorListener): void {
    this.#stdinErrorListeners.add(listener);
  }

  offStdinError(listener: ErrorListener): void {
    this.#stdinErrorListeners.delete(listener);
  }

  onClose(listener: CloseListener): void {
    this.#closeListeners.add(listener);
  }

  offClose(listener: CloseListener): void {
    this.#closeListeners.delete(listener);
  }

  emitStdout(chunk: Buffer): void {
    for (const listener of this.#stdoutListeners) {
      listener(chunk);
    }
  }

  emitStderr(chunk: Buffer): void {
    for (const listener of this.#stderrListeners) {
      listener(chunk);
    }
  }

  emitError(error: unknown): void {
    for (const listener of this.#errorListeners) {
      listener(error);
    }
  }

  emitStdinError(error: unknown): void {
    for (const listener of this.#stdinErrorListeners) {
      listener(error);
    }
  }

  emitClose(exitCode: number | null): void {
    for (const listener of this.#closeListeners) {
      listener(exitCode);
    }
  }

  listenerCount(): number {
    return (
      this.#stdoutListeners.size +
      this.#stderrListeners.size +
      this.#errorListeners.size +
      this.#stdinErrorListeners.size +
      this.#closeListeners.size
    );
  }
}

export class InMemoryTimer implements ManagedTimer {
  readonly durationMs: number;
  readonly callback: () => void;
  cancelled = false;
  unreferenced = false;

  constructor(durationMs: number, callback: () => void) {
    this.durationMs = durationMs;
    this.callback = callback;
  }

  cancel(): void {
    this.cancelled = true;
  }

  unref(): void {
    this.unreferenced = true;
  }

  fire(): void {
    if (!this.cancelled) {
      this.callback();
    }
  }
}

export class RecordingOwnedProcessController implements OwnedProcessController {
  readonly registered: OwnedChildProcess[] = [];
  readonly terminated: OwnedChildProcess[] = [];
  unregisterCount = 0;

  register(child: OwnedChildProcess): () => void {
    this.registered.push(child);
    let registered = true;
    return () => {
      if (registered) {
        registered = false;
        this.unregisterCount += 1;
      }
    };
  }

  terminate(child: OwnedChildProcess): void {
    this.terminated.push(child);
  }
}
