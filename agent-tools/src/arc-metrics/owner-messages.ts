/**
 * Which transcript entries are the owner speaking, and which are not.
 *
 * @remarks
 * The transcript attributes every prompt itself, and this module reads that
 * attribution, never the prompt's text: a peer's message or a scheduled prompt
 * reads like the owner's, and a list of text prefixes counted both.
 *
 * - **A user turn** carries `origin.kind` (who sent it) and `promptSource` (how
 *   it was submitted). It is the owner speaking when the origin is `human` and
 *   a `promptSource` is present: the harness also records the owner's slash
 *   commands as human-origin turns without one, and those are actions, not
 *   messages, arguments included: a line of several commands is written as one
 *   turn per command, each carrying the line's arguments, so counting them
 *   would count one line several times.
 * - **A message typed while a turn runs** is counted once, as mid-turn, in the
 *   form it finally took: the `queued_command` attachment, carrying the same
 *   `origin` and entered as a prompt (`commandMode` `prompt`; a shell escape
 *   is another mode), when the running turn absorbed it; or the turn whose
 *   `promptSource` is `queued` when it waited for the turn to end. Its
 *   `enqueue` record carries no attribution and is never counted. Counting
 *   turns alone misses every message a running turn absorbed.
 *
 * Everything else user-shaped — peer relays and teammate messages, scheduled
 * prompts, task notifications, usage-limit continues, compaction summaries,
 * skill bodies, shell escapes and interrupt markers — is excluded, and COUNTED
 * as excluded, so a caller can tell "the owner said nothing" from "the filter
 * removed everything". A predicate over a filtered set that reports only its
 * survivors lets an empty set read as a satisfied predicate, which is the
 * generator behind two merge-gate defects the second estate met on 2026-09-16.
 *
 * @packageDocumentation
 */

import type { Entry } from './entry.js';

const OWNER_ORIGIN = 'human';
const QUEUED_PROMPT = 'queued';
const ABSORBED_MESSAGE = 'queued_command';
const PROMPT_MODE = 'prompt';

/** One transcript's owner-message counts. */
export interface OwnerMessageTally {
  readonly messages: number;
  readonly midTurn: number;
  /** User-shaped entries excluded as not the owner speaking, never silently. */
  readonly filtered: number;
}

/** Counts one transcript's owner messages, entry by entry. */
export interface OwnerMessageCounter {
  readonly absorb: (entry: Entry) => void;
  readonly tally: () => OwnerMessageTally;
}

type Speaker = 'owner' | 'owner-mid-turn' | 'excluded';

/**
 * Create a counter for one transcript's owner messages.
 *
 * @remarks
 * Each entry is classified on its own attribution; no entry is deduplicated
 * against another, so two identical messages are two.
 *
 * @returns A counter to feed entries to, and to read the tally from.
 */
export function createOwnerMessageCounter(): OwnerMessageCounter {
  const tally = { messages: 0, midTurn: 0, filtered: 0 };
  return {
    absorb: (entry) => {
      const speaker = speakerOf(entry);
      if (speaker === 'excluded') {
        tally.filtered += 1;
      } else if (speaker !== undefined) {
        tally.messages += 1;
        tally.midTurn += speaker === 'owner-mid-turn' ? 1 : 0;
      }
    },
    tally: () => ({ ...tally }),
  };
}

function speakerOf(entry: Entry): Speaker | undefined {
  if (entry.type === 'user') {
    return turnSpeaker(entry);
  }
  return entry.type === 'attachment' ? absorbedSpeaker(entry) : undefined;
}

/**
 * A user turn: a compaction summary is excluded by its marker, whatever it
 * carries; otherwise a prompt only when it carries text, the owner's only when
 * attributed so.
 */
function turnSpeaker(entry: Entry): Speaker | undefined {
  if (entry.isCompactSummary === true) {
    return 'excluded';
  }
  if (!hasText(entry.message?.content)) {
    return undefined;
  }
  if (entry.origin?.kind !== OWNER_ORIGIN || entry.promptSource === undefined) {
    return 'excluded';
  }
  return entry.promptSource === QUEUED_PROMPT ? 'owner-mid-turn' : 'owner';
}

/**
 * An attachment: a message only when it is a running turn's absorbed command
 * with text, the owner's only when entered as a prompt and attributed to them.
 */
function absorbedSpeaker(entry: Entry): Speaker | undefined {
  const attachment = entry.attachment;
  if (attachment?.type !== ABSORBED_MESSAGE || !hasText(attachment.prompt)) {
    return undefined;
  }
  const ownerPrompt =
    attachment.commandMode === PROMPT_MODE && attachment.origin?.kind === OWNER_ORIGIN;
  return ownerPrompt ? 'owner-mid-turn' : 'excluded';
}

function hasText(content: unknown): boolean {
  if (typeof content === 'string') {
    return content.trim().length > 0;
  }
  return Array.isArray(content) && content.some((block) => textOfBlock(block).length > 0);
}

function textOfBlock(block: unknown): string {
  if (typeof block !== 'object' || block === null) {
    return '';
  }
  if (!('type' in block) || block.type !== 'text') {
    return '';
  }
  return 'text' in block && typeof block.text === 'string' ? block.text.trim() : '';
}
