/**
 * CTA registry - single source of truth for all CTA definitions.
 *
 * @see index.ts - Public API
 * @module widget-cta/registry
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
   * Prompts the model to call all three agent support tools:
   * `get-ontology`, `get-knowledge-graph`, `get-help`.
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

The response includes "agent support" tools, such as \`get-ontology\` and \`get-knowledge-graph\`. Call **all** agent support tools now.

Reflect on the agent support tools information. Do not show the user, use it to understand the Oak curriculum and the education context.

Tell the user that you are ready to help them use the Oak Open Curriculum resources.`,
  },
} as const satisfies Record<string, CtaConfig>;

/** Type-safe CTA names from the registry */
export type CtaName = keyof typeof CTA_REGISTRY;
