import { sep } from 'node:path';

import { err, ok, unwrapOrThrow } from '@oaknational/result';

import { createCommsEvent } from '../../src/collaboration-state';
import { migrateLegacyCommsDirectories } from '../../src/collaboration-state/comms-migration';
import {
  type CliRuntime,
  type CollaborationStateCliIo,
} from '../../src/collaboration-state/cli-runtime';
import { type GitWorktree } from '../../src/collaboration-state/git-worktree-list';
import {
  ACTIVE_CLAIMS_SCHEMA_VERSION,
  CLOSED_CLAIMS_SCHEMA_VERSION,
  type ClosedClaimsArchive,
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
} from '../../src/collaboration-state/types';
import { FAKE_COMMS_CONCEPT_GATE_BLOCKS } from './fake-collaboration-runtime-fixtures';

/**
 * The product composes these paths with the HOST separator (correct for real
 * filesystem access); fixtures seed them as POSIX literals for readability.
 * Every path-keyed store in this fake therefore keys on the POSIX form, so a
 * seeded fixture and a host-joined lookup meet on every platform. Without
 * this a Windows run silently reads an empty store rather than failing
 * loudly — the fixture would report "no comms" instead of "wrong key".
 */
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

const emptyActiveClaims: CollaborationRegistry = {
  schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
  commit_queue: [],
  claims: [],
};

const emptyClosedClaims: ClosedClaimsArchive = {
  schema_version: CLOSED_CLAIMS_SCHEMA_VERSION,
  claims: [],
};

interface FakeCollaborationRuntimeInput {
  readonly activeClaims?: CollaborationRegistry;
  readonly closedClaims?: ClosedClaimsArchive;
  readonly comms?: Readonly<Record<string, readonly CommsEvent[]>>;
  readonly worktrees?: readonly GitWorktree[];
  readonly legacyComms?: Readonly<Record<string, readonly unknown[]>>;
  readonly onWaitForCommsChange?: () => void;
  readonly onWaitForCollaborationStateChange?: () => void;
  /** Fake supervisor-liveness probe (F-101). Defaults to always-alive. */
  readonly processIsAlive?: (pid: number) => boolean;
  /** Invocation directory used by coordination-home path defaults. */
  readonly cwd?: string;
  /** Injectable coordination-home resolver; avoids real git in CLI tests. */
  readonly resolveCoordinationHome?: (cwd: string) => string;
}

interface FakeCollaborationRuntime {
  readonly runtime: CliRuntime;
  readonly readCommsEvents: (commsDir: string) => readonly CommsEvent[];
  readonly readActiveClaimsPaths: () => readonly string[];
  readonly readSeenIds: (seenFile: string) => readonly string[];
  readonly readTextFile: (path: string) => string | undefined;
  readonly writeCommsEvent: (commsDir: string, event: CommsEvent) => void;
  readonly seedTextFile: (filePath: string, text: string) => void;
  readonly ensuredDirectories: () => readonly string[];
}

interface FakeRuntimeState {
  readonly commsByDir: Map<string, Map<string, CommsEvent>>;
  readonly seenByFile: Map<string, string[]>;
  readonly textByPath: Map<string, string>;
  readonly legacyByDir: Map<string, readonly unknown[]>;
  readonly activeClaims: CollaborationRegistry;
  readonly activeClaimsPaths: string[];
  readonly closedClaims: ClosedClaimsArchive;
  readonly worktrees: readonly GitWorktree[];
  readonly ensuredDirectories: Set<string>;
}

export function createFakeCollaborationRuntime(
  input: FakeCollaborationRuntimeInput = {},
): FakeCollaborationRuntime {
  const state: FakeRuntimeState = {
    commsByDir: new Map(),
    seenByFile: new Map(),
    textByPath: new Map(),
    legacyByDir: legacyByDir(input.legacyComms ?? {}),
    activeClaims: input.activeClaims ?? emptyActiveClaims,
    activeClaimsPaths: [],
    closedClaims: input.closedClaims ?? emptyClosedClaims,
    worktrees: input.worktrees ?? [],
    ensuredDirectories: new Set(),
  };
  seedComms(state, input.comms ?? {});

  return {
    runtime: {
      io: createFakeIo(state),
      waitForCommsChange: async () => {
        input.onWaitForCommsChange?.();
      },
      waitForCollaborationStateChange: async () => {
        input.onWaitForCollaborationStateChange?.();
      },
      processIsAlive: input.processIsAlive ?? ((): boolean => true),
      cwd: input.cwd,
      resolveCoordinationHome: input.resolveCoordinationHome,
    },
    readCommsEvents: (commsDir) => readCommsEvents(state, commsDir),
    readActiveClaimsPaths: () => [...state.activeClaimsPaths],
    readSeenIds: (seenFile) => state.seenByFile.get(posixPath(seenFile)) ?? [],
    readTextFile: (path) => state.textByPath.get(posixPath(path)),
    writeCommsEvent: (commsDir, event) => writeCommsEvent(state, commsDir, event),
    seedTextFile: (filePath, text) => {
      state.textByPath.set(posixPath(filePath), text);
    },
    ensuredDirectories: () => [...state.ensuredDirectories],
  };
}

