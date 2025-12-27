/* eslint-disable max-lines -- generator with serialisation requires length */
/* eslint-disable max-lines-per-function -- serialisation functions are long by nature */
/* eslint-disable complexity -- synonym pattern extraction is inherently complex */
/**
 * Analysis report generator for the vocabulary mining pipeline.
 *
 * @remarks
 * Generates exploratory analysis reports from extracted data.
 * These reports provide insights into vocabulary patterns, synonym opportunities,
 * and misconception density to inform subsequent generators.
 *
 * @module vocab-gen/generators/analysis-report-generator
 */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import { typeSafeEntries } from '../../src/types/helpers/type-helpers.js';
import type { ExtractedData } from '../vocab-gen-core.js';

/**
 * A keyword frequency entry for top keywords analysis.
 */
export interface KeywordFrequencyEntry {
  readonly term: string;
  readonly frequency: number;
  readonly subjects: readonly string[];
}

/**
 * A cross-subject term entry.
 */
export interface CrossSubjectTermEntry {
  readonly term: string;
  readonly subjectCount: number;
  readonly subjects: readonly string[];
}

/**
 * A synonym candidate extracted from definitions.
 */
export interface SynonymCandidate {
  readonly term: string;
  readonly synonyms: readonly string[];
  readonly pattern: string;
}

/**
 * Subject ranking entry for misconception or NC coverage analysis.
 */
export interface SubjectRankEntry {
  readonly subject: string;
  readonly count: number;
}

/**
 * Keyword statistics from the analysis.
 */
export interface KeywordStats {
  readonly totalUniqueKeywords: number;
  readonly topByFrequency: readonly KeywordFrequencyEntry[];
  readonly crossSubjectTerms: readonly CrossSubjectTermEntry[];
  readonly firstYearDistribution: Readonly<Record<number, number>>;
}

/**
 * Synonym pattern analysis results.
 */
export interface SynonymPatterns {
  readonly alsoKnownAsCount: number;
  readonly parentheticalCount: number;
  readonly orPatternCount: number;
  readonly candidates: readonly SynonymCandidate[];
}

/**
 * Misconception density analysis results.
 */
export interface MisconceptionDensity {
  readonly total: number;
  readonly bySubject: Readonly<Record<string, number>>;
  readonly topSubjects: readonly SubjectRankEntry[];
}

/**
 * National Curriculum coverage analysis results.
 */
export interface NCCoverage {
  readonly total: number;
  readonly bySubject: Readonly<Record<string, number>>;
  readonly mostStatements: readonly SubjectRankEntry[];
  readonly fewestStatements: readonly SubjectRankEntry[];
}

/**
 * Summary statistics for the analysis report.
 */
export interface AnalysisSummary {
  readonly totalKeywords: number;
  readonly totalMisconceptions: number;
  readonly totalLearningPoints: number;
  readonly totalTeacherTips: number;
  readonly totalPriorKnowledge: number;
  readonly totalNCStatements: number;
  readonly totalThreads: number;
}

/**
 * Complete analysis report structure.
 */
export interface AnalysisReport {
  readonly generatedAt: string;
  readonly keywordStats: KeywordStats;
  readonly synonymPatterns: SynonymPatterns;
  readonly misconceptionDensity: MisconceptionDensity;
  readonly ncCoverage: NCCoverage;
  readonly summary: AnalysisSummary;
}

/**
 * Regex patterns for extracting synonyms from definitions.
 */
const SYNONYM_PATTERNS = {
  alsoKnownAs: /also known as\s+(?:an?\s+)?([^,.]+)/gi,
  sometimesCalled: /sometimes called\s+(?:an?\s+)?([^,.]+)/gi,
  orPattern: /,\s+or\s+([^,.]+)/gi,
  parenthetical: /\(([^)]+)\)/g,
} as const;

/**
 * Extracts synonym candidates from a definition string.
 */
function extractSynonymsFromDefinition(
  term: string,
  definition: string,
): SynonymCandidate | undefined {
  const synonyms: string[] = [];
  let pattern = '';

  // Check for "also known as" pattern
  const akaMatches = definition.matchAll(SYNONYM_PATTERNS.alsoKnownAs);
  for (const match of akaMatches) {
    if (match[1]) {
      synonyms.push(match[1].trim().toLowerCase());
      pattern = 'also known as';
    }
  }

  // Check for "sometimes called" pattern
  const scMatches = definition.matchAll(SYNONYM_PATTERNS.sometimesCalled);
  for (const match of scMatches) {
    if (match[1]) {
      synonyms.push(match[1].trim().toLowerCase());
      pattern = pattern ? `${pattern}, sometimes called` : 'sometimes called';
    }
  }

  // Check for "or" pattern (only if preceded by comma)
  const orMatches = definition.matchAll(SYNONYM_PATTERNS.orPattern);
  for (const match of orMatches) {
    if (match[1]) {
      synonyms.push(match[1].trim().toLowerCase());
      pattern = pattern ? `${pattern}, or` : 'or';
    }
  }

  if (synonyms.length === 0) {
    return undefined;
  }

  return {
    term,
    synonyms,
    pattern,
  };
}

