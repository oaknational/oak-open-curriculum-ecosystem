import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import type { z } from 'zod';
import { extractZodShape } from './zod-utils.js';
import type { ToolRegistryDescriptor } from './types.js';

/**
 * Resolve the human-facing title for a generated tool descriptor.
 *
 * During the codegen transition, generated titles may arrive either as the
 * spec-aligned top-level `title` field or via `annotations.title`.
 */
export function resolveGeneratedToolTitle(descriptor: ToolRegistryDescriptor): string | undefined {
  return descriptor.title ?? descriptor.annotations?.title;
}

/**
 * Resolve the required human-facing metadata for a generated tool.
 *
 * Listing and execution share this helper so registration titles, summaries,
 * and widget metadata stay in sync.
 */
export function requireGeneratedToolMetadata(
  toolName: ToolName,
  descriptor: ToolRegistryDescriptor,
): { readonly title: string; readonly description: string } {
  const title = resolveGeneratedToolTitle(descriptor);
  const description = descriptor.description;

  if (!title || !description) {
    throw new Error(
      `Generated tool "${toolName}" missing required metadata: ` +
        `title=${String(title)}, description=${String(description)}. ` +
        'Fix the generator template or OpenAPI spec.',
    );
  }

  return { title, description };
}

/**
 * Resolve the required flat input shape for a generated tool.
 *
 * Generated tool descriptors must expose an object-shaped
 * `toolMcpFlatInputSchema`. Returning `{}` here would silently mis-advertise
 * parameterised tools as parameterless, so contract drift fails fast instead.
 */
export function requireGeneratedToolInputShape(
  toolName: ToolName,
  descriptor: ToolRegistryDescriptor,
): z.ZodRawShape {
  const inputSchema = extractZodShape(descriptor.toolMcpFlatInputSchema);

  if (!inputSchema) {
    throw new Error(
      `Generated tool "${toolName}" missing required flat input schema: ` +
        'toolMcpFlatInputSchema must be a ZodObject. ' +
        'Fix the generator output or test registry.',
    );
  }

  return inputSchema;
}
