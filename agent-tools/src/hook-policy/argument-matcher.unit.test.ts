import { describe, expect, it } from 'vitest';

import { matchesArgvPattern, parseArgvPattern } from './argument-matcher.js';

/**
 * The invocation fixtures PR #100's review rounds enumerated: the spellings a
 * string-prefix deny list cannot close because git resolves any unique prefix
 * of a long option, accepts mode flags in any position, and `rm` accepts its
 * short flags split, clustered, capitalised, or spelt long. Each `it` states
 * a behaviour of the matcher against an invocation, never the shape of the
 * implementation.
 */
describe('parseArgvPattern', () => {
  it('reads a git subcommand pattern into its command, subcommand and required options', () => {
    expect(parseArgvPattern('git reset --hard')).toStrictEqual({
      command: 'git',
      subcommand: ['reset'],
      required: ['hard'],
    });
    expect(parseArgvPattern('git worktree remove --force')).toStrictEqual({
      command: 'git',
      subcommand: ['worktree', 'remove'],
      required: ['force'],
    });
  });

  it('reads a clustered short-flag pattern into its canonical option names', () => {
    expect(parseArgvPattern('rm -rf')).toStrictEqual({
      command: 'rm',
      subcommand: [],
      required: ['recursive', 'force'],
    });
    expect(parseArgvPattern('git push -f')).toStrictEqual({
      command: 'git',
      subcommand: ['push'],
      required: ['force'],
    });
  });

  it('refuses a pattern whose command, subcommand or option the tables do not know', () => {
    expect(parseArgvPattern('svn revert --force')).toBeNull();
    expect(parseArgvPattern('git frobnicate --hard')).toBeNull();
    expect(parseArgvPattern('git reset --nonsense')).toBeNull();
    expect(parseArgvPattern('git reset')).toBeNull();
  });
});

describe('matchesArgvPattern — git reset', () => {
  const hard = 'git reset --hard';

  it('matches the hard mode in any position, including after the commit argument', () => {
    expect(matchesArgvPattern(hard, 'git reset --hard HEAD~1')).toBe(true);
    expect(matchesArgvPattern(hard, 'git reset HEAD~1 --hard')).toBe(true);
  });

  it('resolves a unique long-option prefix the way git does', () => {
    expect(matchesArgvPattern(hard, 'git reset --h HEAD~1')).toBe(true);
    expect(matchesArgvPattern(hard, 'git reset --ha HEAD~1')).toBe(true);
    expect(matchesArgvPattern('git reset --keep', 'git reset --k HEAD~1')).toBe(true);
  });

  it('leaves the forward-going reset forms alone', () => {
    // The soft and mixed modes rework an unpushed commit without touching
    // the working tree (undo-change skill), and the pathspec-only form is
    // the index-only unstage.
    expect(matchesArgvPattern(hard, 'git reset --so HEAD~1')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset --soft HEAD~1')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset HEAD~1')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset -- path/to/file.ts')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset -q -- path/to/file.ts')).toBe(false);
  });

  it('treats an ambiguous prefix as unresolved, as git refuses it', () => {
    // `--m` could be --mixed or --merge; git errors, and no mode is selected.
    expect(matchesArgvPattern('git reset --merge', 'git reset --m HEAD~1')).toBe(false);
    expect(matchesArgvPattern('git reset --merge', 'git reset --me HEAD~1')).toBe(true);
  });

  it('stops reading options at the terminator and keeps the ones before it', () => {
    expect(matchesArgvPattern(hard, 'git reset -- --hard')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset --hard -- src/index.ts')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm -rf -- -dir')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm -r -- -f dir')).toBe(false);
  });

  it('consumes an option value so it is never read as a flag', () => {
    // A long option that takes a file name swallows the next word; an
    // `=`-joined value does not; an optional value counts only when joined.
    expect(matchesArgvPattern(hard, 'git reset --pathspec-from-file --hard')).toBe(false);
    expect(matchesArgvPattern(hard, 'git reset --pathspec-from-file=list.txt --hard')).toBe(true);
    expect(matchesArgvPattern('git push --atomic', 'git push --signed --atomic')).toBe(true);
    expect(matchesArgvPattern('git push --atomic', 'git push --repo --atomic')).toBe(false);
  });

  it('sees through the global git options that precede the subcommand', () => {
    expect(matchesArgvPattern(hard, 'git -C ../other reset --hard')).toBe(true);
    expect(matchesArgvPattern(hard, 'git --no-pager -c core.quotePath=false reset --h')).toBe(true);
    expect(matchesArgvPattern(hard, 'git --git-dir=.git --work-tree . reset --hard')).toBe(true);
  });
});

