import { describe, expect, it } from 'vitest';

import {
  BASH_FLOOR_GUARD,
  bashFloorFailures,
  isShellScript,
  shebangFailures,
  silencingDirectiveFailures,
  type ShebangForms,
} from './repo-check-shellcheck-files.js';

/**
 * The shellcheck gate's pure mapping: which tracked files are shell scripts,
 * which shebangs fail the gate, which comments would silence shellcheck, and
 * which bash scripts lack the floor. The recognised shebang forms are the
 * gate's data, so the classification is proved against probe forms rather
 * than the list the gate ships; the gate running over the repository
 * (`pnpm lint:shell`) proves that list against the tracked files, and the
 * argv shellcheck runs with.
 */

/** Probe forms: two that run a shell, one that runs something else. */
const FORMS: ShebangForms = new Map([
  ['#!/probe/shell', 'shell'],
  ['#!/probe/other-shell', 'shell'],
  ['#!/probe/interpreter', 'not shell'],
]);

const ALL_FORMS = '`#!/probe/shell`, `#!/probe/other-shell`, `#!/probe/interpreter`';

const SHELL_FORMS = '`#!/probe/shell`, `#!/probe/other-shell`';

describe('isShellScript', () => {
  it('takes a .sh or .bash file as shell whatever its first line', () => {
    expect(isShellScript('.agent/setup/install.sh', '', FORMS)).toBe(true);
    expect(isShellScript('scripts/profile.bash', '# sourced, no shebang\n', FORMS)).toBe(true);
    expect(isShellScript('lib/misnamed.sh', '#!/probe/interpreter\n', FORMS)).toBe(true);
  });

  it('takes every file directly in .husky/ as shell, since husky runs each hook with sh', () => {
    expect(isShellScript('.husky/post-merge', 'pnpm install\n', FORMS)).toBe(true);
    expect(isShellScript('.husky/pre-push', '#!/probe/shell\n', FORMS)).toBe(true);
  });

  it('leaves out a file nested below .husky/, which is not a hook', () => {
    expect(isShellScript('.husky/docs/README', 'Hooks\n', FORMS)).toBe(false);
  });

  it.each(['#!/probe/shell', '#!/probe/other-shell'])(
    'takes a file as shell when its first line is exactly the shell form %s',
    (form) => {
      expect(isShellScript('bin/run', `${form}\necho run\n`, FORMS)).toBe(true);
    },
  );

  it('takes a shell form as shell when a carriage return ends its line', () => {
    expect(isShellScript('bin/crlf', '#!/probe/shell\r\necho crlf\r\n', FORMS)).toBe(true);
  });

  it.each(['#!/probe/interpreter', '#!/probe/unlisted', ' #!/probe/shell'])(
    'leaves out a file whose first line %j is a non-shell form or no recognised form',
    (line) => {
      expect(isShellScript('bin/run', `${line}\necho run\n`, FORMS)).toBe(false);
    },
  );

  it('does not take the files in a directory named like a script as scripts', () => {
    expect(isShellScript('fixtures.sh/README', 'plain text\n', FORMS)).toBe(false);
  });
});

describe('shebangFailures', () => {
  it.each([
    '#!/probe/shell ',
    '#!/probe/shell -e',
    '#!/probe/shell  ',
    '#!/probe/sh',
    '#!/usr/bin/env -S "probe" -e',
  ])('fails the unrecognised shebang %j, naming the file, the line and the forms', (line) => {
    expect(shebangFailures('bin/run', `${line}\necho run\n`, FORMS)).toStrictEqual([
      `bin/run:1: the shebang \`${line}\` is not a recognised form; use one of ` +
        `${ALL_FORMS}, or add its form to the gate's SHEBANG_FORMS deliberately`,
    ]);
  });

  it.each([...FORMS.keys()])(
    'passes the recognised form %s, with or without a carriage return ending it',
    (line) => {
      expect(shebangFailures('bin/run', `${line}\nrun\n`, FORMS)).toStrictEqual([]);
      expect(shebangFailures('bin/run', `${line}\r\nrun\r\n`, FORMS)).toStrictEqual([]);
    },
  );

  it('fails an unrecognised shebang on a file whose path makes it shell, naming only the shell forms and both remedies', () => {
    expect(shebangFailures('tool.sh', '#!/probe/unlisted\n', FORMS)).toStrictEqual([
      'tool.sh:1: the shebang `#!/probe/unlisted` is not a recognised shell form, ' +
        `and its path makes the file a shell script; use one of ${SHELL_FORMS}, ` +
        "or add its form to the gate's SHEBANG_FORMS deliberately as a shell form, " +
        'or rename a script that is not shell off that path',
    ]);
  });

  it('fails a non-shell form on a file whose path makes it shell, advising a rename, not a new form', () => {
    expect(shebangFailures('lib/misnamed.sh', '#!/probe/interpreter\n', FORMS)).toStrictEqual([
      'lib/misnamed.sh:1: the shebang `#!/probe/interpreter` is not a recognised shell form, ' +
        `and its path makes the file a shell script; use one of ${SHELL_FORMS}, ` +
        'or rename a script that is not shell off that path',
    ]);
  });

  it(
    String.raw`writes each carriage return in the quoted line as \r, so a terminal cannot overwrite the file name`,
    () => {
      expect(shebangFailures('bin/mac', '#!/probe/sh\recho mac\r', FORMS)).toStrictEqual([
        expect.stringContaining('bin/mac:1: the shebang `#!/probe/sh\\recho mac` is not'),
      ]);
    },
  );

  it('passes a file with no shebang, and a file whose path makes it shell with a shell form', () => {
    expect(shebangFailures('lib/common.sh', 'greet() { echo hi; }\n', FORMS)).toStrictEqual([]);
    expect(shebangFailures('README.md', '# Readme\n', FORMS)).toStrictEqual([]);
    expect(shebangFailures('.husky/pre-push', '#!/probe/shell\npnpm check\n', FORMS)).toStrictEqual(
      [],
    );
  });
});

