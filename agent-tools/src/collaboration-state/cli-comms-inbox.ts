import { drainDirectedInbox } from './comms-use-cases.js';
import { required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { type CollaborationStateEnvironment } from './types.js';

export async function inboxComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const seenFile = required(options, 'seen-file');
  const drained = await drainDirectedInbox({
    messages: await io.readCommsEvents(required(options, 'comms-dir')),
    seenIds: await io.readSeenIds(seenFile),
    agentName: required(options, 'agent-name'),
    markSeen: (eventIds) => io.appendSeenMessageIds(seenFile, eventIds),
  });

  if (drained.eventCount === 0) {
    return 'no new directed messages\n';
  }

  return drained.output;
}
