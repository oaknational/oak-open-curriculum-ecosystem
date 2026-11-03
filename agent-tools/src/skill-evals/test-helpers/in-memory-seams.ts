import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@oaknational/result';

import type { CommandOutput, SkillEvalsSeams } from '../seams.js';

/**
 * An in-memory harness for the skill-evals seams: a file map, a runner fake
 * that writes the `--json` result it was asked for and names the case from
 * the `--case` glob it received, and output-port records for every effect.
 * The machine-local paths it composes never appear as literals in a test.
 */

/** The repository root every fixture path hangs from. */
export const REPO = '/repo';
/** The temporary plugin directory the fake hands out. */
export const PLUGIN = '/scratch/oce-skill-evals-x1';
/** The runner's scaffold directory, composed so no test carries the literal. */
export const SCAFFOLD = ['', 'private', 'tmp', 'e-run1'].join('/');
/** The workspace the runner reports as its cwd. */
const WORKSPACE = `${SCAFFOLD}/${['home', 'cwd'].join('/')}`;
/** The clock every run reads. */
const NOW = new Date('2026-09-27T11:05:00.500Z');
/** The runner's trace: a system line naming the workspace, then the result line naming the plugin. */
const TRACE = [
  JSON.stringify({ type: 'system', cwd: WORKSPACE }),
  JSON.stringify({ type: 'result', result: `done in ${PLUGIN}` }),
  '',
].join('\n');

/** The id the fake git gives a file's text: forty hex characters that change with the bytes, standing in for git's blob id. */
export function standInBlobId(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 40);
}

/** One recorded runner invocation. */
export interface RecordedRun {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
}

/** The harness: the files, the recorded effects, and the seams over them. */
export interface Harness {
  readonly files: Map<string, string>;
  /** The executable flag each write asked for. */
  readonly modes: Map<string, boolean>;
  readonly runs: RecordedRun[];
  readonly removed: string[];
  readonly seams: SkillEvalsSeams;
}

const fixture = JSON.stringify({
  skill_name: 'user-value',
  evals: [
    {
      id: 1,
      prompt: 'Rework the backlog.',
      expected_output: 'A model.',
      assertions: ['A is proposed'],
    },
  ],
});
const triggers = JSON.stringify([{ query: 'Rework these stories.', should_trigger: true }]);

/** The adapter the generator writes: frontmatter with the projected description, a pointer body. */
const ADAPTER = [
  '---',
  'name: oak-user-value',
  'description: "Express the use value."',
  '---',
  '',
  '# User Value (Claude Code)',
  '',
  'Read and follow `.agent/skills/planning/user-value/SKILL-CANONICAL.md`.',
  '',
].join('\n');

/** The canonical: its own frontmatter over the method. */
const CANONICAL = [
  '---',
  'name: user-value',
  'classification: active',
  'description: "Express the use value."',
  '---',
  '',
  '# User Value',
  '',
  'The method, with [its references](references/value-model.md).',
  '',
].join('\n');

/** A second skill the plugin can carry with --also, its adapter and canonical minimal. */
const PLAN_ADAPTER = '---\nname: oak-plan\ndescription: "Plan."\n---\n\nPointer.\n';
const PLAN_CANONICAL = '---\nname: plan\n---\n\n# Plan\n\nThe planning method.\n';

/** The runner's result for one invocation: the case named after the glob it was asked for. */
function runnerResultFor(caseGlob: string): string {
  const name = caseGlob.startsWith('case-') ? 'case-01' : 'trigger-01-fires';
  return JSON.stringify({
    claudeVersion: '2.1.283',
    costUsd: 0.5,
    partial: false,
    cases: [
      {
        name,
        arms: {
          with: [{ passed: true, score: 1, tracePath: `${SCAFFOLD}/out/trace.jsonl`, graders: [] }],
        },
      },
    ],
  });
}

