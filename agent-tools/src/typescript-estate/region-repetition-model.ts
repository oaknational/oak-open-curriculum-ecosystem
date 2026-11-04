import type { SourceFile } from 'typescript';

import type { CloneMember } from './analysis-model.js';
import type { DeliveryState, RepetitionRegionKind, SourceExtension } from './file-vocabulary.js';

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
  readonly path: string;
  readonly extension: SourceExtension;
  readonly sourceFile: SourceFile;
  readonly verificationOnly: DeliveryState;
}

export interface EncodedRegionObservation {
  readonly member: CloneMember;
  readonly verificationOnly: DeliveryState;
  readonly exactFingerprint: string;
  readonly exactEncoding: string;
  readonly structuralFingerprint: string;
  readonly structuralEncoding: readonly string[];
}
