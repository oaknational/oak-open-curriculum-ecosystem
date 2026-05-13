/**
 * Validates the canonical communication-protocol schema at
 * `.agent/state/collaboration/comms-event.schema.json` against representative
 * fixtures of each event kind (narrative, lifecycle, directed).
 *
 * The schema is the single source of truth for the inter-agent communication
 * protocol; this test asserts that the authored schema matches the unified
 * v2 communication event shape.
 */
import Ajv from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

import { commsEventSchema } from './comms-event-schema-fixture.js';

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
  title: 'Test event title',
  body: 'Test event body.',
} as const;

const narrativeWithAffordances = {
  schema_version: '2.0.0',
  event_id: 'claude-7402c9-prismatic-a1-acceptance-criterion-shift',
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

function ajv(): Ajv {
  return new Ajv({ allErrors: true, strict: false, validateFormats: false });
}

describe('comms-event.schema.json — canonical protocol authority', () => {
  it('is a valid JSON Schema document that Ajv can compile', () => {
    expect(() => ajv().compile(commsEventSchema)).not.toThrow();
  });

  it('accepts a canonical narrative event (5 required fields) against $defs.narrative', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/narrative' });
    expect(validate(canonicalNarrative)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('accepts a narrative event carrying every optional routing/threading affordance', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/narrative' });
    expect(validate(narrativeWithAffordances)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('rejects a narrative event with an unknown additional property', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/narrative' });
    expect(
      validate({
        ...canonicalNarrative,
        unrecognised_field: 'not allowed under additionalProperties false',
      }),
    ).toBe(false);
  });

  it('rejects a narrative event missing the required body field', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/narrative' });
    const withoutBody = {
      event_id: canonicalNarrative.event_id,
      created_at: canonicalNarrative.created_at,
      author: canonicalNarrative.author,
      title: canonicalNarrative.title,
    };
    expect(validate(withoutBody)).toBe(false);
  });

  it('accepts a lifecycle event with the full required field set', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/lifecycle' });
    expect(validate(lifecycle)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('rejects a lifecycle event missing the event_type discriminator field', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/lifecycle' });
    const withoutEventType = {
      schema_version: lifecycle.schema_version,
      event_id: lifecycle.event_id,
      created_at: lifecycle.created_at,
      kind: lifecycle.kind,
      occurred_at: lifecycle.occurred_at,
      author: lifecycle.author,
      agent_id: lifecycle.agent_id,
      thread: lifecycle.thread,
      claim_id: lifecycle.claim_id,
      title: lifecycle.title,
      subject: lifecycle.subject,
      body: lifecycle.body,
    };
    expect(validate(withoutEventType)).toBe(false);
  });

  it('accepts a directed message with post-migration created_at field name', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/directed' });
    expect(validate(directedPostMigration)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('rejects a directed message that still carries the legacy timestamp field', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/directed' });
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
    expect(validate(legacyShape)).toBe(false);
  });

  it('rejects a directed message missing the to field', () => {
    const validate = ajv().compile({ ...commsEventSchema, $ref: '#/$defs/directed' });
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
    expect(validate(withoutTo)).toBe(false);
  });

  it('accepts any single event kind against the top-level oneOf', () => {
    const validate = ajv().compile(commsEventSchema);
    expect(validate(canonicalNarrative)).toBe(true);
    expect(validate(lifecycle)).toBe(true);
    expect(validate(directedPostMigration)).toBe(true);
  });

  it('rejects an empty object against the top-level oneOf', () => {
    const validate = ajv().compile(commsEventSchema);
    expect(validate({})).toBe(false);
  });
});