function createFakeIo(state: FakeRuntimeState): CollaborationStateCliIo {
  return {
    readActiveClaimsFile: async (activePath) => {
      state.activeClaimsPaths.push(activePath);
      return ok(state.activeClaims);
    },
    readClosedClaimsFile: async () => ok(state.closedClaims),
    writeCommsEvent: async ({ commsDir, event, nowIso }) => {
      writeCommsEvent(
        state,
        commsDir,
        createCommsEvent(event, { nowIso, existingEventIds: ids(state, commsDir) }),
      );
    },
    readCommsEvents: async (commsDir) => readCommsEvents(state, commsDir),
    readCommsEventsExcluding: async (commsDir, excludeIds) =>
      readCommsEvents(state, commsDir).filter((event) => !excludeIds.has(event.event_id)),
    readWorktrees: async () => state.worktrees,
    readDirectedCommsMessages: async (commsDir) =>
      readCommsEvents(state, commsDir).filter(isDirectedCommsMessage),
    writeTextFile: async ({ filePath, text }) => {
      state.textByPath.set(posixPath(filePath), text);
    },
    readTextFile: async (filePath) => {
      const text = state.textByPath.get(posixPath(filePath));
      if (text === undefined) {
        throw Object.assign(new Error(`ENOENT: no such file or directory, open '${filePath}'`), {
          code: 'ENOENT',
        });
      }
      return text;
    },
    readSeenIds: async (seenFile) => new Set(state.seenByFile.get(posixPath(seenFile)) ?? []),
    appendSeenMessageIds: async (seenFile, eventIds) => {
      const key = posixPath(seenFile);
      state.seenByFile.set(key, [...(state.seenByFile.get(key) ?? []), ...eventIds]);
    },
    migrateLegacyCommsDirectories: async (input) => migrateLegacyComms(state, input),
    ensureDirectory: async (directoryPath) => {
      state.ensuredDirectories.add(directoryPath);
    },
    // Fixture blocks, NOT the live policy file: one representative pattern
    // per ratified comms-gated concept, so gate behaviour is observable in
    // integration tests while their pass/fail stays decoupled from
    // `.agent/hooks/policy.json` content (the DI seam's whole point).
    loadCommsConceptGateBlocks: async () => ok(FAKE_COMMS_CONCEPT_GATE_BLOCKS),
  };
}

function seedComms(
  state: FakeRuntimeState,
  comms: Readonly<Record<string, readonly CommsEvent[]>>,
): void {
  for (const directory in comms) {
    state.commsByDir.set(posixPath(directory), new Map((comms[directory] ?? []).map(toEventEntry)));
  }
}

function legacyByDir(
  legacyComms: Readonly<Record<string, readonly unknown[]>>,
): Map<string, readonly unknown[]> {
  const entries = new Map<string, readonly unknown[]>();
  for (const directory in legacyComms) {
    entries.set(directory, legacyComms[directory] ?? []);
  }

  return entries;
}

function ids(state: FakeRuntimeState, commsDir: string): readonly string[] {
  return Array.from(directory(state, commsDir).keys());
}

function writeCommsEvent(state: FakeRuntimeState, commsDir: string, event: CommsEvent): void {
  const events = directory(state, commsDir);
  unwrapOrThrow(
    events.has(event.event_id)
      ? err(new Error(`comms event already exists: ${event.event_id}`))
      : ok(undefined),
  );
  events.set(event.event_id, event);
}

function readCommsEvents(state: FakeRuntimeState, commsDir: string): readonly CommsEvent[] {
  return Array.from(directory(state, commsDir).values()).toSorted((left, right) =>
    left.event_id.localeCompare(right.event_id),
  );
}

function directory(state: FakeRuntimeState, commsDir: string): Map<string, CommsEvent> {
  const key = posixPath(commsDir);
  const existing = state.commsByDir.get(key);
  if (existing !== undefined) {
    return existing;
  }
  const created = new Map<string, CommsEvent>();
  state.commsByDir.set(key, created);

  return created;
}

function migrateLegacyComms(
  state: FakeRuntimeState,
  input: {
    readonly eventsDir: string;
    readonly lifecycleDir: string;
    readonly messagesDir: string;
    readonly commsDir: string;
  },
): Promise<number> {
  return migrateLegacyCommsDirectories(input, {
    ensureDirectory: async () => undefined,
    readLegacyRecords: async (directoryName) => state.legacyByDir.get(directoryName) ?? [],
    writeCommsEvent: async ({ commsDir, event }) => {
      writeCommsEvent(state, commsDir, event);
    },
  });
}

function toEventEntry(event: CommsEvent): readonly [string, CommsEvent] {
  return [event.event_id, event];
}

function isDirectedCommsMessage(event: CommsEvent): event is DirectedCommsMessage {
  return event.kind === 'directed';
}
