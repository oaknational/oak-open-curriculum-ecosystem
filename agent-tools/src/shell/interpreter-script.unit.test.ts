import { describe, expect, it } from 'vitest';

import { basename, interpreterScriptWords } from './interpreter-script.js';
import { segmentCommand } from './shell-words.js';

/** The script texts an interpreter in the one segment of a command line is given. */
function scriptsOf(line: string): readonly string[] {
  const [segment] = segmentCommand(line);
  return interpreterScriptWords(segment ?? []).map((word) => word.text);
}

describe('interpreterScriptWords', () => {
  it.each([
    { line: "sh -c 'git push origin HEAD'" },
    { line: "bash -lc 'git push origin HEAD'" },
    { line: "/bin/zsh -lc 'git push origin HEAD'" },
    { line: "sh -ic 'git push origin HEAD'" },
    { line: "bash -euo pipefail -c 'git push origin HEAD'" },
    { line: "bash --norc -c 'git push origin HEAD'" },
    { line: "sudo bash -c 'git push origin HEAD'" },
    { line: "bash -c -o posix 'git push origin HEAD'" },
    { line: "bash -c -O extglob 'git push origin HEAD'" },
    { line: "bash -c +x 'git push origin HEAD'" },
    { line: "bash +c 'git push origin HEAD'" },
    { line: "bash +xc 'git push origin HEAD'" },
    { line: "bash +ec 'git push origin HEAD'" },
    { line: "ksh -e+c 'git push origin HEAD'" },
    { line: "GIT_SSH=/usr/bin/ssh bash -c 'git push origin HEAD'" },
    { line: "nice a=x/bash -c 'git push origin HEAD'" },
    { line: "exec a=/bin/sh -c 'git push origin HEAD'" },
  ])('reads the script a shell is given past its options in "$line"', ({ line }) => {
    expect(scriptsOf(line)).toStrictEqual(['git push origin HEAD']);
  });

  it('reads a script that opens with a dash once a bare -- ends the options', () => {
    expect(scriptsOf("bash -c -- '-x; git push origin HEAD'")).toStrictEqual([
      '-x; git push origin HEAD',
    ]);
  });

  it('reads every script-shaped operand after the -c cluster, a positional one included', () => {
    expect(scriptsOf(`bash -c 'eval "$1"' _ 'git push origin HEAD'`)).toStrictEqual([
      'eval "$1"',
      'git push origin HEAD',
    ]);
  });

  it.each([
    { line: "sudo -u ssh ssh host 'git push origin HEAD'" },
    { line: "exec -a ssh ssh host 'git push origin HEAD'" },
  ])(
    'reads the real ssh as the command when a word before it only carries its name in "$line"',
    ({ line }) => {
      expect(scriptsOf(line)).toContain('ssh host git push origin HEAD');
    },
  );

  it('reads a shell even when a word before it carries the name of an operand interpreter', () => {
    expect(scriptsOf("sudo -u ssh bash -c 'git push origin HEAD'")).toContain(
      'git push origin HEAD',
    );
  });

  it.each([
    { line: 'bash deploy.sh' },
    { line: 'bash -e deploy.sh' },
    { line: 'git push origin HEAD' },
    { line: 'echo "sh -c x"' },
    { line: 'bash -c push' },
    { line: 'eval push' },
    { line: "bash -ccc1 'git status'" },
    { line: "SHELL=/bin/bash grep -c 'a b' log" },
  ])('reads no script in "$line"', ({ line }) => {
    expect(scriptsOf(line)).toStrictEqual([]);
  });

  it('joins the operands of eval, and of ssh after its host, into the one command they run', () => {
    expect(scriptsOf("eval 'git push' 'origin HEAD'")).toStrictEqual(['git push origin HEAD']);
    expect(scriptsOf('eval git push origin HEAD')).toStrictEqual(['git push origin HEAD']);
    expect(scriptsOf("ssh -T host 'git push origin HEAD'")).toStrictEqual(['git push origin HEAD']);
    expect(scriptsOf('ssh host git push origin HEAD')).toStrictEqual(['git push origin HEAD']);
    expect(scriptsOf('ssh host')).toStrictEqual([]);
  });

  it.each([
    { line: 'ssh -p 22 host git push origin HEAD' },
    { line: 'ssh -4 -p 22 host git push origin HEAD' },
    { line: 'ssh -p22 -o StrictHostKeyChecking=no -i key host git push origin HEAD' },
    { line: 'ssh -4p 22 -oStrictHostKeyChecking=no -ikey host git push origin HEAD' },
    { line: 'ssh -- host git push origin HEAD' },
    { line: 'ssh -l user -- host git push origin HEAD' },
    { line: 'ssh -ljoe host git push origin HEAD' },
    { line: 'ssh -4ljoe host git push origin HEAD' },
    { line: 'ssh -B en0 host git push origin HEAD' },
    { line: 'ssh -P tag host git push origin HEAD' },
  ])('skips the ssh options that take a value before reading the host in "$line"', ({ line }) => {
    expect(scriptsOf(line)).toStrictEqual(['git push origin HEAD']);
  });

  it('reads no command when ssh is given only options and a host', () => {
    expect(scriptsOf('ssh -p 22 host')).toStrictEqual([]);
    expect(scriptsOf('ssh -p 22')).toStrictEqual([]);
  });
});

describe('basename', () => {
  it.each([
    { text: '/bin/rm', name: 'rm' },
    { text: String.raw`C:\tools\git.exe`, name: 'git' },
    { text: 'git', name: 'git' },
  ])('reads $text as $name', ({ text, name }) => {
    expect(basename(text)).toBe(name);
  });
});
