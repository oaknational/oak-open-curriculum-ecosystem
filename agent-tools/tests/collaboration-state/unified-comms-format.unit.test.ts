import { describe, expect, it } from 'vitest';

import {
  createCommsEvent,
  renderSharedCommsLog,
  type CollaborationAgentId,
  type CommsEvent,
} from '../../src/collaboration-state';
import { parseCommsEvent } from '../../src/collaboration-state/state-parsers';

const nowIso = '2026-05-13T09:45:00Z';

const agent: CollaborationAgentId = {
  agent_name: 'Uplifted Wheeling Sky',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e20',
};

const narrative: CommsEvent = {
  schema_version: '2.0.0',
  event_id: 'narrative-event',
  created_at: '2026-05-13T09:40:00Z',
  kind: 'narrative',
  author: agent,
  title: 'Narrative event',
  body: 'Narrative body.',
};

const lifecycle: CommsEvent = {
  schema_version: '2.0.0',
  event_id: 'lifecycle-event',
  created_at: '2026-05-13T09:41:00Z',
  kind: 'lifecycle',
  event_type: 'claim_lifecycle',
  occurred_at: '2026-05-13T09:41:00Z',
  author: agent,
  agent_id: agent,
  thread: 'agentic-engineering-enhancements',
  claim_id: 'claim-one',
  title: 'Lifecycle event',
  subject: 'Lifecycle subject',
  body: 'Lifecycle body.',
};

const directed: CommsEvent = {
  schema_version: '2.0.0',
  event_id: 'directed-event',
  created_at: '2026-05-13T09:42:00Z',
  kind: 'directed',
  message_kind: 'coordination-update',
  from: agent,
  to: agent,
  subject: 'Directed subject',
  body: 'Directed body.',
};

describe('unified comms event format', () => {
  it('parses narrative, lifecycle, and directed events through one discriminated parser', () => {
    expect(parseCommsEvent(JSON.stringify(narrative))).toStrictEqual(narrative);
    expect(parseCommsEvent(JSON.stringify(lifecycle))).toStrictEqual(lifecycle);
    expect(parseCommsEvent(JSON.stringify(directed))).toStrictEqual(directed);
  });

  it('rejects a directed event that still uses the legacy kind payload field', () => {
    const legacyDirected = {
      ...directed,
      kind: 'coordination-update',
      message_kind: undefined,
    };

    expect(() => parseCommsEvent(JSON.stringify(legacyDirected))).toThrow(
      /Invalid discriminator value/,
    );
  });

  it('creates narrative events with the canonical schema version and kind', () => {
    expect(createCommsEvent(narrative, { nowIso })).toStrictEqual(narrative);
  });

  it('renders the shared log from one chronological event collection', () => {
    const rendered = renderSharedCommsLog({ events: [directed, narrative, lifecycle] });

    expect(rendered).toContain('Generated from `.agent/state/collaboration/comms/`.');
    expect(rendered.indexOf('Narrative event')).toBeLessThan(rendered.indexOf('Lifecycle event'));
    expect(rendered.indexOf('Lifecycle event')).toBeLessThan(rendered.indexOf('Directed subject'));
    expect(rendered).toContain('[lifecycle:claim_lifecycle]');
    expect(rendered).toContain('[directed:coordination-update]');
  });
});
