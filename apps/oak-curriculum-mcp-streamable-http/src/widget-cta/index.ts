/**
 * Reusable Call-to-Action (CTA) system for OpenAI widget follow-up messages.
 *
 * CTAs are buttons that send follow-up messages to the model using
 * `window.openai.sendFollowUpMessage()`. Users can trigger workflows
 * or context-setting actions without manually typing prompts.
 *
 * ## CTA Button States
 *
 * Each CTA button has four states:
 * 1. **Unpressed** - Shows label, button enabled
 * 2. **Pressed** - Shows label with CSS `:active` visual feedback
 * 3. **Sending** - Shows loadingLabel, button disabled
 * 4. **Understood** - Shows understoodLabel after 10s, button stays disabled
 *
 * ## Quick Start
 *
 * Add a CTA to the registry, rebuild, and it appears in the widget:
 *
 * ```typescript
 * // In registry.ts
 * export const CTA_REGISTRY = {
 *   learnOak: { ... },
 *   myNewCta: {
 *     id: 'my-cta',
 *     label: 'My Action',
 *     loadingLabel: 'Loading...',
 *     understoodLabel: 'Done',
 *     icon: '🎯',
 *     prompt: 'Help me with...',
 *   },
 * } as const satisfies Record<string, CtaConfig>;
 * ```
 *
 * ## Architecture
 *
 * - `types.ts` - CtaConfig interface
 * - `registry.ts` - CTA_REGISTRY (single source of truth)
 * - `html-generators.ts` - generateCtaButtonHtml, generateCtaContainerHtml
 * - `js-generator.ts` - generateCtaHandlerJs
 *
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui#send-conversational-follow-ups
 * @see ADR-061 - Widget Call-to-Action System
 *
 * @packageDocumentation
 * @packageDocumentation
 */

export type { CtaConfig } from './types.js';
export { CTA_REGISTRY, type CtaName } from './registry.js';
export { generateCtaButtonHtml, generateCtaContainerHtml } from './html-generators.js';
export { generateCtaHandlerJs, CTA_UNDERSTOOD_DELAY_MS } from './js-generator.js';