describe('matchesArgvPattern — git revert', () => {
  it('resolves the abbreviated sequencer rollback modes', () => {
    expect(matchesArgvPattern('git revert --abort', 'git revert --a')).toBe(true);
    expect(matchesArgvPattern('git revert --abort', 'git revert --abo')).toBe(true);
    expect(matchesArgvPattern('git revert --skip', 'git revert --sk')).toBe(true);
  });

  it('leaves the forward-going revert alone', () => {
    expect(matchesArgvPattern('git revert --abort', 'git revert HEAD')).toBe(false);
    expect(matchesArgvPattern('git revert --abort', 'git revert --continue')).toBe(false);
    expect(matchesArgvPattern('git revert --abort', 'git revert -n -m 1 abc1234')).toBe(false);
    // `--s` is ambiguous between --signoff, --strategy, --strategy-option and --skip.
    expect(matchesArgvPattern('git revert --skip', 'git revert --s')).toBe(false);
  });

  it('reads the rest of a cluster as an optional value, never the next word', () => {
    // `-Ss` is gpg-sign with key id `s`; `-sS` is signoff and then gpg-sign.
    expect(matchesArgvPattern('git revert --signoff', 'git revert -Ss HEAD')).toBe(false);
    expect(matchesArgvPattern('git revert --signoff', 'git revert -sS HEAD')).toBe(true);
    expect(matchesArgvPattern('git revert --signoff', 'git revert -S -s HEAD')).toBe(true);
    expect(matchesArgvPattern('git revert --signoff', 'git revert -S --signoff HEAD')).toBe(true);
  });
});

describe('matchesArgvPattern — git worktree remove', () => {
  const force = 'git worktree remove --force';

  it('matches the force option however it is spelt or placed', () => {
    expect(matchesArgvPattern(force, 'git worktree remove --force ../lane')).toBe(true);
    expect(matchesArgvPattern(force, 'git worktree remove --f ../lane')).toBe(true);
    expect(matchesArgvPattern(force, 'git worktree remove --fo ../lane')).toBe(true);
    expect(matchesArgvPattern(force, 'git worktree remove ../lane -f')).toBe(true);
  });

  it('leaves the plain removal and the other worktree verbs alone', () => {
    expect(matchesArgvPattern(force, 'git worktree remove ../lane')).toBe(false);
    expect(matchesArgvPattern(force, 'git worktree add -f ../lane')).toBe(false);
    expect(matchesArgvPattern(force, 'git worktree list')).toBe(false);
  });
});

