/**
 * Pseudonym-keyring parsing.
 *
 * @remarks
 * Four independent guards run in order and the failure distinguishes them,
 * because collapsing them into one opaque message cost about an hour of
 * guesswork during a live incident (MCP-480): JSON parsing, the strict wire
 * shape, base64url canonicality, and id/key-material uniqueness. This
 * module decides WHICH guard refused and gathers the safe shape facts;
 * `product-analytics-keyring-diagnostics.ts` owns the rules and what that
 * refusal says. No supplied value crosses between them.
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { err, ok, type Result } from '@oaknational/result';
import {
  KEY_BYTES,
  KEY_CHARACTERS,
  KEY_ID_PATTERN,
  type KeyringEntryPosition,
  type KeyringField,
  type KeyringGuardFailure,
  type KeyringShapeDetail,
} from './product-analytics-keyring-diagnostics.js';

/** One decoded, app-owned key version parsed from the deployment keyring. */
export interface ProductAnalyticsKeyringEntry {
  /** Non-secret rotation label; part of derived distinct IDs. */
  readonly id: string;
  /** Exactly 32 bytes of decoded key material, freshly copied per resolution. */
  readonly key: Uint8Array;
}

const CANONICAL_BASE64URL_KEY = new RegExp(`^[A-Za-z0-9_-]{${KEY_CHARACTERS}}$`, 'u');

/**
 * Strict wire shape of one keyring record: exactly `id` and `key`, an id
 * satisfying the adapter's key-id contract, and a key whose length and
 * alphabet match an unpadded base64url encoding of 32 bytes. Canonicality
 * (re-encoding byte-for-byte) still needs the decode step below — the
 * pattern alone cannot see the final character's padding bits.
 */
const KeyringEntryWireSchema = z.strictObject({
  id: z.string().regex(KEY_ID_PATTERN),
  key: z.string().regex(CANONICAL_BASE64URL_KEY),
});

const KeyringWireSchema = z.array(KeyringEntryWireSchema).min(1);

/**
 * Schema-typed views over the already-parsed JSON, used only to read safe
 * shape facts back out of it. Reading through a schema rather than
 * `Array.isArray` keeps the walk assertion-free.
 */
const ArrayViewSchema = z.array(z.unknown());
const RecordViewSchema = z.record(z.string(), z.unknown());

function isKeyringField(value: PropertyKey): value is KeyringField {
  return value === 'id' || value === 'key';
}

function entryCountOf(parsed: unknown): number | undefined {
  const view = ArrayViewSchema.safeParse(parsed);
  return view.success ? view.data.length : undefined;
}

function stringLengthAt(
  parsed: unknown,
  entryIndex: number,
  field: KeyringField,
): number | undefined {
  const list = ArrayViewSchema.safeParse(parsed);
  const entry = RecordViewSchema.safeParse(list.success ? list.data[entryIndex] : undefined);
  const value = entry.success ? entry.data[field] : undefined;
  return typeof value === 'string' ? value.length : undefined;
}

/**
 * Classify a per-field issue.
 *
 * @remarks The discriminator is whether a readable string is present at
 * that field: with one, the value broke a rule and its LENGTH is the safe
 * fact worth reporting; without one, the field is absent or not a string.
 * Deriving it this way rather than from the issue code means there is no
 * unreachable fallback for a length that could not be measured.
 */
function classifyFieldIssue(
  parsed: unknown,
  entry: KeyringEntryPosition,
  field: KeyringField,
): KeyringShapeDetail {
  const length = stringLengthAt(parsed, entry.index, field);

  return length === undefined
    ? { kind: 'field_absent', entry, field }
    : { kind: 'field_rule', entry, field, length };
}

function classifyEntryIssue(
  issue: z.core.$ZodIssue,
  parsed: unknown,
  entry: KeyringEntryPosition,
): KeyringShapeDetail {
  const [, field] = issue.path;

  if (field === undefined) {
    return issue.code === 'unrecognized_keys'
      ? { kind: 'unrecognised_properties', entry, count: issue.keys.length }
      : { kind: 'entry_not_object', entry };
  }

  return isKeyringField(field)
    ? classifyFieldIssue(parsed, entry, field)
    : { kind: 'entry_not_object', entry };
}

