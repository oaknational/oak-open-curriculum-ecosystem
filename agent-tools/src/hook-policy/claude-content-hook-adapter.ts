import type { z } from 'zod';

import {
  ClaudeCamelEnvelopeSchema,
  ClaudeContentInputSchema,
  ClaudeSnakeEnvelopeSchema,
} from './claude-content-input-schemas.js';
import { buildPreToolUseDenyResponse } from './content-deny-response.js';
import type { ContentHookAdapter } from './content-hook-adapter.js';
import type { ContentChange } from './content-types.js';

/**
 * Thin Claude hook adapter: wire schemas, canonical normalisation, response.
 *
 * @packageDocumentation
 */

/** Normalise one validated Claude Edit or Write input. */
function toChange(input: z.infer<typeof ClaudeContentInputSchema>): ContentChange {
  if ('new_string' in input) {
    return {
      newContent: input.new_string,
      priorContent: input.old_string ?? '',
      ...(input.file_path === undefined ? {} : { filePath: input.file_path }),
    };
  }

  return {
    newContent: input.content,
    priorContent: '',
    ...(input.file_path === undefined
      ? {}
      : { filePath: input.file_path, priorFilePath: input.file_path }),
  };
}

/** Claude vendor boundary for the shared content-policy core. */
export const CLAUDE_CONTENT_HOOK_ADAPTER: ContentHookAdapter = {
  name: 'claude',
  routes: [
    {
      name: 'snake-envelope',
      schema: ClaudeSnakeEnvelopeSchema.transform((input) => [toChange(input.tool_input)]),
    },
    {
      name: 'camel-envelope',
      schema: ClaudeCamelEnvelopeSchema.transform((input) => [toChange(input.toolInput)]),
    },
    {
      name: 'flat-input',
      schema: ClaudeContentInputSchema.transform((input) => [toChange(input)]),
    },
  ],
  renderDeny: buildPreToolUseDenyResponse,
};
