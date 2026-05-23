/**
 * Source-location primitives for graph-ingest parsers.
 *
 * Defines the typed surfaces parsers use to attach a stable source
 * reference to every emitted `Quad`. Shape comes from the convergent
 * WS2.3 pre-execution reviewer verdict:
 *
 * - **`JsonPointer`** — RFC 6901 JSON Pointer; opaque interface
 *   wrapper around a validated raw string, constructed via the
 *   runtime `Result`-validator {@link jsonPointer}. Used by the
 *   JSON-LD-compatible parser, whose input IS a JSON document and
 *   where the pointer references real structure.
 * - **`TurtleSourceLocation`** — line/column position from n3.js
 *   parser internals. Used by the Turtle parser, whose input is not
 *   JSON and where applying JSON Pointer would fabricate a synthetic
 *   wrapper (type-expert verdict: that would be a type-level lie).
 * - **`SourceLocation`** — discriminated union over both parsers,
 *   carrying `kind: 'json-pointer' | 'turtle-location'`.
 * - **`quadKey(q)`** — canonical N-Quads-style string serialisation
 *   of a Quad, used as the key in `SourceMap`. Quad-object-keyed
 *   maps would be UNSAFE because `Dataset.add()` deduplicates via
 *   structural `equals()`, not referential `===`; two structurally
 *   equal Quads constructed at different sites would silently miss
 *   each other's source paths through a reference-keyed map.
 * - **`SourceMap`** — `ReadonlyMap<string, SourceLocation>` keyed by
 *   `quadKey(q)`.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import type {
  GraphTerm,
  Literal,
  ObjectTerm,
  PredicateTerm,
  Quad,
  SubjectTerm,
  TripleTerm,
} from '@oaknational/graph-core/term';

// =====================================================================
// JsonPointer (RFC 6901)
// =====================================================================

/**
 * RFC 6901 JSON Pointer, wrapped in an opaque interface so a raw
 * string cannot be passed where a validated pointer is required.
 *
 * Per type-expert verdict on this cycle: the interface stores ONLY
 * the canonical raw string; segments are produced on demand by
 * {@link parseSegments}, never stored alongside `raw`. Storing both
 * representations would create a synchronisation invariant the type
 * cannot enforce.
 */
export interface JsonPointer {
  readonly raw: string;
}

/** Discriminated failure variant from {@link jsonPointer}. */
export interface JsonPointerParseError {
  readonly kind: 'invalid-json-pointer';
  readonly input: string;
  readonly message: string;
}

/**
 * Validate an arbitrary string as an RFC 6901 JSON Pointer.
 *
 * Empty string is the root pointer. Otherwise the string must start
 * with `/`. Each `~` character must be followed by `0` or `1` (the
 * RFC 6901 §4 escapes for `~` and `/` respectively). All other
 * characters are valid.
 */
export function jsonPointer(raw: string): Result<JsonPointer, JsonPointerParseError> {
  if (raw === '') {
    return ok({ raw });
  }
  if (!raw.startsWith('/')) {
    return err({
      kind: 'invalid-json-pointer',
      input: raw,
      message: 'JSON Pointer must be empty or start with /',
    });
  }
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] === '~') {
      const next = raw[i + 1];
      if (next !== '0' && next !== '1') {
        return err({
          kind: 'invalid-json-pointer',
          input: raw,
          message: `~ at index ${i} must be followed by 0 or 1`,
        });
      }
    }
  }
  return ok({ raw });
}

/**
 * Decode a JsonPointer into its constituent segments.
 *
 * Per RFC 6901 §4: `~1` decodes to `/`, `~0` decodes to `~`. The
 * empty pointer decodes to an empty segments array.
 */
export function parseSegments(p: JsonPointer): readonly string[] {
  if (p.raw === '') {
    return [];
  }
  const body = p.raw.slice(1);
  return body.split('/').map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'));
}

/**
 * Re-encode segments into a JsonPointer.
 *
 * Per RFC 6901 §4: `/` encodes to `~1`, `~` encodes to `~0`. The
 * empty segments array encodes to the empty pointer.
 *
 * **Order matters**: `~` must be escaped to `~0` BEFORE `/` is
 * escaped to `~1`, otherwise the `~1` produced by `/` would be
 * double-encoded.
 */
