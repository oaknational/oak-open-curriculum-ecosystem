/**
 * RDFC-1.0 canonicalisation for graph-core Datasets.
 *
 * Produces three cohesive outputs in one pass: canonical N-Quads, the
 * SHA-256 hash of those N-Quads, and a `DatasetCore` reconstructed via
 * `data-factory` helpers so every returned Term satisfies the canonical
 * RDF/JS shape (notably `direction: ''` on literals per RDF 1.2).
 *
 * Doctrinal: algorithm pinned to `RDFC-1.0`, `rejectURDNA2015: true`, no
 * fallbacks, every error carries `kind` + step + native cause.
 */

import { createHash } from 'node:crypto';

import { blankNode, defaultGraph, literal, namedNode, quad } from '../data-factory/index.js';
import { createDataset, type DatasetCore } from '../dataset/index.js';
import type { GraphTerm, ObjectTerm, PredicateTerm, Quad, SubjectTerm } from '../term/index.js';

import {
  canonizeRuntime,
  type CanonizeRuntime,
  type ParsedQuad,
  type ParsedQuadTerm,
} from './runtime.js';

const RDF_LANG_STRING_IRI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString';

export type CanonicalizationErrorKind =
  | 'canonize_failed'
  | 'reparse_failed'
  | 'reconstruction_failed';

export interface CanonicalizationError {
  readonly kind: CanonicalizationErrorKind;
  readonly step: 'canonize' | 'parse_nquads' | 'reconstruct_dataset';
  readonly message: string;
  readonly cause?: Error;
}

export interface CanonicalizedDataset {
  readonly dataset: DatasetCore;
  readonly canonicalNQuads: string;
  readonly hash: string;
}

export type CanonicalizationResult =
  | { readonly ok: true; readonly value: CanonicalizedDataset }
  | { readonly ok: false; readonly error: CanonicalizationError };

interface CanonicalizeDependencies {
  readonly runtime: CanonizeRuntime;
}

const defaultDependencies: CanonicalizeDependencies = {
  runtime: canonizeRuntime,
};

function toError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }
  return new Error(typeof cause === 'string' ? cause : 'Unknown error');
}

function toSubject(term: ParsedQuadTerm): SubjectTerm {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  throw new Error(`Unexpected subject termType from N-Quads parse: ${term.termType}`);
}

function toPredicate(term: ParsedQuadTerm): PredicateTerm {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  throw new Error(`Unexpected predicate termType from N-Quads parse: ${term.termType}`);
}

function toObject(term: ParsedQuadTerm): ObjectTerm {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  if (term.termType === 'Literal') {
    const datatypeIri = term.datatype?.value;
    if (datatypeIri === undefined) {
      throw new Error('Literal term from N-Quads parse is missing a datatype IRI');
    }
    if (datatypeIri === RDF_LANG_STRING_IRI) {
      const tag = term.language;
      if (tag === undefined) {
        throw new Error('rdf:langString literal from N-Quads parse is missing a language tag');
      }
      return literal(term.value, tag);
    }
    return literal(term.value, namedNode(datatypeIri));
  }
  throw new Error(`Unexpected object termType from N-Quads parse: ${term.termType}`);
}

function toGraph(term: ParsedQuadTerm): GraphTerm {
  if (term.termType === 'DefaultGraph') {
    return defaultGraph();
  }
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  throw new Error(`Unexpected graph termType from N-Quads parse: ${term.termType}`);
}

function reconstructQuad(parsed: ParsedQuad): Quad {
  return quad(
    toSubject(parsed.subject),
    toPredicate(parsed.predicate),
    toObject(parsed.object),
    toGraph(parsed.graph),
  );
}

function datasetToCanonizeInput(dataset: DatasetCore): readonly Quad[] {
  return Array.from(dataset);
}

type StepResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: CanonicalizationError };

async function runCanonize(
  runtime: CanonizeRuntime,
  dataset: DatasetCore,
): Promise<StepResult<string>> {
  try {
    const canonicalNQuads = await runtime.canonize(datasetToCanonizeInput(dataset), {
      algorithm: 'RDFC-1.0',
      rejectURDNA2015: true,
    });
    return { ok: true, value: canonicalNQuads };
  } catch (cause) {
    return {
      ok: false,
      error: {
        kind: 'canonize_failed',
        step: 'canonize',
        message: 'rdf-canonize canonize call rejected the input dataset',
        cause: toError(cause),
      },
    };
  }
}

function runParse(runtime: CanonizeRuntime, nquads: string): StepResult<readonly ParsedQuad[]> {
  try {
    return { ok: true, value: runtime.parseNQuads(nquads) };
  } catch (cause) {
    return {
      ok: false,
      error: {
        kind: 'reparse_failed',
        step: 'parse_nquads',
        message: 'rdf-canonize NQuads.parse failed on canonical N-Quads output',
        cause: toError(cause),
      },
    };
  }
}

function runReconstruct(parsedQuads: readonly ParsedQuad[]): StepResult<DatasetCore> {
  try {
    return { ok: true, value: createDataset(parsedQuads.map(reconstructQuad)) };
  } catch (cause) {
    return {
      ok: false,
      error: {
        kind: 'reconstruction_failed',
        step: 'reconstruct_dataset',
        message: 'Failed to reconstruct graph-core DatasetCore from canonical N-Quads',
        cause: toError(cause),
      },
    };
  }
}

export async function canonicalize(
  dataset: DatasetCore,
  dependencies: CanonicalizeDependencies = defaultDependencies,
): Promise<CanonicalizationResult> {
  const canonized = await runCanonize(dependencies.runtime, dataset);
  if (!canonized.ok) {
    return canonized;
  }
  const parsed = runParse(dependencies.runtime, canonized.value);
  if (!parsed.ok) {
    return parsed;
  }
  const reconstructed = runReconstruct(parsed.value);
  if (!reconstructed.ok) {
    return reconstructed;
  }
  const hash = createHash('sha256').update(canonized.value, 'utf8').digest('hex');
  return {
    ok: true,
    value: {
      dataset: reconstructed.value,
      canonicalNQuads: canonized.value,
      hash,
    },
  };
}
