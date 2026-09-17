import { err, unwrapOrThrow } from '@oaknational/result';
import { typeSafeEntries } from '@oaknational/type-helpers';

import type { ProcessInvocation, ProcessPort, ProcessResult } from '../ports.js';
import { compareUtf16 } from '../utf16-order.js';

export interface ExactProcessResponse {
  readonly invocation: ProcessInvocation;
  readonly result: ProcessResult;
}

/**
 * A stateless, fail-closed projection from the complete process invocation to
 * its response. Omitted invocations throw instead of falling through to a
 * queue, default response, call counter, or mutable ledger.
 */
export function exactProcessPort(responses: readonly ExactProcessResponse[]): ProcessPort {
  const projection = Object.freeze(
    responses.map(({ invocation, result }) => ({
      key: invocationKey(invocation),
      result,
    })),
  );
  const keys = projection.map(({ key }) => key);
  if (new Set(keys).size !== keys.length) {
    fail('exact process projection contains a duplicate invocation');
  }

  return {
    run(input) {
      const key = invocationKey(input);
      const response = projection.find((candidate) => candidate.key === key);
      if (response === undefined) {
        return fail(`unexpected process invocation: ${key}`);
      }
      return response.result;
    },
  };
}

function fail(message: string): never {
  return unwrapOrThrow<never>(err(new Error(message)));
}

function invocationKey(input: ProcessInvocation): string {
  return JSON.stringify([
    input.executable,
    input.args,
    input.cwd,
    typeSafeEntries(input.env).sort(([left], [right]) => compareUtf16(left, right)),
    input.maxStdoutBytes,
    input.maxStderrBytes,
  ]);
}
