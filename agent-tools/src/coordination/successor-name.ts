import { err, ok, type Result } from '@oaknational/result';

/**
 * Pure naming rule for the next coordination branch (owner-ruled 2026-08-17):
 * `coordination/<UTC date>-<sha6>`, where `<sha6>` is the FIRST SIX hex
 * characters of the FULL sha of the base tip. The suffix is deliberate
 * lineage policy — a checkout cutting from a different tip almost always
 * mints a different name (six characters trade uniqueness for legibility;
 * distinct tips can share a prefix, so the suffix is lineage signal, not a
 * uniqueness proof) — and the input must be the full sha, never an abbreviation
 * (`git rev-parse --short` output can grow beyond six characters with
 * ambiguity and would corrupt the suffix).
 */

const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/u;
const SUFFIX_LENGTH = 6;
const ISO_DATE_LENGTH = 10;

export interface CoordinationSuccessorNameInput {
  /** The full 40-hex commit sha of the base ref's tip. */
  readonly fullSha: string;
  /** The current instant; the name carries its UTC calendar date. */
  readonly now: Date;
}

/** Format the successor coordination branch name from a full sha and a clock reading. */
export function formatCoordinationSuccessorName(
  input: CoordinationSuccessorNameInput,
): Result<string, Error> {
  if (!FULL_SHA_PATTERN.test(input.fullSha)) {
    return err(
      new Error(
        `coordination: expected a full 40-hex commit sha, got '${input.fullSha}' — ` +
          'the suffix is the first six characters of the FULL sha, never an abbreviation',
      ),
    );
  }
  if (Number.isNaN(input.now.getTime())) {
    return err(new Error('coordination: the clock produced an invalid date'));
  }

  const utcDate = input.now.toISOString().slice(0, ISO_DATE_LENGTH);
  return ok(`coordination/${utcDate}-${input.fullSha.slice(0, SUFFIX_LENGTH)}`);
}
