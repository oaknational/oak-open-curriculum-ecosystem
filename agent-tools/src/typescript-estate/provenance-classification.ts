import { err, ok, type Result } from '@oaknational/result';
import { getLeadingCommentRanges } from 'typescript';

import type {
  GeneratedOutputRule,
  ProvenanceClassificationConfig,
} from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import type { ProvenanceSignal } from './file-model.js';
import type { Provenance } from './file-vocabulary.js';
import { findGeneratedOutputRule } from './generated-output-rules.js';
import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

export interface ProvenanceClassificationInput {
  readonly path: RepoPath;
  readonly sourceText: string | null;
}
export interface ProvenanceClassificationResult {
  readonly provenance: Provenance;
  readonly signals: readonly ProvenanceSignal[];
}
export interface ProvenanceClassifier {
  classify(input: ProvenanceClassificationInput): ProvenanceClassificationResult;
}
interface CompiledHeaderMatcher {
  readonly id: 'leading-generated-banner';
  readonly pattern: RegExp;
}

export function createProvenanceClassifier(
  config: ProvenanceClassificationConfig,
  generatedRules: readonly GeneratedOutputRule[],
): Result<ProvenanceClassifier, EstateReviewError> {
  const matcher = compileHeaderMatcher(config);
  if (matcher instanceof EstateReviewError) {
    return err(matcher);
  }

  const pathMatchers = clonePathMatchers(config.generatedPathMatchers);
  const rules = generatedRules.map(cloneRule);

  return ok({
    classify(input) {
      const signals = collectSignals(input, pathMatchers, matcher, rules);
      return { provenance: classifySignals(input.sourceText !== null, signals), signals };
    },
  });
}

function clonePathMatchers(
  matchers: ProvenanceClassificationConfig['generatedPathMatchers'],
): ProvenanceClassificationConfig['generatedPathMatchers'] {
  const [directory, suffix] = matchers;
  return [
    { ...directory, values: [directory.values[0], directory.values[1]] },
    { ...suffix, values: [suffix.values[0], suffix.values[1]] },
  ];
}

function cloneRule(rule: GeneratedOutputRule): GeneratedOutputRule {
  return { ...rule, producerEvidence: cloneNonEmpty(rule.producerEvidence) };
}

function compileHeaderMatcher(
  config: ProvenanceClassificationConfig,
): CompiledHeaderMatcher | EstateReviewError {
  const [configured] = config.generatedHeaderMatchers;
  try {
    return {
      id: configured.id,
      pattern: new RegExp(configured.source, configured.flags),
    };
  } catch (cause: unknown) {
    return new EstateReviewError('CONFIG_INVALID', 'generated-header matcher is invalid', {
      cause,
    });
  }
}

function collectSignals(
  input: ProvenanceClassificationInput,
  pathMatchers: ProvenanceClassificationConfig['generatedPathMatchers'],
  headerMatcher: CompiledHeaderMatcher,
  generatedRules: readonly GeneratedOutputRule[],
): readonly ProvenanceSignal[] {
  const signals: ProvenanceSignal[] = [];

  for (const matcher of pathMatchers) {
    if (pathMatcherMatches(input.path, matcher)) {
      signals.push({ kind: 'generated-path', matcherId: matcher.id, evidencePath: input.path });
    }
  }
  if (input.sourceText !== null) {
    const offsets = leadingHeaderOffsets(input.sourceText, headerMatcher.pattern);
    if (offsets !== undefined) {
      signals.push({
        kind: 'generated-header',
        matcherId: headerMatcher.id,
        evidencePath: input.path,
        ...offsets,
      });
    }
  }
  const generatedRule = findGeneratedOutputRule(generatedRules, input.path);
  if (generatedRule !== undefined) {
    signals.push({
      kind: 'producer-output-rule',
      ruleId: generatedRule.id,
      producerEvidencePaths: cloneNonEmpty(generatedRule.producerEvidence),
    });
  }

  return deduplicateSignals(signals.toSorted(compareSignals));
}

