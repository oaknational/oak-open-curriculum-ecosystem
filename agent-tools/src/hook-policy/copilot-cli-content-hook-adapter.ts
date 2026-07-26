import type { z } from 'zod';

import { buildCopilotPreToolUseDenyResponse } from './content-deny-response.js';
import type { ContentHookAdapter } from './content-hook-adapter.js';
import {
  CopilotNativeCamelEnvelopeSchema,
  CopilotNativePascalEnvelopeSchema,
} from './copilot-cli-content-input-schemas.js';
import type {
  CopilotCreateArgsSchema,
  CopilotEditArgsSchema,
} from './copilot-cli-content-input-schemas.js';
import type { ContentChange } from './content-types.js';

/**
 * Thin local Copilot CLI hook adapter: wire schemas, canonical normalisation,
 * and native response rendering.
 *
 * @packageDocumentation
 */

/** Normalise one validated Copilot create input. */
function createToChange(input: z.infer<typeof CopilotCreateArgsSchema>): ContentChange {
  return {
    newContent: input.file_text,
    priorContent: '',
    filePath: input.path,
    priorFilePath: input.path,
  };
}

/** Normalise one validated Copilot edit input. */
function editToChange(input: z.infer<typeof CopilotEditArgsSchema>): ContentChange {
  return {
    newContent: input.new_str ?? '',
    priorContent: input.old_str,
    filePath: input.path,
  };
}

/** Local Copilot CLI vendor boundary for the shared content-policy core. */
export const COPILOT_CLI_CONTENT_HOOK_ADAPTER: ContentHookAdapter = {
  name: 'copilot-cli',
  routes: [
    {
      name: 'native-camel-envelope',
      schema: CopilotNativeCamelEnvelopeSchema.transform((input) => {
        switch (input.toolName) {
          case 'create':
            return [createToChange(input.toolArgs)];
          case 'edit':
            return [editToChange(input.toolArgs)];
          case 'apply_patch':
            return input.toolArgs.changes;
          default: {
            const exhaustive: never = input;
            return exhaustive;
          }
        }
      }),
    },
    {
      name: 'pascal-envelope',
      schema: CopilotNativePascalEnvelopeSchema.transform((input) => {
        if ('file_text' in input.tool_input) {
          return [createToChange(input.tool_input)];
        }
        if ('old_str' in input.tool_input) {
          return [editToChange(input.tool_input)];
        }
        return input.tool_input.changes;
      }),
    },
  ],
  renderDeny: buildCopilotPreToolUseDenyResponse,
};
