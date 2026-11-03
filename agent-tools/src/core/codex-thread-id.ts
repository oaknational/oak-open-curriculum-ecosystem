/**
 * A Codex thread id: the one owner of the brand and its parse, for every
 * topic that hands a thread id to the Codex CLI.
 *
 * @packageDocumentation
 */
import { err, ok, type Result } from '@oaknational/result';

import { isLowercaseUuid } from './lowercase-uuid.js';

declare const threadIdBrand: unique symbol;

/**
 * A Codex thread id, known to be a lowercase UUID.
 *
 * Only a UUID-shaped value may reach a Codex argv. `codex exec resume` also
 * accepts thread names, so anything else could inject an option there; and
 * `codex queue` looks up any value it cannot read as a UUID as a session
 * name, across every active session.
 */
export type ThreadId = string & { readonly [threadIdBrand]: true };

function isThreadId(value: string): value is ThreadId {
  return isLowercaseUuid(value);
}

/**
 * Accept a thread id only when it is a lowercase UUID of any version.
 *
 * @param raw - The candidate thread id.
 */
export function parseThreadId(raw: string): Result<ThreadId, string> {
  return isThreadId(raw) ? ok(raw) : err('a thread id must be a lowercase UUID');
}
