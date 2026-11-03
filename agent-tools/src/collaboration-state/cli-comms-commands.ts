import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { type ScopedContentBlockGroup } from '../hook-policy/types.js';
import {
  checkCommsTextAgainstConceptGates,
  formatCommsConceptGateRefusal,
} from './comms-concept-gate.js';
import {
  renderCommsLog,
  sharedCommsLogPathFor,
  writeCommsEventWithReadback,
} from './comms-use-cases.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { cliIo, type CollaborationStateCliIo, type CliRuntime } from './cli-runtime.js';
import {
  buildGatedHeartbeatLifecycleEvent,
  composeHeartbeatBodyFromOptions,
  isHeartbeatMode,
} from './comms-heartbeat-cli.js';
import { validateCommsEventTags } from './comms-tag-namespace.js';
import { registryForIdentityWrite } from './identity-write-guard.js';
import { validateSharedStateAgentId } from './identity.js';
import { type CollaborationStateEnvironment, type NarrativeCommsEvent } from './types.js';

/**
 * Maximum length of an inline `--body` argv for comms events (B2 / plan §B2).
 *
 * The comms substrate is scannable signal, not durable storage. Long content
 * belongs in handoff records, plan files, or PDRs; the comms event points to
 * them. Per the plan's directed shape, `--body-file` is the advertised escape
 * hatch for content above this limit — the gate fires only on `--body` argv,
 * not on `--body-file` resolved content. The architectural argument for
 * gating resolved length regardless of source is logged with the owner as a
 * follow-on question.
 *
 * Counts `string.length` (UTF-16 code units), matching what an agent or
 * operator types at the shell.
 *
 * consolidate-at-second-consumer — stays module-local until a second consumer emerges.
 */
const MAX_COMMS_BODY_LENGTH = 1500;

/**
 * Resolve the event body from either `--body` (inline string) or
 * `--body-file <path>` (file contents read literally, no shell interpretation).
 *
 * The file path is the cure for shell-quoting hazards on inline bodies that
 * contain backticks, dollar-signs, or other shell-special characters.
 *
 * Errors:
 * - Both flags set: rejected as mutually exclusive.
 * - Neither flag set: rejected as missing required `--body`.
 * - File unreadable: error message names the offending path.
 */
export async function resolveCommsBody(
  options: Options,
  io: CollaborationStateCliIo,
): Promise<string> {
  const inline = optional(options, 'body');
  const filePath = optional(options, 'body-file');
  if (inline !== undefined && filePath !== undefined) {
    throw new Error('--body and --body-file are mutually exclusive');
  }
  if (filePath !== undefined) {
    try {
      return await io.readTextFile(filePath);
    } catch (cause) {
      throw new Error(`--body-file path is unreadable: ${filePath}`, { cause });
    }
  }
  if (inline === undefined) {
    throw new Error('missing required option --body (or pass --body-file <path>)');
  }
  if (inline.length > MAX_COMMS_BODY_LENGTH) {
    throw new Error(
      `--body argv exceeds the ${MAX_COMMS_BODY_LENGTH}-character limit (got ${inline.length} chars). The comms substrate is scannable signal; for longer content use --body-file <path> with content stored in a handoff record, plan file, or PDR.`,
    );
  }
  return inline;
}

export async function appendComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const nowIso = required(options, 'now');
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  const { registry } = await registryForIdentityWrite({
    options,
    agentId: identity.agent_id,
    nowIso,
    surface: 'comms append',
    readActiveClaimsFile: io.readActiveClaimsFile,
    readCommitQueueEntries: io.readCommitQueueEntries,
  });

  const tags = validateCommsEventTags(options.tags);
  const body = await resolveAppendBody({ options, io, tags });
  const baseEvent = isHeartbeatMode(tags)
    ? await buildGatedHeartbeatLifecycleEvent({
        options,
        author: identity.agent_id,
        body,
        tags,
        registry,
        enforceGates: (gateInput) => enforceCommsConceptGates(io, gateInput),
      })
    : await buildGatedNarrativeEvent(options, io, identity.agent_id, body, tags);
  await writeCommsEventWithReadback({
    nowIso,
    store: {
      write: (event, currentNowIso) =>
        io.writeCommsEvent({ commsDir, event, nowIso: currentNowIso }),
      read: () => io.readCommsEvents(commsDir),
    },
    output: {
      writeText: (text) => io.writeTextFile({ filePath: sharedCommsLogPathFor(commsDir), text }),
    },
    event: tags.length > 0 ? { ...baseEvent, tags } : baseEvent,
  });

  const eventPath = join(commsDir, `${baseEvent.event_id}.json`);
  return `wrote comms event ${baseEvent.event_id} to ${eventPath}\n`;
}

