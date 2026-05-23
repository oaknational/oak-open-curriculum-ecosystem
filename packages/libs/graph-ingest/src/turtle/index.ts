/**
 * Turtle / SKOS ingestion entrypoint.
 *
 * Parses a Turtle source string (Turtle and SKOS-in-Turtle both
 * accepted; the SKOS vocabulary is an IRI taxonomy on top of plain
 * Turtle and requires no parser-level special case) into a graph-core
 * `DatasetCore`. Each emitted Quad is normalised through graph-core's
 * `DataFactory` constructors via {@link normalizeQuad} so the
 * resulting Dataset carries only graph-core typed `Term`/`Quad`
 * values, never raw n3.js Term outputs.
 *
 * @packageDocumentation
 */

import { createDataset, type DatasetCore } from '@oaknational/graph-core/dataset';
import { err, ok, type Result } from '@oaknational/result';
import { Parser as N3Parser } from 'n3';

import { isNormalizeError, normalizeQuad, type NormalizeError } from '../normalize-rdfjs.js';

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
 * Parse a Turtle source string into a graph-core `DatasetCore`.
 *
 * Synchronous: n3.js's `Parser.parse(input, null)` overload returns
 * the full Quad array eagerly. The function is pure — repeated calls
 * with the same input return structurally-equal Datasets, and no
 * shared mutable state crosses the call boundary.
 */
export function parseTurtle(input: string): Result<DatasetCore, TurtleParseError> {
  let n3Quads;
  try {
    n3Quads = new N3Parser().parse(input, null);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'turtle-syntax', message });
  }

  const dataset = createDataset();
  for (const n3Quad of n3Quads) {
    const normalised = normalizeQuad(n3Quad);
    if (isNormalizeError(normalised)) {
      return err(normalised);
    }
    dataset.add(normalised);
  }
  return ok(dataset);
}
