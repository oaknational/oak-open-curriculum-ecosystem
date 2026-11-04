import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { typeSafeEntries } from '@oaknational/type-helpers';

import { writeErrorLine, writeLine } from '../src/core/terminal-output.js';
import { resolveTrustedGit } from '../src/core/trusted-git.js';
import type { ContentId } from '../src/pr-watch/content-binding.js';
import { gitPatchIdOf } from '../src/pr-watch/content-reader.js';
import { hermeticGitEnv } from './hermetic-git-env.js';

/**
 * A validation check of the content binding's hasher against real git: it
 * runs the source under tsx, in a temporary repository under the OS temp
 * dir. A branch changes two files, one of them near the end of a long file;
 * the base then changes a third file and inserts a line at the top of the
 * long one; the branch syncs by merging the base. Each head's diff against
 * the base is taken as the compare endpoint gives it, the patch of
 * `merge-base(base, head)..head` that `git diff base...head` prints, and
 * hashed by `gitPatchIdOf`:
 *
 * - the head before the sync and the sync merge carry the same id although
 *   their diffs differ in index lines and hunk offsets, so a review of the
 *   one binds the other;
 * - a later change to either of the branch's files moves the id, and so does
 *   one that changes only whitespace (`--verbatim`: a whitespace change can
 *   change what code does);
 * - a diff that patch-id splits in two, and text that is not a diff, read as
 *   unproven, never as an id.
 */

const GIT = resolveTrustedGit();
const base = mkdtempSync(join(tmpdir(), 'pr-watch-content-binding-smoke-'));
const env = hermeticGitEnv(base);
const repo = join(base, 'repo');
const failures: string[] = [];
const LONG = Array.from({ length: 20 }, (_, index) => `line ${String(index + 1)}`);

function git(args: readonly string[]): string {
  const run = spawnSync(
    GIT,
    ['-c', 'user.name=Binding Smoke', '-c', 'user.email=binding-smoke@example.invalid', ...args],
    { cwd: repo, env, encoding: 'utf8' },
  );
  if (run.status !== 0) {
    throw new Error(`fixture git ${args.join(' ')} failed: ${run.stderr}`);
  }
  return run.stdout;
}

function commit(files: Readonly<Record<string, string>>, message: string): string {
  for (const [name, text] of typeSafeEntries(files)) {
    writeFileSync(join(repo, name), text, 'utf8');
    git(['add', '--', name]);
  }
  git(['commit', '-q', '-m', message]);
  return git(['rev-parse', 'HEAD']).trim();
}

const long = (lines: readonly string[]) => `${lines.join('\n')}\n`;
const diffOf = (head: string) => git(['diff', `main...${head}`]);
const shown = (content: ContentId) =>
  content.kind === 'id' ? content.id : `unproven (${content.reason})`;

function expectDifferent(what: string, id: ContentId, from: ContentId): void {
  if (id.kind !== 'id' || (from.kind === 'id' && id.id === from.id)) {
    failures.push(`${what} expected a different id, got ${shown(id)}`);
  }
}

function expectUnproven(what: string, id: ContentId): void {
  if (id.kind !== 'unproven') {
    failures.push(`${what} expected unproven, got ${shown(id)}`);
  }
}

try {
  const init = spawnSync(GIT, ['init', '-q', '-b', 'main', repo], { env, encoding: 'utf8' });
  if (init.status !== 0) {
    throw new Error(`fixture git init failed: ${init.stderr}`);
  }
  commit({ 'a.md': 'one\n', 'b.md': 'one\n', 'c.md': long(LONG) }, 'base: three files');
  git(['checkout', '-q', '-b', 'feature']);
  const edited = LONG.map((line, index) => (index === 17 ? 'line 18, edited' : line));
  const beforeSync = commit({ 'a.md': 'one\ntwo\n', 'c.md': long(edited) }, 'feature: two files');
  git(['checkout', '-q', 'main']);
  commit(
    { 'b.md': 'one\nthree\n', 'c.md': long(['line 0', ...LONG]) },
    'base: b, and a line atop c',
  );
  git(['checkout', '-q', 'feature']);
  git(['merge', '-q', '--no-edit', 'main']);
  const synced = git(['rev-parse', 'HEAD']).trim();
  const spaced = commit({ 'a.md': 'one\ntwo \n' }, 'feature: a trailing space');
  const moved = commit(
    {
      'c.md': long([
        'line 0',
        ...edited.map((line) => (line === 'line 19' ? 'line 19, edited' : line)),
      ]),
    },
    'feature: c changes again',
  );

  if (diffOf(beforeSync) === diffOf(synced)) {
    failures.push('the fixture expected the sync to move the diff’s index lines and hunk offsets');
  }
  const reviewed = gitPatchIdOf(diffOf(beforeSync));
  const head = gitPatchIdOf(diffOf(synced));
  if (reviewed.kind !== 'id' || head.kind !== 'id' || reviewed.id !== head.id) {
    failures.push(
      `the head before the sync and the sync merge expected one id, got ${shown(reviewed)} and ${shown(head)}`,
    );
  }
  expectDifferent('a whitespace change', gitPatchIdOf(diffOf(spaced)), head);
  expectDifferent('a change to the second file', gitPatchIdOf(diffOf(moved)), head);

  const hunk = 'diff --git a/f b/f\n--- a/f\n+++ b/f\n@@ -1 +1 @@\n-x\n';
  const split = `${hunk}+b\nstray\ndiff --git a/g b/g\n--- a/g\n+++ b/g\n@@ -1 +1 @@\n-x\n+y\n`;
  expectUnproven('a diff that patch-id splits in two', gitPatchIdOf(split));
  expectUnproven('text that is not a diff', gitPatchIdOf('this is not a diff\n'));
} finally {
  rmSync(base, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) {
    writeErrorLine(`pr-watch content-binding smoke: ${failure}`);
  }
  process.exitCode = 1;
} else {
  writeLine(
    'pr-watch content-binding smoke OK: a pure sync kept the patch-id across moved offsets, changes to either file and to whitespace moved it, and a split diff and a non-diff read as unproven',
  );
}
