#!/usr/bin/env node
import { realpathSync } from 'node:fs';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine } from '../core/terminal-output.js';

import {
  GATE_SLOT_HELD_ENV,
  GATE_SLOT_HOST,
  GATE_SLOT_LIMIT,
  GATE_SLOT_MUTEX_PORT,
  GATE_SLOT_PORTS,
} from './gate-slot-contract.js';
import { createGateSlotIo } from './gate-slot-io.js';
import { main } from './gate-slot-main.js';
import { GATE_SLOT_PATIENCE } from './gate-slot-ports.js';
import { GATE_CHILD_GRACE_MS, GATE_CHILD_MAX_MINUTES } from './gate-slot-schedule.js';

/**
 * The gate-slot command line, run from source under tsx so a hook never
 * depends on the build the gate itself redoes. The working tree is found by
 * walking up from this file, never from `CLAUDE_PROJECT_DIR`: a session
 * launched in one checkout carries that variable into hooks it runs in a
 * sibling worktree.
 *
 * @packageDocumentation
 */

try {
  const io = createGateSlotIo({
    ports: {
      host: GATE_SLOT_HOST,
      mutexPort: GATE_SLOT_MUTEX_PORT,
      slotPorts: GATE_SLOT_PORTS,
      patience: GATE_SLOT_PATIENCE,
    },
    worktree: realpathSync.native(resolveRepoRoot(import.meta.url, { projectDir: undefined })),
    limit: GATE_SLOT_LIMIT,
    heldMarker: process.env[GATE_SLOT_HELD_ENV],
    childCommand: 'pnpm',
    childMaxMs: GATE_CHILD_MAX_MINUTES * 60_000,
    childGraceMs: GATE_CHILD_GRACE_MS,
    platform: process.platform,
  });
  // process.exitCode, never process.exit(): exit() can cut off piped output.
  process.exitCode = await main(process.argv.slice(2), io);
} catch (error: unknown) {
  writeErrorLine(`gate-slot: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
