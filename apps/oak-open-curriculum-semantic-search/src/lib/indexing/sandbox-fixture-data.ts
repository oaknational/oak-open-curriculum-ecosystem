import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  lessonSummarySchema,
  subjectSequencesSchema,
  unitSummarySchema,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isKeyStage, isSubject } from '../../adapters/sdk-guards';

/**
 * Canonical unit descriptor extracted from the sandbox fixture payloads.
 */
export interface FixtureUnitDescriptor {
  readonly keyStage: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly unitSlug: string;
  readonly unitTitle: string;
}

/**
 * Canonical lesson group descriptor extracted from the sandbox fixture payloads.
 */
export interface FixtureLessonGroup {
  readonly keyStage: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly lessons: readonly {
    lessonSlug: string;
    lessonTitle: string;
  }[];
}

interface FixtureLessonTranscript {
  readonly transcript: string;
  readonly vtt: string;
}

type UnknownFixtureRecord = Readonly<Record<string, unknown>>;

/**
 * Aggregated snapshot of all parsed fixture records.
 */
export interface FixtureData {
  readonly keyStages: readonly KeyStage[];
  readonly subjects: readonly SearchSubjectSlug[];
  readonly units: readonly FixtureUnitDescriptor[];
  readonly lessons: readonly FixtureLessonGroup[];
  readonly unitSummaries: ReadonlyMap<string, unknown>;
  readonly lessonSummaries: ReadonlyMap<string, unknown>;
  readonly lessonTranscripts: ReadonlyMap<string, FixtureLessonTranscript>;
  readonly subjectSequences: ReadonlyMap<SearchSubjectSlug, readonly unknown[]>;
  readonly sequenceUnits: ReadonlyMap<string, unknown>;
}

/**
 * Loads a sandbox fixture JSON file and converts it into parsed, schema-validated data.
 */
export async function loadSandboxFixtureData(fixtureRoot: string): Promise<FixtureData> {
  return {
    keyStages: parseKeyStages(await loadJson(fixtureRoot, 'key-stages.json')),
    subjects: parseSubjects(await loadJson(fixtureRoot, 'subjects.json')),
    units: parseUnits(await loadJson(fixtureRoot, 'units.json')),
    lessons: parseLessonGroups(await loadJson(fixtureRoot, 'lessons.json')),
    unitSummaries: parseUnitSummaryMap(await loadJson(fixtureRoot, 'unit-summaries.json')),
    lessonSummaries: parseLessonSummaryMap(await loadJson(fixtureRoot, 'lesson-summaries.json')),
    lessonTranscripts: parseTranscriptMap(await loadJson(fixtureRoot, 'lesson-transcripts.json')),
    subjectSequences: parseSubjectSequenceMap(
      await loadJson(fixtureRoot, 'subject-sequences.json'),
    ),
    sequenceUnits: parseSequenceUnitsMap(await loadJson(fixtureRoot, 'sequence-units.json')),
  };
}

