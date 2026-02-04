/* eslint-disable max-lines -- generator with serialisation requires length */
/* eslint-disable max-lines-per-function -- serialisation functions are long by nature */
/**
 * Vocabulary graph generator for the vocabulary mining pipeline.
 *
 * @remarks
 * Generates a graph of curriculum vocabulary from extracted keywords.
 * This graph provides a curated glossary for students and teachers,
 * with cross-subject term identification and first-year tracking.
 *
 * CURRENT PROCESS:
 * 1. Bulk download data is stored locally in reference/bulk_download_data/
 * 2. This generator is run manually (pnpm generate:graphs)
 * 3. Output is committed as static TypeScript file (vocabulary-graph-data.ts)
 *
 * FUTURE VISION (see 20-ontology-and-graphs-api-proposal.md):
 * Pre-compute this graph at API build time and expose via /graphs/vocabulary endpoint.
 * Benefits:
 * - Eliminates need for local bulk data processing
 * - All consumers get same version
 * - Enables proper versioning and cache invalidation
 * - Reduces SDK complexity
 *
 * @module vocab-gen/generators/vocabulary-graph-generator
 */
import { writeFile } from 'fs/promises';
import { join } from 'path';

import type { ExtractedKeyword } from '../extractors/index.js';

/**
 * A vocabulary node in the graph.
 */
export interface VocabularyNode {
  /** The vocabulary term */
  readonly term: string;
  /** Definition of the term */
  readonly definition: string;
  /** Number of lessons where this term appears */
  readonly frequency: number;
  /** Subjects where this term is used */
  readonly subjects: readonly string[];
  /** Earliest year this term is introduced */
  readonly firstYear: number;
  /** Whether this term appears in multiple subjects */
  readonly isCrossSubject: boolean;
}

/**
 * Statistics about the vocabulary graph.
 */
export interface VocabularyGraphStats {
  /** Total number of unique terms */
  readonly totalTerms: number;
  /** Count of terms by subject */
  readonly bySubject: Readonly<Record<string, number>>;
  /** Count of terms appearing in 2+ subjects */
  readonly crossSubjectTermCount: number;
  /** List of subjects covered */
  readonly subjectsCovered: readonly string[];
}

/**
 * The complete vocabulary graph structure.
 */
export interface VocabularyGraph {
  /** Semantic version of this graph */
  readonly version: string;
  /** When this graph was generated */
  readonly generatedAt: string;
  /** Source data version */
  readonly sourceVersion: string;
  /** Statistics about the graph */
  readonly stats: VocabularyGraphStats;
  /** All vocabulary nodes */
  readonly nodes: readonly VocabularyNode[];
  /** Cross-reference to related resources */
  readonly seeAlso: string;
}

/**
 * Converts an extracted keyword to a vocabulary node.
 */
function toNode(keyword: ExtractedKeyword): VocabularyNode {
  return {
    term: keyword.term,
    definition: keyword.definition,
    frequency: keyword.frequency,
    subjects: keyword.subjects,
    firstYear: keyword.firstYear,
    isCrossSubject: keyword.subjects.length >= 2,
  };
}

/**
 * Calculates statistics from keywords.
 */
function calculateStats(keywords: readonly ExtractedKeyword[]): VocabularyGraphStats {
  const bySubject: Record<string, number> = {};
  const allSubjects = new Set<string>();
  let crossSubjectCount = 0;

  for (const kw of keywords) {
    for (const subject of kw.subjects) {
      bySubject[subject] = (bySubject[subject] ?? 0) + 1;
      allSubjects.add(subject);
    }
    if (kw.subjects.length >= 2) {
      crossSubjectCount++;
    }
  }

  return {
    totalTerms: keywords.length,
    bySubject,
    crossSubjectTermCount: crossSubjectCount,
    subjectsCovered: [...allSubjects].sort(),
  };
}

/**
 * Generates vocabulary graph data from extracted keywords.
 *
 * @param keywords - Array of extracted keywords
 * @param sourceVersion - Version of the source bulk data
 * @returns VocabularyGraph with all vocabulary and statistics
 *
 * @example
 * ```ts
 * const graph = generateVocabularyGraphData(extractedData.keywords, '2025-12-26');
 * console.log(`Found ${graph.stats.totalTerms} vocabulary terms`);
 * ```
 */
export function generateVocabularyGraphData(
  keywords: readonly ExtractedKeyword[],
  sourceVersion: string,
): VocabularyGraph {
  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    sourceVersion,
    stats: calculateStats(keywords),
    nodes: keywords.map(toNode),
    seeAlso: 'Use get-ontology for curriculum structure context',
  };
}

