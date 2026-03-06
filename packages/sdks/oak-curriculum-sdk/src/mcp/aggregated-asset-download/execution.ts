/**
 * Execution logic for the download-asset tool.
 *
 * Validates input and delegates URL generation to the injected factory
 * function, which is provided by the HTTP app layer. The factory creates
 * HMAC-signed, short-lived URLs pointing to the download proxy route.
 */

import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { isAssetType, ASSET_TYPES } from '@oaknational/sdk-codegen/api-schema';
import type { AssetType } from '@oaknational/sdk-codegen/api-schema';
import { formatToolResponse } from '../universal-tool-shared.js';

/**
 * Validated arguments for the download-asset tool.
 */
export interface DownloadAssetArgs {
  readonly lesson: string;
  readonly type: AssetType;
}

/**
 * Dependencies injected by the HTTP app layer.
 */
export interface DownloadAssetDeps {
  readonly createAssetDownloadUrl: (lesson: string, type: string) => string;
}

type ValidationResult =
  | { readonly ok: true; readonly value: DownloadAssetArgs }
  | { readonly ok: false; readonly message: string };

const DownloadAssetObjectSchema = z
  .object({
    lesson: z.string().min(1),
    type: z.string(),
  })
  .strict();

/**
 * Validates raw input for the download-asset tool.
 *
 * Checks that `lesson` is a non-empty string and `type` is a valid
 * asset type from the generated OpenAPI schema.
 */
export function validateDownloadAssetArgs(input: unknown): ValidationResult {
  const parsed = DownloadAssetObjectSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const field = firstIssue?.path[0] ?? 'input';
    return {
      ok: false,
      message: `Invalid "${String(field)}": ${firstIssue?.message ?? 'validation failed'}`,
    };
  }

  if (!isAssetType(parsed.data.type)) {
    return {
      ok: false,
      message: `Missing or invalid "type" — expected one of: ${ASSET_TYPES.join(', ')}`,
    };
  }

  return { ok: true, value: { lesson: parsed.data.lesson, type: parsed.data.type } };
}

/**
 * Executes the download-asset tool.
 *
 * Generates a signed, short-lived download URL via the injected factory
 * and returns it in a formatted MCP tool response. The URL can be
 * presented as a clickable link in LLM UIs (e.g. Claude Desktop).
 *
 * @param args - Validated download asset arguments
 * @param deps - Dependencies with URL factory
 * @returns CallToolResult with download URL
 */
export function runDownloadAssetTool(
  args: DownloadAssetArgs,
  deps: DownloadAssetDeps,
): CallToolResult {
  const url = deps.createAssetDownloadUrl(args.lesson, args.type);

  return formatToolResponse({
    summary: `Download link (valid for 5 minutes): ${url}`,
    data: { downloadUrl: url, lesson: args.lesson, type: args.type },
    toolName: 'download-asset',
    annotationsTitle: 'Download Asset',
  });
}
