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

function waitForAnyDirectoryChange(input: {
  readonly directories: readonly string[];
  readonly pollMs: number;
}): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(done, input.pollMs);
    const watchers = input.directories.map((directory) => tryWatchDirectory(directory, done));

    function done(): void {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      for (const watcher of watchers) {
        watcher?.close();
      }
      resolve();
    }
  });
}

function tryWatchDirectory(directory: string, done: () => void): ReturnType<typeof watch> | null {
  try {
    const watcher = watch(directory, { persistent: false }, done);
    watcher.on('error', done);
    return watcher;
  } catch {
    return null;
  }
}
