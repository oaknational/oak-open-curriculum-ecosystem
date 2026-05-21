import { drainDirectedInbox, drainRelevantEvents, watchDirectedInbox } from './comms-use-cases.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, optionalPositiveInteger, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

const DEFAULT_POLL_MS = 500;

export async function watchComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const self = resolveSelfIdentity(options, env);
  const onlyDirected = optional(options, 'only-directed') !== undefined;
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');

  await io.ensureDirectory(commsDir);

  const output = await watchDirectedInbox({
    maxEvents,
    drain: (remainingEvents) =>
      drainAccordingToView({
        commsDir,
        seenFile,
        self,
        onlyDirected,
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

async function drainAccordingToView(input: {
  readonly commsDir: string;
  readonly seenFile: string;
  readonly self: CollaborationAgentId;
  readonly onlyDirected: boolean;
  readonly remainingEvents?: number;
  readonly io: CollaborationStateCliIo;
}): ReturnType<typeof drainRelevantEvents> {
  const seenIds = await input.io.readSeenIds(input.seenFile);
  const messages = await input.io.readCommsEvents(input.commsDir);
  const markSeen = (eventIds: readonly string[]): Promise<void> =>
    input.io.appendSeenMessageIds(input.seenFile, eventIds);

  if (input.onlyDirected) {
    return drainDirectedInbox({
      messages,
      seenIds,
      agentName: input.self.agent_name,
      sessionPrefix: input.self.session_id_prefix === '' ? undefined : input.self.session_id_prefix,
      remainingEvents: input.remainingEvents,
      markSeen,
    });
  }
  return drainRelevantEvents({
    messages,
    seenIds,
    self: input.self,
    remainingEvents: input.remainingEvents,
    markSeen,
  });
}

/**
 * Resolve the watcher's identity tuple. Two routes:
 * - Override (admin/test): when `--agent-name` is provided, the explicit
 *   `--agent-name` + `--session-prefix` + `--platform` + `--model` tuple is
 *   used directly. The wildcard `*` for `--agent-name` is supported in
 *   `--only-directed` mode (matches every recipient) and is rejected in the
 *   default all-channels mode because it has no meaning there.
 * - Derived (canonical agent path): otherwise, identity is derived from the
 *   Practice session-id env vars via `resolveIdentity`, matching the rest
 *   of the comms commands (`send`, `direct`, `reply`).
 */
function resolveSelfIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): CollaborationAgentId {
  const explicitAgentName = optional(options, 'agent-name');
  if (explicitAgentName !== undefined) {
    return {
      agent_name: explicitAgentName,
      platform: optional(options, 'platform') ?? 'override',
      model: optional(options, 'model') ?? 'override',
      session_id_prefix: optional(options, 'session-prefix') ?? '',
    };
  }
  const identity = resolveIdentity(options, env);
  const overridePrefix = optional(options, 'session-prefix');
  return overridePrefix === undefined
    ? identity.agent_id
    : { ...identity.agent_id, session_id_prefix: overridePrefix };
}
