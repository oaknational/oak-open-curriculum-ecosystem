import { V2_THEME_GROUPS } from '../../src/core/agent-identity/schemas/v2/themes';
import { V2_SHARED_VERBS } from '../../src/core/agent-identity/schemas/v2/verbs';

/**
 * Curation gates for the v2 noun-verb-noun naming material. These tests are
 * data-driven over the v2 manifest so each theme cycle adds only data files;
 * the gates themselves never change per theme. The WS2.8 assembly cycle adds
 * the completeness check that all six themes are registered.
 */

const SUBJECT_MINIMUM = 50;
const OBJECT_MINIMUM = 40;
const NOUN_MIN_LENGTH = 4;
const NOUN_MAX_LENGTH = 12;
const VERB_MIN_LENGTH = 4;
const VERB_MAX_LENGTH = 7;
const MINIMUM_DISTINCT_LENGTHS = 5;
const MINIMUM_UNIQUE_BIGRAM_RATIO = 0.6;

describe('v2 shared verb pool', () => {
  it('holds at least 16 unique lowercase verbs', () => {
    expect(V2_SHARED_VERBS.length).toBeGreaterThanOrEqual(16);
    expect(new Set(V2_SHARED_VERBS).size).toBe(V2_SHARED_VERBS.length);
    expect(V2_SHARED_VERBS.every((verb) => /^[a-z]+$/u.test(verb))).toBe(true);
  });

  it('keeps every verb within the middle-column length budget', () => {
    const lengths = V2_SHARED_VERBS.map((verb) => verb.length);

    expect(Math.min(...lengths)).toBeGreaterThanOrEqual(VERB_MIN_LENGTH);
    expect(Math.max(...lengths)).toBeLessThanOrEqual(VERB_MAX_LENGTH);
  });

  it('uses third-person singular present-tense forms so names read as micro-sentences', () => {
    expect(V2_SHARED_VERBS.every((verb) => verb.endsWith('s'))).toBe(true);
    expect(V2_SHARED_VERBS.every((verb) => !verb.endsWith('ing'))).toBe(true);
  });
});

describe('v2 themed noun columns', () => {
  it('registers the complete six-theme manifest (gates can never pass vacuously)', () => {
    expect(V2_THEME_GROUPS.length).toBeGreaterThanOrEqual(6);
  });

  it('passes every per-column curation gate in every registered theme', () => {
    for (const theme of V2_THEME_GROUPS) {
      assertNounColumn(`${theme.group} subject`, theme.subjectNouns, SUBJECT_MINIMUM);
      assertNounColumn(`${theme.group} object`, theme.objectNouns, OBJECT_MINIMUM);
    }
  });

  it('shares no stems between a theme subject column and its object column', () => {
    for (const theme of V2_THEME_GROUPS) {
      for (const subject of theme.subjectNouns) {
        for (const object of theme.objectNouns) {
          const sharesStem = subject.startsWith(object) || object.startsWith(subject);
          expect(sharesStem, `${theme.group}: "${subject}" and "${object}" share a stem`).toBe(
            false,
          );
        }
      }
    }
  });

  it('keeps subject nouns disjoint across themes', () => {
    assertDisjointAcrossThemes(V2_THEME_GROUPS.map((theme) => theme.subjectNouns));
  });

  it('keeps object nouns disjoint across themes', () => {
    assertDisjointAcrossThemes(V2_THEME_GROUPS.map((theme) => theme.objectNouns));
  });
});

function assertNounColumn(label: string, column: readonly string[], minimumSize: number): void {
  expect(column.length, `${label}: column size`).toBeGreaterThanOrEqual(minimumSize);
  expect(new Set(column).size, `${label}: duplicate words`).toBe(column.length);

  for (const word of column) {
    expect(/^[a-z]+$/u.test(word), `${label}: "${word}" must be lowercase a-z`).toBe(true);
    expect(word.length, `${label}: "${word}" below minimum length`).toBeGreaterThanOrEqual(
      NOUN_MIN_LENGTH,
    );
    expect(word.length, `${label}: "${word}" above maximum length`).toBeLessThanOrEqual(
      NOUN_MAX_LENGTH,
    );
  }

  const distinctLengths = new Set(column.map((word) => word.length));
  expect(distinctLengths.size, `${label}: length variety`).toBeGreaterThanOrEqual(
    MINIMUM_DISTINCT_LENGTHS,
  );

  const bigrams = new Set(column.map((word) => word.slice(0, 2)));
  expect(bigrams.size / column.length, `${label}: initial-bigram diversity`).toBeGreaterThanOrEqual(
    MINIMUM_UNIQUE_BIGRAM_RATIO,
  );
}

function assertDisjointAcrossThemes(columns: readonly (readonly string[])[]): void {
  const seen = new Map<string, number>();
  columns.forEach((column, themeIndex) => {
    for (const word of column) {
      const previousTheme = seen.get(word);
      expect(
        previousTheme,
        `"${word}" appears in theme index ${String(previousTheme)} and ${String(themeIndex)}`,
      ).toBeUndefined();
      seen.set(word, themeIndex);
    }
  });
}
