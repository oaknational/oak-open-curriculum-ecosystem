import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  lessonSummarySchema,
  subjectSequencesSchema,
  unitSummarySchema,
  sequenceUnitsSchema,
  type SearchSubjectSequences,
  type SearchUnitSummary,
  type SearchLessonSummary,
  type SequenceUnitsResponse,
} from '@oaknational/curriculum-sdk/public/search.js';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  ensureKeyStage,
  ensureNonEmptyString,
  ensureSubject,
  getRecordKeys,
  parseStringKeyedObject,
} from './sandbox-fixture-validation';
import { ingestLogger } from '../logger';

/**
 * Canonical unit descriptor extracted from the sandbox fixture payloads.
 */
interface FixtureUnitDescriptor {
  readonly keyStage: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly unitSlug: string;
  readonly unitTitle: string;
}

/**
 * Canonical lesson group descriptor extracted from the sandbox fixture payloads.
 */
interface FixtureLessonGroup {
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

/**
 * Aggregated snapshot of all parsed fixture records.
 */
export interface FixtureData {
  readonly keyStages: readonly KeyStage[];
  readonly subjects: readonly SearchSubjectSlug[];
  readonly units: readonly FixtureUnitDescriptor[];
  readonly lessons: readonly FixtureLessonGroup[];
  readonly unitSummaries: ReadonlyMap<string, SearchUnitSummary>;
  readonly lessonSummaries: ReadonlyMap<string, SearchLessonSummary>;
  readonly lessonTranscripts: ReadonlyMap<string, FixtureLessonTranscript>;
  readonly subjectSequences: ReadonlyMap<SearchSubjectSlug, SearchSubjectSequences>;
  readonly sequenceUnits: ReadonlyMap<string, SequenceUnitsResponse>;
}

/**
 * Loads a sandbox fixture JSON file and converts it into parsed, schema-validated data.
 */
export async function loadSandboxFixtureData(fixtureRoot: string): Promise<FixtureData> {
  ingestLogger.debug('Loading sandbox fixture data', { fixtureRoot });
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
  const record = parseStringKeyedObject(value, 'unit fixture entries must be objects');
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
  const record = parseStringKeyedObject(value, 'lesson group entries must be objects');
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
  const record = parseStringKeyedObject(value, 'lesson descriptors must be objects');
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

function parseUnitSummaryMap(value: unknown): ReadonlyMap<string, SearchUnitSummary> {
  const record = parseStringKeyedObject(value, 'unit summaries must be an object keyed by slug');
  const entries = new Map<string, SearchUnitSummary>();
  for (const slug of getRecordKeys(record)) {
    entries.set(slug, unitSummarySchema.parse(record[slug]));
  }
  return entries;
}

function parseLessonSummaryMap(value: unknown): ReadonlyMap<string, SearchLessonSummary> {
  const record = parseStringKeyedObject(value, 'lesson summaries must be an object keyed by slug');
  const entries = new Map<string, SearchLessonSummary>();
  for (const slug of getRecordKeys(record)) {
    entries.set(slug, lessonSummarySchema.parse(record[slug]));
  }
  return entries;
}

function parseTranscriptMap(value: unknown): ReadonlyMap<string, FixtureLessonTranscript> {
  const record = parseStringKeyedObject(
    value,
    'lesson transcripts must be an object keyed by slug',
  );
  const entries = new Map<string, FixtureLessonTranscript>();
  for (const slug of getRecordKeys(record)) {
    const transcriptValue = record[slug];
    const transcript = parseStringKeyedObject(
      transcriptValue,
      `Invalid transcript entry for ${slug}`,
    );
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
): ReadonlyMap<SearchSubjectSlug, SearchSubjectSequences> {
  const record = parseStringKeyedObject(
    value,
    'subject sequences must be an object keyed by subject',
  );
  const entries = new Map<SearchSubjectSlug, SearchSubjectSequences>();
  for (const slug of getRecordKeys(record)) {
    const subject = ensureSubject(
      slug,
      `Invalid subject key in subject sequences fixture: ${slug}`,
    );
    entries.set(subject, subjectSequencesSchema.parse(record[slug]));
  }
  return entries;
}

function parseSequenceUnitsMap(value: unknown): ReadonlyMap<string, SequenceUnitsResponse> {
  const record = parseStringKeyedObject(
    value,
    'sequence units must be an object keyed by sequence slug',
  );
  const entries = new Map<string, SequenceUnitsResponse>();
  for (const key of getRecordKeys(record)) {
    entries.set(key, sequenceUnitsSchema.parse(record[key]));
  }
  return entries;
}
