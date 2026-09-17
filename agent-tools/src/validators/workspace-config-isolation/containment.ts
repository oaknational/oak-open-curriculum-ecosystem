/**
 * Leg (a) of the workspace-config-isolation validator: the containment
 * classes a dependency resolver structurally cannot see.
 *
 * @remarks
 * Static import/export containment of config files is enforced by the
 * dependency-cruiser rules `workspace-config-containment` and
 * `workspace-config-no-phantom-deps` in the root `.dependency-cruiser.mjs`
 * (owner ruling 2026-08-09: a dependency check runs on a dependency
 * resolver, never textual pattern-matching). This module owns the
 * remainder — probe-verified 2026-08-10 to be invisible to the resolver:
 * the `resolve(dirname(fileURLToPath(import.meta.url)), '<literal>')`
 * path-arithmetic shape (a relative escape that is runtime path building,
 * not an import), and the refusal channel for non-literal dynamic imports
 * and non-literal path arithmetic, which are UNANALYSABLE and fail loud
 * rather than silently passing.
 *
 * Containment is a DIRECTORY question, so the check never resolves to a
 * real file: no extension mapping, no index resolution, no `exports`-map
 * handling, no `realpathSync` (a lexical verdict is identical on every
 * checkout). Root-owned config files (owner `''`) pass trivially — every
 * relative reach from the repo root stays inside it.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { stripComments } from './comment-stripping.js';
import { lineOf } from './text-position.js';

/** One relative reach that leaves its owning workspace. */
export interface EscapeFinding {
  readonly file: string;
  readonly line: number;
  readonly specifier: string;
  /** Repo-relative lexical resolution of the specifier. */
  readonly resolved: string;
  /** Repo-relative owning workspace dir; `''` is the repo root. */
  readonly owner: string;
}

/** A construct the lexical scan cannot analyse; always surfaced, never skipped. */
export interface UnanalysableFinding {
  readonly file: string;
  readonly line: number;
  readonly reason: string;
}

/** The two finding streams one file scan produces. */
export interface ContainmentScan {
  readonly escapes: readonly EscapeFinding[];
  readonly unanalysable: readonly UnanalysableFinding[];
}

interface ScanContext {
  readonly file: string;
  readonly owner: string;
  readonly fileDir: string;
  readonly content: string;
}

const DYNAMIC_IMPORT = /import\s*\(\s*(['"]?)/g;
/**
 * Matches the call shape up to and including the comma — fixed tokens
 * joined by `\s*`, so the regex is linear (Sonar S8786: the previous
 * single-regex form parsed the target argument too, and its
 * optional-quote/negated-class tail backtracked super-linearly). The
 * target argument is parsed with plain string operations instead.
 */
const PATH_ARITHMETIC_CALL =
  /resolve\(\s*dirname\(\s*fileURLToPath\(\s*import\.meta\.url\s*\)\s*\)\s*,\s*/g;

/** The parsed target of one path-arithmetic call: a literal string, or a refusal. */
interface PathArithmeticTarget {
  readonly literal: string | undefined;
}

/**
 * Parse the argument that follows the matched call shape. A quoted
 * string closed on the same line is the literal target; anything else
 * (no quote, unterminated quote, newline first) is non-literal and
 * refused by the caller.
 */
function parsePathArithmeticTarget(rest: string): PathArithmeticTarget {
  const quote = rest.charAt(0);
  if (quote !== "'" && quote !== '"') {
    return { literal: undefined };
  }
  const close = rest.indexOf(quote, 1);
  if (close === -1) {
    return { literal: undefined };
  }
  const literal = rest.slice(1, close);
  if (literal.includes('\n')) {
    return { literal: undefined };
  }
  return { literal };
}

function escapeAt(
  context: ScanContext,
  index: number,
  specifier: string,
): EscapeFinding | undefined {
  if (path.posix.isAbsolute(specifier)) {
    // Runtime `resolve` discards the base for an absolute target, so it
    // escapes by construction — `path.posix.join` would instead treat it
    // as a child and silently read it as contained (Copilot round,
    // 2026-08-10).
    return {
      file: context.file,
      line: lineOf(context.content, index),
      specifier,
      resolved: path.posix.normalize(specifier),
      owner: context.owner,
    };
  }
  const resolved = path.posix.normalize(path.posix.join(context.fileDir, specifier));
  const rel = path.posix.relative(context.owner, resolved);
  if (!rel.startsWith('..') && !path.posix.isAbsolute(rel)) {
    return undefined;
  }
  return {
    file: context.file,
    line: lineOf(context.content, index),
    specifier,
    resolved,
    owner: context.owner,
  };
}

function scanDynamicImports(context: ScanContext): readonly UnanalysableFinding[] {
  const findings: UnanalysableFinding[] = [];
  for (const match of context.content.matchAll(DYNAMIC_IMPORT)) {
    if (match[1] === '') {
      findings.push({
        file: context.file,
        line: lineOf(context.content, match.index),
        reason: 'dynamic import with a non-literal argument cannot be containment-checked',
      });
    }
  }
  return findings;
}

function scanPathArithmetic(context: ScanContext): ContainmentScan {
  const escapes: EscapeFinding[] = [];
  const unanalysable: UnanalysableFinding[] = [];
  for (const match of context.content.matchAll(PATH_ARITHMETIC_CALL)) {
    const target = parsePathArithmeticTarget(context.content.slice(match.index + match[0].length));
    if (target.literal === undefined) {
      unanalysable.push({
        file: context.file,
        line: lineOf(context.content, match.index),
        reason:
          'import.meta.url path arithmetic with a non-literal target cannot be containment-checked',
      });
      continue;
    }
    const finding = escapeAt(context, match.index, target.literal);
    if (finding !== undefined) {
      escapes.push(finding);
    }
  }
  return { escapes, unanalysable };
}

/**
 * Scan one config file's content for the resolver-invisible escape
 * classes: literal path arithmetic (containment-checked lexically) and
 * non-literal constructs (refused).
 *
 * @remarks Lexical only: a literal target is resolved with `path.posix`
 * against the file's directory and compared against the owner directory.
 * Static import/export specifiers are deliberately NOT scanned here —
 * dependency-cruiser owns them (see the module remark).
 */
export function findConfigEscapes(input: {
  readonly file: string;
  readonly content: string;
  readonly owner: string;
}): ContainmentScan {
  const context: ScanContext = {
    file: input.file,
    owner: input.owner,
    fileDir: path.posix.dirname(input.file),
    content: stripComments(input.content),
  };
  const arithmetic = scanPathArithmetic(context);
  return {
    escapes: arithmetic.escapes,
    unanalysable: [...scanDynamicImports(context), ...arithmetic.unanalysable],
  };
}
