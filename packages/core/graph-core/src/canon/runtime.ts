/**
 * Typed runtime wrapper around the `rdf-canonize` library.
 *
 * `rdf-canonize` ships no TypeScript declarations and exposes a CommonJS
 * shape; the local ambient declaration in `./rdf-canonize.d.ts` covers the
 * narrow surface used here. This module is the single point of contact for
 * those native APIs: the `NQuads.parse` raw output and the native canonize
 * signature do not leak past this file. Downstream callers consume only the
 * typed `CanonizeRuntime` surface defined below.
 */

import { canonize as nativeCanonize, NQuads as NativeNQuads } from 'rdf-canonize';

/**
 * Quad shape produced by the rdf-canonize NQuads parser.
 *
 * The parser emits term POJOs with a minimal `{ termType, value }` shape
 * for NamedNode, BlankNode and DefaultGraph, and
 * `{ termType, value, datatype, language? }` for Literal. There is no
 * `direction` field and no `language: ''` default — the canonical RDF/JS
 * Term shape is reconstructed in `canonicalize.ts` by routing every parsed
 * term through `data-factory` helpers.
 */
export interface ParsedQuadTerm {
  readonly termType: 'NamedNode' | 'BlankNode' | 'Literal' | 'DefaultGraph';
  readonly value: string;
  readonly datatype?: { readonly termType: 'NamedNode'; readonly value: string };
  readonly language?: string;
}

export interface ParsedQuad {
  readonly subject: ParsedQuadTerm;
  readonly predicate: ParsedQuadTerm;
  readonly object: ParsedQuadTerm;
  readonly graph: ParsedQuadTerm;
}

/**
 * Options passed to the native canonize call. Algorithm and URDNA2015
 * rejection are non-negotiable doctrinal choices (no aliases, no fallbacks)
 * and are pinned in `canonicalize.ts` rather than exposed here.
 */
interface NativeCanonizeOptions {
  readonly algorithm: 'RDFC-1.0';
  readonly rejectURDNA2015: true;
}

export interface CanonizeRuntime {
  canonize(input: readonly unknown[], options: NativeCanonizeOptions): Promise<string>;
  parseNQuads(input: string): readonly ParsedQuad[];
}

export const canonizeRuntime: CanonizeRuntime = {
  canonize: (input, options) => nativeCanonize(input, options),
  parseNQuads: (input) => NativeNQuads.parse(input),
};