export async function renderComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const outputPath = required(options, 'output');
  await renderCommsLog({
    store: { read: () => io.readCommsEvents(commsDir) },
    output: {
      writeText: (text) => io.writeTextFile({ filePath: outputPath, text }),
    },
  });

  return `wrote shared comms log to ${outputPath}\n`;
}

export async function migrateComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const migrated = await cliIo(runtime).migrateLegacyCommsDirectories({
    eventsDir: required(options, 'events-dir'),
    lifecycleDir: required(options, 'lifecycle-dir'),
    messagesDir: required(options, 'messages-dir'),
    commsDir: required(options, 'comms-dir'),
  });

  return `migrated ${migrated} comms events\n`;
}

/**
 * Enforce the comms concept gate (owner-ratified 2026-07-02) at the CLI
 * write boundary: the gate itself is Result-typed (ADR-088), and this is
 * the single point where its refusal is translated to this layer's error
 * contract — a thrown error the CLI runtime catches into exit 2 + stderr,
 * matching every neighbouring guard in the comms write paths. The blocks
 * come through the injected io so tests supply fixtures instead of the
 * live policy file.
 */
export async function enforceCommsConceptGates(
  io: Pick<CollaborationStateCliIo, 'loadCommsConceptGateBlocks'>,
  input: { readonly title: string; readonly body: string; readonly tags?: readonly string[] },
): Promise<void> {
  const loaded = await io.loadCommsConceptGateBlocks();
  // A loader err (a policy missing a ratified concept group) fails the write
  // closed exactly like a refusal — a gate that silently passes every event
  // is enforcement disabled.
  const failure = loaded.ok ? gateRefusalMessage(input, loaded.value) : loaded.error;
  if (failure !== undefined) {
    throw new Error(failure);
  }
}

/** The refusal's teaching payload, or undefined when the text passes the gate. */
function gateRefusalMessage(
  input: { readonly title: string; readonly body: string; readonly tags?: readonly string[] },
  groups: readonly ScopedContentBlockGroup[],
): string | undefined {
  const gate = checkCommsTextAgainstConceptGates({ ...input, groups });
  return gate.ok ? undefined : formatCommsConceptGateRefusal(gate.error);
}

/**
 * Build the narrative event for `comms append`, running the comms concept
 * gate over its title + body first (owner-ratified 2026-07-02): the write
 * refuses PDR-044 trip-list language before any event file exists. The
 * gate's capture-tag exemption is applied inside the check.
 */
async function buildGatedNarrativeEvent(
  options: Options,
  io: CollaborationStateCliIo,
  author: NarrativeCommsEvent['author'],
  body: string,
  tags: readonly string[],
): Promise<NarrativeCommsEvent> {
  const title = required(options, 'title');
  await enforceCommsConceptGates(io, { title, body, tags });
  const inResponseTo = optional(options, 'in-response-to');
  return {
    schema_version: '2.0.0',
    event_id: valueOrDefault(options, 'event-id', randomUUID()),
    created_at: required(options, 'created-at'),
    kind: 'narrative',
    author,
    title,
    body,
    // `in_response_to` (F-77) threads a narrative append to an antecedent event
    // of any kind — the machine-readable edge a PDR-064 Moment-2 broadcast
    // acknowledgement needs (`comms reply` only resolves directed events).
    ...(inResponseTo === undefined ? {} : { in_response_to: inResponseTo }),
  };
}

/**
 * Dispatch to the heartbeat-aware body composer (in `comms-heartbeat-cli.ts`)
 * when the event carries the canonical heartbeat tag (Lane A —
 * PDR-078 §5 typed-origin invariant); otherwise fall through to the
 * existing `--body` / `--body-file` resolution path used for narrative
 * and behaviour-note events.
 */
async function resolveAppendBody(input: {
  readonly options: Options;
  readonly io: CollaborationStateCliIo;
  readonly tags: readonly string[];
}): Promise<string> {
  if (isHeartbeatMode(input.tags)) {
    return composeHeartbeatBodyFromOptions(input.options);
  }
  return resolveCommsBody(input.options, input.io);
}
