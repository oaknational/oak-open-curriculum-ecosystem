/**
 * Pure classification core of the WS7 class-tiered archive-move
 * (ADR-199 §Decision item 5 "Class tiers and windows", §"Absorption gate";
 * PDR-094 Invariants 4 + 5).
 *
 * @remarks
 * This module is the deterministic, IO-free heart of the archive-move pass. The
 * filesystem orchestration — reading events, running the provenance gate, moving
 * files, writing the manifest — lives in `archive-move.ts`; this module decides,
 * for a single event projected to its classification-relevant fields, whether the
 * event is eligible to leave the live `comms/` stream and why.
 *
 * Two invariants shape the design:
 *
 * - **The absorption gate is the single operative gate** (ADR-199 §"Absorption
 *   gate"): rotation never archive-moves an event whose disposition is not
 *   recorded — `absorbed`, `routine`, or `quarantined`. An event past its
 *   retention window with no recorded disposition stays live; it is a candidate
 *   awaiting a disposition, not a thing to move.
 * - **Title genre is never sufficient** (ADR-199 standing falsifier, event
 *   `3cc1fb93`): a `routine` disposition on an event whose body exceeds the
 *   routine-length threshold is refused unless the body was actually read. The
 *   `diagnostic-test-noise` tier is therefore never assigned automatically — it
 *   is only reachable through a body-read-confirmed `routine` disposition.
 *
 * Nothing here throws and nothing reads the clock: the caller supplies `nowMs`
 * so a pass is fully reproducible.
 *
 * @packageDocumentation
 */

/**
 * The tiers the deterministic classifier can assign from metadata alone. The
 * fourth conceptual tier, `diagnostic-test-noise`, is never inferred here — it is
 * reachable only via a body-read-confirmed `routine` disposition (see the
 * module docblock), so it has no type-level presence.
 */
export type AutoTier = 'heartbeat' | 'research-precious' | 'coordination';

/** A recorded disposition satisfying the absorption gate (ADR-199 §"Absorption gate"). */
export type RecordedDisposition = 'absorbed' | 'routine' | 'quarantined';

/** The action the pass takes for an event (surfaced structurally via {@link DispositionDecision}). */
type DispositionAction = 'archive-move' | 'keep-live' | 'blocked';

/** Why an event received its {@link DispositionAction} (typed for testability). */
export type DispositionReason =
  | 'within-window'
  | 'awaiting-disposition'
  | 'eligible-archive-move'
  | 'research-precious-unabsorbed'
  | 'heartbeat-aggregate-pending'
  | 'body-read-required'
  | 'provenance-violation'
  | 'unparseable-created-at';

/** An event projected to the fields classification needs (kind/age/tags/title/body-size). */
export interface ClassifiableEvent {
  /** 8-hex-prefixed (or full) event id; carried through to the manifest. */
  readonly eventId: string;
  /** Top-level schema discriminator. */
  readonly kind: 'narrative' | 'lifecycle' | 'directed';
  /** ISO-8601 UTC authoring timestamp (the canonical `created_at` field). */
  readonly createdAt: string;
  /** ADR-183 tag namespace (`failure-mode`, `behaviour-note`, `heartbeat`). */
  readonly tags: readonly string[];
  /** `title` for narrative/lifecycle, `subject` for directed — the heartbeat-title signal. */
  readonly titleOrSubject: string;
  /** Length of the event body in characters; drives the body-read requirement. */
  readonly bodyLength: number;
}

/** Per-tier retention windows (milliseconds) before an event becomes age-eligible. */
export interface RetentionWindows {
  /** Heartbeat tier window (ADR-199 default 48 h). */
  readonly heartbeatMs: number;
  /** Coordination-narrative + directed tier window (ADR-199 default 7 d). */
  readonly coordinationMs: number;
}

/** Gate state for a single event in a pass. */
export interface DispositionInput {
  readonly event: ClassifiableEvent;
  /** Pass clock (ms since epoch); supplied by the caller for reproducibility. */
  readonly nowMs: number;
  readonly windows: RetentionWindows;
  /** Body length above which a `routine` disposition requires a confirmed body read. */
  readonly routineBodyLengthThreshold: number;
  /** Recorded disposition for this event, or `null` when none has been recorded. */
  readonly recordedDisposition: RecordedDisposition | null;
  /** Whether the heartbeat cadence aggregate has been extracted (gates heartbeat moves). */
  readonly heartbeatAggregateExtracted: boolean;
  /** Whether this event's body was actually read (required for a `routine` move of a long body). */
  readonly bodyReadConfirmed: boolean;
  /** Whether this event is a cited-but-uncovered provenance violation (Inv-3; fail-closed). */
  readonly provenanceViolation: boolean;
}

/** The decision for a single event. */
export interface DispositionDecision {
  readonly eventId: string;
  readonly tier: AutoTier;
  readonly action: DispositionAction;
  readonly reason: DispositionReason;
  /** True when the body must be read before a `routine` disposition is legitimate. */
  readonly requiresBodyRead: boolean;
}

