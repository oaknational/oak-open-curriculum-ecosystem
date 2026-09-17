import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';

export interface PlacementConformanceConfig {
  readonly graphStackRoots: NonEmptyReadonlyArray<RepoPath>;
  readonly requiredAdrIds: readonly ['ADR-173', 'ADR-179', 'ADR-221'];
  readonly rule: string;
  readonly semanticValidation: string;
}

export interface ProofEnvironmentPolicyConfig {
  readonly policyId: 'proof-env-v1';
  readonly recordedValueNames: readonly [
    'CI',
    'NODE_ENV',
    'TZ',
    'LANG',
    'LC_ALL',
    'GIT_NO_LAZY_FETCH',
  ];
  readonly secretPresenceNames: readonly [
    'OAK_API_KEY',
    'GITHUB_TOKEN',
    'GH_TOKEN',
    'LINEAR_API_KEY',
    'NOTION_TOKEN',
    'POSTHOG_API_KEY',
    'SENTRY_AUTH_TOKEN',
    'NPM_TOKEN',
    'NODE_AUTH_TOKEN',
    'npm_config__authToken',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_SESSION_TOKEN',
    'AZURE_CLIENT_SECRET',
    'GOOGLE_APPLICATION_CREDENTIALS',
  ];
  readonly childEnvironment: string;
  readonly networkPolicy: string;
  readonly rule: string;
}

export interface GenerationProofConfig {
  readonly stages: readonly [
    'materialise-input',
    'run-one',
    'clean-output',
    'run-two',
    'byte-compare',
  ];
  readonly environmentProfiles: {
    readonly defaultNodeEnv: 'test';
    readonly productionBundleProofId: 'tsx-bundle-served-ui';
    readonly productionBundleStages: readonly ['run-one', 'run-two'];
    readonly productionBundleNodeEnv: 'production';
  };
  readonly networkPolicy: string;
  readonly stoppedProofs: string;
}

export interface PackedSdkConsumerProofConfig {
  readonly stages: readonly [
    'pack',
    'lockfile-resolve',
    'lockfile-review',
    'package-fetch',
    'offline-install',
    'export-exercise',
  ];
  readonly packageManager: 'pnpm';
  readonly lockfileResolve: string;
  readonly packageFetch: string;
  readonly offlineInstall: string;
  readonly packedMemberPathPolicy: string;
  readonly typeOnlyConditionNames: readonly ['types'];
  readonly runtimeConditionRule: string;
  readonly exportExercise: string;
  readonly stoppedProofs: string;
}

export interface SchemaShapeFingerprintConfig {
  readonly minimumUniqueProperties: 3;
  readonly unsupportedReasonOrder: readonly [
    'computed-property-name',
    'interface-heritage',
    'index-signature',
    'call-signature',
    'construct-signature',
    'spread-assignment',
    'unsupported-member-kind',
    'zod-argument-count',
    'zod-non-object-argument',
  ];
  readonly eligibility: string;
  readonly ordering: string;
  readonly framing: string;
}

export interface TestAndProofPlacementConfig {
  readonly atomicLanding: string;
  readonly inProcessTests: string;
  readonly realContentBackstop: string;
  readonly builtSmoke: string;
  readonly reviewProofs: string;
}

export interface ResourceLimits {
  readonly strategy: string;
  readonly maxTrackedPaths: number;
  readonly maxTreeListingBytes: number;
  readonly maxGitStderrBytes: number;
  readonly maxTotalSourceBytes: number;
  readonly maxSourceBytesPerFile: number;
  readonly maxTotalAuxiliaryBlobBytes: number;
  readonly maxAuxiliaryBlobBytesPerFile: number;
  readonly maxAnalysedRegions: number;
  readonly maxModuleDeclarations: number;
  readonly maxDiagnostics: number;
  readonly maxSerializedOutputBytes: number;
  readonly analysisConcurrency: 1;
}

export interface OutputWriteConfig {
  readonly cliContract: string;
  readonly containment: string;
  readonly publication: string;
  readonly failureBehaviour: string;
}

export interface OrderingConfig {
  readonly comparison: string;
  readonly files: string;
  readonly auxiliaryReads: string;
  readonly roles: string;
  readonly provenanceSignals: string;
  readonly constructDefinitionsAndTotals: string;
  readonly constructCounts: string;
  readonly typeTruthCounts: string;
  readonly moduleDeclarations: string;
  readonly schemaShapes: string;
  readonly schemaShapeMatches: string;
  readonly cloneAnalyses: string;
  readonly cloneMembers: string;
  readonly cloneGroups: string;
  readonly graphNodes: string;
  readonly graphEdges: string;
  readonly ownershipChains: string;
  readonly diagnostics: string;
}

export interface SemanticValidationConfig {
  readonly timing: string;
  readonly fileCoverage: string;
  readonly auxiliaryReadIntegrity: string;
  readonly classificationAndDeliveryCoverage: string;
  readonly constructCoverage: string;
  readonly cloneCoverage: string;
  readonly referenceIntegrity: string;
  readonly heldOutAuditClosure: string;
  readonly executableProofClosure: string;
  readonly candidateAndProposalClosure: string;
  readonly totals: string;
  readonly pathsSha256: string;
}

export interface ImplementationIdentityConfig {
  readonly domain: string;
  readonly ordering: string;
  readonly framing: string;
  readonly reportedMembers: string;
}

export interface SerialisationConfig {
  readonly canonicalJsonVersion: 'lexicographic-object-keys-v1';
  readonly objectKeys: string;
  readonly encoding: string;
  readonly publication: string;
}

export interface HeldOutAuditConfig {
  readonly classificationSelection: string;
  readonly repetitionSelection: string;
  readonly seed: string;
  readonly perStratum: number;
  readonly strata: NonEmptyReadonlyArray<{ readonly id: string; readonly membership: string }>;
  readonly positiveControls: NonEmptyReadonlyArray<{
    readonly path: RepoPath;
    readonly expectedObservations: NonEmptyReadonlyArray<string>;
  }>;
  readonly classificationJudgements: readonly [
    'correct-classification',
    'incorrect-classification',
  ];
  readonly repetitionJudgements: readonly [
    'same-responsibility-and-mechanism',
    'purposeful-similarity-different-responsibility',
    'detector-noise',
  ];
  readonly acceptance: string;
}
