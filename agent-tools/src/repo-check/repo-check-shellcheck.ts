import { err, ok, type Result } from '@oaknational/result';

import { trackedCheckFiles, type TrackedTreeReading } from './repo-check-files.js';
import { lostFilesRefusal, unstagedLoss } from './repo-check-gates.js';
import {
  bashFloorFailures,
  silencingDirectiveFailures,
  isShellScript,
  shebangFailures,
  shellcheckArgs,
} from './repo-check-shellcheck-files.js';
import {
  defaultShellcheckGateRuntime,
  type ShellcheckGateRuntime,
} from './repo-check-shellcheck-runtime.js';
import {
  pinnedShellcheckVersion,
  resolveShellcheck,
  shellcheckVersion,
} from './repo-check-shellcheck-version.js';
import { isInsideAny, lockedSkillRoots, SKILLS_LOCK } from './repo-check-skills-lock.js';

/**
 * The shellcheck gate: every tracked shell script, linted by the pinned
 * shellcheck, failing on any finding at any severity.
 *
 * shellcheck is a system binary, not a package dependency, so the gate reads
 * the pin from the installer, runs the repository's `.tools/bin` shellcheck
 * when the installer has put one there and the shellcheck on PATH otherwise,
 * and asks it for its version: a missing, foreign or other-version shellcheck
 * fails the gate with the remedy. The universe is git's tracked tree
 * (`repo-check-universe.ts`), less the vendored skills a tracked `skills-lock.json` pins
 * (`repo-check-skills-lock.ts`), and a tracked shell script the working tree
 * has lost with the change unstaged fails the gate by name, since a commit
 * carries content the gate cannot read. Whether a lost file is a script, or
 * carries a shebang the gate refuses, is read from the index git commits, not
 * the disk, so a lost file of any other kind, such as a peer's staged deletion
 * that a pathspec commit's index still names, is not refused. Each file's opening bytes (`HEAD_BYTES`) are read to
 * classify its shebang, which finds the extensionless scripts and fails any
 * shebang the classification refuses (an unrecognised form, or a non-shell
 * form on a file whose path makes it shell), and each script is read for
 * directives that would silence the lint. The pure verdicts live in
 * `repo-check-shellcheck-files.ts` and `repo-check-shellcheck-version.ts`, and
 * the edges in `repo-check-shellcheck-runtime.ts`. Paths are relative to the
 * working directory, which agent-tools' `repo-check` script sets to the
 * repository root (`cd ..`).
 *
 * `env` runs by its absolute path, `/usr/bin/env`, on every host the installer
 * pins. `shellcheck`, when no repository binary is installed, resolves through
 * PATH, as `gitleaks` does for the secrets leg. The gate is a lint, not a trust
 * boundary: whoever can write a PATH directory already runs code through every
 * tool resolved by name, and the version check pins what a run reports, not
 * which binary produced it. A tracked `.tools` path, in any case and whether
 * a directory or a link, fails the gate before any shellcheck runs, since the
 * gate would run a tracked `.tools/bin/shellcheck` as the pin.
 *
 * @packageDocumentation
 */

const GATE = 'repo-check shellcheck-tracked';

/**
 * The ignored directory the installer writes: nothing at it or in it is ever
 * tracked, whatever its case (a case-insensitive disk resolves `.TOOLS` to
 * it) and whether it is a directory or a link to one.
 */
const REPO_TOOLS_PATH = /^\.tools(?:\/|$)/iu;

/**
 * Enough bytes to hold any shebang line a supported kernel honours, its
 * newline included. macOS runs a `#!` line of up to 512 bytes (XNU's
 * `IMG_SHSIZE`; on macOS 26.6 a 512-byte line ran and a 513-byte line failed
 * with ENOEXEC), and Linux reads the first 256 (`BINPRM_BUF_SIZE`), so the
 * whole line naming a script's interpreter is within its first 512 bytes, and
 * a failure quotes all of any shebang line macOS honours.
 */
const HEAD_BYTES = 512;

/** Write each failure line under the gate's name and return the failing status. */
function fail(runtime: ShellcheckGateRuntime, lines: readonly string[]): number {
  for (const line of lines) {
    runtime.writeFailure(`${GATE}: ${line}`);
  }
  return 1;
}

/** The pinned shellcheck to run and the version it reported, or why the gate cannot run it. */
function probedShellcheck(
  runtime: ShellcheckGateRuntime,
): Result<{ readonly command: string; readonly source: string; readonly version: string }, string> {
  const pinned = pinnedShellcheckVersion(runtime.readInstaller());
  if (!pinned.ok) {
    return err(pinned.error);
  }
  const shellcheck = resolveShellcheck(runtime.hasRepoShellcheck());
  const version = shellcheckVersion(
    runtime.probeVersion(shellcheck.command),
    pinned.value,
    shellcheck.source,
  );
  return version.ok ? ok({ ...shellcheck, version: version.value }) : err(version.error);
}

