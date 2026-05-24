import { drainRelevantEvents } from './comms-use-cases.js';
import { required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { resolveSelfIdentity } from './cli-self-identity.js';
import { type CollaborationStateEnvironment } from './types.js';

export async function inboxComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const self = resolveSelfIdentity(options, env);

  const messages = await io.readCommsEvents(commsDir);
  const seenIds = await io.readSeenIds(seenFile);

  const drained = await drainRelevantEvents({ messages, seenIds, self });

  if (drained.eventCount === 0) {
    return 'no new comms events\n';
  }

  // Mark seen AFTER the events have been "delivered" to the caller. For
  // inbox, function-return IS the delivery, so marking just before return is
  // analogous to the watcher's post-emit ordering (FM-2 cure 2026-05-23).
  await io.appendSeenMessageIds(seenFile, drained.eventIds);

  return drained.output;
}
