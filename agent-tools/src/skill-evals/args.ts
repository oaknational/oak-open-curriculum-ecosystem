import { scanArgs, standardFlags } from '../core/cli-arg-parser.js';

/**
 * The argument grammar of `skill-evals`: `run` executes a skill's declared
 * evals through the host runner and retains the evidence; `project` writes
 * the projected suite for inspection without running it.
 *
 * @packageDocumentation
 */

/** Which of the two declared suites to execute. */
export type SuiteSelection = 'all' | 'cases' | 'triggers';

/** The ablation modes the runner accepts. */
export type Ablation = 'with-without' | 'none';

/** One skill the plugin carries: its canonical directory and the host skill name the Skill tool sees. */
export interface SkillSelection {
  /** The canonical skill directory, relative to the repository root. */
  readonly skill: string;
  /** The host skill name, e.g. `oak-user-value`. */
  readonly hostSkill: string;
}

/** The parsed invocation. */
export interface SkillEvalsArgs {
  command: 'run' | 'project' | undefined;
  /** The canonical skill directory, relative to the repository root. */
  skill: string | undefined;
  /** The host skill name the Skill tool sees, e.g. `oak-user-value`. */
  hostSkill: string | undefined;
  /** Skills carried beside the one under evaluation, for a case that exercises a handoff. */
  also: SkillSelection[];
  /** For `project`: where the suite is written. */
  out: string | undefined;
  suite: SuiteSelection;
  ablation: Ablation;
  runs: number;
  maxTurns: number;
  triggerMaxTurns: number;
  timeoutSeconds: number;
  maxCostUsd: number | undefined;
  judgeModel: string | undefined;
  model: string | undefined;
  caseGlob: string | undefined;
  keepPlugin: boolean;
  json: boolean;
  help: boolean;
  error: string | undefined;
}

export const USAGE = [
  'skill-evals run --skill <canonical dir> --host-skill <name> [--also <canonical dir>=<name>]...',
  '  [--suite all|cases|triggers] [--ablation with-without|none] [--runs <n>] [--max-cost-usd <usd>]',
  '  [--judge-model <m>] [--model <m>] [--case <glob>] [--max-turns <n>] [--trigger-max-turns <n>]',
  '  [--timeout-seconds <n>] [--keep-plugin] [--json]',
  'skill-evals project --skill <canonical dir> --host-skill <name> [--also ...] --out <dir>',
  "  run: project the skill's evals/evals.json and evals/trigger-validation.json into a temporary",
  '  plugin, execute them with `claude plugin eval` (the cases with the ablation, the triggers',
  '  without one), and retain the results, traces, answers and a manifest under',
  '  <canonical dir>/evals/results/<started-at>/ with every machine-local path scrubbed.',
  '  --also carries another skill in the plugin, so a case that declares skills_expected can',
  '  exercise a handoff to it. project: write the same projection to --out for inspection;',
  '  nothing runs.',
  '  Exit 0 done; exit 1 an operational refusal (named); exit 2 usage.',
].join('\n');

const POSITIVE_INTEGER = /^[1-9]\d*$/u;
const NON_NEGATIVE_NUMBER = /^\d+(?:\.\d+)?$/u;

function integerOption(
  field: 'runs' | 'maxTurns' | 'triggerMaxTurns' | 'timeoutSeconds',
  flag: string,
) {
  return (state: SkillEvalsArgs, value: string): void => {
    if (!POSITIVE_INTEGER.test(value)) {
      state.error = `${flag} needs a positive integer, got '${value}'`;
      return;
    }
    state[field] = Number(value);
  };
}

