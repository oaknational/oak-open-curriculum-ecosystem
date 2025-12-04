/**
 * HTML generators for CTA buttons.
 *
 * @see index.ts - Public API
 * @module widget-cta/html-generators
 */

import type { CtaConfig } from './types.js';
import { CTA_REGISTRY } from './registry.js';

/**
 * Generates HTML for a single CTA button.
 *
 * @param cta - CTA configuration
 * @returns HTML button string
 */
export function generateCtaButtonHtml(cta: CtaConfig): string {
  const buttonText = cta.icon ? `${cta.icon} ${cta.label}` : cta.label;
  return `<button id="${cta.id}-btn" class="btn cta-btn">${buttonText}</button>`;
}

/**
 * Generates HTML for the CTA container with all registered CTAs.
 *
 * The container is hidden by default and shown by JavaScript when
 * `sendFollowUpMessage` is available.
 *
 * @returns HTML container string
 */
export function generateCtaContainerHtml(): string {
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const buttons = Object.values(CTA_REGISTRY)
    .map((cta) => generateCtaButtonHtml(cta))
    .join('\n      ');

  return `<div id="cta-container" class="cta-container" style="display:none">
      ${buttons}
    </div>`;
}
