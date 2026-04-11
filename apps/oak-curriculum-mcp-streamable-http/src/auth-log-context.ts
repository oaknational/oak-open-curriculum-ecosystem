/**
 * Auth Error Log Context Schema
 *
 * Defines the Zod schema for the structured log context emitted when
 * auth errors are intercepted during tool execution. This schema is
 * the single source of truth for the shape of the context object
 * passed to `logger.warn('Tool execution auth error', context)` in
 * `handleToolWithAuthInterception`.
 */

import { z } from 'zod';

/**
 * Schema for auth error log context.
 *
 * Matches the shape emitted in `tool-handler-with-auth.ts`:
 * ```typescript
 * logger.warn('Tool execution auth error', { toolName, errorType, description });
 * ```
 */
export const authLogContextSchema = z.object({
  toolName: z.string(),
  errorType: z.string(),
  description: z.string(),
});
