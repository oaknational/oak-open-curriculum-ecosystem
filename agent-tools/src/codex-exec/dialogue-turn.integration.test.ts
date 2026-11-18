import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';
import { parseDialogueId, type CleanupRow, type DialogueId } from './cleanup-row.js';
import {
  executeTurn,
  type CodexCall,
  type TurnContext,
  type TurnError,
  type TurnPorts,
  type TurnRequest,
} from './dialogue-turn.js';
import type { ResolvedBinary } from './gate.js';
import { buildChildEnv, buildOpenArgv, buildResumeArgv } from './envelope.js';
import type { CodexRun } from './turn-verdict.js';

const THREAD = '01a0cfaf-7914-72e2-afe7-fb2d0938eb94';
const OTHER_THREAD = '01a0cfc3-0f0d-7980-bded-63fabd607a2f';
const NOW = '2026-09-24T16:00:00.000Z';
const LATER = '2026-09-24T16:04:00.000Z';
const DIALOGUE = 'dlg-20260924-ab12';

function threadId(raw = THREAD): ThreadId {
  const parsed = parseThreadId(raw);
  if (!parsed.ok) {
    return expect.unreachable('fixture thread id must parse');
  }
  return parsed.value;
}

function dialogueId(raw = DIALOGUE): DialogueId {
  const parsed = parseDialogueId(raw);
  if (!parsed.ok) {
    return expect.unreachable('fixture dialogue id must parse');
  }
  return parsed.value;
}

/** The binary as the caller resolved it: its version and real path. */
const BINARY: ResolvedBinary = { cliVersion: '0.156.1', executablePath: '/codex-slot' };

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

const open = (dialogue = DIALOGUE): TurnRequest => ({
  kind: 'open',
  dialogueId: dialogueId(dialogue),
  prompt: 'packet',
  timeoutMs: 5000,
});
const resume = (): TurnRequest => ({
  kind: 'resume',
  thread: threadId(),
  prompt: 'next packet',
  timeoutMs: 7000,
});

function jsonl(...events: readonly object[]): string {
  return events.map((event) => JSON.stringify(event)).join('\n');
}

const started = (id: string) => ({ type: 'thread.started', thread_id: id });
const turnStarted = { type: 'turn.started' };
const reply = { type: 'item.completed', item: { type: 'agent_message', text: 'reply' } };
const completed = { type: 'turn.completed', usage: {} };

function exited(stdout: string, code = 0): CodexRun {
  return { kind: 'exited', code, stdout, stderr: '' };
}

/**
 * A whole turn on the given thread, as `codex exec --json` emits it.
 */
function repliedOn(thread: string): CodexRun {
  return exited(jsonl(started(thread), turnStarted, reply, completed));
}

/**
 * An in-memory cleanup map: the rows it holds.
 */
function cleanupMap(): {
  readonly rows: CleanupRow[];
  readonly appendCleanupRow: TurnPorts['appendCleanupRow'];
} {
  const rows: CleanupRow[] = [];
  return {
    rows,
    appendCleanupRow: (row) => {
      rows.push(row);
      return ok(undefined);
    },
  };
}

/** A cleanup map that refuses every row, as a full disk or a read-only file would. */
const refuseEveryRow: TurnPorts['appendCleanupRow'] = () => err('the cleanup map is not writable');

/**
 * Ports whose root check returns one constant result, whose runner returns
 * one constant run, whose clock reads one instant, and whose cleanup map is
 * the given one. The root check and the runner record what they were given.
 */
function portsReturning(
  run: CodexRun,
  root: Result<void, string> = ok(undefined),
  appendCleanupRow: TurnPorts['appendCleanupRow'] = cleanupMap().appendCleanupRow,
): TurnPorts & { readonly checkedRoots: string[]; readonly calls: CodexCall[] } {
  const checkedRoots: string[] = [];
  const calls: CodexCall[] = [];
  return {
    checkedRoots,
    calls,
    checkRoot: (path) => {
      checkedRoots.push(path);
      return root;
    },
    runCodex: (call) => {
      calls.push(call);
      return run;
    },
    now: () => new Date(NOW),
    appendCleanupRow,
  };
}

function rowFor(thread: string): CleanupRow {
  return { dialogue_id: dialogueId(), thread_id: threadId(thread), created_at: NOW };
}

