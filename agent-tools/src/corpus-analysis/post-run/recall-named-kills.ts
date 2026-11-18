import { escapeRegExp } from '../../core/escape-reg-exp.js';
import type { MetaOutput } from '../recall-schemas.js';

/**
 * Tier-D identification: killed candidates the meta stage's recall judgments identify as
 * baseline-matching (salvage ws1).
 *
 * @remarks
 * Two evidence routes, labelled by source: a `matchedCandidateId` on a recall match
 * (recall-matched — the meta stage's direct judgment) and a candidate-id mention inside a
 * recall note (note-named — the meta agent naming where a missed baseline's substance
 * actually lives). A recall-matched source outranks note-named when both name the same
 * kill. Mentions are intersected with the real candidate-id set before classification, so
 * a phantom id in free text can never mint a tier-D entry.
 */

/**
 * Whole-id mention matchers built from the run's own candidate ids, since the candidate schema
 * constrains no id shape: each id matches as a whole token, with no ASCII id character (a
 * letter, a digit, `_` or `-`) on either side, so C18 never bleeds into C185 and an id such as
 * `candidate-1` is found. Longest ids come first, for {@link mentionedCandidateIds}.
 */
function mentionMatchers(
  candidateIds: ReadonlySet<string>,
): readonly (readonly [string, RegExp])[] {
  return [...candidateIds]
    .toSorted((a, b) => b.length - a.length)
    .map((candidateId) => [
      candidateId,
      new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(candidateId)}(?![A-Za-z0-9_-])`, 'gu'),
    ]);
}

/**
 * The candidate ids a note mentions. A `.` or any other character outside the id class reads
 * as a boundary, so one id can match inside another's mention (C1 inside C1.1); the longer id
 * claims its span first and a match inside a claimed span names nothing.
 */
function mentionedCandidateIds(
  note: string,
  matchers: readonly (readonly [string, RegExp])[],
): readonly string[] {
  const claimed: (readonly [number, number])[] = [];
  const named: string[] = [];
  for (const [candidateId, matcher] of matchers) {
    for (const match of note.matchAll(matcher)) {
      const start = match.index;
      const end = start + match[0].length;
      if (claimed.every(([from, to]) => end <= from || to <= start)) {
        claimed.push([start, end]);
        named.push(candidateId);
      }
    }
  }
  return named;
}

/** How the recall judgments name one killed candidate, and which baselines name it. */
export interface RecallNamedKill {
  readonly source: 'recall-matched' | 'note-named';
  readonly baselineIds: ReadonlySet<string>;
}

/** Module-internal accumulator; the exported shape is the readonly projection above. */
interface MutableRecallNamedKill {
  source: RecallNamedKill['source'];
  readonly baselineIds: Set<string>;
}

export function recallNamedKills(
  meta: MetaOutput,
  candidateIds: ReadonlySet<string>,
  killIds: ReadonlySet<string>,
): ReadonlyMap<string, RecallNamedKill> {
  const records = new Map<string, MutableRecallNamedKill>();
  const matchers = mentionMatchers(candidateIds);
  const add = (
    candidateId: string,
    source: RecallNamedKill['source'],
    baselineId: string,
  ): void => {
    const existing = records.get(candidateId);
    if (existing === undefined) {
      records.set(candidateId, { source, baselineIds: new Set([baselineId]) });
      return;
    }
    existing.baselineIds.add(baselineId);
    if (source === 'recall-matched') {
      existing.source = 'recall-matched';
    }
  };
  for (const match of meta.recallMatches) {
    if (match.matchedCandidateId !== undefined && killIds.has(match.matchedCandidateId)) {
      add(match.matchedCandidateId, 'recall-matched', match.baselineId);
    }
    // The note-named route applies to a MISSED baseline only: its note says where the
    // substance lives; a re-found baseline's note names its match, not a salvage.
    if (match.verdict !== 'missed') {
      continue;
    }
    for (const candidateId of mentionedCandidateIds(match.note, matchers)) {
      if (killIds.has(candidateId)) {
        add(candidateId, 'note-named', match.baselineId);
      }
    }
  }
  return records;
}
