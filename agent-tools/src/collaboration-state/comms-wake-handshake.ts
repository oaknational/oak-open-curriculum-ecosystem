/**
 * The handshake that binds a Codex seat's wake companion to the seat's own
 * thread. The seat writes its `CODEX_THREAD_ID` to a file in a directory
 * made for one launch; the companion reads it once and arms only on exactly
 * one thread id. See mechanism 2 of the plan node `codex-queue-wake-bridge`.
 *
 * @packageDocumentation
 */
import { err, type Result } from '@oaknational/result';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';

/**
 * Why the companion will not arm on a handshake's contents. A closed kind,
 * never the contents, which a process other than the seat may have written.
 */
interface HandshakeRefusal {
  readonly kind: 'not-one-thread-id';
}

/**
 * Accept a handshake's contents only when they are one lowercase UUID,
 * optionally followed by one newline. The pattern is load-bearing: a value
 * `codex queue` cannot read as a UUID it looks up as a session name, across
 * every active session.
 *
 * @param contents - The handshake file's contents, as read once.
 */
export function parseHandshake(contents: string): Result<ThreadId, HandshakeRefusal> {
  const line = contents.endsWith('\n') ? contents.slice(0, -1) : contents;
  const threadId = parseThreadId(line);
  return threadId.ok ? threadId : err({ kind: 'not-one-thread-id' });
}