describe('matchesArgvPattern — git push and git clean', () => {
  it('matches the force push under its short, long and abbreviated spellings', () => {
    expect(matchesArgvPattern('git push --force', 'git push origin HEAD --force')).toBe(true);
    expect(matchesArgvPattern('git push --force', 'git push -f origin HEAD')).toBe(true);
    // `--forc` is ambiguous between --force, --force-with-lease and
    // --force-if-includes, so git refuses it and nothing is selected.
    expect(matchesArgvPattern('git push --force', 'git push --forc origin HEAD')).toBe(false);
    // `--force-with-lease` is its own option, not the force option.
    expect(matchesArgvPattern('git push --force', 'git push --force-with-lease')).toBe(false);
    expect(matchesArgvPattern('git push --force', 'git push origin HEAD')).toBe(false);
  });

  it('matches a forced clean whether the flags are clustered or split', () => {
    expect(matchesArgvPattern('git clean -fd', 'git clean -fd')).toBe(true);
    expect(matchesArgvPattern('git clean -fd', 'git clean -d -f')).toBe(true);
    expect(matchesArgvPattern('git clean -fd', 'git clean --force -d')).toBe(true);
    expect(matchesArgvPattern('git clean -fd', 'git clean -n -d')).toBe(false);
  });

  it('reads a short option value from the rest of its cluster or the next word', () => {
    // The exclude option takes a value, so `-f` after it is the VALUE, and
    // inside a cluster the rest of the cluster is the value (`-ef` is `-e f`).
    expect(matchesArgvPattern('git clean -fd', "git clean -e '*.log' -f -d")).toBe(true);
    expect(matchesArgvPattern('git clean -fd', 'git clean -e -f -d')).toBe(false);
    expect(matchesArgvPattern('git clean -fd', 'git clean -ef -d')).toBe(false);
  });

  it('never gives a short-only option a long spelling git does not have', () => {
    // `--d` is the unique prefix of --dry-run on git clean; `-d` has no long form.
    expect(matchesArgvPattern('git clean -fd', 'git clean --d -f')).toBe(false);
    expect(matchesArgvPattern('git clean -fd', 'git clean --dry-run -f')).toBe(false);
    expect(parseArgvPattern('git clean --d')).toStrictEqual({
      command: 'git',
      subcommand: ['clean'],
      required: ['dry-run'],
    });
  });
});

describe('matchesArgvPattern — git branch', () => {
  it('meets a spelling that is two options on the same canonical set', () => {
    const deleteForce = 'git branch -D';
    expect(matchesArgvPattern(deleteForce, 'git branch -D feature')).toBe(true);
    expect(matchesArgvPattern(deleteForce, 'git branch -d -f feature')).toBe(true);
    expect(matchesArgvPattern(deleteForce, 'git branch --delete --force feature')).toBe(true);
    expect(matchesArgvPattern(deleteForce, 'git branch feature --del -f')).toBe(true);
    expect(matchesArgvPattern(deleteForce, 'git branch -d feature')).toBe(false);
    expect(matchesArgvPattern('git branch --delete --force', 'git branch -D feature')).toBe(true);
  });
});

