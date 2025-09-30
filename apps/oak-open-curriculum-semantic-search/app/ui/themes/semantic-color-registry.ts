import { oakColorTokens } from '@oaknational/oak-components';
import type { OakColorToken } from '@oaknational/oak-components';

const semanticCustomColorTokens = {
  'brand-forest-1000': '#0b2a16',
  'brand-forest-900': '#0f381b',
  'brand-forest-800': '#144d24',
  'brand-forest-500': '#35a04c',
  'brand-mint-300': '#82d88a',
  'brand-mint-200': '#6ed680',
} as const;

export type SemanticCustomColorToken = keyof typeof semanticCustomColorTokens;
export type SemanticColorToken = OakColorToken | SemanticCustomColorToken;

export const semanticColorTokens: Record<SemanticColorToken, string> = {
  ...oakColorTokens,
  ...semanticCustomColorTokens,
};

function isSemanticCustomColorToken(value: string): value is SemanticCustomColorToken {
  return value in semanticCustomColorTokens;
}

export function isSemanticColorToken(value: unknown): value is SemanticColorToken {
  return typeof value === 'string' && value in semanticColorTokens;
}

export function resolveSemanticColor(token: SemanticColorToken): string {
  if (isSemanticCustomColorToken(token)) {
    return semanticColorTokens[token];
  }

  const resolved = oakColorTokens[token];
  if (!resolved) {
    throw new Error(`Unknown semantic colour token "${token}"`);
  }
  return resolved;
}
