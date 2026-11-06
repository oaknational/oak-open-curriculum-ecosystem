import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/**
 * The fields a pass record shares with the binding. A field defined here is
 * one the gate compares; a field only the record carries belongs in the
 * record's extension below, so where a field is defined decides its role.
 */
const bindingSchema = z.strictObject({
  /** The version the probe passed on, as the binary reports it. */
  cliVersion: z.string().min(1),
  /** The resolved real path of the binary the probe passed on. */
  executablePath: z.string().min(1),
  /** The envelope's digest when the probe passed: 64 lowercase hex characters. */
  envelopeDigest: z.string().regex(/^[0-9a-f]{64}$/),
  /** The version of the probe's contract that judged the binding. */
  probeContractVersion: z.number().int().positive(),
});

/** The exact shape of a pass record: the binding, plus what only the record carries. */
const passRecordSchema = bindingSchema.extend({
  /** When the probe passed, as an ISO 8601 date-time. */
  passedAt: z.iso.datetime(),
  /** The probe's verbatim evidence lines. Untrusted text, for the record only. */
  evidence: z.array(z.string()).min(1).readonly(),
});

/**
 * The machine-local record a passing probe writes: which Codex binary, on
 * which version, passed with which envelope, judged by which version of the
 * probe's contract, when, and the verbatim evidence. The gate opens a
 * dialogue only on a record matching the current binding and inside its age
 * limit. It guards against drift, not attack: any process running as the
 * user can write it.
 */
export type PassRecord = Readonly<z.infer<typeof passRecordSchema>>;

/**
 * The binding a dialogue would run on now: the resolved binary's version and
 * real path, the current envelope's digest, and the current probe contract.
 */
export type Binding = Readonly<z.infer<typeof bindingSchema>>;

/**
 * The fields the gate compares, exactly those the binding schema defines.
 * The gate trusts this list as the whole comparison, so it is a frozen copy,
 * readonly in type: zod types an enum's `options` as a mutable array, and an
 * importer that shortened it would open the gate on any record.
 */
export const BINDING_FIELDS = Object.freeze([...bindingSchema.keyof().options]);

/**
 * Why a value is not a pass record. It carries no detail, because the
 * detail would quote the file's own text.
 */
export interface PassRecordInvalid {
  readonly kind: 'invalid';
}

/**
 * Accept a value only when it is exactly a pass record: every field present
 * and valid, and no field the record does not define.
 *
 * @param value - The parsed contents of the record file, of unknown shape.
 */
export function parsePassRecord(value: unknown): Result<PassRecord, PassRecordInvalid> {
  if (hasOwnPrototypeKey(value)) {
    return err({ kind: 'invalid' });
  }
  const parsed = passRecordSchema.safeParse(value);
  return parsed.success ? ok(parsed.data) : err({ kind: 'invalid' });
}

/**
 * `JSON.parse` keeps a `"__proto__"` key as an own field, which the schema
 * would drop without a word. The record defines no such field, so a value
 * carrying one is refused.
 */
function hasOwnPrototypeKey(value: unknown): boolean {
  return typeof value === 'object' && value !== null && Object.hasOwn(value, '__proto__');
}
