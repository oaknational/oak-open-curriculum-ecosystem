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
import { homedir } from 'node:os';
import { join } from 'node:path';

import { frameCounterPath, type FrameCounterStore } from './statusline-logo-cycle.js';

/**
 * Resolve the per-user base directory for the frame counters.
 *
 * @remarks
 * Per-session counters are private, regenerable state, so they belong under the
 * user's XDG state home (`$XDG_STATE_HOME`, falling back to `~/.local/state`) —
 * **not** the shared, world-writable OS temp dir, where a predictable path is an
 * insecure-temporary-file hazard (another local user could pre-create or symlink
 * the path). The directory is created with restrictive modes by
 * {@link createFsFrameStore}.
 *
 * @param env - Environment carrying an optional `XDG_STATE_HOME` (injected so the
 *   resolution is testable without reading process-global state).
 * @param home - The user's home directory.
 * @returns The base directory for per-session frame counters.
 */
export function resolveFrameStateDir(
  env: { readonly XDG_STATE_HOME?: string },
  home: string,
): string {
  const stateHome = env.XDG_STATE_HOME ?? join(home, '.local', 'state');
  return join(stateHome, 'oak-statusline-frames');
}

/** Base directory for the per-session frame counters (ephemeral, cosmetic, per-user). */
export const LOGO_FRAME_STATE_DIR = resolveFrameStateDir(process.env, homedir());

/**
 * The narrow filesystem surface {@link createFsFrameStore} needs, injected so the
 * adapter is testable with fakes (no real IO) per ADR-078 — the test asserts the
 * restrictive modes are requested without touching a real filesystem.
 */
export interface FrameStoreFs {
  readFileSync(path: string, encoding: 'utf8'): string;
  writeFileSync(path: string, data: string, options: { encoding: 'utf8'; mode: number }): void;
  mkdirSync(path: string, options: { recursive: true; mode: number }): void;
}

/** Default surface: the real `node:fs` sync operations. */
const defaultFrameStoreFs: FrameStoreFs = { readFileSync, writeFileSync, mkdirSync };

/**
 * Construct a {@link FrameCounterStore} backed by per-session files under `baseDir`.
 *
 * @param baseDir - The directory holding per-session counter files.
 * @param fs - Filesystem surface (defaults to real `node:fs`; injected in tests).
 * @returns A soft-failing filesystem-backed store.
 */
export function createFsFrameStore(
  baseDir: string,
  fs: FrameStoreFs = defaultFrameStoreFs,
): FrameCounterStore {
  return {
    read(sessionId) {
      try {
        return fs.readFileSync(frameCounterPath(baseDir, sessionId), 'utf8');
      } catch {
        return undefined;
      }
    },
    write(sessionId, value) {
      try {
        // Owner-only modes: per-session state stays unreadable/unwritable by
        // other users even on a shared host (defence-in-depth with the per-user
        // base dir; see {@link resolveFrameStateDir}). Best-effort: the mode
        // applies only to paths this creates and is subject to umask; a
        // pre-existing looser dir is not retightened — acceptable because the
        // cross-user risk is already removed by moving off the shared temp dir.
        fs.mkdirSync(baseDir, { recursive: true, mode: 0o700 });
        fs.writeFileSync(frameCounterPath(baseDir, sessionId), value, {
          encoding: 'utf8',
          mode: 0o600,
        });
      } catch {
        // Cosmetic frame state: a failed write just repeats this frame next render.
      }
    },
  };
}
