import { describe, expect, it } from 'vitest';

import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import {
  declaredVsObservedDivergence,
  OBSERVED_KEY_STAGES,
  OBSERVED_PHASES,
  OBSERVED_PRIORITIES,
  relatedStrandEdges,
  strandAxisIndex,
} from './raw-domains.js';

describe('declaredVsObservedDivergence', () => {
  it('lists the declared phases no strand carries', () => {
    expect(declaredVsObservedDivergence.phase).toEqual(['post_16', 'all_through', 'special']);
  });

  it('lists KS5 as the only declared key stage no strand carries', () => {
    expect(declaredVsObservedDivergence.keyStage).toEqual(['KS5']);
  });

  it('lists the declared priorities no strand carries', () => {
    expect(declaredVsObservedDivergence.priority).toEqual([
      'improving_attendance',
      'teacher_retention',
    ]);
  });

  it('only ever reports values the schema actually declares', () => {
    const props = EEF_TOOLKIT_DATA.school_context_schema.properties;
    for (const phase of declaredVsObservedDivergence.phase) {
      expect(props.phase.enum).toContain(phase);
    }
    for (const keyStage of declaredVsObservedDivergence.keyStage) {
      expect(props.key_stage.enum).toContain(keyStage);
    }
    for (const priority of declaredVsObservedDivergence.priority) {
      expect(props.priorities.items.enum).toContain(priority);
    }
  });
});

describe('relatedStrandEdges', () => {
  it('derives one directed edge per related_strands reference', () => {
    const referenceCount = EEF_TOOLKIT_DATA.strands.reduce(
      (total, strand) =>
        'related_strands' in strand ? total + strand.related_strands.length : total,
      0,
    );
    expect(relatedStrandEdges.length).toBe(referenceCount);
    expect(relatedStrandEdges.length).toBeGreaterThan(0);
  });

  it('grounds both endpoints of every edge in a real corpus strand id', () => {
    const ids = new Set(EEF_TOOLKIT_DATA.strands.map((strand) => strand.id));
    for (const edge of relatedStrandEdges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
    }
  });
});

describe('strandAxisIndex', () => {
  it('keys exactly the school_context_relevance-present strands (derived, not hard-coded)', () => {
    const scrStrandIds = EEF_TOOLKIT_DATA.strands
      .filter((strand) => 'school_context_relevance' in strand)
      .map((strand) => strand.id)
      .sort((a, b) => a.localeCompare(b));
    const axisKeys = [...strandAxisIndex.keys()].sort((a, b) => a.localeCompare(b));
    expect(axisKeys).toEqual(scrStrandIds);
    expect(axisKeys.length).toBeGreaterThan(0);
  });

  it('projects each strand observed axes straight from its school_context_relevance', () => {
    for (const strand of EEF_TOOLKIT_DATA.strands) {
      if (!('school_context_relevance' in strand)) {
        continue;
      }
      const axis = strandAxisIndex.get(strand.id);
      expect(axis?.phases).toEqual(strand.school_context_relevance.most_relevant_phases);
      expect(axis?.keyStages).toEqual(strand.school_context_relevance.most_relevant_key_stages);
      expect(axis?.priorities).toEqual(strand.school_context_relevance.most_relevant_priorities);
    }
  });
});

describe('observed-domain runtime constants (D6 schema enumeration)', () => {
  it('OBSERVED_PHASES is the declared phases that some strand actually carries', () => {
    expect([...OBSERVED_PHASES].sort((a, b) => a.localeCompare(b))).toEqual([
      'early_years',
      'primary',
      'secondary',
    ]);
  });

  it('OBSERVED_KEY_STAGES is the declared key stages some strand carries (excludes KS5)', () => {
    expect([...OBSERVED_KEY_STAGES].sort((a, b) => a.localeCompare(b))).toEqual([
      'EYFS',
      'KS1',
      'KS2',
      'KS3',
      'KS4',
    ]);
    expect(OBSERVED_KEY_STAGES).not.toContain('KS5');
  });

  it('OBSERVED_PRIORITIES are declared priorities some strand carries (excludes the known-unobserved)', () => {
    const declared = EEF_TOOLKIT_DATA.school_context_schema.properties.priorities.items.enum;
    expect(OBSERVED_PRIORITIES.length).toBeGreaterThan(0);
    // every observed value is a real declared priority (grounded against the schema enum)
    for (const priority of OBSERVED_PRIORITIES) {
      expect(declared).toContain(priority);
    }
    // the two declared priorities no strand carries, named as literals
    expect(OBSERVED_PRIORITIES).not.toContain('improving_attendance');
    expect(OBSERVED_PRIORITIES).not.toContain('teacher_retention');
  });

  it('reports no value the declared-vs-observed divergence marks unobserved', () => {
    for (const phase of declaredVsObservedDivergence.phase) {
      expect(OBSERVED_PHASES).not.toContain(phase);
    }
    for (const keyStage of declaredVsObservedDivergence.keyStage) {
      expect(OBSERVED_KEY_STAGES).not.toContain(keyStage);
    }
    for (const priority of declaredVsObservedDivergence.priority) {
      expect(OBSERVED_PRIORITIES).not.toContain(priority);
    }
  });
});
