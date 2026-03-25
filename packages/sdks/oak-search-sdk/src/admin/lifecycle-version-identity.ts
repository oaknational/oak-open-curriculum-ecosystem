/**
 * Pure version-identity functions for the blue/green lifecycle (ADR-130).
 *
 * Leaf module with no lifecycle imports — provides version extraction,
 * orphan identification, and the `OrphanedVersion` type. Both cleanup
 * and orphan-detection modules import from here.
 */

/** A version that is not pointed to by any alias or by the metadata previous_version. */
export interface OrphanedVersion {
  readonly version: string;
  readonly indexNames: readonly string[];
}

/**
 * Extract the version suffix from a versioned index name.
 *
 * Index names follow the pattern `{base}_{targetSuffix}_{version}` where
 * version is `vYYYY-MM-DD-HHmmss`. We match the last `_v` followed by a
 * timestamp to avoid false matches on base name components.
 *
 * @param indexName - Physical index name (e.g. `oak_lessons_v2026-03-07-143022`)
 * @returns The version string (e.g. `v2026-03-07-143022`) or `null` if not found
 */
export function extractVersionFromIndexName(indexName: string): string | null {
  const match = indexName.match(/_(v\d{4}-\d{2}-\d{2}-\d{6})$/);
  return match ? match[1] : null;
}

/**
 * Identify orphaned versions from a list of versioned index names.
 *
 * A version is orphaned if it is neither an alias target nor the
 * metadata `previous_version` (rollback target). Pure function —
 * takes pre-resolved data, no I/O.
 *
 * @param aliasTargetVersions - Versions currently serving live aliases
 * @param metaPreviousVersion - The rollback target from index metadata, or null
 * @param allVersionedIndexNames - All versioned index names across all kinds
 * @returns Orphaned versions grouped with their index names
 */
export function identifyOrphanedVersions(
  aliasTargetVersions: ReadonlySet<string>,
  metaPreviousVersion: string | null,
  allVersionedIndexNames: readonly string[],
): readonly OrphanedVersion[] {
  const byVersion = new Map<string, string[]>();
  for (const indexName of allVersionedIndexNames) {
    const version = extractVersionFromIndexName(indexName);
    if (version === null) {
      continue;
    }
    const existing = byVersion.get(version);
    if (existing) {
      existing.push(indexName);
    } else {
      byVersion.set(version, [indexName]);
    }
  }

  const orphans: OrphanedVersion[] = [];
  for (const [version, indexNames] of byVersion) {
    if (aliasTargetVersions.has(version)) {
      continue;
    }
    if (version === metaPreviousVersion) {
      continue;
    }
    orphans.push({ version, indexNames });
  }
  return orphans;
}
