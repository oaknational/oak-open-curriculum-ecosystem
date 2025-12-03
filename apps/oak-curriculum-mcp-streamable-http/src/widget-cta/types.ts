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
 *
 * CTA buttons have four states:
 * 1. **Unpressed** - Shows `label`, button enabled
 * 2. **Pressed** - Shows `label`, visual feedback via CSS `:active`
 * 3. **Sending** - Shows `loadingLabel`, button disabled
 * 4. **Understood** - Shows `understoodLabel` after 10s, button stays disabled
 */
export interface CtaConfig {
  /** Unique identifier (kebab-case), used for DOM element IDs as `{id}-btn` */
  readonly id: string;
  /** Button label text (2-4 words, action verb) */
  readonly label: string;
  /** Text shown while sending (1-2 words + ellipsis) */
  readonly loadingLabel: string;
  /** Text shown 10 seconds after prompt is sent (1-3 words), button stays disabled */
  readonly understoodLabel: string;
  /** Optional emoji prefix for the button */
  readonly icon?: string;
  /** Follow-up message prompt sent to the model */
  readonly prompt: string;
}
