import { Buffer } from 'node:buffer';
import { createHash, type Hash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import type { GraphEdge, GraphEdgeFor, GraphNode } from './graph-model.js';
import { compareGraphText, validateGraphRepoPath } from './graph-validation.js';
import {
  GRAPH_PRODUCERS_BY_KIND,
  type GraphEdgeKind,
  type GraphProducerFor,
} from './graph-vocabulary.js';
import { lengthFrame } from './length-framing.js';
import type { RepoPath } from './scalar-model.js';

const EDGE_DOMAIN = Buffer.from('typescript-estate-graph-edge-v1\0', 'utf8');

export interface RawGraphEdgeObservation {
  readonly source: GraphNode;
  readonly target: GraphNode;
  readonly kind: GraphEdgeKind;
  readonly status: GraphEdge['status'];
  readonly producer: string;
  readonly evidencePath: RepoPath;
}

interface MutableEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly kind: GraphEdgeKind;
  readonly status: GraphEdge['status'];
  readonly producer: string;
  occurrenceCount: number;
  readonly evidencePaths: Set<RepoPath>;
}

/** Aggregate equal raw relationship occurrences into frozen graph edges. */
export function aggregateGraphEdges(
  observations: readonly RawGraphEdgeObservation[],
): Result<readonly GraphEdge[], EstateReviewError> {
  const byId = new Map<string, MutableEdge>();
  for (const observation of observations) {
    const added = addObservation(byId, observation);
    if (isErr(added)) {
      return added;
    }
  }
  const frozen: GraphEdge[] = [];
  for (const edge of [...byId.values()].sort((left, right) =>
    compareGraphText(left.id, right.id),
  )) {
    const result = freezeEdge(edge);
    if (isErr(result)) {
      return result;
    }
    frozen.push(result.value);
  }
  return ok(frozen);
}

function addObservation(
  byId: Map<string, MutableEdge>,
  observation: RawGraphEdgeObservation,
): Result<undefined, EstateReviewError> {
  const valid = validateObservation(observation);
  if (isErr(valid)) {
    return valid;
  }
  const built = edgeFromObservation(observation);
  if (isErr(built)) {
    return built;
  }
  const existing = byId.get(built.value.id);
  if (existing === undefined) {
    byId.set(built.value.id, built.value);
  } else if (!sameEdgeTuple(existing, built.value)) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        `graph edge id collision '${built.value.id}' has unequal identity tuples`,
      ),
    );
  } else {
    existing.occurrenceCount += 1;
    existing.evidencePaths.add(observation.evidencePath);
  }
  return ok(undefined);
}

function validateObservation(
  observation: RawGraphEdgeObservation,
): Result<undefined, EstateReviewError> {
  const producers: readonly string[] = GRAPH_PRODUCERS_BY_KIND[observation.kind];
  if (!producers.includes(observation.producer)) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        `producer '${observation.producer}' is invalid for '${observation.kind}'`,
      ),
    );
  }
  return validateGraphRepoPath(observation.evidencePath);
}

function edgeFromObservation(
  observation: RawGraphEdgeObservation,
): Result<MutableEdge, EstateReviewError> {
  const tuple = [
    observation.kind,
    observation.source.id,
    observation.target.id,
    observation.producer,
    observation.status,
  ];
  const hash = createHash('sha256').update(EDGE_DOMAIN);
  for (const component of tuple) {
    const appended = appendFramed(hash, component);
    if (isErr(appended)) {
      return appended;
    }
  }
  return ok({
    id: `edge:${observation.kind}:${hash.digest('hex')}`,
    source: observation.source.id,
    target: observation.target.id,
    kind: observation.kind,
    status: observation.status,
    producer: observation.producer,
    occurrenceCount: 1,
    evidencePaths: new Set([observation.evidencePath]),
  });
}

