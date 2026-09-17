/** One integrity defect in a registered freshness row. */
export interface FreshnessIntegrityFinding {
  readonly row: string;
  readonly field?: string;
  readonly reason: string;
}

/** One pinned row that the landing-2 consumer must monitor. */
export interface FreshnessMonitoringObligation {
  readonly row: string;
  readonly pinnedVersion: string;
}

/** One row that deliberately does not track a platform version. */
export interface FreshnessNotTrackedRow {
  readonly row: string;
  readonly reason: string;
}
