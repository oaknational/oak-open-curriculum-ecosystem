import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { readRollout, type RecordedTurnContext } from './index.js';
import {
  commandEvents,
  expectRead,
  lines,
  object,
  records,
  resumedCommandOutputsIn,
  resumedContext,
  resumedTurnContextRecord,
  RESUMED_TURN_ID,
  select,
  selectAll,
  type FixtureObject,
  type TestRecord,
} from './test-helpers/rollout-records.js';

/**
 * The reader over the recorded 0.157.0 rollout: the two turn contexts, the
 * applied settings, the record order, and the evidence it hands the verdict.
 * The code-mode calls and their outputs are in code-mode-output.unit.test.ts.
 */

describe('readRollout', () => {
  it('reads the two turn contexts and the resumed turn command outputs, nothing else', () => {
    const recorded = records();
    const evidence = expectRead(recorded);
    const resumed: RecordedTurnContext = evidence.turns[1];
    expect(evidence.threadId).toBe(select(recorded, 'session_meta').payload['id']);
    expect(evidence.turns.map((turn) => turn.turnId)).toEqual(
      selectAll(recorded, 'event_msg', 'task_started').map((record) => record.payload['turn_id']),
    );
    expect(resumed.permissionProfile).toEqual(resumedContext(recorded)['permission_profile']);
    expect(evidence.turns[0].effort).toBeUndefined();
    expect(evidence.resumedCommandOutputs).toEqual(resumedCommandOutputsIn(recorded));
  });

  it('reads a resumed turn whose program ran no command as holding no command output', () => {
    const recorded = records();
    const resumedCommands = new Set(
      commandEvents(recorded).filter((event) => event.payload['turn_id'] === RESUMED_TURN_ID),
    );
    const withoutResumedCommands = recorded.filter((record) => !resumedCommands.has(record));
    expect(expectRead(withoutResumedCommands).resumedCommandOutputs).toEqual([]);
  });

  it.each<{ record: TestRecord; recordType: string }>([
    {
      record: {
        type: 'event_msg',
        payload: { type: 'item_completed', item: { type: 'Reasoning' } },
      },
      recordType: 'event_msg.item_completed.Reasoning',
    },
    {
      record: { type: 'response_item', payload: { type: 'reasoning' } },
      recordType: 'response_item.reasoning',
    },
  ])('accepts $recordType, a recorded type this run did not emit', ({ record }) => {
    const candidate = records();
    candidate.splice(candidate.indexOf(resumedTurnContextRecord(candidate)) + 1, 0, record);
    expect(expectRead(candidate).resumedCommandOutputs).toEqual(resumedCommandOutputsIn(candidate));
  });

  it('rejects an unknown top-level type and an invalid session id', () => {
    const unknownType = records();
    unknownType.splice(8, 0, { type: 'future_record', payload: {} });
    expect(readRollout(lines(unknownType))).toEqual({
      ok: false,
      error: { kind: 'unknown-record-type', line: 9, recordType: 'future_record' },
    });

    const invalidId = records();
    select(invalidId, 'session_meta').payload['id'] = 'not-a-thread';
    expect(readRollout(lines(invalidId))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record', line: 1 },
    });
  });

  it.each<{ record: TestRecord; recordType: string }>([
    {
      record: { type: 'event_msg', payload: { type: 'future_event' } },
      recordType: 'event_msg.future_event',
    },
    {
      record: {
        type: 'event_msg',
        payload: { type: 'item_completed', item: { type: 'FutureItem' } },
      },
      recordType: 'event_msg.item_completed.FutureItem',
    },
    {
      record: { type: 'response_item', payload: { type: 'future_output' } },
      recordType: 'response_item.future_output',
    },
  ])('rejects unknown nested type $recordType', ({ record, recordType }) => {
    const candidate = records();
    candidate.splice(8, 0, record);
    expect(readRollout(lines(candidate))).toEqual({
      ok: false,
      error: { kind: 'unknown-record-type', line: 9, recordType },
    });
  });

  it('reports invalid JSON and a repeated session header', () => {
    const malformed = lines(records());
    malformed.splice(1, 0, '{invalid');
    expect(readRollout(malformed)).toEqual({
      ok: false,
      error: { kind: 'invalid-json', line: 2 },
    });

    const repeated = records();
    repeated.push(structuredClone(select(repeated, 'session_meta')));
    expect(readRollout(lines(repeated))).toEqual({
      ok: false,
      error: { kind: 'invalid-session-count', count: 2 },
    });
  });

  it('rejects a session header after the first event', () => {
    const late = records();
    const session = late.shift();
    assert(session);
    late.splice(1, 0, session);
    expect(readRollout(lines(late))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', line: 1 },
    });
  });

  it('rejects missing context and command-output fields', () => {
    const missingProfile = records();
    delete resumedContext(missingProfile)['permission_profile'];
    expect(readRollout(lines(missingProfile))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record' },
    });

    const missingEventOutput = records();
    const [event] = commandEvents(missingEventOutput);
    assert(event);
    delete object(event.payload['item'])['aggregated_output'];
    expect(readRollout(lines(missingEventOutput))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record' },
    });
  });

  it('records changed policy values when settings and turn context agree', () => {
    const changed = records();
    const context = resumedContext(changed);
    const profile = object(structuredClone(context['permission_profile']));
    const fileSystem = object(profile['file_system']);
    const entries = fileSystem['entries'];
    assert(Array.isArray(entries));
    object(entries[0])['access'] = 'write';
    context['permission_profile'] = profile;
    context['approval_policy'] = 'on-request';
    context['sandbox_policy'] = { type: 'workspace-write' };
    for (const record of selectAll(changed, 'event_msg', 'thread_settings_applied')) {
      const settings = object(record.payload['thread_settings']);
      settings['permission_profile'] = structuredClone(profile);
      settings['approval_policy'] = 'on-request';
    }
    const evidence = expectRead(changed);
    expect(evidence.turns[1].permissionProfile).toMatchObject({
      file_system: { entries: [{ access: 'write' }] },
    });
    expect(evidence.turns[1].approvalPolicy).toBe('on-request');
    expect(evidence.turns[1].sandboxPolicy.type).toBe('workspace-write');
  });

  it('records the reasoning effort when settings and turn context agree', () => {
    const candidate = records();
    resumedContext(candidate)['effort'] = 'xhigh';
    for (const record of selectAll(candidate, 'event_msg', 'thread_settings_applied')) {
      object(record.payload['thread_settings'])['reasoning_effort'] = 'xhigh';
    }
    expect(expectRead(candidate).turns[1].effort).toBe('xhigh');
  });

  it.each<{ profile: FixtureObject }>([
    { profile: { type: 'disabled' } },
    { profile: { type: 'managed', file_system: { type: 'unrestricted' }, network: 'enabled' } },
    { profile: { type: 'external', network: 'enabled' } },
  ])('preserves permissive profile $profile.type', ({ profile }) => {
    const candidate = records();
    resumedContext(candidate)['permission_profile'] = profile;
    for (const record of selectAll(candidate, 'event_msg', 'thread_settings_applied')) {
      object(record.payload['thread_settings'])['permission_profile'] = structuredClone(profile);
    }
    expect(expectRead(candidate).turns[1].permissionProfile).toEqual(profile);
  });

  it('preserves the danger-full-access sandbox policy', () => {
    const candidate = records();
    const policy = { type: 'danger-full-access' };
    resumedContext(candidate)['sandbox_policy'] = policy;
    expect(expectRead(candidate).turns[1].sandboxPolicy).toEqual(policy);
  });

  it('preserves a writable unknown special path when settings and context agree', () => {
    const candidate = records();
    const context = resumedContext(candidate);
    const profile = object(structuredClone(context['permission_profile']));
    const fileSystem = object(profile['file_system']);
    const entries = fileSystem['entries'];
    assert(Array.isArray(entries));
    entries.push({
      path: { type: 'special', value: { kind: 'unknown', path: 'cache', subpath: 'logs' } },
      access: 'write',
    });
    context['permission_profile'] = profile;
    for (const record of selectAll(candidate, 'event_msg', 'thread_settings_applied')) {
      object(record.payload['thread_settings'])['permission_profile'] = structuredClone(profile);
    }
    expect(expectRead(candidate).turns[1].permissionProfile).toEqual(profile);
  });

  it('rejects mismatched or missing applied settings', () => {
    const mismatch = records();
    const settings = object(
      select(mismatch, 'event_msg', 'thread_settings_applied').payload['thread_settings'],
    );
    settings['approval_policy'] = 'on-request';
    expect(readRollout(lines(mismatch))).toMatchObject({
      ok: false,
      error: { kind: 'applied-settings-mismatch' },
    });

    const absent = records().filter(
      (record) => record.payload['type'] !== 'thread_settings_applied',
    );
    expect(readRollout(lines(absent))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'resumed turn_context lacks applied thread settings',
      },
    });

    const foreignThread = records();
    select(foreignThread, 'event_msg', 'thread_settings_applied').payload['thread_id'] =
      '99999999-9999-4999-8999-999999999999';
    expect(readRollout(lines(foreignThread))).toMatchObject({
      ok: false,
      error: { kind: 'settings-thread-id-mismatch' },
    });

    const missingThread = records();
    delete select(missingThread, 'event_msg', 'thread_settings_applied').payload['thread_id'];
    expect(readRollout(lines(missingThread))).toMatchObject({
      ok: false,
      error: { kind: 'settings-thread-id-mismatch' },
    });
  });
});

