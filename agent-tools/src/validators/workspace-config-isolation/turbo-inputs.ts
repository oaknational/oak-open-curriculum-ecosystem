/**
 * Leg (b) of the workspace-config-isolation validator: every positive
 * `$TURBO_ROOT$` input in turbo.json must match at least one tracked
 * file under the pinned matcher.
 *
 * @remarks turbo silently hashes zero files for an input that matches
 * nothing (measured: five stale entries contributed nothing, with no
 * warning), so cache invalidation rots invisibly. Two facts pin this
 * leg's contract, measured via `--dry=json` resolved inputs (MCP-542,
 * 2026-08-11 — the dry run is the authoritative instrument):
 *
 * - `**` matches ZERO or more path segments, and dot-directories match
 *   (measured on the research-tree yaml/yml entries).
 * - turbo's `inputs` globs walk the FILESYSTEM, not the git index
 *   (untracked and gitignored files hash — that is what the `!`
 *   negations in turbo.json do their work against).
 *
 * The predicate here deliberately checks the TRACKED file set
 * (`git ls-files`), not the filesystem: tracked-set membership is
 * deterministic across checkouts and build states, where an fs walk
 * would flip with build output present or absent. The over-
 * approximation is one-directional and named in the finding message:
 * an inputs entry whose only matches are untracked is itself a
 * cache-key determinism defect under this estate's doctrine (a cache
 * input that varies with build state), so the finding is correct to
 * fire on it. Negated entries are exempt (turbo applies them as
 * filters; they legitimately match generated content). Pattern syntax
 * outside the supported subset (`**`, `*`, `?`) is a REFUSAL, never a
 * guess — and so is every malformed macro FORM (`macroFormVerdict`):
 * non-leading or repeated macros, an absolute remainder, a backslash,
 * and a root-escaping `..` — the last three probe-measured as forms
 * turbo itself rejects config-wide or mis-resolves (measurements at
 * each refusal site and in the turbo-glob probe ledger). Only
 * `inputs` arrays are scanned; `outputs` globs legitimately match
 * nothing before a build. turbo.json is JSONC, so the scan uses the
 * `jsonc-parser` visitor.
 *
 * @packageDocumentation
 */

import { visit } from 'jsonc-parser';

import { lineOf } from './text-position.js';
import {
  GLOB_CANDIDATE,
  compileTurboGlob,
  isTrackedDirectoryPrefix,
  normaliseTurboPathSpelling,
} from './turbo-glob.js';

/** One `$TURBO_ROOT$` input entry that matches zero tracked files. */
interface TurboInputFinding {
  readonly entry: string;
  readonly line: number;
}

/** One JSONC parse error the fault-tolerant visitor would otherwise swallow. */
interface TurboParseError {
  readonly code: number;
  readonly line: number;
}

/** One entry whose pattern syntax or macro form sits outside the pinned subset. */
interface TurboInputRefusal {
  readonly entry: string;
  readonly line: number;
  readonly reason: string;
}

/** The scan's outcome streams plus the alive count the success line derives from. */
export interface TurboInputScan {
  readonly findings: readonly TurboInputFinding[];
  readonly parseErrors: readonly TurboParseError[];
  readonly refusals: readonly TurboInputRefusal[];
  /**
   * Positive `$TURBO_ROOT$` entries that matched ≥1 tracked file — the
   * bin's success line derives its claim from this count, so the
   * sentence it prints is true by construction.
   */
  readonly positives: number;
}

/** The per-entry verdict of the pinned matcher — a closed union. */
export type TurboEntryVerdict =
  | { readonly kind: 'alive' }
  | { readonly kind: 'dead' }
  | { readonly kind: 'exempt' }
  | { readonly kind: 'unsupported'; readonly reason: string };

const TURBO_ROOT_PREFIX = '$TURBO_ROOT$/';

/** Structural checks on the entry's macro form, ahead of any matching. */
function macroFormVerdict(entry: string): TurboEntryVerdict | undefined {
  if (entry.startsWith('!')) {
    return { kind: 'exempt' };
  }
  if (!entry.startsWith(TURBO_ROOT_PREFIX)) {
    return {
      kind: 'unsupported',
      reason: `$TURBO_ROOT$ occurrence outside leading '${TURBO_ROOT_PREFIX}' prefix form`,
    };
  }
  const remainder = entry.slice(TURBO_ROOT_PREFIX.length);
  if (remainder.includes('$TURBO_ROOT$')) {
    // Would otherwise read as a dead FINDING via the literal arm; it is
    // malformed input the leg cannot evaluate (Copilot round 2, 2026-08-11).
    return {
      kind: 'unsupported',
      reason: `repeated $TURBO_ROOT$ occurrence — the macro is valid only as the single leading prefix`,
    };
  }
  if (remainder.startsWith('/')) {
    // Not fussiness of ours: turbo rejects the WHOLE config on this form
    // (turbo 2.10.9 dry-run, 2026-08-11), so no verdict is derivable.
    return {
      kind: 'unsupported',
      reason:
        `absolute remainder after the macro — turbo itself refuses the whole config ` +
        `on this entry ('inputs' cannot contain an absolute path)`,
    };
  }
  if (remainder.includes('\\')) {
    // Measured (2.10.9, 2026-08-11): an invalid escape rejects the whole
    // config as a bad pattern; the valid escape `\.` was accepted yet
    // resolved ZERO files. The pinned subset reproduces neither.
    return {
      kind: 'unsupported',
      reason: String.raw`backslash in entry — turbo reads '\' as a glob escape (an invalid escape rejects the whole config as a bad pattern; a valid escape resolved zero files when measured); the pinned subset does not reproduce escape semantics`,
    };
  }
  return undefined;
}

