import { defaultGraph, literal, namedNode, quad } from '@oaknational/graph-core/data-factory';
import { describe, expect, it } from 'vitest';

import {
  jsonPointer,
  parseSegments,
  quadKey,
  serialiseSegments,
  type JsonPointer,
} from './index.js';

describe('jsonPointer (RFC 6901 validator)', () => {
  // Each row is an RFC 6901 case selected for its named domain
  // category — root, single-segment, multi-segment, tilde escape, slash
  // escape, mixed escape — not for its raw character sequence.
  it.each([
    ['root pointer (empty string)', ''],
    ['single-segment pointer', '/foo'],
    ['multi-segment pointer', '/foo/bar/baz'],
    ['array-index segment', '/foo/0'],
    ['tilde-escape segment (~0)', '/a~0b'],
    ['slash-escape segment (~1)', '/a~1b'],
    ['mixed-escape segment', '/a~0b~1c'],
  ])('accepts a valid %s', (_label, input) => {
    const result = jsonPointer(input);

    expect(result.ok).toBe(true);
  });

  it.each([
    ['lone tilde (not followed by 0 or 1)', '/a~b'],
    ['trailing tilde with no escape', '/a~'],
    ['non-empty pointer not starting with /', 'foo'],
    ['tilde followed by digit other than 0/1', '/a~2b'],
  ])('rejects %s', (_label, input) => {
    const result = jsonPointer(input);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid-json-pointer');
    expect(result.error.input).toBe(input);
  });
});

describe('parseSegments + serialiseSegments round-trip', () => {
  it.each([
    ['root pointer round-trip yields empty segments', '', []],
    ['single segment', '/foo', ['foo']],
    ['multi-segment', '/foo/bar/baz', ['foo', 'bar', 'baz']],
    ['tilde-escaped segment decodes to literal tilde', '/a~0b', ['a~b']],
    ['slash-escaped segment decodes to literal slash', '/a~1b', ['a/b']],
    ['mixed-escape decodes both', '/a~0b~1c', ['a~b/c']],
  ])('%s', (_label, input, expected) => {
    const pointer = jsonPointer(input);
    expect(pointer.ok).toBe(true);
    if (!pointer.ok) {
      return;
    }

    const segments = parseSegments(pointer.value);
    expect(segments).toEqual(expected);

    const serialised = serialiseSegments(segments);
    expect(serialised.raw).toBe(input);
  });
});

describe('quadKey canonical serialisation', () => {
  const SUBJECT = namedNode('https://example.test/subject');
  const PREDICATE = namedNode('https://example.test/predicate');
  const OBJECT_NAMED = namedNode('https://example.test/object');

  it('produces identical keys for structurally-equal Quads constructed at different call sites', () => {
    const firstSubject = namedNode('https://example.test/subject');
    const secondSubject = namedNode('https://example.test/subject');
    const firstQuad = quad(firstSubject, PREDICATE, OBJECT_NAMED);
    const secondQuad = quad(secondSubject, PREDICATE, OBJECT_NAMED);

    expect(quadKey(firstQuad)).toBe(quadKey(secondQuad));
  });

  it('produces distinct keys for Quads that differ on any term', () => {
    const baseline = quad(SUBJECT, PREDICATE, OBJECT_NAMED);
    const differentObject = quad(SUBJECT, PREDICATE, namedNode('https://example.test/other'));

    expect(quadKey(baseline)).not.toBe(quadKey(differentObject));
  });

  it('canonicalises a NamedNode-only quad into an N-Quads-style token sequence', () => {
    const q = quad(SUBJECT, PREDICATE, OBJECT_NAMED, defaultGraph());

    expect(quadKey(q)).toBe(
      '<https://example.test/subject> <https://example.test/predicate> <https://example.test/object> ',
    );
  });

  it('serialises language-tagged Literal objects with the language tag', () => {
    const q = quad(SUBJECT, PREDICATE, literal('Hello', 'en'));

    expect(quadKey(q)).toBe(
      '<https://example.test/subject> <https://example.test/predicate> "Hello"@en ',
    );
  });

  it('serialises datatype-typed Literal objects with the datatype IRI', () => {
    const q = quad(
      SUBJECT,
      PREDICATE,
      literal('42', namedNode('http://www.w3.org/2001/XMLSchema#integer')),
    );

    expect(quadKey(q)).toBe(
      '<https://example.test/subject> <https://example.test/predicate> "42"^^<http://www.w3.org/2001/XMLSchema#integer> ',
    );
  });
});

describe('JsonPointer interface shape', () => {
  it('jsonPointer ok-value carries the validated raw string', () => {
    const result = jsonPointer('/foo');
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const wrapped: JsonPointer = result.value;
    expect(wrapped.raw).toBe('/foo');
  });
});
