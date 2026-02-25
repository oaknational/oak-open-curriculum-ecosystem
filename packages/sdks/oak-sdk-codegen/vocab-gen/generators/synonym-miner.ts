/* eslint-disable max-lines -- generator with serialisation requires length */

/**
 * Synonym miner for extracting synonyms from keyword definitions.
 *
 * @remarks
 * Mines synonyms from curriculum keyword definitions using patterns like
 * "also known as", "sometimes called", and parenthetical alternatives.
 * These mined synonyms supplement the curated synonyms but never replace them.

 */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import type { ExtractedKeyword } from '../extractors/index.js';

/**
 * A mined synonym with metadata.
 */
export interface MinedSynonym {
  /** The canonical term (normalised keyword) */
  readonly term: string;
  /** Array of extracted synonyms */
  readonly synonyms: readonly string[];
  /** The pattern that matched (e.g., "also known as") */
  readonly pattern: string;
  /** Confidence score 0-1 based on pattern clarity */
  readonly confidence: number;
  /** Subjects where this term appears */
  readonly subjects: readonly string[];
  /** Number of times this pattern was found */
  readonly occurrenceCount: number;
}

/**
 * Statistics about the synonym mining process.
 */
export interface MinedSynonymsStats {
  readonly totalKeywordsProcessed: number;
  readonly synonymsExtracted: number;
  /** Keys are pattern names from the extraction pipeline (runtime-defined). */
  readonly patternCounts: Readonly<Record<string, number>>;
}

/**
 * Complete mined synonyms data structure.
 */
export interface MinedSynonymsData {
  readonly version: string;
  readonly generatedAt: string;
  readonly stats: MinedSynonymsStats;
  readonly synonyms: readonly MinedSynonym[];
}

/**
 * Pattern types with confidence scores.
 * Higher confidence for more explicit patterns.
 */
const PATTERN_CONFIDENCE: Readonly<Record<string, number>> = {
  'also known as': 0.9,
  'sometimes called': 0.85,
  or: 0.6,
  parenthetical: 0.5,
};

/**
 * Regex patterns for synonym extraction.
 */
