import { watch } from 'node:fs';
import { appendFile, mkdir } from 'node:fs/promises';

import {
  compareDirectedMessages,
  formatDirectedMessage,
  messageMatchesRecipient,
  readSeenIds,
} from './cli-comms-inbox.js';
import { optional, required, type Options } from './cli-options.js';
import { readDirectedCommsMessages } from './state-io.js';
import { type DirectedCommsMessage } from './types.js';

const DEFAULT_POLL_MS = 500;

export async function watchComms(
  options: Options,
  stdout?: Pick<NodeJS.WritableStream, 'write'>,
): Promise<string> {
  const messagesDir = required(options, 'messages-dir');
  const seenFile = required(options, 'seen-file');
  const agentName = required(options, 'agent-name');
  const sessionPrefix = optional(options, 'session-prefix');
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');
  let emitted = 0;
  let output = '';

  await mkdir(messagesDir, { recursive: true });

  while (needsMoreEvents({ emitted, maxEvents })) {
    const result = await drainUnseenMessages({
      messagesDir,
      seenFile,
      agentName,
      sessionPrefix,
      remainingEvents: remainingEvents({ emitted, maxEvents }),
    });
    output += result.output;
    emitted += result.eventCount;
    stdout?.write(result.output);

    await waitForNextScan({ emitted, maxEvents, messagesDir, pollMs });
  }

  return stdout === undefined ? output : '';
}

async function waitForNextScan(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
  readonly messagesDir: string;
  readonly pollMs: number;
}): Promise<void> {
  if (needsMoreEvents(input)) {
    await waitForDirectoryChange({ directory: input.messagesDir, pollMs: input.pollMs });
  }
}

function needsMoreEvents(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
}): boolean {
  return input.maxEvents === undefined || input.emitted < input.maxEvents;
}

function remainingEvents(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
}): number | undefined {
  return input.maxEvents === undefined ? undefined : input.maxEvents - input.emitted;
}

async function drainUnseenMessages(input: {
  readonly messagesDir: string;
  readonly seenFile: string;
  readonly agentName: string;
  readonly sessionPrefix?: string;
  readonly remainingEvents?: number;
}): Promise<{ readonly output: string; readonly eventCount: number }> {
  const seenIds = await readSeenIds(input.seenFile);
  const unseen = (await readDirectedCommsMessages(input.messagesDir))
    .filter((message) => messageMatchesRecipient(message, input.agentName, input.sessionPrefix))
    .filter((message) => !seenIds.has(message.event_id))
    .toSorted(compareDirectedMessages)
    .slice(0, input.remainingEvents);

  if (unseen.length === 0) {
    return { output: '', eventCount: 0 };
  }

  await appendSeenMessageIds(input.seenFile, unseen);

  return {
    output: unseen.map(formatDirectedMessage).join('\n'),
    eventCount: unseen.length,
  };
}

async function appendSeenMessageIds(
  seenFile: string,
  messages: readonly DirectedCommsMessage[],
): Promise<void> {
  await appendFile(seenFile, messages.map((message) => message.event_id).join('\n') + '\n');
}

function waitForDirectoryChange(input: {
  readonly directory: string;
  readonly pollMs: number;
}): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(done, input.pollMs);
    const watcher = tryWatchDirectory(input.directory, done);

    function done(): void {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      watcher?.close();
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

function optionalPositiveInteger(options: Options, key: string): number | undefined {
  const raw = optional(options, key);
  if (raw === undefined) {
    return undefined;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value <= 0 || String(value) !== raw) {
    throw new Error(`--${key} must be a positive integer`);
  }

  return value;
}
