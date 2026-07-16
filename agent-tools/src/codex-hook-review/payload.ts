/**
 * Construction of a minimal, size-bounded Codex review payload.
 *
 * @packageDocumentation
 */

import { Buffer } from 'node:buffer';

import { ok, type Result } from '@oaknational/result';

import { resolveReviewPath, type ReviewPathInspection } from './path.js';
import { type EditChange, type HookChange, type WriteChange } from './types.js';

const MAX_REVIEW_CHANGES = 3;
const MAX_REVIEW_PAYLOAD_BYTES = 4096;

/** Minimal edit delta presented to the review model. */
interface ReviewEditChange {
  readonly operation: 'edit';
  readonly path: string;
  readonly before: string;
  readonly after: string;
}

/** Minimal complete write presented to the review model. */
interface ReviewWriteChange {
  readonly operation: 'write';
  readonly path: string;
  readonly content: string;
}

type ReviewPayloadChange = ReviewEditChange | ReviewWriteChange;

/** Complete, context-bounded value presented to the review model. */
export interface ReviewPayload {
  readonly version: 1;
  readonly changes: readonly ReviewPayloadChange[];
}

/** Decision made while constructing a review request. */
export type ReviewPayloadPlan =
  | {
      readonly kind: 'skip';
      readonly reason: 'no-reviewable-changes' | 'too-many-changes' | 'payload-too-large';
    }
  | { readonly kind: 'review'; readonly payload: ReviewPayload };

/** Inputs required to construct a context-bounded review request. */
export interface BuildReviewPayloadInput {
  readonly projectRoot: string;
  readonly changes: readonly HookChange[];
}

/** Build a review payload without reading source content or ambient process state. */
export async function buildReviewPayload(
  { projectRoot, changes }: BuildReviewPayloadInput,
  inspection: ReviewPathInspection,
): Promise<Result<ReviewPayloadPlan, Error>> {
  if (changes.length === 0) {
    return ok({ kind: 'skip', reason: 'no-reviewable-changes' });
  }
  if (changes.length > MAX_REVIEW_CHANGES) {
    return ok({ kind: 'skip', reason: 'too-many-changes' });
  }
  const normalisedChanges = await normaliseChanges(projectRoot, changes, inspection);
  if (!normalisedChanges.ok) {
    return normalisedChanges;
  }
  const payload = createReviewPayload(normalisedChanges.value);
  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_REVIEW_PAYLOAD_BYTES) {
    return ok({ kind: 'skip', reason: 'payload-too-large' });
  }
  return ok({ kind: 'review', payload });
}

/** Convert already-confined changes to the exact outbound wire shape. */
export function createReviewPayload(changes: readonly HookChange[]): ReviewPayload {
  return { version: 1, changes: changes.map(toReviewPayloadChange) };
}

function toReviewPayloadChange(change: HookChange): ReviewPayloadChange {
  return change.tool === 'Edit' ? toReviewEditChange(change) : toReviewWriteChange(change);
}

function toReviewEditChange(change: EditChange): ReviewEditChange {
  return {
    operation: 'edit',
    path: change.filePath,
    before: change.oldText,
    after: change.newText,
  };
}

function toReviewWriteChange(change: WriteChange): ReviewWriteChange {
  return { operation: 'write', path: change.filePath, content: change.content };
}

async function normaliseChanges(
  projectRoot: string,
  changes: readonly HookChange[],
  inspection: ReviewPathInspection,
): Promise<Result<readonly HookChange[], Error>> {
  const normalised: HookChange[] = [];
  for (const change of changes) {
    const result = await normaliseChange(projectRoot, change, inspection);
    if (!result.ok) {
      return result;
    }
    normalised.push(result.value);
  }
  return ok(normalised);
}

async function normaliseChange(
  projectRoot: string,
  change: HookChange,
  inspection: ReviewPathInspection,
): Promise<Result<HookChange, Error>> {
  const path = await resolveReviewPath(
    { projectRoot, filePath: change.filePath, tool: change.tool },
    inspection,
  );
  if (!path.ok) {
    return path;
  }
  return ok({ ...change, filePath: path.value });
}
