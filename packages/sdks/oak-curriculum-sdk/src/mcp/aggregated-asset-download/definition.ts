/**
 * Tool definition and input schema for the download-asset tool.
 *
 * Generates short-lived, HMAC-signed download URLs that authenticate
 * without exposing the Oak API key. HTTP-only — not registered for
 * stdio transport.
 */

import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';
import { ASSET_TYPES } from '@oaknational/sdk-codegen/api-schema';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Download-asset tool definition with MCP metadata.
 *
 * Generates a clickable download link for a lesson asset. The link is
 * self-authenticating via HMAC signature and expires after 5 minutes.
 */
export const DOWNLOAD_ASSET_TOOL_DEF = {
  description: `Generate a short-lived, secure download link for a lesson asset.

Returns a clickable URL valid for 5 minutes that downloads the asset
directly in the user's browser — no authentication needed on their side.

Use this when:
- The user wants to download a slide deck, worksheet, quiz, or video
- You have the lesson slug and asset type from a previous get-lessons-assets call

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
  _meta: {
    'openai/toolInvocation/invoking': 'Generating download link…',
    'openai/toolInvocation/invoked': 'Download link ready',
    'openai/visibility': 'public',
  },
} as const;

/**
 * JSON Schema for the download-asset tool inputs.
 *
 * The `type` enum is derived from the generated OpenAPI schema's
 * ASSET_TYPES constant to stay in sync with the API.
 */
export const DOWNLOAD_ASSET_INPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    lesson: {
      type: 'string',
      description: 'Lesson slug (e.g. "adding-fractions-with-the-same-denominator")',
    },
    type: {
      type: 'string',
      description: 'Asset type to download',
      enum: [...ASSET_TYPES],
      examples: ['slideDeck', 'worksheet', 'video'],
    },
  },
  required: ['lesson', 'type'],
} as const satisfies GenericToolInputJsonSchema;
