/**
 * `@oaknational/telemetry-redaction-core`
 *
 * Runtime-agnostic, browser-safe telemetry redaction primitives composed
 * by every Sentry adapter in the Oak stack (Node today, browser under
 * L-12 tomorrow).
 *
 * @remarks
 * **Zero `@sentry/*` dependencies.** This workspace is the single source
 * of truth for *value-level* telemetry redaction — the primitives that
 * normalise and redact strings, JSON objects, header records, and
 * arbitrary unknown payloads before they leave any observability
 * fan-out. It does **not** own event-shape redaction (`Event`,
 * `Breadcrumb`, `Exception`, …); each vendor adapter composes these
 * primitives onto its own vendor-typed event shapes because preserving
 * those types through a shared neutral helper would require type
 * assertions forbidden by the repository's type-discipline rules.
 *
 * @see ../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md
 * @see ../../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md
 *
 * @packageDocumentation
 */

export {
  describeUnknownError,
  redactJsonObject,
  redactStringRecord,
  redactText,
  redactUnknownValue,
} from './primitives.js';
