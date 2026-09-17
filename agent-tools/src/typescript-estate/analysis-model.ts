import type {
  ModuleDeclarationKind,
  Provenance,
  RepetitionRegionKind,
  SchemaShapeKind,
  SchemaShapeUnsupportedReason,
  TypeTruthId,
} from './file-vocabulary.js';
import type {
  AtLeastThreeReadonly,
  NonEmptyReadonlyArray,
  RepoPath,
  Sha256,
} from './scalar-model.js';

export type ConstructClass =
  'runtime-value-structure' | 'type-model-structure' | 'algorithmic-operation';

export interface ConstructDefinition {
  readonly id: string;
  readonly class: ConstructClass;
  readonly astKinds: readonly string[];
  readonly namedReferences: readonly string[];
  readonly callNames: readonly string[];
}

export interface ConstructCount {
  readonly id: string;
  readonly count: number;
}

export interface TypeTruthCount {
  readonly id: TypeTruthId;
  readonly count: number;
}

interface ResolutionBase {
  readonly detail: string;
}

export type ModuleResolutionRecord =
  | (ResolutionBase & {
      readonly status: 'resolved-file';
      readonly resolver: 'typescript-module-resolution';
      readonly target: RepoPath;
      readonly configPath: RepoPath;
      readonly typescriptVersion: string;
    })
  | (ResolutionBase & {
      readonly status: 'node-builtin';
      readonly resolver: 'node-builtin-classification';
      readonly target: string;
      readonly configPath: null;
      readonly typescriptVersion: null;
    })
  | (ResolutionBase & {
      readonly status: 'workspace-package';
      readonly resolver: 'workspace-package-map';
      readonly target: string;
      readonly configPath: RepoPath;
      readonly typescriptVersion: null;
    })
  | (ResolutionBase & {
      readonly status: 'external-package';
      readonly resolver: 'bare-package-classification';
      readonly target: string;
      readonly configPath: null;
      readonly typescriptVersion: null;
    })
  | (ResolutionBase & {
      readonly status: 'unresolved-literal';
      readonly resolver: 'typescript-module-resolution';
      readonly target: null;
      readonly configPath: RepoPath | null;
      readonly typescriptVersion: string;
    })
  | (ResolutionBase & {
      readonly status: 'unresolved-nonliteral';
      readonly resolver: 'nonliteral';
      readonly target: null;
      readonly configPath: null;
      readonly typescriptVersion: null;
    });

interface ModuleDeclarationBase {
  readonly specifier: string | null;
  readonly literal: boolean;
  readonly startLine: number;
  readonly endLine: number;
  readonly resolution: ModuleResolutionRecord;
}

export type ModuleDeclarationRecord =
  | (ModuleDeclarationBase & {
      readonly kind: Exclude<ModuleDeclarationKind, 'require'>;
      readonly typeOnly: boolean;
    })
  | (ModuleDeclarationBase & {
      readonly kind: 'require';
      readonly typeOnly: false;
    });

interface SchemaShapeBase {
  readonly kind: SchemaShapeKind;
  readonly startLine: number;
  readonly endLine: number;
  readonly name: string | null;
}

export type SchemaShape =
  | (SchemaShapeBase & {
      readonly propertyNames: AtLeastThreeReadonly<string>;
      readonly fingerprint: Sha256;
      readonly completeness: 'complete-static-key-set';
      readonly unsupportedReasons: readonly [];
    })
  | (SchemaShapeBase & {
      readonly propertyNames: readonly string[];
      readonly fingerprint: null;
      readonly completeness: 'unsupported-computed-spread-or-complex';
      readonly unsupportedReasons: NonEmptyReadonlyArray<SchemaShapeUnsupportedReason>;
    });

export interface SchemaShapeEndpoint {
  readonly path: RepoPath;
  readonly kind: SchemaShape['kind'];
  readonly startLine: number;
  readonly endLine: number;
  readonly name: string | null;
  readonly provenance: Extract<Provenance, 'authored' | 'generated-confirmed'>;
}

export interface SchemaShapeMatch {
  readonly fingerprint: Sha256;
  readonly propertyNames: AtLeastThreeReadonly<string>;
  readonly authored: SchemaShapeEndpoint;
  readonly generated: SchemaShapeEndpoint;
  readonly interpretation: 'candidate-key-set-match-not-authority-proof';
}

export interface CloneMember {
  readonly path: RepoPath;
  readonly kind: RepetitionRegionKind;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly startLine: number;
  readonly endLine: number;
  readonly name: string | null;
  readonly nodeCount: number;
  readonly tokenCount: number;
}

export interface CloneGroup {
  readonly fingerprint: Sha256;
  readonly candidateEligibility: 'candidate-eligible' | 'verification-observation-only';
  readonly members: readonly [CloneMember, CloneMember, ...CloneMember[]];
}

export type CloneAnalysis =
  | {
      readonly detectorId: 'exact-region-clone';
      readonly encodingVersion: 'typescript-printer-trivia-free-v1';
      readonly groups: readonly CloneGroup[];
    }
  | {
      readonly detectorId: 'structural-region-similarity';
      readonly encodingVersion: 'typescript-getchildren-kinds-v1';
      readonly groups: readonly CloneGroup[];
    };
