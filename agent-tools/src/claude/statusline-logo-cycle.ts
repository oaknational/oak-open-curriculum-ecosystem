/**
 * Per-session logo-frame cycling for the Claude Code statusline.
 *
 * @remarks
 * The statusline re-runs once per render event (new assistant message, compact,
 * mode change — debounced ~300 ms) and freezes when the conversation is idle.
 * Stepping the braille-sharp cycle one frame per render therefore gives a gentle,
 * self-limiting variation that stops on idle (no autonomous motion), suppressible
 * via `OAK_STATUSLINE_MOTION`.
 *
 * "One frame per render" needs a counter that survives the stateless per-render
 * process, persisted **per session** (keyed on `session_id`) so two windows never
 * race a shared counter (a single session's statusline never runs concurrently
 * with itself — renders are debounced and in-flight runs cancelled). The counter
 * is cosmetic: losing it just resets the cycle to frame 0.
 *
 * This module is the brand- and harness-agnostic cycle engine: the pure selection
 * ({@link frameIndex}), counter parsing ({@link parseFrameCounter}), reduce-motion
 * resolution ({@link isMotionDisabled}), and the path/advance logic over an
 * injected {@link FrameCounterStore}. The store is injected (not opened here) so
 * the advance behaviour is testable with a simple in-memory fake and no IO; the
 * filesystem-backed store is constructed at the composition root (the adapter).
 * (Interim home: it migrates to the neutral `statusline/` layer with the rest of
 * the mechanism — see the statusline-logo-modularisation plan.)
 *
 * @packageDocumentation
 */

import { join } from 'node:path';

/** `OAK_STATUSLINE_MOTION` values that pin the logo to frame 0 (no cycling). */
const MOTION_OFF_VALUES: ReadonlySet<string> = new Set(['off', 'static', 'none', 'reduce']);

/**
 * A per-session counter store. The cycle engine reads the stored value and writes
 * the next one through this port; the concrete implementation (filesystem, memory)
 * is the caller's, injected so the engine stays pure and testable.
 */
export interface FrameCounterStore {
  /** The stored counter text for a session, or `undefined` when unset. */
  read(sessionId: string): string | undefined;
  /** Persist the next counter text for a session. */
  write(sessionId: string, value: string): void;
}

/**
 * Reduce a render counter to a valid frame index, wrapping modulo the frame count
 * and tolerating negative or fractional counters.
 *
 * @param count - The number of frames (must be ≥ 1).
 * @param counter - The render counter.
 * @returns An index in `[0, count)`.
 */
export function frameIndex(count: number, counter: number): number {
  if (count <= 0) {
    return 0;
  }
  const whole = Math.trunc(counter);
  return ((whole % count) + count) % count;
}

/**
 * Whether reduce-motion is requested, pinning the logo to frame 0.
 *
 * @param raw - The raw `OAK_STATUSLINE_MOTION` value (or `undefined` when unset).
 * @returns `true` for `off` / `static` / `none` / `reduce` (case-insensitive);
 *   `false` otherwise, including when unset or `auto`.
 */
export function isMotionDisabled(raw: string | undefined): boolean {
  return raw !== undefined && MOTION_OFF_VALUES.has(raw.trim().toLowerCase());
}

/**
 * Parse a stored frame counter. Any missing, non-integer, or negative value
 * resets to 0, so a corrupt counter self-heals.
 *
 * @param raw - The stored value, or `undefined` when absent.
 * @returns A non-negative integer counter.
 */
export function parseFrameCounter(raw: string | undefined): number {
  if (raw === undefined) {
    return 0;
  }
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Resolve a per-session counter filename under a base directory. The session id is
 * sanitised to a safe, bounded name so an unexpected id can never escape `baseDir`.
 *
 * @param baseDir - The directory holding per-session counter files.
 * @param sessionId - The Claude Code `session_id`.
 * @returns The counter file path.
 */
export function frameCounterPath(baseDir: string, sessionId: string): string {
  const safe = sessionId.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 128);
  return join(baseDir, safe.length > 0 ? safe : 'default');
}

/**
 * Read this session's render counter and persist the incremented value, returning
 * the counter to render.
 *
 * @param store - The injected counter store (filesystem at the composition root, a
 *   fake in tests).
 * @param sessionId - The Claude Code `session_id`.
 * @returns The counter for this render; pass it through {@link frameIndex} to pick
 *   a frame.
 */
export function readAndAdvanceFrame(store: FrameCounterStore, sessionId: string): number {
  const counter = parseFrameCounter(store.read(sessionId));
  store.write(sessionId, String(counter + 1));
  return counter;
}
