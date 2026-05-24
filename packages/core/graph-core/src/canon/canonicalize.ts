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

import { createDataset, type DatasetCore } from '../dataset/index.js';
import type { Quad } from '../term/index.js';

import { canonizeRuntime, type CanonizeRuntime, type ParsedQuad } from './runtime.js';
import { reconstructQuad, TermReconstructionError } from './term-reconstruction.js';

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
    const message =
      cause instanceof TermReconstructionError
        ? `Failed to reconstruct graph-core DatasetCore: ${cause.position} term (termType=${cause.termType})`
        : 'Failed to reconstruct graph-core DatasetCore from canonical N-Quads';
    return {
      ok: false,
      error: {
        kind: 'reconstruction_failed',
        step: 'reconstruct_dataset',
        message,
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
  const hash = createHash('sha256').update(canonized.value).digest('hex');
  return {
    ok: true,
    value: {
      dataset: reconstructed.value,
      canonicalNQuads: canonized.value,
      hash,
    },
  };
}
