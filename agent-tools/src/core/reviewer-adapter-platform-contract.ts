/**
 * Platform names used by reviewer-adapter parity checks.
 */
export type ReviewerAdapterPlatform = 'cursor' | 'claude-code' | 'codex';

/**
 * A reviewer adapter whose presence differs from its platform support.
 */
export interface ReviewerAdapterPlatformViolation {
  readonly kind: 'missing' | 'unsupported';
  readonly reviewerName: string;
  readonly platform: ReviewerAdapterPlatform;
}

/**
 * Explicit reviewer roles whose supported platforms differ from the default
 * cross-platform contract.
 */
const PLATFORM_SPECIFIC_REVIEWER_SUPPORT: ReadonlyMap<
  string,
  ReadonlySet<ReviewerAdapterPlatform>
> = new Map([
  ['cricket-judgement-high', new Set<ReviewerAdapterPlatform>(['cursor', 'claude-code'])],
]);

/**
 * Classify whether an adapter's presence matches its platform support.
 *
 * Reviewer roles are cross-platform by default. Entries in the explicit
 * support map narrow that default for roles whose runtime panels genuinely
 * differ, such as Cricket's Claude-and-Cursor-only high-judgement seat.
 *
 * @param reviewerName - Reviewer adapter basename without its extension.
 * @param platform - Platform surface being checked.
 * @param hasAdapter - Whether the adapter exists on that platform surface.
 * @returns The parity violation, or `null` when presence matches support.
 */
export function getReviewerAdapterPlatformViolation(
  reviewerName: string,
  platform: ReviewerAdapterPlatform,
  hasAdapter: boolean,
): ReviewerAdapterPlatformViolation | null {
  const isSupported = isReviewerAdapterSupportedOnPlatform(reviewerName, platform);
  if (hasAdapter === isSupported) {
    return null;
  }

  return {
    kind: isSupported ? 'missing' : 'unsupported',
    reviewerName,
    platform,
  };
}

function isReviewerAdapterSupportedOnPlatform(
  reviewerName: string,
  platform: ReviewerAdapterPlatform,
): boolean {
  const supportedPlatforms = PLATFORM_SPECIFIC_REVIEWER_SUPPORT.get(reviewerName);
  return supportedPlatforms?.has(platform) ?? true;
}
