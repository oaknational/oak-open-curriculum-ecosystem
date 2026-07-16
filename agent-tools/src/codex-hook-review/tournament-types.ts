import { type Difficulty } from './types.js';

export const MODEL_CONFIGURATIONS = [
  {
    id: 'spark-low',
    model: 'gpt-5.3-codex-spark',
    reasoningEffort: 'low',
    speed: 'standard',
  },
  {
    id: 'luna-low-standard',
    model: 'gpt-5.6-luna',
    reasoningEffort: 'low',
    speed: 'standard',
  },
  {
    id: 'luna-low-fast',
    model: 'gpt-5.6-luna',
    reasoningEffort: 'low',
    speed: 'fast',
  },
] as const;
export type ModelConfigurationId = (typeof MODEL_CONFIGURATIONS)[number]['id'];

export const INSTRUCTION_MECHANISMS = ['inline', 'instructions', 'skill'] as const;
export type InstructionMechanism = (typeof INSTRUCTION_MECHANISMS)[number];

export const TOURNAMENT_CELLS = [
  { id: 'spark-low:inline', modelConfigurationId: 'spark-low', mechanism: 'inline' },
  { id: 'spark-low:instructions', modelConfigurationId: 'spark-low', mechanism: 'instructions' },
  { id: 'spark-low:skill', modelConfigurationId: 'spark-low', mechanism: 'skill' },
  {
    id: 'luna-low-standard:inline',
    modelConfigurationId: 'luna-low-standard',
    mechanism: 'inline',
  },
  {
    id: 'luna-low-standard:instructions',
    modelConfigurationId: 'luna-low-standard',
    mechanism: 'instructions',
  },
  {
    id: 'luna-low-standard:skill',
    modelConfigurationId: 'luna-low-standard',
    mechanism: 'skill',
  },
  {
    id: 'luna-low-fast:inline',
    modelConfigurationId: 'luna-low-fast',
    mechanism: 'inline',
  },
  {
    id: 'luna-low-fast:instructions',
    modelConfigurationId: 'luna-low-fast',
    mechanism: 'instructions',
  },
  { id: 'luna-low-fast:skill', modelConfigurationId: 'luna-low-fast', mechanism: 'skill' },
] as const;
export type TournamentCell = (typeof TOURNAMENT_CELLS)[number];
export type TournamentCellId = TournamentCell['id'];

export interface TierQualityCounts {
  readonly concernCases: number;
  readonly detectedConcerns: number;
  readonly cleanCases: number;
  readonly falseAlerts: number;
}

export interface QualityByDifficulty {
  readonly easy: TierQualityCounts;
  readonly medium: TierQualityCounts;
  readonly hard: TierQualityCounts;
}

export interface TournamentCellEvidence {
  readonly cellId: TournamentCellId;
  readonly quality: QualityByDifficulty;
  readonly completedLatencyMs: readonly number[];
  readonly medianInputTokens: number;
  readonly medianCachedInputTokens: number;
  readonly medianUncachedInputTokens: number;
  readonly medianOutputTokens: number;
  readonly totalInputTokens: number;
  readonly totalCachedInputTokens: number;
  readonly totalUncachedInputTokens: number;
  readonly totalOutputTokens: number;
  readonly hardTimeoutCount: number;
  readonly schemaFailureCount: number;
  readonly orphanEventCount: number;
  readonly dynamicToolEventCount: number;
  readonly unknownEventCount: number;
  readonly processFailureCount: number;
}

export type DisqualificationReason =
  | 'concern-detection-below-80-percent'
  | 'false-alerts-above-10-percent'
  | 'p50-above-2500ms'
  | 'p95-above-4000ms'
  | 'hard-timeout'
  | 'schema-failure'
  | 'orphan-event'
  | 'dynamic-tool-event'
  | 'unknown-event'
  | 'process-failure';

export interface TierQualityRates {
  readonly difficulty: Difficulty;
  readonly concernDetectionRate: number;
  readonly falseAlertRate: number;
}

export interface TournamentCellAssessment {
  readonly cell: TournamentCell;
  readonly concernDetectionRate: number;
  readonly falseAlertRate: number;
  readonly qualityByDifficulty: readonly TierQualityRates[];
  readonly p50LatencyMs: number;
  readonly p95LatencyMs: number;
  readonly medianInputTokens: number;
  readonly medianCachedInputTokens: number;
  readonly medianUncachedInputTokens: number;
  readonly medianOutputTokens: number;
  readonly totalInputTokens: number;
  readonly totalCachedInputTokens: number;
  readonly totalUncachedInputTokens: number;
  readonly totalOutputTokens: number;
  readonly reliabilityFailureCount: number;
  readonly qualified: boolean;
  readonly disqualificationReasons: readonly DisqualificationReason[];
}

export interface TournamentEvidenceError {
  readonly kind: 'invalid-evidence';
  readonly cellId: TournamentCellId;
  readonly detail: string;
}

export type TournamentSelectionError =
  | { readonly kind: 'incomplete-tournament'; readonly detail: string }
  | { readonly kind: 'invalid-finalists'; readonly detail: string }
  | {
      readonly kind: 'no-qualified-cell';
      readonly assessments: readonly TournamentCellAssessment[];
    }
  | TournamentEvidenceError;

export interface TournamentSelection {
  readonly winner: TournamentCellAssessment;
  readonly assessments: readonly TournamentCellAssessment[];
  readonly paretoFrontier: readonly TournamentCellAssessment[];
}

export interface CalibrationSelection {
  readonly finalists: readonly TournamentCellAssessment[];
  readonly assessments: readonly TournamentCellAssessment[];
}
