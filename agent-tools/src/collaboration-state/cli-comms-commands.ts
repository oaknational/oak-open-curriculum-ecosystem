import { randomUUID } from 'node:crypto';

import { renderSharedCommsLog } from './comms.js';
import { resolveIdentity } from './cli-identity.js';
import { required, valueOrDefault, type Options } from './cli-options.js';
import { validateSharedStateAgentId } from './identity.js';
import { readCommsEvents, writeCommsEvent } from './state-io.js';
import { writeTextFileAtomically } from './transaction.js';
import { type CollaborationStateEnvironment } from './types.js';

export async function appendComms(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }

  await writeCommsEvent({
    eventsDir: required(options, 'events-dir'),
    nowIso: required(options, 'now'),
    event: {
      event_id: valueOrDefault(options, 'event-id', randomUUID()),
      created_at: required(options, 'created-at'),
      author: identity.agent_id,
      title: required(options, 'title'),
      body: required(options, 'body'),
    },
  });

  return '';
}

export async function renderComms(options: Options): Promise<string> {
  const events = await readCommsEvents(required(options, 'events-dir'));
  await writeTextFileAtomically({
    filePath: required(options, 'output'),
    text: renderSharedCommsLog({ events }),
  });

  return '';
}
