import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { TrackedTreeReading } from './repo-check-files.js';
import { BASH_FLOOR_GUARD } from './repo-check-shellcheck-files.js';
import type { ShellcheckGateRuntime } from './repo-check-shellcheck-runtime.js';
import { REPO_SHELLCHECK } from './repo-check-shellcheck-version.js';
import { runShellcheckTracked } from './repo-check-shellcheck.js';
import { SKILLS_LOCK } from './repo-check-skills-lock.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';

/**
 * The shellcheck gate's composition, driven through its injected runtime. The
 * edges answer from the fixture: the installer's text, whether the
 * repository's shellcheck is installed, the version probe, git's reading of
 * the tracked tree, and git's index reads (an empty blob unless the fixture
 * names one). `readHead`, `readText` and `readSkillsLock` model the file
 * system, a file's text by its name and a head of at most the bytes asked for
 * (the fixtures are ASCII, so a character is a byte). `runEnv` models
 * shellcheck's exit contract: it exits 1 when any file among its arguments is
 * one the fixture says shellcheck reports a finding in, and 0 otherwise. Each
 * test reads only what an operator sees: the status the gate returns and the
 * lines it writes. What a probe, a path, a lock or a script maps to is the
 * pure modules' (`repo-check-shellcheck-files.unit.test.ts`,
 * `repo-check-shellcheck-version.unit.test.ts`,
 * `repo-check-skills-lock.unit.test.ts`); the real edges are proved by the
 * gate running over this repository (`pnpm lint:shell`). The flags that keep
 * a `.shellcheckrc` and `SHELLCHECK_OPTS` out of the run were proved against
 * the real binary when the second estate's gate landed.
 */

const GATE_PREFIX = 'repo-check shellcheck-tracked: ';

const INSTALLER = '#!/usr/bin/env bash\nSHELLCHECK_VERSION=0.11.0\n';

const PROBE_0_11_0: RepoCheckCommandResult = {
  status: 0,
  signal: null,
  stdout: 'version: 0.11.0\n',
  stderr: '',
};

/** What `--version` answers for a command that is not installed. */
const NOT_INSTALLED: RepoCheckCommandResult = {
  status: 127,
  signal: null,
  stdout: '',
  stderr: 'command not found\n',
};

const GUARDED_BASH = `#!/usr/bin/env bash\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho run\n`;

const VENDORED_SCRIPT = '.agents/skills/vendored-skill/scripts/run.sh';

const LOCK = JSON.stringify({
  version: 1,
  skills: { 'vendored-skill': { source: 'upstream', computedHash: 'a'.repeat(64) } },
});

/** Tracked files and their text: a hook, a bash script and a sourced library to lint, a node script, a document and the skills lock to leave out. */
const TREE: ReadonlyMap<string, string> = new Map([
  ['.husky/pre-push', '#!/usr/bin/env sh\npnpm check\n'],
  ['README.md', '# Readme\n'],
  ['bin/run', GUARDED_BASH],
  ['bin/tool', '#!/usr/bin/env node\nconsole.log("tool");\n'],
  ['lib/common.sh', 'greet() { echo hi; }\n'],
  [SKILLS_LOCK, LOCK],
]);

/** A tree less its skills lock. */
function withoutLock(tree: ReadonlyMap<string, string>): ReadonlyMap<string, string> {
  return new Map([...tree].filter(([file]) => file !== SKILLS_LOCK));
}

/** What the gate writes before it lints, naming the shellcheck and how many scripts it lints. */
function linting(count: number, source = 'the shellcheck on PATH'): string {
  return `${GATE_PREFIX}shellcheck 0.11.0 (${source}) over ${String(count)} tracked shell scripts`;
}

/** git's reading of a tree whose working copy has lost the `gone` files with the change unstaged. */
function readingOf(
  tree: ReadonlyMap<string, string>,
  gone: readonly string[] = [],
): Result<TrackedTreeReading, string> {
  return ok({
    tracked: [...tree.keys(), ...gone],
    goneFromWorkingTree: new Set(gone),
    symlinks: new Set<string>(),
  });
}

