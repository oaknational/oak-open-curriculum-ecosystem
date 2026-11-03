import { readFileSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { err, type Result } from '@oaknational/result';

/**
 * Per-checkout merge-bot identity (AIP-158; owner ruling 2026-07-21 put the
 * bot's identity in config so no seat carries it as session memory; owner
 * ruling 2026-09-03 took that config OUT of version control — each clone
 * names its own app, so the file is per-checkout and never tracked).
 *
 * `.github/merge-bot.json` names WHICH GitHub App is this clone's merge bot.
 * It is gitignored; the tracked surface is `.github/merge-bot.json.example`,
 * the template a fresh clone copies and fills in. Callers resolve the file at
 * the clone's PRIMARY checkout (`resolve-identity.ts`), so every linked
 * worktree reads the one copy and no worktree carries a stale duplicate. The
 * private key stays machine-local by design; its default location is DERIVED
 * from the config (`~/.config/<appSlug>/private-key.pem`), so nothing in the
 * repo records a machine path (principles.md §No machine-local paths).
 */

export const MERGE_BOT_CONFIG_RELATIVE_PATH = path.join('.github', 'merge-bot.json');
const MERGE_BOT_CONFIG_EXAMPLE_RELATIVE_PATH = path.join('.github', 'merge-bot.json.example');

const MERGE_BOT_CONFIG_SCHEMA = z
  .object({
    appSlug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'appSlug must be a GitHub app slug'),
    appId: z.string().regex(/^\d+$/, 'appId must be the numeric GitHub App id as a string'),
    repo: z
      .string()
      .regex(/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/, 'repo must be owner/name in GitHub grammar'),
  })
  .strict();

export type MergeBotRepoConfig = z.output<typeof MERGE_BOT_CONFIG_SCHEMA>;

/**
 * Read and strictly validate `.github/merge-bot.json` under `repoRoot` (the
 * clone's primary checkout; see `resolve-identity.ts`). An unreadable file
 * names the template to copy, because on a fresh clone that is the fix.
 */
export function loadMergeBotRepoConfig(input: {
  readonly repoRoot: string;
  readonly readFileImpl?: (filePath: string) => string;
}): Result<MergeBotRepoConfig, Error> {
  const configPath = path.join(input.repoRoot, MERGE_BOT_CONFIG_RELATIVE_PATH);
  const read = input.readFileImpl ?? ((filePath: string) => readFileSync(filePath, 'utf8'));
  let raw: string;
  try {
    raw = read(configPath);
  } catch (cause) {
    return err(
      new Error(
        `merge-bot config not readable at ${MERGE_BOT_CONFIG_RELATIVE_PATH} (per-checkout, never tracked): copy ${MERGE_BOT_CONFIG_EXAMPLE_RELATIVE_PATH} to ${MERGE_BOT_CONFIG_RELATIVE_PATH} at this clone's primary checkout and name this clone's app; cause: ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return err(new Error(`${MERGE_BOT_CONFIG_RELATIVE_PATH} is not valid JSON`));
  }
  return parseWithSchema({
    label: MERGE_BOT_CONFIG_RELATIVE_PATH,
    schema: MERGE_BOT_CONFIG_SCHEMA,
    value: parsed,
  });
}

/** The machine-local default key location derived from the repo config. */
export function defaultPrivateKeyPath(input: {
  readonly home: string;
  readonly appSlug: string;
}): string {
  return path.join(input.home, '.config', input.appSlug, 'private-key.pem');
}
