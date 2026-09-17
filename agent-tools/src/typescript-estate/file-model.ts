import type {
  ConstructCount,
  ModuleDeclarationRecord,
  SchemaShape,
  TypeTruthCount,
} from './analysis-model.js';
import type {
  DeliveryDimension,
  DeliveryState,
  FileRole,
  Provenance,
  SourceExtension,
} from './file-vocabulary.js';
import type {
  NonEmptyReadonlyArray,
  RepoPath,
  Sha256,
  WorkspacePackageName,
} from './scalar-model.js';

export type { RepoPath, Sha256 } from './scalar-model.js';

export interface TreeEntry {
  readonly mode: string;
  readonly type: string;
  readonly object: string;
  readonly size: number | null;
}

export interface ReadSuccess {
  readonly status: 'read';
  readonly contentSha256: Sha256;
  readonly byteCount: number;
  readonly lineCount: number;
}

export interface InvalidUtf8Read {
  readonly status: 'invalid-utf8';
  readonly code: 'SOURCE_INVALID_UTF8';
  readonly message: string;
  readonly contentSha256: Sha256;
  readonly byteCount: number;
  readonly lineCount: null;
}

export interface UnsupportedModeRead {
  readonly status: 'unsupported-mode';
  readonly mode: string;
  readonly message: string;
  readonly contentSha256: null;
  readonly byteCount: null;
  readonly lineCount: null;
}

export type SourceRead = ReadSuccess | InvalidUtf8Read | UnsupportedModeRead;

export interface WorkspaceRecord {
  readonly root: RepoPath;
  readonly name: WorkspacePackageName;
  readonly manifestPath: RepoPath;
}

export type ProvenanceSignal =
  | {
      readonly kind: 'generated-path';
      readonly matcherId: 'generated-directory-segment' | 'generated-ts-basename-suffix';
      readonly evidencePath: RepoPath;
    }
  | {
      readonly kind: 'generated-header';
      readonly matcherId: 'leading-generated-banner';
      readonly evidencePath: RepoPath;
      readonly startOffset: number;
      readonly endOffset: number;
    }
  | {
      readonly kind: 'producer-output-rule';
      readonly ruleId: string;
      readonly producerEvidencePaths: NonEmptyReadonlyArray<RepoPath>;
    }
  | {
      readonly kind: 'imported-reference-path';
      readonly ruleId: string;
      readonly evidencePath: RepoPath;
    };

export type DeliveryVector = Readonly<Record<DeliveryDimension, DeliveryState>>;

export interface DeliverySignal {
  readonly dimension: DeliveryDimension;
  readonly state: DeliveryState;
  readonly basis: string;
  readonly evidencePaths: readonly RepoPath[];
}

interface FileRecordBase {
  readonly path: RepoPath;
  readonly treeEntry: TreeEntry;
  readonly extension: SourceExtension;
  readonly workspace: WorkspaceRecord | null;
  readonly roles: NonEmptyReadonlyArray<FileRole>;
  readonly provenance: Provenance;
  readonly provenanceSignals: readonly ProvenanceSignal[];
  readonly delivery: DeliveryVector;
  readonly deliverySignals: readonly DeliverySignal[];
}

export type FileRecord =
  | (FileRecordBase & {
      readonly read: ReadSuccess;
      readonly parseStatus: 'parsed' | 'parsed-with-diagnostics';
      readonly constructCounts: readonly ConstructCount[];
      readonly typeTruthCounts: readonly TypeTruthCount[];
      readonly schemaShapes: readonly SchemaShape[];
      readonly moduleDeclarations: readonly ModuleDeclarationRecord[];
    })
  | (FileRecordBase & {
      readonly read: InvalidUtf8Read | UnsupportedModeRead;
      readonly parseStatus: 'not-attempted';
      readonly constructCounts: readonly [];
      readonly typeTruthCounts: readonly [];
      readonly schemaShapes: readonly [];
      readonly moduleDeclarations: readonly [];
    });
