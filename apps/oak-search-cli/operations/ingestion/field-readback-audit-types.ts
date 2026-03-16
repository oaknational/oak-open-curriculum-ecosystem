export interface GapLedgerFieldEntry {
  readonly indexFamily: string;
  readonly fieldName: string;
  readonly stage: string;
  readonly status: string;
  readonly findingRefs: readonly string[];
}

export interface GapLedger {
  readonly statuses: readonly string[];
  readonly fields: readonly GapLedgerFieldEntry[];
}

export interface ReadbackAuditEntry {
  readonly indexFamily: string;
  readonly fieldName: string;
  readonly alias: string;
  readonly resolvedIndex: string;
  readonly mappingExists: boolean;
  readonly mappingType: string;
  readonly existsCount: number;
  readonly missingCount: number;
  readonly attemptsUsed: number;
}

export interface ReadbackAuditResult {
  readonly ok: boolean;
  readonly entries: readonly ReadbackAuditEntry[];
  readonly failures: readonly string[];
}

export type MappingProperties = Record<
  string,
  {
    readonly type?: string;
  }
>;

export interface ReadbackAuditDependencies {
  resolveAlias(alias: string): Promise<string>;
  getMappingProperties(resolvedIndex: string): Promise<MappingProperties>;
  getExistsCount(indexName: string, fieldName: string): Promise<number>;
  getMissingCount(indexName: string, fieldName: string): Promise<number>;
  sleep(ms: number): Promise<void>;
}
