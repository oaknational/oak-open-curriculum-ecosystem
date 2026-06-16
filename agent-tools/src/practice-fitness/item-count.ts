/**
 * Pending-graduations entry schema — the perception interface by which the
 * fitness sensor, the trigger-scan drain pass, a cold-start agent, and the
 * owner all see the register's decision-debt state.
 *
 * A register entry is an inline-bracket block:
 *
 *   `[captured: <date> | source: <text> | target: <text> | trigger: <text> | size: <…> | status: <enum>]`
 *
 * `captured` is the entry's creation date (createdAt); an optional `updated: <date>`
 * field records the last-revised date (lastUpdated, defaulting to `captured`). Both
 * feed the report's dwell-time — how long an item has sat undecided — a
 * prioritisation signal layered on the count zone, never a gate.
 *
 * The block may wrap across several physical lines. `status` is the load-bearing
 * field: **live** statuses are undecided decision-debt; **terminal** statuses
 * record a disposition and are removed from the register on the same pass. There
 * is no `owner-gated` status — every live item is debt to decide now (the
 * abolition recorded in the consolidation-doctrine PDR and ADR-144's count
 * metric-kind amendment). See
 * `.agent/plans/agent-tooling/current/pending-graduations-schema-and-count-fitness.plan.md`.
 */

export const LIVE_ITEM_STATUSES = ['pending', 'due', 'overdue'] as const;
export const TERMINAL_ITEM_STATUSES = ['graduated', 'rejected', 'duplicate'] as const;

type LiveItemStatus = (typeof LIVE_ITEM_STATUSES)[number];
type TerminalItemStatus = (typeof TERMINAL_ITEM_STATUSES)[number];
type ItemStatus = LiveItemStatus | TerminalItemStatus;

const REQUIRED_FIELDS = ['captured', 'source', 'target', 'trigger', 'size', 'status'] as const;

/** The retired status — explicitly rejected so a migration cannot silently miss it. */
const ABOLISHED_STATUS = 'owner-gated';

/** The legacy multi-bullet capture shape (pre-inline-bracket), e.g. `- **captured-date**: …`. */
const LEGACY_BLOCK_MARKER = /-\s*\*\*captured-date\*\*\s*:/;

/**
 * One inline-bracket block, parsed into its pipe-separated fields. `status` is
 * surfaced separately as the raw string (which may be unknown or abolished —
 * conformance is a separate concern from parsing).
 */
export interface ParsedItem {
  readonly fields: Readonly<Record<string, string>>;
  readonly status: string | null;
}

export interface ItemCountResult {
  readonly total: number;
  readonly byStatus: Readonly<Record<LiveItemStatus, number>>;
}

type ItemConformanceFindingKind = 'malformed' | 'unknown-status' | 'owner-gated-status';

export interface ItemConformanceFinding {
  readonly kind: ItemConformanceFindingKind;
  readonly detail: string;
}

const INLINE_ENTRY = /`\[(captured:[\s\S]*?)\]`/g;

