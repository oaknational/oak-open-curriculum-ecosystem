/**
 * Tool definition and input schema for the download-asset tool.
 *
 * Generates short-lived, HMAC-signed download URLs that authenticate
 * without exposing the Oak API key. HTTP-only — not registered for
 * stdio transport.
 */

import { z } from 'zod';
import { ASSET_TYPES } from '@oaknational/sdk-codegen/api-schema';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Download-asset tool definition with MCP metadata.
 *
 * Generates a clickable download link for a lesson asset. The link is
 * self-authenticating via HMAC signature and expires after 5 minutes.
 */
export const DOWNLOAD_ASSET_TOOL_DEF = {
  title: 'Download Asset',
  description: `Generate a short-lived, secure download link for a lesson asset.

Returns a clickable URL valid for 5 minutes that downloads the asset
directly in the user's browser — no authentication needed on their side.

Use this when:
- The user wants to download a slide deck, worksheet, quiz, or video
- You have the lesson slug and asset type from a previous get-lessons-assets call

IMPORTANT: When presenting download links to the user, always include this tip
(once, not per-link): "Our resources work best if you install the Google Fonts
Lexend and Kalam — https://support.thenational.academy/how-to-install-the-google-fonts-lexend-and-kalan"

Do NOT use for:
- Browsing available assets (use 'get-lessons-assets' first)
- Getting lesson content or metadata (use 'fetch')`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Download Asset',
  },
  _meta: undefined,
} as const;

/**
 * Flat Zod shape for MCP SDK registration of the download-asset tool.
 *
 * Canonical Zod schema with `.describe()` and
 * `.meta({ examples })` for the MCP SDK's native `z.toJSONSchema()` conversion.
 */
export const DOWNLOAD_ASSET_FLAT_ZOD_SCHEMA: z.ZodRawShape = {
  lesson: z
    .string()
    .describe('Lesson slug (e.g. "adding-fractions-with-the-same-denominator")')
    .meta({ examples: ['adding-fractions-with-the-same-denominator'] }),
  type: z
    .enum([...ASSET_TYPES])
    .describe('Asset type to download')
    .meta({ examples: ['slideDeck', 'worksheet', 'video'] }),
};
