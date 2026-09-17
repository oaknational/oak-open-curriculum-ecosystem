import type { SourceFile } from 'typescript';

import type { CloneMember } from './analysis-model.js';
import type { DeliveryState, RepetitionRegionKind, SourceExtension } from './file-vocabulary.js';
import type { RepoPath, Sha256 } from './scalar-model.js';

export interface ExecutableRepetitionConfig {
  readonly minimumAstNodes: number;
  readonly minimumTokens: number;
  readonly minimumFiles: number;
  readonly maxAnalysedRegions: number;
  readonly regionAstKinds: readonly RepetitionRegionKind[];
  readonly exactEncodingVersion: 'typescript-printer-trivia-free-v1';
  readonly structuralEncodingVersion: 'typescript-getchildren-kinds-v1';
}

export interface RepetitionSource {
  readonly path: RepoPath;
  readonly extension: SourceExtension;
  readonly sourceFile: SourceFile;
  readonly verificationOnly: DeliveryState;
}

export interface EncodedRegionObservation {
  readonly member: CloneMember;
  readonly verificationOnly: DeliveryState;
  readonly exactFingerprint: Sha256;
  readonly exactEncoding: string;
  readonly structuralFingerprint: Sha256;
  readonly structuralEncoding: readonly string[];
}
