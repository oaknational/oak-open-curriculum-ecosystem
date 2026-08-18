import { describe, expect, it } from 'vitest';

import { normaliseOakClientProduct, normaliseOakClientSurface } from './client-categories.js';
import { clientIdentityValues, readClientIdentityHeaders } from './mcp-transport-event-reader.js';

/**
 * A header record with a null prototype, which Node's http layer may supply.
 * Built by repointing a typed literal rather than `Object.create(null)`, which
 * would be an `any`.
 */
function createNullPrototypeHeaders(): Record<string, string> {
  const record: Record<string, string> = {};
  Reflect.setPrototypeOf(record, null);
  return record;
}

/** A header record whose only 'user-agent' lives on the prototype chain. */
function createInheritedHeaders(userAgent: string): Record<string, string> {
  const record: Record<string, string> = {};
  Reflect.setPrototypeOf(record, { 'user-agent': userAgent });
  return record;
}

describe('readClientIdentityHeaders', () => {
  it('reads the x-anthropic-client and user-agent header values in that order', () => {
    const extra = {
      requestInfo: {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'x-anthropic-client': 'claude-code/2.0',
        },
      },
    };

    expect(readClientIdentityHeaders(extra)).toEqual({
      readable: true,
      values: ['claude-code/2.0', 'Mozilla/5.0'],
    });
  });

  it('takes the first element of a multi-valued header', () => {
    const extra = {
      requestInfo: { headers: { 'user-agent': ['Mozilla/5.0', 'ignored/2.0'] } },
    };

    expect(readClientIdentityHeaders(extra)).toEqual({
      readable: true,
      values: [undefined, 'Mozilla/5.0'],
    });
  });

  // A container that IS present and readable but happens to carry no client
  // header is a readable container. That is the client's choice, not a transport
  // fault, and the distinction is what keeps `unavailable` meaningful.
  it.each([
    ['an empty header record', {}],
    ['a record carrying other headers only', { accept: 'application/json' }],
    ['a null-prototype record, as Node may supply', createNullPrototypeHeaders()],
  ])('reports %s as readable', (_label, headers) => {
    expect(readClientIdentityHeaders({ requestInfo: { headers } }).readable).toBe(true);
  });

  // Nothing here can be read by an own-property access, so the derivation cannot
  // run and must say so rather than reporting an absent client.
  it.each([
    ['no extra', undefined],
    ['a non-object extra', 'extra'],
    ['no requestInfo', {}],
    ['a non-object requestInfo', { requestInfo: 'request' }],
    ['no headers', { requestInfo: {} }],
    ['non-object headers', { requestInfo: { headers: 'user-agent' } }],
    ['null headers', { requestInfo: { headers: null } }],
  ])('reports %s as unreadable', (_label, extra) => {
    expect(readClientIdentityHeaders(extra)).toEqual({ readable: false });
  });

  // The case that motivates the prototype check rather than a bare object test:
  // MCP SDK v2 supplies a WHATWG `Headers`, whose entries live behind accessors an
  // own-property read cannot reach. Treating it as a readable-but-empty container
  // would report every request as an absent client and hide the transport change.
  it('reports a WHATWG Headers container as unreadable, not as an absent client', () => {
    const headers = new Headers({ 'user-agent': 'claude-code/2.1.226 (cli)' });

    expect(headers.get('user-agent')).toBe('claude-code/2.1.226 (cli)');
    expect(readClientIdentityHeaders({ requestInfo: { headers } })).toEqual({ readable: false });
    expect(normaliseOakClientProduct(readClientIdentityHeaders({ requestInfo: { headers } }))).toBe(
      'unavailable',
    );
  });

  it('reports a Map container as unreadable', () => {
    const headers = new Map([['user-agent', 'claude-code/2.1.226 (cli)']]);

    expect(readClientIdentityHeaders({ requestInfo: { headers } })).toEqual({ readable: false });
  });

  it('does not treat an inherited header as readable data', () => {
    const headers = createInheritedHeaders('claude-code/2.1.226 (cli)');

    expect(headers['user-agent']).toBe('claude-code/2.1.226 (cli)');
    expect(readClientIdentityHeaders({ requestInfo: { headers } })).toEqual({ readable: false });
  });

  it('composes to unavailable for the product axis when the container is unreadable', () => {
    expect(normaliseOakClientProduct(readClientIdentityHeaders(undefined))).toBe('unavailable');
  });

  it('composes to other for the product axis when a readable container names nothing', () => {
    expect(
      normaliseOakClientProduct(readClientIdentityHeaders({ requestInfo: { headers: {} } })),
    ).toBe('other');
  });
});

describe('clientIdentityValues', () => {
  it('flattens a readable container to its values', () => {
    expect(
      clientIdentityValues({ readable: true, values: ['claude-code/2.0', undefined] }),
    ).toEqual(['claude-code/2.0', undefined]);
  });

  // The form-factor axis has no vocabulary member for an unreadable container, so
  // it must behave exactly as it did before that distinction existed.
  it('flattens an unreadable container to no values', () => {
    expect(clientIdentityValues({ readable: false })).toEqual([]);
  });

  it('composes with the surface axis to the safe default when headers are absent', () => {
    expect(
      normaliseOakClientSurface(clientIdentityValues(readClientIdentityHeaders(undefined))),
    ).toBe('other');
  });
});
