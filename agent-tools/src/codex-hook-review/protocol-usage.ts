import { z } from 'zod';

export const usageSchema = z.object({
  input_tokens: z.number().int().nonnegative(),
  cached_input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(),
  reasoning_output_tokens: z.number().int().nonnegative().optional(),
});

export interface CodexUsage {
  readonly inputTokens: number;
  readonly cachedInputTokens: number;
  readonly outputTokens: number;
  readonly reasoningOutputTokens?: number;
}

export function toCodexUsage(usage: z.infer<typeof usageSchema>): CodexUsage {
  const base = {
    inputTokens: usage.input_tokens,
    cachedInputTokens: usage.cached_input_tokens,
    outputTokens: usage.output_tokens,
  };
  return usage.reasoning_output_tokens === undefined
    ? base
    : { ...base, reasoningOutputTokens: usage.reasoning_output_tokens };
}
