import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeErrorLine, writeLine } from '../src/core/terminal-output.js';
import { resolveTrustedGit } from '../src/core/trusted-git.js';
import {
  VALID_INDEX_DOCUMENT,
  VALID_MACHINE_DOCUMENT,
  VALID_SCOPE_DOCUMENT,
} from '../src/validators/operator-profile/operator-profile-fixtures.js';
import { hermeticGitEnv } from './hermetic-git-env.js';

/**
 * Sync smoke for the built `operator-profile-sync` entry against a temporary
 * profile repository under the OS temp dir (never the home directory): the
 * cure a conflicting pull prescribes, `push` after a union resolution,
 * completes, the one behaviour only real git can show (git refuses a
 * partial commit while a merge is in progress).
 *
 * The remote and the root each set a different `updated` date in the
 * index's frontmatter and append a different line to one scope document.
 * `conflict-marker-size` attributes make the scope document's markers three
 * characters long, and give the index a size of zero, which git reads as its
 * default of seven. Each side also changes a machine
 * document that holds a fenced marker-like line, in hunks git merges
 * cleanly. The root's push commits
 * locally and fails at the remote; the pull conflicts on the index and the
 * scope document. A push while those two still hold conflict markers is
 * refused by name (the frontmatter markers before the profile check reads
 * them), and leaves them unmerged; the cleanly merged machine document is
 * never searched. After the union resolution, the push concludes the merge
 * and the remote holds a merge commit with the later date and both lines.
 * The fixture's git and every entry run in a hermetic environment, so no
 * machine's git configuration can pass or fail this smoke.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const entry = (name: string) =>
  resolve(repoRoot, `agent-tools/dist/src/validators/operator-profile/${name}.js`);
const GIT = resolveTrustedGit();
const DOC = 'repos/engraphcode--open-curriculum-ecosystem.md';
const INDEX = 'index.md';
const MACHINE = 'machines/studio-laptop.md';
const THEIRS = '- The remote side adds this line.\n';
const OURS = '- The local side adds this line.\n';
const FENCED = `${VALID_MACHINE_DOCUMENT}\n\`\`\`text\n<<<<<<< a marker-like line as content\n\`\`\`\n`;
const dated = (date: string) =>
  VALID_INDEX_DOCUMENT.replace('updated: 2026-09-14', `updated: ${date}`);

const failures: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) {
    failures.push(message);
  }
}

function shown(run: SpawnSyncReturns<string>): string {
  return `${String(run.status)}\n${run.stdout}${run.stderr}`;
}

const base = mkdtempSync(join(tmpdir(), 'operator-profile-sync-merge-smoke-'));
const env = hermeticGitEnv(base);

/** Git for the fixture: the trusted binary, a fixed identity, the hermetic environment. */
function git(cwd: string, args: readonly string[]): string {
  const run = spawnSync(
    GIT,
    ['-c', 'user.name=Profile Smoke', '-c', 'user.email=profile-smoke@example.invalid', ...args],
    { cwd, env, encoding: 'utf8' },
  );
  if (run.status !== 0) {
    throw new Error(`fixture git ${args.join(' ')} failed: ${run.stderr}`);
  }
  return run.stdout.trim();
}

function sync(args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [entry('operator-profile-sync'), ...args], {
    cwd: repoRoot,
    env: {
      ...env,
      GIT_AUTHOR_NAME: 'Profile Smoke',
      GIT_AUTHOR_EMAIL: 'profile-smoke@example.invalid',
      GIT_COMMITTER_NAME: 'Profile Smoke',
      GIT_COMMITTER_EMAIL: 'profile-smoke@example.invalid',
    },
    encoding: 'utf8',
  });
}