interface GateFixture {
  readonly installer: string;
  /** What `--version` answers for each shellcheck command, the one on PATH and the repo-scoped one. */
  readonly probes: ReadonlyMap<string, RepoCheckCommandResult>;
  /** Each file's text in the working tree. */
  readonly tree: ReadonlyMap<string, string>;
  readonly trackedTree: Result<TrackedTreeReading, string>;
  /** The tracked files shellcheck reports a finding in. */
  readonly findings: ReadonlySet<string>;
  readonly repoShellcheck: boolean;
  /** What git's index read answers for a file, when not an empty blob. */
  readonly indexReads: ReadonlyMap<string, Result<string, string>>;
}

const DEFAULTS: GateFixture = {
  installer: INSTALLER,
  probes: new Map([
    ['shellcheck', PROBE_0_11_0],
    [REPO_SHELLCHECK, PROBE_0_11_0],
  ]),
  tree: TREE,
  trackedTree: readingOf(TREE),
  findings: new Set(),
  repoShellcheck: false,
  indexReads: new Map(),
};

/** The fixture fields for a working tree and git's reading of it. */
function withTree(
  entries: readonly (readonly [string, string])[],
  gone: readonly string[] = [],
): Pick<GateFixture, 'tree' | 'trackedTree'> {
  const tree = new Map([...TREE, ...entries]);
  return { tree, trackedTree: readingOf(tree, gone) };
}

/** A runtime over the fixture, collecting the two output streams, since what the gate writes is its behaviour. */
function gateRuntime(overrides: Partial<GateFixture> = {}) {
  const fixture: GateFixture = { ...DEFAULTS, ...overrides };
  const lines: string[] = [];
  const failures: string[] = [];
  const runtime: ShellcheckGateRuntime = {
    readInstaller: () => fixture.installer,
    hasRepoShellcheck: () => fixture.repoShellcheck,
    probeVersion: (command) => fixture.probes.get(command) ?? NOT_INSTALLED,
    trackedTree: () => fixture.trackedTree,
    readSkillsLock: () => fixture.tree.get(SKILLS_LOCK),
    readHead: (file, bytes) => (fixture.tree.get(file) ?? '').slice(0, bytes),
    readIndexHead: (file) => fixture.indexReads.get(file) ?? ok(''),
    readText: (file) => fixture.tree.get(file) ?? '',
    runEnv: (args) =>
      Promise.resolve(Number(args.some((argument) => fixture.findings.has(argument)))),
    writeLine: (line) => lines.push(line),
    writeFailure: (line) => failures.push(line),
  };
  return { runtime, lines, failures };
}

