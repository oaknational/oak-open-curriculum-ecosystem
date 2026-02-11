/**
 * API checker functions for validating slugs exist.
 */

import { z } from 'zod';
import { API_BASE } from './api-helpers';

// ============ ZOD SCHEMAS ============

const UnitEntrySchema = z.object({
  unitSlug: z.string(),
});

const TierEntrySchema = z.object({
  units: z.array(UnitEntrySchema),
});

const YearEntrySchema = z.object({
  year: z.number(),
  units: z.array(UnitEntrySchema).optional(),
  tiers: z.array(TierEntrySchema).optional(),
});

type YearEntry = z.infer<typeof YearEntrySchema>;
type TierEntry = z.infer<typeof TierEntrySchema>;

const YearEntriesArraySchema = z.array(YearEntrySchema);

const SubjectEntrySchema = z.object({
  subjectSlug: z.string(),
});

const SubjectsArraySchema = z.array(SubjectEntrySchema);

const SequenceEntrySchema = z.object({
  sequenceSlug: z.string(),
});

const SequencesArraySchema = z.array(SequenceEntrySchema);

// ============ LESSONS ============

/**
 * Checks if a lesson slug exists in the Oak API.
 * @param slug - Lesson slug to check
 * @param apiKey - Oak API key
 * @returns True if the lesson exists
 */
export async function checkLessonExists(slug: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/lessons/${slug}/summary`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

// ============ UNITS ============

let cachedUnitSlugs: Set<string> | null = null;

/** Extract unit slugs from a tier. */
function extractSlugsFromTier(tier: TierEntry, slugs: Set<string>): void {
  for (const unit of tier.units) {
    slugs.add(unit.unitSlug);
  }
}

/** Extract unit slugs from a year entry's tiers. */
function extractSlugsFromTiers(tiers: readonly TierEntry[], slugs: Set<string>): void {
  for (const tier of tiers) {
    extractSlugsFromTier(tier, slugs);
  }
}

/** Extract all unit slugs from a year entry. */
function extractSlugsFromYearEntry(entry: YearEntry, slugs: Set<string>): void {
  if (entry.units) {
    for (const unit of entry.units) {
      slugs.add(unit.unitSlug);
    }
  }
  if (entry.tiers) {
    extractSlugsFromTiers(entry.tiers, slugs);
  }
}

/** Fetch and parse the units response from the API. */
async function fetchUnitsFromApi(apiKey: string): Promise<readonly YearEntry[]> {
  const response = await fetch(`${API_BASE}/sequences/maths-secondary/units`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch units: ${response.status}`);
  }

  const data: unknown = await response.json();
  const parsed = YearEntriesArraySchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(`Units response validation failed: ${parsed.error.message}`);
  }

  return parsed.data;
}

async function loadAvailableUnitSlugs(apiKey: string): Promise<Set<string>> {
  if (cachedUnitSlugs) {
    return cachedUnitSlugs;
  }

  const yearEntries = await fetchUnitsFromApi(apiKey);
  const slugs = new Set<string>();

  for (const entry of yearEntries) {
    extractSlugsFromYearEntry(entry, slugs);
  }

  cachedUnitSlugs = slugs;
  return slugs;
}

/**
 * Checks if a unit slug exists in the Oak API.
 * @param slug - Unit slug to check
 * @param apiKey - Oak API key
 * @returns True if the unit exists
 */
export async function checkUnitExists(slug: string, apiKey: string): Promise<boolean> {
  const available = await loadAvailableUnitSlugs(apiKey);
  return available.has(slug);
}

// ============ SEQUENCES ============

let cachedSequenceSlugs: Set<string> | null = null;

async function fetchSequenceSlugsForSubject(
  subjectSlug: string,
  apiKey: string,
  slugs: Set<string>,
): Promise<void> {
  const seqRes = await fetch(`${API_BASE}/subjects/${subjectSlug}/sequences`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!seqRes.ok) {
    return;
  }

  const seqData: unknown = await seqRes.json();
  const parsed = SequencesArraySchema.safeParse(seqData);

  if (!parsed.success) {
    return;
  }

  for (const seq of parsed.data) {
    slugs.add(seq.sequenceSlug);
  }
}

async function loadAvailableSequenceSlugs(apiKey: string): Promise<Set<string>> {
  if (cachedSequenceSlugs) {
    return cachedSequenceSlugs;
  }

  const subjectsRes = await fetch(`${API_BASE}/subjects`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!subjectsRes.ok) {
    throw new Error(`Failed to fetch subjects: ${subjectsRes.status}`);
  }

  const subjectsData: unknown = await subjectsRes.json();
  const parsed = SubjectsArraySchema.safeParse(subjectsData);

  if (!parsed.success) {
    throw new Error(`Subjects response validation failed: ${parsed.error.message}`);
  }

  const slugs = new Set<string>();
  for (const subject of parsed.data) {
    await fetchSequenceSlugsForSubject(subject.subjectSlug, apiKey, slugs);
  }

  cachedSequenceSlugs = slugs;
  return slugs;
}

/**
 * Checks if a sequence slug exists in the Oak API.
 * @param slug - Sequence slug to check
 * @param apiKey - Oak API key
 * @returns True if the sequence exists
 */
export async function checkSequenceExists(slug: string, apiKey: string): Promise<boolean> {
  const available = await loadAvailableSequenceSlugs(apiKey);
  return available.has(slug);
}
