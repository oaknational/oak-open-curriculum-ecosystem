import { required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { type CollaborationStateEnvironment, type DirectedCommsMessage } from './types.js';

export async function inboxComms(
  options: Options,
  _env?: CollaborationStateEnvironment,
  runtime: CliRuntime = {},
): Promise<string> {
  const io = cliIo(runtime);
  const messages = await io.readDirectedCommsMessages(required(options, 'comms-dir'));
  const seenFile = required(options, 'seen-file');
  const agentName = required(options, 'agent-name');
  const seenIds = await io.readSeenIds(seenFile);
  const unseen = messages
    .filter((message) => messageMatchesRecipient(message, agentName))
    .filter((message) => !seenIds.has(message.event_id))
    .toSorted(compareDirectedMessages);

  if (unseen.length === 0) {
    return 'no new directed messages\n';
  }

  await io.appendSeenMessageIds(
    seenFile,
    unseen.map((message) => message.event_id),
  );

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
