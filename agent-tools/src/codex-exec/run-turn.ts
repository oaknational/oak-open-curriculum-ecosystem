import { err, type Result } from '@oaknational/result';

import {
  executeTurn,
  type TurnContext,
  type TurnError,
  type TurnPorts,
  type TurnRequest,
} from './dialogue-turn.js';
import { envelopeDigest } from './envelope.js';
import {
  admitRecord,
  matchBinding,
  type GateRefusal,
  type PassRecordRead,
  type ResolvedBinary,
} from './gate.js';
import { PROBE_CONTRACT_VERSION } from './probe-contract.js';
import type { TurnOutcome } from './turn-verdict.js';

/**
 * Why the binary could not be resolved: no `codex` to be found, or a
 * version it would not report.
 */
export interface BinaryUnresolved {
  readonly kind: 'binary-unresolved';
  readonly reason: 'not-found' | 'version-unreadable';
}

/**
 * The effects a gated turn needs, injected: the turn's own, plus the pass
 * record read and the binary resolution the gate needs.
 */
export interface GatedTurnPorts extends TurnPorts {
  /**
   * Reports what is where the pass record lives in the given instrument
   * Codex home, the home the spawn's `CODEX_HOME` names, so a record from one
   * home never opens a turn in another.
   */
  readonly readPassRecord: (codexHome: string) => PassRecordRead;
  /** Resolves `codex` to its real path, and reads the version it reports. */
  readonly resolveBinary: () => Result<ResolvedBinary, BinaryUnresolved>;
}

/**
 * Why a gated turn did not run or did not count.
 */
export type GatedTurnError = GateRefusal | BinaryUnresolved | TurnError;

/**
 * Run one dialogue turn, but only on a binding a probe has passed: the gated
 * core of `dialogue-turn`. The pass record is admitted first, measured
 * against the clock, so an empty instrument home or a record past its age
 * asks for a probe before anything about the binary is known. Then the
 * binary is resolved once, the binding is matched against the record, and
 * the turn spawns that same resolved path.
 *
 * @param request - The turn: open a dialogue's thread, or resume one.
 * @param context - What the composition root resolved once for every turn.
 * @param ports - The turn's own ports, plus the record read and the binary resolution.
 */
export function runTurn(
  request: TurnRequest,
  context: TurnContext,
  ports: GatedTurnPorts,
): Result<TurnOutcome, GatedTurnError> {
  const record = admitRecord(
    ports.readPassRecord(context.childEnvInputs.instrumentCodexHome),
    ports.now(),
  );
  if (!record.ok) {
    return err(record.error);
  }
  const binary = ports.resolveBinary();
  if (!binary.ok) {
    return err(binary.error);
  }
  const match = matchBinding(record.value, {
    cliVersion: binary.value.cliVersion,
    executablePath: binary.value.executablePath,
    envelopeDigest: envelopeDigest(context.modelPins),
    probeContractVersion: PROBE_CONTRACT_VERSION,
  });
  if (!match.ok) {
    return err(match.error);
  }
  return executeTurn(request, context, binary.value, ports);
}
