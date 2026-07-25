/**
 * Vitest global setup — one design-system copy per run.
 *
 * @remarks
 * The served-surface route test asserts `/oak-ds/styles.css` is reachable,
 * which needs the copy to have happened. This runs in `globalSetup` rather
 * than `setupFiles` deliberately: setup files execute once per parallel
 * worker, so several workers would race the same destination directory
 * while one of them has it removed mid-copy.
 */

import path from 'node:path';

import { copyOakDs } from './build-scripts/copy-oak-ds.js';

export default async function setup(): Promise<void> {
  await copyOakDs(path.join(import.meta.dirname, 'public'));
}
