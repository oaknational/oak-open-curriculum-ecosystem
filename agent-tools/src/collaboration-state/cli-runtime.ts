import { watch } from 'node:fs';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { filesystemLegacyCommsIo, migrateLegacyCommsDirectories } from './comms-migration.js';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readCommsEvents,
  readDirectedCommsMessages,
  writeCommsEvent,
} from './state-io.js';
import { writeTextFileAtomically } from './transaction.js';
import {
  type ClosedClaimsArchive,
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
} from './types.js';

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
}

export interface CollaborationStateCliIo {
  readonly readActiveClaimsFile: (activePath: string) => Promise<CollaborationRegistry>;
  readonly readClosedClaimsFile: (closedPath: string) => Promise<ClosedClaimsArchive>;
  readonly writeCommsEvent: (input: {
    readonly commsDir: string;
    readonly event: CommsEvent;
    readonly nowIso: string;
  }) => Promise<void>;
  readonly readCommsEvents: (commsDir: string) => Promise<readonly CommsEvent[]>;
  readonly readDirectedCommsMessages: (
    commsDir: string,
  ) => Promise<readonly DirectedCommsMessage[]>;
  readonly writeTextFile: (input: {
    readonly filePath: string;
    readonly text: string;
  }) => Promise<void>;
  readonly readTextFile: (filePath: string) => Promise<string>;
  readonly readSeenIds: (seenFile: string) => Promise<ReadonlySet<string>>;
  readonly appendSeenMessageIds: (seenFile: string, eventIds: readonly string[]) => Promise<void>;
  readonly migrateLegacyCommsDirectories: (input: {
    readonly eventsDir: string;
    readonly lifecycleDir: string;
    readonly messagesDir: string;
    readonly commsDir: string;
  }) => Promise<number>;
  readonly ensureDirectory: (directory: string) => Promise<void>;
}

const productionIo: CollaborationStateCliIo = {
  readActiveClaimsFile,
  readClosedClaimsFile,
  writeCommsEvent,
  readCommsEvents,
  readDirectedCommsMessages,
  writeTextFile: (input) => writeTextFileAtomically(input),
  readTextFile: (filePath) => readFile(filePath, 'utf8'),
  readSeenIds: readSeenIdsFile,
  appendSeenMessageIds: appendSeenMessageIdsFile,
  migrateLegacyCommsDirectories: (input) =>
    migrateLegacyCommsDirectories(input, filesystemLegacyCommsIo),
  ensureDirectory: (directory) => mkdir(directory, { recursive: true }).then(() => undefined),
};

export function cliIo(runtime: CliRuntime): CollaborationStateCliIo {
  if (runtime.io === undefined) {
    throw new Error('collaboration-state CLI IO must be provided by the composition layer');
  }

  return runtime.io;
}

export function waitForCommsChange(
  runtime: CliRuntime,
  input: {
    readonly directory: string;
    readonly pollMs: number;
  },
): Promise<void> {
  if (runtime.waitForCommsChange === undefined) {
    throw new Error('collaboration-state watch source must be provided by the composition layer');
  }

  return runtime.waitForCommsChange(input);
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
  if (runtime.waitForCollaborationStateChange === undefined) {
    throw new Error(
      'collaboration-state TUI update source must be provided by the composition layer',
    );
  }

  return runtime.waitForCollaborationStateChange(input);
}

export function productionCollaborationStateRuntime(
  input: { readonly stdout?: Pick<NodeJS.WritableStream, 'write'> } = {},
): CliRuntime {
  return {
    stdout: input.stdout,
    io: productionIo,
    waitForCommsChange: waitForDirectoryChange,
    waitForCollaborationStateChange: waitForCollaborationStateChangeFromFiles,
  };
}

async function readSeenIdsFile(seenFile: string): Promise<ReadonlySet<string>> {
  const text = await readFile(seenFile, 'utf8').catch(() => '');
  return new Set(text.split(/\r?\n/u).filter(Boolean));
}

async function appendSeenMessageIdsFile(
  seenFile: string,
  eventIds: readonly string[],
): Promise<void> {
  await appendFile(seenFile, `${eventIds.join('\n')}\n`);
}

function waitForDirectoryChange(input: {
  readonly directory: string;
  readonly pollMs: number;
}): Promise<void> {
  return waitForAnyDirectoryChange({ directories: [input.directory], pollMs: input.pollMs });
}

function waitForCollaborationStateChangeFromFiles(input: {
  readonly activePath: string;
  readonly closedPath: string;
  readonly commsDir: string;
  readonly pollMs: number;
}): Promise<void> {
  return waitForAnyDirectoryChange({
    directories: [input.commsDir, dirname(input.activePath), dirname(input.closedPath)],
    pollMs: input.pollMs,
  });
}

/**
 * Subscribes `onChange` to a directory's change events, returning a closable
 * handle or `null` when the platform cannot watch the path. Injectable so the
 * poll-bound invariant below is unit-testable without real FS events — which
 * are non-deterministic, especially the dropped-subscription case this guards.
 *
 * The real `node:fs` watch callback always fires asynchronously. A factory
 * that fires `onChange` synchronously during subscription is tolerated (the
 * wait settles immediately and no further directories are subscribed), but a
 * handle returned by such a factory cannot be closed — it has not been
 * registered yet — so asynchronous firing remains the supported contract.
 */
export type DirectoryWatchFactory = (
  directory: string,
  onChange: () => void,
) => { readonly close: () => void } | null;

const fsDirectoryWatchFactory: DirectoryWatchFactory = (directory, onChange) => {
  try {
    const watcher = watch(directory, { persistent: false }, onChange);
    watcher.on('error', onChange);
    return watcher;
  } catch {
    return null;
  }
};

/**
 * Resolve when ANY watched directory changes — OR after `pollMs`, whichever
 * comes first. The `setTimeout(pollMs)` fallback is armed ALONGSIDE the watch
 * subscriptions, so a dropped FSEvents subscription (the macOS hang suspect)
 * delays a wake by at most `pollMs` instead of stalling the watcher forever.
 * This poll-bound is the invariant pinned by `cli-runtime.unit.test.ts`.
 */
export function waitForAnyDirectoryChange(input: {
  readonly directories: readonly string[];
  readonly pollMs: number;
  readonly watchFactory?: DirectoryWatchFactory;
}): Promise<void> {
  const watchFactory = input.watchFactory ?? fsDirectoryWatchFactory;
  return new Promise((resolve) => {
    let settled = false;
    const watchers: ({ readonly close: () => void } | null)[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;

    const done = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      for (const watcher of watchers) {
        watcher?.close();
      }
      resolve();
    };

    // `watchers` and `done` are initialised before any factory call, so a
    // synchronous callback settles cleanly instead of hitting a temporal dead
    // zone. A sync-settle also stops subscribing further directories.
    for (const directory of input.directories) {
      if (settled) {
        break;
      }
      watchers.push(watchFactory(directory, done));
    }
    // Arm the poll fallback alongside the still-open subscriptions.
    if (!settled) {
      timer = setTimeout(done, input.pollMs);
    }
  });
}