/**
 * Counts occurrences of a pattern in all definitions.
 */
function countPatternOccurrences(keywords: ExtractedData['keywords'], pattern: RegExp): number {
  let count = 0;
  for (const keyword of keywords) {
    const matches = keyword.definition.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

/**
 * Generates keyword statistics from extracted keywords.
 */
function generateKeywordStats(keywords: ExtractedData['keywords']): KeywordStats {
  // Sort by frequency descending to ensure correct ordering
  const sortedKeywords = [...keywords].sort((a, b) => b.frequency - a.frequency);

  // Top by frequency
  const topByFrequency: KeywordFrequencyEntry[] = sortedKeywords.slice(0, 50).map((kw) => ({
    term: kw.term,
    frequency: kw.frequency,
    subjects: kw.subjects,
  }));

  // Cross-subject terms (keywords in 2+ subjects), sorted by subject count then frequency
  const crossSubjectTerms: CrossSubjectTermEntry[] = sortedKeywords
    .filter((kw) => kw.subjects.length >= 2)
    .sort((a, b) => b.subjects.length - a.subjects.length || b.frequency - a.frequency)
    .slice(0, 50)
    .map((kw) => ({
      term: kw.term,
      subjectCount: kw.subjects.length,
      subjects: kw.subjects,
    }));

  // First year distribution
  const firstYearDistribution: Record<number, number> = {};
  for (const keyword of keywords) {
    const year = keyword.firstYear;
    firstYearDistribution[year] = (firstYearDistribution[year] ?? 0) + 1;
  }

  return {
    totalUniqueKeywords: keywords.length,
    topByFrequency,
    crossSubjectTerms,
    firstYearDistribution,
  };
}

/**
 * Generates synonym pattern analysis from extracted keywords.
 */
function generateSynonymPatterns(keywords: ExtractedData['keywords']): SynonymPatterns {
  const alsoKnownAsCount = countPatternOccurrences(keywords, SYNONYM_PATTERNS.alsoKnownAs);
  const parentheticalCount = countPatternOccurrences(keywords, SYNONYM_PATTERNS.parenthetical);
  const orPatternCount = countPatternOccurrences(keywords, SYNONYM_PATTERNS.orPattern);

  const candidates: SynonymCandidate[] = [];
  for (const keyword of keywords) {
    const candidate = extractSynonymsFromDefinition(keyword.term, keyword.definition);
    if (candidate) {
      candidates.push(candidate);
    }
  }

  return {
    alsoKnownAsCount,
    parentheticalCount,
    orPatternCount,
    candidates,
  };
}

/**
 * Generates misconception density analysis.
 */
function generateMisconceptionDensity(
  misconceptions: ExtractedData['misconceptions'],
): MisconceptionDensity {
  const bySubject: Record<string, number> = {};
  for (const misconception of misconceptions) {
    const subject = misconception.subject;
    bySubject[subject] = (bySubject[subject] ?? 0) + 1;
  }

  // Sort subjects by count descending
  const sortedSubjects: SubjectRankEntry[] = typeSafeEntries(bySubject)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: misconceptions.length,
    bySubject,
    topSubjects: sortedSubjects.slice(0, 10),
  };
}

/**
 * Generates NC coverage analysis.
 */
function generateNCCoverage(ncStatements: ExtractedData['ncStatements']): NCCoverage {
  const bySubject: Record<string, number> = {};
  for (const statement of ncStatements) {
    const subject = statement.subject;
    bySubject[subject] = (bySubject[subject] ?? 0) + 1;
  }

  // Sort subjects by count
  const sortedSubjects: SubjectRankEntry[] = typeSafeEntries(bySubject)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: ncStatements.length,
    bySubject,
    mostStatements: sortedSubjects.slice(0, 5),
    fewestStatements: sortedSubjects.slice(-5).reverse(),
  };
}

/**
 * Generates summary statistics.
 */
function generateSummary(extractedData: ExtractedData): AnalysisSummary {
  return {
    totalKeywords: extractedData.keywords.length,
    totalMisconceptions: extractedData.misconceptions.length,
    totalLearningPoints: extractedData.learningPoints.length,
    totalTeacherTips: extractedData.teacherTips.length,
    totalPriorKnowledge: extractedData.priorKnowledge.length,
    totalNCStatements: extractedData.ncStatements.length,
    totalThreads: extractedData.threads.length,
  };
}

/**
 * Generates an analysis report from extracted vocabulary data.
 *
 * @param extractedData - The extracted vocabulary data from the mining pipeline
 * @returns Analysis report with statistics and insights
 *
 * @example
 * ```ts
 * const report = generateAnalysisReport(extractedData);
 * console.log(`Found ${report.synonymPatterns.candidates.length} synonym candidates`);
 * ```
 */
