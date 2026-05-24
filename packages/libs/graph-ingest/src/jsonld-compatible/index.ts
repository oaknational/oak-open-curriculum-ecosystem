/**
 * JSON-LD-compatible ingestion entrypoint.
 *
 * Accepts a `JsonLdDocument` (JSON with `@context` / `@id` / `@type`
 * or otherwise inferable LD shape per the JSON-LD 1.1 spec) and
 * emits a graph-core `DatasetCore` paired with a `SourceMap` of
 * per-quad JSON Pointer source locations.
 *
 * The implementation pipelines:
 *
 * 1. `jsonld.toRDF(document, { format: 'application/n-quads' })` →
 *    N-Quads string (canonical RDF serialisation).
 * 2. n3.js `Parser({ format: 'N-Quads' }).parse(...)` → n3 Quad array.
 * 3. {@link normalizeQuad} → graph-core typed Quads.
 * 4. `createDataset(...)` → `DatasetCore`.
 * 5. Attach a `SourceLocation` to each emitted Quad. At the current
 *    cycle scope every quad maps to the root JSON Pointer.
 *
 * Two-stage pipelining (jsonld → n-quads → n3 → graph-core) is
 * deliberate: it concentrates all vendor-Term touchpoints at a
 * single normalisation boundary in `normalize-rdfjs.ts`, so jsonld.js
 * and n3.js's wider Term-shape unions (n3's `Literal.direction` is
 * `string | null`, graph-core's is the narrower `'' | 'ltr' | 'rtl'`)
 * cannot leak through the Dataset surface.
 *
 * **Source-location resolution** for the ws2-source-map-parser-integration
 * cycle: `jsonld.toRDF` strips per-element provenance during the
 * n-quads round-trip, so per-quad position cannot be recovered
 * from the n3-parsed output. At this cycle's scope every emitted
 * Quad maps to the **root JSON Pointer**; the invariant-3 contract
 * (every Quad has a resolvable source location) holds via the
 * trivial all-root mapping. **Precise per-`@id` JSON Pointer
 * resolution is future scope**, deferred to a follow-on cycle when
 * a real consumer needs it. An earlier authoring attempt this
 * session implemented a recursive walker against `JsonLdValue`, but
 * jsonld's TypeScript definitions on the value union were too tight
 * to traverse without forbidden assertions or `Object.keys`/
 * `Object.entries` (both restricted by the workspace's ESLint
 * config). The cleaner forward path is a dedicated JSON-LD-walker
 * cycle with the right typed traversal helper.
 *
 * Input type is `JsonLdDocument` (imported from
 * `@oaknational/graph-core/jsonld`) per the type-expert verdict on
 * the WS2.3 primitives cycle — `unknown` is forbidden by
 * `unknown-is-type-destruction` and `Record<string, unknown>`
 * violates `principles.md` §Cardinal Rule.
 *
 * @packageDocumentation
 */

import type { JsonLdDocument } from '@oaknational/graph-core/jsonld';
import { createDataset, type DatasetCore } from '@oaknational/graph-core/dataset';
import { err, ok, type Result } from '@oaknational/result';
import { toRDF } from 'jsonld';
import { Parser as N3Parser, type Quad as N3ParserQuad } from 'n3';

import { isNormalizeError, normalizeQuad, type NormalizeError } from '../normalize-rdfjs.js';
import {
  quadKey,
  type JsonPointer,
  type SourceLocation,
  type SourceMap,
} from '../source-path/index.js';

/**
 * Discriminated failure variants from {@link parseJsonLdCompatible}.
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
 * Successful parse output: the typed Dataset plus a `SourceMap`
 * keyed by `quadKey(q)` carrying the root JSON Pointer for each
 * emitted Quad. Precise per-`@id` resolution lands in a follow-on
 * cycle.
 */
export interface JsonLdParseOutput {
  readonly dataset: DatasetCore;
  readonly sourceMap: SourceMap;
}

const ROOT_POINTER: JsonPointer = { raw: '' };
const ROOT_LOCATION: SourceLocation = { kind: 'json-pointer', pointer: ROOT_POINTER };

async function jsonldDocumentToNquads(
  document: JsonLdDocument,
): Promise<Result<string, JsonLdParseError>> {
  try {
    const rdf = await toRDF(document, { format: 'application/n-quads' });
    if (typeof rdf !== 'string') {
      return err({
        kind: 'jsonld-to-rdf-failed',
        message: 'jsonld.toRDF returned a non-string value for the n-quads format request',
      });
    }
    return ok(rdf);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'jsonld-to-rdf-failed', message });
  }
}

function parseNquads(nquads: string): Result<readonly N3ParserQuad[], JsonLdParseError> {
  try {
    return ok(new N3Parser({ format: 'N-Quads' }).parse(nquads, null));
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err({ kind: 'nquads-parse-failed', message });
  }
}

function assembleParseOutput(
  n3Quads: readonly N3ParserQuad[],
): Result<JsonLdParseOutput, JsonLdParseError> {
  const dataset = createDataset();
  const entries: [string, SourceLocation][] = [];
  for (const n3Quad of n3Quads) {
    const normalised = normalizeQuad(n3Quad);
    if (isNormalizeError(normalised)) {
      return err(normalised);
    }
    dataset.add(normalised);
    entries.push([quadKey(normalised), ROOT_LOCATION]);
  }
  const sourceMap: SourceMap = new Map(entries);
  return ok({ dataset, sourceMap });
}

/**
 * Parse a JSON-LD-compatible document into a graph-core
 * `DatasetCore` plus a `SourceMap` of per-quad source locations.
 * Asynchronous because `jsonld.toRDF` returns a Promise.
 */
export async function parseJsonLdCompatible(
  document: JsonLdDocument,
): Promise<Result<JsonLdParseOutput, JsonLdParseError>> {
  const nquadsResult = await jsonldDocumentToNquads(document);
  if (!nquadsResult.ok) {
    return nquadsResult;
  }
  const n3QuadsResult = parseNquads(nquadsResult.value);
  if (!n3QuadsResult.ok) {
    return n3QuadsResult;
  }
  return assembleParseOutput(n3QuadsResult.value);
}