describe('readRollout order', () => {
  it('rejects a duplicate turn context and a command from another thread', () => {
    const duplicate = records();
    const firstContext = select(duplicate, 'turn_context');
    duplicate.splice(duplicate.indexOf(firstContext) + 1, 0, structuredClone(firstContext));
    expect(readRollout(lines(duplicate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'turn_context has no active turn or is duplicated',
      },
    });

    const foreignCommand = records();
    const [foreign] = commandEvents(foreignCommand);
    assert(foreign);
    foreign.payload['thread_id'] = '99999999-9999-4999-8999-999999999999';
    expect(readRollout(lines(foreignCommand))).toMatchObject({
      ok: false,
      error: { kind: 'command-thread-id-mismatch' },
    });

    const missingThread = records();
    const [unthreaded] = commandEvents(missingThread);
    assert(unthreaded);
    delete unthreaded.payload['thread_id'];
    expect(readRollout(lines(missingThread))).toMatchObject({
      ok: false,
      error: { kind: 'command-thread-id-mismatch' },
    });
  });

  it('rejects a turn context whose id differs from the active turn', () => {
    const candidate = records();
    select(candidate, 'turn_context').payload['turn_id'] = '44444444-4444-4444-8444-444444444444';
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'turn_context turn id differs from task_started',
      },
    });
  });

  it('rejects a CommandExecution after its turn completes', () => {
    const candidate = records();
    const [event] = commandEvents(candidate);
    assert(event);
    candidate.splice(candidate.indexOf(event), 1);
    candidate.push(event);
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'CommandExecution has no matching active context',
      },
    });
  });

  it('rejects an opening-turn CommandExecution that lands inside the resumed turn', () => {
    const candidate = records();
    const [opening] = commandEvents(candidate);
    assert(opening);
    candidate.splice(candidate.indexOf(opening), 1);
    candidate.splice(candidate.indexOf(resumedTurnContextRecord(candidate)) + 1, 0, opening);
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'CommandExecution has no matching active context',
      },
    });
  });

  it('rejects settings applied outside the gap between turns', () => {
    const candidate = records();
    candidate.push(structuredClone(select(candidate, 'event_msg', 'thread_settings_applied')));
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'thread settings were not applied between turns',
      },
    });
  });

  it('rejects a turn starting while another is active', () => {
    const candidate = records();
    const started = structuredClone(select(candidate, 'event_msg', 'task_started'));
    started.payload['turn_id'] = '44444444-4444-4444-8444-444444444444';
    candidate.splice(2, 0, started);
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', reason: 'a turn is already active' },
    });
  });

  it('rejects a repeated turn id', () => {
    const candidate = records();
    const starts = selectAll(candidate, 'event_msg', 'task_started');
    assert.equal(starts.length, 2);
    starts[1].payload['turn_id'] = starts[0].payload['turn_id'];
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', reason: 'task_started repeats a turn id' },
    });
  });

  it('rejects an unknown permission profile and unsupported approval policy', () => {
    const unknownProfile = records();
    const profile = object(resumedContext(unknownProfile)['permission_profile']);
    profile['extra'] = true;
    expect(readRollout(lines(unknownProfile))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record' },
    });

    const unsupportedApproval = records();
    resumedContext(unsupportedApproval)['approval_policy'] = 'on-failure';
    expect(readRollout(lines(unsupportedApproval))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record' },
    });
  });

  it('rejects an extra turn and an incomplete turn', () => {
    const extra = records();
    const extraId = '44444444-4444-4444-8444-444444444444';
    const context = structuredClone(resumedContext(extra));
    context['turn_id'] = extraId;
    extra.push(
      { type: 'event_msg', payload: { type: 'task_started', turn_id: extraId } },
      { type: 'turn_context', payload: context },
      { type: 'event_msg', payload: { type: 'task_complete', turn_id: extraId } },
    );
    expect(readRollout(lines(extra))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-count', count: 3 },
    });

    const incomplete = records().slice(0, -1);
    expect(readRollout(lines(incomplete))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order' },
    });
  });

  it.each([
    'Warning: truncated output',
    'Total output lines: 200',
    '... 2097152 bytes omitted ...',
    '…153 tokens truncated…',
    '…153 chars truncated…',
  ])('treats command-output marker %s as inconclusive', (marker) => {
    const candidate = records();
    const [event] = commandEvents(candidate);
    assert(event);
    object(event.payload['item'])['aggregated_output'] = marker;
    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'truncated-output' },
    });
  });
});
