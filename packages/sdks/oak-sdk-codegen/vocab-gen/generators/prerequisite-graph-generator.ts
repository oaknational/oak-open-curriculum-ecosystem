/**
 * Prerequisite graph generator.
 *
 * @remarks
 * Transforms extracted prior knowledge and thread data into a static graph
 * structure suitable for MCP tool consumption and AI agent reasoning.
 *
 * The output follows the pattern established by `property-graph-data.ts`:
 * - Static data with `as const` for type inference
 * - Version and source metadata for reproducibility
 * - TSDoc documentation for agent understanding
 *
 * @see property-graph-data.ts for the canonical pattern
 * @see thread-progression-generator.ts for the sister implementation
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology

 */
import type { ExtractedPriorKnowledge, ExtractedThread } from '../extractors/index.js';

/**
 * A prerequisite edge in the graph.
 */
export interface PrerequisiteEdge {
  /** Source unit slug */
  readonly from: string;
  /** Target unit slug */
  readonly to: string;
  /** Relationship type */
  readonly rel: 'prerequisiteFor';
  /** Source of the edge: thread ordering or prior knowledge text */
  readonly source: 'thread' | 'priorKnowledge';
}

/**
 * A unit node in the prerequisite graph.
 */
export interface PrerequisiteNode {
  /** Unit slug identifier */
  readonly unitSlug: string;
  /** Human-readable unit title */
  readonly unitTitle: string;
  /** Subject this unit belongs to */
  readonly subject: string;
  /** Key stage of the unit */
  readonly keyStage: string;
  /** Year group (undefined for all-years units) */
  readonly year: number | undefined;
  /** Prior knowledge requirements for this unit */
  readonly priorKnowledge: readonly string[];
  /** Thread slugs this unit belongs to */
  readonly threadSlugs: readonly string[];
}

/**
 * Statistics about the prerequisite graph.
 */
export interface PrerequisiteGraphStats {
  /** Number of units that have prior knowledge requirements */
  readonly unitsWithPrerequisites: number;
  /** Total number of edges in the graph */
  readonly totalEdges: number;
  /** Unique subjects covered by units with prerequisites */
  readonly subjectsCovered: readonly string[];
}

/**
 * The complete prerequisite graph structure.
 *
 * @remarks
 * This structure is designed to be exported as a static TypeScript file
 * with `as const` for full type inference.
 */
export interface PrerequisiteGraph {
  /** Semantic version of the graph structure */
  readonly version: string;
  /** ISO timestamp when this graph was generated */
  readonly generatedAt: string;
  /** Version of the source bulk download data */
  readonly sourceVersion: string;
  /** Statistics for agent context */
  readonly stats: PrerequisiteGraphStats;
  /** Unit nodes with prerequisite metadata */
  readonly nodes: readonly PrerequisiteNode[];
  /** Prerequisite edges between units */
  readonly edges: readonly PrerequisiteEdge[];
  /** Cross-reference to related MCP tools */
  readonly seeAlso: string;
}

/**
 * Builds a map of unit slugs to their thread memberships.
 */
function buildUnitToThreadsMap(threads: readonly ExtractedThread[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const thread of threads) {
    for (const unit of thread.units) {
      const existing = map.get(unit.unitSlug);
      if (existing) {
        existing.push(thread.slug);
      } else {
        map.set(unit.unitSlug, [thread.slug]);
      }
    }
  }
  return map;
}

/**
 * Groups prior knowledge by unit slug.
 */
function groupPriorKnowledgeByUnit(
  priorKnowledge: readonly ExtractedPriorKnowledge[],
): Map<string, ExtractedPriorKnowledge[]> {
  const map = new Map<string, ExtractedPriorKnowledge[]>();
  for (const pk of priorKnowledge) {
    const existing = map.get(pk.unitSlug);
    if (existing) {
      existing.push(pk);
    } else {
      map.set(pk.unitSlug, [pk]);
    }
  }
  return map;
}

/**
 * Creates nodes from grouped prior knowledge data.
 */
function createNodes(
  groupedPK: Map<string, ExtractedPriorKnowledge[]>,
  unitToThreads: Map<string, string[]>,
): readonly PrerequisiteNode[] {
  const nodes: PrerequisiteNode[] = [];

  for (const [unitSlug, pkList] of groupedPK.entries()) {
    const first = pkList[0];
    if (!first) {
      continue;
    }

    nodes.push({
      unitSlug,
      unitTitle: first.unitTitle,
      subject: first.subject,
      keyStage: first.keyStage,
      year: first.year,
      priorKnowledge: pkList.map((pk) => pk.requirement),
      threadSlugs: unitToThreads.get(unitSlug) ?? [],
    });
  }

  return nodes.sort((a, b) => a.unitSlug.localeCompare(b.unitSlug));
}

/**
 * Creates prerequisiteFor edges from thread ordering.
 *
 * @remarks
 * For each thread with 2+ units, creates edges from unit[i] to unit[i+1].
 */
function createEdgesFromThreads(threads: readonly ExtractedThread[]): readonly PrerequisiteEdge[] {
  const edges: PrerequisiteEdge[] = [];

  for (const thread of threads) {
    // Only process threads with 2+ units
    if (thread.units.length < 2) {
      continue;
    }

    // Units are already ordered by their `order` field
    for (let i = 0; i < thread.units.length - 1; i++) {
      const fromUnit = thread.units[i];
      const toUnit = thread.units[i + 1];

      if (fromUnit && toUnit) {
        edges.push({
          from: fromUnit.unitSlug,
          to: toUnit.unitSlug,
          rel: 'prerequisiteFor',
          source: 'thread',
        });
      }
    }
  }

  return edges;
}

/**
 * Collects unique subjects from prior knowledge entries.
 */
function collectSubjects(priorKnowledge: readonly ExtractedPriorKnowledge[]): readonly string[] {
  const subjects = new Set<string>();
  for (const pk of priorKnowledge) {
    subjects.add(pk.subject);
  }
  return [...subjects].sort();
}

/**
 * Generates the prerequisite graph from extracted data.
 *
 * @param priorKnowledge - Extracted prior knowledge requirements from units
 * @param threads - Extracted threads for ordering-based edges
 * @param sourceVersion - Version identifier for the source bulk download data
 * @returns Prerequisite graph structure
 *
 * @example
 * ```ts
 * const priorKnowledge = extractPriorKnowledge(units);
 * const threads = extractThreads(units);
 * const graph = generatePrerequisiteGraphData(priorKnowledge, threads, '2025-12-07T09:37:04.693Z');
 * // graph.nodes contains units with prerequisites
 * // graph.edges contains prerequisiteFor relationships
 * ```
 */
export function generatePrerequisiteGraphData(
  priorKnowledge: readonly ExtractedPriorKnowledge[],
  threads: readonly ExtractedThread[],
  sourceVersion: string,
): PrerequisiteGraph {
  const unitToThreads = buildUnitToThreadsMap(threads);
  const groupedPK = groupPriorKnowledgeByUnit(priorKnowledge);
  const nodes = createNodes(groupedPK, unitToThreads);
  const edges = createEdgesFromThreads(threads);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    sourceVersion,
    stats: {
      unitsWithPrerequisites: groupedPK.size,
      totalEdges: edges.length,
      subjectsCovered: collectSubjects(priorKnowledge),
    },
    nodes,
    edges,
    seeAlso:
      'Use get-curriculum-model for complete orientation. ' +
      'Use get-thread-progressions for learning paths. ' +
      'Use get-ontology for the property graph.',
  };
}
