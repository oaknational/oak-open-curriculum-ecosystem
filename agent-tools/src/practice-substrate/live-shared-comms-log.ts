/**
 * The shared comms log render: a read model generated from the comms events,
 * checked against a fresh render and classified by the instance tier when it
 * is absent.
 *
 * @packageDocumentation
 */

import { unwrapOrThrow } from '@oaknational/result';

import { renderSharedCommsLog } from '../collaboration-state/comms.js';
import {
  classifySurfacePresence,
  presenceFindings,
  type InstanceTierProbe,
} from './instance-tier.js';
import { readCommsEventFiles } from './live-comms-events.js';
import { liveSubstrateReads, readTextIfPresent } from './live-reads.js';
import { SHARED_COMMS_LOG } from './live-types.js';
import { evaluateGeneratedReadModelDrift } from './structural-evaluators.js';
import { type SubstrateFinding } from './types.js';

/** The render's surface id in the substrate manifest. */
const SURFACE = 'collaboration-shared-comms-log';

/** What the render's decision needs, read and rendered already. */
export interface SharedCommsLogSnapshot {
  /** The render's repo path. */
  readonly outputPath: string;
  /** The render's text on disk, or `undefined` when the read found no file. */
  readonly committedText: string | undefined;
  /** A fresh render of the comms events. */
  readonly regeneratedText: string;
  /** How many comms events the fresh render draws on. */
  readonly eventCount: number;
  /** The report's instance-tier probe. */
  readonly probe: InstanceTierProbe;
}

/**
 * The shared comms log render of the repository at `repoRoot`. The comms
 * events are parsed first, and an event that does not parse ends the leg with
 * its own finding; the render is then read, the read being the existence test.
 */
export async function evaluateSharedCommsLog(
  repoRoot: string,
  probe: InstanceTierProbe,
): Promise<readonly SubstrateFinding[]> {
  const events = await readCommsEventFiles(repoRoot);
  if (events.findings.length > 0) {
    return events.findings;
  }
  const all = [...events.narrative, ...events.lifecycle, ...events.directed];
  return evaluateSharedCommsLogSnapshot({
    outputPath: SHARED_COMMS_LOG,
    committedText: unwrapOrThrow(
      await readTextIfPresent(liveSubstrateReads(repoRoot), SHARED_COMMS_LOG),
    ),
    regeneratedText: renderSharedCommsLog({ events: all }),
    eventCount: all.length,
    probe,
  });
}

/**
 * Decide the render's findings. Absent where the repository would track it, it
 * is missing; absent by design with no events, it is informational, decided
 * before any comparison, since zero events still render a header. Otherwise
 * its text, empty when absent, is compared with the fresh render: a render
 * with a source is never clean by absence.
 */
export function evaluateSharedCommsLogSnapshot(
  snapshot: SharedCommsLogSnapshot,
): readonly SubstrateFinding[] {
  const presence = classifySurfacePresence({
    path: snapshot.outputPath,
    found: snapshot.committedText !== undefined,
    probe: snapshot.probe,
  });
  if (!presence.ok || presence.value === 'absent') {
    return presenceFindings(SURFACE, snapshot.outputPath, presence);
  }
  if (presence.value === 'absent-by-design' && snapshot.eventCount === 0) {
    return presenceFindings(SURFACE, snapshot.outputPath, presence);
  }
  return evaluateGeneratedReadModelDrift({
    surface: SURFACE,
    outputPath: snapshot.outputPath,
    committedText: snapshot.committedText ?? '',
    regeneratedText: snapshot.regeneratedText,
  });
}