/** The counted verdict of a whole turn on `THREAD`. */
const counted = {
  ok: true,
  value: { threadId: THREAD, message: 'reply', messages: ['reply'], commandExecutions: [] },
};

describe('executeTurn', () => {
  it.each<[string, () => TurnRequest, readonly string[]]>([
    ['opens a thread', open, buildOpenArgv('/root-slot', context.modelPins)],
    ['resumes the requested thread', resume, buildResumeArgv(threadId(), context.modelPins)],
  ])(
    '%s inside the envelope, from the checked instrument root, with the prompt on stdin',
    (_label, makeRequest, argv) => {
      const request = makeRequest();
      const ports = portsReturning(repliedOn(THREAD));
      const verdict = executeTurn(request, context, BINARY, ports);
      expect(ports.checkedRoots).toStrictEqual(['/root-slot']);
      expect(ports.calls).toStrictEqual([
        {
          executable: BINARY.executablePath,
          argv,
          cwd: '/root-slot',
          env: buildChildEnv(context.childEnvInputs),
          stdin: request.prompt,
          timeoutMs: request.timeoutMs,
        },
      ]);
      expect(verdict).toStrictEqual({
        ok: true,
        value: { threadId: THREAD, message: 'reply', messages: ['reply'], commandExecutions: [] },
      });
    },
  );

  it('refuses a resumed turn that Codex answers on another thread', () => {
    const ports = portsReturning(repliedOn(OTHER_THREAD));
    const verdict = executeTurn(resume(), context, BINARY, ports);
    expect(verdict).toMatchObject({ ok: false, error: { kind: 'thread-mismatch' } });
  });

  it('starts no Codex process when the instrument root is not fit for a spawn', () => {
    const map = cleanupMap();
    const ports = portsReturning(
      repliedOn(THREAD),
      err('root holds an entry: .logs'),
      map.appendCleanupRow,
    );
    const verdict = executeTurn(open(), context, BINARY, ports);
    const notReady: TurnError = { kind: 'root-not-ready', reason: 'root holds an entry: .logs' };
    expect(verdict).toStrictEqual({ ok: false, error: notReady });
    expect(map.rows).toStrictEqual([]);
  });
});

