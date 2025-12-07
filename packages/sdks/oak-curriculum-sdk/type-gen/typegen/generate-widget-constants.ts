/**
 * Generate widget constants file from cross-domain constants.
 *
 * Creates `src/types/generated/widget-constants.ts` with WIDGET_URI constant
 * exported for consumption by handwritten SDK files and public API.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { BASE_WIDGET_URI } from './cross-domain-constants.js';

const OUTPUT_PATH = resolve(import.meta.dirname, '../../src/types/generated/widget-constants.ts');

function generateWidgetConstantsFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Widget URI constants generated from type-gen cross-domain constants.
 * 
 * @see type-gen/typegen/cross-domain-constants.ts - Single source of truth
 */

/**
 * Base URI for the Oak JSON viewer widget resource.
 *
 * This widget renders tool output with Oak branding, logo, and styling.
 * All generated tools reference this URI in their \`_meta['openai/outputTemplate']\` field.
 *
 * **Cache-Busting Strategy**: The URI includes a hash generated at type-gen time.
 * Each build produces a new hash, naturally busting ChatGPT's widget cache.
 * This aligns with OpenAI's best practice: "give the template a new URI".
 *
 * **Format**: \`ui://widget/oak-json-viewer-<hash>.html\`
 * **Example**: \`ui://widget/oak-json-viewer-abc12345.html\`
 *
 * @see type-gen/typegen/cross-domain-constants.ts - Source of truth
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (OpenAI cache-busting guidance)
 */
export const WIDGET_URI = ${JSON.stringify(BASE_WIDGET_URI)} as const;
`;
}

export function generateWidgetConstants(): void {
  const outputDir = dirname(OUTPUT_PATH);
  mkdirSync(outputDir, { recursive: true });

  const content = generateWidgetConstantsFile();
  writeFileSync(OUTPUT_PATH, content, 'utf-8');

  console.log(`✅ Generated widget constants: ${OUTPUT_PATH}`);
}
