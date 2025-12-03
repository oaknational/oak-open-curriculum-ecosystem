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
    label: 'Learn About Oak',
    loadingLabel: 'Loading...',
    icon: '🌳',
    prompt: `Please use all of the following tools to understand Oak's curriculum structure and better help me:
- \`get-ontology\` for domain definitions (key stages, subjects, entity hierarchy)
- \`get-knowledge-graph\` for concept relationships and structure
- \`get-help\` for tool usage guidance and workflows

Call all three tools now, then summarize what you've learned.`,
  },
} as const satisfies Record<string, CtaConfig>;

/** Type-safe CTA names from the registry */
export type CtaName = keyof typeof CTA_REGISTRY;