describe('matchesArgvPattern — rm', () => {
  const recursiveForce = 'rm -rf';

  it('matches every spelling of a forced recursive removal', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm -rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -fr dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -Rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -rvf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -r -f dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -r --force dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm --recursive -f dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm --recursive --force dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm dir -rf')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, '/bin/rm -rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'sudo rm -rf dir')).toBe(true);
  });

  it('reads a long option glued to a redirection as the option, so the redirection is no bypass', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm --recursive --force>/dev/null d')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -r --force>x d')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'git reset --hard>/dev/null')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'git reset --hard>x -- f')).toBe(true);
    expect(matchesArgvPattern('git push --force', 'git push --force>/dev/null origin HEAD')).toBe(
      true,
    );
  });

  it('reads a redirection target glued to an option as the target, as the shell does', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm -r>x-f d')).toBe(false);
  });

  it('reads the unquoted operands of eval and ssh as the one command they run', () => {
    expect(matchesArgvPattern('git reset --hard', 'eval git reset --hard HEAD~1')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'ssh host git reset --hard HEAD~1')).toBe(true);
  });

  it('reads past an ssh option that takes a value to the command the host runs', () => {
    expect(matchesArgvPattern('git reset --hard', 'ssh -p 22 host git reset --hard HEAD~1')).toBe(
      true,
    );
  });

  it('reads an escaped or quoted operator character as text, so it hides no later option', () => {
    expect(matchesArgvPattern(recursiveForce, String.raw`rm -rf x \>& -i`)).toBe(true);
  });

  it('lets a later option cancel the one it overrides, as rm does', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm -rf -i dir')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm -i -rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -r --interactive=always -f dir')).toBe(true);
    // `--interactive=never` prompts for nothing, so it cancels nothing.
    expect(matchesArgvPattern(recursiveForce, 'rm -rf --interactive=never dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -r --interactive=never -f dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -rf --interactive=once dir')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm -rf --interactive dir')).toBe(false);
    // The short `-i` takes no value, so `-rif` is `-r -i -f` and force wins; `-I` cancels force too.
    expect(matchesArgvPattern(recursiveForce, 'rm -rif dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -rfi dir')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm -ri -f dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -rIf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, 'rm -rfI dir')).toBe(false);
  });

  it('leaves the single-mode removals alone', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm -r dir')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm -f file')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm file')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rm -- -rf')).toBe(false);
  });

  it("does not read a known command's own subcommand as an invocation of the command it is named after", () => {
    expect(matchesArgvPattern(recursiveForce, 'git rm -rf --cached node_modules')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'git rm --cached -r -f node_modules')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'git rm -r x && rm -rf y')).toBe(true);
  });

  it('names the command the same under a Windows suffix or a backslash path', () => {
    expect(matchesArgvPattern(recursiveForce, 'rm.exe -rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, '/mnt/c/Git/usr/bin/rm.exe -rf dir')).toBe(true);
    expect(matchesArgvPattern(recursiveForce, String.raw`"C:\Git\usr\bin\rm.exe" -rf dir`)).toBe(
      true,
    );
    expect(matchesArgvPattern('git reset --hard', 'git.exe reset --hard')).toBe(true);
  });

  it('does not mistake another command for rm by a suffix of its name', () => {
    expect(matchesArgvPattern(recursiveForce, 'pnpm exec form -rf x')).toBe(false);
    expect(matchesArgvPattern(recursiveForce, 'rmdir -rf x')).toBe(false);
  });
});

