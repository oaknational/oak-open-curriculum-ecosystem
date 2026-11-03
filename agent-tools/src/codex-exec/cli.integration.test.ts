import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { runCodexExecCli } from './cli.js';
import {
  appendCommandTurn,
  commandItems,
  execOutputs,
  execRecords,
  refusalRecords,
  turnStarts,
} from './command-records/test-helpers/seat-fixtures.js';
import { lines, object } from './rollout/test-helpers/rollout-records.js';
import { makeIo } from './test-helpers/cli-io.js';

/**
 * The `codex-exec` command line, driven end to end through injected streams:
 * a JSONL stdin in, the exit code and the two output streams out.
 */

describe('runCodexExecCli — last-message', () => {
  it('writes the final agent message to stdout', async () => {
    const io = makeIo([
      JSON.stringify({ type: 'thread.started' }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Done!' } }),
    ]);
    const code = await runCodexExecCli({ command: 'last-message', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toBe('Done!\n');
  });

  it('exits 0 silently when no message found and --strict not set', async () => {
    const io = makeIo([JSON.stringify({ type: 'turn.completed' })]);
    const code = await runCodexExecCli({ command: 'last-message', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toBe('');
  });

  it('exits 1 with stderr message when no message found and --strict is set', async () => {
    const io = makeIo([JSON.stringify({ type: 'turn.completed' })]);
    const code = await runCodexExecCli({ command: 'last-message', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stderrText).toContain('no agent_message found');
  });

  it('emits JSON when --format json is set', async () => {
    const io = makeIo([
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Hi' } }),
    ]);
    const code = await runCodexExecCli({
      command: 'last-message',
      args: ['--format', 'json'],
      ...io,
    });
    expect(code).toBe(0);
    expect(JSON.parse(io.stdoutText)).toStrictEqual({ text: 'Hi' });
  });

  it('exits 2 when --format has an invalid value', async () => {
    const io = makeIo([
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Hi' } }),
    ]);
    const code = await runCodexExecCli({
      command: 'last-message',
      args: ['--format', 'xml'],
      ...io,
    });
    expect(code).toBe(2);
    expect(io.stderrText).toContain('--format must be text or json, got: xml');
  });

  it('exits 2 when --format is given without a value', async () => {
    const io = makeIo([
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Hi' } }),
    ]);
    const code = await runCodexExecCli({
      command: 'last-message',
      args: ['--format'],
      ...io,
    });
    expect(code).toBe(2);
    expect(io.stderrText).toContain('--format requires a value');
  });
});

describe('runCodexExecCli — command-records', () => {
  it('summarises a seat rollout as text, naming its turn', async () => {
    const records = execRecords();
    const [start] = turnStarts(records);
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toContain('command records:');
    expect(io.stdoutText).toContain(String(start?.payload['turn_id']));
  });

  it('summarises as JSON when --format json is set', async () => {
    const records = execRecords();
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({
      command: 'command-records',
      args: ['--format', 'json'],
      ...io,
    });
    expect(code).toBe(0);
    expect(JSON.parse(io.stdoutText)).toMatchObject({ turns: turnStarts(records).length });
  });

  it('exits 0 on an empty rollout without --strict', async () => {
    const io = makeIo([]);
    const code = await runCodexExecCli({ command: 'command-records', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toContain('0 turn(s)');
  });

  it('exits 1 under --strict when no turn started, with the summary still on stdout', async () => {
    const io = makeIo([]);
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stdoutText).toContain('command records:');
    expect(io.stderrText).toContain('no turn started');
  });

  it('exits 1 under --strict when a line could not be read', async () => {
    const records = execRecords();
    const io = makeIo([...lines(records), '{bad json']);
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stderrText).toContain('1 invalid line(s)');
  });

  it('exits 1 under --strict when a forbidden shape ran, with the summary still on stdout', async () => {
    const records = execRecords();
    appendCommandTurn(records, ['/bin/zsh', '-lc', 'git push origin HEAD']);
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stdoutText).toContain('flagged: line');
    expect(io.stderrText).toContain('1 forbidden shape(s) ran');
  });

  it('counts every forbidden shape that ran under --strict, two shapes in one record included', async () => {
    const records = execRecords();
    appendCommandTurn(records, ['/bin/zsh', '-lc', 'git add -A && git push origin HEAD']);
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stderrText).toContain('2 forbidden shape(s) ran');
  });

  it('exits 0 without --strict when a forbidden shape ran, reporting it on stdout', async () => {
    const records = execRecords();
    appendCommandTurn(records, ['git', 'add', '-A']);
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toContain('stage-whole-tree');
  });

  it('exits 1 under --strict when an exec call is unaccounted', async () => {
    const records = execRecords();
    const [output] = execOutputs(records);
    assert(output);
    records.splice(records.indexOf(output), 1);
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stderrText).toContain('1 unaccounted exec call(s)');
  });

  it('exits 0 under --strict on a rollout whose only shape was refused, reporting it', async () => {
    const io = makeIo(lines(refusalRecords()));
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toContain('refused in turn');
    expect(io.stderrText).toBe('');
  });

  it('exits 1 under --strict when an evidence record could not be read', async () => {
    const records = execRecords();
    const [first] = commandItems(records);
    object(first?.payload['item'])['status'] = 'nonce-2b90';
    const io = makeIo(lines(records));
    const code = await runCodexExecCli({ command: 'command-records', args: ['--strict'], ...io });
    expect(code).toBe(1);
    expect(io.stderrText).toContain('1 malformed evidence record(s)');
    expect(io.stderrText).not.toContain('nonce-2b90');
  });

  it('exits 2 when --format has an invalid value', async () => {
    const io = makeIo(lines(execRecords()));
    const code = await runCodexExecCli({
      command: 'command-records',
      args: ['--format', 'yaml'],
      ...io,
    });
    expect(code).toBe(2);
    expect(io.stderrText).toContain('--format must be text or json, got: yaml');
  });
});

describe('runCodexExecCli — help and errors', () => {
  it('prints usage naming both commands', async () => {
    const io = makeIo();
    const code = await runCodexExecCli({ command: 'help', args: [], ...io });
    expect(code).toBe(0);
    expect(io.stdoutText).toContain('last-message');
    expect(io.stdoutText).toContain('command-records');
  });

  it('prints usage and exits 0 when command is undefined', async () => {
    const io = makeIo();
    const code = await runCodexExecCli({ command: undefined, args: [], ...io });
    expect(code).toBe(0);
  });

  it('exits 2 for an unknown command', async () => {
    const io = makeIo();
    const code = await runCodexExecCli({ command: 'frobnicate', args: [], ...io });
    expect(code).toBe(2);
    expect(io.stderrText).toContain('unknown command: frobnicate');
  });
});
