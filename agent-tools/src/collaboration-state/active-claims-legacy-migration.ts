/**
 * One-time migration of a legacy active-claims file (schema_version 1.3.0,
 * carrying the flat `commit_queue` array) into the 1.4.0 split: live queue
 * entries move to the per-intent store, expired entries drop as ephemera,
 * and the claims file rewrites in the new shape with its claims rows carried
 * over value- and key-order-intact, re-serialised at the canonical two-space
 * format. REPLACE, never bridge: the runtime readers accept only
 * the new shape and route a legacy file through this migration on first
 * contact (owner ruling 2026-08-17, QUEUE-LOCAL).
 */
import { readFile } from 'node:fs/promises';

import { err, unwrapOrThrow } from '@oaknational/result';

import { getJsonValue, isJsonObject, parseJsonTextResult } from '../core/json.js';
import {
  planLegacyActiveClaimsMigration,
  type LegacyActiveClaimsMigrationPlan,
} from './active-claims-legacy-migration-plan.js';
import { createCollaborationJsonSchemaValidator } from './collaboration-json-validation.js';
import { commitQueueDirForActivePath, writeCommitQueueEntry } from './commit-queue-store.js';
import { activeClaimsWriteValidator } from './state-io-write-validators.js';
import {
  runJsonStateTransaction,
  serializeJson,
  writeJsonFileWithinTransaction,
} from './transaction.js';

/**
 * A legacy file is valid JSON at exactly schema_version 1.3.0 still carrying
 * a `commit_queue` array — the one shape this migration is defined over.
 * Malformed JSON is NOT legacy, and neither is any OTHER version: both flow
 * to the current parser's loud failure path unchanged (latest-only support;
 * a 1.1.0/1.2.0 file keeps its actionable version-pin rejection).
 */
export function isLegacyActiveClaimsText(text: string): boolean {
  const parsed = parseJsonTextResult(text, 'active-claims registry');
  return (
    parsed.ok &&
    isJsonObject(parsed.value) &&
    getJsonValue(parsed.value, 'schema_version') === '1.3.0' &&
    Array.isArray(getJsonValue(parsed.value, 'commit_queue'))
  );
}

/**
 * Every write of the migration is judged BEFORE its first write, so a refusal
 * anywhere leaves the store as untouched as the legacy file (no partial
 * publish): each live raw row must satisfy the intent schema as the file it
 * is about to become (strict at the boundary, before reconstruction can drop
 * what the parser does not read), and the rewritten claims document must
 * pass the claims write gate (an unknown top-level field, an invalid claim).
 */
async function refuseUnlessEveryWriteWouldPass(
  plan: LegacyActiveClaimsMigrationPlan,
  activePath: string,
): Promise<void> {
  const validator = await createCollaborationJsonSchemaValidator();
  for (const row of plan.liveRawRows) {
    const validated = validator.validateText('commit-queue-intent.schema.json', row.text);
    if (!validated.ok) {
      unwrapOrThrow(
        err(new Error(`${activePath} commit_queue[${row.index}]: ${validated.error.message}`)),
      );
    }
  }
  await serializeJson(plan.claimsFileValue, activeClaimsWriteValidator(activePath));
}

/**
 * Execute the migration under the claims file's transaction lock. The text
 * is re-read and re-detected inside the lock, so a concurrent reader that
 * migrated first turns this call into a no-op instead of a double-write.
 */
export async function migrateLegacyActiveClaimsFile(input: {
  readonly activePath: string;
  readonly nowIso: string;
}): Promise<void> {
  await runJsonStateTransaction({
    filePaths: [input.activePath],
    operation: async () => {
      const text = await readFile(input.activePath, 'utf8');
      if (!isLegacyActiveClaimsText(text)) {
        return;
      }
      const plan = unwrapOrThrow(
        planLegacyActiveClaimsMigration({
          text,
          path: input.activePath,
          nowIso: input.nowIso,
        }),
      );

      await refuseUnlessEveryWriteWouldPass(plan, input.activePath);

      const queueDir = commitQueueDirForActivePath(input.activePath);
      for (const entry of plan.liveEntries) {
        await writeCommitQueueEntry({ queueDir, entry, nowIso: input.nowIso });
      }
      await writeJsonFileWithinTransaction({
        filePath: input.activePath,
        value: plan.claimsFileValue,
        validateText: activeClaimsWriteValidator(input.activePath),
      });
    },
  });
}
