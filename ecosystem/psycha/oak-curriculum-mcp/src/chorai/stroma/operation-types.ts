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
  keyStage?: 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'ks5';
  /** Optional subject filter */
  subject?:
    | 'english'
    | 'maths'
    | 'science'
    | 'history'
    | 'geography'
    | 'religious-education'
    | 'computing'
    | 'music'
    | 'art'
    | 'physical-education'
    | 'design-technology'
    | 'french'
    | 'spanish'
    | 'german'
    | 'latin'
    | 'citizenship'
    | 'rshe-pshe';
}
