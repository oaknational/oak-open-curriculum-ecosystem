import type {
  ArchetypeId,
  GRAPH_EDGE_KINDS,
  GRAPH_NODE_KINDS,
  GRAPH_PRODUCERS_BY_KIND,
  GraphEdgeKind,
  GraphProducer,
} from './graph-vocabulary.js';
import type { REPETITION_REGION_KINDS } from './file-vocabulary.js';
import type { AtLeastElevenReadonly } from './scalar-model.js';

export interface DataStructureDefinition {
  readonly id: string;
  readonly astKinds: readonly string[];
  readonly namedReferences: readonly string[];
}

export interface AlgorithmDefinition {
  readonly id: string;
  readonly astKinds: readonly string[];
  readonly callNames: readonly string[];
}

export interface ConstructsConfig {
  readonly runtimeValueStructures: AtLeastElevenReadonly<DataStructureDefinition>;
  readonly typeModelStructures: AtLeastElevenReadonly<DataStructureDefinition>;
  readonly algorithms: AtLeastElevenReadonly<AlgorithmDefinition>;
  readonly namedReferenceMatch: string;
  readonly callNameMatch: string;
  readonly astKindCount: string;
  readonly rankingBoundary: string;
  readonly algorithmBoundary: string;
}

export interface RepetitionConfig {
  readonly minimumAstNodes: number;
  readonly minimumTokens: number;
  readonly minimumFiles: number;
  readonly eligibility: string;
  readonly regionAstKinds: typeof REPETITION_REGION_KINDS;
  readonly candidateEligibility: string;
  readonly nodeCount: string;
  readonly tokenCount: string;
  readonly exactEncodingVersion: 'typescript-printer-trivia-free-v1';
  readonly exactNormalisation: string;
  readonly exactFingerprint: string;
  readonly structuralEncodingVersion: 'typescript-getchildren-kinds-v1';
  readonly structuralNormalisation: string;
  readonly structuralFingerprint: string;
  readonly memberIdentity: string;
  readonly groupOrdering: string;
}

export interface TypeTruthSignalsConfig {
  readonly typeAssertion: string;
  readonly anyKeyword: string;
  readonly unknownKeyword: string;
  readonly nonNullAssertion: string;
  readonly typescriptSuppression: string;
  readonly recordStringUnknown: string;
  readonly zodUnknown: string;
  readonly interpretation: string;
}

export interface GraphObservationConfig {
  readonly nodeKinds: typeof GRAPH_NODE_KINDS;
  readonly edgeKinds: typeof GRAPH_EDGE_KINDS;
  readonly producers: Readonly<Record<GraphEdgeKind, string>>;
  readonly producerTokens: typeof GRAPH_PRODUCERS_BY_KIND;
  readonly endpointConstruction: Readonly<Record<GraphProducer, string>>;
  readonly nodeIdentity: string;
  readonly edgeIdentity: string;
  readonly archetypeSelectorResolution: string;
  readonly ownershipChains: string;
  readonly foundationBoundary: string;
}

export interface ArchetypeStageConfig {
  readonly kind: 'file' | 'artefact' | 'artefact-prefix' | 'workspace';
  readonly value: string;
}

export interface ArchetypeChainConfigFor<A extends ArchetypeId> {
  readonly id: A;
  readonly semanticAuthority: ArchetypeStageConfig;
  readonly generator: ArchetypeStageConfig;
  readonly generatedCarrier: ArchetypeStageConfig;
  readonly runtimeOwner: ArchetypeStageConfig;
  readonly composition: ArchetypeStageConfig;
  readonly remediationLocus: ArchetypeStageConfig;
}

export type ArchetypeChainsConfig = readonly [
  ArchetypeChainConfigFor<'openapi-curriculum-sdk-mcp'>,
  ArchetypeChainConfigFor<'bulk-vocabulary-search-consumer'>,
  ArchetypeChainConfigFor<'agent-tools-dist-cli-hook'>,
  ArchetypeChainConfigFor<'tsx-bundle-served-ui'>,
];
