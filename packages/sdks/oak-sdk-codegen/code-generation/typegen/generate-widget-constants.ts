/**
 * Generate widget constants file from cross-domain constants.
 *
 * Creates `src/types/generated/widget-constants.ts` with the WIDGET_URI,
 * RETIRED_WIDGET_URIS and WIDGET_TOOL_NAMES constants exported for
 * consumption by handwritten SDK files and public API.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  BASE_WIDGET_URI,
  RETIRED_WIDGET_URIS,
  WIDGET_TOOL_NAMES,
} from './cross-domain-constants.js';
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
 * Base URI for the Oak curriculum MCP App resource.
 *
 * This app renders tool output with Oak branding, logo, and styling.
 * All UI-bearing tools reference this URI in their \`_meta.ui.resourceUri\` field (ADR-141).
 *
 * **Published address**: the URI is the same on every build. Clients keep the
 * address from the tool list they were given, so compatible widget changes
 * ship as content behind it; an incompatible change takes the next version
 * segment and is a published-contract change (ADR-141, widget URI identity
 * amendment; MCP-489).
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_URI = ${JSON.stringify(BASE_WIDGET_URI)} as const;

/**
 * Widget addresses from releases before the address was fixed.
 *
 * Not served. Listed on the auth public-resource allowlist so that an
 * unauthenticated read reaches the resource-not-found error rather than an
 * authentication challenge. The server sends no instruction to list tools
 * again (ADR-141, widget URI identity amendment; MCP-489).
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 */
export const RETIRED_WIDGET_URIS: readonly string[] = ${JSON.stringify(RETIRED_WIDGET_URIS)};

/**
 * Tools that advertise a widget UI via \`_meta.ui.resourceUri\`.
 *
 * Only tools in this set have \`_meta.ui\` in their descriptors.
 * All other tools have no widget UI — MCP clients will not render
 * a widget for their results.
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set(${JSON.stringify([...WIDGET_TOOL_NAMES])});
`;
}

export function generateWidgetConstants(logger: Logger): void {
  const outputDir = dirname(OUTPUT_PATH);
  mkdirSync(outputDir, { recursive: true });

  const content = generateWidgetConstantsFile();
  writeFileSync(OUTPUT_PATH, content, 'utf-8');

  logger.info('Generated widget constants', { path: OUTPUT_PATH });
}
