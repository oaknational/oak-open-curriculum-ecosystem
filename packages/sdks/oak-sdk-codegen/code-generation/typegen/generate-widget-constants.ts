/**
 * Generate widget constants file from cross-domain constants.
 *
 * Creates `src/types/generated/widget-constants.ts` with WIDGET_URI constant
 * exported for consumption by handwritten SDK files and public API.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { BASE_WIDGET_URI } from './cross-domain-constants.js';
import type { Logger } from '@oaknational/logger';

const OUTPUT_PATH = resolve(import.meta.dirname, '../../src/types/generated/widget-constants.ts');

function generateWidgetConstantsFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Widget URI constants generated from sdk-codegen cross-domain constants.
 * 
 * @see code-generation/typegen/cross-domain-constants.ts - Single source of truth
 */

/**
 * Base URI for the Oak JSON viewer widget resource.
 *
 * This widget renders tool output with Oak branding, logo, and styling.
 * All generated tools reference this URI in their \`_meta.ui.resourceUri\` field (ADR-141).
 *
 * **Cache-Busting Strategy**: The URI includes a hash generated at sdk-codegen time.
 * Each build produces a new hash, naturally busting the host widget cache.
 *
 * **Format**: \`ui://widget/oak-json-viewer-<hash>.html\`
 * **Example**: \`ui://widget/oak-json-viewer-abc12345.html\`
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_URI = ${JSON.stringify(BASE_WIDGET_URI)} as const;
`;
}

export function generateWidgetConstants(logger: Logger): void {
  const outputDir = dirname(OUTPUT_PATH);
  mkdirSync(outputDir, { recursive: true });

  const content = generateWidgetConstantsFile();
  writeFileSync(OUTPUT_PATH, content, 'utf-8');

  logger.info('Generated widget constants', { path: OUTPUT_PATH });
}
