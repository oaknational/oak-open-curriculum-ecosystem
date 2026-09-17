import type {
  CloneAnalysis,
  ConstructDefinition,
  SchemaShapeMatch,
  TypeTruthCount,
} from './analysis-model.js';
import type { FileRecord, TreeEntry } from './file-model.js';
import type { GraphObservations } from './graph-model.js';
import type { NonEmptyReadonlyArray, RepoPath, Sha256 } from './scalar-model.js';

export interface SnapshotRecord {
  readonly inputRef: string;
  readonly commit: string;
  readonly tree: string;
  readonly source: 'git-tree';
}

export interface ImplementationFile {
  readonly path: RepoPath;
  readonly byteCount: number;
  readonly sha256: Sha256;
}

export interface ExtractorIdentity {
  readonly implementationVersion: '2.0.0';
  readonly implementationSha256: Sha256;
  readonly implementationFiles: NonEmptyReadonlyArray<ImplementationFile>;
  readonly nodeVersion: string;
  readonly typescriptVersion: string;
  readonly canonicalJsonVersion: 'lexicographic-object-keys-v1';
}

export interface CoverageRecord {
  readonly denominator: number;
  readonly readable: number;
  readonly parsed: number;
  readonly parsedWithDiagnostics: number;
  readonly invalidUtf8: number;
  readonly unsupportedModes: number;
  readonly pathsSha256: Sha256;
}

export interface AuxiliaryReadRecord {
  readonly path: RepoPath;
  readonly treeEntry: TreeEntry & {
    readonly mode: '100644' | '100755';
    readonly type: 'blob';
    readonly size: number;
  };
  readonly byteCount: number;
  readonly contentSha256: Sha256;
}

export interface ConstructTotal {
  readonly id: string;
  readonly total: number;
  readonly authored: number;
  readonly generatedConfirmed: number;
  readonly generatedDeclaredUnconfirmed: number;
  readonly imported: number;
  readonly unknown: number;
  readonly verificationOnly: number;
  readonly nonVerification: number;
  readonly verificationUnresolved: number;
}

export interface ConstructDefinitionsRecord {
  readonly rankingBoundary: string;
  readonly algorithmBoundary: string;
  readonly definitions: NonEmptyReadonlyArray<ConstructDefinition>;
}

export interface TypeScriptSourceDiagnosticRecord {
  readonly subjectKind: 'typescript-source';
  readonly path: RepoPath;
  readonly stage: 'read' | 'parse' | 'classify' | 'analyse';
  readonly code: string;
  readonly message: string;
}

export interface AuxiliaryBlobDiagnosticRecord {
  readonly subjectKind: 'auxiliary-blob';
  readonly path: RepoPath;
  readonly relatedPath: RepoPath | null;
  readonly stage: 'auxiliary-parse' | 'auxiliary-resolve';
  readonly code: string;
  readonly message: string;
}

export type DiagnosticRecord = TypeScriptSourceDiagnosticRecord | AuxiliaryBlobDiagnosticRecord;

export interface RawExtractionDocument {
  readonly schemaVersion: '2.0.0';
  readonly snapshot: SnapshotRecord;
  readonly detectorConfig: {
    readonly path: RepoPath;
    readonly schemaVersion: '2.0.0';
    readonly contractRevision: '2.6';
    readonly sha256: Sha256;
  };
  readonly extractor: ExtractorIdentity;
  readonly completeness: 'complete';
  readonly coverage: CoverageRecord;
  readonly auxiliaryReads: readonly AuxiliaryReadRecord[];
  readonly constructDefinitions: ConstructDefinitionsRecord;
  readonly files: readonly FileRecord[];
  readonly constructTotals: readonly ConstructTotal[];
  readonly typeTruthTotals: readonly TypeTruthCount[];
  readonly schemaShapeMatches: readonly SchemaShapeMatch[];
  readonly cloneAnalyses: readonly [
    Extract<CloneAnalysis, { readonly detectorId: 'exact-region-clone' }>,
    Extract<CloneAnalysis, { readonly detectorId: 'structural-region-similarity' }>,
  ];
  readonly graphObservations: GraphObservations;
  readonly diagnostics: readonly DiagnosticRecord[];
}
