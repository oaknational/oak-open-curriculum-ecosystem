/**
 * The shellcheck gate's pure mapping: which tracked files are shell scripts,
 * which shebangs fail the gate, which comments would silence shellcheck, which
 * bash scripts lack the bash floor, and the argv that lints them.
 *
 * A shell script is a tracked file named `*.sh` or `*.bash`, a file directly
 * in `.husky/` (husky runs every hook there with `sh`), or one whose first line
 * is a recognised shell shebang. The file names come from git
 * (`repo-check-files.ts` carries why); the contents are read from the working
 * tree.
 *
 * The shebang classification is closed, following the closed-shape rule
 * (`.agent/rules/closed-shape-design-optionality.md`). The first line, less a
 * trailing carriage return, is matched exactly against the forms the tracked
 * files use (`SHEBANG_FORMS`), never parsed. Any other first line starting
 * `#!` fails the gate, and so does a non-shell form on a file whose path makes
 * it shell, so no script escapes the lint on an interpreter form the gate
 * cannot read. The falsifier: a real script that needs another interpreter
 * form, which widens `SHEBANG_FORMS` deliberately, by that form, in the change
 * that adds the script. The path rules stay as they are: a file with neither a
 * shebang nor a shell path has nothing to fail on, so dropping a path rule
 * would let its scripts escape silently.
 *
 * Every finding fails, and nothing outside the gate's own argv decides what
 * counts as one: a `.shellcheckrc` above the checkout and a `SHELLCHECK_OPTS`
 * in the environment never reach the run, and a `disable`, `shell` or
 * `extended-analysis` directive inside a script fails the gate itself, so
 * every check and the full analysis apply to every script. A script names its
 * shell with its shebang (shellcheck also infers bash from a `.bash` name), so
 * a sourced `.sh` library and every husky hook carry one of the shell forms.
 *
 * @packageDocumentation
 */

const SHELL_EXTENSIONS = ['.sh', '.bash'] as const;

const HUSKY_HOOK_DIRECTORY = '.husky/';

/** Shebang lines, each whole line mapped to whether it runs a shell. */
export type ShebangForms = ReadonlyMap<string, 'shell' | 'not shell'>;

/**
 * Every shebang line the gate recognises: the forms the tracked files of each
 * repository carrying this gate use. A line outside them fails the gate.
 */
const SHEBANG_FORMS: ShebangForms = new Map([
  ['#!/usr/bin/env bash', 'shell'],
  ['#!/usr/bin/env sh', 'shell'],
  ['#!/usr/bin/env node', 'not shell'],
  ['#!/usr/bin/env python3', 'not shell'],
  ['#!/usr/bin/env -S pnpm exec tsx', 'not shell'],
  ['#!/usr/bin/env tsx', 'not shell'],
]);

const BASH_SHEBANG = '#!/usr/bin/env bash';

/**
 * The bash floor, held here once: bash 5.2 (owner, 2026-09-19). Every bash
 * script's first command is this line, so an older bash, such as the 3.2 macOS
 * ships, stops with install advice instead of running on. What follows the
 * line is the script's own: the two secrets hooks answer deny or block, the
 * hook wrapper hands straight to the hook it wraps, the cloud detector exits
 * 2, and the rest write to stderr and exit non-zero. Husky hooks run under
 * `sh` and carry no floor.
 */
export const BASH_FLOOR_GUARD =
  'if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then';

/**
 * A shellcheck directive comment (`# shellcheck key=value ...`, the space
 * after `#` optional) carrying a key that narrows what shellcheck reports:
 * `disable` drops checks, `shell` replaces the dialect the file declares, and
 * `extended-analysis` turns the dataflow analysis off. The `#` starts a word,
 * as a shell comment does, anywhere on the line: shellcheck honours a
 * directive after `then`, `do`, `{` or `(` as well as on a line of its own.
 * The key counts anywhere after `shellcheck`, since shellcheck also honours a
 * key glued to the quoted value before it (`source="lib.sh"disable=SC2086`).
 */
const SILENCING_DIRECTIVE =
  /(?:^|[\s;&|(){}])#\s*shellcheck\s.*?(disable|shell|extended-analysis)=/u;

/** A file's first line, less the carriage return that ends a CRLF line. */
function firstLine(head: string): string {
  const [line = ''] = head.split('\n', 1);
  return line.endsWith('\r') ? line.slice(0, -1) : line;
}

/** Whether a file's path makes it shell whatever its first line: a `.sh` or `.bash` name, or a husky hook. */
function hasShellPath(file: string): boolean {
  const name = file.slice(file.lastIndexOf('/') + 1);
  return (
    SHELL_EXTENSIONS.some((extension) => name.endsWith(extension)) ||
    file === `${HUSKY_HOOK_DIRECTORY}${name}`
  );
}

/**
 * Whether a tracked file is a shell script for shellcheck to lint.
 *
 * @param file - Repo-relative path.
 * @param head - The file's opening bytes, enough to hold its first line.
 * @param forms - The shebang lines the gate recognises.
 * @returns True for a `.sh` or `.bash` name, a husky hook, or a first line that is a shell form.
 */