describe('silencingDirectiveFailures', () => {
  it('names each line whose shellcheck directive disables checks, overrides the shell or narrows the analysis', () => {
    const content = [
      '#!/bin/sh',
      '# shellcheck disable=SC2086',
      'echo $1',
      '  #shellcheck source=/dev/null disable=all',
      '. "$1"',
      '# shellcheck shell=bash',
      '[[ -n "$1" ]]',
      '# shellcheck extended-analysis=false',
      'x=$1',
      '',
    ].join('\n');
    const failures = silencingDirectiveFailures('bin/run.sh', content);
    expect(failures).toHaveLength(4);
    expect(failures[0]).toContain('bin/run.sh:2: a shellcheck disable= directive');
    expect(failures[1]).toContain('bin/run.sh:4: a shellcheck disable= directive');
    expect(failures[2]).toContain('bin/run.sh:6: a shellcheck shell= directive');
    expect(failures[2]).toContain('add a shebang naming the shell');
    expect(failures[3]).toContain('bin/run.sh:8: a shellcheck extended-analysis= directive');
  });

  it.each([
    'if true; then # shellcheck disable=SC2086',
    '{ # shellcheck disable=SC2086',
    '(# shellcheck disable=SC2086',
    'while true; do # shellcheck disable=SC2086',
    'echo run; # shellcheck disable=SC2086',
  ])('fails a directive shellcheck honours after an opening token, as in %j', (line) => {
    expect(silencingDirectiveFailures('bin/run.sh', `#!/bin/sh\n${line}\n`)).toStrictEqual([
      expect.stringMatching(/^bin\/run\.sh:2: a shellcheck disable= directive /u),
    ]);
  });

  it.each([
    ['# shellcheck source="/dev/null"disable=SC2086', 'disable'],
    ["# shellcheck source='lib.sh'disable=SC2086", 'disable'],
    ['# shellcheck enable="all"disable=SC2086', 'disable'],
    ['# shellcheck source=".."shell=bash', 'shell'],
    ['# shellcheck enable="all"extended-analysis=false', 'extended-analysis'],
  ])(
    'fails a silencing key glued to the quoted value before it, which shellcheck honours, as in %j',
    (line, key) => {
      expect(silencingDirectiveFailures('bin/run.sh', `#!/bin/sh\n${line}\n`)).toStrictEqual([
        expect.stringMatching(
          new RegExp(String.raw`^bin/run\.sh:2: a shellcheck ${key}= directive `, 'u'),
        ),
      ]);
    },
  );

  it('passes a # inside a word, which starts no comment', () => {
    expect(
      silencingDirectiveFailures('bin/run.sh', '#!/bin/sh\necho tag#shellcheck disable=SC2086\n'),
    ).toStrictEqual([]);
  });

  it('passes directives that disable nothing, and comments that are not directives', () => {
    const content = [
      '#!/bin/sh',
      '# shellcheck source=lib.sh',
      '# shellcheck enable=require-variable-braces',
      '# the gate refuses disable= and shell= directives',
      'echo "${1}"',
      '',
    ].join('\n');
    expect(silencingDirectiveFailures('bin/run.sh', content)).toStrictEqual([]);
  });
});

describe('bashFloorFailures', () => {
  const guarded = `#!/usr/bin/env bash\n# What the script does.\n\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho run\n`;

  it('accepts a bash script whose first command is the floor guard, after comments and blank lines', () => {
    expect(bashFloorFailures('bin/run', guarded)).toStrictEqual([]);
  });

  it('leaves a script that is not bash alone', () => {
    expect(bashFloorFailures('.husky/pre-push', '#!/usr/bin/env sh\npnpm check\n')).toStrictEqual(
      [],
    );
    expect(bashFloorFailures('lib/common.sh', 'greet() { echo hi; }\n')).toStrictEqual([]);
  });

  it.each([
    ['no guard', '#!/usr/bin/env bash\necho run\n'],
    [
      'a guard after another command',
      guarded.replace(`${BASH_FLOOR_GUARD}\n`, `set -eu\n${BASH_FLOOR_GUARD}\n`),
    ],
    ['a lower floor', guarded.replace('BASH_VERSINFO[1] < 2', 'BASH_VERSINFO[1] < 1')],
  ])('fails a bash script with %s', (_case, content) => {
    expect(bashFloorFailures('bin/run', content)).toStrictEqual([
      expect.stringMatching(/^bin\/run: a bash script's first command is the bash floor guard, /u),
    ]);
  });
});
