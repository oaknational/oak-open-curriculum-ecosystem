import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { flagCommand, renderSegment } from './flag-command.js';
import { commandsOfText } from './shell-commands.js';
import { HOME_PATH } from './test-helpers/seat-fixtures.js';

/** The one segment a single command line yields. */
function segmentOf(line: string): readonly string[] {
  const [segment, ...rest] = commandsOfText(line);
  assert(segment);
  assert(rest.length === 0, 'one command line, one segment');
  return segment;
}

describe('flagCommand finds the forbidden shapes of the seat rules', () => {
  it.each([
    { line: 'git add -A', kind: 'stage-whole-tree' },
    { line: 'git add .', kind: 'stage-whole-tree' },
    { line: 'git add --all', kind: 'stage-whole-tree' },
    { line: 'git add -An', kind: 'stage-whole-tree' },
    { line: 'git add -- README.md .', kind: 'stage-whole-tree' },
    { line: 'git add -- .', kind: 'stage-whole-tree' },
    { line: 'git commit --amend --no-edit', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git commit --no-verify -F message.txt', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git commit -F message.txt --no-verify', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git commit -n', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git commit -an', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git push origin feat/example', kind: 'push-outside-the-bot' },
    { line: 'git push --force origin feat/example', kind: 'push-outside-the-bot' },
    { line: 'git push', kind: 'push-outside-the-bot' },
    { line: 'KEY=v git push', kind: 'push-outside-the-bot' },
    { line: 'env git push', kind: 'push-outside-the-bot' },
    { line: 'env KEY=v git push', kind: 'push-outside-the-bot' },
    { line: 'sudo git push', kind: 'push-outside-the-bot' },
    { line: 'sudo -u root git push', kind: 'push-outside-the-bot' },
    { line: 'nice -n 5 git push', kind: 'push-outside-the-bot' },
    { line: 'time git push', kind: 'push-outside-the-bot' },
    { line: 'command git push', kind: 'push-outside-the-bot' },
    { line: '/usr/bin/git push', kind: 'push-outside-the-bot' },
    { line: 'sudo --user root git push', kind: 'push-outside-the-bot' },
    { line: '{ git push', kind: 'push-outside-the-bot' },
    { line: '! git push', kind: 'push-outside-the-bot' },
    { line: 'if git push', kind: 'push-outside-the-bot' },
    { line: 'do git push $b', kind: 'push-outside-the-bot' },
    { line: 'git -C x commit --amend', kind: 'commit-rewrites-or-skips-hooks' },
    { line: 'git --git-dir=.git -c user.name=x commit -n', kind: 'commit-rewrites-or-skips-hooks' },
  ])('flags $line', ({ line, kind }) => {
    expect(flagCommand(segmentOf(line)).map((hit) => hit.kind)).toStrictEqual([kind]);
  });

  it.each([
    { line: '>/dev/null git push origin HEAD', kind: 'push-outside-the-bot' },
    { line: '> /dev/null git push origin HEAD', kind: 'push-outside-the-bot' },
    { line: '2>&1 git commit -n', kind: 'commit-rewrites-or-skips-hooks' },
    { line: '2>/dev/null git add -A', kind: 'stage-whole-tree' },
    { line: '>& 2 git push', kind: 'push-outside-the-bot' },
    { line: '&>> log git push', kind: 'push-outside-the-bot' },
    { line: "<<<'' git push", kind: 'push-outside-the-bot' },
    { line: "<<'' git push", kind: 'push-outside-the-bot' },
    { line: '>! git push', kind: 'push-outside-the-bot' },
    { line: '{fd}>/dev/null git push', kind: 'push-outside-the-bot' },
    { line: 'sudo {fd}>/dev/null git push', kind: 'push-outside-the-bot' },
    { line: '2<<EOF git push\nbody\nEOF', kind: 'push-outside-the-bot' },
    { line: 'sudo 2>/dev/null git push', kind: 'push-outside-the-bot' },
    { line: 'sudo >/dev/null -u root git push', kind: 'push-outside-the-bot' },
    { line: 'git 2>/dev/null push origin HEAD', kind: 'push-outside-the-bot' },
    { line: 'git -C . >/dev/null add -A', kind: 'stage-whole-tree' },
    { line: 'git > out push', kind: 'push-outside-the-bot' },
    { line: 'git -C 2>/dev/null . push origin HEAD', kind: 'push-outside-the-bot' },
    { line: 'git -C >/dev/null . add -A', kind: 'stage-whole-tree' },
    { line: 'git -C > out . push', kind: 'push-outside-the-bot' },
    { line: 'git -c 2>/dev/null x=y push', kind: 'push-outside-the-bot' },
    { line: 'git -C 2<<EOF . push\nbody\nEOF', kind: 'push-outside-the-bot' },
    { line: 'sudo -u >/dev/null root git push', kind: 'push-outside-the-bot' },
    { line: 'git commit 2> -- -n', kind: 'commit-rewrites-or-skips-hooks' },
    { line: "git commit -m '>' --amend", kind: 'commit-rewrites-or-skips-hooks' },
    { line: "git commit -m '>' -- -n", kind: 'commit-rewrites-or-skips-hooks' },
  ])('flags $line past its redirections', ({ line, kind }) => {
    expect(flagCommand(segmentOf(line)).map((hit) => hit.kind)).toStrictEqual([kind]);
  });

  it.each([
    { line: 'git --config-env core.x=ENV push origin HEAD', kind: 'push-outside-the-bot' },
    { line: 'git --attr-source HEAD push origin HEAD', kind: 'push-outside-the-bot' },
    { line: 'git --shallow-file f push', kind: 'push-outside-the-bot' },
    { line: 'env -P /usr/bin git push', kind: 'push-outside-the-bot' },
    { line: 'sudo -D /tmp git push', kind: 'push-outside-the-bot' },
    { line: '/usr/bin/time -o out git push', kind: 'push-outside-the-bot' },
    { line: 'git --no-pager log --grep push', kind: 'push-outside-the-bot' },
    { line: 'nice a=x/git push', kind: 'push-outside-the-bot' },
  ])(
    'flags $line, reading an option the tables do not know as one that may take a value',
    ({ line, kind }) => {
      expect(flagCommand(segmentOf(line)).map((hit) => hit.kind)).toStrictEqual([kind]);
    },
  );

  it.each([{ line: '> git.log echo push' }, { line: '2>&1 git status' }])(
    'leaves $line clear past its redirections',
    ({ line }) => {
      expect(flagCommand(segmentOf(line))).toStrictEqual([]);
    },
  );

  it.each([
    { line: 'git add -- README.md' },
    { line: 'git add -- -A' },
    { line: 'git add -- --all' },
    { line: 'git commit -- --amend' },
    { line: 'git commit -F message.txt -- -n' },
    { line: 'git add -n README.md' },
    { line: 'git add -p' },
    { line: 'git commit -F message.txt' },
    { line: 'git commit -m "git push"' },
    { line: 'git commit -am "a && b"' },
    { line: 'pnpm agent-tools merge-bot push --branch feat/example' },
    { line: 'pnpm agent-tools merge-bot merge --pr 1' },
    { line: 'echo "git push"' },
    { line: 'git status' },
    { line: 'git -C x status' },
    { line: 'git' },
    { line: 'git --version' },
    { line: 'gitk push' },
  ])('leaves $line clear', ({ line }) => {
    expect(flagCommand(segmentOf(line))).toStrictEqual([]);
  });

  it("reports the rule's own token, never a value nor the cluster around its letter", () => {
    expect(flagCommand(segmentOf('git commit -F secret.txt --no-verify'))).toStrictEqual([
      { kind: 'commit-rewrites-or-skips-hooks', token: '--no-verify' },
    ]);
    expect(flagCommand(segmentOf('git commit -an'))).toStrictEqual([
      { kind: 'commit-rewrites-or-skips-hooks', token: '-n' },
    ]);
    expect(flagCommand(segmentOf('git add -qAn'))).toStrictEqual([
      { kind: 'stage-whole-tree', token: '-A' },
    ]);
  });

  it('reports at most one hit for a segment, however many rule tokens it carries', () => {
    expect(flagCommand(['git', 'add', '-A', '--all', '.'])).toStrictEqual([
      { kind: 'stage-whole-tree', token: '-A' },
    ]);
    expect(flagCommand(['git', 'commit', '--amend', '--no-verify'])).toStrictEqual([
      { kind: 'commit-rewrites-or-skips-hooks', token: '--amend' },
    ]);
  });
});

describe('renderSegment prints a command by allowlist', () => {
  it('keeps the program, the git subcommand and the flag names, and elides every value', () => {
    const rendered = renderSegment([
      '/usr/bin/git',
      'commit',
      `-C${HOME_PATH}`,
      `--cwd=${HOME_PATH}`,
      '-m',
      'the secret message',
      '--no-verify',
      'git@github.com:org/repo.git',
      '~/notes',
    ]);
    expect(rendered).toBe('git commit -<flag> --<flag> -<flag> <arg> --no-verify <arg> <arg>');
  });

  it('elides an assignment value and a wrapper argument, keeping the assignment name', () => {
    const segment = [`KEY=${HOME_PATH}`, 'sudo', '-u', 'root', 'git', 'push', 'origin', 'main'];
    expect(renderSegment(segment)).toBe('KEY=<value> sudo -<flag> <arg> git push <arg> <arg>');
  });

  it("prints a rule's short flag by name and every other short option or cluster as a placeholder", () => {
    expect(renderSegment(['git', 'add', '-A', '-v'])).toBe('git add -A -<flag>');
    expect(renderSegment(['git', 'commit', '-an'])).toBe('git commit -<flag>');
  });

  it('prints a program that is not git as a placeholder, with every argument elided', () => {
    expect(renderSegment(['pnpm', 'agent-tools', 'merge-bot', 'push'])).toBe(
      '<arg> <arg> <arg> <arg>',
    );
  });

  it('elides every token after a bare --, a dash-prefixed positional included', () => {
    expect(renderSegment(['git', 'commit', '--amend', '--', '--secret-file-name', 'x'])).toBe(
      'git commit --amend -- <arg> <arg>',
    );
  });

  it('elides the argument of a long wrapper option', () => {
    expect(renderSegment(['sudo', '--user', 'root', 'git', 'push'])).toBe(
      'sudo --<flag> <arg> git push',
    );
  });

  it('prints a value shaped like a flag as a flag placeholder, never by name nor by first letter', () => {
    expect(renderSegment(['git', 'commit', '-m', '--secret-message', '--no-verify'])).toBe(
      'git commit -<flag> --<flag> --no-verify',
    );
    expect(renderSegment(['git', 'commit', '-m', '-secret-message', '--no-verify'])).toBe(
      'git commit -<flag> -<flag> --no-verify',
    );
  });

  it.each([
    { line: '>/tmp/nonce-5c1e git push', rendered: '<arg> git push' },
    {
      line: '> /tmp/nonce-5c1e git push origin main',
      rendered: '<arg> <arg> git push <arg> <arg>',
    },
    { line: 'git >/tmp/nonce-5c1e push origin main', rendered: 'git <arg> push <arg> <arg>' },
    { line: 'git 2> /tmp/nonce-5c1e push', rendered: 'git <arg> <arg> push' },
    {
      line: 'sudo -u >/tmp/nonce-5c1e root git push',
      rendered: 'sudo -<flag> <arg> <arg> git push',
    },
    {
      line: 'git --attr-source HEAD push origin HEAD',
      rendered: 'git --<flag> <arg> push <arg> <arg>',
    },
  ])(
    'renders $line with the program and subcommand past its redirections, never their target',
    ({ line, rendered }) => {
      expect(renderSegment(segmentOf(line))).toBe(rendered);
    },
  );

  it.each([
    { line: "git '>' push myremote", rendered: 'git <arg> <arg> <arg>' },
    { line: 'git <<< commit hunterpass --amend', rendered: 'git <arg> <arg> <arg> --amend' },
    { line: '> FOO_SECRET=abc git push', rendered: '<arg> <arg> git push' },
    { line: '> /opt/x/env git push', rendered: '<arg> <arg> git push' },
    { line: '> git -Csecretdir push', rendered: '<arg> <arg> -<flag> <arg>' },
    { line: '> git --git-dir=/x/secretdir push', rendered: '<arg> <arg> --<flag> <arg>' },
    { line: 'sudo -D /opt/secretproj git push', rendered: 'sudo -<flag> <arg> <arg> <arg>' },
    { line: 'exec -a hunterpass git push', rendered: 'exec -<flag> <arg> <arg> <arg>' },
    {
      line: '/usr/bin/time -o secret-out.txt git push',
      rendered: 'time -<flag> <arg> <arg> <arg>',
    },
    { line: 'sudo -u c2VjcmV0dG9rZW4= git push', rendered: 'sudo -<flag> <arg> git push' },
    { line: 'sudo -D FOO_SECRET=abc git push', rendered: 'sudo -<flag> <arg> git push' },
    { line: 'nice -n hunter2=x git push', rendered: 'nice -n <arg> git push' },
    { line: 'sudo -u >/dev/null X= git push', rendered: 'sudo -<flag> <arg> <arg> git push' },
  ])(
    'renders $line with no value, whichever reading placed the program and subcommand',
    ({ line, rendered }) => {
      expect(renderSegment(segmentOf(line))).toBe(rendered);
    },
  );

  it("renders a bare -- that is a redirection's target as a flag, not as the end of options", () => {
    expect(renderSegment(segmentOf('git commit 2> -- -n'))).toBe('git commit <arg> -- -n');
  });

  it("prints git's subcommand only when it names a forbidden shape", () => {
    expect(renderSegment(['git', 'Deadbeef01', 'status'])).toBe('git <arg> <arg>');
    expect(renderSegment(['git', 'status'])).toBe('git <arg>');
    expect(renderSegment(['git', 'push'])).toBe('git push');
  });
});
