/**
 * Tests for `renderSharedCommsLog` — the per-kind renderers and the
 * chronological merge across the three event kinds. The schema authority
 * for each kind is `comms-event.schema.json`; the renderer takes typed
 * arrays of each kind separately (no in-event discriminator) and produces
 * a single time-ordered Markdown log.
 */
import { describe, expect, it } from 'vitest';

import {
  createNarrativeCommsEvent,
  renderSharedCommsLog,
  type CollaborationAgentId,
} from '../../src/collaboration-state';

const nowIso = '2026-04-28T09:37:11Z';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

describe('renderSharedCommsLog', () => {
  it('renders narrative events chronologically and labels the source directories', () => {
    const rendered = renderSharedCommsLog({
      narrative: [
        createNarrativeCommsEvent(
          {
            event_id: 'event-two',
            created_at: '2026-04-28T09:05:00Z',
            author: woodland,
            title: 'second event',
            body: 'Rendered second.',
          },
          { nowIso },
        ),
        createNarrativeCommsEvent(
          {
            event_id: 'event-one',
            created_at: '2026-04-28T09:00:00Z',
            author: woodland,
            title: 'first event',
            body: 'Rendered first.',
          },
          { nowIso },
        ),
      ],
      lifecycle: [],
      directed: [],
    });

    expect(rendered.indexOf('first event')).toBeLessThan(rendered.indexOf('second event'));
    expect(rendered).toContain('merge_class: append-only-narrative');
    expect(rendered).toContain('Generated from `.agent/state/collaboration/comms-events/`');
    expect(rendered).toContain('`.agent/state/collaboration/comms-lifecycle/`');
    expect(rendered).toContain('`.agent/state/collaboration/comms-messages/`');
    expect(rendered).toContain('# Agent-to-Agent Shared Communication Log');
    expect(rendered).toContain('Rendered first.\n\n---\n\n## 2026-04-28T09:05:00Z');
  });

  it('merges the three event kinds in chronological order regardless of input order', () => {
    const narrativeEvent = createNarrativeCommsEvent(
      {
        event_id: 'narrative-event-id',
        created_at: '2026-04-28T09:00:00Z',
        author: woodland,
        title: 'narrative first',
        body: 'Narrative body.',
      },
      { nowIso },
    );
    const lifecycleEvent = {
      schema_version: '1.3.0',
      event_id: 'lifecycle-event-id',
      created_at: '2026-04-28T09:10:00Z',
      event_type: 'consolidation_open',
      occurred_at: '2026-04-28T09:10:00Z',
      author: woodland,
      agent_id: woodland,
      thread: 'agentic-engineering-enhancements',
      claim_id: '',
      title: 'lifecycle middle',
      subject: 'lifecycle middle subject',
      body: 'Lifecycle body.',
    } as const;
    const directedMessage = {
      schema_version: '1.0.0',
      event_id: 'directed-message-id',
      created_at: '2026-04-28T09:20:00Z',
      kind: 'session-handoff-summary',
      from: woodland,
      to: woodland,
      subject: 'directed last',
      body: 'Directed body.',
    } as const;

    const rendered = renderSharedCommsLog({
      narrative: [narrativeEvent],
      lifecycle: [lifecycleEvent],
      directed: [directedMessage],
    });

    expect(rendered.indexOf('narrative first')).toBeLessThan(rendered.indexOf('lifecycle middle'));
    expect(rendered.indexOf('lifecycle middle')).toBeLessThan(rendered.indexOf('directed last'));
  });

  it('labels lifecycle and directed sections with kind-specific prefixes', () => {
    const lifecycleEvent = {
      schema_version: '1.3.0',
      event_id: 'lifecycle-event-id',
      created_at: '2026-04-28T09:10:00Z',
      event_type: 'consolidation_open',
      occurred_at: '2026-04-28T09:10:00Z',
      author: woodland,
      agent_id: woodland,
      thread: 'agentic-engineering-enhancements',
      claim_id: '',
      title: 'lifecycle moment',
      subject: 'lifecycle subject',
      body: 'Lifecycle body.',
    } as const;
    const directedMessage = {
      schema_version: '1.0.0',
      event_id: 'directed-message-id',
      created_at: '2026-04-28T09:20:00Z',
      kind: 'session-handoff-summary',
      from: woodland,
      to: woodland,
      subject: 'directed subject',
      body: 'Directed body.',
    } as const;

    const rendered = renderSharedCommsLog({
      narrative: [],
      lifecycle: [lifecycleEvent],
      directed: [directedMessage],
    });

    expect(rendered).toContain('[lifecycle:consolidation_open]');
    expect(rendered).toContain('[directed:session-handoff-summary]');
  });
});