/**
 * Classify one `$TURBO_ROOT$` input entry against the tracked file set.
 *
 * @remarks The single decision point both the scan and its tests
 * exercise. Negations are exempt BEFORE any syntax inspection (the leg
 * never evaluates negations); malformed macro forms refuse
 * (`macroFormVerdict`); spellings turbo itself resolves lexically are
 * resolved first ({@link normaliseTurboPathSpelling} has the ledger).
 */
export function classifyTurboRootInput(
  entry: string,
  trackedFiles: readonly string[],
): TurboEntryVerdict {
  const formVerdict = macroFormVerdict(entry);
  if (formVerdict !== undefined) {
    return formVerdict;
  }
  const normalised = normaliseTurboPathSpelling(entry.slice(TURBO_ROOT_PREFIX.length));
  if (normalised.kind === 'escapes-root') {
    return {
      kind: 'unsupported',
      reason: `'..' escapes the repository root — turbo itself refuses the whole config on this entry (Path error: not parent of the root)`,
    };
  }
  const relative = normalised.value;
  if (!GLOB_CANDIDATE.test(relative)) {
    return trackedFiles.includes(relative) || isTrackedDirectoryPrefix(relative, trackedFiles)
      ? { kind: 'alive' }
      : { kind: 'dead' };
  }
  const compiled = compileTurboGlob(relative);
  if (compiled.kind === 'unsupported') {
    return compiled;
  }
  return trackedFiles.some((candidate) => compiled.regex.test(candidate))
    ? { kind: 'alive' }
    : { kind: 'dead' };
}

/** The scan's mutable accumulator, shared with the per-entry recorder. */
interface TurboScanState {
  readonly findings: TurboInputFinding[];
  readonly parseErrors: TurboParseError[];
  readonly refusals: TurboInputRefusal[];
  positives: number;
}

/** Route one entry's verdict into the scan's streams and count evaluated positives. */
function recordInputsEntry(input: {
  readonly state: TurboScanState;
  readonly value: string;
  readonly line: number;
  readonly trackedFiles: readonly string[];
}): void {
  const { state, value, line, trackedFiles } = input;
  const verdict = classifyTurboRootInput(value, trackedFiles);
  if (verdict.kind === 'dead') {
    state.findings.push({ entry: value, line });
  } else if (verdict.kind === 'unsupported') {
    state.refusals.push({ entry: value, line, reason: verdict.reason });
  }
  if (verdict.kind === 'alive') {
    state.positives += 1;
  }
}

/**
 * Scan turbo.json (JSONC) for `$TURBO_ROOT$` entries inside `inputs`
 * arrays, reporting dead entries and refusals with their lines.
 *
 * @remarks `jsonc-parser`'s visitor is fault-tolerant: unhandled, it
 * silently scans only the recoverable fragments of malformed JSONC, so
 * parse errors are first-class output — the bin refuses (exit 2) on
 * any, per the validator's fail-loud contract.
 */
export function scanTurboRootInputs(input: {
  readonly turboJsonText: string;
  readonly trackedFiles: readonly string[];
}): TurboInputScan {
  const { turboJsonText, trackedFiles } = input;
  const state: TurboScanState = { findings: [], parseErrors: [], refusals: [], positives: 0 };
  let currentProperty = '';
  let inInputs = false;
  let arrayDepth = 0;

  visit(turboJsonText, {
    onObjectProperty(property) {
      currentProperty = property;
    },
    onArrayBegin() {
      if (arrayDepth === 0 && currentProperty === 'inputs') {
        inInputs = true;
      }
      if (inInputs) {
        arrayDepth += 1;
      }
    },
    onArrayEnd() {
      if (inInputs) {
        arrayDepth -= 1;
        if (arrayDepth === 0) {
          inInputs = false;
        }
      }
    },
    onLiteralValue(value, offset) {
      if (inInputs && typeof value === 'string' && value.includes('$TURBO_ROOT$')) {
        recordInputsEntry({ state, value, line: lineOf(turboJsonText, offset), trackedFiles });
      }
    },
    onError(code, offset) {
      state.parseErrors.push({ code, line: lineOf(turboJsonText, offset) });
    },
  });

  return state;
}
