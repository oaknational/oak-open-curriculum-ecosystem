import { z } from 'zod';

import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

/**
 * Strict Zod schemas for collaboration-state boundary parsing. These schemas
 * reject unknown fields so legacy comms-event shapes fail before they reach
 * the typed renderer, TUI, or watcher surfaces.
 */
const nonEmptyString = z.string().min(1);
const possiblyEmptyString = z.string();

const agentIdSchema = z.strictObject({
  agent_name: nonEmptyString,
  platform: nonEmptyString,
  model: nonEmptyString,
  session_id_prefix: nonEmptyString,
});

const narrativeCommsEventSchema = z.strictObject({
  schema_version: z.literal('2.0.0'),
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  kind: z.literal('narrative'),
  author: agentIdSchema,
  title: nonEmptyString,
  body: nonEmptyString,
  audience: z.array(nonEmptyString).optional(),
  addressed_to: nonEmptyString.optional(),
  in_response_to: nonEmptyString.optional(),
  in_reply_to: nonEmptyString.optional(),
  tags: z.array(nonEmptyString).optional(),
});

const lifecycleCommsEventSchema = z.strictObject({
  schema_version: z.literal('2.0.0'),
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  kind: z.literal('lifecycle'),
  event_type: nonEmptyString,
  occurred_at: nonEmptyString,
  author: agentIdSchema,
  agent_id: agentIdSchema,
  thread: nonEmptyString,
  claim_id: possiblyEmptyString,
  title: nonEmptyString,
  subject: nonEmptyString,
  body: nonEmptyString,
  tags: z.array(nonEmptyString).optional(),
});

const directedCommsMessageSchema = z.strictObject({
  schema_version: z.literal('2.0.0'),
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  kind: z.literal('directed'),
  message_kind: nonEmptyString,
  from: agentIdSchema,
  to: agentIdSchema,
  subject: nonEmptyString,
  body: nonEmptyString,
  tags: z.array(nonEmptyString).optional(),
});

const commsEventSchema = z.discriminatedUnion('kind', [
  narrativeCommsEventSchema,
  lifecycleCommsEventSchema,
  directedCommsMessageSchema,
]);

/**
 * Parse one canonical comms event after JSON parsing has crossed the boundary.
 */
export function parseCommsEventValue(value: unknown): CommsEvent {
  const parsed = parseWithHelpfulError({
    label: 'communication event',
    schema: commsEventSchema,
    value,
  });

  if (parsed.kind === 'narrative') {
    return narrativeEvent(parsed);
  }
  if (parsed.kind === 'lifecycle') {
    return lifecycleEvent(parsed);
  }

  return directedEvent(parsed);
}

/**
 * Parse one narrative comms event after JSON parsing has crossed the boundary.
 */
export function parseNarrativeCommsEventValue(value: unknown): NarrativeCommsEvent {
  const parsed = parseWithHelpfulError({
    label: 'narrative communication event',
    schema: narrativeCommsEventSchema,
    value,
  });

  return {
    event_id: parsed.event_id,
    schema_version: parsed.schema_version,
    created_at: parsed.created_at,
    kind: parsed.kind,
    author: agentId(parsed.author),
    title: parsed.title,
    body: parsed.body,
    ...(parsed.audience === undefined ? {} : { audience: parsed.audience }),
    ...(parsed.addressed_to === undefined ? {} : { addressed_to: parsed.addressed_to }),
    ...(parsed.in_response_to === undefined ? {} : { in_response_to: parsed.in_response_to }),
    ...(parsed.in_reply_to === undefined ? {} : { in_reply_to: parsed.in_reply_to }),
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

/**
 * Parse one lifecycle comms event after JSON parsing has crossed the boundary.
 */
export function parseLifecycleCommsEventValue(value: unknown): LifecycleCommsEvent {
  const parsed = parseWithHelpfulError({
    label: 'lifecycle communication event',
    schema: lifecycleCommsEventSchema,
    value,
  });

  return {
    schema_version: parsed.schema_version,
    event_id: parsed.event_id,
    created_at: parsed.created_at,
    kind: parsed.kind,
    event_type: parsed.event_type,
    occurred_at: parsed.occurred_at,
    author: agentId(parsed.author),
    agent_id: agentId(parsed.agent_id),
    thread: parsed.thread,
    claim_id: parsed.claim_id,
    title: parsed.title,
    subject: parsed.subject,
    body: parsed.body,
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

/**
 * Parse one directed comms message after JSON parsing has crossed the boundary.
 */
export function parseDirectedCommsMessageValue(value: unknown): DirectedCommsMessage {
  const parsed = parseWithHelpfulError({
    label: 'directed communication message',
    schema: directedCommsMessageSchema,
    value,
  });

  return {
    schema_version: parsed.schema_version,
    event_id: parsed.event_id,
    created_at: parsed.created_at,
    kind: parsed.kind,
    message_kind: parsed.message_kind,
    from: agentId(parsed.from),
    to: agentId(parsed.to),
    subject: parsed.subject,
    body: parsed.body,
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

function narrativeEvent(parsed: z.infer<typeof narrativeCommsEventSchema>): NarrativeCommsEvent {
  return {
    event_id: parsed.event_id,
    schema_version: parsed.schema_version,
    created_at: parsed.created_at,
    kind: parsed.kind,
    author: agentId(parsed.author),
    title: parsed.title,
    body: parsed.body,
    ...(parsed.audience === undefined ? {} : { audience: parsed.audience }),
    ...(parsed.addressed_to === undefined ? {} : { addressed_to: parsed.addressed_to }),
    ...(parsed.in_response_to === undefined ? {} : { in_response_to: parsed.in_response_to }),
    ...(parsed.in_reply_to === undefined ? {} : { in_reply_to: parsed.in_reply_to }),
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

function lifecycleEvent(parsed: z.infer<typeof lifecycleCommsEventSchema>): LifecycleCommsEvent {
  return {
    schema_version: parsed.schema_version,
    event_id: parsed.event_id,
    created_at: parsed.created_at,
    kind: parsed.kind,
    event_type: parsed.event_type,
    occurred_at: parsed.occurred_at,
    author: agentId(parsed.author),
    agent_id: agentId(parsed.agent_id),
    thread: parsed.thread,
    claim_id: parsed.claim_id,
    title: parsed.title,
    subject: parsed.subject,
    body: parsed.body,
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

function directedEvent(parsed: z.infer<typeof directedCommsMessageSchema>): DirectedCommsMessage {
  return {
    schema_version: parsed.schema_version,
    event_id: parsed.event_id,
    created_at: parsed.created_at,
    kind: parsed.kind,
    message_kind: parsed.message_kind,
    from: agentId(parsed.from),
    to: agentId(parsed.to),
    subject: parsed.subject,
    body: parsed.body,
    ...(parsed.tags === undefined ? {} : { tags: parsed.tags }),
  };
}

function agentId(parsed: z.infer<typeof agentIdSchema>): CollaborationAgentId {
  return {
    agent_name: parsed.agent_name,
    platform: parsed.platform,
    model: parsed.model,
    session_id_prefix: parsed.session_id_prefix,
  };
}

function parseWithHelpfulError<TSchema extends z.ZodType>(input: {
  readonly label: string;
  readonly schema: TSchema;
  readonly value: unknown;
}): z.output<TSchema> {
  const result = input.schema.safeParse(input.value);
  if (result.success) {
    return result.data;
  }

  throw new Error(`${input.label} failed validation: ${z.prettifyError(result.error)}`);
}
