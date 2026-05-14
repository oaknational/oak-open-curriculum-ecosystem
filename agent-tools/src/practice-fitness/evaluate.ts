import {
  classifyFitnessCeilingZone,
  classifyFitnessZone,
  estimateTokensFromContentChars,
  worstZone,
  type FitnessCeilingZone,
  type FitnessZone,
  type ZoneMessage,
} from './model.js';
import {
  classifyLines,
  extractFrontmatter,
  getFrontmatterNumber,
  type ClassifiedLine,
} from './markdown.js';
import {
  buildCharZoneMessages,
  buildLineZoneMessages,
  buildProseZoneMessages,
} from './messages.js';

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
  readonly lineZone: FitnessZone | null;
  readonly charZone: FitnessCeilingZone | null;
  readonly proseZone: FitnessCeilingZone | null;
  readonly overallZone: FitnessZone;
  readonly zoneMessages: readonly ZoneMessage[];
}

interface FitnessThresholds {
  readonly targetLines: number | null;
  readonly limitLines: number | null;
  readonly limitChars: number | null;
  readonly maxProseLineWidth: number | null;
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
  };
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

function buildZoneMessages(
  thresholds: FitnessThresholds,
  result: Pick<
    FitnessResult,
    | 'lineZone'
    | 'charZone'
    | 'proseZone'
    | 'totalLines'
    | 'totalChars'
    | 'maxProseLen'
    | 'maxProseLineNum'
    | 'proseViolationCount'
  >,
): ZoneMessage[] {
  return [
    ...buildLineZoneMessages(
      result.lineZone,
      result.totalLines,
      thresholds.targetLines,
      thresholds.limitLines,
    ),
    ...buildCharZoneMessages(result.charZone, result.totalChars, thresholds.limitChars),
    ...buildProseZoneMessages(
      result.proseZone,
      result.proseViolationCount,
      result.maxProseLen,
      result.maxProseLineNum,
      thresholds.maxProseLineWidth,
    ),
  ];
}

function evaluateClassifiedFitnessFile(
  relPath: string,
  content: string,
  classified: readonly ClassifiedLine[],
): FitnessResult {
  const thresholds = readThresholds(content);
  const contentLines = classified.filter((line) => line.kind !== 'frontmatter');
  const contentText = contentLines.map((line) => line.text).join('\n');
  const totalLines = contentLines.length;
  const totalChars = contentText.length;
  const prose = measureProse(classified, thresholds.maxProseLineWidth);
  const lineZone = classifyFitnessZone(totalLines, thresholds.targetLines, thresholds.limitLines);
  const charZone = classifyFitnessCeilingZone(totalChars, thresholds.limitChars);
  const proseZone = classifyFitnessCeilingZone(prose.maxProseLen, thresholds.maxProseLineWidth);
  const overallZone = worstZone([lineZone, charZone, proseZone]);
  const partialResult = {
    lineZone,
    charZone,
    proseZone,
    totalLines,
    totalChars,
    maxProseLen: prose.maxProseLen,
    maxProseLineNum: prose.maxProseLineNum,
    proseViolationCount: prose.proseViolations.length,
  };

  return {
    filename: relPath,
    contentText,
    totalLines,
    totalChars,
    estimatedTokens: estimateTokensFromContentChars(totalChars),
    maxProseLen: prose.maxProseLen,
    maxProseLineNum: prose.maxProseLineNum,
    proseViolationCount: prose.proseViolations.length,
    proseViolations: prose.proseViolations.slice(0, 5),
    targetLines: thresholds.targetLines,
    limitLines: thresholds.limitLines,
    limitChars: thresholds.limitChars,
    maxProseLineWidth: thresholds.maxProseLineWidth,
    lineZone,
    charZone,
    proseZone,
    overallZone,
    zoneMessages: buildZoneMessages(thresholds, partialResult),
  };
}

export function evaluateFitnessFile(relPath: string, content: string): FitnessResult {
  return evaluateClassifiedFitnessFile(relPath, content, classifyLines(content));
}