describe('matchesArgvPattern — shell shapes', () => {
  it('finds the invocation anywhere in a chained or piped line', () => {
    expect(matchesArgvPattern('rm -rf', 'cd build && rm -rf out; echo done')).toBe(true);
    expect(
      matchesArgvPattern('git reset --hard', 'git fetch origin && git reset --h origin/x'),
    ).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'find . -name "*.tmp" -exec rm -rf {} +')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'ls | xargs rm -rf')).toBe(true);
  });

  it('finds the invocation inside a quoted sub-shell argument', () => {
    expect(matchesArgvPattern('rm -rf', 'sh -c "rm -rf dir"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', "bash -lc 'cd x && rm -r --force y'")).toBe(true);
  });

  it('reads a quoted word as the command receives it, since the shell removes the quotes', () => {
    expect(matchesArgvPattern('rm -rf', "rm '-rf' dir")).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm -r"f" dir')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', '"git" reset --hard')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'git "reset" "--hard"')).toBe(true);
    // A quoted span with a space is ONE word to the shell, so it invokes nothing.
    expect(matchesArgvPattern('rm -rf', 'grep -n "rm -rf" docs/')).toBe(false);
    expect(matchesArgvPattern('git reset --hard', 'git commit -m "reset --hard later"')).toBe(
      false,
    );
  });

  it('keeps reading options after a command substitution, and reads the substitution itself', () => {
    expect(
      matchesArgvPattern('git reset --hard', 'git reset $(git merge-base HEAD main) --hard'),
    ).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm -rf `pwd`/build')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'echo $(rm -rf x)')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'out=`git reset --hard`')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'git reset $(git merge-base HEAD main)')).toBe(
      false,
    );
    // The idiomatic quoted substitution is read too; a single-quoted one is literal.
    expect(matchesArgvPattern('rm -rf', 'OUT="$(rm -rf x)"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', "echo '$(rm -rf x)'")).toBe(false);
  });

  it('finds the interpreter anywhere before its script, not only as the first word', () => {
    expect(matchesArgvPattern('rm -rf', 'sudo sh -c "rm -rf x"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', "ls | xargs -I{} sh -c 'rm -rf {}'")).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'timeout 5 bash -c "git reset --hard"')).toBe(
      true,
    );
    expect(matchesArgvPattern('rm -rf', 'FOO=1 env sh -c "rm -rf x"')).toBe(true);
    // A script is a script however it was kept as one word: escaped or ANSI-C quoted.
    expect(matchesArgvPattern('rm -rf', String.raw`sh -c rm\ -rf\ x`)).toBe(true);
    expect(matchesArgvPattern('rm -rf', "bash -c $'rm -rf x'")).toBe(true);
  });

  it('tries the first few words naming the command, so a wrapper operand cannot shadow the invocation', () => {
    expect(matchesArgvPattern('rm -rf', 'xargs -a rm -- rm -rf')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm rm -rf x')).toBe(true);
    // The licensed over-match: the first rm deletes files named rm, -rf and x.
    expect(matchesArgvPattern('rm -rf', 'rm -- rm -rf x')).toBe(true);
  });

  it('reads only the script an interpreter is given, never a path it is given', () => {
    expect(matchesArgvPattern('rm -rf', 'sh -ec "rm -rf x"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'bash "/tmp/rm -rf script"')).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'bash -x "/tmp/rm -rf script"')).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'eval "rm -rf x"')).toBe(true);
  });

  it('continues a line at a backslash-newline as the shell does', () => {
    expect(
      matchesArgvPattern(
        'rm -rf',
        String.raw`rm -r \
-f dir`,
      ),
    ).toBe(true);
    expect(
      matchesArgvPattern(
        'git reset --hard',
        String.raw`git reset \
  --hard HEAD~1`,
      ),
    ).toBe(true);
  });

  it('decodes ANSI-C escapes inside a $-quoted script', () => {
    expect(matchesArgvPattern('rm -rf', String.raw`bash -c $'echo start\nrm -rf x'`)).toBe(true);
    expect(matchesArgvPattern('rm -rf', String.raw`bash -c $'rm\x20-rf x'`)).toBe(true);
    expect(matchesArgvPattern('rm -rf', String.raw`bash -c $'rm\u0020-rf x'`)).toBe(true);
    expect(matchesArgvPattern('rm -rf', String.raw`bash -c $'rm\U00000020-rf x'`)).toBe(true);
    expect(matchesArgvPattern('rm -rf', String.raw`bash -c $'echo a\cJrm -rf x'`)).toBe(true);
  });

  it('balances a substitution past quoted and escaped parentheses', () => {
    expect(matchesArgvPattern('rm -rf', 'OUT="$(printf \')\'; rm -rf x)"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', String.raw`echo $(printf "\)"; rm -rf x)`)).toBe(true);
  });

  it('reads a nested old-style substitution through its escaped inner backticks', () => {
    const backslash = String.fromCodePoint(92);
    expect(matchesArgvPattern('rm -rf', `echo \`echo ${backslash}\`rm -rf x${backslash}\`\``)).toBe(
      true,
    );
    expect(matchesArgvPattern('rm -rf', `echo \`printf '${backslash}\`'; rm -rf x\``)).toBe(true);
  });

  it('reads nested commands two levels deep and no further', () => {
    expect(matchesArgvPattern('rm -rf', 'sh -c "sh -c \'rm -rf x\'"')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'echo $(echo $(rm -rf x))')).toBe(true);
    // Three substitutions deep is past the bound the guard promises.
    expect(matchesArgvPattern('rm -rf', 'echo $(echo $(echo $(rm -rf x)))')).toBe(false);
  });

  it('does not expand what the shell would expand — the stated boundary of the promise', () => {
    // Variable expansion, aliases and a script on stdin are outside what the
    // matcher sees; PDR-044 innate immunity is accident prevention, and these
    // are recorded here so the boundary is described, not discovered.
    expect(matchesArgvPattern('rm -rf', 'FLAGS=-rf; rm $FLAGS dir')).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'alias nuke="rm -rf"; nuke dir')).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'sh < script.sh')).toBe(false);
  });

  it('reads an option after a redirection, which the shell removes before the command runs', () => {
    expect(matchesArgvPattern('git reset --hard', 'git reset 2>&1 --hard HEAD~1')).toBe(true);
    expect(matchesArgvPattern('git reset --hard', 'git reset --hard HEAD~1 &>/dev/null')).toBe(
      true,
    );
    expect(matchesArgvPattern('rm -rf', 'rm -r 2>/dev/null -f dir >| log')).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'echo -rf |& rm -r dir')).toBe(false);
  });

  it('reads a here-document body as data, not commands, except the substitutions the shell runs in it', () => {
    const hardReset = 'git reset --hard';
    expect(
      matchesArgvPattern(
        hardReset,
        "git commit -F- <<'EOT'\nfix: stop using git reset --hard\nEOT",
      ),
    ).toBe(false);
    expect(
      matchesArgvPattern('rm -rf', "cat > README.md <<'EOT'\nDo not use rm -rf here.\nEOT"),
    ).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'cat <<EOT\n$(rm -rf x)\nEOT')).toBe(true);
    expect(matchesArgvPattern('rm -rf', "cat <<'EOT'\n$(rm -rf x)\nEOT")).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'cat <<EOT\nnote\nEOT\nrm -rf x')).toBe(true);
    expect(matchesArgvPattern('rm -rf', "cat <<$'EOT'\nnote\nEOT\nrm -rf x")).toBe(true);
    expect(matchesArgvPattern('rm -rf', 'rm<<EOT -rf dir')).toBe(true);
  });

  it('reads a long interpreter flag cluster in one pass', () => {
    // The flag test is linear in the word: a cluster this long was a multi-second backtrack before.
    expect(matchesArgvPattern('rm -rf', `sh -${'c'.repeat(100_000)}1 'rm -rf x'`)).toBe(false);
    expect(matchesArgvPattern('rm -rf', `sh -${'e'.repeat(100_000)}c 'rm -rf x'`)).toBe(true);
  });

  it('drops a comment before reading the line', () => {
    expect(matchesArgvPattern('rm -rf', 'pnpm build # rm -rf dist first')).toBe(false);
    expect(matchesArgvPattern('rm -rf', 'rm -rf dist # clean first')).toBe(true);
  });

  it('does not read options that belong to a different command in the chain', () => {
    expect(matchesArgvPattern('git reset --hard', 'git reset --soft HEAD~1 && ls --hard')).toBe(
      false,
    );
    expect(matchesArgvPattern('rm -rf', 'rm -r dir | tee -f log')).toBe(false);
  });

  it('never matches when the pattern itself does not parse', () => {
    expect(matchesArgvPattern('git frobnicate --hard', 'git frobnicate --hard')).toBe(false);
  });
});

describe('matchesArgvPattern — the script a shell interpreter is given', () => {
  it.each([
    { command: "bash -c -o posix 'rm -rf x'" },
    { command: "bash +xc 'rm -rf x'" },
    { command: `bash -c 'eval "$1"' _ 'rm -rf x'` },
    { command: "bash -c -- '-x; rm -rf x'" },
    { command: "nice a=x/bash -c 'rm -rf x'" },
  ])('reads the script a shell is given in "$command"', ({ command }) => {
    expect(matchesArgvPattern('rm -rf', command)).toBe(true);
  });

  it('reads no script when only an assignment carries a shell name', () => {
    expect(matchesArgvPattern('rm -rf', "SHELL=/bin/bash grep -c 'rm -rf x' log")).toBe(false);
  });
});