/**
 * The skills lock's text when git tracks it as a file the working tree holds.
 * A lock git does not track excludes nothing, since no commit carries it and
 * every other checkout lints what it names; nor does a tracked link, whose
 * target the commit does not carry.
 */
function trackedSkillsLock(
  runtime: ShellcheckGateRuntime,
  tree: TrackedTreeReading,
): string | undefined {
  return trackedCheckFiles(tree).includes(SKILLS_LOCK) ? runtime.readSkillsLock() : undefined;
}

/** The tracked tree less the vendored skills' files, or why the gate cannot read it. */
function trackedTreeOutsideVendored(
  runtime: ShellcheckGateRuntime,
): Result<{ readonly tree: TrackedTreeReading; readonly vendored: readonly string[] }, string> {
  const tree = runtime.trackedTree();
  if (!tree.ok) {
    return err(`${tree.error}; the gate checked nothing`);
  }
  const tools = tree.value.tracked.filter((file) => REPO_TOOLS_PATH.test(file));
  if (tools.length > 0) {
    return err(
      `${tools.join(', ')}: .tools is the ignored directory the installer writes and the gate runs its shellcheck from, so nothing at or in it is tracked; untrack these`,
    );
  }
  const vendored = lockedSkillRoots(trackedSkillsLock(runtime, tree.value));
  return vendored.ok ? ok({ tree: tree.value, vendored: vendored.value }) : err(vendored.error);
}

/**
 * Whether a file the working tree has lost is one the gate would lint or
 * refuse a shebang in, read from the content git's index holds for it, which
 * is what a commit carries. A file whose index content git cannot read counts,
 * so the gate fails closed.
 */
function lostFileWouldBeChecked(runtime: ShellcheckGateRuntime, file: string): boolean {
  const head = runtime.readIndexHead(file, HEAD_BYTES);
  return (
    !head.ok || isShellScript(file, head.value) || shebangFailures(file, head.value).length > 0
  );
}

/**
 * Each tracked file's opening bytes, less the vendored skills' files; or why
 * the gate cannot read them: git's read failed, a `.tools` path is tracked,
 * the skills lock cannot be read, or the working tree has lost tracked files
 * the gate would lint or refuse, with the change unstaged (a commit carries
 * content the gate cannot read).
 */
function trackedHeads(
  runtime: ShellcheckGateRuntime,
): Result<readonly { readonly file: string; readonly head: string }[], string> {
  const read = trackedTreeOutsideVendored(runtime);
  if (!read.ok) {
    return read;
  }
  const { tree, vendored } = read.value;
  const lost = unstagedLoss(tree)
    .filter((file) => !isInsideAny(file, vendored))
    .filter((file) => lostFileWouldBeChecked(runtime, file));
  return lost.length > 0
    ? err(lostFilesRefusal(lost))
    : ok(
        trackedCheckFiles(tree)
          .filter((file) => !isInsideAny(file, vendored))
          .map((file) => ({ file, head: runtime.readHead(file, HEAD_BYTES) })),
      );
}

/** shellcheck over every tracked shell script (the root `lint:shell` gate). */
export async function runShellcheckTracked(
  runtime: ShellcheckGateRuntime = defaultShellcheckGateRuntime,
): Promise<number> {
  const heads = trackedHeads(runtime);
  if (!heads.ok) {
    return fail(runtime, [heads.error]);
  }
  const shellcheck = probedShellcheck(runtime);
  if (!shellcheck.ok) {
    return fail(runtime, [shellcheck.error]);
  }
  const scripts = heads.value
    .filter(({ file, head }) => isShellScript(file, head))
    .map(({ file }) => file);
  const shebangs = heads.value.flatMap(({ file, head }) => shebangFailures(file, head));
  if (scripts.length === 0) {
    return fail(runtime, [
      ...shebangs,
      'git lists no tracked shell scripts; run the gate from the repository root',
    ]);
  }
  runtime.writeLine(
    `${GATE}: shellcheck ${shellcheck.value.version} (${shellcheck.value.source}) over ` +
      `${String(scripts.length)} tracked shell scripts`,
  );
  const texts = scripts.map((file) => ({ file, text: runtime.readText(file) }));
  const directives = texts.flatMap(({ file, text }) => silencingDirectiveFailures(file, text));
  const floors = texts.flatMap(({ file, text }) => bashFloorFailures(file, text));
  const status = await runtime.runEnv(shellcheckArgs(shellcheck.value.command, scripts));
  const refusals = [...shebangs, ...directives, ...floors];
  return refusals.length > 0 ? fail(runtime, refusals) : status;
}
