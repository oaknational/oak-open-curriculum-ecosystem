/**
 * Turtle / SKOS ingestion entrypoint.
 *
 * Parses a Turtle source string (Turtle and SKOS-in-Turtle both
 * accepted; the SKOS vocabulary is an IRI taxonomy on top of plain
 * Turtle and requires no parser-level special case) into a graph-core
 * `DatasetCore` paired with a `SourceMap` of per-quad source
 * locations.
 *
 * **Source-location resolution** follows the
 * `ws2-source-map-parser-integration` cycle's Option B (per the
 * type-expert RESHAPE verdict on 2026-05-23): n3.js v2.0.3 does not
 * surface per-quad token position to its public or private APIs
 * (verified at `node_modules/n3/src/N3Parser.js:1079-1082` —
 * `_emit` receives only quad terms, never the token). Cure:
 * pre-split the source into a line index, post-correlate each
 * emitted quad to a line by scanning for its subject IRI. Compound
 * triples like `ex:a ex:p ex:b, ex:c ;` produce multiple quads from
 * one line; only one can be unambiguously located by subject-IRI
 * scan. The unresolvable case emits
 * `{ line: null, column: null }`. The column position is currently
 * always `null` (line-level resolution only); reserved in the type
 * for forward compatibility.
 *
 * Each emitted Quad is normalised through graph-core's `DataFactory`
 * constructors via {@link normalizeQuad} so the resulting Dataset
 * carries only graph-core typed `Term`/`Quad` values, never raw
 * n3.js Term outputs.
 *
 * @packageDocumentation
 */

import { createDataset, type DatasetCore } from '@oaknational/graph-core/dataset';
import { err, ok, type Result } from '@oaknational/result';
import { Parser as N3Parser } from 'n3';

import { isNormalizeError, normalizeQuad, type NormalizeError } from '../normalize-rdfjs.js';
import { quadKey, type SourceLocation, type SourceMap } from '../source-path/index.js';

/**
 * Discriminated failure variants from {@link parseTurtle}.
 *
 * - `turtle-syntax`: n3.js rejected the input as syntactically
 *   invalid Turtle. The original error message from n3 is preserved
 *   in `message` for diagnostics.
 * - `unsupported-term`: a Term in the parser output had a `termType`
 *   the graph-core surface does not admit at that position (e.g. a
 *   Variable in subject position). Defensive — Turtle does not
 *   produce Variables.
 */
export type TurtleParseError =
  | {
      readonly kind: 'turtle-syntax';
      readonly message: string;
    }
  | NormalizeError;

/**
 * Successful parse output: the typed Dataset plus a `SourceMap`
 * keyed by `quadKey(q)` carrying the best-effort line position for
 * each emitted Quad.
 */
export interface TurtleParseOutput {
  readonly dataset: DatasetCore;
  readonly sourceMap: SourceMap;
}

/**
 * Resolve a Quad's source line by scanning the line index for its
 * subject IRI. Returns the 1-indexed line number on a unique match,
 * `null` otherwise (zero matches OR ambiguous multiple matches —
 * the latter happens for compound triples that share a subject
 * across multiple lines, which is unusual for Turtle but possible).
 *
 * The scan tolerates prefixed names (`ex:concept-1`) and absolute
 * IRIs (`<https://example.test/concept-1>`) by checking for either
 * the full IRI inside angle brackets OR the IRI's "local part"
 * (everything after the last `/` or `#`). The local-part match is
 * best-effort; an IRI-set heuristic for prefix resolution lives in
 * a future cycle if precision-of-attribution becomes load-bearing.
 */
function resolveSubjectLine(subjectIri: string, lineIndex: readonly string[]): number | null {
  const angleBracketed = `<${subjectIri}>`;
  const localPart = subjectIri.split(/[#/]/).findLast((s) => s.length > 0) ?? subjectIri;
  let matchedLine: number | null = null;
  for (let i = 0; i < lineIndex.length; i += 1) {
    const line = lineIndex[i] ?? '';
    if (line.includes(angleBracketed) || line.includes(`:${localPart}`)) {
      if (matchedLine !== null) {
        return null;
      }
      matchedLine = i + 1;
    }
  }
  return matchedLine;
}

/**
 * Parse a Turtle source string into a graph-core `DatasetCore` plus
 * a `SourceMap` of per-quad source locations.
 *
 * Synchronous: n3.js's `Parser.parse(input, null)` overload returns
 * the full Quad array eagerly. The function is pure — repeated calls
 * with the same input return structurally-equal outputs, and no
 * shared mutable state crosses the call boundary.
 */
export function parseTurtle(input: string): Result<TurtleParseOutput, TurtleParseError> {
  let n3Quads;
  try {
    n3Quads = new N3Parser().parse(input, null);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'turtle-syntax', message });
  }

  const lineIndex = input.split('\n');
  const dataset = createDataset();
  const entries: [string, SourceLocation][] = [];

  for (const n3Quad of n3Quads) {
    const normalised = normalizeQuad(n3Quad);
    if (isNormalizeError(normalised)) {
      return err(normalised);
    }
    dataset.add(normalised);
    const line = resolveSubjectLine(normalised.subject.value, lineIndex);
    const location: SourceLocation = { kind: 'turtle-location', line, column: null };
    entries.push([quadKey(normalised), location]);
  }

  const sourceMap: SourceMap = new Map(entries);
  return ok({ dataset, sourceMap });
}
