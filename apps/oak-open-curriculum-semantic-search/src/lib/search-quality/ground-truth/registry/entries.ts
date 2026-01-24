/**
 * Ground truth entry definitions.
 *
 * KS4-specific queries are merged into secondary entries. Individual KS4 queries
 * have `keyStage: 'ks4'` set to ensure correct filtering during benchmark.
 *
 * **Note**: Baseline metrics are stored separately in baselines.json,
 * not in these entries. This separates test data from results.
 *
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @see GROUND-TRUTH-PROCESS.md for how to create valid entries
 * @packageDocumentation
 */
import type { GroundTruthEntry } from './types';
import { ART_PRIMARY_ALL_QUERIES } from '../art/primary';
import { ART_SECONDARY_ALL_QUERIES } from '../art/secondary';
import { CITIZENSHIP_SECONDARY_ALL_QUERIES } from '../citizenship/secondary';
import { COMPUTING_PRIMARY_ALL_QUERIES } from '../computing/primary';
import { COMPUTING_SECONDARY_ALL_QUERIES } from '../computing/secondary';
import { COOKING_NUTRITION_PRIMARY_ALL_QUERIES } from '../cooking-nutrition/primary';
import { COOKING_NUTRITION_SECONDARY_ALL_QUERIES } from '../cooking-nutrition/secondary';
import { DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES } from '../design-technology/primary';
import { DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES } from '../design-technology/secondary';
import { ENGLISH_PRIMARY_ALL_QUERIES } from '../english/primary';
import { ENGLISH_SECONDARY_ALL_QUERIES } from '../english/secondary';
import { ENGLISH_KS4_ALL_QUERIES } from '../english/secondary/ks4';
import { FRENCH_PRIMARY_ALL_QUERIES } from '../french/primary';
import { FRENCH_SECONDARY_ALL_QUERIES } from '../french/secondary';
import { GEOGRAPHY_PRIMARY_ALL_QUERIES } from '../geography/primary';
import { GEOGRAPHY_SECONDARY_ALL_QUERIES } from '../geography/secondary';
import { GEOGRAPHY_KS4_ALL_QUERIES } from '../geography/secondary/ks4';
import { GERMAN_SECONDARY_ALL_QUERIES } from '../german/secondary';
import { HISTORY_PRIMARY_ALL_QUERIES } from '../history/primary';
import { HISTORY_SECONDARY_ALL_QUERIES } from '../history/secondary';
import { HISTORY_KS4_ALL_QUERIES } from '../history/secondary/ks4';
import { MATHS_PRIMARY_ALL_QUERIES } from '../maths/primary';
import { MATHS_SECONDARY_ALL_QUERIES } from '../maths/secondary';
import { MATHS_KS4_ALL_QUERIES } from '../maths/secondary/ks4';
import { MUSIC_PRIMARY_ALL_QUERIES } from '../music/primary';
import { MUSIC_SECONDARY_ALL_QUERIES } from '../music/secondary';
import { PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES } from '../physical-education/primary';
import { PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES } from '../physical-education/secondary';
import { RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES } from '../religious-education/primary';
import { RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES } from '../religious-education/secondary';
import { SCIENCE_PRIMARY_ALL_QUERIES } from '../science/primary';
import { SCIENCE_SECONDARY_ALL_QUERIES } from '../science/secondary';
import { SPANISH_PRIMARY_ALL_QUERIES } from '../spanish/primary';
import { SPANISH_SECONDARY_ALL_QUERIES } from '../spanish/secondary';

