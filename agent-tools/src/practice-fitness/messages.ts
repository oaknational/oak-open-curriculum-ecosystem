import {
  CRITICAL_RATIO,
  type FitnessCeilingZone,
  type FitnessZone,
  type ZoneMessage,
} from './model.js';

export interface ZoneMessageInputs {
  readonly lineZone: FitnessZone | null;
  readonly charZone: FitnessCeilingZone | null;
  readonly proseZone: FitnessCeilingZone | null;
  readonly tokenZone: FitnessZone | null;
  readonly totalLines: number;
  readonly totalChars: number;
  readonly estimatedTokens: number;
  readonly maxProseLen: number;
  readonly maxProseLineNum: number;
  readonly proseViolationCount: number;
}

export interface ZoneMessageThresholds {
  readonly targetLines: number | null;
  readonly limitLines: number | null;
  readonly limitChars: number | null;
  readonly maxProseLineWidth: number | null;
  readonly targetTokens: number | null;
  readonly limitTokens: number | null;
}

export function buildAllZoneMessages(
  thresholds: ZoneMessageThresholds,
  inputs: ZoneMessageInputs,
): ZoneMessage[] {
  return [
    ...buildLineZoneMessages(
      inputs.lineZone,
      inputs.totalLines,
      thresholds.targetLines,
      thresholds.limitLines,
    ),
    ...buildCharZoneMessages(inputs.charZone, inputs.totalChars, thresholds.limitChars),
    ...buildProseZoneMessages(
      inputs.proseZone,
      inputs.proseViolationCount,
      inputs.maxProseLen,
      inputs.maxProseLineNum,
      thresholds.maxProseLineWidth,
    ),
    ...buildTokenZoneMessages(
      inputs.tokenZone,
      inputs.estimatedTokens,
      thresholds.targetTokens,
      thresholds.limitTokens,
    ),
  ];
}

function buildLineZoneMessages(
  zone: FitnessZone | null,
  totalLines: number,
  targetLines: number | null,
  limitLines: number | null,
): ZoneMessage[] {
  if (zone === 'soft') {
    return [
      {
        zone: 'soft',
        metric: 'lines',
        text: `Lines: ${totalLines} above target ${targetLines} (limit ${limitLines})`,
      },
    ];
  }
  if (zone === 'hard') {
    const critical = Math.floor((limitLines ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'hard',
        metric: 'lines',
        text: `Lines: ${totalLines} above hard limit ${limitLines} (critical ${critical})`,
      },
    ];
  }
  if (zone === 'critical') {
    const critical = Math.floor((limitLines ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'critical',
        metric: 'lines',
        text: `Lines: ${totalLines} above critical threshold ${critical} — loop failure signal`,
      },
    ];
  }
  return [];
}

function buildCharZoneMessages(
  zone: FitnessCeilingZone | null,
  totalChars: number,
  limitChars: number | null,
): ZoneMessage[] {
  if (zone === 'hard') {
    return [
      {
        zone: 'hard',
        metric: 'chars',
        text: `Characters: ${totalChars} above hard limit ${limitChars}`,
      },
    ];
  }
  if (zone === 'critical') {
    const critical = Math.floor((limitChars ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'critical',
        metric: 'chars',
        text: `Characters: ${totalChars} above critical threshold ${critical} — loop failure signal`,
      },
    ];
  }
  return [];
}

function buildTokenZoneMessages(
  zone: FitnessZone | null,
  estimatedTokens: number,
  targetTokens: number | null,
  limitTokens: number | null,
): ZoneMessage[] {
  if (zone === 'soft') {
    return [
      {
        zone: 'soft',
        metric: 'tokens',
        text: `Tokens: ${estimatedTokens} above target ${targetTokens} (limit ${limitTokens})`,
      },
    ];
  }
  if (zone === 'hard') {
    const critical = Math.floor((limitTokens ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'hard',
        metric: 'tokens',
        text: `Tokens: ${estimatedTokens} above hard limit ${limitTokens} (critical ${critical})`,
      },
    ];
  }
  if (zone === 'critical') {
    const critical = Math.floor((limitTokens ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'critical',
        metric: 'tokens',
        text: `Tokens: ${estimatedTokens} above critical threshold ${critical} — loop failure signal`,
      },
    ];
  }
  return [];
}

function buildProseZoneMessages(
  zone: FitnessCeilingZone | null,
  violationCount: number,
  maxProseLen: number,
  maxProseLineNum: number,
  maxProseLineWidth: number | null,
): ZoneMessage[] {
  if (zone !== 'hard' && zone !== 'critical') {
    return [];
  }
  const label = zone === 'critical' ? 'critical threshold' : 'hard limit';
  const critical = Math.floor((maxProseLineWidth ?? 0) * CRITICAL_RATIO);
  const threshold = zone === 'critical' ? critical : maxProseLineWidth;
  const suffix = zone === 'critical' ? ' — loop failure signal' : '';
  return [
    {
      zone,
      metric: 'prose',
      text: `Prose line width: ${violationCount} line(s) above ${label} ${threshold} (longest ${maxProseLen} at line ${maxProseLineNum})${suffix}`,
    },
  ];
}
