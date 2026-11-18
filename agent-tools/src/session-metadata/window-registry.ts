/**
 * Model to context-window-size registry for the session-metadata topic.
 *
 * @remarks
 * The window size is keyed on the FULL model id including any variant marker
 * (e.g. `claude-opus-4-8[1m]` is the 1M-token variant; bare `claude-opus-4-8`
 * is the 200k default). The caller supplies the model id, so variant resolution
 * is the caller's concern, not this module's — there is no transcript sniffing
 * and no heuristic here. An unknown model returns `undefined`.
 *
 * @packageDocumentation
 */

const WINDOW_REGISTRY = new Map<string, number>([
  ['claude-opus-4-8', 200_000],
  ['claude-opus-4-8[1m]', 1_000_000],
  ['claude-opus-4-7', 200_000],
  ['claude-opus-4-7[1m]', 1_000_000],
  ['claude-opus-4-6', 200_000],
  ['claude-opus-4-6[1m]', 1_000_000],
  ['claude-sonnet-4-6', 200_000],
  ['claude-sonnet-4-6[1m]', 1_000_000],
  ['claude-haiku-4-5-20251001', 200_000],
  ['claude-fable-5', 200_000],
  // Added 2026-09-16 from the model ids the transplant arc's own transcripts
  // carry (`claude-opus-5`, `claude-opus-5[1m]`, `claude-fable-5-1`); the 1M
  // variant is the one the harness names "Opus 5 (1M context)". A variant with
  // no observed id is deliberately absent: an unknown model returns `undefined`
  // and the caller is told, which is truer than a guessed window.
  ['claude-opus-5', 200_000],
  ['claude-opus-5[1m]', 1_000_000],
  // Corrected 2026-09-30: the 200k entry of 2026-09-16 was a default, not an
  // observation, and a `claude-fable-5-1` session's own transcript refuted it
  // (cache reads of 252,933 tokens with no compaction, session b3f11747). The
  // harness runs this model at the one-million-token window.
  ['claude-fable-5-1', 1_000_000],
  // Added 2026-09-24: the harness names this session's model
  // `claude-opus-5-5[1m]`, "Opus 5.5 (1M context)"; its transcripts record the
  // bare `claude-opus-5-5`, whose default window was not observed, so it stays
  // absent.
  ['claude-opus-5-5[1m]', 1_000_000],
]);

/**
 * Resolve the context-window size in tokens for a full model id.
 *
 * @param model - Full model id including any variant marker (e.g. `[1m]`).
 * @returns The window size in tokens, or `undefined` for an unknown model.
 */
export function resolveWindowTokens(model: string): number | undefined {
  return WINDOW_REGISTRY.get(model);
}
