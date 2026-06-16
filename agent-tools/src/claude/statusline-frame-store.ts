/**
 * Filesystem-backed per-session frame-counter store for the statusline logo cycle.
 *
 * @remarks
 * The I/O adapter (Layer A) behind the pure {@link FrameCounterStore} port: small
 * per-session files under an ephemeral base directory. Both sides soft-fail so
 * cosmetic state I/O never disrupts the statusline — an unreadable counter reads
 * as absent (the cycle restarts at frame 0) and a failed write is ignored (the
 * frame simply repeats next render).
 *
 * @packageDocumentation
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { frameCounterPath, type FrameCounterStore } from './statusline-logo-cycle.js';

/** Base directory for the per-session frame counters (ephemeral, cosmetic). */
export const LOGO_FRAME_STATE_DIR = join(tmpdir(), 'oak-statusline-frames');

/**
 * Construct a {@link FrameCounterStore} backed by per-session files under `baseDir`.
 *
 * @param baseDir - The directory holding per-session counter files.
 * @returns A soft-failing filesystem-backed store.
 */
export function createFsFrameStore(baseDir: string): FrameCounterStore {
  return {
    read(sessionId) {
      try {
        return readFileSync(frameCounterPath(baseDir, sessionId), 'utf8');
      } catch {
        return undefined;
      }
    },
    write(sessionId, value) {
      try {
        mkdirSync(baseDir, { recursive: true });
        writeFileSync(frameCounterPath(baseDir, sessionId), value, 'utf8');
      } catch {
        // Cosmetic frame state: a failed write just repeats this frame next render.
      }
    },
  };
}