export function serialiseSegments(segments: readonly string[]): JsonPointer {
  if (segments.length === 0) {
    return { raw: '' };
  }
  const encoded = segments.map((s) => s.replace(/~/g, '~0').replace(/\//g, '~1'));
  return { raw: `/${encoded.join('/')}` };
}

// =====================================================================
// TurtleSourceLocation
// =====================================================================

/**
 * 1-indexed line/column position from a Turtle source document.
 *
 * Distinct from `JsonPointer` because Turtle is not JSON; applying
 * RFC 6901 to a Turtle document would fabricate a synthetic JSON
 * wrapper that references an internal model artefact rather than
 * the actual source.
 *
 * **`line` / `column` may be `null`** when the parser cannot
 * unambiguously resolve the source position. The honest case from
 * the `ws2-source-map-parser-integration` cycle: n3.js v2.0.3
 * genuinely hides per-quad token position from the public + private
 * APIs (verified in `node_modules/n3/src/N3Parser.js:1079-1082` —
 * the `_emit` method receives only quad terms, never the token).
 * The Turtle parser pre-splits the source into a line index and
 * post-correlates quads to lines by scanning for the subject IRI;
 * compound triples like `ex:a ex:p ex:b, ex:c ;` produce two quads
 * from one line, only one of which can be unambiguously located.
 * The unresolvable case emits `{ line: null, column: null }`. The
 * column position is currently always `null` (line-level
 * resolution only); preserved in the type for forward compatibility
 * if a future n3 release exposes column info.
 */
export interface TurtleSourceLocation {
  readonly line: number | null;
  readonly column: number | null;
}

// =====================================================================
// SourceLocation discriminated union
// =====================================================================

/**
 * Per-quad source location across all graph-ingest parsers.
 *
 * `kind: 'json-pointer'` for parsers whose input is a JSON document
 * (JSON-LD-compatible). `kind: 'turtle-location'` for parsers whose
 * input is a textual non-JSON format (Turtle, N-Triples, N-Quads).
 *
 * Future parser modes that produce yet another source-reference
 * shape (e.g., a binary RDF format with byte offsets) extend this
 * union additively.
 */
export type SourceLocation =
  | { readonly kind: 'json-pointer'; readonly pointer: JsonPointer }
  | {
      readonly kind: 'turtle-location';
      readonly line: number | null;
      readonly column: number | null;
    };

// =====================================================================
// quadKey + SourceMap
// =====================================================================

/**
 * Canonical string serialisation of a `Quad` for use as a stable
 * `SourceMap` key.
 *
 * The serialisation is an N-Quads-style "subject predicate object
 * graph" token sequence. Each term is encoded in a canonical form
 * so structurally-equal Quads always produce the same key string.
 *
 * **Why a string key, not a Quad key**: graph-core's
 * `DatasetCore.add()` deduplicates via structural `equals()`, not
 * referential `===`. A `Map<Quad, SourceLocation>` keyed by object
 * reference would silently miss source paths for structurally-equal
 * Quads constructed at different sites (e.g., a Dataset copied via
 * `createDataset([...existing])`). A stable derived string key is
 * the only shape that survives copy operations.
 */
export function quadKey(q: Quad): string {
  const parts = [termKey(q.subject), termKey(q.predicate), termKey(q.object), termKey(q.graph)];
  return parts.join(' ');
}

type AnyTerm = SubjectTerm | PredicateTerm | ObjectTerm | GraphTerm | TripleTerm | Literal;

function termKey(t: AnyTerm): string {
  if (t.termType === 'NamedNode') {
    return `<${t.value}>`;
  }
  if (t.termType === 'BlankNode') {
    return `_:${t.value}`;
  }
  if (t.termType === 'Literal') {
    const escapedValue = JSON.stringify(t.value);
    if (t.language.length > 0) {
      return `${escapedValue}@${t.language}`;
    }
    return `${escapedValue}^^<${t.datatype.value}>`;
  }
  if (t.termType === 'DefaultGraph') {
    return '';
  }
  // TripleTerm — recursive
  return `<< ${termKey(t.subject)} ${termKey(t.predicate)} ${termKey(t.object)} >>`;
}

/**
 * Map of canonical quad key (from {@link quadKey}) to the
 * `SourceLocation` the parser emitted for that Quad.
 *
 * Empty when the parser cannot attach source locations to any Quad
 * (a defensive shape; in practice every emitted Quad should carry a
 * source location at gate-1a closure per §Test discipline invariant
 * #3).
 */
export type SourceMap = ReadonlyMap<string, SourceLocation>;
