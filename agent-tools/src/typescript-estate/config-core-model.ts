import type { WorkspaceAttributionConfig } from './config-classification-model.js';
import type { DeliveryDimension } from './file-vocabulary.js';
import type { GitObjectId } from './scalar-model.js';

export interface SnapshotConfig {
  readonly source: 'git-tree';
  readonly defaultRef: 'HEAD';
  readonly commitResolution: string;
  readonly treeResolution: string;
  readonly pathEnumeration: string;
  readonly contentRead: string;
  readonly auxiliaryContentRead: string;
  readonly auxiliaryReadLedger: string;
  readonly gitExecutable: string;
  readonly gitEnvironment: string;
  readonly repositoryAnchoring: string;
  readonly replacementObjects: false;
  readonly filesystemSourceReads: false;
  readonly missingObjectBehaviour: 'fail-complete-run';
}

export interface ModuleResolutionConfig {
  readonly declarationAndResolutionAreSeparate: true;
  readonly typecheckProjectSelection: string;
  readonly emittingProjectSelection: string;
  readonly relativeAndPathAliasResolver: string;
  readonly nodeBuiltinResolver: string;
  readonly workspaceAttribution: WorkspaceAttributionConfig;
  readonly workspacePackageResolver: string;
  readonly externalPackageResolver: string;
  readonly nonLiteralResolver: string;
  readonly resolvedFileContainment: string;
  readonly resolverVersion: 'typescript-6.0.3';
}

export interface DetectorDefinition {
  readonly id: string;
  readonly version: string;
  readonly purpose: string;
  readonly countingUnit: string;
  readonly calibrationStatus: 'admitted' | 'admitted-pending-held-out' | 'rejected';
  readonly falsifier: string;
  readonly unresolvedBehaviour: string;
}

export interface VocabularyConfig {
  readonly roles: readonly [
    'test-spec-support-fixture',
    'generator',
    'generated-contract-data-carrier',
    'build-time-producer',
    'cli-hook-operator',
    'tsx-syntax-source',
    'api-facade',
    'config-setup',
    'declaration',
    'research-evidence-template',
    'implementation-source',
    'unknown',
  ];
  readonly provenance: readonly [
    'authored',
    'generated-confirmed',
    'generated-declared-unconfirmed',
    'imported',
    'unknown',
  ];
  readonly deliveryDimensions: readonly [
    'typecheckProjectIncluded',
    'emittingProjectIncluded',
    'buildEmitted',
    'packageExported',
    'executableEntry',
    'runtimeRegistered',
    'operatorInvoked',
    'filesystemOrStringLoaded',
    'verificationOnly',
    'repositoryReferenceOnly',
  ];
  readonly deliveryStates: readonly ['present', 'absent', 'not-probed', 'ambiguous'];
}

export interface SourcePredicateDefinitions {
  readonly 'contains-export-declaration': string;
}

export interface DeliveryClassificationConfig extends Readonly<Record<DeliveryDimension, string>> {
  readonly stateVocabulary: readonly ['present', 'absent', 'not-probed', 'ambiguous'];
  readonly absenceRule: string;
}

export interface ConfigIdentityFields {
  readonly schemaVersion: '2.0.0';
  readonly contractRevision: '2.6';
  readonly reviewId: 'typescript-estate-consolidation-review';
  readonly calibrationBaseCommit: GitObjectId;
  readonly frozenAt: string;
  readonly refreezeReason: string;
  readonly sourceExtensions: readonly ['.ts', '.tsx'];
}

export interface ImplementationGateConfig {
  readonly estateRun: 'prohibited-until-contract-held-slices-empty-and-built-smoke-passes';
  readonly contractReadySlices: readonly [
    'git-pinned-source-snapshot',
    'pinned-auxiliary-blob-access',
    'canonical-output-foundations',
    'construct-counting',
    'type-truth-counting',
    'schema-shape-observation',
    'region-repetition',
    'workspace-attribution',
    'provenance-classification',
    'role-classification',
  ];
  readonly contractHeldSlices: readonly [
    'module-declaration-extraction',
    'module-resolution',
    'delivery-classification',
    'graph-and-ownership-assembly',
    'candidate-synthesis',
  ];
  readonly releaseRule: string;
}
