/**
 * Outbound response byte counter for the transport observability seam.
 *
 * The MCP SDK serialises JSON-RPC responses internally and streams them
 * through the Node response (`@hono/node-server`'s request listener
 * writes every body byte via `res.write`/`res.end` and awaits the pipe
 * before `transport.handleRequest` resolves — verified against
 * `@hono/node-server@2.x`; the M5 e2e proof is the canary if a future
 * upgrade changes that write path). Wrapping the live response is
 * therefore the one place the full wire body — tools/call, tools/list,
 * resources/read, prompts/get, and error responses alike — is observable
 * without re-serialising anything.
 *
 * The wrapper is behaviour-preserving (arguments, `this`, and return
 * values — including `write`'s backpressure boolean — forward untouched)
 * and total: a response without `write`/`end` yields a counter that
 * reads 0, and no path throws. Counted bytes include SSE framing; the
 * metric records wire truth, not parsed payload size.
 */

/** Reader for the bytes accumulated by {@link attachResponseByteCounter}. */
export interface ResponseByteCounter {
  /** Total body bytes written so far via the wrapped write/end. */
  bodyBytes(): number;
}

/**
 * Structural minimum the counter needs from a response object.
 *
 * Method (not property) syntax keeps Node's `http.ServerResponse`
 * assignable; both members are optional so test fakes — and the narrow
 * handler-facing response interfaces — satisfy the shape without
 * assertions.
 */
export interface ByteCountableResponse {
  write?(...args: unknown[]): unknown;
  end?(...args: unknown[]): unknown;
}

/** Byte length of one written chunk; 0 for anything that is not a chunk. */
function chunkByteLength(chunk: unknown, maybeEncoding: unknown): number {
  if (typeof chunk === 'string') {
    return typeof maybeEncoding === 'string' && Buffer.isEncoding(maybeEncoding)
      ? Buffer.byteLength(chunk, maybeEncoding)
      : Buffer.byteLength(chunk);
  }
  if (chunk instanceof Uint8Array) {
    return chunk.byteLength;
  }
  return 0;
}

/**
 * Wraps `res.write` and `res.end` in place to count outbound body bytes.
 *
 * Attach before handing the response to the transport; read the counter
 * after the transport resolves. Missing `write`/`end` members are left
 * absent and the counter simply reads 0.
 */
export function attachResponseByteCounter(res: ByteCountableResponse): ResponseByteCounter {
  let totalBytes = 0;

  const originalWrite = typeof res.write === 'function' ? res.write.bind(res) : undefined;
  if (originalWrite) {
    res.write = (...args: unknown[]): unknown => {
      totalBytes += chunkByteLength(args[0], args[1]);
      return originalWrite(...args);
    };
  }

  const originalEnd = typeof res.end === 'function' ? res.end.bind(res) : undefined;
  if (originalEnd) {
    res.end = (...args: unknown[]): unknown => {
      totalBytes += chunkByteLength(args[0], args[1]);
      return originalEnd(...args);
    };
  }

  return {
    bodyBytes(): number {
      return totalBytes;
    },
  };
}
