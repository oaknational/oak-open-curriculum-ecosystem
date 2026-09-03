import { type SpawnedWorktree } from './create.js';

/**
 * The per-seat specifics a coordinator supplies when spawning a lane. The rest of
 * the seat — worktree, branch, and identity — is derived from the spawn result, so
 * only these human-chosen fields are passed in. All are optional: a brief always
 * carries the derived coordinates and the grounding invocation; each specific is
 * rendered only when the coordinator provided it.
 */
export interface SeatSpecifics {
  /** The seat's coordination role, e.g. `implementer`, `reviewer`, `marshal`. */
  readonly role?: string;
  /** The lane task the spawned agent owns, free text. */
  readonly task?: string;
  /** The Director this seat reports to, e.g. `Triton lifts Eternity (34b9ce)`. */
  readonly director?: string;
}

/**
 * Render the seat brief for a freshly-spawned lane (spawn-flow 1D).
 *
 * The seat — `{worktree, branch, role, task, Director}` — is DERIVED, not stored:
 * worktree and branch come from the spawn {@link result}; role, task, and Director
 * are the per-seat {@link seat} specifics the spawning coordinator supplies. There
 * is no seat-registry surface.
 *
 * Identity is deliberately absent: the launched session's identity is derived by
 * the platform `SessionStart` hook from the PDR-027 seed at launch — the
 * untagged platform session id on cloud seats, the harness `session_id`
 * otherwise (see `./launch-command.ts`) — so the brief states that rather
 * than printing an authored prediction the session would not honour.
 *
 * The brief INVOKES `/oak-start-right-team` rather than restating it: the spawned
 * session grounds itself through that skill, and this brief carries only the
 * per-seat context the skill cannot derive. Re-authoring the skill here would be a
 * cowpath (the originating session's Pitfall 5).
 */
export function formatSeatBrief(result: SpawnedWorktree, seat: SeatSpecifics): string {
  const lines = [
    '',
    '── Seat brief ──',
    `  worktree: ${result.worktreePath}`,
    `  branch:   ${result.branch}`,
    '  identity: assigned at launch (the SessionStart hook derives it from the PDR-027',
    '            seed — the untagged platform session id on cloud seats, the harness',
    '            session_id otherwise; run identity preflight in the session to confirm)',
  ];
  if (seat.role !== undefined) {
    lines.push(`  role:     ${seat.role}`);
  }
  if (seat.task !== undefined) {
    lines.push(`  task:     ${seat.task}`);
  }
  if (seat.director !== undefined) {
    lines.push(`  Director: ${seat.director}`);
  }
  lines.push(
    '',
    '  Ground this seat with /oak-start-right-team — the brief above is your per-seat',
    '  context (worktree, branch, role, task, Director). It invokes the skill; it does',
    '  not replace it.',
    '',
  );
  return lines.join('\n');
}
