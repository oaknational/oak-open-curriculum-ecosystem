import { drainDirectedInbox, watchDirectedInbox } from './comms-use-cases.js';
import { optional, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';

const DEFAULT_POLL_MS = 500;

export async function watchComms(options: Options, runtime: CliRuntime): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const agentName = required(options, 'agent-name');
  const sessionPrefix = optional(options, 'session-prefix');
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');

  await io.ensureDirectory(commsDir);

  const output = await watchDirectedInbox({
    maxEvents,
    drain: (remainingEvents) =>
      drainUnseenMessages({
        commsDir,
        seenFile,
        agentName,
        sessionPrefix,
        remainingEvents,
        io,
      }),
    waitForChange: () => waitForCommsChange(runtime, { directory: commsDir, pollMs }),
    emit: async (text) => {
      runtime.stdout?.write(text);
    },
  });

  return runtime.stdout === undefined ? output : '';
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
  return drainDirectedInbox({
    messages: await input.io.readCommsEvents(input.commsDir),
    seenIds,
    agentName: input.agentName,
    sessionPrefix: input.sessionPrefix,
    remainingEvents: input.remainingEvents,
    markSeen: (eventIds) => input.io.appendSeenMessageIds(input.seenFile, eventIds),
  });
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