function pathMatcherMatches(
  path: RepoPath,
  matcher: ProvenanceClassificationConfig['generatedPathMatchers'][number],
): boolean {
  if (matcher.kind === 'complete-path-segment') {
    const segments = new Set(path.split('/').filter((segment) => segment.length > 0));
    return matcher.values.some((value) => segments.has(value));
  }
  const basename = path.slice(path.lastIndexOf('/') + 1);
  return matcher.values.some((value) => basename.endsWith(value));
}

function leadingHeaderOffsets(
  sourceText: string,
  pattern: RegExp,
): { readonly startOffset: number; readonly endOffset: number } | undefined {
  let earliest: { readonly startOffset: number; readonly endOffset: number } | undefined;
  for (const range of getLeadingCommentRanges(sourceText, 0) ?? []) {
    pattern.lastIndex = 0;
    const match = pattern.exec(sourceText.slice(range.pos, range.end));
    if (match?.index === undefined) {
      continue;
    }
    const startOffset = range.pos + match.index;
    if (earliest === undefined || startOffset < earliest.startOffset) {
      earliest = { startOffset, endOffset: startOffset + match[0].length };
    }
  }
  return earliest;
}

function classifySignals(readable: boolean, signals: readonly ProvenanceSignal[]): Provenance {
  if (signals.some(({ kind }) => kind === 'producer-output-rule')) {
    return 'generated-confirmed';
  }
  if (signals.some(({ kind }) => kind === 'generated-path' || kind === 'generated-header')) {
    return 'generated-declared-unconfirmed';
  }
  if (signals.some(({ kind }) => kind === 'imported-reference-path')) {
    return 'imported';
  }
  return readable ? 'authored' : 'unknown';
}

function deduplicateSignals(signals: readonly ProvenanceSignal[]): readonly ProvenanceSignal[] {
  const unique: ProvenanceSignal[] = [];
  let previous: ProvenanceSignal | undefined;
  for (const signal of signals) {
    if (previous === undefined || compareSignals(previous, signal) !== 0) {
      unique.push(signal);
    }
    previous = signal;
  }
  return unique;
}

function compareSignals(left: ProvenanceSignal, right: ProvenanceSignal): number {
  return (
    compareUtf16(left.kind, right.kind) ||
    compareUtf16(signalId(left), signalId(right)) ||
    compareOptionalString(signalEvidencePath(left), signalEvidencePath(right)) ||
    compareOptionalNumber(signalOffset(left, 'startOffset'), signalOffset(right, 'startOffset')) ||
    compareOptionalNumber(signalOffset(left, 'endOffset'), signalOffset(right, 'endOffset')) ||
    compareStringSequences(signalProducerPaths(left), signalProducerPaths(right))
  );
}

function signalId(signal: ProvenanceSignal): string {
  return 'matcherId' in signal ? signal.matcherId : signal.ruleId;
}

function signalEvidencePath(signal: ProvenanceSignal): RepoPath | undefined {
  return 'evidencePath' in signal ? signal.evidencePath : undefined;
}

function signalOffset(
  signal: ProvenanceSignal,
  field: 'startOffset' | 'endOffset',
): number | undefined {
  return signal.kind === 'generated-header' ? signal[field] : undefined;
}

function signalProducerPaths(signal: ProvenanceSignal): readonly RepoPath[] {
  return signal.kind === 'producer-output-rule' ? signal.producerEvidencePaths : [];
}

function compareOptionalString(left: string | undefined, right: string | undefined): number {
  if (left === undefined) {
    return right === undefined ? 0 : -1;
  }
  return right === undefined ? 1 : compareUtf16(left, right);
}

function compareOptionalNumber(left: number | undefined, right: number | undefined): number {
  if (left === undefined) {
    return right === undefined ? 0 : -1;
  }
  return right === undefined ? 1 : left - right;
}

function compareStringSequences(left: readonly string[], right: readonly string[]): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const compared = compareUtf16(left[index] ?? '', right[index] ?? '');
    if (compared !== 0) {
      return compared;
    }
  }
  return left.length - right.length;
}

function cloneNonEmpty<T>(values: NonEmptyReadonlyArray<T>): NonEmptyReadonlyArray<T> {
  const [first, ...remaining] = values;
  return [first, ...remaining];
}
