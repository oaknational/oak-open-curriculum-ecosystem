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

  const drained = onlyDirected
    ? await drainDirectedInbox({
        messages,
        seenIds,
        agentName: self.agent_name,
        sessionPrefix: self.session_id_prefix === '' ? undefined : self.session_id_prefix,
      })
    : await drainRelevantEvents({
        messages,
        seenIds,
        self,
      });

  if (drained.eventCount === 0) {
    return onlyDirected ? 'no new directed messages\n' : 'no new comms events\n';
  }

  // Mark seen AFTER the events have been "delivered" to the caller. For
  // inbox, function-return IS the delivery, so marking just before return is
  // analogous to the watcher's post-emit ordering (FM-2 cure 2026-05-23).
  await io.appendSeenMessageIds(seenFile, drained.eventIds);

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