/** The seed files: a skill with one case and one trigger example, its adapter, a second skill, an old result, a trace. */
function seedFiles(): Map<string, string> {
  return new Map<string, string>([
    [
      `${REPO}/agent-tools/package.json`,
      JSON.stringify({ name: '@oaknational/agent-tools', version: '0.1.0' }),
    ],
    [`${REPO}/.agent/skills/planning/user-value/evals/evals.json`, fixture],
    [`${REPO}/.agent/skills/planning/user-value/evals/trigger-validation.json`, triggers],
    [`${REPO}/.agent/skills/planning/user-value/SKILL-CANONICAL.md`, CANONICAL],
    [`${REPO}/.agent/skills/planning/user-value/evals/results/old/manifest.json`, '{}'],
    [`${REPO}/.claude/skills/oak-user-value/SKILL.md`, ADAPTER],
    [`${REPO}/.claude/skills/oak-user-value/references/value-model.md`, '# Value model\n'],
    [`${REPO}/.agent/skills/planning/plan/SKILL-CANONICAL.md`, PLAN_CANONICAL],
    [`${REPO}/.claude/skills/oak-plan/SKILL.md`, PLAN_ADAPTER],
    [`${SCAFFOLD}/out/trace.jsonl`, TRACE],
  ]);
}

/** A harness whose runner exits with `runnerExit` on every invocation. */
export function harness(runnerExit = 0): Harness {
  const files = seedFiles();
  const modes = new Map<string, boolean>();
  const runs: RecordedRun[] = [];
  const removed: string[] = [];
  const dirs = new Set<string>();
  const listFiles = (dir: string): Result<readonly string[], Error> =>
    ok(
      [...files.keys()]
        .filter((path) => path.startsWith(`${dir}/`))
        .map((path) => path.slice(dir.length + 1))
        .toSorted((a, b) => a.localeCompare(b, 'en')),
    );
  const seams: SkillEvalsSeams = {
    readText: (path) => ok(files.get(path)),
    listFiles,
    writeText: (path, content, executable) => {
      files.set(path, content);
      modes.set(path, executable);
      return ok(undefined);
    },
    makeTempDir: () => ok(PLUGIN),
    makeFreshDir: (path) => {
      if (dirs.has(path) || [...files.keys()].some((file) => file.startsWith(`${path}/`))) {
        return err(new Error(`${path} exists`));
      }
      dirs.add(path);
      return ok(undefined);
    },
    removeDir: (path) => {
      removed.push(path);
      return ok(undefined);
    },
    run: (command, args, cwd): Result<CommandOutput, Error> => {
      runs.push({ command, args, cwd });
      files.set(
        args[args.indexOf('--json') + 1] ?? '',
        runnerResultFor(args[args.indexOf('--case') + 1] ?? ''),
      );
      return ok({ exitCode: runnerExit });
    },
    // git's contract: one id per path, in path order.
    blobIds: (dir, paths) =>
      ok(paths.map((path) => standInBlobId(files.get(`${dir}/${path}`) ?? ''))),
    gitState: () => ok({ head: 'deadbeef', clean: false }),
    now: () => NOW,
  };
  return { files, modes, runs, removed, seams };
}

/** Seams that refuse every effect; a caller that touches none of them proves it by exiting 0. */
export function refusingSeams(): SkillEvalsSeams {
  const refused = <T>(): Result<T, Error> => err(new Error('must not run'));
  return {
    readText: refused,
    listFiles: refused,
    writeText: refused,
    makeTempDir: refused,
    makeFreshDir: refused,
    removeDir: refused,
    run: refused,
    blobIds: refused,
    gitState: refused,
    now: () => NOW,
  };
}

/** A capturing writer for stdout or stderr. */
export function capture(): {
  readonly write: (chunk: string) => boolean;
  readonly text: () => string;
} {
  let text = '';
  return {
    write(chunk: string): boolean {
      text += chunk;
      return true;
    },
    text: () => text,
  };
}
