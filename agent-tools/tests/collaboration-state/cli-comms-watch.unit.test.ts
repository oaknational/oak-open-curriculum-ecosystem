import { describe, expect, it } from 'vitest';

import { watchComms } from '../../src/collaboration-state/cli-comms-watch';
import { type Options } from '../../src/collaboration-state/cli-options';
import {
  type CollaborationStateEnvironment,
  type CommsEvent,
} from '../../src/collaboration-state/types';
import { parseWatcherHeartbeat } from '../../src/collaboration-state/watcher-heartbeat';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const EMPTY_ENV: CollaborationStateEnvironment = {};
const COMMS_DIR = '/comms';
const SEEN_FILE = '/seen/watcher.json';
const DERIVED_HEARTBEAT = `${SEEN_FILE}.heartbeat.json`;

function watchOptions(values: Record<string, string>): Options {
  return {
    command: 'comms',
    topic: 'watch',
    values: new Map(Object.entries(values)),
    files: [],
    areaPatterns: [],
    tags: [],
  };
}

/** An event authored by someone OTHER than the watcher, so it is not self-excluded. */
function otherAgentEvent(eventId: string): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: '2026-06-10T00:00:00Z',
    kind: 'narrative',
    author: {
      agent_name: 'Other Agent',
      platform: 'claude',
      model: 'test',
      session_id_prefix: 'oth123',
    },
    title: `event ${eventId}`,
    body: 'test body',
  };
}

/**
 * Drive one bounded watch pass (a single drainable non-self event,
 * `--no-auto-seed` so it is replayed rather than seeded-past, `--agent-name`
 * for a deterministic override identity). The single iteration emits the
 * event and fires the heartbeat tick exactly once.
 */
async function runOneWatchPass(extraOptions: Record<string, string>): Promise<{
  readonly heartbeatAt: (path: string) => string | undefined;
}> {
  const fake = createFakeCollaborationRuntime({
    comms: { [COMMS_DIR]: [otherAgentEvent('evt-1')] },
  });

  await watchComms(
    watchOptions({
      'comms-dir': COMMS_DIR,
      'seen-file': SEEN_FILE,
      'agent-name': 'Watcher Self',
      platform: 'claude',
      model: 'test',
      'session-prefix': 'self99',
      'max-events': '1',
      'no-auto-seed': 'true',
      ...extraOptions,
    }),
    EMPTY_ENV,
    fake.runtime,
  );

  return { heartbeatAt: (path) => fake.readTextFile(path) };
}

describe('watchComms — liveness default-on (Luminous c2)', () => {
  it('writes a schema-valid heartbeat at the derived <seen-file>.heartbeat.json on a default invocation', async () => {
    const { heartbeatAt } = await runOneWatchPass({});

    const heartbeatText = heartbeatAt(DERIVED_HEARTBEAT);
    expect(heartbeatText).toBeDefined();
    const heartbeat = parseWatcherHeartbeat(heartbeatText ?? '');
    expect(heartbeat.watcher_identity.agent_name).toBe('Watcher Self');
  });

  it('writes NO heartbeat when --no-heartbeat opts out', async () => {
    const { heartbeatAt } = await runOneWatchPass({ 'no-heartbeat': 'true' });

    expect(heartbeatAt(DERIVED_HEARTBEAT)).toBeUndefined();
  });

  it('honours an explicit --heartbeat-file over the derived default', async () => {
    const explicitPath = '/custom/heartbeat.json';
    const { heartbeatAt } = await runOneWatchPass({ 'heartbeat-file': explicitPath });

    const heartbeatText = heartbeatAt(explicitPath);
    expect(heartbeatText).toBeDefined();
    const heartbeat = parseWatcherHeartbeat(heartbeatText ?? '');
    expect(heartbeat.watcher_identity.agent_name).toBe('Watcher Self');
    expect(heartbeatAt(DERIVED_HEARTBEAT)).toBeUndefined();
  });
});
