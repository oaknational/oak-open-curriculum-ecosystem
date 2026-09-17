import type {
  ArchetypeId,
  GraphEdgeKind,
  GraphNodeKind,
  GraphProducerFor,
} from './graph-vocabulary.js';
import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';

export interface GraphNode {
  readonly id: string;
  readonly kind: GraphNodeKind;
  readonly identityComponents: readonly string[];
  readonly label: string;
  readonly path: RepoPath | null;
}

export interface GraphEdgeFor<K extends GraphEdgeKind> {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly kind: K;
  readonly status: 'observed' | 'ambiguous';
  readonly producer: GraphProducerFor<K>;
  readonly occurrenceCount: number;
  readonly evidencePaths: NonEmptyReadonlyArray<RepoPath>;
}

export type GraphEdge = {
  readonly [K in GraphEdgeKind]: GraphEdgeFor<K>;
}[GraphEdgeKind];

export type OwnershipStage =
  | 'semanticAuthority'
  | 'generator'
  | 'generatedCarrier'
  | 'runtimeOwner'
  | 'composition'
  | 'remediationLocus';

export interface OwnershipChainFor<A extends ArchetypeId> extends Readonly<
  Record<OwnershipStage, string | null>
> {
  readonly id: A;
  readonly archetype: A;
  readonly missingEvidence: readonly string[];
  readonly derivedFromEdgeIndexes: readonly number[];
}

export type OwnershipChain = {
  readonly [A in ArchetypeId]: OwnershipChainFor<A>;
}[ArchetypeId];

export type OwnershipChains = readonly [
  OwnershipChainFor<'openapi-curriculum-sdk-mcp'>,
  OwnershipChainFor<'bulk-vocabulary-search-consumer'>,
  OwnershipChainFor<'agent-tools-dist-cli-hook'>,
  OwnershipChainFor<'tsx-bundle-served-ui'>,
];

export interface GraphObservations {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly ownershipChains: OwnershipChains;
}

/** An occurrence before identical edge tuples are aggregated. */
interface GraphEdgeObservationFor<K extends GraphEdgeKind> {
  readonly source: GraphNode;
  readonly target: GraphNode;
  readonly kind: K;
  readonly status: GraphEdge['status'];
  readonly producer: GraphProducerFor<K>;
  readonly evidencePath: RepoPath;
}

export type GraphEdgeObservation = {
  readonly [K in GraphEdgeKind]: GraphEdgeObservationFor<K>;
}[GraphEdgeKind];
