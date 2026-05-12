import { appendFile, readFile } from 'node:fs/promises';

import { required, type Options } from './cli-options.js';
import { readDirectedCommsMessages } from './state-io.js';
import { type DirectedCommsMessage } from './types.js';

export async function inboxComms(options: Options): Promise<string> {
  const messages = await readDirectedCommsMessages(required(options, 'messages-dir'));
  const seenFile = required(options, 'seen-file');
  const agentName = required(options, 'agent-name');
  const seenIds = await readSeenIds(seenFile);
  const unseen = messages
    .filter((message) => messageMatchesRecipient(message, agentName))
    .filter((message) => !seenIds.has(message.event_id))
    .toSorted(compareDirectedMessages);

  if (unseen.length === 0) {
    return 'no new directed messages\n';
  }

  await appendFile(seenFile, unseen.map((message) => message.event_id).join('\n') + '\n');

  return unseen.map(formatDirectedMessage).join('\n');
}

export function messageMatchesRecipient(
  message: DirectedCommsMessage,
  agentName: string,
  sessionPrefix?: string,
): boolean {
  const nameMatches = agentName === '*' || message.to.agent_name === agentName;
  const sessionMatches =
    sessionPrefix === undefined || message.to.session_id_prefix === sessionPrefix;
  return nameMatches && sessionMatches;
}

export async function readSeenIds(seenFile: string): Promise<ReadonlySet<string>> {
  const text = await readFile(seenFile, 'utf8').catch(() => '');
  return new Set(text.split(/\r?\n/u).filter(Boolean));
}

export function compareDirectedMessages(
  left: DirectedCommsMessage,
  right: DirectedCommsMessage,
): number {
  const byTime = Date.parse(left.created_at) - Date.parse(right.created_at);
  if (byTime !== 0) {
    return byTime;
  }

  return left.event_id.localeCompare(right.event_id);
}

export function formatDirectedMessage(message: DirectedCommsMessage): string {
  return [
    '--- NEW DIRECTED MESSAGE ---',
    `from: ${message.from.agent_name} / ${message.from.platform} / ${message.from.session_id_prefix}`,
    `subject: ${message.subject}`,
    `created_at: ${message.created_at}`,
    '',
    message.body,
    '--- END MESSAGE ---',
    '',
  ].join('\n');
}
