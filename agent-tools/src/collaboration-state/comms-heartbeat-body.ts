import { z } from 'zod';

/**
 * Lane A (A1) — heartbeat emitter mechanical state-binding.
 *
 * Enforces PDR-078 §5 "Substrate category: heartbeats are liveness
 * infrastructure" at the CLI boundary: heartbeat-tagged comms events
 * MUST construct their body from typed state fields, not from free-form
 * `--body` argv. This module is the typed-origin invariant. The CLI
 * layer (`cli-comms-commands.ts`) rejects free-form `--body` /
 * `--body-file` when `--tag heartbeat` is present and composes the body
 * via `composeHeartbeatBody` instead.
 *
 * The cure shape: structured origin (typed args), not just non-empty
 * content. Empty strings are rejected so the body cannot silently
 * degrade into prose-equivalent ambiguity — a body like
 * "active; claim=; intent=; branch=; cycle=" satisfies the typed-origin
 * shape but defeats the purpose, so the schema rejects it.
 */
const heartbeatBodyStateSchema = z
  .object({
    claimId: z.string().min(1),
    intentId: z.string().min(1),
    branch: z.string().min(1),
    currentCycleLabel: z.string().min(1),
  })
  .strict();

export type HeartbeatBodyState = z.infer<typeof heartbeatBodyStateSchema>;

/**
 * Compose the heartbeat event body from typed state. The output is a
 * single deterministic line: parsing the input through the strict Zod
 * schema is the source of validation, and the format is the recorded
 * canonical shape for `[HEARTBEAT]` event bodies under ADR-186's
 * migration window.
 *
 * The compile-time `HeartbeatBodyState` contract guarantees field
 * presence; the runtime `.parse` here is **defence in depth** for one
 * gap the type system does not close: the schema's `.min(1)` rejects
 * empty-string values, which the `string` compile-time type permits.
 * The CLI gate in `cli-comms-commands.ts` rejects missing keys before
 * reaching this composer, so the only remaining failure mode this
 * `.parse` catches in practice is a caller that bypasses the CLI and
 * passes empty strings programmatically.
 *
 * Throws (Zod `ZodError`) on schema mismatch — the caller (CLI) handles
 * the error by surfacing a cure-naming message to the operator.
 */
export function composeHeartbeatBody(state: HeartbeatBodyState): string {
  const parsed = heartbeatBodyStateSchema.parse(state);
  return `active; claim=${parsed.claimId}; intent=${parsed.intentId}; branch=${parsed.branch}; cycle=${parsed.currentCycleLabel}`;
}

export { heartbeatBodyStateSchema };
