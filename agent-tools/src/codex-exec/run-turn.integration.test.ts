import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseDialogueId, type DialogueId } from './cleanup-row.js';
import type { CodexCall, TurnContext, TurnRequest } from './dialogue-turn.js';
import { envelopeDigest } from './envelope.js';
import { PASS_RECORD_MAX_AGE_MS, type PassRecordRead, type ResolvedBinary } from './gate.js';
import type { PassRecord } from './pass-record.js';
import { PROBE_CONTRACT_VERSION } from './probe-contract.js';
import { runTurn, type BinaryUnresolved, type GatedTurnPorts } from './run-turn.js';
import type { CodexRun } from './turn-verdict.js';

const THREAD = '01a0cfaf-7914-72e2-afe7-fb2d0938eb94';

/** The clock every turn in this file reads. */
const NOW = '2026-09-24T16:00:00.000Z';

const context: TurnContext = {
  instrumentRoot: '/root-slot',
  childEnvInputs: {
    instrumentHome: '/home-slot',
    instrumentCodexHome: '/codex-home-slot',
    user: 'user-slot',
    lang: 'lang-slot',
    tmpdir: '/tmp-slot',
  },
  modelPins: { model: 'model-slot', effort: 'high' },
};

const binary: ResolvedBinary = {
  cliVersion: '0.156.1',
  executablePath: '/opt/codex/releases/0.156.1/bin/codex',
};

/** The record a probe that passed on this binding writes. */
const record: PassRecord = {
  cliVersion: binary.cliVersion,
  executablePath: binary.executablePath,
  envelopeDigest: envelopeDigest(context.modelPins),
  probeContractVersion: PROBE_CONTRACT_VERSION,
  passedAt: '2026-09-24T11:00:00Z',
  evidence: ['rule 9: the nonce, no WRITE-OK'],
};

function dialogueId(): DialogueId {
  const parsed = parseDialogueId('dlg-20260924-ab12');
  if (!parsed.ok) {
    return expect.unreachable('fixture dialogue id must parse');
  }
  return parsed.value;
}

const request: TurnRequest = {
  kind: 'open',
  dialogueId: dialogueId(),
  prompt: 'packet',
  timeoutMs: 5000,
};

/** A whole turn, as `codex exec --json` emits it: a full success. */
const replied: CodexRun = {
  kind: 'exited',
  code: 0,
  stdout: [
    { type: 'thread.started', thread_id: THREAD },
    { type: 'turn.started' },
    { type: 'item.completed', item: { type: 'agent_message', text: 'reply' } },
    { type: 'turn.completed', usage: {} },
  ]
    .map((event) => JSON.stringify(event))
    .join('\n'),
  stderr: '',
};

/**
 * Ports whose record read, binary resolution and runner each return one
 * constant; the runner would always succeed, and records what it was given.
 */
/** The gated ports, plus what each one was asked. */
type RecordingPorts = GatedTurnPorts & {
  readonly calls: CodexCall[];
  readonly homesRead: string[];
  readonly resolutions: Result<ResolvedBinary, BinaryUnresolved>[];
};

function ports(
  read: PassRecordRead,
  resolved: Result<ResolvedBinary, BinaryUnresolved> = ok(binary),
): RecordingPorts {
  const calls: CodexCall[] = [];
  const homesRead: string[] = [];
  const resolutions: Result<ResolvedBinary, BinaryUnresolved>[] = [];
  return {
    calls,
    homesRead,
    resolutions,
    readPassRecord: (codexHome) => {
      homesRead.push(codexHome);
      return read;
    },
    resolveBinary: () => {
      resolutions.push(resolved);
      return resolved;
    },
    checkRoot: () => ok(undefined),
    runCodex: (call) => {
      calls.push(call);
      return replied;
    },
    now: () => new Date(NOW),
    appendCleanupRow: () => ok(undefined),
  };
}