/** Single source of truth for all ground truth entries. See ADR-098. */
export const GROUND_TRUTH_ENTRIES: readonly GroundTruthEntry[] = [
  // Art
  { subject: 'art', phase: 'primary', queries: ART_PRIMARY_ALL_QUERIES },
  { subject: 'art', phase: 'secondary', queries: ART_SECONDARY_ALL_QUERIES },
  // Citizenship (secondary only)
  { subject: 'citizenship', phase: 'secondary', queries: CITIZENSHIP_SECONDARY_ALL_QUERIES },
  // Computing
  { subject: 'computing', phase: 'primary', queries: COMPUTING_PRIMARY_ALL_QUERIES },
  { subject: 'computing', phase: 'secondary', queries: COMPUTING_SECONDARY_ALL_QUERIES },
  // Cooking & Nutrition
  {
    subject: 'cooking-nutrition',
    phase: 'primary',
    queries: COOKING_NUTRITION_PRIMARY_ALL_QUERIES,
  },
  {
    subject: 'cooking-nutrition',
    phase: 'secondary',
    queries: COOKING_NUTRITION_SECONDARY_ALL_QUERIES,
  },
  // Design & Technology
  {
    subject: 'design-technology',
    phase: 'primary',
    queries: DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES,
  },
  {
    subject: 'design-technology',
    phase: 'secondary',
    queries: DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES,
  },
  // English (secondary includes KS4 set-text queries)
  { subject: 'english', phase: 'primary', queries: ENGLISH_PRIMARY_ALL_QUERIES },
  {
    subject: 'english',
    phase: 'secondary',
    queries: [...ENGLISH_SECONDARY_ALL_QUERIES, ...ENGLISH_KS4_ALL_QUERIES],
  },
  // French
  { subject: 'french', phase: 'primary', queries: FRENCH_PRIMARY_ALL_QUERIES },
  { subject: 'french', phase: 'secondary', queries: FRENCH_SECONDARY_ALL_QUERIES },
  // Geography (secondary includes KS4 fieldwork queries)
  { subject: 'geography', phase: 'primary', queries: GEOGRAPHY_PRIMARY_ALL_QUERIES },
  {
    subject: 'geography',
    phase: 'secondary',
    queries: [...GEOGRAPHY_SECONDARY_ALL_QUERIES, ...GEOGRAPHY_KS4_ALL_QUERIES],
  },
  // German (secondary only)
  { subject: 'german', phase: 'secondary', queries: GERMAN_SECONDARY_ALL_QUERIES },
  // History (secondary includes KS4 historic environment queries)
  { subject: 'history', phase: 'primary', queries: HISTORY_PRIMARY_ALL_QUERIES },
  {
    subject: 'history',
    phase: 'secondary',
    queries: [...HISTORY_SECONDARY_ALL_QUERIES, ...HISTORY_KS4_ALL_QUERIES],
  },
  // Maths (secondary includes KS4 tier variant queries)
  { subject: 'maths', phase: 'primary', queries: MATHS_PRIMARY_ALL_QUERIES },
  {
    subject: 'maths',
    phase: 'secondary',
    queries: [...MATHS_SECONDARY_ALL_QUERIES, ...MATHS_KS4_ALL_QUERIES],
  },
  // Music
  { subject: 'music', phase: 'primary', queries: MUSIC_PRIMARY_ALL_QUERIES },
  { subject: 'music', phase: 'secondary', queries: MUSIC_SECONDARY_ALL_QUERIES },
  // Physical Education
  {
    subject: 'physical-education',
    phase: 'primary',
    queries: PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES,
  },
  {
    subject: 'physical-education',
    phase: 'secondary',
    queries: PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES,
  },
  // Religious Education
  {
    subject: 'religious-education',
    phase: 'primary',
    queries: RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES,
  },
  {
    subject: 'religious-education',
    phase: 'secondary',
    queries: RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES,
  },
  // Science (secondary includes KS4 biology/chemistry/physics queries)
  { subject: 'science', phase: 'primary', queries: SCIENCE_PRIMARY_ALL_QUERIES },
  {
    subject: 'science',
    phase: 'secondary',
    queries: SCIENCE_SECONDARY_ALL_QUERIES,
  },
  // Spanish
  { subject: 'spanish', phase: 'primary', queries: SPANISH_PRIMARY_ALL_QUERIES },
  { subject: 'spanish', phase: 'secondary', queries: SPANISH_SECONDARY_ALL_QUERIES },
] as const;
