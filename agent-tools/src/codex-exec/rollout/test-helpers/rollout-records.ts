import assert from 'node:assert/strict';

import { z } from 'zod';

import { readRollout, type RolloutEvidence } from '../index.js';
import observed from '../fixtures/observed-code-mode-0-157.json';

/**
 * The recorded rollout the reader's tests start from, and the pure helpers
 * that edit a copy of it, for tests.
 *
 * The fixture is a redacted projection of a two-turn dialogue recorded on
 * codex-cli 0.157.0 on 2026-09-25 under the dialogue envelope: every record
 * kept, in order, with its type, payload type and item type, and only the
 * keys this reader reads. Ids, paths, program source, printed output and
 * command output were replaced; the session's creator ids and every unread
 * field were dropped.
 * Each turn ran three code-mode `exec` calls, each answered by its own
 * `CommandExecution` item.
 */

/** A JSON value, as the fixture holds it. */
export type FixtureValue = string | number | boolean | null | FixtureValue[] | FixtureObject;

/** A JSON object, as the fixture holds it. */
export interface FixtureObject {
  [key: string]: FixtureValue;
}

/** One rollout line, as the tests edit it before serialising. */
export interface TestRecord {
  type: string;
  payload: FixtureObject;
}

const fixtureValueSchema: z.ZodType<FixtureValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(fixtureValueSchema),
    z.record(z.string(), fixtureValueSchema),
  ]),
);

const fixtureSchema = z.array(
  z.strictObject({ type: z.string(), payload: z.record(z.string(), fixtureValueSchema) }),
);

/** The fixture's resumed turn. */
export const RESUMED_TURN_ID = '33333333-3333-4333-8333-333333333333';

function isObject(value: unknown): value is FixtureObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Narrow a fixture value to an object, failing the test when it is not one. */
export function object(value: unknown): FixtureObject {
  assert(isObject(value));
  return value;
}

function isTextParts(value: unknown): value is { type: string; text: string }[] {
  return (
    Array.isArray(value) &&
    value.every(
      (part) =>
        isObject(part) && typeof part['type'] === 'string' && typeof part['text'] === 'string',
    )
  );
}

/** Narrow a code-mode output to its text items, failing the test when it is not. */
export function textParts(value: unknown): { type: string; text: string }[] {
  assert(isTextParts(value));
  return value;
}

/** A fresh, schema-checked copy of any recorded rollout fixture. */
export function recordsOf(fixture: unknown): TestRecord[] {
  return fixtureSchema.parse(structuredClone(fixture));
}

/** A fresh copy of the recorded rollout. */
export function records(): TestRecord[] {
  return recordsOf(observed);
}

/** The records as the JSONL lines the reader takes. */
export function lines(recordsToRead: readonly TestRecord[]): string[] {
  return recordsToRead.map((record) => JSON.stringify(record));
}

function isType(record: TestRecord, type: string, subtype: string | undefined): boolean {
  return record.type === type && (subtype === undefined || record.payload['type'] === subtype);
}

/** The first record of a type (and payload type), failing the test when there is none. */
export function select(
  recordsToRead: readonly TestRecord[],
  type: string,
  subtype?: string,
): TestRecord {
  const record = recordsToRead.find((candidate) => isType(candidate, type, subtype));
  assert(record, `missing ${type}.${subtype ?? '*'}`);
  return record;
}

/** Every record of a type (and payload type), in order. */
export function selectAll(
  recordsToRead: readonly TestRecord[],
  type: string,
  subtype?: string,
): TestRecord[] {
  return recordsToRead.filter((candidate) => isType(candidate, type, subtype));
}

/** Every `CommandExecution` item-completed event, in order. */
export function commandEvents(recordsToRead: readonly TestRecord[]): TestRecord[] {
  return selectAll(recordsToRead, 'event_msg', 'item_completed').filter(
    (record) => object(record.payload['item'])['type'] === 'CommandExecution',
  );
}

/**
 * The expected `RolloutEvidence.resumedCommandOutputs`, derived from the
 * records: the aggregated output of each `CommandExecution` item the resumed
 * turn recorded, in order. Fails the test when there is none, so a comparison
 * against it never passes as two empty lists.
 */
export function resumedCommandOutputsIn(recordsToRead: readonly TestRecord[]): FixtureValue[] {
  const outputs = commandEvents(recordsToRead)
    .filter((record) => record.payload['turn_id'] === RESUMED_TURN_ID)
    .map((record) => object(record.payload['item'])['aggregated_output']);
  assert(outputs.length > 0, 'the resumed turn recorded no command');
  return outputs;
}

/** The resumed turn's context record. */
export function resumedTurnContextRecord(recordsToRead: readonly TestRecord[]): TestRecord {
  const contexts = selectAll(recordsToRead, 'turn_context');
  assert.equal(contexts.length, 2);
  return contexts[1];
}

/** The resumed turn's context payload. */
export function resumedContext(recordsToRead: readonly TestRecord[]): FixtureObject {
  return resumedTurnContextRecord(recordsToRead).payload;
}

/** Read the records, failing the test with the refusal's kind when the reader refuses them. */
export function expectRead(recordsToRead: readonly TestRecord[]): RolloutEvidence {
  const result = readRollout(lines(recordsToRead));
  assert(result.ok, `rollout rejected: ${result.ok ? 'none' : JSON.stringify(result.error)}`);
  return result.value;
}
