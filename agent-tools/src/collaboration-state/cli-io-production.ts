import { appendFile, mkdir, readFile } from 'node:fs/promises';

import { type Result } from '@oaknational/result';

import { type ScopedContentBlockGroup } from '../hook-policy/types.js';
import { loadCommsConceptGateBlocks } from './comms-concept-gate.js';
import { filesystemLegacyCommsIo, migrateLegacyCommsDirectories } from './comms-migration.js';
import { readCommitQueueEntries } from './commit-queue-store.js';
import { type GitWorktree, readGitWorktrees } from './git-worktree-list.js';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readCommsEvents,
  readCommsEventsExcluding,
  readDirectedCommsMessages,
  writeCommsEvent,
} from './state-io.js';
import { writeTextFileAtomically } from './transaction.js';
import {
  type ClosedClaimsArchive,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
} from './types.js';

/**
 * The injected IO surface every collaboration-state CLI command runs
 * against. Production wires {@link productionIo}; tests wire fakes so no
 * command touches the real filesystem, git, or policy file.
 */
export interface CollaborationStateCliIo {
  readonly readActiveClaimsFile: (
    activePath: string,
  ) => Promise<Result<CollaborationRegistry, Error>>;
  readonly readClosedClaimsFile: (
    closedPath: string,
  ) => Promise<Result<ClosedClaimsArchive, Error>>;
  /**
   * Read the live entries of the machine-local per-intent commit-queue
   * store (expired files read as absent). The queue left the claims file at
   * registry schema 1.4.0; commands that reason about queue state read it
   * through this seam so tests stay hermetic.
   */
  readonly readCommitQueueEntries: (input: {
    readonly queueDir: string;
    readonly nowIso: string;
  }) => Promise<readonly CollaborationCommitQueueEntry[]>;
  readonly writeCommsEvent: (input: {
    readonly commsDir: string;
    readonly event: CommsEvent;
    readonly nowIso: string;
  }) => Promise<void>;
  readonly readCommsEvents: (commsDir: string) => Promise<readonly CommsEvent[]>;
  /**
   * Read only the events absent from `excludeIds` (MCP-198). The watch
   * loop's drain uses this so its cost tracks unseen events rather than
   * total directory size.
   */
  readonly readCommsEventsExcluding: (
    commsDir: string,
    excludeIds: ReadonlySet<string>,
  ) => Promise<readonly CommsEvent[]>;
  readonly readWorktrees: (cwd: string) => Promise<readonly GitWorktree[]>;
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
  /**
   * Load the comms-gated PDR-044 concept blocks. Injected (rather than the
   * write paths reading the hook policy directly) so tests supply fixture
   * blocks and never couple to the live `.agent/hooks/policy.json` content;
   * the production implementation is the policy-file SSOT loader, which
   * fails closed (`err`) when a ratified concept group is missing.
   */
  readonly loadCommsConceptGateBlocks: () => Promise<
    Result<readonly ScopedContentBlockGroup[], string>
  >;
}

export const productionIo: CollaborationStateCliIo = {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readCommitQueueEntries,
  writeCommsEvent,
  readCommsEvents,
  readCommsEventsExcluding,
  // `async` so a throwing git read (cwd not in a git tree) rejects rather than
  // throwing synchronously at the call site, which would orphan a sibling read
  // in a `Promise.all`.
  readWorktrees: async (cwd) => readGitWorktrees(cwd),
  readDirectedCommsMessages,
  writeTextFile: (input) => writeTextFileAtomically(input),
  readTextFile: (filePath) => readFile(filePath, 'utf8'),
  readSeenIds: readSeenIdsFile,
  appendSeenMessageIds: appendSeenMessageIdsFile,
  migrateLegacyCommsDirectories: (input) =>
    migrateLegacyCommsDirectories(input, filesystemLegacyCommsIo),
  ensureDirectory: (directory) => mkdir(directory, { recursive: true }).then(() => undefined),
  loadCommsConceptGateBlocks: () => loadCommsConceptGateBlocks(),
};

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