/**
 * Escapes a string for use in TypeScript string literals.
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * Serializes a VocabularyGraph to TypeScript source code.
 *
 * @param graph - The graph data to serialize
 * @returns TypeScript source code string
 */
export function serializeVocabularyGraph(graph: VocabularyGraph): string {
  const lines: string[] = [
    '/* eslint-disable max-lines -- generated static data file */',
    '/**',
    ' * Vocabulary Graph — extracted from bulk download data.',
    ' *',
    ' * @remarks',
    ' * - Generated by `pnpm vocab-gen`',
    ` * - Source: ${graph.sourceVersion}`,
    ` * - Generated: ${graph.generatedAt}`,
    ' * - Contains curriculum vocabulary with definitions',
    ' * - Use for glossary lookups and vocabulary progression queries',
    ' *',
    ' * @see ADR-086 for extraction methodology',
    ' */',
    '',
    '/**',
    ' * A vocabulary node in the graph.',
    ' */',
    'export interface VocabularyNode {',
    '  readonly term: string;',
    '  readonly definition: string;',
    '  readonly frequency: number;',
    '  readonly subjects: readonly string[];',
    '  readonly firstYear: number;',
    '  readonly isCrossSubject: boolean;',
    '}',
    '',
    '/**',
    ' * Statistics about the vocabulary graph.',
    ' */',
    'export interface VocabularyGraphStats {',
    '  readonly totalTerms: number;',
    '  readonly bySubject: Readonly<Record<string, number>>;',
    '  readonly crossSubjectTermCount: number;',
    '  readonly subjectsCovered: readonly string[];',
    '}',
    '',
    '/**',
    ' * The complete vocabulary graph structure.',
    ' */',
    'export interface VocabularyGraph {',
    '  readonly version: string;',
    '  readonly generatedAt: string;',
    '  readonly sourceVersion: string;',
    '  readonly stats: VocabularyGraphStats;',
    '  readonly nodes: readonly VocabularyNode[];',
    '  readonly seeAlso: string;',
    '}',
    '',
    '/**',
    ' * Vocabulary graph with curriculum terms and definitions.',
    ' *',
    ' * @remarks',
    ` * Contains ${graph.stats.totalTerms} terms across ${graph.stats.subjectsCovered.length} subjects.`,
    ` * ${graph.stats.crossSubjectTermCount} terms appear in multiple subjects.`,
    ' *',
    ' * Use this to answer questions like:',
    ' * - "What does photosynthesis mean?"',
    ' * - "When is this term first introduced?"',
    ' * - "What vocabulary is shared across subjects?"',
    ' */',
    'export const vocabularyGraph: VocabularyGraph = {',
    `  version: '${graph.version}',`,
    `  generatedAt: '${graph.generatedAt}',`,
    `  sourceVersion: '${graph.sourceVersion}',`,
    '',
    '  stats: {',
    `    totalTerms: ${graph.stats.totalTerms},`,
    `    bySubject: ${JSON.stringify(graph.stats.bySubject)},`,
    `    crossSubjectTermCount: ${graph.stats.crossSubjectTermCount},`,
    `    subjectsCovered: ${JSON.stringify(graph.stats.subjectsCovered)},`,
    '  },',
    '',
    '  nodes: [',
  ];

  // Add nodes
  for (const node of graph.nodes) {
    lines.push('    {');
    lines.push(`      term: '${escapeString(node.term)}',`);
    lines.push(`      definition: '${escapeString(node.definition)}',`);
    lines.push(`      frequency: ${node.frequency},`);
    lines.push(`      subjects: ${JSON.stringify(node.subjects)},`);
    lines.push(`      firstYear: ${node.firstYear},`);
    lines.push(`      isCrossSubject: ${node.isCrossSubject},`);
    lines.push('    },');
  }

  lines.push('  ],');
  lines.push('');
  lines.push(`  seeAlso: '${escapeString(graph.seeAlso)}',`);
  lines.push('};');
  lines.push('');

  return lines.join('\n');
}

/**
 * Writes a vocabulary graph to a TypeScript file.
 *
 * @param graph - The graph data to write
 * @param outputDir - Directory to write the file to
 * @returns Path to the written file
 */
export async function writeVocabularyGraphFile(
  graph: VocabularyGraph,
  outputDir: string,
): Promise<string> {
  const fileName = 'vocabulary-graph-data.ts';
  const filePath = join(outputDir, fileName);
  const content = serializeVocabularyGraph(graph);

  await writeFile(filePath, content, 'utf-8');

  return filePath;
}