function freezeEdge(edge: MutableEdge): Result<GraphEdge, EstateReviewError> {
  const sortedPaths = [...edge.evidencePaths].sort(compareGraphText);
  const [first, ...rest] = sortedPaths;
  if (first === undefined) {
    return err(new EstateReviewError('VALIDATION_FAILED', 'graph edge has no evidence path'));
  }
  const evidencePaths: readonly [RepoPath, ...RepoPath[]] = [first, ...rest];
  return isPrimaryKind(edge.kind)
    ? freezePrimaryEdge(edge, evidencePaths)
    : freezeSecondaryEdge(edge, evidencePaths);
}

function freezePrimaryEdge(
  edge: MutableEdge,
  evidencePaths: readonly [RepoPath, ...RepoPath[]],
): Result<GraphEdge, EstateReviewError> {
  switch (edge.kind) {
    case 'import':
      return freezeTypedEdge(edge, 'import', evidencePaths);
    case 're-export':
      return freezeTypedEdge(edge, 're-export', evidencePaths);
    case 'export-map':
      return freezeTypedEdge(edge, 'export-map', evidencePaths);
    case 'generation':
      return freezeTypedEdge(edge, 'generation', evidencePaths);
    default:
      return err(new EstateReviewError('VALIDATION_FAILED', 'unexpected primary edge kind'));
  }
}

function freezeSecondaryEdge(
  edge: MutableEdge,
  evidencePaths: readonly [RepoPath, ...RepoPath[]],
): Result<GraphEdge, EstateReviewError> {
  switch (edge.kind) {
    case 'script':
      return freezeTypedEdge(edge, 'script', evidencePaths);
    case 'filesystem-read':
      return freezeTypedEdge(edge, 'filesystem-read', evidencePaths);
    case 'filesystem-write':
      return freezeTypedEdge(edge, 'filesystem-write', evidencePaths);
    case 'build':
      return freezeTypedEdge(edge, 'build', evidencePaths);
    case 'runtime-registration':
      return freezeTypedEdge(edge, 'runtime-registration', evidencePaths);
    default:
      return err(new EstateReviewError('VALIDATION_FAILED', 'unexpected secondary edge kind'));
  }
}

function freezeTypedEdge<K extends GraphEdgeKind>(
  edge: MutableEdge,
  kind: K,
  evidencePaths: readonly [RepoPath, ...RepoPath[]],
): Result<GraphEdgeFor<K>, EstateReviewError> {
  const producer = producerForKind(kind, edge.producer);
  return isErr(producer)
    ? producer
    : ok({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        kind,
        status: edge.status,
        producer: producer.value,
        occurrenceCount: edge.occurrenceCount,
        evidencePaths,
      });
}

function producerForKind<K extends GraphEdgeKind>(
  kind: K,
  producer: string,
): Result<GraphProducerFor<K>, EstateReviewError> {
  const matched = GRAPH_PRODUCERS_BY_KIND[kind].find((candidate) => candidate === producer);
  return matched === undefined
    ? err(
        new EstateReviewError(
          'VALIDATION_FAILED',
          `producer '${producer}' is invalid for '${kind}'`,
        ),
      )
    : ok(matched);
}

function appendFramed(hash: Hash, value: string): Result<undefined, EstateReviewError> {
  const framed = lengthFrame(Buffer.from(value, 'utf8'));
  if (isErr(framed)) {
    return err(
      new EstateReviewError('VALIDATION_FAILED', 'cannot frame graph identity component', {
        cause: framed.error,
      }),
    );
  }
  hash.update(framed.value.length);
  hash.update(framed.value.bytes);
  return ok(undefined);
}

function sameEdgeTuple(left: MutableEdge, right: MutableEdge): boolean {
  return (
    left.kind === right.kind &&
    left.source === right.source &&
    left.target === right.target &&
    left.producer === right.producer &&
    left.status === right.status
  );
}

function isPrimaryKind(kind: GraphEdgeKind): boolean {
  return (
    kind === 'import' || kind === 're-export' || kind === 'export-map' || kind === 'generation'
  );
}
