import { err, isErr, ok, type Result } from '@oaknational/result';

import { scanArgs, type ValueHandler } from '../core/cli-arg-parser.js';
import { DEFAULT_OUT_DIR } from './refound-freeze-helpers.js';
import { resolveReadPathWithinRepo } from './refound-path-resolve.js';

/**
 * The shared arg-contract for every raw refounding entry script: refuse the
 * `--` terminator outright, answer `--help`/`-h` as a run-nothing verdict,
 * and error on unknown or dangling flags via the shared `scanArgs` scanner.
 *
 * Generalised from `refound-freeze-args.ts` (the worked cure for the
 * 2026-07-14 footgun where a `-- --help` interface probe ran a full freeze:
 * scanArgs' stop-at-`--` semantics silently swallow every following token,
 * and a tool with no `--help` flag treats the probe as a plain run). Every
 * refounding entry parses through this module so the contract cannot drift
 * per script.
 *
 * @packageDocumentation
 */

/**
 * A parsed entry argv: the tool's own flag state plus the shared `help`
 * verdict. A true `help` is a run-nothing contract — entries MUST
 * short-circuit (print usage, exit 0) before any preparation, resolution,
 * or write.
 */
export interface EntryArgs<TState> {
  readonly state: TState;
  readonly help: boolean;
}

/**
 * Compose a tool's one usage line with the shared help flag always last.
 *
 * @param toolName - The registered script name, e.g. `refound-sweep`.
 * @param optionsSummary - The tool's own options, e.g. `[--out <dir>]`;
 * empty string for a tool with no options of its own.
 */
export function entryUsageText(toolName: string, optionsSummary: string): string {
  const options = optionsSummary === '' ? '' : `${optionsSummary} `;
  return `usage: ${toolName} ${options}[--help|-h]`;
}

/**
 * Parse an entry argv against the tool's value options under the shared
 * contract: `--` refused outright (these tools take no positional
 * arguments), `--help`/`-h` recognised as the run-nothing verdict, unknown
 * or dangling options rejected with the usage line appended.
 *
 * @param argv - The entry argv (`process.argv.slice(2)`).
 * @param usage - The tool's usage line (from {@link entryUsageText}).
 * @param initialState - The tool's defaults; mutated by `valueOptions`.
 * @param valueOptions - The tool's value-option handlers.
 * @returns The parsed state plus the `help` verdict, or a usage error.
 */
export function parseEntryArgs<TState>(
  argv: readonly string[],
  usage: string,
  initialState: TState,
  valueOptions: Readonly<Record<string, ValueHandler<TState>>>,
): Result<EntryArgs<TState>, Error> {
  if (argv.includes('--')) {
    return err(new Error(`takes no positional arguments; remove the -- terminator\n\n${usage}`));
  }
  let help = false;
  const setHelp = (): void => {
    help = true;
  };
  const scanned = scanArgs<TState>(argv, initialState, {
    flags: { '--help': setHelp, '-h': setHelp },
    valueOptions,
    helpText: usage,
  });
  if (!scanned.ok) {
    return err(new Error(scanned.error));
  }
  return ok({ state: scanned.state, help });
}

/**
 * The parsed flags of a `--out`-only entry (`refound-verify-freeze`,
 * `refound-inventory`, `refound-default-ledger`, `refound-residue`,
 * `refound-batch-status`): the artefact home plus the shared `help` verdict.
 */
export interface OutDirArgs {
  readonly outDir: string;
  readonly help: boolean;
}

/** The usage line of a `--out`-only entry, shared by parser errors and `--help` output. */
export function outDirUsageText(toolName: string): string {
  return entryUsageText(toolName, '[--out <dir>]');
}

/**
 * Parse the shared `--out <dir>` surface of the artefact-home-only entries
 * under the {@link parseEntryArgs} contract. `toolName` labels the usage
 * line; the default is {@link DEFAULT_OUT_DIR}.
 */
export function parseOutDirArgs(
  argv: readonly string[],
  toolName: string,
): Result<OutDirArgs, Error> {
  const parsed = parseEntryArgs(
    argv,
    outDirUsageText(toolName),
    { outDir: DEFAULT_OUT_DIR },
    {
      '--out': (state, value) => {
        state.outDir = value;
      },
    },
  );
  if (isErr(parsed)) {
    return parsed;
  }
  return ok({ outDir: parsed.value.state.outDir, help: parsed.value.help });
}

/**
 * A decided entry preflight: the run-nothing help verdict, or the tool's
 * resolution payload under `resolved`.
 */
export type EntryRun<TResolved> =
  | { readonly help: true }
  | { readonly help: false; readonly resolved: TResolved };

/**
 * The shared entry preflight: given a parsed entry verdict, short-circuit
 * the run-nothing `help` contract BEFORE any resolution, then run the
 * tool's own resolution step. This is the canonical owner of the
 * parse → help → resolve ordering (`consolidate-at-second-consumer`): the
 * `--out`-only entries and the census preflight both compose it, so the
 * safety-critical ordering cannot drift per tool. The resolution payload
 * comes back nested under `resolved` rather than spread — spreading an
 * unconstrained generic would promise a shape a primitive or array
 * resolution could not honour.
 *
 * @param parsed - The tool's parsed argv verdict (any shape carrying the
 * shared `help` flag).
 * @param resolve - The tool's resolution step; runs ONLY on a non-help
 * parse, receiving the parsed value.
 * @returns The help verdict, or the resolution payload with `help: false`.
 */
export function prepareEntryRun<TParsed extends { readonly help: boolean }, TResolved>(
  parsed: Result<TParsed, Error>,
  resolve: (parsed: TParsed) => Result<TResolved, Error>,
): Result<EntryRun<TResolved>, Error> {
  if (isErr(parsed)) {
    return parsed;
  }
  if (parsed.value.help) {
    return ok({ help: true } as const);
  }
  const resolved = resolve(parsed.value);
  if (isErr(resolved)) {
    return resolved;
  }
  return ok({ help: false as const, resolved: resolved.value });
}

/**
 * A `--out`-only entry's decided preflight: the run-nothing help verdict, or
 * the raw flag plus its repo-constrained resolution, ready to run.
 */
export type OutDirEntry =
  | { readonly help: true }
  | { readonly help: false; readonly outDir: string; readonly outDirAbs: string };

/**
 * The whole pre-run sequence of a `--out`-only entry in one call, composed
 * over {@link prepareEntryRun}: parse under the shared contract,
 * short-circuit on the help verdict BEFORE any path resolution, then
 * constrain the artefact home (a READ target — it must exist) to the
 * repository. Keeps every such entry's `main` down to verdict handling plus
 * its own run.
 */
export function prepareOutDirEntry(
  repoRoot: string,
  argv: readonly string[],
  toolName: string,
): Result<OutDirEntry, Error> {
  const prepared = prepareEntryRun(parseOutDirArgs(argv, toolName), (args) => {
    const outDirAbs = resolveReadPathWithinRepo(repoRoot, args.outDir);
    if (isErr(outDirAbs)) {
      return outDirAbs;
    }
    return ok({ outDir: args.outDir, outDirAbs: outDirAbs.value });
  });
  if (isErr(prepared)) {
    return prepared;
  }
  if (prepared.value.help) {
    return ok({ help: true } as const);
  }
  return ok({ help: false as const, ...prepared.value.resolved });
}
