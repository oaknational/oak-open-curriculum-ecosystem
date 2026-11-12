/**
 * The payload read: the observer's reading of what the harness put on the
 * `PreCompact` hook's stdin.
 *
 * @remarks
 * Two layers, never widened. The fields the observer uses are validated to an
 * exact schema, one field at a time, so one mistyped field never costs the
 * others. Every other top-level key is kept as a name only, never consumed as
 * structure; the raw text itself travels beside this reading in the
 * observation.
 *
 * @packageDocumentation
 */

import { typeSafeEntries, typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';

import { isJsonObject, parseJsonTextResult, type JsonObject } from '../../core/json.js';

/** What the entry read from stdin: the text it kept, or why the read failed. */
export type StdinRead =
  | {
      readonly kind: 'read';
      /** The stdin text as kept, verbatim. */
      readonly text: string;
      /**
       * How many bytes the entry read past its cap and did not keep; absent
       * when nothing was dropped.
       */
      readonly droppedBytes?: number;
    }
  | {
      readonly kind: 'unreadable';
      /** Why the read failed. */
      readonly reason: string;
    };

/**
 * The fields the observer uses. Each is optional, because an absent field is
 * itself a finding.
 */
const usedFieldsSchema = z
  .object({
    session_id: z.string(),
    transcript_path: z.string(),
    cwd: z.string(),
    hook_event_name: z.string(),
    trigger: z.string(),
    // A bare `/compact` sends `null`: the observed contract, not the documented one.
    custom_instructions: z.string().nullable(),
  })
  .partial();

/** The used fields that validated. */
type PayloadFields = z.output<typeof usedFieldsSchema>;

/**
 * One schema per used field, so each field is validated on its own. Each
 * reads only its own key, and passes when that key is absent. Keyed by field
 * name, so a used field without its schema does not compile.
 */
const ONE_FIELD_SCHEMAS: {
  readonly [K in keyof PayloadFields]-?: z.ZodType<Pick<PayloadFields, K>>;
} = {
  session_id: usedFieldsSchema.pick({ session_id: true }),
  transcript_path: usedFieldsSchema.pick({ transcript_path: true }),
  cwd: usedFieldsSchema.pick({ cwd: true }),
  hook_event_name: usedFieldsSchema.pick({ hook_event_name: true }),
  trigger: usedFieldsSchema.pick({ trigger: true }),
  custom_instructions: usedFieldsSchema.pick({ custom_instructions: true }),
};

/** The status of one payload read. */
type PayloadStatus = 'ok' | 'empty' | 'unparseable-json' | 'schema-mismatch' | 'stdin-unreadable';

/** The observer's reading of one payload. */
export interface PayloadRead {
  /** Whether the payload read cleanly, and if not, how it failed. */
  readonly status: PayloadStatus;
  /**
   * Every top-level key name, in the order JavaScript enumerates an object's
   * keys: integer-like keys first, ascending, then the rest in payload order.
   */
  readonly topLevelKeys: readonly string[];
  /** The used fields that validated. */
  readonly fields: PayloadFields;
  /** The used fields present with the wrong type. */
  readonly mismatchedFields: readonly (keyof PayloadFields)[];
}

/**
 * Read the `PreCompact` payload.
 *
 * @param stdin - What the entry read from stdin.
 * @returns The payload's status, its top-level key names, the used fields
 *   that validated, and the names of those that did not. Never throws:
 *   every way a payload can be wrong is a status.
 */
export function readPreCompactPayload(stdin: StdinRead): PayloadRead {
  if (stdin.kind === 'unreadable') {
    return statusOnly('stdin-unreadable');
  }
  if (stdin.text.trim() === '') {
    return statusOnly('empty');
  }
  // The parse error is discarded, because its message can quote the payload.
  const parsed = parseJsonTextResult(stdin.text, 'the PreCompact payload');
  if (!parsed.ok) {
    return statusOnly('unparseable-json');
  }
  if (!isJsonObject(parsed.value)) {
    return statusOnly('schema-mismatch');
  }
  return readPayloadObject(parsed.value);
}

/**
 * Read a payload that parsed to an object: its key names, then each used
 * field on its own, keeping those that pass and naming those present with the
 * wrong type.
 */
function readPayloadObject(payload: JsonObject): PayloadRead {
  let fields: PayloadFields = {};
  const mismatchedFields: (keyof PayloadFields)[] = [];
  for (const [name, schema] of typeSafeEntries(ONE_FIELD_SCHEMAS)) {
    // Widened to the whole field set, so each field's result spreads into it.
    const oneField: z.ZodType<PayloadFields> = schema;
    const fieldRead = oneField.safeParse(payload);
    if (fieldRead.success) {
      fields = { ...fields, ...fieldRead.data };
    } else {
      mismatchedFields.push(name);
    }
  }
  return {
    status: mismatchedFields.length === 0 ? 'ok' : 'schema-mismatch',
    // The parsed object's own keys, `__proto__` included: `JSON.parse` makes
    // that key an own property, and its name is evidence.
    topLevelKeys: typeSafeKeys(payload),
    fields,
    mismatchedFields,
  };
}

/** A reading that has a status and nothing else to report. */
function statusOnly(status: PayloadStatus): PayloadRead {
  return { status, topLevelKeys: [], fields: {}, mismatchedFields: [] };
}