async function loadJson(root: string, fileName: string): Promise<unknown> {
  const filePath = path.join(root, fileName);
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function parseKeyStages(value: unknown): KeyStage[] {
  if (!Array.isArray(value)) {
    throw new Error('key-stages fixture must be an array');
  }
  return value.map((entry) => ensureKeyStage(entry, 'Invalid key stage in sandbox fixture'));
}

function parseSubjects(value: unknown): SearchSubjectSlug[] {
  if (!Array.isArray(value)) {
    throw new Error('subjects fixture must be an array');
  }
  return value.map((entry) => ensureSubject(entry, 'Invalid subject in sandbox fixture'));
}

function parseUnits(value: unknown): FixtureUnitDescriptor[] {
  if (!Array.isArray(value)) {
    throw new Error('units fixture must be an array');
  }
  return value.map((entry) => parseUnitDescriptor(entry));
}

function parseUnitDescriptor(value: unknown): FixtureUnitDescriptor {
  const record = assertRecord(value, 'unit fixture entries must be objects');
  return {
    keyStage: ensureKeyStage(record.keyStage, 'Invalid unit keyStage value'),
    subject: ensureSubject(record.subject, 'Invalid unit subject value'),
    unitSlug: ensureNonEmptyString(record.unitSlug, 'unitSlug is required for unit fixtures'),
    unitTitle: ensureNonEmptyString(record.unitTitle, 'unitTitle is required for unit fixtures'),
  };
}

function parseLessonGroups(value: unknown): FixtureLessonGroup[] {
  if (!Array.isArray(value)) {
    throw new Error('lessons fixture must be an array');
  }
  return value.map((entry) => parseLessonGroup(entry));
}

function parseLessonGroup(value: unknown): FixtureLessonGroup {
  const record = assertRecord(value, 'lesson group entries must be objects');
  const lessonsValue = record.lessons;
  if (!Array.isArray(lessonsValue)) {
    throw new Error('lessons must be an array within lesson groups');
  }
  return {
    keyStage: ensureKeyStage(record.keyStage, 'Invalid lesson group keyStage'),
    subject: ensureSubject(record.subject, 'Invalid lesson group subject'),
    unitSlug: ensureNonEmptyString(record.unitSlug, 'unitSlug is required for lesson groups'),
    unitTitle: ensureNonEmptyString(record.unitTitle, 'unitTitle is required for lesson groups'),
    lessons: lessonsValue.map((lesson) => parseLessonDescriptor(lesson)),
  };
}

function parseLessonDescriptor(value: unknown): { lessonSlug: string; lessonTitle: string } {
  const record = assertRecord(value, 'lesson descriptors must be objects');
  return {
    lessonSlug: ensureNonEmptyString(
      record.lessonSlug,
      'lessonSlug is required for lesson descriptors',
    ),
    lessonTitle: ensureNonEmptyString(
      record.lessonTitle,
      'lessonTitle is required for lesson descriptors',
    ),
  };
}

function parseUnitSummaryMap(value: unknown): ReadonlyMap<string, unknown> {
  const record = assertRecord(value, 'unit summaries must be an object keyed by slug');
  const entries = new Map<string, unknown>();
  for (const [slug, summary] of Object.entries(record)) {
    entries.set(slug, unitSummarySchema.parse(summary));
  }
  return entries;
}

function parseLessonSummaryMap(value: unknown): ReadonlyMap<string, unknown> {
  const record = assertRecord(value, 'lesson summaries must be an object keyed by slug');
  const entries = new Map<string, unknown>();
  for (const [slug, summary] of Object.entries(record)) {
    entries.set(slug, lessonSummarySchema.parse(summary));
  }
  return entries;
}

function parseTranscriptMap(value: unknown): ReadonlyMap<string, FixtureLessonTranscript> {
  const record = assertRecord(value, 'lesson transcripts must be an object keyed by slug');
  const entries = new Map<string, FixtureLessonTranscript>();
  for (const [slug, transcriptValue] of Object.entries(record)) {
    const transcript = assertRecord(transcriptValue, `Invalid transcript entry for ${slug}`);
    entries.set(slug, {
      transcript: ensureNonEmptyString(
        transcript.transcript,
        `Transcript text missing for ${slug}`,
      ),
      vtt: ensureNonEmptyString(transcript.vtt, `Transcript VTT missing for ${slug}`),
    });
  }
  return entries;
}

function parseSubjectSequenceMap(
  value: unknown,
): ReadonlyMap<SearchSubjectSlug, readonly unknown[]> {
  const record = assertRecord(value, 'subject sequences must be an object keyed by subject');
  const entries = new Map<SearchSubjectSlug, readonly unknown[]>();
  for (const [slug, sequences] of Object.entries(record)) {
    const subject = ensureSubject(
      slug,
      `Invalid subject key in subject sequences fixture: ${slug}`,
    );
    entries.set(subject, subjectSequencesSchema.parse(sequences));
  }
  return entries;
}

function parseSequenceUnitsMap(value: unknown): ReadonlyMap<string, unknown> {
  const record = assertRecord(value, 'sequence units must be an object keyed by sequence slug');
  return new Map<string, unknown>(Object.entries(record));
}

function assertRecord(value: unknown, errorMessage: string): UnknownFixtureRecord {
  if (!isRecord(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function ensureKeyStage(value: unknown, errorMessage: string): KeyStage {
  if (typeof value !== 'string' || !isKeyStage(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function ensureSubject(value: unknown, errorMessage: string): SearchSubjectSlug {
  if (typeof value !== 'string' || !isSubject(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function ensureNonEmptyString(value: unknown, errorMessage: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(errorMessage);
  }
  return value;
}

function isRecord(value: unknown): value is UnknownFixtureRecord {
  return typeof value === 'object' && value !== null;
}
