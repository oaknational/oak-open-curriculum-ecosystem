/**
 * JSON-LD-compatible ingestion entrypoint.
 *
 * Accepts a `JsonLdDocument` (JSON with `@context` / `@id` / `@type`
 * or otherwise inferable LD shape per the JSON-LD 1.1 spec) and
 * emits a graph-core `DatasetCore`. The implementation pipelines:
 *
 * 1. `jsonld.toRDF(document, { format: 'application/n-quads' })` →
 *    N-Quads string (canonical RDF serialisation).
 * 2. n3.js `Parser({ format: 'N-Quads' }).parse(...)` → n3 Quad array.
 * 3. {@link normalizeQuad} → graph-core typed Quads.
 * 4. `createDataset(...)` → `DatasetCore`.
 *
 * Two-stage pipelining (jsonld → n-quads → n3 → graph-core) is
 * deliberate: it concentrates all vendor-Term touchpoints at a
 * single normalisation boundary in `normalize-rdfjs.ts`, so jsonld.js
 * and n3.js's wider Term-shape unions (n3's `Literal.direction` is
 * `string | null`, graph-core's is the narrower `'' | 'ltr' | 'rtl'`)
 * cannot leak through the Dataset surface.
 *
 * Input type is `JsonLdDocument` (imported from
 * `@oaknational/graph-core/jsonld`) per the type-expert verdict on
 * this cycle — `unknown` is forbidden by `unknown-is-type-destruction`
 * and `Record<string, unknown>` violates `principles.md` §Cardinal
 * Rule.
 *
 * @packageDocumentation
 */

import type { JsonLdDocument } from '@oaknational/graph-core/jsonld';
import { createDataset, type DatasetCore } from '@oaknational/graph-core/dataset';
import { err, ok, type Result } from '@oaknational/result';
import { toRDF } from 'jsonld';
import { Parser as N3Parser } from 'n3';

import { isNormalizeError, normalizeQuad, type NormalizeError } from '../normalize-rdfjs.js';

/**
 * Discriminated failure variants from {@link parseJsonLdCompatible}.
 *
 * - `jsonld-to-rdf-failed`: `jsonld.toRDF` threw during JSON-LD
 *   expansion or RDF serialisation. Message preserved.
 * - `nquads-parse-failed`: n3.js could not tokenise the N-Quads
 *   output produced by `jsonld.toRDF`. Defensive: a valid JSON-LD
 *   document yields valid N-Quads, but propagating the failure
 *   surfaces vendor drift if either library breaks contract.
 * - `unsupported-term`: a Term in the parser output had an admissible
 *   n3 `termType` that the graph-core surface does not accept at
 *   that position. Same defensive shape as for Turtle.
 */
export type JsonLdParseError =
  | {
      readonly kind: 'jsonld-to-rdf-failed';
      readonly message: string;
    }
  | {
      readonly kind: 'nquads-parse-failed';
      readonly message: string;
    }
  | NormalizeError;

/**
 * Parse a JSON-LD-compatible document into a graph-core
 * `DatasetCore`. Asynchronous because `jsonld.toRDF` returns a
 * Promise.
 */
export async function parseJsonLdCompatible(
  document: JsonLdDocument,
): Promise<Result<DatasetCore, JsonLdParseError>> {
  let nquads: string;
  try {
    const rdf = await toRDF(document, { format: 'application/n-quads' });
    if (typeof rdf !== 'string') {
      return err({
        kind: 'jsonld-to-rdf-failed',
        message: 'jsonld.toRDF returned a non-string value for the n-quads format request',
      });
    }
    nquads = rdf;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'jsonld-to-rdf-failed', message });
  }

  let n3Quads;
  try {
    n3Quads = new N3Parser({ format: 'N-Quads' }).parse(nquads, null);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'nquads-parse-failed', message });
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