const PATTERNS = {
  alsoKnownAs: /also known as\s+(?:an?\s+)?['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
  sometimesCalled: /sometimes called\s+(?:an?\s+)?['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
  parentheticalAbbrev: /['"]([A-Z]{2,6})['"]|also known as\s+['"]?([A-Z]{2,6})['"]?/gi,
} as const;

/**
 * Cleans and normalises an extracted synonym.
 */
function normaliseSynonym(raw: string): string {
  return raw.trim().toLowerCase().replace(/['"]/g, '');
}

/**
 * Extracts synonyms from a keyword definition.
 *
 * @param keyword - The keyword with definition to process
 * @returns MinedSynonym if patterns match, undefined otherwise
 */
export function extractSynonymFromDefinition(keyword: ExtractedKeyword): MinedSynonym | undefined {
  const definition = keyword.definition;
  const synonyms: string[] = [];
  let pattern = '';
  let confidence = 0;
  let occurrenceCount = 0;

  // Check for "also known as" pattern
  const akaMatches = [...definition.matchAll(PATTERNS.alsoKnownAs)];
  for (const match of akaMatches) {
    if (match[1]) {
      const synonym = normaliseSynonym(match[1]);
      if (synonym.length > 1 && synonym !== keyword.term.toLowerCase()) {
        synonyms.push(synonym);
        pattern = 'also known as';
        confidence = Math.max(confidence, PATTERN_CONFIDENCE['also known as'] ?? 0);
        occurrenceCount++;
      }
    }
  }

  // Check for "sometimes called" pattern
  const scMatches = [...definition.matchAll(PATTERNS.sometimesCalled)];
  for (const match of scMatches) {
    if (match[1]) {
      const synonym = normaliseSynonym(match[1]);
      if (synonym.length > 1 && synonym !== keyword.term.toLowerCase()) {
        synonyms.push(synonym);
        pattern = pattern ? `${pattern}, sometimes called` : 'sometimes called';
        confidence = Math.max(confidence, PATTERN_CONFIDENCE['sometimes called'] ?? 0);
        occurrenceCount++;
      }
    }
  }

  // Check for parenthetical abbreviations (e.g., 'PPE')
  const abbrevMatches = [...definition.matchAll(PATTERNS.parentheticalAbbrev)];
  for (const match of abbrevMatches) {
    const abbrev = match[1] ?? match[2];
    if (abbrev) {
      const synonym = normaliseSynonym(abbrev);
      if (synonym.length >= 2 && synonym !== keyword.term.toLowerCase()) {
        synonyms.push(synonym);
        pattern = pattern ? `${pattern}, abbreviation` : 'abbreviation';
        confidence = Math.max(confidence, PATTERN_CONFIDENCE['parenthetical'] ?? 0);
        occurrenceCount++;
      }
    }
  }

  if (synonyms.length === 0) {
    return undefined;
  }

  return {
    term: keyword.term,
    synonyms: [...new Set(synonyms)], // Deduplicate
    pattern,
    confidence,
    subjects: keyword.subjects,
    occurrenceCount,
  };
}

/**
 * Generates mined synonyms from extracted keywords.
 *
 * @param keywords - Array of extracted keywords with definitions
 * @returns MinedSynonymsData with all extracted synonyms and stats
 */
export function generateMinedSynonyms(keywords: readonly ExtractedKeyword[]): MinedSynonymsData {
  const synonyms: MinedSynonym[] = [];
  const patternCounts: Record<string, number> = {};

  for (const keyword of keywords) {
    const mined = extractSynonymFromDefinition(keyword);
    if (mined) {
      synonyms.push(mined);
      // Track pattern counts
      const patterns = mined.pattern.split(', ');
      for (const p of patterns) {
        patternCounts[p] = (patternCounts[p] ?? 0) + 1;
      }
    }
  }

  // Sort by confidence descending
  synonyms.sort((a, b) => b.confidence - a.confidence);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    stats: {
      totalKeywordsProcessed: keywords.length,
      synonymsExtracted: synonyms.length,
      patternCounts,
    },
    synonyms,
  };
}

/**
 * Serializes mined synonyms to TypeScript format.
 *
 * @param data - The mined synonyms data
 * @returns TypeScript source code string
 */
export function serializeMinedSynonyms(data: MinedSynonymsData): string {
  const lines: string[] = [
    '/* eslint-disable max-lines -- generated static synonym data file */',
    '/**',
    ' * Generated synonyms mined from curriculum keyword definitions.',
    ' *',
    ' * @remarks',
    ' * - Generated by `pnpm vocab-gen`',
    ` * - Generated: ${data.generatedAt}`,
    ` * - Synonyms extracted: ${data.stats.synonymsExtracted}`,
    ' * - These synonyms SUPPLEMENT curated synonyms, they do not replace them',
    ' * - Curated synonyms always take priority over mined synonyms',
    ' *',
    ' * @see ADR-063 for synonym source of truth',
    ' * @see ADR-086 for vocab-gen pattern',
    ' */',
    '',
    '/**',
    ' * Mined synonyms from "also known as" and similar patterns in definitions.',
    ' *',
    ' * @remarks',
    ' * Higher confidence synonyms come from explicit patterns like "also known as".',
    ' * Lower confidence synonyms come from parenthetical alternatives.',
    ' */',
    'export const minedDefinitionSynonyms = {',
  ];

  // Group by first subject for organisation
  const bySubject = new Map<string, MinedSynonym[]>();
  for (const syn of data.synonyms) {
    const subject = syn.subjects[0] ?? 'general';
    const existing = bySubject.get(subject);
    if (existing) {
      existing.push(syn);
    } else {
      bySubject.set(subject, [syn]);
    }
  }

  // Sort subjects alphabetically
  const sortedSubjects = [...bySubject.keys()].sort();

  for (const subject of sortedSubjects) {
    const subjectSynonyms = bySubject.get(subject);
    if (!subjectSynonyms) {
      continue;
    }

    lines.push(`  // ${subject.toUpperCase()}`);
    for (const syn of subjectSynonyms) {
      const synonymsStr = syn.synonyms.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(', ');
      lines.push(`  '${syn.term.replace(/'/g, "\\'")}': [${synonymsStr}],`);
    }
    lines.push('');
  }

  lines.push('} as const;');
  lines.push('');
  lines.push('export type MinedDefinitionSynonyms = typeof minedDefinitionSynonyms;');
  lines.push('');

  return lines.join('\n');
}

/**
 * Writes mined synonyms to a TypeScript file.
 *
 * @param data - The mined synonyms data
 * @param outputDir - Base directory for synonyms output
 * @returns Path to the written file
 */
export async function writeMinedSynonymsFile(
  data: MinedSynonymsData,
  outputDir: string,
): Promise<string> {
  const generatedDir = join(outputDir, 'generated');
  await mkdir(generatedDir, { recursive: true });

  const fileName = 'definition-synonyms.ts';
  const filePath = join(generatedDir, fileName);
  const content = serializeMinedSynonyms(data);

  await writeFile(filePath, content, 'utf-8');

  return filePath;
}
