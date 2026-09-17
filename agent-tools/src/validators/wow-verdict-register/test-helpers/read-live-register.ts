/*
 * The owned fixture surface for the committed live register
 * (test-immediate-fails item 4: an in-process test reads a committed repo
 * artefact only through an owned test-helpers/ surface anchored at
 * import.meta.dirname). Returning the RAW BYTES keeps the integration
 * suite's proof byte-level — a JSON re-serialisation would normalise away
 * duplicate keys, a BOM, or trailing content before the parser saw them.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { REGISTER_PATH } from '../wow-verdict-register.js';

const repoRoot = join(import.meta.dirname, '..', '..', '..', '..', '..');

export function readLiveRegisterBytes(): string {
  return readFileSync(join(repoRoot, REGISTER_PATH), 'utf8');
}
