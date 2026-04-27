/**
 * Value-level telemetry redaction primitives.
 *
 * @remarks
 * Thin, runtime-agnostic wrappers over this package's recursive redaction
 * policy. These primitives are the building blocks that every Sentry
 * adapter — Node today, browser under L-12 tomorrow — composes to redact
 * the fields of its own vendor-typed event shapes (`Event`, `Breadcrumb`,
 * `Exception`, `Log`, `Span`, `TransactionEvent`). This module contains
 * **no** event-shape logic; the adapters own their own event-shape wiring
 * because vendor Event types diverge between runtimes and preserving those
 * types through a shared neutral helper would require type assertions
 * forbidden by the repository's `no-type-shortcuts` rule.
 *
 * @see ../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md
 * @see ../../../.agent/rules/no-type-shortcuts.md
 *
 * @packageDocumentation
 */

import { sanitiseForJson, sanitiseObject } from './json-sanitisation.js';
import { redactHeaderValue, redactTelemetryObject, redactTelemetryValue } from './redaction.js';
import type { JsonObject } from './types.js';

/**
 * Redacts a free-text string using the shared telemetry policy.
 *
 * @param value - The string to redact. Must already be a string at the
 * boundary; callers with non-string input should use
 * {@link redactUnknownValue} instead.
 * @param key - Optional key name used to apply key-sensitive redaction
 * rules (e.g. header keys, query-parameter names).
 * @throws If the underlying policy returns a non-string — indicates a
 * violated invariant inside the recursive redaction implementation.
 */
export function redactText(value: string, key?: string): string {
  const redacted = redactTelemetryValue(value, key);

  if (typeof redacted !== 'string') {
    throw new TypeError('Expected telemetry redaction to preserve string values');
  }

  return redacted;
}

/**
 * Sanitises an unknown value into a JSON-safe form and then redacts it.
 *
 * @remarks Intended for payloads that enter at a vendor boundary with no
 * known static shape (breadcrumb `data`, event `extra`, log `params`).
 * The `unknown` input is the permitted third-party-boundary case per
 * `.agent/rules/unknown-is-type-destruction.md`.
 *
 * @example
 * ```ts
 * redactUnknownValue(\{ auth: 'Bearer abcdef' \});
 * // => \{ auth: '[REDACTED]' \}
 * ```
 */
export function redactUnknownValue(value: unknown, key?: string): unknown {
  return redactTelemetryValue(sanitiseForJson(value), key);
}

/**
 * Sanitises an unknown value, asserts it is a plain object, and redacts it.
 *
 * @returns The redacted object, or `undefined` when the input sanitises
 * to a non-object (null, scalar, array).
 *
 * @remarks `redactTelemetryObject` is closed over `JsonObject → JsonObject`
 * (string leaves may be replaced with `'[REDACTED]'` but remain strings),
 * so a single sanitise + redact is sufficient — no second normalisation
 * pass is required.
 */
export function redactJsonObject(value: unknown): JsonObject | undefined {
  const sanitised = sanitiseObject(value);

  if (!sanitised) {
    return undefined;
  }

  return redactTelemetryObject(sanitised);
}

/**
 * Redacts each value of a `Record<string, string>` using the
 * header-aware policy (sensitive header keys fully redact; partial-IP
 * headers partially redact).
 *
 * @returns A new record with each value processed; `undefined` when the
 * input is `undefined`.
 */
export function redactStringRecord(
  values: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!values) {
    return undefined;
  }

  const redacted: Record<string, string> = {};

  for (const key in values) {
    redacted[key] = redactHeaderValue(key, values[key]);
  }

  return redacted;
}