export function generateAnalysisReport(extractedData: ExtractedData): AnalysisReport {
  return {
    generatedAt: new Date().toISOString(),
    keywordStats: generateKeywordStats(extractedData.keywords),
    synonymPatterns: generateSynonymPatterns(extractedData.keywords),
    misconceptionDensity: generateMisconceptionDensity(extractedData.misconceptions),
    ncCoverage: generateNCCoverage(extractedData.ncStatements),
    summary: generateSummary(extractedData),
  };
}

/**
 * Serializes an analysis report to markdown format.
 *
 * @param report - The analysis report to serialize
 * @returns Markdown content string
 */
export function serializeAnalysisReport(report: AnalysisReport): string {
  const lines: string[] = [
    '# Bulk Data Analysis Report',
    '',
    `**Generated**: ${report.generatedAt}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    `| Keywords (unique) | ${report.summary.totalKeywords.toLocaleString()} |`,
    `| Misconceptions | ${report.summary.totalMisconceptions.toLocaleString()} |`,
    `| Learning Points | ${report.summary.totalLearningPoints.toLocaleString()} |`,
    `| Teacher Tips | ${report.summary.totalTeacherTips.toLocaleString()} |`,
    `| Prior Knowledge | ${report.summary.totalPriorKnowledge.toLocaleString()} |`,
    `| NC Statements | ${report.summary.totalNCStatements.toLocaleString()} |`,
    `| Threads | ${report.summary.totalThreads.toLocaleString()} |`,
    '',
    '---',
    '',
    '## Keyword Statistics',
    '',
    `### Total Unique Keywords: ${report.keywordStats.totalUniqueKeywords.toLocaleString()}`,
    '',
    '### Top 20 by Frequency',
    '',
    '| Rank | Term | Frequency | Subjects |',
    '|------|------|-----------|----------|',
    ...report.keywordStats.topByFrequency
      .slice(0, 20)
      .map((kw, i) => `| ${i + 1} | ${kw.term} | ${kw.frequency} | ${kw.subjects.join(', ')} |`),
    '',
    '### Cross-Subject Terms (appearing in 2+ subjects)',
    '',
    '| Term | Subject Count | Subjects |',
    '|------|---------------|----------|',
    ...report.keywordStats.crossSubjectTerms
      .slice(0, 20)
      .map((kw) => `| ${kw.term} | ${kw.subjectCount} | ${kw.subjects.join(', ')} |`),
    '',
    '### First Year Distribution',
    '',
    '| Year | Keywords Introduced |',
    '|------|---------------------|',
    ...typeSafeEntries(report.keywordStats.firstYearDistribution)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, count]) => `| Year ${year} | ${count} |`),
    '',
    '---',
    '',
    '## Synonym Patterns',
    '',
    '| Pattern Type | Count |',
    '|--------------|-------|',
    `| "also known as" | ${report.synonymPatterns.alsoKnownAsCount} |`,
    `| Parenthetical | ${report.synonymPatterns.parentheticalCount} |`,
    `| "or" pattern | ${report.synonymPatterns.orPatternCount} |`,
    '',
    `### Synonym Candidates Found: ${report.synonymPatterns.candidates.length}`,
    '',
    '| Term | Synonyms | Pattern |',
    '|------|----------|---------|',
    ...report.synonymPatterns.candidates
      .slice(0, 30)
      .map((c) => `| ${c.term} | ${c.synonyms.join(', ')} | ${c.pattern} |`),
    '',
    '---',
    '',
    '## Misconception Density',
    '',
    `### Total Misconceptions: ${report.misconceptionDensity.total.toLocaleString()}`,
    '',
    '### Top Subjects by Misconception Count',
    '',
    '| Subject | Count |',
    '|---------|-------|',
    ...report.misconceptionDensity.topSubjects.map((s) => `| ${s.subject} | ${s.count} |`),
    '',
    '---',
    '',
    '## National Curriculum Coverage',
    '',
    `### Total NC Statements: ${report.ncCoverage.total.toLocaleString()}`,
    '',
    '### Subjects with Most Statements',
    '',
    '| Subject | Count |',
    '|---------|-------|',
    ...report.ncCoverage.mostStatements.map((s) => `| ${s.subject} | ${s.count} |`),
    '',
    '### Subjects with Fewest Statements',
    '',
    '| Subject | Count |',
    '|---------|-------|',
    ...report.ncCoverage.fewestStatements.map((s) => `| ${s.subject} | ${s.count} |`),
    '',
  ];

  return lines.join('\n');
}

/**
 * Writes an analysis report to a markdown file.
 *
 * @param report - The analysis report to write
 * @param outputDir - Directory to write the file to (reports subdirectory)
 * @returns Path to the written file
 */
export async function writeAnalysisReportFile(
  report: AnalysisReport,
  outputDir: string,
): Promise<string> {
  const reportsDir = join(outputDir, 'reports');
  await mkdir(reportsDir, { recursive: true });

  const dateStr = report.generatedAt.split('T')[0];
  const fileName = `bulk-analysis-${dateStr}.md`;
  const filePath = join(reportsDir, fileName);
  const content = serializeAnalysisReport(report);

  await writeFile(filePath, content, 'utf-8');

  return filePath;
}
