import { isPatchId, type PatchId } from './content-binding.js';
import type { PatchIdOf } from './content-reader.js';

/**
 * Fixtures for the content binding's specs: synthetic patch-ids and a fake
 * hasher. A fake diff here is a patch-id's text, so the fake hashes each diff
 * to exactly the id the spec chose for it; anything else reads as unproven,
 * as the real hasher reads text with no id.
 */

/** A synthetic patch-id: one hex digit repeated forty times. */
export function syntheticPatchId(digit: string): PatchId {
  const id = digit.repeat(40);
  if (!isPatchId(id)) {
    throw new Error(`not a hex digit: ${digit}`);
  }
  return id;
}

/** The fake hasher: a diff whose text is a patch-id hashes to it. */
export const textHasher: PatchIdOf = (diff) => {
  const id = diff.trim();
  return isPatchId(id) ? { kind: 'id', id } : { kind: 'unproven', reason: 'no id in the text' };
};
