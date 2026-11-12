import net from 'node:net';

import { delay } from '../core/delay.js';

import {
  IDENTITY_LINE_MAX_CHARS,
  parseHolderIdentity,
  type HolderIdentityLine,
} from './gate-slot-identity.js';
import type { AdmissionDecision, OccupiedSlot, SlotObservation } from './gate-slot-policy.js';
import { close, closeAll, listen, refuse } from './gate-slot-listen.js';
import type { GateSlotIo, ObserveOutcome, TransactOutcome } from './gate-slot-types.js';

/**
 * The gate slots as loopback TCP listeners. A listener is the one exclusive
 * resource Node has, without a native file lock, that the kernel releases on
 * any death of its holder, SIGKILL included, and it leaves nothing on disk
 * to go stale. A slot is held while its port is bound; the mutex port is
 * bound only while one admission decision is made, so reading every slot and
 * taking one is a single step no other acquirer can interleave with.
 *
 * @packageDocumentation
 */

/** How patiently the adapter takes the mutex and waits for a holder's answer. */
export interface GateSlotPatience {
  readonly mutexAttempts: number;
  readonly mutexRetryMs: number;
  /** Bounds only how long a probe takes: an unanswered holder blocks as if it shared the tree. */
  readonly identityTimeoutMs: number;
}

/** The production patience: about five seconds for the mutex, two for an answer. */
export const GATE_SLOT_PATIENCE: GateSlotPatience = {
  mutexAttempts: 50,
  mutexRetryMs: 100,
  identityTimeoutMs: 2000,
};

/** Which ports this adapter treats as the mutex and the slots, and its patience. */
export interface GateSlotPorts {
  readonly host: string;
  readonly mutexPort: number;
  readonly slotPorts: readonly number[];
  readonly patience: GateSlotPatience;
}

/** The adapter's two operations, as `main` consumes them. */
export type GateSlotRegistry = Pick<GateSlotIo, 'transact' | 'observe'>;

interface ProbedSlot {
  readonly observation: SlotObservation;
  readonly server: net.Server | undefined;
}

interface Failed {
  readonly kind: 'failed';
  readonly message: string;
}

type Unobserved = { readonly kind: 'mutex-busy'; readonly port: number } | Failed;

/** What a step over the probed slots returns, and the one probe listener it keeps. */
interface Settled<T> {
  readonly result: T;
  readonly kept?: net.Server;
}

/** Build the registry over the given ports. */
export function createPortRegistry(ports: GateSlotPorts): GateSlotRegistry {
  return {
    transact: async ({ identityLine, decide }) =>
      underMutex(ports, async () =>
        withProbedSlots(ports, serveIdentity(identityLine), (slots) => settle(slots, decide)),
      ),
    observe: async () => underMutex(ports, async () => withProbedSlots(ports, refuse, observeStep)),
  };
}

async function underMutex<T>(
  ports: GateSlotPorts,
  body: () => Promise<T>,
): Promise<T | Unobserved> {
  for (let attempt = 1; attempt <= ports.patience.mutexAttempts; attempt += 1) {
    const mutex = await listen(ports.host, ports.mutexPort, refuse);
    if (mutex.kind === 'failed') {
      return mutex;
    }
    if (mutex.kind === 'listening') {
      try {
        return await body();
      } finally {
        await close(mutex.server);
      }
    }
    await delay(ports.patience.mutexRetryMs);
  }

  return { kind: 'mutex-busy', port: ports.mutexPort };
}

/**
 * Probe every slot, run `step` over the observations, and close every probe
 * listener except the one the step keeps, whether it returns or throws.
 */
async function withProbedSlots<T>(
  ports: GateSlotPorts,
  onConnection: (socket: net.Socket) => void,
  step: (slots: readonly ProbedSlot[]) => Settled<T>,
): Promise<T | Failed> {
  const slots: ProbedSlot[] = [];
  let kept: net.Server | undefined;
  try {
    for (const port of ports.slotPorts) {
      const listened = await listen(ports.host, port, onConnection);
      if (listened.kind === 'failed') {
        return listened;
      }
      slots.push(
        listened.kind === 'listening'
          ? { observation: { port, state: 'free' }, server: listened.server }
          : { observation: await readAnswer(ports, port), server: undefined },
      );
    }
    const settled = step(slots);
    kept = settled.kept;
    return settled.result;
  } finally {
    await closeAll(slots.map((slot) => slot.server).filter((server) => server !== kept));
  }
}

/** Report every slot's observation and keep no listener. */
function observeStep(slots: readonly ProbedSlot[]): Settled<ObserveOutcome> {
  return { result: { kind: 'observed', slots: slots.map((slot) => slot.observation) } };
}

/** Apply the verdict: keep the admitted slot's listener, serving until released. */
function settle(
  slots: readonly ProbedSlot[],
  decide: (slots: readonly SlotObservation[]) => AdmissionDecision,
): Settled<TransactOutcome> {
  const decision = decide(slots.map((slot) => slot.observation));
  if (decision.kind === 'wait') {
    return { result: { kind: 'decided', decision, release: async () => undefined } };
  }
  const kept = slots.find((slot) => slot.observation.port === decision.port)?.server;
  if (kept === undefined) {
    return {
      result: { kind: 'failed', message: `port ${decision.port} was admitted but not bound` },
    };
  }

  return { result: { kind: 'decided', decision, release: async () => close(kept) }, kept };
}

/**
 * Ask a held slot's listener who it is. A whole identity line is a gate; an
 * answer that is not one (a foreign service, an oversize or cut-off line, a
 * reset) is foreign; no answer in time, or a refused connection (the holder
 * released between our bind and our connect), is unanswered, which blocks as
 * a same-tree holder does.
 */
function readAnswer(ports: GateSlotPorts, port: number): Promise<OccupiedSlot> {
  return new Promise((resolve) => {
    const socket = net.connect({ host: ports.host, port });
    let text = '';
    const finish = (answer: OccupiedSlot): void => {
      clearTimeout(timer);
      socket.destroy();
      resolve(answer);
    };
    const timer = setTimeout(() => {
      finish({ port, state: 'unanswered' });
    }, ports.patience.identityTimeoutMs);
    socket.setEncoding('utf8');
    socket.on('data', (chunk: string) => {
      text += chunk;
      if (text.length > IDENTITY_LINE_MAX_CHARS) {
        finish({ port, state: 'foreign' });
      }
    });
    socket.on('end', () => {
      finish(answerFrom(port, text));
    });
    socket.on('error', (error: NodeJS.ErrnoException) => {
      finish({ port, state: error.code === 'ECONNREFUSED' ? 'unanswered' : 'foreign' });
    });
  });
}

function answerFrom(port: number, text: string): OccupiedSlot {
  const identity = parseHolderIdentity(text);
  return identity === undefined
    ? { port, state: 'foreign' }
    : { port, state: 'held', holder: identity };
}

/** Write the identity line, then drop the connection, so no reader can hold a release open. */
function serveIdentity(line: HolderIdentityLine): (socket: net.Socket) => void {
  return (socket) => {
    socket.on('error', () => undefined);
    socket.end(line, () => {
      socket.destroy();
    });
  };
}