const FENCED_BLOCK = /^(```|~~~)[\s\S]*?^\1/gm;

/**
 * Remove fenced code blocks before scanning. A schema example documented inside
 * a fenced code block is not a live register entry; counting it would silently
 * inflate the decision-debt metric (the inversion guard). Applied to both
 * parsing and validation so the schema can be documented inline without being
 * mistaken for real debt.
 */
function stripFencedBlocks(content: string): string {
  return content.replaceAll(FENCED_BLOCK, '');
}

/**
 * Parse the pipe-separated fields of one inline-bracket block. Schema invariant:
 * a field value must not contain `|` (the field delimiter) — a value carrying a
 * literal `|` would split into a keyless fragment that is silently dropped.
 */
function parseFields(inner: string): Record<string, string> {
  const normalised = inner.replaceAll(/\s+/g, ' ').trim();
  const fields: Record<string, string> = {};
  for (const part of normalised.split('|')) {
    const colon = part.indexOf(':');
    if (colon === -1) {
      continue;
    }
    const key = part.slice(0, colon).trim();
    const value = part.slice(colon + 1).trim();
    if (key) {
      fields[key] = value;
    }
  }
  return fields;
}

/**
 * Parse every inline-bracket entry in the content. Legacy block-format entries
 * are not inline-bracket blocks and so are not returned here; they are surfaced
 * by {@link validateRegisterItems} as malformed until migrated.
 */
export function parseRegisterItems(content: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  for (const match of stripFencedBlocks(content).matchAll(INLINE_ENTRY)) {
    const fields = parseFields(match[1]);
    items.push({ fields, status: fields.status ?? null });
  }
  return items;
}

/**
 * The leading whitespace-delimited token of a status, trimmed of trailing
 * punctuation. Counting reads this token so that decision-debt cannot be hidden
 * by appending an annotation to an otherwise-live status (the inversion guard);
 * validation, by contrast, requires the *raw* status to be exactly an enum token.
 */
function statusToken(status: string | null): string | null {
  if (status == null) {
    return null;
  }
  const [token] = status.trim().split(/\s/);
  return token.replace(/[^\w-]+$/, '');
}

const LIVE_STATUS_SET = new Set<string>(LIVE_ITEM_STATUSES);
const TERMINAL_STATUS_SET = new Set<string>(TERMINAL_ITEM_STATUSES);

function isLiveToken(token: string): token is LiveItemStatus {
  return LIVE_STATUS_SET.has(token);
}

function isTerminalToken(token: string): token is TerminalItemStatus {
  return TERMINAL_STATUS_SET.has(token);
}

function liveStatusToken(status: string | null): LiveItemStatus | null {
  const token = statusToken(status);
  return token != null && isLiveToken(token) ? token : null;
}

function isExactKnownStatus(status: string | null): status is ItemStatus {
  return status != null && (isLiveToken(status) || isTerminalToken(status));
}

/**
 * Count the live (undecided) items, with a per-live-status breakdown. Terminal
 * dispositions and non-conformant entries do not contribute to the count: the
 * count is decision-debt, and an item leaves it only through a recorded
 * disposition, never silent removal.
 */
export function countLiveItems(items: readonly ParsedItem[]): ItemCountResult {
  const byStatus: Record<LiveItemStatus, number> = { pending: 0, due: 0, overdue: 0 };
  for (const item of items) {
    const live = liveStatusToken(item.status);
    if (live != null) {
      byStatus[live] += 1;
    }
  }
  return { total: byStatus.pending + byStatus.due + byStatus.overdue, byStatus };
}

/** Whether a parsed entry is live (undecided) — its status is a live enum token. */
export function isLiveItem(item: ParsedItem): boolean {
  return liveStatusToken(item.status) != null;
}

function findingForItem(item: ParsedItem): ItemConformanceFinding | null {
  // Structural validity is checked first: a status cannot be meaningfully
  // classified on an entry whose required fields are absent.
  const missing = REQUIRED_FIELDS.filter((field) => item.fields[field] == null);
  if (missing.length > 0) {
    return { kind: 'malformed', detail: `missing required field(s): ${missing.join(', ')}` };
  }
  // owner-gated is matched on the leading token so its annotated variants
  // (`owner-gated 2026-… — keep until …`) all route to the same migration cure.
  if (statusToken(item.status) === ABOLISHED_STATUS) {
    return {
      kind: 'owner-gated-status',
      detail: 'owner-gated is abolished — convert to a live status and decide the item',
    };
  }
  // Conformance is strict: the raw status must be exactly an enum token. An
  // annotated-but-otherwise-live status (`pending — note`) is non-conformant.
  if (!isExactKnownStatus(item.status)) {
    return {
      kind: 'unknown-status',
      detail: `status must be a bare enum token: ${String(item.status)}`,
    };
  }
  return null;
}

/**
 * Validate every entry against the schema: an inline entry missing a required
 * field is malformed; an `owner-gated` status is its own finding kind (the
 * migration must catch it); any other unknown status is rejected; and a legacy
 * block-format capture is malformed until migrated to the inline form.
 */
export function validateRegisterItems(content: string): ItemConformanceFinding[] {
  const itemFindings = parseRegisterItems(content)
    .map(findingForItem)
    .filter((finding): finding is ItemConformanceFinding => finding != null);

  const legacyFindings: ItemConformanceFinding[] = LEGACY_BLOCK_MARKER.test(
    stripFencedBlocks(content),
  )
    ? [
        {
          kind: 'malformed',
          detail: 'legacy block-format entry — migrate to the inline-bracket schema',
        },
      ]
    : [];

  return [...itemFindings, ...legacyFindings];
}
