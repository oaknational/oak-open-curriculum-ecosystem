/**
 * Generic argv scanner shared by agent-tools CLI topic parsers.
 *
 * @remarks
 * Each topic owns its option surface — which flags, which value options, and how
 * each mutates the topic's own state — plus its help text and any required-field
 * check. This module owns the mechanics that were otherwise copied per topic: the
 * `--` terminator, flag dispatch, value-option dispatch with the "missing value"
 * guard, and the unknown-option / unexpected-positional error composition. It
 * returns a discriminated union — never throws, never exits, no IO (ADR-088).
 *
 * @packageDocumentation
 */

/** Applies a recognised flag (no value) to the mutable parser state. */
export type FlagHandler<TState> = (state: TState) => void;

/** Applies a recognised value option's value to the mutable parser state. */
export type ValueHandler<TState> = (state: TState, value: string) => void;

/** The option surface a topic exposes to {@link scanArgs}. */
export interface CliArgScanSpec<TState> {
  /** Flag options (no value), e.g. `--json`, `--help`. */
  readonly flags: Readonly<Record<string, FlagHandler<TState>>>;
  /** Value options (consume the next token), e.g. `--vendor <value>`. */
  readonly valueOptions: Readonly<Record<string, ValueHandler<TState>>>;
  /** Help text appended to every usage error. */
  readonly helpText: string;
}

/** Result of {@link scanArgs}: the mutated state, or a usage error. */
export type CliArgScanResult<TState> =
  { readonly ok: true; readonly state: TState } | { readonly ok: false; readonly error: string };

/**
 * The `--json` / `--help` / `-h` flags every agent-tools CLI topic shares.
 *
 * @returns A flag-handler map setting `json` / `help` on the topic state.
 */
export function standardFlags<TState extends { json: boolean; help: boolean }>(): Record<
  string,
  FlagHandler<TState>
> {
  return {
    '--json': (state) => {
      state.json = true;
    },
    '--help': (state) => {
      state.help = true;
    },
    '-h': (state) => {
      state.help = true;
    },
  };
}

/** Outcome of scanning one argv token. */
type ScanStep =
  | { readonly kind: 'advance'; readonly by: number }
  | { readonly kind: 'stop' }
  | { readonly kind: 'error'; readonly error: string };

function scanValueOption<TState>(
  state: TState,
  option: string,
  value: string | undefined,
  spec: CliArgScanSpec<TState>,
): ScanStep {
  if (
    value === undefined ||
    value.startsWith('--') ||
    Object.hasOwn(spec.flags, value) ||
    Object.hasOwn(spec.valueOptions, value)
  ) {
    return { kind: 'error', error: `${option} requires a value\n\n${spec.helpText}` };
  }
  spec.valueOptions[option](state, value);
  return { kind: 'advance', by: 2 };
}

function scanToken<TState>(
  state: TState,
  token: string,
  next: string | undefined,
  spec: CliArgScanSpec<TState>,
): ScanStep {
  if (token === '--') {
    return { kind: 'stop' };
  }
  if (Object.hasOwn(spec.flags, token)) {
    spec.flags[token](state);
    return { kind: 'advance', by: 1 };
  }
  if (Object.hasOwn(spec.valueOptions, token)) {
    return scanValueOption(state, token, next, spec);
  }
  const label = token.startsWith('--') ? 'unknown option' : 'unexpected positional argument';
  return { kind: 'error', error: `${label}: ${token}\n\n${spec.helpText}` };
}

/**
 * Scan `argv` against a topic's option spec, mutating `state` in place.
 *
 * @remarks
 * Stops at a `--` terminator. Flag and value-option handlers from `spec` mutate
 * `state`; an unrecognised `--option` or a bare token is a usage error, as is a
 * value option whose value is missing or is itself another option. Post-scan
 * validation (help short-circuit, required-field checks) is the caller's.
 *
 * @param argv - The topic argv (the tokens after the topic name).
 * @param state - Mutable initial state; handlers mutate it.
 * @param spec - The topic's flags, value options, and help text.
 * @returns The mutated state, or a usage error with help text appended.
 */
export function scanArgs<TState>(
  argv: readonly string[],
  state: TState,
  spec: CliArgScanSpec<TState>,
): CliArgScanResult<TState> {
  let index = 0;
  while (index < argv.length) {
    const step = scanToken(state, argv[index] ?? '', argv[index + 1], spec);
    if (step.kind === 'error') {
      return { ok: false, error: step.error };
    }
    if (step.kind === 'stop') {
      break;
    }
    index += step.by;
  }
  return { ok: true, state };
}
