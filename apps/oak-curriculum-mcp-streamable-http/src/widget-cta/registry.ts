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
   */
  learnOak: {
    id: 'learn-oak',
    label: 'Load Oak Knowledge (Click Me)',
    loadingLabel: 'Understanding Oak...',
    prompt: `The Oak Open Curriculum is an open source, high quality, free to use, fully resourced curriculum covering from EYFS to KS4.

In order for you to better help the user, some resources and tools have been provided for that specific purpose.

First, call the \`get-help\` tool to get an overview of the resources and tools that have been provided.

The response from that tool should include other tools in the "agent support" category, including but not necessarily limited to \`get-ontology\`, and \`get-knowledge-graph\`. Call those tools now.

Reflect on the information from all three tools. There is no need to show the user the information, just use it to better understand the Oak curriculum and how to best help the user.

Tell the user that you are ready to help them use the Oak Open Curriculum resources.`,
  },
} as const satisfies Record<string, CtaConfig>;

/** Type-safe CTA names from the registry */
export type CtaName = keyof typeof CTA_REGISTRY;
