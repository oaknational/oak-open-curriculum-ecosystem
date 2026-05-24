/**
 * Tests for `renderSharedCommsLog` — the per-kind renderers and the
 * chronological merge across the unified comms event kinds.
 */
import { describe, expect, it } from 'vitest';

import {
  createCommsEvent,
  renderSharedCommsLog,
  type CollaborationAgentId,
  type CommsEvent,
} from '../../src/collaboration-state';

const nowIso = '2026-04-28T09:37:11Z';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

describe('renderSharedCommsLog', () => {
  it('renders narrative events chronologically and labels the canonical source directory', () => {
    const rendered = renderSharedCommsLog({
      events: [
        createCommsEvent(
          {
            schema_version: '2.0.0',
            event_id: 'event-two',
            created_at: '2026-04-28T09:05:00Z',
            kind: 'narrative',
            author: woodland,
            title: 'second event',
            body: 'Rendered second.',
          },
          { nowIso },
        ),
        createCommsEvent(
          {
            schema_version: '2.0.0',
            event_id: 'event-one',
            created_at: '2026-04-28T09:00:00Z',
            kind: 'narrative',
            author: woodland,
            title: 'first event',
            body: 'Rendered first.',
          },
          { nowIso },
        ),
      ],
    });

    expect(rendered.indexOf('first event')).toBeLessThan(rendered.indexOf('second event'));
    expect(rendered).toContain('merge_class: append-only-narrative');
    expect(rendered).toContain('Generated from `.agent/state/collaboration/comms/`');
    expect(rendered).toContain('# Agent-to-Agent Shared Communication Log');
    expect(rendered).toContain('Rendered first.\n\n---\n\n## 2026-04-28T09:05:00Z');
  });

  it('merges the three event kinds in chronological order regardless of input order', () => {
    const narrativeEvent = createCommsEvent(
      {
        schema_version: '2.0.0',
        event_id: 'narrative-event-id',
        created_at: '2026-04-28T09:00:00Z',
        kind: 'narrative',
        author: woodland,
        title: 'narrative first',
        body: 'Narrative body.',
      },
      { nowIso },
    );
    const lifecycleEvent = {
      schema_version: '2.0.0',
      event_id: 'lifecycle-event-id',
      created_at: '2026-04-28T09:10:00Z',
      kind: 'lifecycle',
      event_type: 'consolidation_open',
      occurred_at: '2026-04-28T09:10:00Z',
      author: woodland,
      agent_id: woodland,
      thread: 'agentic-engineering-enhancements',
      claim_id: '',
      title: 'lifecycle middle',
      subject: 'lifecycle middle subject',
      body: 'Lifecycle body.',
    } satisfies CommsEvent;
    const directedMessage = {
      schema_version: '2.0.0',
      event_id: 'directed-message-id',
      created_at: '2026-04-28T09:20:00Z',
      kind: 'directed',
      message_kind: 'session-handoff-summary',
      from: woodland,
      to: woodland,
      subject: 'directed last',
      body: 'Directed body.',
    } satisfies CommsEvent;

    const rendered = renderSharedCommsLog({
      events: [directedMessage, lifecycleEvent, narrativeEvent],
    });

    expect(rendered.indexOf('narrative first')).toBeLessThan(rendered.indexOf('lifecycle middle'));
    expect(rendered.indexOf('lifecycle middle')).toBeLessThan(rendered.indexOf('directed last'));
  });

  it('labels lifecycle and directed sections with kind-specific prefixes', () => {
    const lifecycleEvent = {
      schema_version: '2.0.0',
      event_id: 'lifecycle-event-id',
      created_at: '2026-04-28T09:10:00Z',
      kind: 'lifecycle',
      event_type: 'consolidation_open',
      occurred_at: '2026-04-28T09:10:00Z',
      author: woodland,
      agent_id: woodland,
      thread: 'agentic-engineering-enhancements',
      claim_id: '',
      title: 'lifecycle moment',
      subject: 'lifecycle subject',
      body: 'Lifecycle body.',
    } satisfies CommsEvent;
    const directedMessage = {
      schema_version: '2.0.0',
      event_id: 'directed-message-id',
      created_at: '2026-04-28T09:20:00Z',
      kind: 'directed',
      message_kind: 'session-handoff-summary',
      from: woodland,
      to: woodland,
      subject: 'directed subject',
      body: 'Directed body.',
    } satisfies CommsEvent;

    const rendered = renderSharedCommsLog({
      events: [directedMessage, lifecycleEvent],
    });

    expect(rendered).toContain('[lifecycle:consolidation_open]');
    expect(rendered).toContain('[directed:session-handoff-summary]');
  });
});
