import {
  type StableIdentityEntry,
  type SubstrateFinding,
  type SubstrateRepairClass,
  type SubstrateSeverity,
} from './types.js';

/**
 * Build a substrate finding while preserving optional evidence exactly.
 */
export function finding(input: {
  readonly id: string;
  readonly surface: string;
  readonly severity: SubstrateSeverity;
  readonly repair: SubstrateRepairClass;
  readonly message: string;
  readonly evidence?: readonly string[];
}): SubstrateFinding {
  return input.evidence === undefined ? input : { ...input, evidence: input.evidence };
}

/**
 * Group entries that share a stable substrate identity.
 */
export function duplicateIdentityGroups(
  entries: readonly StableIdentityEntry[],
): readonly (readonly StableIdentityEntry[])[] {
  const byId = new Map<string, StableIdentityEntry[]>();
  for (const entry of entries) {
    byId.set(entry.stableId, [...(byId.get(entry.stableId) ?? []), entry]);
  }

  return [...byId.values()].filter((group) => group.length > 1);
}
