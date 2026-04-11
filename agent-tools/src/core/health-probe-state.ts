import { countPracticeBoxFiles } from './health-probe-shared';
import { evaluateContinuityPromptFreshness } from './health-probe-continuity-state';
import {
  evaluateHookPolicySpineCoherence,
  evaluatePracticeBoxState,
} from './health-probe-hook-state';
import type { HealthCheckResult } from './health-probe-types';

export function evaluateStateChecks(repoRoot: string, now: Date): readonly HealthCheckResult[] {
  const practiceBoxFileCount = countPracticeBoxFiles(repoRoot);

  return [
    evaluateHookPolicySpineCoherence(repoRoot),
    evaluatePracticeBoxState(practiceBoxFileCount),
    evaluateContinuityPromptFreshness(repoRoot, now, practiceBoxFileCount),
  ];
}
