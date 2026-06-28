import { optional, type Options } from './cli-options.js';
import { type CliHandler } from './cli-spec-factory.js';

/**
 * Produces the current timestamp as an ISO-8601 string. Injected into the pure
 * resolvers so `--now` default-resolution is unit-testable without reading the
 * wall-clock; production composition (in {@link withResolvedNow}) supplies the
 * real clock.
 */
export type NowProvider = () => string;

/** The real-clock provider. The single quarantined `new Date()` call (F-89). */
const systemNow: NowProvider = () => new Date().toISOString();

/**
 * Resolve the `--now` value for a `claims` command (F-89).
 *
 * An explicit `--now` is honoured verbatim. Otherwise it defaults to the current
 * timestamp from `nowProvider`, so a caller need not compute and pass an ISO
 * timestamp for the common case — the F-41-class ergonomics fix applied to the
 * timestamp argument. Mirrors the default-now resolution in `cli-comms-send.ts`,
 * and the seam shape of `resolveActivePath` in `claim-active-path.ts` (F-85).
 */
export function resolveNow(options: Options, nowProvider: NowProvider = systemNow): string {
  return optional(options, 'now') ?? nowProvider();
}

/**
 * Return a copy of `options` whose `now` value is resolved per
 * {@link resolveNow}, leaving every other field untouched. Wrapping a `claims`
 * handler with this lets the handler body keep reading `required(options, 'now')`
 * unchanged while gaining the current-timestamp default.
 */
export function withNowDefault(options: Options, nowProvider: NowProvider = systemNow): Options {
  const values = new Map(options.values);
  values.set('now', resolveNow(options, nowProvider));
  return { ...options, values };
}

/**
 * Wrap a `claims` {@link CliHandler} so an omitted `--now` defaults to the
 * current timestamp before the handler runs (F-89). Mirrors `withResolvedActive`
 * in `claim-active-path.ts`: composed once at spec-wiring time, the wrapper
 * resolves the default on each invocation so the handler body stays unchanged
 * and the `new Date()` stays quarantined to the {@link systemNow} provider.
 */
export function withResolvedNow(handler: CliHandler): CliHandler {
  return (options, env, runtime) => handler(withNowDefault(options), env, runtime);
}