describe('runShellcheckTracked', () => {
  it('lints the shell scripts among the tracked files with the shellcheck on PATH, and passes a clean lint', async () => {
    const { runtime, lines, failures } = gateRuntime();

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(lines).toStrictEqual([linting(3)]);
    expect(failures).toStrictEqual([]);
  });

  it('runs the repo-scoped shellcheck when the installer has put one in .tools/bin, whatever PATH holds', async () => {
    // The shellcheck on PATH is the wrong version: only the repo-scoped one passes the pin.
    const probes = new Map([
      [REPO_SHELLCHECK, PROBE_0_11_0],
      ['shellcheck', { ...PROBE_0_11_0, stdout: 'version: 0.9.0\n' }],
    ]);
    const { runtime, lines } = gateRuntime({ repoShellcheck: true, probes });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(lines).toStrictEqual([linting(3, REPO_SHELLCHECK)]);
  });

  it.each(['bin/run', '.husky/pre-push', 'lib/common.sh'])(
    'fails when shellcheck reports a finding in %s, a script it lints',
    async (script) => {
      const { runtime } = gateRuntime({ findings: new Set([script]) });

      await expect(runShellcheckTracked(runtime)).resolves.toBe(1);
    },
  );

  it.each(['bin/tool', 'README.md'])(
    'passes when the only finding is in %s, which is not a shell script',
    async (file) => {
      const { runtime } = gateRuntime({ findings: new Set([file]) });

      await expect(runShellcheckTracked(runtime)).resolves.toBe(0);
    },
  );

  it('leaves out a vendored skill the lock pins: neither its finding, its shebang nor its floor fails the gate', async () => {
    const { runtime, lines, failures } = gateRuntime({
      ...withTree([[VENDORED_SCRIPT, '#!/bin/bash\necho $1\n']]),
      findings: new Set([VENDORED_SCRIPT]),
    });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(lines).toStrictEqual([linting(3)]);
    expect(failures).toStrictEqual([]);
  });

  it('lints a skill written here, which the lock does not pin', async () => {
    const local = '.agents/skills/local-skill/scripts/run.sh';
    const { runtime, lines } = gateRuntime({
      ...withTree([[local, GUARDED_BASH]]),
      findings: new Set([local]),
    });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([linting(4)]);
  });

  it('lints every skill when the repository has no lock', async () => {
    const tree = withoutLock(withTree([[VENDORED_SCRIPT, GUARDED_BASH]]).tree);
    const { runtime } = gateRuntime({
      tree,
      trackedTree: readingOf(tree),
      findings: new Set([VENDORED_SCRIPT]),
    });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);
  });

  it.each([
    ['git does not track', (tree: ReadonlyMap<string, string>) => readingOf(withoutLock(tree))],
    [
      'git tracks as a link',
      (tree: ReadonlyMap<string, string>): Result<TrackedTreeReading, string> =>
        ok({
          tracked: [...tree.keys()],
          goneFromWorkingTree: new Set<string>(),
          symlinks: new Set([SKILLS_LOCK]),
        }),
    ],
  ])(
    'lints every skill when the lock on disk is one %s, which no commit carries',
    async (_case, reading) => {
      const { tree } = withTree([[VENDORED_SCRIPT, GUARDED_BASH]]);
      const { runtime, lines } = gateRuntime({
        tree,
        trackedTree: reading(tree),
        findings: new Set([VENDORED_SCRIPT]),
      });

      await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

      expect(lines).toStrictEqual([linting(4)]);
    },
  );

  it('fails an unrecognised shebang, naming the file and its line, and still lints the recognised scripts', async () => {
    const { runtime, lines, failures } = gateRuntime(
      withTree([['bin/quoted', '#!/usr/bin/env -S "bash" -e\necho quoted\n']]),
    );

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([linting(3)]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/quoted:1: the shebang `#!\/usr\/bin\/env -S "bash" -e` is not a recognised form;/u,
      ),
    ]);
  });

  it('names the whole of an unrecognised shebang line as long as macOS honours, 512 bytes', async () => {
    // `#!/` (3 bytes), 100 directories of `long/` (500), `bin/bash` (8), then the newline.
    const longShebang = `#!/${'long/'.repeat(100)}bin/bash`;
    const { runtime, failures } = gateRuntime(
      withTree([['bin/long', `${longShebang}\necho long\n`]]),
    );

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(failures).toStrictEqual([
      expect.stringContaining(`${GATE_PREFIX}bin/long:1: the shebang \`${longShebang}\` is not`),
    ]);
  });

  it('fails a disable directive in a script whose lint is clean', async () => {
    const { runtime, lines, failures } = gateRuntime(
      withTree([
        [
          'bin/run',
          `#!/usr/bin/env bash\n# shellcheck disable=SC2086\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho $1\n`,
        ],
      ]),
    );

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([linting(3)]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: bin\/run:2: /u),
    ]);
  });

  it('fails a bash script that lacks the bash floor guard', async () => {
    const { runtime, lines, failures } = gateRuntime(
      withTree([['bin/run', '#!/usr/bin/env bash\necho run\n']]),
    );

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([linting(3)]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/run: a bash script's first command /u,
      ),
    ]);
  });
});

