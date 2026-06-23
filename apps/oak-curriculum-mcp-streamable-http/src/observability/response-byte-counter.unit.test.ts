/**
 * Unit tests for the outbound response byte counter.
 *
 * The counter wraps `res.write`/`res.end` on the live response object so
 * the transport seam can record exactly how many body bytes left the
 * server — the MCP SDK serialises JSON-RPC responses internally, so the
 * write path is the only place the full wire body is observable.
 *
 * The wrapper must be behaviour-preserving (arguments and return values
 * forwarded untouched, including `write`'s backpressure boolean) and
 * total (a response without write/end yields a counter that reads 0;
 * nothing ever throws).
 */

import { describe, it, expect, vi } from 'vitest';
import { attachResponseByteCounter } from './response-byte-counter.js';

interface RecordedCall {
  readonly args: readonly unknown[];
}

function createFakeResponse(): {
  res: { write: (...args: unknown[]) => boolean; end: (...args: unknown[]) => string };
  writeCalls: RecordedCall[];
  endCalls: RecordedCall[];
} {
  const writeCalls: RecordedCall[] = [];
  const endCalls: RecordedCall[] = [];
  return {
    res: {
      write(...args: unknown[]): boolean {
        writeCalls.push({ args });
        return false; // deliberate non-true backpressure signal to prove forwarding
      },
      end(...args: unknown[]): string {
        endCalls.push({ args });
        return 'ended';
      },
    },
    writeCalls,
    endCalls,
  };
}

describe('attachResponseByteCounter', () => {
  it('counts string chunks written through write and end', () => {
    const { res } = createFakeResponse();
    const counter = attachResponseByteCounter(res);
    res.write('event: message\n');
    res.end('data: {"ok":true}\n');
    expect(counter.bodyBytes()).toBe(
      Buffer.byteLength('event: message\n') + Buffer.byteLength('data: {"ok":true}\n'),
    );
  });

  it('counts multi-byte string chunks by byte length, not code units', () => {
    const { res } = createFakeResponse();
    const counter = attachResponseByteCounter(res);
    res.write('héllo'); // é is two bytes in UTF-8
    expect(counter.bodyBytes()).toBe(Buffer.byteLength('héllo'));
  });

  it('honours an explicit string encoding argument', () => {
    const { res } = createFakeResponse();
    const counter = attachResponseByteCounter(res);
    res.write('68656c6c6f', 'hex'); // 5 bytes
    expect(counter.bodyBytes()).toBe(5);
  });

  it('counts Uint8Array chunks by byteLength', () => {
    const { res } = createFakeResponse();
    const counter = attachResponseByteCounter(res);
    res.write(new Uint8Array([1, 2, 3]));
    res.end(Buffer.from([4, 5]));
    expect(counter.bodyBytes()).toBe(5);
  });

  it('reads 0 when end is called with no chunk', () => {
    const { res } = createFakeResponse();
    const counter = attachResponseByteCounter(res);
    res.end();
    expect(counter.bodyBytes()).toBe(0);
  });

  it('forwards write arguments and the backpressure return value untouched', () => {
    const { res, writeCalls } = createFakeResponse();
    attachResponseByteCounter(res);
    const callback = vi.fn();
    const returned = res.write('chunk', callback);
    expect(returned).toBe(false);
    expect(writeCalls).toHaveLength(1);
    expect(writeCalls[0]?.args).toEqual(['chunk', callback]);
  });

  it('forwards end arguments and its return value untouched', () => {
    const { res, endCalls } = createFakeResponse();
    attachResponseByteCounter(res);
    const returned = res.end('final');
    expect(returned).toBe('ended');
    expect(endCalls).toHaveLength(1);
    expect(endCalls[0]?.args).toEqual(['final']);
  });

  it('returns a zero counter, without throwing, for a response without write/end', () => {
    const counter = attachResponseByteCounter({});
    expect(counter.bodyBytes()).toBe(0);
  });
});
