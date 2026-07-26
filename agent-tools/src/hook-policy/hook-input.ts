import { err, ok, type Result } from '@oaknational/result';

import type { ContentChange } from './content-types.js';

/**
 * Parse JSON text from a PreToolUse hook stdin payload.
 */
export function parseHookInput(hookInputText: string): Result<unknown, Error> {
  try {
    return ok(JSON.parse(hookInputText));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse failure.';
    return err(
      new Error(`PreToolUse hook input was not valid JSON: ${message}`, {
        cause: error,
      }),
    );
  }
}

/**
 * Resolve final new/prior content using an injected prior-content reader.
 */
export function resolveContentPair(
  change: ContentChange,
  readPriorContent: (filePath: string) => string | null,
): { newContent: string; priorContent: string } {
  if (change.priorFilePath === undefined) {
    return { newContent: change.newContent, priorContent: change.priorContent };
  }

  return {
    newContent: change.newContent,
    priorContent: readPriorContent(change.priorFilePath) ?? '',
  };
}

/**
 * Read all text from a stream.
 */
export async function readStreamText(stdin: AsyncIterable<string | Buffer>): Promise<string> {
  let text = '';

  for await (const chunk of stdin) {
    text += chunk.toString();
  }

  return text;
}
