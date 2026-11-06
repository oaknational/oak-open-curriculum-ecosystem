import { err, ok, unwrapOrThrow, type Result } from '@oaknational/result';

import { type CollaborationStateCliIo, productionIo } from './cli-io-production.js';
import { resolveCoordinationHome } from './coordination-home.js';
import { type WatcherStalenessIo } from './watcher-staleness.js';
import { productionWatcherStalenessIo } from './watcher-staleness-io.js';
import { processIsAliveBySignalZero } from './watcher-supervisor.js';

export { type CollaborationStateCliIo } from './cli-io-production.js';

/** Resolve the canonical coordination home from one invocation directory. */
export type CoordinationHomeResolver = (cwd: string) => string;

export interface CliRuntime {
  readonly stdout?: Pick<NodeJS.WritableStream, 'write'>;
  readonly io?: CollaborationStateCliIo;
  readonly waitForCommsChange?: (input: {
    readonly directory: string;
    readonly pollMs: number;
  }) => Promise<void>;
  readonly waitForCollaborationStateChange?: (input: {
    readonly activePath: string;
    readonly closedPath: string;
    readonly commsDir: string;
    readonly pollMs: number;
  }) => Promise<void>;
  /**
   * Probe whether a process is alive by pid (F-101 supervisor-death detection).
   * Production uses a signal-0 `process.kill` probe; tests inject a fake so the
   * watcher's self-exit-when-supervisor-gone behaviour is exercised without a
   * real process. Provided by the composition layer when `--supervisor-pid` is
   * in play.
   */
  readonly processIsAlive?: (pid: number) => boolean;
  /** Invocation cwd, captured at the composition edge for path defaulting. */
  readonly cwd?: string;
  /** Injectable primary coordination-home resolver for hermetic tests. */
  readonly resolveCoordinationHome?: CoordinationHomeResolver;
  /** Watcher-heartbeat reader/stat adapter; production uses the filesystem binding. */
  readonly watcherStalenessIo?: WatcherStalenessIo;
}

export function cliIo(runtime: CliRuntime): CollaborationStateCliIo {
  return unwrapOrThrow(
    requiredRuntimeCapability(
      runtime.io,
      'collaboration-state CLI IO must be provided by the composition layer',
    ),
  );
}

export function watcherStalenessIo(runtime: CliRuntime): WatcherStalenessIo {
  return unwrapOrThrow(
    requiredRuntimeCapability(
      runtime.watcherStalenessIo,
      'watcher staleness IO must be provided by the composition layer',
    ),
  );
}

export function waitForCommsChange(
  runtime: CliRuntime,
  input: {
    readonly directory: string;
    readonly pollMs: number;
  },
): Promise<void> {
  return unwrapOrThrow(
    requiredRuntimeCapability(
      runtime.waitForCommsChange,
      'collaboration-state watch source must be provided by the composition layer',
    ),
  )(input);
}

export function waitForCollaborationStateChange(
  runtime: CliRuntime,
  input: {
    readonly activePath: string;
    readonly closedPath: string;
    readonly commsDir: string;
    readonly pollMs: number;
  },
): Promise<void> {
  return unwrapOrThrow(
    requiredRuntimeCapability(
      runtime.waitForCollaborationStateChange,
      'collaboration-state TUI update source must be provided by the composition layer',
    ),
  )(input);
}

function requiredRuntimeCapability<T>(value: T | undefined, message: string): Result<T, Error> {
  return value === undefined ? err(new Error(message)) : ok(value);
}

export function productionCollaborationStateRuntime(
  input: {
    readonly stdout?: Pick<NodeJS.WritableStream, 'write'>;
    readonly cwd?: string;
    readonly coordinationHomeEnv?: string;
    readonly resolveCoordinationHome?: CoordinationHomeResolver;
  } = {},
): CliRuntime {
  return {
    stdout: input.stdout,
    io: productionIo,
    waitForCommsChange: waitOnePollInterval,
    waitForCollaborationStateChange: waitOnePollInterval,
    processIsAlive: processIsAliveBySignalZero,
    watcherStalenessIo: productionWatcherStalenessIo,
    cwd: input.cwd ?? process.cwd(),
    resolveCoordinationHome:
      input.resolveCoordinationHome ??
      ((cwd) =>
        resolveCoordinationHome(
          cwd,
          input.coordinationHomeEnv === undefined
            ? {}
            : { coordinationHomeEnv: input.coordinationHomeEnv },
        )),
  };
}

/**
 * The production wait between passes of the comms watch and the TUI: resolve
 * after one `pollMs` interval.
 */
function waitOnePollInterval(input: { readonly pollMs: number }): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, input.pollMs);
  });
}
