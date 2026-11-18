/**
 * Pure CLI option parser for the `arc-metrics` topic.
 *
 * @remarks
 * `--vendor` is a required value option; `--project-dir` is repeatable and
 * defaults to the project directory derived from the launch directory;
 * `--gap-minutes` sets the active-time threshold; `--json` and `--help` are
 * flags. The scan mechanics are delegated to the shared {@link scanArgs}; this
 * module owns only the topic's option surface and its validation. Returns a
 * discriminated union (never throws, never exits, no IO).
 *
 * @packageDocumentation
 */

import { scanArgs, standardFlags, type ValueHandler } from '../core/cli-arg-parser.js';

/** Parsed `arc-metrics` options. */
export interface ArcMetricsOptions {
  readonly vendor: string;
  readonly projectDirs: readonly string[];
  readonly gapMinutes: number;
  readonly json: boolean;
  readonly help: boolean;
}

/** Result of parsing `arc-metrics` argv. */
export type ParseResult =
  | { readonly ok: true; readonly options: ArcMetricsOptions }
  | { readonly ok: false; readonly error: string };

interface MutableOptions {
  vendor: string;
  projectDirs: string[];
  gapMinutes: string;
  json: boolean;
  help: boolean;
}

const VALUE_OPTIONS = {
  '--vendor': (state, value) => {
    state.vendor = value;
  },
  '--project-dir': (state, value) => {
    state.projectDirs.push(value);
  },
  '--gap-minutes': (state, value) => {
    state.gapMinutes = value;
  },
} satisfies Record<string, ValueHandler<MutableOptions>>;

export const ARC_METRICS_HELP_TEXT = [
  'arc-metrics --vendor <vendor> [--project-dir <path> ...] [--gap-minutes <n>] [--json]',
  '',
  "Measure an arc from the vendor's session transcripts: active hours, model",
  'calls, tokens counted once per call, compactions, usage-limit stalls and',
  'owner messages (turns plus mid-turn messages), each per session and in',
  'total; median context per call is reported per session only.',
  '',
  'The arc is every transcript in the project directories measured, so the',
  'report grows as sessions are added there: name the directories that bound',
  'the arc.',
  '',
  "The transcripts measured are the main sessions'. The vendor nests each",
  "session's sub-agent transcripts in a directory of their own, and their",
  'calls and tokens are not counted.',
  '',
  'Options:',
  '  --vendor <vendor>     Agent vendor. Supported: claude. Required.',
  '  --project-dir <path>  A vendor project directory holding session',
  '                        transcripts. Repeatable. Defaults to the directory',
  '                        for the launch directory. An arc whose sessions',
  '                        ran in several working directories (worktrees,',
  '                        say) has transcripts under each, so name each one.',
  '                        A directory named twice is measured once; one that',
  '                        does not exist is refused.',
  '  --gap-minutes <n>     Active-time threshold: a gap of at most this many',
  '                        minutes between consecutive events counts as',
  '                        active. Default 10.',
  '  --json                Emit machine-readable JSON instead of text.',
  '  -h, --help            Show this help.',
  '',
  'Examples:',
  '  agent-tools arc-metrics --vendor claude',
  '  agent-tools arc-metrics --vendor claude --gap-minutes 5 --json',
].join('\n');

/**
 * A positive whole number written in decimal digits. `Number` alone also reads
 * `0x10` as sixteen and `1e1` as ten, which no one typing a threshold means;
 * a run of digits too long for a number to hold exactly, as minutes or as the
 * seconds the threshold is compared in, is refused after the conversion.
 */
const POSITIVE_WHOLE_NUMBER = /^[1-9]\d*$/u;

const SECONDS_PER_MINUTE = 60;

/**
 * Parse `arc-metrics` argv into options or an error.
 *
 * @param argv - Topic argv (after the `arc-metrics` topic token).
 * @returns A discriminated union: parsed options, or an error with usage text.
 */
export function parseArgs(argv: readonly string[]): ParseResult {
  const state: MutableOptions = {
    vendor: '',
    projectDirs: [],
    gapMinutes: '10',
    json: false,
    help: false,
  };

  const scan = scanArgs(argv, state, {
    flags: standardFlags<MutableOptions>(),
    valueOptions: VALUE_OPTIONS,
    helpText: ARC_METRICS_HELP_TEXT,
  });
  if (!scan.ok) {
    return { ok: false, error: scan.error };
  }

  if (state.help) {
    return { ok: true, options: frozen(state, 10) };
  }

  if (state.vendor.length === 0) {
    return { ok: false, error: `--vendor is required\n\n${ARC_METRICS_HELP_TEXT}` };
  }

  const gapMinutes = Number(state.gapMinutes);
  if (
    !POSITIVE_WHOLE_NUMBER.test(state.gapMinutes) ||
    !Number.isSafeInteger(gapMinutes * SECONDS_PER_MINUTE)
  ) {
    return {
      ok: false,
      error: `--gap-minutes expects a positive whole number of minutes (got ${state.gapMinutes})\n\n${ARC_METRICS_HELP_TEXT}`,
    };
  }

  return { ok: true, options: frozen(state, gapMinutes) };
}

function frozen(state: MutableOptions, gapMinutes: number): ArcMetricsOptions {
  return {
    vendor: state.vendor,
    projectDirs: [...state.projectDirs],
    gapMinutes,
    json: state.json,
    help: state.help,
  };
}
