import { describe, expect, it } from 'vitest';

import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import { declaredVsObservedDivergence, relatedStrandEdges } from './raw-domains.js';

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
