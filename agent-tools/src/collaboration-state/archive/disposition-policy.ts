/**
 * Tier-policy disposition ledger builder for the WS7 archive-move curator pass
 * (ADR-199 §Decision item 5; PDR-094 absorption gate).
 *
 * @remarks
 * The plan orchestrator (`archive-move.ts`) takes an explicit ledger so every
 * disposition is a recorded decision. This pure helper builds the **bulk** part
 * of that ledger from the structural tier:
 *
 * - **Heartbeat → `routine`.** Legitimate as a bulk auto-disposition ONLY because
 *   the class cadence aggregate is conserved once, in the git-tracked
 *   `.agent/reference/comms-heartbeat-cadence.md` (WS7 Task 2b) — that
 *   conservation IS the absorption for the heartbeat class. `bodyReadConfirmed`
 *   stays `false`, so a long-bodied heartbeat still trips the body-read gate
 *   rather than moving on title genre alone.
 * - **Every other tier → absent.** Coordination and research-precious events are
 *   intentionally left out of the bulk ledger: they surface as
 *   `awaitingDisposition` (the curator work-list) and never auto-move. The
 *   curator records their dispositions explicitly after a body read / absorption.
 *
 * @packageDocumentation
 */

import type { LedgerEntry } from './archive-move-types.js';
import { classifyTier, type ClassifiableEvent } from './event-classification.js';

/**
 * Build the bulk disposition ledger from the structural tier. Only heartbeat-tier
 * events are auto-dispositioned (`routine`, body-read unconfirmed); every other
 * tier is omitted so it surfaces for explicit curator disposition.
 */
export function buildTierPolicyLedger(
  events: Iterable<ClassifiableEvent>,
): Map<string, LedgerEntry> {
  const ledger = new Map<string, LedgerEntry>();
  for (const event of events) {
    if (classifyTier(event) === 'heartbeat') {
      ledger.set(event.eventId, { disposition: 'routine', bodyReadConfirmed: false });
    }
  }
  return ledger;
}