const VALUE_OPTIONS = {
  '--skill': (state: SkillEvalsArgs, value: string): void => {
    state.skill = value;
  },
  '--host-skill': (state: SkillEvalsArgs, value: string): void => {
    state.hostSkill = value;
  },
  '--also': (state: SkillEvalsArgs, value: string): void => {
    const separator = value.indexOf('=');
    const skill = value.slice(0, separator);
    const hostSkill = value.slice(separator + 1);
    if (separator === -1 || skill.length === 0 || hostSkill.length === 0) {
      state.error = `--also needs <canonical dir>=<host skill name>, got '${value}'`;
      return;
    }
    state.also.push({ skill, hostSkill });
  },
  '--out': (state: SkillEvalsArgs, value: string): void => {
    state.out = value;
  },
  '--suite': (state: SkillEvalsArgs, value: string): void => {
    if (value !== 'all' && value !== 'cases' && value !== 'triggers') {
      state.error = `--suite must be all, cases or triggers, got '${value}'`;
      return;
    }
    state.suite = value;
  },
  '--ablation': (state: SkillEvalsArgs, value: string): void => {
    if (value !== 'with-without' && value !== 'none') {
      state.error = `--ablation must be with-without or none, got '${value}'`;
      return;
    }
    state.ablation = value;
  },
  '--runs': integerOption('runs', '--runs'),
  '--max-turns': integerOption('maxTurns', '--max-turns'),
  '--trigger-max-turns': integerOption('triggerMaxTurns', '--trigger-max-turns'),
  '--timeout-seconds': integerOption('timeoutSeconds', '--timeout-seconds'),
  '--max-cost-usd': (state: SkillEvalsArgs, value: string): void => {
    if (!NON_NEGATIVE_NUMBER.test(value)) {
      state.error = `--max-cost-usd needs a number, got '${value}'`;
      return;
    }
    state.maxCostUsd = Number(value);
  },
  '--judge-model': (state: SkillEvalsArgs, value: string): void => {
    state.judgeModel = value;
  },
  '--model': (state: SkillEvalsArgs, value: string): void => {
    state.model = value;
  },
  '--case': (state: SkillEvalsArgs, value: string): void => {
    state.caseGlob = value;
  },
};

function requiredMissing(state: SkillEvalsArgs): string | undefined {
  if (state.command === undefined) {
    return 'a command is required: run or project';
  }
  if (state.skill === undefined || state.hostSkill === undefined) {
    return `${state.command} needs --skill <canonical dir> and --host-skill <name>`;
  }
  if (state.command === 'project' && state.out === undefined) {
    return 'project needs --out <dir>';
  }
  return undefined;
}

/** The run limits an invocation starts from; every one is overridable by its option. */
export const SKILL_EVALS_DEFAULTS = {
  suite: 'all',
  ablation: 'with-without',
  runs: 1,
  maxTurns: 12,
  triggerMaxTurns: 4,
  timeoutSeconds: 600,
} as const satisfies Pick<
  SkillEvalsArgs,
  'suite' | 'ablation' | 'runs' | 'maxTurns' | 'triggerMaxTurns' | 'timeoutSeconds'
>;

function initialState(first: string | undefined): SkillEvalsArgs {
  return {
    command: first === 'run' || first === 'project' ? first : undefined,
    skill: undefined,
    hostSkill: undefined,
    also: [],
    out: undefined,
    ...SKILL_EVALS_DEFAULTS,
    maxCostUsd: undefined,
    judgeModel: undefined,
    model: undefined,
    caseGlob: undefined,
    keepPlugin: false,
    json: false,
    help: first === '--help' || first === '-h' || first === undefined,
    error: undefined,
  };
}

const FLAGS = {
  ...standardFlags<SkillEvalsArgs>(),
  '--keep-plugin': (state: SkillEvalsArgs): void => {
    state.keepPlugin = true;
  },
};

/** Parse argv into the invocation, a usage error naming what is wrong, or a help request. */
export function parseSkillEvalsArgs(args: readonly string[]): SkillEvalsArgs {
  const [first, ...rest] = args;
  const state = initialState(first);
  if (state.help) {
    return state;
  }
  const scanned = scanArgs(state.command === undefined ? args : rest, state, {
    flags: FLAGS,
    valueOptions: VALUE_OPTIONS,
    helpText: USAGE,
  });
  if (!scanned.ok) {
    return { ...state, error: scanned.error };
  }
  const error = scanned.state.help
    ? undefined
    : (scanned.state.error ?? requiredMissing(scanned.state));
  return { ...scanned.state, error };
}
