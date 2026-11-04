import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { lines, object } from '../rollout/test-helpers/rollout-records.js';

import { readCommandRecords } from './read-command-records.js';
import { renderSummary } from './summary.js';
import {
  APPENDED_TURN_ID,
  appendCommandTurn,
  commandItems,
  execRecords,
  HOME_PATH,
  lineOf,
} from './test-helpers/seat-fixtures.js';

describe('readCommandRecords flags the forbidden shapes the harness ran', () => {
  it('reads the recorded seat rollout as carrying no forbidden shape', () => {
    expect(readCommandRecords(lines(execRecords())).flagged).toStrictEqual([]);
  });

  it('flags a command run in a second turn, naming that turn and its line', () => {
    const records = execRecords();
    const base = commandItems(records).length;
    const event = appendCommandTurn(records, ['/bin/zsh', '-lc', 'git commit --amend --no-edit']);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged).toStrictEqual([
      {
        kind: 'executed',
        line: lineOf(records, event),
        turnId: APPENDED_TURN_ID,
        rendered: ['…', 'git commit --amend --<flag>'],
        hits: [{ kind: 'commit-rewrites-or-skips-hooks', token: '--amend' }],
      },
    ]);
    expect(summary.accounts.map((account) => account.executed)).toStrictEqual([base, 1]);
  });

  it('flags a shape that follows a redirection in the same command', () => {
    const records = execRecords();
    appendCommandTurn(records, ['/bin/zsh', '-lc', 'git add 2>&1 -A']);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged.map((entry) => entry.hits)).toStrictEqual([
      [{ kind: 'stage-whole-tree', token: '-A' }],
    ]);
  });

  it('does not flag a shape named only in a comment', () => {
    const records = execRecords();
    appendCommandTurn(records, ['/bin/zsh', '-lc', 'git commit -m tidy # never --no-verify']);
    expect(readCommandRecords(lines(records)).flagged).toStrictEqual([]);
  });

  it.each([
    { name: 'a shell running the script', argv: ['/bin/zsh', '-lc', 'git push origin HEAD'] },
    {
      name: 'a shell past its option cluster',
      argv: ['bash', '-euo', 'pipefail', '-c', 'git push origin HEAD'],
    },
    {
      name: 'a shell nested in a shell',
      argv: ['/bin/zsh', '-lc', "bash -c 'git push origin HEAD'"],
    },
    {
      name: 'three nested shells, the last the reader reads',
      argv: ['sh', '-c', `bash -c "zsh -c 'git push origin HEAD'"`],
    },
    { name: 'a shell behind sudo', argv: ['sudo', 'bash', '-c', 'git push origin HEAD'] },
    {
      name: 'a shell option after -c',
      argv: ['bash', '-c', '-o', 'posix', 'git push origin HEAD'],
    },
    { name: 'a plus-signed option after -c', argv: ['bash', '-c', '+x', 'git push origin HEAD'] },
    { name: 'a plus-signed -c cluster', argv: ['bash', '+xc', 'git push origin HEAD'] },
    {
      name: 'a dash-led script after a bare --',
      argv: ['bash', '-c', '--', '-x; git push origin HEAD'],
    },
    {
      name: 'a positional script the -c script evaluates',
      argv: ['bash', '-c', 'eval "$1"', '_', 'git push origin HEAD'],
    },
    {
      name: 'ssh after a word that only carries its name',
      argv: ['/bin/zsh', '-lc', "sudo -u ssh ssh host 'git push origin HEAD'"],
    },
    {
      name: 'ssh after a name exec gives it',
      argv: ['/bin/zsh', '-lc', "exec -a ssh ssh host 'git push origin HEAD'"],
    },
    {
      name: 'a shell after an assignment naming ssh',
      argv: ['/bin/zsh', '-lc', "GIT_SSH=/usr/bin/ssh bash -c 'git push origin HEAD'"],
    },
    { name: 'eval reading its operand', argv: ['eval', 'git push origin HEAD'] },
    { name: 'eval with unquoted operands', argv: ['eval', 'git', 'push', 'origin', 'HEAD'] },
    { name: 'ssh with unquoted operands', argv: ['ssh', 'host', 'git', 'push', 'origin', 'HEAD'] },
    {
      name: 'a shape before a later interpreter operand',
      argv: ['git', 'push', 'origin', 'HEAD', 'sh', '-c', 'echo a b'],
    },
    {
      name: 'a script word after an interpreter name that never ran it, read fail-closed',
      argv: ['sh', '-c', "echo bash -c 'git push origin HEAD'"],
    },
    { name: 'a command substitution', argv: ['sh', '-c', 'echo $(git push origin HEAD)'] },
    { name: 'a backtick substitution', argv: ['sh', '-c', 'echo `git push origin HEAD`'] },
    {
      name: 'a shape glued to a redirection',
      argv: ['sh', '-c', 'git add -A>/dev/null 2>&1'],
      kind: 'stage-whole-tree',
    },
    {
      name: 'a second command after a separator',
      argv: ['sh', '-c', 'echo one && git push origin HEAD'],
    },
  ])('reads the shape through $name', ({ argv, kind }) => {
    const records = execRecords();
    appendCommandTurn(records, argv);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged.flatMap((entry) => entry.hits.map((hit) => hit.kind))).toStrictEqual([
      kind ?? 'push-outside-the-bot',
    ]);
  });

  it.each([
    { name: 'a here-document body', argv: ['sh', '-c', "cat <<'EOF'\ngit push origin HEAD\nEOF"] },
    { name: 'a quoted argument', argv: ['sh', '-c', 'git commit -m "git push origin HEAD"'] },
    { name: 'a script that is only a comment', argv: ['sh', '-c', '# git push origin HEAD'] },
    { name: 'a script file, not a script', argv: ['bash', 'deploy.sh'] },
    { name: 'a one-word script operand', argv: ['bash', '-c', 'push'] },
    {
      name: 'a fourth nested shell, past the depth the reader reads',
      argv: ['sh', '-c', String.raw`bash -c "zsh -c \"dash -c 'git push origin HEAD'\""`],
    },
  ])('reads no shape in $name', ({ argv }) => {
    const records = execRecords();
    appendCommandTurn(records, argv);
    expect(readCommandRecords(lines(records)).flagged).toStrictEqual([]);
  });

  it('renders a shape found in a substitution body by allowlist and never the outer command', () => {
    const records = execRecords();
    const secret = 'token-nonce-9c2f';
    appendCommandTurn(records, [
      'sh',
      '-c',
      `git commit -m "${secret} $(git push origin ${secret})"`,
    ]);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged.map((entry) => entry.rendered)).toStrictEqual([
      ['…', '…', 'git push <arg> <arg>'],
    ]);
    for (const format of ['text', 'json'] as const) {
      expect(renderSummary(summary, format)).not.toContain(secret);
    }
  });

  it('reports two flagged commands in two turns with their lines ascending', () => {
    const records = execRecords();
    const [first] = commandItems(records);
    assert(first);
    object(first.payload['item'])['command'] = ['git', 'push', 'origin', 'HEAD'];
    const second = appendCommandTurn(records, ['git', 'add', '-A']);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged.map((entry) => entry.line)).toStrictEqual([
      lineOf(records, first),
      lineOf(records, second),
    ]);
    expect(summary.flagged.map((entry) => entry.hits[0]?.kind)).toStrictEqual([
      'push-outside-the-bot',
      'stage-whole-tree',
    ]);
  });

  it('reports two hits on one entry when one script runs two shapes', () => {
    const records = execRecords();
    appendCommandTurn(records, ['bash', '-lc', 'git add -A && git push']);
    const [entry] = readCommandRecords(lines(records)).flagged;
    assert(entry);
    expect(entry.hits.map((hit) => hit.kind)).toStrictEqual([
      'stage-whole-tree',
      'push-outside-the-bot',
    ]);
    expect(entry.rendered).toStrictEqual(['…', 'git add -A', 'git push']);
  });

  it('leaves a commit whose message carries a separator and a shape unflagged', () => {
    const records = execRecords();
    const base = commandItems(records).length;
    appendCommandTurn(records, ['sh', '-c', 'git commit -m "a && b" -m "git push"']);
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged).toStrictEqual([]);
    expect(summary.commands).toBe(base + 1);
  });

  it('elides the segments of a script that carry no shape', () => {
    const records = execRecords();
    const script = "git commit -F - <<'EOF'\nFix the auth path\nEOF\ngit push origin HEAD";
    appendCommandTurn(records, ['bash', '-lc', script]);
    const [entry] = readCommandRecords(lines(records)).flagged;
    assert(entry);
    expect(entry.rendered).toStrictEqual(['…', '…', 'git push <arg> <arg>']);
  });

  it('reads a here-document body naming a shape as data, not as a command that ran', () => {
    const records = execRecords();
    const script = "git commit -F - <<'EOF'\ngit push origin HEAD\nEOF";
    appendCommandTurn(records, ['bash', '-lc', script]);
    expect(readCommandRecords(lines(records)).flagged).toStrictEqual([]);
  });

  it('reads a declined item carrying a shape as refused, not as a command that ran', () => {
    const records = execRecords();
    const event = appendCommandTurn(records, ['git', 'push', 'origin', 'HEAD'], {
      status: 'declined',
    });
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged).toStrictEqual([
      {
        kind: 'refused',
        line: lineOf(records, event),
        turnId: APPENDED_TURN_ID,
        rendered: ['git push <arg> <arg>'],
        hits: [{ kind: 'push-outside-the-bot', token: 'push' }],
      },
    ]);
    expect(summary.accounts[1]).toMatchObject({ executed: 0, declined: 1 });
  });
});