export function isShellScript(
  file: string,
  head: string,
  forms: ShebangForms = SHEBANG_FORMS,
): boolean {
  return hasShellPath(file) || forms.get(firstLine(head)) === 'shell';
}

/**
 * The remedies besides a recognised form for a refused shebang, each one that
 * can clear the gate on the next run. Adding the line to `SHEBANG_FORMS` clears
 * only an unlisted line, and on a shell path only as a shell form, since the
 * path keeps the file shell whatever its form; renaming the file off its path
 * clears only a file whose path makes it shell.
 *
 * @param form - The refused line's kind in `SHEBANG_FORMS`; undefined for a line outside it.
 * @param shellPath - Whether the file's path makes it shell.
 * @returns Each remedy, as a clause starting `or`.
 */
function refusalRemedies(form: 'not shell' | undefined, shellPath: boolean): readonly string[] {
  const addForm = shellPath
    ? "or add its form to the gate's SHEBANG_FORMS deliberately as a shell form"
    : "or add its form to the gate's SHEBANG_FORMS deliberately";
  return [
    ...(form === undefined ? [addForm] : []),
    ...(shellPath ? ['or rename a script that is not shell off that path'] : []),
  ];
}

/**
 * The failure for a tracked file whose shebang the gate refuses: a first line
 * starting `#!` that is not one of `SHEBANG_FORMS`, or a non-shell form on a
 * file whose path makes it shell.
 *
 * @param file - Repo-relative path, named in the failure.
 * @param head - The file's opening bytes, enough to hold its first line.
 * @param forms - The shebang lines the gate recognises.
 * @returns One failure line naming the file, its shebang (each carriage return written `\r`) and each remedy that can clear it; empty when the gate accepts the file.
 */
export function shebangFailures(
  file: string,
  head: string,
  forms: ShebangForms = SHEBANG_FORMS,
): readonly string[] {
  const line = firstLine(head);
  const form = forms.get(line);
  const shellPath = hasShellPath(file);
  if (!line.startsWith('#!') || form === 'shell' || (form === 'not shell' && !shellPath)) {
    return [];
  }
  const usable = [...forms]
    .filter(([, kind]) => kind === 'shell' || !shellPath)
    .map(([shebang]) => `\`${shebang}\``);
  const refusal = shellPath
    ? 'not a recognised shell form, and its path makes the file a shell script'
    : 'not a recognised form';
  return [
    `${file}:1: the shebang \`${line.replaceAll('\r', String.raw`\r`)}\` is ${refusal}; ` +
      `use one of ${usable.join(', ')}, ${refusalRemedies(form, shellPath).join(', ')}`,
  ];
}

/**
 * The failure for a bash script whose first command is not the bash floor
 * guard. Blank lines and comments may come first; nothing else may.
 *
 * @param file - Repo-relative path, named in the failure.
 * @param content - The script's text.
 * @returns One failure line; empty for a script that is not bash or that opens with the guard.
 */
export function bashFloorFailures(file: string, content: string): readonly string[] {
  if (firstLine(content) !== BASH_SHEBANG) {
    return [];
  }
  const firstCommand = content
    .split('\n')
    .slice(1)
    .find((line) => line.trim() !== '' && !line.trimStart().startsWith('#'));
  if (firstCommand === BASH_FLOOR_GUARD) {
    return [];
  }
  return [
    `${file}: a bash script's first command is the bash floor guard, \`${BASH_FLOOR_GUARD}\`, ` +
      'so an older bash stops with install advice; add the guard after the opening comments',
  ];
}

/**
 * The lines of a shell script whose shellcheck directive narrows what the
 * gate reports. A finding is fixed in the script; the gate has no exception
 * list.
 *
 * @param file - Repo-relative path, named in each failure.
 * @param content - The script's text.
 * @returns One failure line per silencing directive; empty when there is none.
 */
export function silencingDirectiveFailures(file: string, content: string): readonly string[] {
  return content.split('\n').flatMap((line, index) => {
    const key = SILENCING_DIRECTIVE.exec(line)?.[1];
    if (key === undefined) {
      return [];
    }
    const remedy =
      key === 'shell'
        ? 'remove the directive and add a shebang naming the shell instead'
        : 'fix the finding it hides and remove the directive';
    return [
      `${file}:${String(index + 1)}: a shellcheck ${key}= directive narrows what the gate ` +
        `reports; ${remedy}`,
    ];
  });
}

/**
 * The argv for `env` that runs the given shellcheck over exactly the given
 * files.
 *
 * `env -u SHELLCHECK_OPTS` drops the environment's options, which shellcheck
 * would otherwise prepend and a later flag could not undo (an `-e` exclusion
 * accumulates); `--norc` ignores any `.shellcheckrc`. The severity is stated,
 * so every finding, style included, fails. `--` keeps a file name from ever
 * reading as a flag.
 *
 * @param command - The shellcheck to run: a repo-relative path or a name on PATH.
 * @param files - Repo-relative shell script paths.
 * @returns Arguments for `env`.
 */
export function shellcheckArgs(command: string, files: readonly string[]): readonly string[] {
  return ['-u', 'SHELLCHECK_OPTS', command, '--norc', '--severity=style', '--', ...files];
}
