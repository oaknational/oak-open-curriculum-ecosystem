/**
 * CTA registry - single source of truth for all CTA definitions.
 *
 * @see index.ts - Public API
 */

import type { CtaConfig } from './types.js';

/**
 * Registry of all available CTAs.
 *
 * Add new CTAs here. They automatically appear in the widget.
 *
 * @example
 * ```typescript
 * // Adding a new CTA
 * startLessonPlanning: {
 *   id: 'start-lesson-planning',
 *   label: 'Plan a Lesson',
 *   loadingLabel: 'Starting...',
 *   icon: '📝',
 *   prompt: 'Help me plan a lesson.',
 * },
 * ```
 */
export const CTA_REGISTRY = {
  /**
   * Learn About Oak CTA.
   *
   * Prompts the model to call agent support tools:
   * `get-ontology` and `get-help`.
   *
   * After 10 seconds, shows "Oak Understood" to indicate the agent
   * has had time to process the curriculum information.
   */
  learnOak: {
    id: 'learn-oak',
    label: 'Load Oak Knowledge (Click Me)',
    loadingLabel: 'Understanding Oak...',
    understoodLabel: 'Oak Understood',
    prompt: `The Oak Open Curriculum is an open source, high quality, free to use, fully resourced curriculum, covering from EYFS to KS4.

The following tools will help you understand the context, and provide better support to the user.

Call the \`get-help\` tool for a resources and tools overview.

The response includes "agent support" tools, such as \`get-ontology\`. Call **all** agent support tools now.

Reflect on the agent support tools information. Do not show the user, use it to understand the Oak curriculum and the education context.

Tell the user that you are ready to help them use the Oak Open Curriculum resources.`,
  },
} as const satisfies Record<string, CtaConfig>;

/** Type-safe CTA names from the registry */
export type CtaName = keyof typeof CTA_REGISTRY;

function isCtaName(key: string): key is CtaName {
  return key in CTA_REGISTRY;
}

/** Pre-built typed list of all CTA configs for iteration without type plumbing. */
export const CTA_LIST: readonly CtaConfig[] = (() => {
  const list: CtaConfig[] = [];
  for (const key in CTA_REGISTRY) {
    if (isCtaName(key)) {
      list.push(CTA_REGISTRY[key]);
    }
  }
  return list;
})();
