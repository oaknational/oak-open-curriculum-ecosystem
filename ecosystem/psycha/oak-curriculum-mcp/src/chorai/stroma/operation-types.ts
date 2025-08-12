/**
 * Shared operation types for the Oak Curriculum domain
 * These types define the shape of operations across organs
 */

/**
 * Parameters for searching lessons
 */
export interface SearchLessonsParams {
  /** Search query text */
  q: string;
  /** Optional key stage filter */
  keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Optional subject filter */
  subject?:
    | 'art'
    | 'citizenship'
    | 'computing'
    | 'cooking-nutrition'
    | 'design-technology'
    | 'english'
    | 'french'
    | 'geography'
    | 'german'
    | 'history'
    | 'maths'
    | 'music'
    | 'physical-education'
    | 'religious-education'
    | 'rshe-pshe'
    | 'science'
    | 'spanish';
  /** Optional unit filter */
  unit?: string;
}
