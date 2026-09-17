import { err, isErr, ok, type Result } from '@oaknational/result';
import { typeSafeGet, typeSafeKeys } from '@oaknational/type-helpers';

import { EstateReviewError } from './errors.js';
import { compareUtf16 } from './utf16-order.js';

const INDENT = '  ';
type JsonObjectCandidate = Readonly<Record<PropertyKey, unknown>>;
type JsonComposite = readonly unknown[] | JsonObjectCandidate;

/**
 * Render canonical JSON without reconstructing objects.
 *
 * Reconstructing a sorted object and passing it to `JSON.stringify` is not
 * sufficient: JavaScript enumerates integer-like object keys numerically. A
 * recursive text renderer preserves the required UTF-16 code-unit ordering.
 */
export function serialiseCanonicalJson(
  value: unknown,
  maxBytes: number,
): Result<Uint8Array, EstateReviewError> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    return err(
      new EstateReviewError(
        'CONFIG_INVALID',
        'maxSerializedOutputBytes must be a positive safe integer',
      ),
    );
  }

  const rendered = invokeRenderer(() => renderJson(value, 0, new WeakSet<JsonComposite>(), '$'));
  if (isErr(rendered)) {
    return rendered;
  }

  const bytes = new TextEncoder().encode(`${rendered.value}\n`);
  if (bytes.byteLength > maxBytes) {
    return err(
      new EstateReviewError(
        'RESOURCE_LIMIT',
        `serialized output is ${String(bytes.byteLength)} bytes, exceeding limit ${String(maxBytes)}`,
      ),
    );
  }
  return ok(bytes);
}

/** Compatibility alias for publication callers; use serialiseCanonicalJson. */
export function canonicalJsonBytes(
  value: unknown,
  maxBytes: number,
): Result<Uint8Array, EstateReviewError> {
  return serialiseCanonicalJson(value, maxBytes);
}

function renderJson(
  value: unknown,
  depth: number,
  ancestors: WeakSet<JsonComposite>,
  location: string,
): Result<string, EstateReviewError> {
  if (value === null) {
    return ok('null');
  }
  if (typeof value === 'string') {
    return ok(JSON.stringify(value));
  }
  if (typeof value === 'boolean') {
    return ok(String(value));
  }
  if (typeof value === 'number') {
    return renderNumber(value, location);
  }
  if (isJsonComposite(value)) {
    return renderComposite(value, depth, ancestors, location);
  }
  return err(
    new EstateReviewError(
      'VALIDATION_FAILED',
      `${location} contains unsupported ${typeof value} value`,
    ),
  );
}

function renderNumber(value: number, location: string): Result<string, EstateReviewError> {
  return Number.isFinite(value)
    ? ok(JSON.stringify(value))
    : err(new EstateReviewError('VALIDATION_FAILED', `${location} contains a non-finite number`));
}

function renderComposite(
  value: JsonComposite,
  depth: number,
  ancestors: WeakSet<JsonComposite>,
  location: string,
): Result<string, EstateReviewError> {
  if (ancestors.has(value)) {
    return err(new EstateReviewError('VALIDATION_FAILED', `${location} contains a JSON cycle`));
  }
  ancestors.add(value);
  const rendered = isJsonArray(value)
    ? renderArray(value, depth, ancestors, location)
    : renderObject(value, depth, ancestors, location);
  ancestors.delete(value);
  return rendered;
}

function renderArray(
  value: readonly unknown[],
  depth: number,
  ancestors: WeakSet<JsonComposite>,
  location: string,
): Result<string, EstateReviewError> {
  const members: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    if (!(index in value)) {
      return err(
        new EstateReviewError('VALIDATION_FAILED', `${location}[${String(index)}] is sparse`),
      );
    }
    const member = renderJson(value[index], depth + 1, ancestors, `${location}[${String(index)}]`);
    if (isErr(member)) {
      return member;
    }
    members.push(`${indent(depth + 1)}${member.value}`);
  }
  return ok(renderCollection('[', ']', members, depth));
}

function renderObject(
  value: JsonObjectCandidate,
  depth: number,
  ancestors: WeakSet<JsonComposite>,
  location: string,
): Result<string, EstateReviewError> {
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return err(
      new EstateReviewError('VALIDATION_FAILED', `${location} is not a plain JSON object`),
    );
  }

  const keys = enumerableStringKeys(value);
  if (isErr(keys)) {
    return keys;
  }
  const members: string[] = [];
  for (const key of keys.value.sort(compareUtf16)) {
    const member = readAndRenderMember(value, key, depth, ancestors, `${location}.${key}`);
    if (isErr(member)) {
      return member;
    }
    members.push(`${indent(depth + 1)}${JSON.stringify(key)}: ${member.value}`);
  }
  return ok(renderCollection('{', '}', members, depth));
}

function enumerableStringKeys(value: JsonObjectCandidate): Result<string[], EstateReviewError> {
  if (Object.getOwnPropertySymbols(value).length > 0) {
    return err(new EstateReviewError('VALIDATION_FAILED', '$ contains symbol keys'));
  }
  return ok(typeSafeKeys(value));
}

function readAndRenderMember(
  value: JsonObjectCandidate,
  key: string,
  depth: number,
  ancestors: WeakSet<JsonComposite>,
  location: string,
): Result<string, EstateReviewError> {
  try {
    return renderJson(typeSafeGet(value, key), depth + 1, ancestors, location);
  } catch (cause: unknown) {
    return err(new EstateReviewError('VALIDATION_FAILED', `${location} cannot be read`, { cause }));
  }
}

function renderCollection(
  opening: '[' | '{',
  closing: ']' | '}',
  members: readonly string[],
  depth: number,
): string {
  return members.length === 0
    ? `${opening}${closing}`
    : `${opening}\n${members.join(',\n')}\n${indent(depth)}${closing}`;
}

function indent(depth: number): string {
  return INDENT.repeat(depth);
}

function isJsonComposite(value: unknown): value is JsonComposite {
  return value !== null && typeof value === 'object';
}

function isJsonArray(value: JsonComposite): value is readonly unknown[] {
  return Array.isArray(value);
}

function invokeRenderer(
  operation: () => Result<string, EstateReviewError>,
): Result<string, EstateReviewError> {
  try {
    return operation();
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('VALIDATION_FAILED', 'canonical JSON serialisation failed', { cause }),
    );
  }
}