describe('executeTurn cleanup rows', () => {
  it('writes one row naming the dialogue, the thread and the time, when an opening turn counts', () => {
    const map = cleanupMap();
    const verdict = executeTurn(
      open('probe'),
      context,
      BINARY,
      portsReturning(repliedOn(THREAD), ok(undefined), map.appendCleanupRow),
    );
    expect(verdict).toStrictEqual(counted);
    expect(map.rows).toStrictEqual([{ dialogue_id: 'probe', thread_id: THREAD, created_at: NOW }]);
  });

  it('dates each row from when the turn started, before Codex ran', () => {
    const map = cleanupMap();
    let clock = new Date(NOW);
    const ports: TurnPorts = {
      checkRoot: () => ok(undefined),
      runCodex: () => {
        clock = new Date(LATER);
        return repliedOn(THREAD);
      },
      now: () => clock,
      appendCleanupRow: map.appendCleanupRow,
    };
    executeTurn(open(), context, BINARY, ports);
    expect(map.rows).toStrictEqual([rowFor(THREAD)]);
  });

  it.each<[string, CodexRun, TurnError['kind']]>([
    [
      'a failed turn',
      exited(
        jsonl(started(THREAD), turnStarted, { type: 'turn.failed', error: { message: 'quota' } }),
        1,
      ),
      'turn-failed',
    ],
    [
      'a stream that ends before its turn completes',
      exited(jsonl(started(THREAD), turnStarted)),
      'malformed-turn',
    ],
    [
      'a non-zero exit',
      exited(jsonl(started(THREAD), turnStarted, reply, completed), 2),
      'nonzero-exit',
    ],
    [
      'an item the envelope should make impossible',
      exited(
        jsonl(
          started(THREAD),
          turnStarted,
          { type: 'item.completed', item: { type: 'file_change', changes: [] } },
          completed,
        ),
      ),
      'unexpected-item',
    ],
    [
      'an unrecognised line',
      exited(`${jsonl(started(THREAD), turnStarted, reply, completed)}\nnot json`),
      'unrecognised-output',
    ],
    [
      'a turn with no reply',
      exited(jsonl(started(THREAD), turnStarted, completed)),
      'no-agent-message',
    ],
    ...(['timeout', 'overflow', 'signal'] as const).map<[string, CodexRun, TurnError['kind']]>(
      (reason) => [
        `a run killed by ${reason}`,
        { kind: 'killed', reason, stdout: jsonl(started(THREAD), turnStarted), stderr: '' },
        'killed',
      ],
    ),
  ])('writes the row on %s, and keeps the verdict', (_label, run, kind) => {
    const map = cleanupMap();
    const verdict = executeTurn(
      open(),
      context,
      BINARY,
      portsReturning(run, ok(undefined), map.appendCleanupRow),
    );
    expect(verdict).toMatchObject({ ok: false, error: { kind } });
    expect(map.rows).toStrictEqual([rowFor(THREAD)]);
  });

  it.each<[string, CodexRun, readonly string[]]>([
    [
      'one row for a thread started twice',
      exited(jsonl(started(THREAD), started(THREAD), turnStarted, reply, completed)),
      [THREAD],
    ],
    [
      'one row per distinct thread',
      exited(jsonl(started(OTHER_THREAD), started(THREAD), turnStarted, reply, completed)),
      [OTHER_THREAD, THREAD],
    ],
    [
      'no row for an id that is not a thread id',
      exited(jsonl(started('not-a-uuid'), started(THREAD), turnStarted, reply, completed)),
      [THREAD],
    ],
    ['no row when no thread started', exited(jsonl(turnStarted, reply, completed)), []],
    ['no row when Codex never launched', { kind: 'unlaunchable', message: 'ENOENT' }, []],
  ])('writes %s', (_label, run, threads) => {
    const map = cleanupMap();
    executeTurn(open(), context, BINARY, portsReturning(run, ok(undefined), map.appendCleanupRow));
    expect(map.rows).toStrictEqual(threads.map(rowFor));
  });

  it.each<[string, CodexRun]>([
    ['the requested thread', repliedOn(THREAD)],
    ['a stray thread', repliedOn(OTHER_THREAD)],
  ])('writes no row for a resumed turn on %s', (_label, run) => {
    const map = cleanupMap();
    executeTurn(
      resume(),
      context,
      BINARY,
      portsReturning(run, ok(undefined), map.appendCleanupRow),
    );
    expect(map.rows).toStrictEqual([]);
  });

  it('fails a turn that counted when its row cannot be written, keeping the verdict', () => {
    const verdict = executeTurn(
      open(),
      context,
      BINARY,
      portsReturning(repliedOn(THREAD), ok(undefined), refuseEveryRow),
    );
    expect(verdict).toStrictEqual({
      ok: false,
      error: {
        kind: 'cleanup-row-unwritten',
        threadIds: [THREAD],
        reason: 'the cleanup map is not writable',
        turn: counted,
      },
    });
  });

  it('keeps the reason a failed turn did not count beside its unwritten row', () => {
    const run = exited(
      jsonl(
        started(THREAD),
        turnStarted,
        { type: 'item.completed', item: { type: 'file_change', changes: [] } },
        completed,
      ),
    );
    const verdict = executeTurn(
      open(),
      context,
      BINARY,
      portsReturning(run, ok(undefined), refuseEveryRow),
    );
    expect(verdict).toStrictEqual({
      ok: false,
      error: {
        kind: 'cleanup-row-unwritten',
        threadIds: [THREAD],
        reason: 'the cleanup map is not writable',
        turn: { ok: false, error: { kind: 'unexpected-item', itemTypes: ['file_change'] } },
      },
    });
  });

  it('tries every row, and names every thread whose row it could not write', () => {
    const run = exited(
      jsonl(started(OTHER_THREAD), started(THREAD), turnStarted, reply, completed),
    );
    const verdict = executeTurn(
      open(),
      context,
      BINARY,
      portsReturning(run, ok(undefined), refuseEveryRow),
    );
    expect(verdict).toMatchObject({
      ok: false,
      error: { kind: 'cleanup-row-unwritten', threadIds: [OTHER_THREAD, THREAD] },
    });
  });
});
