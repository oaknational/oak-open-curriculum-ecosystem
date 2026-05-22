/**
 * Parser tests for the unified communication event kinds.
 *
 * The canonical comms-event schema at
 * `.agent/state/collaboration/comms-event.schema.json` defines three event
 * shapes ($defs.narrative, $defs.lifecycle, $defs.directed). The TypeScript
 * parsers in `state-parsers.ts` project the schema's $defs into the type
 * system as three single-schema parsers plus the top-level discriminated
 * parser.
 *
 * These tests are the TypeScript-layer correctness gate; the schema-
 * authority gate lives in `comms-event-schema.unit.test.ts`.
 */
import { describe, expect, it } from 'vitest';

import {
  parseCommsEvent,
  parseDirectedCommsMessage,
  parseLifecycleCommsEvent,
  parseNarrativeCommsEvent,
} from '../../src/collaboration-state/state-parsers.js';

const woodland = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
} as const;

const sylvan = {
  agent_name: 'Sylvan Fruiting Glade',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: 'a53e45',
} as const;

const canonicalNarrative = {
  schema_version: '2.0.0',
  event_id: '00de9e88-44a5-41c1-a9a5-6488a890ff07',
  created_at: '2026-05-07T15:49:02Z',
  kind: 'narrative',
  author: woodland,
  title: 'Canonical narrative event title',
  body: 'Canonical narrative event body.',
} as const;

const narrativeWithAffordances = {
  schema_version: '2.0.0',
  event_id: 'narrative-with-affordances',
  created_at: '2026-05-03T09:35:57Z',
  kind: 'narrative',
  author: woodland,
  audience: ['*'],
  addressed_to: 'Sylvan Fruiting Glade',
  in_response_to: 'earlier-event-id',
  in_reply_to: 'another-earlier-event-id',
  title: 'Narrative with all optional affordances',
  body: 'Validates that audience / addressed_to / in_response_to / in_reply_to are accepted.',
} as const;

const lifecycle = {
  schema_version: '2.0.0',
  event_id: 'fe4acc7e-cons-doc-2026-04-29-14-30',
  created_at: '2026-04-29T14:30:00Z',
  kind: 'lifecycle',
  event_type: 'comms_event',
  occurred_at: '2026-04-29T14:30:00Z',
  author: woodland,
  agent_id: woodland,
  thread: 'agentic-engineering-enhancements',
  claim_id: 'fe4acc7e-1234-4abc-9def-0123456789ab',
  title: 'Lifecycle event title',
  subject: 'Lifecycle event subject',
  body: 'Records a session lifecycle moment.',
} as const;

const directedPostMigration = {
  schema_version: '2.0.0',
  event_id: '3882213c-a6b1-4661-a1cd-a261f50ea5e8',
  created_at: '2026-05-10T18:15:00Z',
  kind: 'directed',
  message_kind: 'session-handoff-summary',
  from: woodland,
  to: sylvan,
  subject: 'Session-handoff summary',
  body: 'Directed message body.',
} as const;

describe('parseNarrativeCommsEvent', () => {
  it('parses a canonical narrative event with the five required fields', () => {
    const event = parseNarrativeCommsEvent(JSON.stringify(canonicalNarrative));

    expect(event.schema_version).toBe('2.0.0');
    expect(event.kind).toBe('narrative');
    expect(event.event_id).toBe('00de9e88-44a5-41c1-a9a5-6488a890ff07');
    expect(event.created_at).toBe('2026-05-07T15:49:02Z');
    expect(event.author).toEqual(woodland);
    expect(event.title).toBe('Canonical narrative event title');
    expect(event.body).toBe('Canonical narrative event body.');
  });

  it('preserves every optional routing and threading affordance on a narrative event', () => {
    const event = parseNarrativeCommsEvent(JSON.stringify(narrativeWithAffordances));

    expect(event.audience).toEqual(['*']);
    expect(event.addressed_to).toBe('Sylvan Fruiting Glade');
    expect(event.in_response_to).toBe('earlier-event-id');
    expect(event.in_reply_to).toBe('another-earlier-event-id');
  });

  it('rejects a legacy addressed_to agent reference object', () => {
    expect(() =>
      parseNarrativeCommsEvent(
        JSON.stringify({
          ...canonicalNarrative,
          addressed_to: {
            agent_name: 'Riverine Drifting Lighthouse',
            session_id_prefix: 'd1105c',
          },
        }),
      ),
    ).toThrow(/addressed_to/);
  });

  it('rejects legacy null threading fields', () => {
    expect(() =>
      parseNarrativeCommsEvent(JSON.stringify({ ...canonicalNarrative, in_response_to: null })),
    ).toThrow(/in_response_to/);
    expect(() =>
      parseNarrativeCommsEvent(JSON.stringify({ ...canonicalNarrative, in_reply_to: null })),
    ).toThrow(/in_reply_to/);
  });

  it('rejects a narrative event missing the required body field', () => {
    const withoutBody = {
      event_id: canonicalNarrative.event_id,
      created_at: canonicalNarrative.created_at,
      author: canonicalNarrative.author,
      title: canonicalNarrative.title,
    };

    expect(() => parseNarrativeCommsEvent(JSON.stringify(withoutBody))).toThrow(/body/);
  });

  it('round-trips an optional tags array on a narrative event', () => {
    const event = parseNarrativeCommsEvent(
      JSON.stringify({ ...canonicalNarrative, tags: ['failure-mode'] }),
    );

    expect(event.tags).toEqual(['failure-mode']);
  });

  it('rejects a non-object payload', () => {
    expect(() => parseNarrativeCommsEvent('null')).toThrow(/must be a JSON object/);
    expect(() => parseNarrativeCommsEvent('"a string"')).toThrow(/must be a JSON object/);
    expect(() => parseNarrativeCommsEvent('42')).toThrow(/must be a JSON object/);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseNarrativeCommsEvent('{not-json')).toThrow(SyntaxError);
  });
});

