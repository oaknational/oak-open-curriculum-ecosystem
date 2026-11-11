import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseJsonTextResult } from '../core/json.js';

import type { GateHolderIdentity } from './gate-slot-contract.js';

/** The longest command a holder serves, so its line fits every reader's bound. */
const MAX_COMMAND_CHARS = 256;

/** The longest worktree path an identity may carry. */
const MAX_WORKTREE_CHARS = 1024;

/** The longest identity line a reader reads; a longer answer reads as foreign. */
export const IDENTITY_LINE_MAX_CHARS = 4096;

declare const readable: unique symbol;

/** An identity line every reader accepts; only {@link encodeHolderIdentity} makes one. */
export type HolderIdentityLine = string & { readonly [readable]: true };

/** True when no C0, DEL or C1 control character appears: nothing can forge a line or an escape. */
function isPrintable(text: string): boolean {
  return [...text].every((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code >= 0x20 && (code < 0x7f || code > 0x9f);
  });
}

/**
 * The identity a gate serves, validated as untrusted input: it arrives from
 * whatever listens on a slot port and is printed in a seat's terminal.
 */
const HolderIdentitySchema = z.object({
  worktree: z
    .string()
    .max(MAX_WORKTREE_CHARS)
    .refine((path) => isAbsolute(path) && isPrintable(path)),
  pid: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  command: z.string().max(MAX_COMMAND_CHARS).refine(isPrintable),
  acquired_at: z.iso.datetime(),
});

/**
 * The line a holder writes to every connection on its slot port, or why no
 * reader would accept it. A holder whose line reads as foreign could not be
 * matched to its tree, so a second gate could be admitted there; such an
 * identity is refused here, before any slot is bound. The line is checked
 * by the reader's own parse, so the two cannot drift apart.
 */
export function encodeHolderIdentity(
  identity: GateHolderIdentity,
): Result<HolderIdentityLine, string> {
  const line = `${JSON.stringify(identity)}\n`;
  if (!isReadableLine(line)) {
    return err(
      `a reader could not match this gate to its working tree ${JSON.stringify(identity.worktree)}: ` +
        `a tree must be an absolute path of at most ${MAX_WORKTREE_CHARS} printable characters, ` +
        `in an identity line of at most ${IDENTITY_LINE_MAX_CHARS}.`,
    );
  }

  return ok(line);
}

function isReadableLine(line: string): line is HolderIdentityLine {
  return parseHolderIdentity(line) !== undefined;
}

/**
 * The command a holder serves for `pnpmArgs`: control characters become
 * spaces and the text is cut to the served length, so its own identity
 * always passes a reader's validation.
 */
export function holderCommand(pnpmArgs: readonly string[]): string {
  const printable = [...['pnpm', ...pnpmArgs].join(' ')]
    .map((character) => (isPrintable(character) ? character : ' '))
    .join('');

  return printable.slice(0, MAX_COMMAND_CHARS);
}

/**
 * Read what a slot's listener answered. Anything that is not a whole,
 * well-formed identity (a foreign service's greeting, a cut-off or oversize
 * answer, a field carrying a line break or out of bounds) reads as
 * `undefined`: the slot still counts as held, but by no gate the same-tree
 * rule can match.
 */
export function parseHolderIdentity(text: string): GateHolderIdentity | undefined {
  if (text.length > IDENTITY_LINE_MAX_CHARS) {
    return undefined;
  }
  const parsed = parseJsonTextResult(text, 'gate slot holder identity');
  if (!parsed.ok) {
    return undefined;
  }
  const identity = HolderIdentitySchema.safeParse(parsed.value);

  return identity.success ? identity.data : undefined;
}
