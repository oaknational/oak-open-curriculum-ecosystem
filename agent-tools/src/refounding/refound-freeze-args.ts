import { isErr, ok, type Result } from '@oaknational/result';

import { entryUsageText, parseEntryArgs } from './refound-entry-args.js';
import { DEFAULT_OUT_DIR, DEFAULT_RULE_PATH } from './refound-freeze-helpers.js';

/**
 * CLI flag parsing for the rule-plus-out refounding entries
 * (`refound-freeze`, `refound-merge-recheck`, `refound-sweep`, and
 * `refound-plant-orphan`): the parsed-args shape, the
 * shared usage line, and the argv parser. Extracted from
 * `refound-freeze-helpers.ts` (which retains the path constants, the
 * source→frozen mapping, the denominator builder, and the gitleaks invocation
 * shape) so each module holds one responsibility. The contract mechanics
 * (`--` refusal, run-nothing `--help`, unknown-flag rejection) live in the
 * shared `refound-entry-args.ts` this module delegates to.
 *
 * @packageDocumentation
 */

/**
 * Parsed CLI flags for `refound-freeze` (paths as given; the entry resolves
 * them). A true `help` is a run-nothing verdict the entry must honour before
 * any preparation or write.
 */
export interface FreezeArgs {
  readonly rulePath: string;
  readonly outDir: string;
  readonly help: boolean;
}

/** The one usage line, shared by the parser's errors and the entries' `--help` output. */
export function freezeUsageText(toolName: string): string {
  return entryUsageText(toolName, '[--rule <path>] [--out <dir>]');
}

/**
 * Parse `--rule <path>` / `--out <dir>` / `--help` from argv via the shared
 * {@link scanArgs} scanner. Unknown or dangling flags are errors, never
 * ignored, and the `--` terminator is refused outright: these tools take no
 * positional arguments, and scanArgs' stop-at-`--` semantics would otherwise
 * silently swallow every following token — the exact footgun that ran a full
 * freeze on an attempted `-- --help` interface probe (2026-07-14). A `help`
 * verdict is a run-nothing contract: entries MUST short-circuit before any
 * preparation or write. `toolName` labels the usage line.
 */
export function parseFreezeArgs(
  argv: readonly string[],
  toolName = 'refound-freeze',
): Result<FreezeArgs, Error> {
  const parsed = parseEntryArgs(
    argv,
    freezeUsageText(toolName),
    { rulePath: DEFAULT_RULE_PATH, outDir: DEFAULT_OUT_DIR },
    {
      '--rule': (state, value) => {
        state.rulePath = value;
      },
      '--out': (state, value) => {
        state.outDir = value;
      },
    },
  );
  if (isErr(parsed)) {
    return parsed;
  }
  return ok({
    rulePath: parsed.value.state.rulePath,
    outDir: parsed.value.state.outDir,
    help: parsed.value.help,
  });
}