/**
 * Translate the first strict-shape issue into safe shape facts.
 *
 * @remarks Branches on the issue's PATH wherever it can rather than on its
 * vocabulary, so a Zod issue-code rename cannot silently reclassify a
 * guard; where a code is consulted, every degradation is safe (to
 * `entry_not_object`, `not_array`, or `field_absent`) and none can leak a
 * value or throw. Only the path, the field name, a count, and a string
 * LENGTH cross this boundary — never a value, never a property name.
 */
function classifyShapeFailure(
  issues: readonly z.core.$ZodIssue[],
  parsed: unknown,
): KeyringShapeDetail {
  const [issue] = issues;

  if (!issue) {
    return { kind: 'not_array' };
  }

  const [entryIndex] = issue.path;
  const entryCount = entryCountOf(parsed);

  if (typeof entryIndex !== 'number' || entryCount === undefined) {
    return issue.code === 'too_small' ? { kind: 'empty' } : { kind: 'not_array' };
  }

  return classifyEntryIssue(issue, parsed, { index: entryIndex, of: entryCount });
}

function decodeCanonicalKey(key: string): Uint8Array | undefined {
  const decoded = Buffer.from(key, 'base64url');
  // The length guard is belt-and-braces behind the wire regex; the
  // re-encode check is the live rule, rejecting non-canonical padding bits.
  if (decoded.length !== KEY_BYTES || decoded.toString('base64url') !== key) {
    return undefined;
  }
  return Uint8Array.from(decoded);
}

function firstRepeat(
  seenIds: ReadonlyMap<string, number>,
  seenKeyMaterial: ReadonlyMap<string, number>,
  id: string,
  material: string,
): { readonly repeated: KeyringField; readonly firstIndex: number } | undefined {
  const firstIdIndex = seenIds.get(id);

  if (firstIdIndex !== undefined) {
    return { repeated: 'id', firstIndex: firstIdIndex };
  }

  const firstKeyIndex = seenKeyMaterial.get(material);

  return firstKeyIndex === undefined ? undefined : { repeated: 'key', firstIndex: firstKeyIndex };
}

function decodeUniqueKeyring(
  wire: readonly z.output<typeof KeyringEntryWireSchema>[],
): Result<readonly ProductAnalyticsKeyringEntry[], KeyringGuardFailure> {
  const entries: ProductAnalyticsKeyringEntry[] = [];
  const seenIds = new Map<string, number>();
  const seenKeyMaterial = new Map<string, number>();
  const of = wire.length;

  for (const [index, { id, key }] of wire.entries()) {
    const decoded = decodeCanonicalKey(key);

    if (decoded === undefined) {
      return err({ guard: 'canonicality', entry: { index, of } });
    }

    const material = Buffer.from(decoded).toString('hex');
    const repeat = firstRepeat(seenIds, seenKeyMaterial, id, material);

    if (repeat) {
      return err({ guard: 'uniqueness', entry: { index, of }, ...repeat });
    }

    seenIds.set(id, index);
    seenKeyMaterial.set(material, index);
    entries.push({ id, key: decoded });
  }

  return ok(entries);
}

/**
 * Parse the deployment keyring, naming whichever guard refuses.
 *
 * @param raw - The raw `POSTHOG_PSEUDONYM_KEYRING` value.
 * @returns The decoded keyring, or the guard that refused with its safe
 * shape facts. The raw value never survives into the failure.
 */
export function parseKeyring(
  raw: string,
): Result<readonly ProductAnalyticsKeyringEntry[], KeyringGuardFailure> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return err({ guard: 'json' });
  }

  const wire = KeyringWireSchema.safeParse(parsed);

  if (!wire.success) {
    return err({ guard: 'shape', detail: classifyShapeFailure(wire.error.issues, parsed) });
  }

  return decodeUniqueKeyring(wire.data);
}
