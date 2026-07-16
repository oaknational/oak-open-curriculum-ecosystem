/** Dependency-light hashing for the exact production Codex invocation. @packageDocumentation */
import { createHash } from 'node:crypto';

/** Command, arguments, location, and environment that define one review invocation. */
export interface FingerprintInvocation {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}

/** Hash the ordered JSON representation shared by benchmarking and the production drift check. */
export function fingerprintInvocationSha256(invocation: FingerprintInvocation): string {
  return createHash('sha256').update(JSON.stringify(invocation)).digest('hex');
}