describe('readCommandRecords flags what was typed into a running process', () => {
  it('reads a declined interaction carrying a shape as refused: the harness passed nothing on', () => {
    const records = execRecords();
    appendCommandTurn(records, ['git', 'status'], {
      source: 'unified_exec_interaction',
      status: 'declined',
      interaction_input: 'git push\n',
    });
    expect(readCommandRecords(lines(records)).flagged.map((entry) => entry.kind)).toStrictEqual([
      'refused',
    ]);
  });

  it('flags the interaction input, not the startup argv it repeats', () => {
    const records = execRecords();
    const base = commandItems(records).length;
    const event = appendCommandTurn(records, ['git', 'push', 'origin', 'HEAD'], {
      source: 'unified_exec_interaction',
      interaction_input: 'ls -la\n',
    });
    const clean = readCommandRecords(lines(records));
    expect(clean.flagged).toStrictEqual([]);
    expect(clean.commands).toBe(base);

    object(event.payload['item'])['interaction_input'] = 'git push origin HEAD\n';
    const summary = readCommandRecords(lines(records));
    expect(summary.flagged).toStrictEqual([
      {
        kind: 'interaction',
        line: lineOf(records, event),
        turnId: APPENDED_TURN_ID,
        rendered: ['git push <arg> <arg>'],
        hits: [{ kind: 'push-outside-the-bot', token: 'push' }],
      },
    ]);
    expect(summary.commands).toBe(base);
  });
});