/** ADR-199: heartbeat events are `heartbeat`-tagged OR titled `Heartbeat:` / `Heartbeat-end:`. */
const HEARTBEAT_TITLE = /^Heartbeat(-end)?:/;

const HEARTBEAT_TAG = 'heartbeat';
const RESEARCH_PRECIOUS_TAGS: readonly string[] = ['failure-mode', 'behaviour-note'];

/**
 * Assign the structural tier from metadata alone. Returns only the three
 * auto-classifiable tiers; `diagnostic-test-noise` is never inferred here.
 *
 * Precedence: research-precious tags are tested **before** the heartbeat signal,
 * so an event tagged both `heartbeat` and `failure-mode`/`behaviour-note`
 * classifies as research-precious (moves only once absorbed) rather than as a
 * heartbeat (age-movable). Letting heartbeat win would invert the over-protect
 * invariant for events carrying real research signal.
 *
 * `behaviour-note`-tagged events are treated as `research-precious` in full: the
 * ADR's "genuine-signal subset" distinction is made at absorption time, and the
 * safe default is to over-protect (never auto-move) rather than risk moving live
 * signal.
 */
export function classifyTier(event: ClassifiableEvent): AutoTier {
  if (event.tags.some((tag) => RESEARCH_PRECIOUS_TAGS.includes(tag))) {
    return 'research-precious';
  }
  if (event.tags.includes(HEARTBEAT_TAG) || HEARTBEAT_TITLE.test(event.titleOrSubject)) {
    return 'heartbeat';
  }
  return 'coordination';
}

/** Whether an event's body is long enough that a `routine` disposition needs a body read. */
export function requiresBodyRead(
  event: ClassifiableEvent,
  routineBodyLengthThreshold: number,
): boolean {
  return event.bodyLength > routineBodyLengthThreshold;
}

/** Milliseconds since the event was authored, or `null` when `createdAt` does not parse. */
export function eventAgeMs(createdAt: string, nowMs: number): number | null {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) {
    return null;
  }
  return nowMs - created;
}

/** The {@link DispositionDecision} fields fixed before any gate runs. */
type DecisionBase = Pick<DispositionDecision, 'eventId' | 'tier' | 'requiresBodyRead'>;

/** Research-precious moves only once absorbed; it is never age-triggered. */
function decideResearchPrecious(input: DispositionInput, base: DecisionBase): DispositionDecision {
  return input.recordedDisposition === 'absorbed'
    ? { ...base, action: 'archive-move', reason: 'eligible-archive-move' }
    : { ...base, action: 'keep-live', reason: 'research-precious-unabsorbed' };
}

/**
 * Resolve an event that is past its window and carries a recorded disposition.
 * The body-read gate refuses a `routine` move of a long body that was not read
 * (the `3cc1fb93` falsifier); everything else is eligible.
 */
function decideRecorded(input: DispositionInput, base: DecisionBase): DispositionDecision {
  const bodyReadMissing =
    input.recordedDisposition === 'routine' && base.requiresBodyRead && !input.bodyReadConfirmed;
  return bodyReadMissing
    ? { ...base, action: 'blocked', reason: 'body-read-required' }
    : { ...base, action: 'archive-move', reason: 'eligible-archive-move' };
}

/** Resolve an age-triggered tier (heartbeat or coordination) through its gate chain. */
function decideAgedTier(
  input: DispositionInput,
  base: DecisionBase,
  age: number,
): DispositionDecision {
  const windowMs =
    base.tier === 'heartbeat' ? input.windows.heartbeatMs : input.windows.coordinationMs;
  if (age < windowMs) {
    return { ...base, action: 'keep-live', reason: 'within-window' };
  }
  if (base.tier === 'heartbeat' && !input.heartbeatAggregateExtracted) {
    return { ...base, action: 'blocked', reason: 'heartbeat-aggregate-pending' };
  }
  // Absorption gate: a past-window event with no recorded disposition stays live.
  if (input.recordedDisposition === null) {
    return { ...base, action: 'keep-live', reason: 'awaiting-disposition' };
  }
  return decideRecorded(input, base);
}

/**
 * Decide the disposition for a single event, applying every gate in priority
 * order. Provenance violations and unparseable timestamps fail closed
 * (`blocked`); research-precious is absorption-gated; the age-triggered tiers run
 * the window, heartbeat-aggregate, absorption, and body-read gates in turn.
 */
export function decideDisposition(input: DispositionInput): DispositionDecision {
  const { event } = input;
  const tier = classifyTier(event);
  const base: DecisionBase = {
    eventId: event.eventId,
    tier,
    requiresBodyRead: requiresBodyRead(event, input.routineBodyLengthThreshold),
  };

  if (input.provenanceViolation) {
    return { ...base, action: 'blocked', reason: 'provenance-violation' };
  }
  const age = eventAgeMs(event.createdAt, input.nowMs);
  if (age === null) {
    return { ...base, action: 'blocked', reason: 'unparseable-created-at' };
  }
  if (tier === 'research-precious') {
    return decideResearchPrecious(input, base);
  }
  return decideAgedTier(input, base, age);
}
