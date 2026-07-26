import { err, map, ok, type Result } from '@oaknational/result';
import type { z } from 'zod';

import {
  ClaudeCamelEnvelopeSchema,
  ClaudeContentInputSchema,
  ClaudeSnakeEnvelopeSchema,
} from './claude-content-input-schemas.js';
import {
  CopilotNativeCamelEnvelopeSchema,
  CopilotNativePascalEnvelopeSchema,
} from './content-input-schemas.js';
import type { CopilotCreateArgsSchema, CopilotEditArgsSchema } from './content-input-schemas.js';
import type { ContentChange, RoutedContentChanges } from './content-types.js';

/**
 * Closed schema routing and host-to-canonical normalisation for content hooks.
 *
 * Each supported wire contract is an explicit schema. Routing succeeds only
 * when exactly one schema validates the complete input; there is no field
 * sniffing, fallback shape, or host guess.
 *
 * @packageDocumentation
 */

/** One named member of a closed schema routing set. */
export type NamedSchema<T> = Readonly<{
  name: string;
  schema: z.ZodType<T>;
}>;

/**
 * Parse an input through exactly one member of a closed schema set.
 */
export function selectExactlyOneSchema<T>(
  input: unknown,
  schemas: readonly NamedSchema<T>[],
  inputName: string,
): Result<T, Error> {
  const matches = schemas.flatMap(({ name, schema }) => {
    const result = schema.safeParse(input);
    return result.success ? [{ name, data: result.data }] : [];
  });

  if (matches.length !== 1) {
    const names = matches.map(({ name }) => name).join(', ');
    const matchedNames = names.length > 0 ? ` (${names})` : '';
    return err(
      new Error(
        `${inputName} matched ${matches.length} supported schemas${matchedNames}; expected exactly one.`,
      ),
    );
  }

  const [match] = matches;
  return match === undefined
    ? err(new Error(`${inputName} schema selection failed after a single match.`))
    : ok(match.data);
}

/** Normalise one validated Claude Edit or Write input. */
function claudeInputToChange(input: z.infer<typeof ClaudeContentInputSchema>): ContentChange {
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

/** Normalise one validated Copilot create input. */
function copilotCreateToChange(input: z.infer<typeof CopilotCreateArgsSchema>): ContentChange {
  return {
    newContent: input.file_text,
    priorContent: '',
    filePath: input.path,
    priorFilePath: input.path,
  };
}

/** Normalise one validated Copilot edit input. */
function copilotEditToChange(input: z.infer<typeof CopilotEditArgsSchema>): ContentChange {
  return {
    newContent: input.new_str ?? '',
    priorContent: input.old_str,
    filePath: input.path,
  };
}

/** Construct the canonical request consumed by policy evaluation. */
function routed(
  responseFormat: 'claude' | 'copilot',
  changes: readonly ContentChange[],
): RoutedContentChanges {
  return { responseFormat, changes };
}

/** Closed set of supported content-hook schemas and their normalisers. */
const CONTENT_CHANGE_ROUTES: readonly NamedSchema<RoutedContentChanges>[] = [
  {
    name: 'claude-snake-envelope',
    schema: ClaudeSnakeEnvelopeSchema.transform((input) =>
      routed('claude', [claudeInputToChange(input.tool_input)]),
    ),
  },
  {
    name: 'claude-camel-envelope',
    schema: ClaudeCamelEnvelopeSchema.transform((input) =>
      routed('claude', [claudeInputToChange(input.toolInput)]),
    ),
  },
  {
    name: 'claude-flat-input',
    schema: ClaudeContentInputSchema.transform((input) =>
      routed('claude', [claudeInputToChange(input)]),
    ),
  },
  {
    name: 'copilot-native-camel-envelope',
    schema: CopilotNativeCamelEnvelopeSchema.transform((input) => {
      switch (input.toolName) {
        case 'create':
          return routed('copilot', [copilotCreateToChange(input.toolArgs)]);
        case 'edit':
          return routed('copilot', [copilotEditToChange(input.toolArgs)]);
        case 'apply_patch':
          return routed('copilot', input.toolArgs.changes);
        default: {
          const exhaustive: never = input;
          return exhaustive;
        }
      }
    }),
  },
  {
    name: 'copilot-native-pascal-envelope',
    schema: CopilotNativePascalEnvelopeSchema.transform((input) => {
      if ('file_text' in input.tool_input) {
        return routed('copilot', [copilotCreateToChange(input.tool_input)]);
      }
      if ('old_str' in input.tool_input) {
        return routed('copilot', [copilotEditToChange(input.tool_input)]);
      }
      return routed('copilot', input.tool_input.changes);
    }),
  },
];

/**
 * Route one complete PreToolUse content payload through the closed schema set.
 */
export function routeContentChanges(input: unknown): Result<RoutedContentChanges, Error> {
  return selectExactlyOneSchema(input, CONTENT_CHANGE_ROUTES, 'PreToolUse content input');
}

/**
 * Project successfully routed input to canonical changes.
 */
export function extractContentChanges(input: unknown): Result<readonly ContentChange[], Error> {
  return map(routeContentChanges(input), (routedInput) => routedInput.changes);
}
