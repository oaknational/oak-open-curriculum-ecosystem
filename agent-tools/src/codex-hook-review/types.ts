export type Difficulty = 'easy' | 'medium' | 'hard';

type CorpusSplit = 'calibration' | 'held-out';

type WriteSurface = 'code' | 'config' | 'docs' | 'agent';

export const CONCERN_KINDS = [
  'syntax-schema',
  'runtime',
  'logic',
  'security',
  'data-loss',
  'contradiction',
] as const;
type ConcernKind = (typeof CONCERN_KINDS)[number];

type ConcernChangeIndex = 1 | 2 | 3;

export interface EditChange {
  readonly tool: 'Edit';
  readonly filePath: string;
  readonly oldText: string;
  readonly newText: string;
}

export interface WriteChange {
  readonly tool: 'Write';
  readonly filePath: string;
  readonly content: string;
}

export type HookChange = EditChange | WriteChange;

interface CleanExpectation {
  readonly label: 'clean';
  readonly concernKind: 'none';
}

interface ConcernExpectation {
  readonly label: 'concern';
  readonly concernKind: ConcernKind;
  readonly changeIndex: ConcernChangeIndex;
}

type ReviewExpectation = CleanExpectation | ConcernExpectation;

export interface BenchmarkCase {
  readonly id: string;
  readonly split: CorpusSplit;
  readonly difficulty: Difficulty;
  readonly surface: WriteSurface;
  readonly changes: readonly HookChange[];
  readonly expected: ReviewExpectation;
}

interface PassDecision {
  readonly verdict: 'pass';
  readonly kind: 'none';
  readonly change_index: 0;
}

interface UncertainDecision {
  readonly verdict: 'uncertain';
  readonly kind: 'none';
  readonly change_index: 0;
}

export interface ConcernDecision {
  readonly verdict: 'concern';
  readonly kind: ConcernKind;
  readonly change_index: ConcernChangeIndex;
}

export type ReviewDecision = PassDecision | UncertainDecision | ConcernDecision;
