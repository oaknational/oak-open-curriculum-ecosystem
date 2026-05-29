export const FITNESS_MODE_STRICT = 'strict';
export const FITNESS_MODE_STRICT_HARD = 'strict-hard';
export const FITNESS_MODE_INFORMATIONAL = 'informational';

/**
 * Ratio above `fitness_*_limit` that triggers the `critical` zone.
 *
 * See `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`
 * §Decision. The ratio is deliberately global: per-file critical overrides
 * would invent optionality that the current evidence does not justify.
 */
export const CRITICAL_RATIO = 1.5;

const ZONE_RANK = Object.freeze({
  healthy: 0,
  soft: 1,
  hard: 2,
  critical: 3,
});

export type FitnessMode =
  | typeof FITNESS_MODE_STRICT
  | typeof FITNESS_MODE_STRICT_HARD
  | typeof FITNESS_MODE_INFORMATIONAL;

export type FitnessZone = 'healthy' | 'soft' | 'hard' | 'critical';

export type FitnessCeilingZone = Exclude<FitnessZone, 'soft'>;

type FitnessMetric = 'lines' | 'chars' | 'prose' | 'tokens' | 'content-role' | 'lifecycle';

export type FitnessContentRole = 'reference' | 'drainable-buffer';

export interface ZoneMessage {
  readonly zone: Exclude<FitnessZone, 'healthy'>;
  readonly metric: FitnessMetric;
  readonly text: string;
}

export interface FitnessConfigurationFinding {
  readonly metric: FitnessMetric;
  readonly text: string;
}

export function parseFitnessContentRole(rawRole: string | null): FitnessContentRole {
  return rawRole === 'drainable-buffer' ? 'drainable-buffer' : 'reference';
}

export function isKnownFitnessContentRole(rawRole: string | null): boolean {
  return rawRole == null || rawRole === 'reference' || rawRole === 'drainable-buffer';
}

export function estimateTokensFromContentChars(contentChars: number): number {
  if (contentChars === 0) {
    return 0;
  }

  return Math.ceil(contentChars / 4);
}

export function classifyFitnessZone(
  count: number,
  target: number | null,
  hardLimit: number | null,
  criticalRatio = CRITICAL_RATIO,
): FitnessZone | null {
  if (hasNoThreshold(target, hardLimit)) {
    return null;
  }

  if (exceedsCriticalLimit(count, hardLimit, criticalRatio)) {
    return 'critical';
  }

  if (exceedsHardLimit(count, hardLimit)) {
    return 'hard';
  }

  if (exceedsSoftTarget(count, target)) {
    return 'soft';
  }

  return 'healthy';
}

function hasNoThreshold(target: number | null, hardLimit: number | null): boolean {
  return hardLimit == null && target == null;
}

function exceedsCriticalLimit(
  count: number,
  hardLimit: number | null,
  criticalRatio: number,
): boolean {
  return hardLimit != null && count > hardLimit * criticalRatio;
}

function exceedsHardLimit(count: number, hardLimit: number | null): boolean {
  return hardLimit != null && count > hardLimit;
}

function exceedsSoftTarget(count: number, target: number | null): boolean {
  return target != null && count > target;
}

export function classifyFitnessCeilingZone(
  count: number,
  hardLimit: number | null,
  criticalRatio = CRITICAL_RATIO,
): FitnessCeilingZone | null {
  if (hardLimit == null) {
    return null;
  }

  if (count > hardLimit * criticalRatio) {
    return 'critical';
  }

  if (count > hardLimit) {
    return 'hard';
  }

  return 'healthy';
}

export function worstZone(zones: readonly (FitnessZone | null)[]): FitnessZone {
  let worst: FitnessZone = 'healthy';
  for (const zone of zones) {
    if (zone != null && ZONE_RANK[zone] > ZONE_RANK[worst]) {
      worst = zone;
    }
  }
  return worst;
}

export function getExitCode(
  mode: FitnessMode,
  overallZones: readonly FitnessZone[],
  hasConfigurationFindings = false,
): number {
  if (mode === FITNESS_MODE_INFORMATIONAL) {
    return 0;
  }

  if (hasConfigurationFindings) {
    return 1;
  }

  const blocking: readonly FitnessZone[] =
    mode === FITNESS_MODE_STRICT_HARD ? ['hard', 'critical'] : ['critical'];
  return overallZones.some((zone) => blocking.includes(zone)) ? 1 : 0;
}
