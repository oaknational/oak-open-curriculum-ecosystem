import {
  isKnownFitnessContentRole,
  type FitnessConfigurationFinding,
  type FitnessContentRole,
} from './model.js';

export interface FitnessConfigurationThresholds {
  readonly contentRole: FitnessContentRole;
  readonly rawContentRole: string | null;
  readonly rawSplitStrategy: string | null;
  readonly rawSurfaceKind: string | null;
  readonly rawMergeClass: string | null;
}

function includesRetiredShardLifecycle(rawValue: string | null): boolean {
  return rawValue?.includes('shard') ?? false;
}

function buildLifecycleFindings(
  thresholds: FitnessConfigurationThresholds,
): FitnessConfigurationFinding[] {
  const findings: FitnessConfigurationFinding[] = [];
  if (thresholds.contentRole === 'drainable-buffer' && thresholds.rawSplitStrategy != null) {
    findings.push({
      metric: 'lifecycle',
      text: 'drainable buffers must not declare split_strategy — use drain_strategy and process items in place',
    });
  }
  if (thresholds.rawSurfaceKind === 'active-pending-graduations-shard') {
    findings.push({
      metric: 'lifecycle',
      text: 'active-pending-graduations-shard is not a valid lifecycle state — mark legacy files as pending-graduations-recovery-file while draining them',
    });
  } else if (includesRetiredShardLifecycle(thresholds.rawSurfaceKind)) {
    findings.push({
      metric: 'lifecycle',
      text: 'surface_kind must not label live buffers as shards — use drain_strategy and process items in place',
    });
  }
  if (includesRetiredShardLifecycle(thresholds.rawMergeClass)) {
    findings.push({
      metric: 'lifecycle',
      text: 'merge_class must not label live buffers as shards — use drain_strategy and process items in place',
    });
  }
  return findings;
}

export function buildConfigurationFindings(
  thresholds: FitnessConfigurationThresholds & {
    readonly targetTokens: number | null;
    readonly limitTokens: number | null;
  },
  contentText: string,
): FitnessConfigurationFinding[] {
  const findings: FitnessConfigurationFinding[] = [];
  if (thresholds.targetTokens != null && thresholds.limitTokens == null) {
    findings.push({
      metric: 'tokens',
      text: 'fitness_token_target declared without fitness_token_limit — declare both or neither',
    });
  }
  if (!isKnownFitnessContentRole(thresholds.rawContentRole)) {
    findings.push({
      metric: 'content-role',
      text: `fitness_content_role must be reference or drainable-buffer, got ${thresholds.rawContentRole}`,
    });
  }
  findings.push(...buildLifecycleFindings(thresholds));
  if (contentText.trim().length === 0 && thresholds.contentRole !== 'drainable-buffer') {
    findings.push({
      metric: 'content-role',
      text: 'empty content is only ready for fitness_content_role: drainable-buffer — add content or declare the drainable role',
    });
  }
  return findings;
}