try {
  const remote = join(base, 'remote.git');
  const seed = join(base, 'seed');
  const root = join(base, 'profile');
  mkdirSync(join(seed, 'repos'), { recursive: true });
  mkdirSync(join(seed, 'machines'), { recursive: true });

  git(base, ['init', '-q', '--bare', '-b', 'main', remote]);
  git(base, ['init', '-q', '-b', 'main', seed]);
  writeFileSync(join(seed, INDEX), VALID_INDEX_DOCUMENT, 'utf8');
  writeFileSync(join(seed, DOC), VALID_SCOPE_DOCUMENT, 'utf8');
  writeFileSync(join(seed, MACHINE), FENCED, 'utf8');
  writeFileSync(
    join(seed, '.gitattributes'),
    'index.md conflict-marker-size=0\nrepos/*.md conflict-marker-size=3\n',
    'utf8',
  );
  git(seed, ['add', '--', INDEX, DOC, MACHINE, '.gitattributes']);
  git(seed, ['commit', '-q', '-m', 'one: a conforming profile']);
  git(seed, ['remote', 'add', 'origin', remote]);
  git(seed, ['push', '-q', '-u', 'origin', 'main']);
  git(base, ['clone', '-q', remote, root]);

  writeFileSync(join(seed, INDEX), dated('2026-09-20'), 'utf8');
  writeFileSync(join(seed, DOC), `${VALID_SCOPE_DOCUMENT}${THEIRS}`, 'utf8');
  writeFileSync(join(seed, MACHINE), FENCED.replace('2026-10-06', '2026-10-07'), 'utf8');
  git(seed, ['commit', '-q', '-a', '-m', 'two: the remote side dates the index and adds lines']);
  git(seed, ['push', '-q', 'origin', 'main']);

  writeFileSync(join(root, INDEX), dated('2026-09-21'), 'utf8');
  writeFileSync(join(root, DOC), `${VALID_SCOPE_DOCUMENT}${OURS}`, 'utf8');
  writeFileSync(join(root, MACHINE), `${FENCED}${OURS}`, 'utf8');
  const first = sync(['push', '--root', root, '--message', 'smoke: the local side adds a line']);
  check(
    first.status === 1 && first.stderr.includes('the commits are local'),
    `the first push expected to commit locally and fail at the remote, got ${shown(first)}`,
  );

  const pulled = sync(['pull', '--root', root]);
  check(
    pulled.status === 1 && pulled.stderr.includes(INDEX) && pulled.stderr.includes(DOC),
    `the pull expected to report the conflicts in ${INDEX} and ${DOC}, got ${shown(pulled)}`,
  );

  const early = sync(['push', '--root', root, '--message', 'smoke: pushed before resolving']);
  check(
    early.status === 1 && early.stderr.includes(`${INDEX}, ${DOC} still hold a conflict marker`),
    `a push with the conflicts still marked expected a refusal naming ${INDEX} and ${DOC}, got ${shown(early)}`,
  );
  // The refusal comes before staging: staging a marked file would clear its
  // unmerged state, and the record of the conflict with it.
  const unmerged = git(root, ['diff', '--name-only', '--diff-filter=U']);
  check(
    unmerged.split('\n').includes(INDEX) && unmerged.split('\n').includes(DOC),
    `the refused push expected to leave ${INDEX} and ${DOC} unmerged, got unmerged paths [${unmerged}]`,
  );

  writeFileSync(join(root, INDEX), dated('2026-09-21'), 'utf8');
  writeFileSync(join(root, DOC), `${VALID_SCOPE_DOCUMENT}${THEIRS}${OURS}`, 'utf8');
  const resolved = sync(['push', '--root', root, '--message', 'smoke: the union of both lines']);
  check(resolved.status === 0, `the push after the union expected exit 0, got ${shown(resolved)}`);

  const parents = git(base, ['--git-dir', remote, 'log', '-1', '--format=%P', 'main']).split(' ');
  check(
    parents.length === 2,
    `the remote's tip expected a merge commit, got parents ${parents.join(' ')}`,
  );
  const pushed = git(base, ['--git-dir', remote, 'show', `main:${DOC}`]);
  check(
    pushed.includes(THEIRS.trim()) && pushed.includes(OURS.trim()),
    `the remote's document expected both lines, got\n${pushed}`,
  );
  const index = git(base, ['--git-dir', remote, 'show', `main:${INDEX}`]);
  check(
    index.includes('updated: 2026-09-21'),
    `the remote's index expected the later date, got\n${index}`,
  );
} finally {
  rmSync(base, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) {
    writeErrorLine(`operator-profile sync-merge smoke: ${failure}`);
  }
  process.exitCode = 1;
} else {
  writeLine(
    'operator-profile sync-merge smoke OK: a push with the conflicts still marked (one in frontmatter) was refused by name, a cleanly merged document was never searched, and the push after the union concluded the merge on the remote',
  );
}
