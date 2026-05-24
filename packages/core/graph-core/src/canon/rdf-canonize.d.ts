/**
 * Local ambient declaration for `rdf-canonize` (v5).
 *
 * The upstream library ships no TypeScript types. This declaration covers
 * the narrow surface graph-core's `canon/runtime.ts` consumes: the async
 * `canonize` entry point and the `NQuads.parse` static method. No other
 * file in this workspace imports from `rdf-canonize` directly.
 */

declare module 'rdf-canonize' {
  interface RdfCanonizeParsedTerm {
    readonly termType: 'NamedNode' | 'BlankNode' | 'Literal' | 'DefaultGraph';
    readonly value: string;
    readonly datatype?: { readonly termType: 'NamedNode'; readonly value: string };
    readonly language?: string;
  }

  interface RdfCanonizeParsedQuad {
    readonly subject: RdfCanonizeParsedTerm;
    readonly predicate: RdfCanonizeParsedTerm;
    readonly object: RdfCanonizeParsedTerm;
    readonly graph: RdfCanonizeParsedTerm;
  }

  interface RdfCanonizeOptions {
    // The native rdf-canonize API accepts any algorithm string and errors at
    // runtime when an unknown or deprecated value is passed. The ambient
    // mirrors the library contract; doctrinal pinning to 'RDFC-1.0' lives at
    // the call site in `canonicalize.ts`, not in the type of someone else's
    // library.
    readonly algorithm: string;
    readonly rejectURDNA2015: true;
  }

  export function canonize(input: readonly unknown[], options: RdfCanonizeOptions): Promise<string>;

  export const NQuads: {
    parse(input: string): readonly RdfCanonizeParsedQuad[];
  };
}