describe('runTurn', () => {
  it('runs the turn on the binary the gate matched, when a probe passed on this binding', () => {
    const turnPorts = ports({ kind: 'present', value: record });
    expect(runTurn(request, context, turnPorts)).toStrictEqual({
      ok: true,
      value: { threadId: THREAD, message: 'reply', messages: ['reply'], commandExecutions: [] },
    });
    expect(turnPorts.calls.map((call) => call.executable)).toStrictEqual([binary.executablePath]);
    expect(turnPorts.homesRead).toStrictEqual([context.childEnvInputs.instrumentCodexHome]);
    expect(turnPorts.resolutions).toStrictEqual([ok(binary)]);
  });

  it('starts no turn without a pass record, though the turn would succeed', () => {
    const turnPorts = ports({ kind: 'absent' });
    expect(runTurn(request, context, turnPorts)).toStrictEqual({
      ok: false,
      error: { kind: 'no-pass-record' },
    });
    expect(turnPorts.calls).toStrictEqual([]);
  });

  it('reads the record before it resolves the binary, so an empty home asks for a probe', () => {
    const turnPorts = ports(
      { kind: 'absent' },
      err({ kind: 'binary-unresolved', reason: 'not-found' }),
    );
    expect(runTurn(request, context, turnPorts)).toStrictEqual({
      ok: false,
      error: { kind: 'no-pass-record' },
    });
    expect(turnPorts.resolutions).toStrictEqual([]);
  });

  it('starts no turn when the binary cannot be resolved', () => {
    const unresolved: BinaryUnresolved = {
      kind: 'binary-unresolved',
      reason: 'version-unreadable',
    };
    const turnPorts = ports({ kind: 'present', value: record }, err(unresolved));
    expect(runTurn(request, context, turnPorts)).toStrictEqual({ ok: false, error: unresolved });
    expect(turnPorts.calls).toStrictEqual([]);
  });

  it.each([
    [
      'the CLI has updated since the probe',
      { ...binary, cliVersion: '0.157.0' },
      context,
      ['cliVersion'],
    ],
    [
      'a different codex binary answers to the name',
      { ...binary, executablePath: '/usr/local/bin/codex' },
      context,
      ['executablePath'],
    ],
    [
      'the model pins have changed since the probe',
      binary,
      { ...context, modelPins: { model: 'another-model', effort: 'high' } },
      ['envelopeDigest'],
    ],
  ] as const)('starts no turn when %s', (_label, resolved, turnContext, fields) => {
    const turnPorts = ports({ kind: 'present', value: record }, ok(resolved));
    expect(runTurn(request, turnContext, turnPorts)).toStrictEqual({
      ok: false,
      error: { kind: 'binding-mismatch', fields },
    });
    expect(turnPorts.calls).toStrictEqual([]);
  });

  it('starts no turn on a record that another version of the probe judged', () => {
    const judgedElsewhere: PassRecord = {
      ...record,
      probeContractVersion: PROBE_CONTRACT_VERSION + 1,
    };
    expect(
      runTurn(request, context, ports({ kind: 'present', value: judgedElsewhere })),
    ).toStrictEqual({
      ok: false,
      error: { kind: 'binding-mismatch', fields: ['probeContractVersion'] },
    });
  });

  it('starts no turn on a record past its age limit', () => {
    const stale: PassRecord = {
      ...record,
      passedAt: new Date(Date.parse(NOW) - PASS_RECORD_MAX_AGE_MS - 1).toISOString(),
    };
    expect(runTurn(request, context, ports({ kind: 'present', value: stale }))).toStrictEqual({
      ok: false,
      error: { kind: 'pass-record-expired' },
    });
  });

  it('starts no turn on a record dated after its own clock', () => {
    const early: PassRecord = {
      ...record,
      passedAt: new Date(Date.parse(NOW) + 1).toISOString(),
    };
    expect(runTurn(request, context, ports({ kind: 'present', value: early }))).toStrictEqual({
      ok: false,
      error: { kind: 'pass-record-from-the-future' },
    });
  });
});
