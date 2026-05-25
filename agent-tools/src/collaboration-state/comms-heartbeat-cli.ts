import { optional, required, type Options } from './cli-options.js';
import { composeHeartbeatBody } from './comms-heartbeat-body.js';

/**
 * Heartbeat-tag typed-state CLI keys (Lane A — PDR-078 §5). The order
 * of this tuple is the canonical order the cure-naming error messages
 * surface to operators; tests assert on that order via regex.
 *
 * Structural coupling note: these four keys map 1:1 to the four fields
 * of heartbeatBodyStateSchema (claim-id ↔ claimId, intent-id ↔ intentId,
 * branch ↔ branch, current-cycle-label ↔ currentCycleLabel). If the
 * schema gains a fifth field, this tuple AND the typed object passed
 * to composeHeartbeatBody below MUST grow in lockstep.
 */
const HEARTBEAT_STATE_ARG_KEYS = [
  'claim-id',
  'intent-id',
  'branch',
  'current-cycle-label',
] as const;
const HEARTBEAT_STATE_ARG_HINT = `Pass ${HEARTBEAT_STATE_ARG_KEYS.map((k) => `--${k}`).join(', ')}.`;

/**
 * Heartbeat-tag CLI gate enforcing PDR-078 §5 "Substrate category:
 * heartbeats are liveness infrastructure". Rejects free-form --body /
 * --body-file argv on heartbeat-tagged events; requires the four typed
 * state args; composes the body deterministically via
 * composeHeartbeatBody. Error messages name the cure so operators can
 * fix the call without reading source.
 */
export function composeHeartbeatBodyFromOptions(options: Options): string {
  if (optional(options, 'body') !== undefined) {
    throw new Error(
      `heartbeat-tagged events: --body argv rejected. Heartbeats must compose their body from typed state args. ${HEARTBEAT_STATE_ARG_HINT}`,
    );
  }
  if (optional(options, 'body-file') !== undefined) {
    throw new Error(
      `heartbeat-tagged events: --body-file argv rejected. Heartbeats must compose their body from typed state args. ${HEARTBEAT_STATE_ARG_HINT}`,
    );
  }
  const missing = HEARTBEAT_STATE_ARG_KEYS.filter((key) => optional(options, key) === undefined);
  if (missing.length > 0) {
    const missingFlags = missing.map((key) => `--${key}`).join(', ');
    throw new Error(
      `heartbeat-tagged events require typed state args; missing: ${missingFlags}. ${HEARTBEAT_STATE_ARG_HINT}`,
    );
  }

  return composeHeartbeatBody({
    claimId: required(options, 'claim-id'),
    intentId: required(options, 'intent-id'),
    branch: required(options, 'branch'),
    currentCycleLabel: required(options, 'current-cycle-label'),
  });
}