describe('runShellcheckTracked before it lints', () => {
  it('fails before linting when the installer pins no version', async () => {
    const { runtime, lines, failures } = gateRuntime({ installer: '#!/usr/bin/env bash\n' });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: .*SHELLCHECK_VERSION/u),
    ]);
  });

  it('fails before linting when the shellcheck it resolved is another version', async () => {
    const probes = new Map([['shellcheck', { ...PROBE_0_11_0, stdout: 'version: 0.9.0\n' }]]);
    const { runtime, lines, failures } = gateRuntime({ probes });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: the shellcheck on PATH is shellcheck 0\.9\.0,/u,
      ),
    ]);
  });

  it("fails before linting when git's read fails, saying the gate checked nothing", async () => {
    const { runtime, lines, failures } = gateRuntime({
      trackedTree: err('git listed no tracked file; run the gate from the repository root'),
    });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: .*; the gate checked nothing$/u),
    ]);
  });

  it.each([
    [REPO_SHELLCHECK, 'a file under it'],
    ['.tools', 'a link at its name'],
    ['.TOOLS/bin/shellcheck', 'a file under it in another case'],
  ])('fails before linting when %s, %s, is tracked, naming it', async (path) => {
    const { runtime, lines, failures } = gateRuntime(
      withTree([[path, '#!/usr/bin/env sh\nexit 0\n']]),
    );

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      `${GATE_PREFIX}${path}: .tools is the ignored directory the installer writes and the gate runs its shellcheck from, so nothing at or in it is tracked; untrack these`,
    ]);
  });

  it.each([
    ['bin/lost.sh', 'whose path makes it shell', new Map()],
    ['bin/lost', 'whose index content is a bash script', new Map([['bin/lost', ok(GUARDED_BASH)]])],
    [
      'bin/lost',
      'whose index content cannot be read',
      new Map([['bin/lost', err('fatal: bad object')]]),
    ],
    [
      'bin/lost',
      'whose index content carries a shebang the gate refuses',
      new Map([['bin/lost', ok('#!/bin/bash\necho $1\n')]]),
    ],
  ])(
    'fails before linting a tracked file %s the working tree has lost, %s, naming it',
    async (lost, _case, indexReads) => {
      // `git add bin/lost; rm bin/lost`: a commit carries a script the gate cannot read.
      const { runtime, lines, failures } = gateRuntime({ ...withTree([], [lost]), indexReads });

      await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

      expect(lines).toStrictEqual([]);
      expect(failures).toStrictEqual([
        expect.stringContaining(`cannot read: ${lost}. Stage the change or `),
      ]);
    },
  );

  it("passes when the only file the working tree has lost is not a shell script, such as a peer's staged deletion a pathspec commit's index still names", async () => {
    const { runtime, lines } = gateRuntime({
      ...withTree([], ['notes/peer.txt']),
      indexReads: new Map([['notes/peer.txt', ok('Notes.\n')]]),
    });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(lines).toStrictEqual([linting(3)]);
  });

  it('passes when the only file the working tree has lost is in a vendored skill', async () => {
    const { runtime, lines } = gateRuntime(withTree([], [VENDORED_SCRIPT]));

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(lines).toStrictEqual([linting(3)]);
  });

  it('fails before linting when the skills lock is not JSON', async () => {
    const { runtime, lines, failures } = gateRuntime(withTree([[SKILLS_LOCK, '{ "skills": ']]));

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: skills-lock\.json is not JSON /u),
    ]);
  });

  it('fails before linting when git lists no shell scripts', async () => {
    const tree = new Map([['README.md', '# Readme\n']]);
    const { runtime, lines, failures } = gateRuntime({ tree, trackedTree: readingOf(tree) });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: .*no tracked shell scripts/u),
    ]);
  });

  it('still names each refused shebang when git lists no shell scripts', async () => {
    const tree = new Map([['bin/legacy', '#!/bin/bash\necho legacy\n']]);
    const { runtime, lines, failures } = gateRuntime({ tree, trackedTree: readingOf(tree) });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/legacy:1: the shebang `#!\/bin\/bash` is not/u,
      ),
      expect.stringMatching(/^repo-check shellcheck-tracked: .*no tracked shell scripts/u),
    ]);
  });
});
