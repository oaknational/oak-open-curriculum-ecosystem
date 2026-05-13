import {
  compareDirectedMessages,
  formatDirectedMessage,
  messageMatchesRecipient,
} from './cli-comms-inbox.js';
import { optional, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';

const DEFAULT_POLL_MS = 500;

export async function watchComms(options: Options, runtime: CliRuntime = {}): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const agentName = required(options, 'agent-name');
  const sessionPrefix = optional(options, 'session-prefix');
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');
  let emitted = 0;
  let output = '';

  await io.ensureDirectory(commsDir);

  while (needsMoreEvents({ emitted, maxEvents })) {
    const result = await drainUnseenMessages({
      commsDir,
      seenFile,
      agentName,
      sessionPrefix,
      remainingEvents: remainingEvents({ emitted, maxEvents }),
      io,
    });
    output += result.output;
    emitted += result.eventCount;
    runtime.stdout?.write(result.output);

    await waitForNextScan({ emitted, maxEvents, commsDir, pollMs, runtime });
  }

  return runtime.stdout === undefined ? output : '';
}

async function waitForNextScan(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
  readonly commsDir: string;
  readonly pollMs: number;
  readonly runtime: CliRuntime;
}): Promise<void> {
  if (needsMoreEvents(input)) {
    await waitForCommsChange(input.runtime, { directory: input.commsDir, pollMs: input.pollMs });
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
  readonly commsDir: string;
  readonly seenFile: string;
  readonly agentName: string;
  readonly sessionPrefix?: string;
  readonly remainingEvents?: number;
  readonly io: CollaborationStateCliIo;
}): Promise<{ readonly output: string; readonly eventCount: number }> {
  const seenIds = await input.io.readSeenIds(input.seenFile);
  const unseen = (await input.io.readDirectedCommsMessages(input.commsDir))
    .filter((message) => messageMatchesRecipient(message, input.agentName, input.sessionPrefix))
    .filter((message) => !seenIds.has(message.event_id))
    .toSorted(compareDirectedMessages)
    .slice(0, input.remainingEvents);

  if (unseen.length === 0) {
    return { output: '', eventCount: 0 };
  }

  await input.io.appendSeenMessageIds(
    input.seenFile,
    unseen.map((message) => message.event_id),
  );

  return {
    output: unseen.map(formatDirectedMessage).join('\n'),
    eventCount: unseen.length,
  };
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
