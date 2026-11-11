import { isRecord } from '../rollout/record-shapes.js';

/** A record type the summary may print: an identifier-shaped word of bounded length. */
const TYPE_NAME = /^[A-Za-z_]\w{0,63}$/u;

/** A type value as the summary prints it: itself when identifier-shaped, else `other`. */
function typeName(value: unknown): string {
  return typeof value === 'string' && TYPE_NAME.test(value) ? value : 'other';
}

/**
 * The key a record is counted under: its type, then the payload's type when
 * it has one. Both are untrusted text, so a type that is not an identifier
 * counts as `other` and never reaches the summary.
 */
export function recordTypeKey(type: string, payload: unknown): string {
  const outer = typeName(type);
  return isRecord(payload) && 'type' in payload ? `${outer}.${typeName(payload.type)}` : outer;
}
