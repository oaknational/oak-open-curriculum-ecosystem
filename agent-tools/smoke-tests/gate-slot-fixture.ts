import { z } from 'zod';

import {
  GATE_SLOT_HOST,
  GATE_SLOT_MUTEX_PORT,
  GATE_SLOT_PORTS,
} from '../src/gate-slot/gate-slot-contract';
import { createGateSlotIo } from '../src/gate-slot/gate-slot-io';
import { main } from '../src/gate-slot/gate-slot-main';

/**
 * A gate-slot wrapper process on private resources, for the gate-slot
 * smokes. It composes the real adapters exactly as the entry point does, over
 * the ports, tree, limit, patience and child bound the smoke passes as one
 * JSON argument, with no held marker. Two things differ from production, and
 * neither is what the smokes prove: the child runner launches the running
 * Node binary or /bin/sh in place of pnpm, so a gate child starts in
 * milliseconds, and a blocked gate polls every 200 ms instead of every five
 * seconds. It refuses the real gate ports, so it can never stand in for a
 * gate. The package script, the CLI and the hook cannot reach this file.
 *
 * Arguments: the JSON configuration, then the gate-slot arguments.
 */

const FIXTURE_POLL_MS = 200;

const REAL_PORTS: ReadonlySet<number> = new Set([GATE_SLOT_MUTEX_PORT, ...GATE_SLOT_PORTS]);

const privatePort = z
  .number()
  .int()
  .refine((port) => !REAL_PORTS.has(port), 'the fixture never binds a real gate port');

const FixtureConfigSchema = z.object({
  mutexPort: privatePort,
  slotPorts: z.array(privatePort),
  worktree: z.string().min(1),
  limit: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  child: z.enum(['node', 'sh']),
  childMaxMs: z.number().int().positive(),
  childGraceMs: z.number().int().positive(),
  mutexAttempts: z.number().int().positive(),
  identityTimeoutMs: z.number().int().positive(),
});

const [configText = '', ...gateSlotArgv] = process.argv.slice(2);
const config = FixtureConfigSchema.parse(JSON.parse(configText));
const io = createGateSlotIo({
  ports: {
    host: GATE_SLOT_HOST,
    mutexPort: config.mutexPort,
    slotPorts: config.slotPorts,
    patience: {
      mutexAttempts: config.mutexAttempts,
      mutexRetryMs: 50,
      identityTimeoutMs: config.identityTimeoutMs,
    },
  },
  worktree: config.worktree,
  limit: config.limit,
  heldMarker: undefined,
  childCommand: config.child === 'sh' ? '/bin/sh' : process.execPath,
  childMaxMs: config.childMaxMs,
  childGraceMs: config.childGraceMs,
  platform: process.platform,
});

process.exitCode = await main(gateSlotArgv, {
  ...io,
  sleep: async () =>
    new Promise((resolve) => {
      setTimeout(resolve, FIXTURE_POLL_MS);
    }),
});
