import { createCommsEvent } from '../../src/collaboration-state';
import { migrateLegacyCommsDirectories } from '../../src/collaboration-state/comms-migration';
import {
  type CliRuntime,
  type CollaborationStateCliIo,
} from '../../src/collaboration-state/cli-runtime';
import {
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
} from '../../src/collaboration-state/types';

const emptyActiveClaims: CollaborationRegistry = {
  schema_version: '1.3.0',
  commit_queue: [],
  claims: [],
};

interface FakeCollaborationRuntimeInput {
  readonly activeClaims?: CollaborationRegistry;
  readonly comms?: Readonly<Record<string, readonly CommsEvent[]>>;
  readonly legacyComms?: Readonly<Record<string, readonly unknown[]>>;
  readonly onWaitForCommsChange?: () => void;
}

interface FakeCollaborationRuntime {
  readonly runtime: CliRuntime;
  readonly readCommsEvents: (commsDir: string) => readonly CommsEvent[];
  readonly readSeenIds: (seenFile: string) => readonly string[];
  readonly readTextFile: (path: string) => string | undefined;
  readonly writeCommsEvent: (commsDir: string, event: CommsEvent) => void;
}

interface FakeRuntimeState {
  readonly commsByDir: Map<string, Map<string, CommsEvent>>;
  readonly seenByFile: Map<string, string[]>;
  readonly textByPath: Map<string, string>;
  readonly legacyByDir: Map<string, readonly unknown[]>;
  readonly activeClaims: CollaborationRegistry;
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
  };
  seedComms(state, input.comms ?? {});

  return {
    runtime: {
      io: createFakeIo(state),
      waitForCommsChange: async () => {
        input.onWaitForCommsChange?.();
      },
    },
    readCommsEvents: (commsDir) => readCommsEvents(state, commsDir),
    readSeenIds: (seenFile) => state.seenByFile.get(seenFile) ?? [],
    readTextFile: (path) => state.textByPath.get(path),
    writeCommsEvent: (commsDir, event) => writeCommsEvent(state, commsDir, event),
  };
}

function createFakeIo(state: FakeRuntimeState): CollaborationStateCliIo {
  return {
    readActiveClaimsFile: async () => state.activeClaims,
    writeCommsEvent: async ({ commsDir, event, nowIso }) => {
      writeCommsEvent(
        state,
        commsDir,
        createCommsEvent(event, { nowIso, existingEventIds: ids(state, commsDir) }),
      );
    },
    readCommsEvents: async (commsDir) => readCommsEvents(state, commsDir),
    readDirectedCommsMessages: async (commsDir) =>
      readCommsEvents(state, commsDir).filter(isDirectedCommsMessage),
    writeTextFile: async ({ filePath, text }) => {
      state.textByPath.set(filePath, text);
    },
    readSeenIds: async (seenFile) => new Set(state.seenByFile.get(seenFile) ?? []),
    appendSeenMessageIds: async (seenFile, eventIds) => {
      state.seenByFile.set(seenFile, [...(state.seenByFile.get(seenFile) ?? []), ...eventIds]);
    },
    migrateLegacyCommsDirectories: async (input) => migrateLegacyComms(state, input),
    ensureDirectory: async () => undefined,
  };
}

function seedComms(
  state: FakeRuntimeState,
  comms: Readonly<Record<string, readonly CommsEvent[]>>,
): void {
  for (const directory in comms) {
    state.commsByDir.set(directory, new Map((comms[directory] ?? []).map(toEventEntry)));
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
  if (events.has(event.event_id)) {
    throw new Error(`comms event already exists: ${event.event_id}`);
  }
  events.set(event.event_id, event);
}

function readCommsEvents(state: FakeRuntimeState, commsDir: string): readonly CommsEvent[] {
  return Array.from(directory(state, commsDir).values()).toSorted((left, right) =>
    left.event_id.localeCompare(right.event_id),
  );
}

function directory(state: FakeRuntimeState, commsDir: string): Map<string, CommsEvent> {
  const existing = state.commsByDir.get(commsDir);
  if (existing !== undefined) {
    return existing;
  }
  const created = new Map<string, CommsEvent>();
  state.commsByDir.set(commsDir, created);

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
