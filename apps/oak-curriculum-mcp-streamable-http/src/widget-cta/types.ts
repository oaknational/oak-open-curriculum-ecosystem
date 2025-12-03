/**
 * CTA configuration types.
 *
 * @see index.ts - Public API
 * @module widget-cta/types
 */

/**
 * Configuration for a single CTA button.
 *
 * Each CTA triggers a follow-up message to the model via
 * `window.openai.sendFollowUpMessage()`.
 */
export interface CtaConfig {
  /** Unique identifier (kebab-case), used for DOM element IDs as `{id}-btn` */
  readonly id: string;
  /** Button label text (2-4 words, action verb) */
  readonly label: string;
  /** Text shown while sending (1-2 words + ellipsis) */
  readonly loadingLabel: string;
  /** Text shown after successful send (1-3 words), reverts to label after 2 seconds */
  readonly successLabel: string;
  /** Optional emoji prefix for the button */
  readonly icon?: string;
  /** Follow-up message prompt sent to the model */
  readonly prompt: string;
}
