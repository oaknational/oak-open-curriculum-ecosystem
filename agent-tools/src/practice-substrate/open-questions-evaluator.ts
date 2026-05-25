import { finding } from './finding.js';
import { type OpenQuestionsSnapshot, type SubstrateFinding } from './types.js';

const DEFAULT_OPEN_ENTRY_LIMIT = 10;
const ENTRY_HEADING = /^### (Q-\d{3}): .+$/gm;
const REQUIRED_FIELDS = [
  'Raised by',
  'Context',
  'Why deferred',
  'Suggested resolution path',
  'Status',
  'Linked',
] as const;
const STATUSES = new Set(['open', 'answered-in-place', 'surfaced-to-owner', 'withdrawn']);

interface OpenQuestionEntry {
  readonly id: string;
  readonly body: string;
}

/**
 * Validate the structural contract of the open-questions operational register.
 */
export function evaluateOpenQuestions(
  snapshot: OpenQuestionsSnapshot,
): readonly SubstrateFinding[] {
  const entries = parseEntries(snapshot.text);
  const findings = [
    ...evaluateDuplicateIds(snapshot, entries),
    ...evaluateRequiredFields(snapshot, entries),
    ...evaluateStatuses(snapshot, entries),
  ];

  return [...findings, ...evaluateBackpressure(snapshot, entries)];
}

function parseEntries(text: string): readonly OpenQuestionEntry[] {
  const matches = [...text.matchAll(ENTRY_HEADING)];

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const nextStart = matches[index + 1]?.index ?? text.length;

    return {
      id: match[1] ?? '',
      body: text.slice(start, nextStart),
    };
  });
}

function evaluateDuplicateIds(
  snapshot: OpenQuestionsSnapshot,
  entries: readonly OpenQuestionEntry[],
): readonly SubstrateFinding[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) {
      duplicates.add(entry.id);
    }
    seen.add(entry.id);
  }

  return [...duplicates].map((id) =>
    finding({
      id: 'open-questions-duplicate-id',
      surface: snapshot.surface,
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message: `Open questions register repeats question identity ${id}.`,
      evidence: [snapshot.path],
    }),
  );
}

function evaluateRequiredFields(
  snapshot: OpenQuestionsSnapshot,
  entries: readonly OpenQuestionEntry[],
): readonly SubstrateFinding[] {
  return entries.flatMap((entry) =>
    REQUIRED_FIELDS.flatMap((field) => {
      if (readField(entry.body, field) !== undefined) {
        return [];
      }

      return [
        finding({
          id: 'open-questions-missing-field',
          surface: snapshot.surface,
          severity: 'blocking',
          repair: 'manual-with-provenance',
          message: `Open question ${entry.id} is missing required field ${field}.`,
          evidence: [snapshot.path],
        }),
      ];
    }),
  );
}

function evaluateStatuses(
  snapshot: OpenQuestionsSnapshot,
  entries: readonly OpenQuestionEntry[],
): readonly SubstrateFinding[] {
  return entries.flatMap((entry) => {
    const status = readStatus(entry.body);
    if (status === undefined || STATUSES.has(status)) {
      return [];
    }

    return [
      finding({
        id: 'open-questions-invalid-status',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `Open question ${entry.id} has unsupported status ${status}.`,
        evidence: [snapshot.path],
      }),
    ];
  });
}

function evaluateBackpressure(
  snapshot: OpenQuestionsSnapshot,
  entries: readonly OpenQuestionEntry[],
): readonly SubstrateFinding[] {
  const limit = snapshot.openEntryLimit ?? DEFAULT_OPEN_ENTRY_LIMIT;
  const openEntries = entries.filter((entry) => readStatus(entry.body) === 'open');
  if (openEntries.length <= limit) {
    return [];
  }

  return [
    finding({
      id: 'open-questions-backpressure',
      surface: snapshot.surface,
      severity: 'informational',
      repair: 'manual-with-provenance',
      message:
        `Open questions register has ${openEntries.length} open entries; ` +
        `consolidation cadence should drain entries above ${limit}.`,
      evidence: [snapshot.path],
    }),
  ];
}

function readStatus(entryBody: string): string | undefined {
  return readField(entryBody, 'Status')?.split(/\s+/)[0];
}

function readField(entryBody: string, field: (typeof REQUIRED_FIELDS)[number]): string | undefined {
  const fieldPattern = new RegExp(`^- ${escapeRegExp(field)}:\\s*(.+)$`, 'm');
  const value = fieldPattern.exec(entryBody)?.[1]?.trim();

  return value === undefined || value.length === 0 ? undefined : value;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
