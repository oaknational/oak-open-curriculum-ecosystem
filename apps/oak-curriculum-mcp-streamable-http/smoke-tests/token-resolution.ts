import type { DevTokenSource } from './smoke-assertions/types.js';

export interface ResolveDevTokenOptions {
  readonly fallbackValue?: string;
  readonly allowEmpty?: boolean;
}

export interface DevTokenResolution {
  readonly value: string | undefined;
  readonly source: DevTokenSource;
}

export function resolveDevToken(
  explicitValue: string | undefined,
  envValue: string | undefined,
  options: ResolveDevTokenOptions = {},
): DevTokenResolution {
  const direct = explicitValue?.trim();
  if (direct) {
    return { value: direct, source: 'cli' };
  }

  const envCandidate = envValue?.trim();
  if (envCandidate) {
    return { value: envCandidate, source: 'env' };
  }

  if (options.fallbackValue !== undefined) {
    return { value: options.fallbackValue, source: 'fallback' };
  }

  if (options.allowEmpty) {
    return { value: undefined, source: 'not-required' };
  }

  return { value: undefined, source: 'fallback' };
}
