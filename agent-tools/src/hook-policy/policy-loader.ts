import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { z } from 'zod';

import { isJsonObject } from '../collaboration-state/json.js';

import { ScopedContentBlockSchema, type ScopedContentBlock } from './types.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/** URL of the canonical hook policy file, used by all loaders by default. */
export const POLICY_URL = pathToFileURL(path.resolve(REPO_ROOT, '.agent/hooks/policy.json'));

/**
 * Parse blocked content patterns from already-loaded policy data.
 */
export function parseBlockedContentPolicy(policy: unknown): string[] {
  if (
    !isJsonObject(policy) ||
    !isJsonObject(policy.hooks) ||
    !isJsonObject(policy.hooks.preToolUseContent)
  ) {
    throw new Error(
      'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
    );
  }
  const blockedPatterns = policy.hooks.preToolUseContent.blocked_patterns;
  if (
    !Array.isArray(blockedPatterns) ||
    !blockedPatterns.every((pattern: unknown): pattern is string => typeof pattern === 'string')
  ) {
    throw new Error(
      'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
    );
  }
  return blockedPatterns;
}

/**
 * Parse path-scoped doctrine blocks from already-loaded policy data.
 *
 * Returns an empty array when the policy omits the optional
 * `scoped_blocks` section, so callers do not have to special-case
 * legacy policy files.
 */
export function parseScopedContentBlocks(policy: unknown): readonly ScopedContentBlock[] {
  if (
    !isJsonObject(policy) ||
    !isJsonObject(policy.hooks) ||
    !isJsonObject(policy.hooks.preToolUseContent)
  ) {
    return [];
  }

  const section = policy.hooks.preToolUseContent;
  if (!('scoped_blocks' in section)) {
    return [];
  }

  const parsed = z.array(ScopedContentBlockSchema).safeParse(section.scoped_blocks);
  if (!parsed.success) {
    throw new Error(
      'The canonical hook policy hooks.preToolUseContent.scoped_blocks was malformed.',
      { cause: parsed.error },
    );
  }
  return parsed.data;
}

/**
 * Load blocked content patterns from the canonical hook policy.
 */
export async function loadBlockedContentPatterns(policyUrl: URL = POLICY_URL): Promise<string[]> {
  const policyText = await fs.readFile(policyUrl, 'utf8');
  const policy: unknown = JSON.parse(policyText);
  return parseBlockedContentPolicy(policy);
}

/**
 * Load path-scoped doctrine blocks from the canonical hook policy.
 */
export async function loadScopedContentBlocks(
  policyUrl: URL = POLICY_URL,
): Promise<readonly ScopedContentBlock[]> {
  const policyText = await fs.readFile(policyUrl, 'utf8');
  const policy: unknown = JSON.parse(policyText);
  return parseScopedContentBlocks(policy);
}
