/**
 * The pseudonym-keyring rules, and what each guard says when it refuses.
 *
 * @remarks
 * The keyring carries actor-projection key material, so the governing rule
 * for every message here is **name the guard, never the value**: a failure
 * says which check refused and the safe shape facts around it — entry
 * count, entry index, field name, a length — and never a supplied id, key,
 * unrecognised property name, or the raw keyring text.
 *
 * The failure types are shaped so that rule holds by construction: there is
 * no field on {@link KeyringGuardFailure} a value could travel in, and
 * every position carries its own entry count so no rendering path needs a
 * fallback for a count it cannot have.
 *
 * The RULES live here beside the prose that describes them, so an operator
 * can never be told a rule the code does not enforce.
 *
 * @packageDocumentation
 */

import type { productAnalyticsEnvFields } from './env-product-analytics.js';

/**
 * The environment variable these guards speak about.
 *
 * @remarks `satisfies` locks the literal to the env schema's own key, so
 * renaming the variable is a compile error here rather than a message
 * naming a variable nobody sets.
 */
const KEYRING_ENV_KEY =
  'POSTHOG_PSEUDONYM_KEYRING' satisfies keyof typeof productAnalyticsEnvFields;

/** Bytes of key material per keyring entry. */
export const KEY_BYTES = 32;

/**
 * Characters in an unpadded base64url encoding of {@link KEY_BYTES}.
 *
 * @remarks Derived, not transcribed, so a change to the key size cannot
 * leave a stale character count in either the rule or its prose.
 */
export const KEY_CHARACTERS = Math.ceil((KEY_BYTES * 8) / 6);

/**
 * The adapter's binding key-id contract, mirrored from
 * `@oaknational/posthog-node`'s `actor-pseudonym.ts` `KEY_ID_PATTERN` (not
 * exported there). Enforcing it here makes an id the adapter would reject a
 * boot failure at this resolver rather than a later content-free
 * composition failure; if the two ever diverge, the adapter's own
 * validation still refuses at composition.
 *
 * It sits beside {@link KEY_ID_RULE}, its prose, because a rule and its
 * description drifting apart is how an operator gets told to do something
 * the guard will still refuse.
 */
export const KEY_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/u;

const KEY_ID_RULE =
  '1 to 32 characters of lowercase letters, digits, "_" or "-", starting with a letter or digit';

/** The two fields a keyring record carries. */
export type KeyringField = 'id' | 'key';

/**
 * Where in the keyring a guard refused.
 *
 * @remarks Index and count travel together deliberately: an entry position
 * only exists once the value parsed as an array, so a position can never
 * be reported without the count that gives it meaning.
 */
export interface KeyringEntryPosition {
  readonly index: number;
  readonly of: number;
}

/** Which strict-shape rule refused, with only safe shape facts. */
export type KeyringShapeDetail =
  | { readonly kind: 'not_array' }
  | { readonly kind: 'empty' }
  | { readonly kind: 'entry_not_object'; readonly entry: KeyringEntryPosition }
  | {
      readonly kind: 'unrecognised_properties';
      readonly entry: KeyringEntryPosition;
      readonly count: number;
    }
  | {
      readonly kind: 'field_absent';
      readonly entry: KeyringEntryPosition;
      readonly field: KeyringField;
    }
  | {
      readonly kind: 'field_rule';
      readonly entry: KeyringEntryPosition;
      readonly field: KeyringField;
      readonly length: number;
    };

/**
 * Which of the four keyring guards refused.
 *
 * @remarks Every member carries shape facts only. No supplied value is
 * representable here.
 */
export type KeyringGuardFailure =
  | { readonly guard: 'json' }
  | { readonly guard: 'shape'; readonly detail: KeyringShapeDetail }
  | { readonly guard: 'canonicality'; readonly entry: KeyringEntryPosition }
  | {
      readonly guard: 'uniqueness';
      readonly entry: KeyringEntryPosition;
      readonly repeated: KeyringField;
      readonly firstIndex: number;
    };

function entryLabel(entry: KeyringEntryPosition): string {
  return `entry ${entry.index} of ${entry.of}`;
}

function describeFieldDetail(
  detail: Extract<KeyringShapeDetail, { readonly kind: 'field_absent' | 'field_rule' }>,
): string {
  const label = entryLabel(detail.entry);

  if (detail.kind === 'field_absent') {
    return `${KEYRING_ENV_KEY} ${label} has no string "${detail.field}". Each record carries exactly "id" and "key", both strings.`;
  }

  if (detail.field === 'id') {
    return `${KEYRING_ENV_KEY} ${label} has an "id" outside the key-id rule: ${KEY_ID_RULE}.`;
  }

  return `${KEYRING_ENV_KEY} ${label} has a "key" of ${detail.length} characters; it must be exactly ${KEY_CHARACTERS} unpadded base64url characters — ${KEY_BYTES} bytes of key material, alphabet A-Z a-z 0-9 - _, no "=" padding.`;
}

function describeShapeDetail(detail: KeyringShapeDetail): string {
  switch (detail.kind) {
    case 'not_array':
      return `${KEYRING_ENV_KEY} must be a JSON array of key records.`;
    case 'empty':
      return `${KEYRING_ENV_KEY} must hold at least one key record.`;
    case 'entry_not_object':
      return `${KEYRING_ENV_KEY} ${entryLabel(detail.entry)} must be an object with exactly the properties "id" and "key".`;
    case 'unrecognised_properties': {
      const plural = detail.count === 1 ? 'y' : 'ies';
      return `${KEYRING_ENV_KEY} ${entryLabel(detail.entry)} carries ${detail.count} unrecognised propert${plural}. Each record carries exactly "id" and "key".`;
    }
    default:
      return describeFieldDetail(detail);
  }
}

function describeUniqueness(
  failure: Extract<KeyringGuardFailure, { readonly guard: 'uniqueness' }>,
): string {
  const label = entryLabel(failure.entry);
  const subject = failure.repeated === 'id' ? 'the "id"' : 'the key material';
  const noun = failure.repeated === 'id' ? 'id' : 'key';
  return `${KEYRING_ENV_KEY} ${label} repeats ${subject} of entry ${failure.firstIndex}. Every ${noun} in the keyring must be distinct.`;
}

/**
 * Render a keyring guard failure as an operator-facing sentence.
 *
 * @param failure - The guard that refused, with its shape facts.
 * @returns A message naming the variable, the guard, and how to fix it.
 * Never contains a supplied value.
 */
export function describeKeyringFailure(failure: KeyringGuardFailure): string {
  switch (failure.guard) {
    case 'json':
      return `${KEYRING_ENV_KEY} is not valid JSON. It must be a JSON array of {"id","key"} records; a truncated value or unescaped quotes are the usual causes.`;
    case 'shape':
      return describeShapeDetail(failure.detail);
    case 'canonicality':
      return `${KEYRING_ENV_KEY} ${entryLabel(failure.entry)} has a non-canonical base64url "key": its ${KEY_CHARACTERS} characters decode to ${KEY_BYTES} bytes that re-encode differently, so the final character carries non-zero padding bits. Re-encode the ${KEY_BYTES}-byte key with unpadded base64url.`;
    default:
      return describeUniqueness(failure);
  }
}
