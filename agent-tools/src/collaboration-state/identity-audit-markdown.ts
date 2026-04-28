import { type CollaborationAgentId } from './types.js';

/**
 * Parsed identity row from the operational thread record.
 */
interface ThreadRecordIdentityRow {
  readonly label: 'Last refreshed' | 'Prior refresh';
  readonly agentId: CollaborationAgentId;
}

/**
 * Parsed identity row from the rendered shared communication log.
 */
interface SharedLogIdentityRow {
  readonly createdAt: string;
  readonly agentId: CollaborationAgentId;
}

/**
 * Parse PDR-027 identity rows from a thread next-session record.
 *
 * @param text - Markdown thread record text.
 * @returns Identity rows from `Last refreshed` and `Prior refresh` entries.
 */
export function findThreadRecordIdentityRows(text: string): readonly ThreadRecordIdentityRow[] {
  const normalised = text.replace(/\s+/gu, ' ');
  const pattern =
    /\*\*(Last refreshed|Prior refresh)\*\*:[^(]*\(([^/()]+) \/ ([^/()]+) \/ ([^/()]+) \/ ([A-Za-z0-9_-]{1,24})(?=\s*(?:—|\)))/gu;

  return Array.from(normalised.matchAll(pattern), (match) => ({
    label: parseThreadRecordLabel(match[1]),
    agentId: {
      agent_name: match[2].trim(),
      platform: match[3].trim(),
      model: match[4].trim(),
      session_id_prefix: match[5].trim(),
    },
  }));
}

/**
 * Parse PDR-027 identity rows from rendered shared communication log headings.
 *
 * @param text - Rendered shared communication log markdown.
 * @returns Identity rows from timestamped communication headings.
 */
export function findSharedLogIdentityRows(text: string): readonly SharedLogIdentityRow[] {
  const pattern =
    /^## (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) — `([^`]+)` \/ `([^`]+)` \/ `([^`]+)` \/ `([^`]+)` — /gmu;

  return Array.from(text.matchAll(pattern), (match) => ({
    createdAt: match[1],
    agentId: {
      agent_name: match[2],
      platform: match[3],
      model: match[4],
      session_id_prefix: match[5],
    },
  }));
}

function parseThreadRecordLabel(value: string): 'Last refreshed' | 'Prior refresh' {
  return value === 'Last refreshed' ? 'Last refreshed' : 'Prior refresh';
}
