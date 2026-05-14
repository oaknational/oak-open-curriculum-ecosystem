import {
  classifyFitnessCeilingZone,
  classifyFitnessZone,
  estimateTokensFromContentChars,
  worstZone,
  type FitnessCeilingZone,
  type FitnessConfigurationFinding,
  type FitnessZone,
  type ZoneMessage,
} from './model.js';
import {
  classifyLines,
  extractFrontmatter,
  getFrontmatterNumber,
  type ClassifiedLine,
} from './markdown.js';
import { buildAllZoneMessages } from './messages.js';

export {
  classifyFitnessCeilingZone,
  classifyFitnessZone,
  estimateTokensFromContentChars,
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  getExitCode,
  worstZone,
} from './model.js';
export type { FitnessMetric, FitnessMode, FitnessZone, ZoneMessage } from './model.js';
export {
  classifyLines,
  extractFitnessContentText,
  extractFrontmatter,
  getFrontmatterNumber,
} from './markdown.js';
export type { ClassifiedLine } from './markdown.js';

export interface FitnessResult {
  readonly filename: string;
  readonly contentText: string;
  readonly totalLines: number;
  readonly totalChars: number;
  readonly estimatedTokens: number;
  readonly maxProseLen: number;
  readonly maxProseLineNum: number;
  readonly proseViolationCount: number;
  readonly proseViolations: readonly ClassifiedLine[];
  readonly targetLines: number | null;
  readonly limitLines: number | null;
  readonly limitChars: number | null;
  readonly maxProseLineWidth: number | null;
  readonly targetTokens: number | null;
  readonly limitTokens: number | null;
  readonly lineZone: FitnessZone | null;
  readonly charZone: FitnessCeilingZone | null;
  readonly proseZone: FitnessCeilingZone | null;
  readonly tokenZone: FitnessZone | null;
  readonly overallZone: FitnessZone;
  readonly zoneMessages: readonly ZoneMessage[];
  readonly configurationFindings: readonly FitnessConfigurationFinding[];
}

interface FitnessThresholds {
  readonly targetLines: number | null;
  readonly limitLines: number | null;
  readonly limitChars: number | null;
  readonly maxProseLineWidth: number | null;
  readonly targetTokens: number | null;
  readonly limitTokens: number | null;
}

interface ProseMeasurement {
  readonly maxProseLen: number;
  readonly maxProseLineNum: number;
  readonly proseViolations: readonly ClassifiedLine[];
}

function readThresholds(content: string): FitnessThresholds {
  const frontmatter = extractFrontmatter(content);
  return {
    targetLines: getFrontmatterNumber(frontmatter, 'fitness_line_target'),
    limitLines: getFrontmatterNumber(frontmatter, 'fitness_line_limit'),
    limitChars: getFrontmatterNumber(frontmatter, 'fitness_char_limit'),
    maxProseLineWidth: getFrontmatterNumber(frontmatter, 'fitness_line_length'),
    targetTokens: getFrontmatterNumber(frontmatter, 'fitness_token_target'),
    limitTokens: getFrontmatterNumber(frontmatter, 'fitness_token_limit'),
  };
}

function buildConfigurationFindings(thresholds: FitnessThresholds): FitnessConfigurationFinding[] {
  const findings: FitnessConfigurationFinding[] = [];
  if (thresholds.targetTokens != null && thresholds.limitTokens == null) {
    findings.push({
      metric: 'tokens',
      text: 'fitness_token_target declared without fitness_token_limit — declare both or neither',
    });
  }
  return findings;
}

function measureProse(
  classified: readonly ClassifiedLine[],
  maxProseLineWidth: number | null,
): ProseMeasurement {
  const proseViolations: ClassifiedLine[] = [];
  let maxProseLen = 0;
  let maxProseLineNum = 0;

  for (const line of classified) {
    if (line.kind === 'prose') {
      const lineLength = line.text.length;
      if (lineLength > maxProseLen) {
        maxProseLen = lineLength;
        maxProseLineNum = line.lineNumber;
      }
      if (maxProseLineWidth != null && lineLength > maxProseLineWidth) {
        proseViolations.push(line);
      }
    }
  }

  return { maxProseLen, maxProseLineNum, proseViolations };
}

interface ContentMeasurement {
  readonly contentText: string;
  readonly totalLines: number;
  readonly totalChars: number;
  readonly estimatedTokens: number;
}

function measureContent(classified: readonly ClassifiedLine[]): ContentMeasurement {
  const contentLines = classified.filter((line) => line.kind !== 'frontmatter');
  const contentText = contentLines.map((line) => line.text).join('\n');
  const totalChars = contentText.length;
  return {
    contentText,
    totalLines: contentLines.length,
    totalChars,
    estimatedTokens: estimateTokensFromContentChars(totalChars),
  };
}

interface FitnessZones {
  readonly lineZone: FitnessZone | null;
  readonly charZone: FitnessCeilingZone | null;
  readonly proseZone: FitnessCeilingZone | null;
  readonly tokenZone: FitnessZone | null;
  readonly overallZone: FitnessZone;
}

function classifyZones(
  thresholds: FitnessThresholds,
  measurement: ContentMeasurement,
  prose: ProseMeasurement,
): FitnessZones {
  const lineZone = classifyFitnessZone(
    measurement.totalLines,
    thresholds.targetLines,
    thresholds.limitLines,
  );
  const charZone = classifyFitnessCeilingZone(measurement.totalChars, thresholds.limitChars);
  const proseZone = classifyFitnessCeilingZone(prose.maxProseLen, thresholds.maxProseLineWidth);
  // Token thresholds require both fields or neither (plan D3). Target-only is a
  // configuration finding, not a zone — do not classify until the limit exists.
  const tokenZone =
    thresholds.limitTokens == null
      ? null
      : classifyFitnessZone(
          measurement.estimatedTokens,
          thresholds.targetTokens,
          thresholds.limitTokens,
        );
  return {
    lineZone,
    charZone,
    proseZone,
    tokenZone,
    overallZone: worstZone([lineZone, charZone, proseZone, tokenZone]),
  };
}

function evaluateClassifiedFitnessFile(
  relPath: string,
  content: string,
  classified: readonly ClassifiedLine[],
): FitnessResult {
  const thresholds = readThresholds(content);
  const measurement = measureContent(classified);
  const prose = measureProse(classified, thresholds.maxProseLineWidth);
  const zones = classifyZones(thresholds, measurement, prose);
  const proseViolationCount = prose.proseViolations.length;

  return {
    filename: relPath,
    ...measurement,
    maxProseLen: prose.maxProseLen,
    maxProseLineNum: prose.maxProseLineNum,
    proseViolationCount,
    proseViolations: prose.proseViolations.slice(0, 5),
    targetLines: thresholds.targetLines,
    limitLines: thresholds.limitLines,
    limitChars: thresholds.limitChars,
    maxProseLineWidth: thresholds.maxProseLineWidth,
    targetTokens: thresholds.targetTokens,
    limitTokens: thresholds.limitTokens,
    ...zones,
    zoneMessages: buildAllZoneMessages(thresholds, {
      ...zones,
      totalLines: measurement.totalLines,
      totalChars: measurement.totalChars,
      estimatedTokens: measurement.estimatedTokens,
      maxProseLen: prose.maxProseLen,
      maxProseLineNum: prose.maxProseLineNum,
      proseViolationCount,
    }),
    configurationFindings: buildConfigurationFindings(thresholds),
  };
}

export function evaluateFitnessFile(relPath: string, content: string): FitnessResult {
  return evaluateClassifiedFitnessFile(relPath, content, classifyLines(content));
}
