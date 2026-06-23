import type { FitnessResult } from './evaluate.js';
import { formatFitnessResult } from './format.js';
import { ZONE_RANK, type FitnessContentRole } from './model.js';

/**
 * Disposition categories for the fitness report. The category answers "what
 * kind of surface is this, and what is the right response when it is over
 * budget" — drain a buffer, consolidate a directive, refine Practice Core —
 * which is more actionable than the zone alone.
 */
type FitnessCategory =
  | 'drainable-buffer'
  | 'operational-memory'
  | 'project-documentation'
  | 'repo-doctrine'
  | 'practice-core';

/**
 * Display order (owner-specified): drainable buffers first, then the other
 * mutable surfaces (operational memory, project docs), then the stable tiers
 * that change with most care (repo doctrine, Practice Core). The gradient runs
 * drain-freely → change-with-most-care.
 */
const FITNESS_CATEGORY_ORDER: readonly FitnessCategory[] = [
  'drainable-buffer',
  'operational-memory',
  'project-documentation',
  'repo-doctrine',
  'practice-core',
];

const FITNESS_CATEGORY_LABELS: Record<FitnessCategory, string> = {
  'drainable-buffer': 'Drainable buffers',
  'operational-memory': 'Operational & continuity memory',
  'project-documentation': 'Project documentation',
  'repo-doctrine': 'Repo doctrine',
  'practice-core': 'Practice Core',
};

/**
 * Derive a file's disposition category. A declared `drainable-buffer` role is
 * authoritative wherever the file lives; the structural tiers are derived from
 * path; everything else is operational memory (inside `.agent/`) or project
 * documentation (outside it).
 *
 * @param filename - repo-relative path
 * @param contentRole - the file's declared fitness content role
 * @returns the disposition category
 */
export function categorizeFitnessFile(
  filename: string,
  contentRole: FitnessContentRole,
): FitnessCategory {
  if (contentRole === 'drainable-buffer') {
    return 'drainable-buffer';
  }
  if (filename.startsWith('.agent/practice-core/')) {
    return 'practice-core';
  }
  if (filename.startsWith('.agent/directives/')) {
    return 'repo-doctrine';
  }
  // Keep this generic `.agent/` catch-all LAST among the `.agent/` checks:
  // any more specific `.agent/<tier>/` rule must be added above it.
  if (filename.startsWith('.agent/')) {
    return 'operational-memory';
  }
  return 'project-documentation';
}

interface FitnessCategoryGroup {
  readonly category: FitnessCategory;
  readonly label: string;
  readonly results: readonly FitnessResult[];
}

function bySeverityThenName(left: FitnessResult, right: FitnessResult): number {
  const severity = ZONE_RANK[right.overallZone] - ZONE_RANK[left.overallZone];
  return severity === 0 ? left.filename.localeCompare(right.filename) : severity;
}

/**
 * Group results by disposition category, in display order, dropping empty
 * categories. Within each group, files are ordered worst-zone first so the
 * surfaces needing action surface at the top.
 *
 * @param results - evaluated fitness results
 * @returns ordered, non-empty category groups
 */
export function groupFitnessResultsByCategory(
  results: readonly FitnessResult[],
): readonly FitnessCategoryGroup[] {
  return FITNESS_CATEGORY_ORDER.flatMap((category) => {
    const inCategory = results
      .filter((result) => categorizeFitnessFile(result.filename, result.contentRole) === category)
      .toSorted(bySeverityThenName);
    return inCategory.length === 0
      ? []
      : [{ category, label: FITNESS_CATEGORY_LABELS[category], results: inCategory }];
  });
}

/**
 * Render the per-file fitness detail blocks grouped by disposition category,
 * each group under a labelled, counted header.
 *
 * @param results - evaluated fitness results
 * @returns the grouped, formatted report body
 */
export function formatFitnessResultsByCategory(results: readonly FitnessResult[]): string {
  const lines: string[] = [];
  for (const group of groupFitnessResultsByCategory(results)) {
    lines.push(`\x1b[36m${group.label} (${group.results.length}):\x1b[0m`, '');
    for (const result of group.results) {
      lines.push(formatFitnessResult(result), '');
    }
  }
  while (lines.at(-1) === '') {
    lines.pop();
  }
  return lines.join('\n');
}
