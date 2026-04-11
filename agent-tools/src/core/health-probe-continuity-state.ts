import {
  calculateAgeDays,
  CONTINUITY_PROMPT_PATH,
  FRESHNESS_WARNING_DAYS,
  readFrontmatterValue,
  readOptionalText,
  readPromptPracticeBoxCount,
  REQUIRED_CONTINUITY_FIELDS,
} from './health-probe-shared';
import type { HealthCheckResult } from './health-probe-types';

export function evaluateContinuityPromptFreshness(
  repoRoot: string,
  now: Date,
  practiceBoxFileCount: number,
): HealthCheckResult {
  const promptText = readOptionalText(repoRoot, CONTINUITY_PROMPT_PATH);
  if (promptText === null) {
    return {
      key: 'continuity-prompt-freshness',
      label: 'Continuity prompt freshness',
      status: 'fail',
      summary: `${CONTINUITY_PROMPT_PATH} is missing.`,
      details: [`The live continuity contract must exist at ${CONTINUITY_PROMPT_PATH}.`],
    };
  }

  const failureDetails = collectContinuityFailureDetails(promptText, now);
  if (failureDetails.length > 0) {
    return {
      key: 'continuity-prompt-freshness',
      label: 'Continuity prompt freshness',
      status: 'fail',
      summary: 'The continuity prompt is missing required structural contract data.',
      details: failureDetails,
    };
  }

  const warningDetails = collectContinuityWarningDetails(promptText, now, practiceBoxFileCount);
  if (warningDetails.length > 0) {
    return {
      key: 'continuity-prompt-freshness',
      label: 'Continuity prompt freshness',
      status: 'warn',
      summary: getContinuityWarningSummary(warningDetails),
      details: warningDetails,
    };
  }

  return {
    key: 'continuity-prompt-freshness',
    label: 'Continuity prompt freshness',
    status: 'pass',
    summary: 'The live continuity contract is present, recent, and structurally complete.',
    details: [],
  };
}

function collectContinuityFailureDetails(promptText: string, now: Date): string[] {
  const failureDetails: string[] = [];

  if (!promptText.includes('## Live Continuity Contract')) {
    failureDetails.push('The prompt is missing the `Live Continuity Contract` section.');
  }

  for (const field of REQUIRED_CONTINUITY_FIELDS) {
    if (!promptText.includes(`**${field}**`)) {
      failureDetails.push(`The continuity contract is missing the required field \`${field}\`.`);
    }
  }

  const lastUpdated = readFrontmatterValue(promptText, 'last_updated');
  if (!lastUpdated) {
    failureDetails.push('The prompt frontmatter is missing `last_updated`.');
    return failureDetails;
  }

  const ageDays = calculateAgeDays(lastUpdated, now);
  if (ageDays === null) {
    failureDetails.push(
      `The prompt \`last_updated\` value \`${lastUpdated}\` is not a valid ISO date.`,
    );
  }

  return failureDetails;
}

function collectContinuityWarningDetails(
  promptText: string,
  now: Date,
  practiceBoxFileCount: number,
): string[] {
  const warningDetails: string[] = [];
  const lastUpdated = readFrontmatterValue(promptText, 'last_updated');

  if (lastUpdated) {
    const ageDays = calculateAgeDays(lastUpdated, now);
    if (ageDays !== null && ageDays > FRESHNESS_WARNING_DAYS) {
      warningDetails.push(
        `\`${CONTINUITY_PROMPT_PATH}\` last_updated: ${lastUpdated} (${ageDays} days old).`,
      );
    }
  }

  const promptPracticeBoxCount = readPromptPracticeBoxCount(promptText);
  if (promptPracticeBoxCount !== null && promptPracticeBoxCount !== practiceBoxFileCount) {
    warningDetails.push(
      `Prompt says the practice box has ${promptPracticeBoxCount} incoming item(s); the filesystem currently has ${practiceBoxFileCount}.`,
    );
  }

  return warningDetails;
}

function getContinuityWarningSummary(warningDetails: readonly string[]): string {
  if (warningDetails.length > 1) {
    return 'The continuity prompt is structurally valid but needs a freshness refresh.';
  }

  return warningDetails[0]?.includes('practice box')
    ? 'The continuity prompt no longer matches the live practice-box state.'
    : 'The continuity prompt is older than the freshness target and should be refreshed.';
}
