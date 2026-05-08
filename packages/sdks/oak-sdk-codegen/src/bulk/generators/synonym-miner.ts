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

import type { Logger } from '@oaknational/logger';
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
 * Maximum definition length accepted by pattern matching.
 *
 * @remarks
 * The synonym-extraction regexes (`alsoKnownAs`, `sometimesCalled`) have
 * polynomial worst-case complexity on adversarial whitespace input, flagged
 * by CodeQL `js/polynomial-redos`. Curriculum definitions are typically
 * under 500 chars, so this 5000-char ceiling is far above the expected input
 * range while bounding the regex's worst-case work to a safe level. Per
 * CodeQL's documented mitigation strategy: "limit the length of the input
 * string". The lookahead after optional article whitespace also prevents
 * the quantified whitespace prefix from matching unless a synonym token
 * follows.
 */
const MAX_DEFINITION_LENGTH_FOR_PATTERN_MATCHING = 5000;

/**
 * Regex patterns for synonym extraction.
 */
const PATTERNS = {
  alsoKnownAs: /also known as\s+(?:an?\s+)?(?=\S)['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
  sometimesCalled: /sometimes called\s+(?:an?\s+)?(?=\S)['"]?([^,.'"\n]+?)['"]?(?:[,.]|$)/gi,
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
  if (keyword.definition.length > MAX_DEFINITION_LENGTH_FOR_PATTERN_MATCHING) {
    return undefined;
  }

  const result = collectSynonymMatches(keyword);

  if (result.synonyms.length === 0) {
    return undefined;
  }

  return {
    term: keyword.term,
    synonyms: [...new Set(result.synonyms)], // Deduplicate
    pattern: result.pattern,
    confidence: result.confidence,
    subjects: keyword.subjects,
    occurrenceCount: result.occurrenceCount,
  };
}

interface SynonymMatchAccumulator {
  readonly synonyms: string[];
  pattern: string;
  confidence: number;
  occurrenceCount: number;
}

function collectSynonymMatches(keyword: ExtractedKeyword): SynonymMatchAccumulator {
  const result: SynonymMatchAccumulator = {
    synonyms: [],
    pattern: '',
    confidence: 0,
    occurrenceCount: 0,
  };

  collectMatchesForPattern(
    keyword,
    [...keyword.definition.matchAll(PATTERNS.alsoKnownAs)].map((match) => match[1]),
    'also known as',
    'also known as',
    2,
    result,
  );
  collectMatchesForPattern(
    keyword,
    [...keyword.definition.matchAll(PATTERNS.sometimesCalled)].map((match) => match[1]),
    'sometimes called',
    'sometimes called',
    2,
    result,
  );
  collectMatchesForPattern(
    keyword,
    [...keyword.definition.matchAll(PATTERNS.parentheticalAbbrev)].map(
      (match) => match[1] ?? match[2],
    ),
    'abbreviation',
    'parenthetical',
    2,
    result,
  );

  return result;
}

function collectMatchesForPattern(
  keyword: ExtractedKeyword,
  rawMatches: readonly (string | undefined)[],
  patternLabel: string,
  confidenceKey: keyof typeof PATTERN_CONFIDENCE,
  minLength: number,
  result: SynonymMatchAccumulator,
): void {
  for (const raw of rawMatches) {
    if (!raw) {
      continue;
    }
    const synonym = normaliseSynonym(raw);
    if (synonym.length < minLength || synonym === keyword.term.toLowerCase()) {
      continue;
    }
    result.synonyms.push(synonym);
    result.pattern = appendPatternLabel(result.pattern, patternLabel);
    result.confidence = Math.max(result.confidence, PATTERN_CONFIDENCE[confidenceKey] ?? 0);
    result.occurrenceCount += 1;
  }
}

function appendPatternLabel(pattern: string, label: string): string {
  if (!pattern) {
    return label;
  }
  return pattern.split(', ').includes(label) ? pattern : `${pattern}, ${label}`;
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
  const sortedSubjects = [...bySubject.keys()].sort((a, b) => a.localeCompare(b));

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

  lines.push(
    '} as const;',
    '',
    'export type MinedDefinitionSynonyms = typeof minedDefinitionSynonyms;',
    '',
  );

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
  logger?: Logger,
): Promise<string> {
  logger?.info('bulk.writer.write_mined_synonyms', {
    outputDir,
    generatedAt: data.generatedAt,
  });
  await mkdir(outputDir, { recursive: true });

  const fileName = 'definition-synonyms.ts';
  const filePath = join(outputDir, fileName);
  const content = serializeMinedSynonyms(data);

  await writeFile(filePath, content, 'utf-8');

  return filePath;
}
