/**
 * JavaScript generator for CTA click handlers.
 *
 * @see index.ts - Public API
 * @module widget-cta/js-generator
 */

import type { CtaConfig } from './types.js';
import { CTA_REGISTRY } from './registry.js';

/**
 * Escapes special characters for safe embedding in JavaScript template literals.
 *
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeForTemplateLiteral(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/**
 * Formats button text with optional icon prefix.
 *
 * @param icon - Optional emoji icon
 * @param text - Label text
 * @returns Formatted button text
 */
function formatButtonText(icon: string | undefined, text: string): string {
  return icon ? `${icon} ${text}` : text;
}

/**
 * Generates a single CTA config entry as JavaScript object literal.
 *
 * @param cta - CTA configuration
 * @returns JavaScript object literal string
 */
function generateCtaConfigEntry(cta: CtaConfig): string {
  const escapedPrompt = escapeForTemplateLiteral(cta.prompt);
  const buttonText = formatButtonText(cta.icon, cta.label);
  const loadingText = formatButtonText(cta.icon, cta.loadingLabel);

  return `  {
    id: '${cta.id}',
    buttonText: '${buttonText}',
    loadingText: '${loadingText}',
    prompt: \`${escapedPrompt}\`,
  }`;
}

/**
 * Generates the CTA_CONFIGS array as JavaScript.
 *
 * @returns JavaScript array declaration string
 */
function generateCtaConfigsArray(): string {
  const entries = Object.values(CTA_REGISTRY)
    .map((cta) => generateCtaConfigEntry(cta))
    .join(',\n');

  return `const CTA_CONFIGS = [
${entries}
];`;
}

/**
 * Cooldown duration for CTA buttons in milliseconds (5 minutes).
 *
 * @remarks
 * CTA buttons are hidden if they were clicked within this duration.
 * This prevents users from repeatedly clicking the CTA and flooding
 * the conversation with follow-up messages.
 */
export const CTA_COOLDOWN_MS = 5 * 60 * 1000;

/** JavaScript code for the initCtaButtons function */
const INIT_CTA_BUTTONS_JS = `function initCtaButtons() {
  const ctaContainer = document.getElementById('cta-container');
  if (!window.openai?.sendFollowUpMessage) {
    if (ctaContainer) ctaContainer.style.display = 'none';
    return;
  }

  // Check if CTA is within cooldown period (5 minutes)
  const COOLDOWN_MS = ${String(CTA_COOLDOWN_MS)};
  const widgetState = window.openai.widgetState ?? {};
  const lastClickTime = widgetState.lastCtaClickTime;
  const now = Date.now();

  if (lastClickTime && (now - lastClickTime) < COOLDOWN_MS) {
    // CTA was clicked recently, hide it
    if (ctaContainer) ctaContainer.style.display = 'none';
    return;
  }

  if (ctaContainer) ctaContainer.style.display = 'flex';
  CTA_CONFIGS.forEach(cta => {
    const btn = document.getElementById(cta.id + '-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = cta.loadingText;
      try {
        await window.openai.sendFollowUpMessage({ prompt: cta.prompt });
        // Persist the click time for cooldown tracking
        if (window.openai.setWidgetState) {
          const currentState = window.openai.widgetState ?? {};
          window.openai.setWidgetState({ ...currentState, lastCtaClickTime: Date.now() });
        }
        // Restore button state after successful send
        btn.textContent = cta.buttonText;
        btn.disabled = false;
      } catch (error) {
        btn.textContent = cta.buttonText;
        btn.disabled = false;
        console.error('Failed to send follow-up message:', error);
      }
    });
  });
}`;

/** JavaScript code for DOM ready handling */
const DOM_READY_JS = `if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCtaButtons);
} else {
  initCtaButtons();
}`;

/**
 * Generates complete JavaScript code for CTA click handlers.
 *
 * @returns JavaScript code string for embedding in widget script
 */
export function generateCtaHandlerJs(): string {
  return `
// ========================================
// CTA (Call-to-Action) System
// ========================================
${generateCtaConfigsArray()}

${INIT_CTA_BUTTONS_JS}

${DOM_READY_JS}`;
}
