/**
 * The version of the probe's contract: its verdict over the rules, and the
 * calls it makes that no dialogue makes. A pass record carries the version
 * that judged it, and the gate opens only on a record judged by this one, so
 * a fix to the probe invalidates every record the old probe wrote.
 *
 * Raise it with every change to the probe's verdict or to its probe-only
 * calls. A missed raise is bounded by the pass record's age limit.
 */
export const PROBE_CONTRACT_VERSION = 1;
