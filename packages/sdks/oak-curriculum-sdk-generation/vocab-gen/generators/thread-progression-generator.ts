/**
 * Thread progression graph generator.
 *
 * @remarks
 * Transforms extracted thread data into a static graph structure
 * suitable for MCP tool consumption and AI agent reasoning.
 *
 * The output follows the pattern established by `property-graph-data.ts`:
 * - Static data with `as const` for type inference
 * - Version and source metadata for reproducibility
 * - TSDoc documentation for agent understanding
 *
 * @see property-graph-data.ts for the canonical pattern
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology

 */
import type { ExtractedThread } from '../extractors/index.js';

/**
 * A thread node in the progression graph.
 */
export interface ThreadNode {
  /** Thread slug identifier */
  readonly slug: string;
  /** Human-readable thread title */
  readonly title: string;
  /**
   * Subjects this thread spans.
   *
   * Most threads belong to a single subject, but some (especially MFL
   * threads like "adjectives") span multiple subjects (e.g. french,
   * german, spanish). Sorted alphabetically.
   */
  readonly subjects: readonly string[];
  /** First year this thread appears (undefined if all-years) */
  readonly firstYear: number | undefined;
  /** Last year this thread appears (undefined if all-years) */
  readonly lastYear: number | undefined;
  /** Number of units in this thread */
  readonly unitCount: number;
  /** Ordered unit slugs in this thread */
  readonly units: readonly string[];
}

/**
 * Statistics about the thread progression graph.
 */
export interface ThreadProgressionStats {
  /** Total number of threads */
  readonly threadCount: number;
  /** Unique subjects covered by threads */
  readonly subjectsCovered: readonly string[];
}

/**
 * The complete thread progression graph structure.
 *
 * @remarks
 * This structure is designed to be exported as a static TypeScript file
 * with `as const` for full type inference.
 */
export interface ThreadProgressionGraph {
  /** Semantic version of the graph structure */
  readonly version: string;
  /** ISO timestamp when this graph was generated */
  readonly generatedAt: string;
  /** Version of the source bulk download data */
  readonly sourceVersion: string;
  /** Statistics for agent context */
  readonly stats: ThreadProgressionStats;
  /** Thread nodes with progression data */
  readonly threads: readonly ThreadNode[];
  /** Cross-reference to related MCP tools */
  readonly seeAlso: string;
}

/**
 * Extracts all unique subjects from a thread's units.
 *
 * Most threads span a single subject, but some (particularly MFL
 * threads like "adjectives", "negation") span multiple subjects
 * (e.g. french, german, spanish). Returns sorted unique subjects.
 */
function extractSubjects(thread: ExtractedThread): readonly string[] {
  const subjects = new Set<string>();
  for (const unit of thread.units) {
    subjects.add(unit.subject);
  }
  if (subjects.size === 0) {
    return ['unknown'];
  }
  return [...subjects].sort();
}

/**
 * Collects all unique subjects from ALL units across ALL threads.
 *
 * This correctly counts subjects even when thread slugs are shared
 * across subjects (e.g. MFL threads span french, german, spanish).
 */
function collectSubjects(threads: readonly ExtractedThread[]): readonly string[] {
  const subjects = new Set<string>();
  for (const thread of threads) {
    for (const unit of thread.units) {
      subjects.add(unit.subject);
    }
  }
  return [...subjects].sort();
}

/**
 * Transforms an ExtractedThread into a ThreadNode.
 */
function toThreadNode(thread: ExtractedThread): ThreadNode {
  return {
    slug: thread.slug,
    title: thread.title,
    subjects: extractSubjects(thread),
    firstYear: thread.firstYear,
    lastYear: thread.lastYear,
    unitCount: thread.units.length,
    units: thread.units.map((u) => u.unitSlug),
  };
}

/**
 * Generates the thread progression graph from extracted thread data.
 *
 * @param threads - Extracted threads from the vocabulary mining pipeline
 * @param sourceVersion - Version identifier for the source bulk download data
 * @returns Thread progression graph structure
 *
 * @example
 * ```ts
 * const threads = extractThreads(units);
 * const graph = generateThreadProgressionData(threads, '2025-12-07T09:37:04.693Z');
 * // graph.threads contains ordered unit progressions for each thread
 * ```
 */
export function generateThreadProgressionData(
  threads: readonly ExtractedThread[],
  sourceVersion: string,
): ThreadProgressionGraph {
  const sortedThreads = [...threads].sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    sourceVersion,
    stats: {
      threadCount: threads.length,
      subjectsCovered: collectSubjects(threads),
    },
    threads: sortedThreads.map(toThreadNode),
    seeAlso:
      'Use get-ontology for schema-level relationships (includes property graph). ' +
      'Use get-prerequisite-graph for unit dependencies.',
  };
}
