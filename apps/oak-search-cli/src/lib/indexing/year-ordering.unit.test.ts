import { describe, expect, it } from 'vitest';
import { compareCurriculumYears } from './year-ordering';

describe('compareCurriculumYears', () => {
  it('sorts curriculum years by numeric display order', () => {
    expect(['11', '7', '10', '8', '9'].sort(compareCurriculumYears)).toEqual([
      '7',
      '8',
      '9',
      '10',
      '11',
    ]);
  });

  it('places all-years after concrete year values', () => {
    expect(['all-years', 'year-3', 'year-1'].sort(compareCurriculumYears)).toEqual([
      'year-1',
      'year-3',
      'all-years',
    ]);
  });
});
