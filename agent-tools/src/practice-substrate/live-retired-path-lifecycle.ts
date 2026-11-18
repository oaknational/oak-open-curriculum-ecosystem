/**
 * Lifecycle classification for retired-path mentions (split from
 * live-retired-paths.ts for file-size cohesion): decides whether a mention
 * is live, archived, or historical evidence. Includes the commit-queue
 * store handling — an abandoned per-intent file is evidence, exactly as an
 * abandoned queue row inside a legacy flat registry was (registry schema
 * 1.4.0 split, owner ruling QUEUE-LOCAL).
 */
import {
  ACTIVE_CLAIMS_PATH,
  CLOSED_CLAIMS_PATH,
  LEGACY_COMMS_ROOTS,
  isJsonFieldMap,
  type ManifestDocument,
} from './live-types.js';

export function retiredPathLifecycle(
  manifest: ManifestDocument,
  path: string,
  text: string,
): 'live' | 'archived' | 'historical' {
  if (isKnownHistoricalPath(path, text)) {
    return path === CLOSED_CLAIMS_PATH ? 'archived' : 'historical';
  }
  if (matchesAnyRoot(path, manifest.discovery?.historical_roots ?? [])) {
    return 'archived';
  }
  if (isHistoricalDiscussion(text)) {
    return 'historical';
  }

  return 'live';
}

function isKnownHistoricalPath(path: string, text: string): boolean {
  return (
    path === CLOSED_CLAIMS_PATH ||
    path.includes('/archive/') ||
    LEGACY_COMMS_ROOTS.some((root) => path.startsWith(root)) ||
    (path === ACTIVE_CLAIMS_PATH && activeClaimMentionsAreAbandonedEvidence(text)) ||
    (path.startsWith(COMMIT_QUEUE_DIR) && commitQueueEntryIsAbandonedEvidence(text))
  );
}

// The per-intent commit-queue store beside the claims file.
const COMMIT_QUEUE_DIR = `${ACTIVE_CLAIMS_PATH.slice(
  0,
  ACTIVE_CLAIMS_PATH.lastIndexOf('/'),
)}/commit-queue/`;

function commitQueueEntryIsAbandonedEvidence(text: string): boolean {
  const parsed: unknown = JSON.parse(text);
  return isJsonFieldMap(parsed) && parsed.phase === 'abandoned';
}

function matchesAnyRoot(path: string, roots: readonly string[]): boolean {
  return roots.some((root) => path === root || path.startsWith(root));
}

// Legacy flat-registry handling: a pre-1.4.0 active-claims.json still
// carries its commit_queue array until the runtime readers migrate it.
function activeClaimMentionsAreAbandonedEvidence(text: string): boolean {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonFieldMap(parsed)) {
    return false;
  }

  const claims = parsed.claims;
  if (containsRetiredPath(claims)) {
    return false;
  }

  const matchingQueueEntries = Array.isArray(parsed.commit_queue)
    ? parsed.commit_queue.filter(containsRetiredPath)
    : [];
  return (
    matchingQueueEntries.length > 0 &&
    matchingQueueEntries.every((entry) => isJsonFieldMap(entry) && entry.phase === 'abandoned')
  );
}

function isHistoricalDiscussion(text: string): boolean {
  const contexts = retiredPathContexts(text);
  return contexts.length > 0 && contexts.every(isHistoricalContext);
}

const HISTORICAL_CONTEXT_PATTERN =
  /historical|legacy|migration|migrated|source evidence|provenance/;

function isHistoricalContext(context: string): boolean {
  return !context.includes('.gitkeep') && HISTORICAL_CONTEXT_PATTERN.test(context);
}

function retiredPathContexts(text: string): readonly string[] {
  const contexts: string[] = [];
  for (const root of LEGACY_COMMS_ROOTS) {
    let index = text.indexOf(root);
    while (index >= 0) {
      contexts.push(text.slice(Math.max(0, index - 1000), index + root.length + 1000));
      index = text.indexOf(root, index + root.length);
    }
  }

  return contexts;
}

function containsRetiredPath(value: unknown): boolean {
  if (typeof value === 'string') {
    return LEGACY_COMMS_ROOTS.some((root) => value.includes(root));
  }
  if (Array.isArray(value)) {
    return value.some(containsRetiredPath);
  }
  if (isJsonFieldMap(value)) {
    for (const key in value) {
      if (containsRetiredPath(value[key])) {
        return true;
      }
    }
  }

  return false;
}
