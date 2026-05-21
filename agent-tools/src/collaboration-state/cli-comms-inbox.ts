import { drainDirectedInbox, drainRelevantEvents } from './comms-use-cases.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

export async function inboxComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const self = resolveSelfIdentity(options, env);
  const onlyDirected = optional(options, 'only-directed') !== undefined;

  const messages = await io.readCommsEvents(commsDir);
  const seenIds = await io.readSeenIds(seenFile);
  const markSeen = (eventIds: readonly string[]): Promise<void> =>
    io.appendSeenMessageIds(seenFile, eventIds);

  const drained = onlyDirected
    ? await drainDirectedInbox({
        messages,
        seenIds,
        agentName: self.agent_name,
        sessionPrefix: self.session_id_prefix === '' ? undefined : self.session_id_prefix,
        markSeen,
      })
    : await drainRelevantEvents({
        messages,
        seenIds,
        self,
        markSeen,
      });

  if (drained.eventCount === 0) {
    return onlyDirected ? 'no new directed messages\n' : 'no new comms events\n';
  }

  return drained.output;
}

/**
 * See `resolveSelfIdentity` in cli-comms-watch.ts for the contract: explicit
 * `--agent-name` selects override mode (admin/test); otherwise identity is
 * derived from env via `resolveIdentity`.
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