describe('parseLifecycleCommsEvent', () => {
  it('parses a lifecycle event with the full required field set', () => {
    const event = parseLifecycleCommsEvent(JSON.stringify(lifecycle));

    expect(event.schema_version).toBe('2.0.0');
    expect(event.kind).toBe('lifecycle');
    expect(event.event_type).toBe('comms_event');
    expect(event.occurred_at).toBe('2026-04-29T14:30:00Z');
    expect(event.agent_id).toEqual(woodland);
    expect(event.thread).toBe('agentic-engineering-enhancements');
    expect(event.claim_id).toBe('fe4acc7e-1234-4abc-9def-0123456789ab');
    expect(event.subject).toBe('Lifecycle event subject');
  });

  it('accepts an empty claim_id for non-claim-scoped lifecycle events', () => {
    const event = parseLifecycleCommsEvent(JSON.stringify({ ...lifecycle, claim_id: '' }));

    expect(event.claim_id).toBe('');
  });

  it('rejects a lifecycle event missing the event_type discriminator field', () => {
    const withoutEventType = {
      schema_version: lifecycle.schema_version,
      event_id: lifecycle.event_id,
      created_at: lifecycle.created_at,
      occurred_at: lifecycle.occurred_at,
      author: lifecycle.author,
      agent_id: lifecycle.agent_id,
      thread: lifecycle.thread,
      claim_id: lifecycle.claim_id,
      title: lifecycle.title,
      subject: lifecycle.subject,
      body: lifecycle.body,
    };

    expect(() => parseLifecycleCommsEvent(JSON.stringify(withoutEventType))).toThrow(/event_type/);
  });

  it('rejects a narrative payload that lacks the lifecycle-required fields', () => {
    expect(() => parseLifecycleCommsEvent(JSON.stringify(canonicalNarrative))).toThrow(
      /event_type/,
    );
  });

  it('round-trips an optional tags array on a lifecycle event', () => {
    const event = parseLifecycleCommsEvent(
      JSON.stringify({ ...lifecycle, tags: ['failure-mode'] }),
    );

    expect(event.tags).toEqual(['failure-mode']);
  });
});

describe('parseDirectedCommsMessage', () => {
  it('parses a directed message in the post-migration shape (created_at)', () => {
    const event = parseDirectedCommsMessage(JSON.stringify(directedPostMigration));

    expect(event.schema_version).toBe('2.0.0');
    expect(event.kind).toBe('directed');
    expect(event.message_kind).toBe('session-handoff-summary');
    expect(event.from).toEqual(woodland);
    expect(event.to).toEqual(sylvan);
    expect(event.subject).toBe('Session-handoff summary');
    expect(event.created_at).toBe('2026-05-10T18:15:00Z');
  });

  it('rejects the legacy directed shape that carries timestamp instead of created_at', () => {
    const legacyShape = {
      schema_version: directedPostMigration.schema_version,
      event_id: directedPostMigration.event_id,
      timestamp: directedPostMigration.created_at,
      kind: directedPostMigration.kind,
      message_kind: directedPostMigration.message_kind,
      from: directedPostMigration.from,
      to: directedPostMigration.to,
      subject: directedPostMigration.subject,
      body: directedPostMigration.body,
    };

    expect(() => parseDirectedCommsMessage(JSON.stringify(legacyShape))).toThrow(/created_at/);
  });

  it('rejects a directed message missing the to field', () => {
    const withoutTo = {
      schema_version: directedPostMigration.schema_version,
      event_id: directedPostMigration.event_id,
      created_at: directedPostMigration.created_at,
      kind: directedPostMigration.kind,
      message_kind: directedPostMigration.message_kind,
      from: directedPostMigration.from,
      subject: directedPostMigration.subject,
      body: directedPostMigration.body,
    };

    expect(() => parseDirectedCommsMessage(JSON.stringify(withoutTo))).toThrow(/to/);
  });

  it('rejects a narrative payload that lacks the directed-required fields', () => {
    expect(() => parseDirectedCommsMessage(JSON.stringify(canonicalNarrative))).toThrow(
      /message_kind/,
    );
  });

  it('round-trips an optional tags array on a directed message', () => {
    const event = parseDirectedCommsMessage(
      JSON.stringify({ ...directedPostMigration, tags: ['failure-mode'] }),
    );

    expect(event.tags).toEqual(['failure-mode']);
  });
});

describe('parseCommsEvent', () => {
  it('dispatches canonical events through the top-level kind discriminator', () => {
    expect(parseCommsEvent(JSON.stringify(canonicalNarrative)).kind).toBe('narrative');
    expect(parseCommsEvent(JSON.stringify(lifecycle)).kind).toBe('lifecycle');
    expect(parseCommsEvent(JSON.stringify(directedPostMigration)).kind).toBe('directed');
  });
});