describe('the summary never carries the command history', () => {
  const secrets = [
    HOME_PATH,
    '~/notes-nonce-9c04',
    'the secret message nonce-5b21',
    'git@github.com:org/repo-nonce-2d18.git',
    'KEY=nonce-3f7a',
  ];
  const records = execRecords();
  const [first] = commandItems(records);
  assert(first);
  const ownScript = object(first.payload['item'])['command'];
  assert(Array.isArray(ownScript));
  const ownLine = ownScript.at(-1);
  assert(typeof ownLine === 'string' && ownLine.length > 0);
  appendCommandTurn(records, [
    'KEY=nonce-3f7a',
    '/usr/bin/git',
    'commit',
    `-C${HOME_PATH}`,
    `--cwd=${HOME_PATH}`,
    '-m',
    'the secret message nonce-5b21',
    '--no-verify',
    'git@github.com:org/repo-nonce-2d18.git',
    '~/notes-nonce-9c04',
  ]);
  const summary = readCommandRecords(lines(records));
  const text = renderSummary(summary, 'text');
  const json = renderSummary(summary, 'json');

  it.each(secrets.map((secret) => ({ secret })))(
    'renders a flagged command without $secret, in text and in JSON',
    ({ secret }) => {
      expect(text).not.toContain(secret);
      expect(json).not.toContain(secret);
    },
  );

  it('renders a flagged command with its program, subcommand and flag names, in text and in JSON', () => {
    for (const kept of ['git', 'commit', '--no-verify', '-<flag>', 'KEY=<value>']) {
      expect(text).toContain(kept);
      expect(json).toContain(kept);
    }
    expect(text).toContain(APPENDED_TURN_ID);
  });

  it("renders none of an unflagged command's script", () => {
    expect(summary.flagged).toHaveLength(1);
    expect(text).not.toContain(ownLine);
    expect(json).not.toContain(ownLine);
  });
});
