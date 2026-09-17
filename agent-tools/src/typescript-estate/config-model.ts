import type {
  ArchetypeChainsConfig,
  ConstructsConfig,
  GraphObservationConfig,
  RepetitionConfig,
  TypeTruthSignalsConfig,
} from './config-analysis-model.js';
import type {
  GeneratedOutputRule,
  GeneratedOutputRuleSemantics,
  ProvenanceClassificationConfig,
  RoleRule,
  RoleSemanticsConfig,
} from './config-classification-model.js';
import type {
  ConfigIdentityFields,
  DeliveryClassificationConfig,
  DetectorDefinition,
  ImplementationGateConfig,
  ModuleResolutionConfig,
  SnapshotConfig,
  SourcePredicateDefinitions,
  VocabularyConfig,
} from './config-core-model.js';
import type {
  GenerationProofConfig,
  HeldOutAuditConfig,
  ImplementationIdentityConfig,
  OrderingConfig,
  OutputWriteConfig,
  PackedSdkConsumerProofConfig,
  PlacementConformanceConfig,
  ProofEnvironmentPolicyConfig,
  ResourceLimits,
  SchemaShapeFingerprintConfig,
  SemanticValidationConfig,
  SerialisationConfig,
  TestAndProofPlacementConfig,
} from './config-proof-model.js';
import type { NonEmptyReadonlyArray } from './scalar-model.js';

/** Closed, schema-equivalent shape accepted only after strict AJV validation. */
export interface DetectorConfig extends ConfigIdentityFields {
  readonly implementationGate: ImplementationGateConfig;
  readonly snapshot: SnapshotConfig;
  readonly moduleResolution: ModuleResolutionConfig;
  readonly detectors: NonEmptyReadonlyArray<DetectorDefinition>;
  readonly generatedOutputRules: readonly GeneratedOutputRule[];
  readonly generatedOutputRuleSemantics: GeneratedOutputRuleSemantics;
  readonly vocabularies: VocabularyConfig;
  readonly provenanceClassification: ProvenanceClassificationConfig;
  readonly roleRules: NonEmptyReadonlyArray<RoleRule>;
  readonly roleSemantics: RoleSemanticsConfig;
  readonly sourcePredicateDefinitions: SourcePredicateDefinitions;
  readonly deliveryClassification: DeliveryClassificationConfig;
  readonly constructs: ConstructsConfig;
  readonly repetition: RepetitionConfig;
  readonly typeTruthSignals: TypeTruthSignalsConfig;
  readonly graphObservation: GraphObservationConfig;
  readonly archetypeChains: ArchetypeChainsConfig;
  readonly placementConformance: PlacementConformanceConfig;
  readonly proofEnvironmentPolicy: ProofEnvironmentPolicyConfig;
  readonly generationProof: GenerationProofConfig;
  readonly packedSdkConsumerProof: PackedSdkConsumerProofConfig;
  readonly schemaShapeFingerprint: SchemaShapeFingerprintConfig;
  readonly testAndProofPlacement: TestAndProofPlacementConfig;
  readonly resourceLimits: ResourceLimits;
  readonly outputWrite: OutputWriteConfig;
  readonly ordering: OrderingConfig;
  readonly semanticValidation: SemanticValidationConfig;
  readonly implementationIdentity: ImplementationIdentityConfig;
  readonly serialisation: SerialisationConfig;
  readonly heldOutAudit: HeldOutAuditConfig;
}
