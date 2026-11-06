import { err, ok, type Result } from '@oaknational/result';

import { BINDING_FIELDS, parsePassRecord, type Binding, type PassRecord } from './pass-record.js';

/**
 * Why the IO edge would not read the record file, in the edge's own terms.
 * A closed set, never the file's text, since a parser's message can quote
 * the file, and the file holds the interlocutor's untrusted evidence.
 */
export type PassRecordRejection =
  | 'not-a-regular-file'
  | 'not-owned-by-user'
  | 'writable-by-others'
  | 'over-size-cap'
  | 'not-json'
  | 'unreadable';

/**
 * What the IO edge found where the pass record lives: nothing, a file it
 * would not read, or the parsed contents of one it did. A present value
 * carries the record's evidence, untrusted interlocutor text, so a read is
 * never logged.
 */
export type PassRecordRead =
  | { readonly kind: 'absent' }
  | { readonly kind: 'rejected'; readonly reason: PassRecordRejection }
  | { readonly kind: 'present'; readonly value: unknown };

type BindingField = (typeof BINDING_FIELDS)[number];

/**
 * The `codex` binary as resolved once for a call: the version it reports and
 * its real path, named as the pass record names them. One resolution serves
 * the gate, the spawn and, for the probe, the record it writes, so an updater
 * swapping the release link mid-call cannot split them.
 */
export type ResolvedBinary = Pick<Binding, 'cliVersion' | 'executablePath'>;

/**
 * How long a pass record keeps opening dialogues after its probe passed:
 * seven days, about the vendor's release cadence. The binding cannot see a
 * change the vendor makes server-side under the same version, so a record
 * past this age asks for a fresh probe.
 */
export const PASS_RECORD_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Why a well-formed record is outside its age limit: past it, dated after
 * now, or of an age that could not be measured, such as against a clock that
 * reads as an invalid date.
 */
type AgeRefusal =
  | { readonly kind: 'pass-record-expired' }
  | { readonly kind: 'pass-record-from-the-future' }
  | { readonly kind: 'pass-record-age-unmeasured' };

/**
 * Why the gate's first phase refused: no record, a record file the edge
 * would not read, a value that is not a pass record, or a record outside its
 * age limit.
 */
export type RecordRefusal =
  | { readonly kind: 'no-pass-record' }
  | { readonly kind: 'pass-record-rejected'; readonly reason: PassRecordRejection }
  | { readonly kind: 'invalid-pass-record' }
  | AgeRefusal;

/**
 * Why the gate's second phase refused: the record was written for another
 * binding. Every differing field is named.
 */
export interface BindingMismatch {
  readonly kind: 'binding-mismatch';
  readonly fields: readonly [BindingField, ...BindingField[]];
}

/**
 * Why the gate stays shut. Each refusal tells the seat to run the probe;
 * none names the record's own text.
 */
export type GateRefusal = RecordRefusal | BindingMismatch;

/**
 * The gate's first phase: admit the pass record the edge read, or refuse.
 * It needs nothing about the binary, so it runs before the binary is
 * resolved, and a record past its age asks for a probe as an absent one does.
 *
 * @param read - What the IO edge found where the record lives.
 * @param now - The current time, which the record's age is measured against.
 */
export function admitRecord(read: PassRecordRead, now: Date): Result<PassRecord, RecordRefusal> {
  if (read.kind === 'absent') {
    return err({ kind: 'no-pass-record' });
  }
  if (read.kind === 'rejected') {
    return err({ kind: 'pass-record-rejected', reason: read.reason });
  }
  const record = parsePassRecord(read.value);
  if (!record.ok) {
    return err({ kind: 'invalid-pass-record' });
  }
  return withinAgeLimit(record.value, now);
}

/**
 * Admit a record only inside its age limit: passed no later than now, and
 * no longer ago than the limit. An age that is not a finite number is
 * refused, since neither comparison below would hold for it.
 */
function withinAgeLimit(record: PassRecord, now: Date): Result<PassRecord, AgeRefusal> {
  const age = now.getTime() - Date.parse(record.passedAt);
  if (!Number.isFinite(age)) {
    return err({ kind: 'pass-record-age-unmeasured' });
  }
  if (age < 0) {
    return err({ kind: 'pass-record-from-the-future' });
  }
  if (age > PASS_RECORD_MAX_AGE_MS) {
    return err({ kind: 'pass-record-expired' });
  }
  return ok(record);
}

/**
 * The gate's second phase: open only when the record was written for exactly
 * this binding. A CLI update, a different binary, an envelope change or a new
 * probe contract each demands a fresh probe.
 *
 * @param record - The admitted pass record.
 * @param binding - The binding the dialogue would run on now.
 */
export function matchBinding(record: PassRecord, binding: Binding): Result<void, BindingMismatch> {
  const fields = BINDING_FIELDS.filter((field) => record[field] !== binding[field]);
  return isNonEmpty(fields) ? err({ kind: 'binding-mismatch', fields }) : ok(undefined);
}

function isNonEmpty<T>(items: readonly T[]): items is readonly [T, ...T[]] {
  return items.length > 0;
}
