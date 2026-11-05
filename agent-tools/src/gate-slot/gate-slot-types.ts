import type { InheritedProcessEnd } from '../repo-check/repo-check-runtime.js';

import type { GateSlotLimit } from './gate-slot-contract.js';
import type { HolderIdentityLine } from './gate-slot-identity.js';
import type { AdmissionDecision, SlotObservation } from './gate-slot-policy.js';

/**
 * The ports between the gate-slot command and its adapters: what `main`
 * asks of the slot registry and the child runner, and what they report.
 *
 * @packageDocumentation
 */

/** One admission attempt: who is asking, and the verdict to apply under the mutex. */
interface TransactRequest {
  /** The identity line to serve on an admitted slot. */
  readonly identityLine: HolderIdentityLine;
  readonly decide: (slots: readonly SlotObservation[]) => AdmissionDecision;
}

/** One admission attempt under the mutex, as the slot adapter reports it. */
export type TransactOutcome =
  | {
      readonly kind: 'decided';
      readonly decision: AdmissionDecision;
      /** Frees the slot an admitted gate holds; does nothing after a wait verdict. */
      readonly release: () => Promise<void>;
    }
  | { readonly kind: 'mutex-busy'; readonly port: number }
  | { readonly kind: 'failed'; readonly message: string };

/** One read of every slot under the mutex, for `status`. */
export type ObserveOutcome =
  | { readonly kind: 'observed'; readonly slots: readonly SlotObservation[] }
  | { readonly kind: 'mutex-busy'; readonly port: number }
  | { readonly kind: 'failed'; readonly message: string };

/** The gated pnpm command and the variables its environment gains. */
export interface ChildRequest {
  readonly args: readonly string[];
  readonly extraEnv: Readonly<Record<string, string>>;
}

/** How a gate child ended, the bound that stopped it, if one did, and what its group left. */
export interface GateChildEnd {
  readonly end: InheritedProcessEnd;
  readonly stoppedAtBoundMs: number | undefined;
  /** True when the child's process group still answered after the sweep's last SIGKILL. */
  readonly groupNotCleared: boolean;
}

/** Everything gate-slot reads from or does to the world, injected. */
export interface GateSlotIo {
  readonly limit: GateSlotLimit;
  /** The real path of the working tree this gate runs in. */
  readonly worktree: string;
  /** Whether this host can run a gate in its own process group and signal the whole group. */
  readonly processGroups: boolean;
  readonly pid: number;
  /** The enclosing gate's slot, when this process runs inside a gate. */
  readonly heldMarker: string | undefined;
  readonly now: () => string;
  /**
   * Under the mutex, observe every slot, apply the request's verdict, and on
   * an admit keep the chosen slot, serving the request's identity line on it
   * until released.
   */
  readonly transact: (request: TransactRequest) => Promise<TransactOutcome>;
  readonly observe: () => Promise<ObserveOutcome>;
  /** Run the gated pnpm command, bounded, forwarding termination signals to it. */
  readonly runChild: (request: ChildRequest) => Promise<GateChildEnd>;
  readonly sleep: (milliseconds: number) => Promise<void>;
  readonly stdout: (line: string) => void;
  readonly stderr: (line: string) => void;
}
