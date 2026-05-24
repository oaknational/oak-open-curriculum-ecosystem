import { describe, expect, it } from 'vitest';

import {
  parseDirectedCommsMessage,
  parseLifecycleCommsEvent,
  parseNarrativeCommsEvent,
} from '../../src/collaboration-state/state-parsers.js';

const agent = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
} as const;

const narrative = {
  event_id: 'narrative-event',
  created_at: '2026-05-07T15:49:02Z',
  author: agent,
  title: 'Narrative event',
  body: 'Narrative body.',
} as const;

const lifecycle = {
  schema_version: '1.3.0',
  event_id: 'lifecycle-event',
  created_at: '2026-04-29T14:30:00Z',
  event_type: 'comms_event',
  occurred_at: '2026-04-29T14:30:00Z',
  author: agent,
  agent_id: agent,
  thread: 'agentic-engineering-enhancements',
  claim_id: '',
  title: 'Lifecycle event',
  subject: 'Lifecycle subject',
  body: 'Lifecycle body.',
} as const;

const directed = {
  schema_version: '1.0.0',
  event_id: 'directed-event',
  created_at: '2026-05-10T18:15:00Z',
  kind: 'session-handoff-summary',
  from: agent,
  to: agent,
  subject: 'Directed subject',
  body: 'Directed body.',
} as const;

describe('strict comms event parsing', () => {
  it('rejects unrecognised narrative fields instead of silently dropping them', () => {
    expect(() =>
      parseNarrativeCommsEvent(JSON.stringify({ ...narrative, unrecognised_field: 'no' })),
    ).toThrow(/Unrecognized key/);
  });

  it('rejects unrecognised lifecycle fields instead of silently dropping them', () => {
    expect(() =>
      parseLifecycleCommsEvent(JSON.stringify({ ...lifecycle, extra_lifecycle_field: 'no' })),
    ).toThrow(/Unrecognized key/);
  });

  it('rejects unrecognised directed fields instead of silently dropping them', () => {
    expect(() =>
      parseDirectedCommsMessage(JSON.stringify({ ...directed, extra_directed_field: 'no' })),
    ).toThrow(/Unrecognized key/);
  });
});
