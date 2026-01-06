/**
 * Ground truth entry definitions.
 *
 * KS4-specific queries are merged into secondary entries. Individual KS4 queries
 * have `keyStage: 'ks4'` set to ensure correct filtering during benchmark.
 *
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @packageDocumentation
 */
import type { GroundTruthEntry } from './types';
import { ART_PRIMARY_ALL_QUERIES } from '../art/primary';
import { ART_SECONDARY_ALL_QUERIES } from '../art/secondary';
import { CITIZENSHIP_SECONDARY_ALL_QUERIES } from '../citizenship/secondary';
import { COMPUTING_PRIMARY_ALL_QUERIES } from '../computing/primary';
import { COMPUTING_SECONDARY_ALL_QUERIES } from '../computing/secondary';
import { COOKING_PRIMARY_ALL_QUERIES } from '../cooking-nutrition/primary';
import { COOKING_SECONDARY_ALL_QUERIES } from '../cooking-nutrition/secondary';
import { DT_PRIMARY_ALL_QUERIES } from '../design-technology/primary';
import { DT_SECONDARY_ALL_QUERIES } from '../design-technology/secondary';
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
import { PE_PRIMARY_ALL_QUERIES } from '../physical-education/primary';
import { PE_SECONDARY_ALL_QUERIES } from '../physical-education/secondary';
import { RE_PRIMARY_ALL_QUERIES } from '../religious-education/primary';
import { RE_SECONDARY_ALL_QUERIES } from '../religious-education/secondary';
import { SCIENCE_PRIMARY_ALL_QUERIES } from '../science/primary';
import { SCIENCE_SECONDARY_ALL_QUERIES } from '../science/secondary';
import { SCIENCE_KS4_ALL_QUERIES } from '../science/secondary/ks4';
import { SPANISH_PRIMARY_ALL_QUERIES } from '../spanish/primary';
import { SPANISH_SECONDARY_ALL_QUERIES } from '../spanish/secondary';

/** Single source of truth for all ground truth entries. See ADR-098. */
export const GROUND_TRUTH_ENTRIES: readonly GroundTruthEntry[] = [
  // Art
  { subject: 'art', phase: 'primary', queries: ART_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  { subject: 'art', phase: 'secondary', queries: ART_SECONDARY_ALL_QUERIES, baselineMrr: 0.741 },
  // Citizenship (secondary only)
  {
    subject: 'citizenship',
    phase: 'secondary',
    queries: CITIZENSHIP_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.667,
  },
  // Computing
  {
    subject: 'computing',
    phase: 'primary',
    queries: COMPUTING_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  {
    subject: 'computing',
    phase: 'secondary',
    queries: COMPUTING_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.481,
  },
  // Cooking & Nutrition
  {
    subject: 'cooking-nutrition',
    phase: 'primary',
    queries: COOKING_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.493,
  },
  {
    subject: 'cooking-nutrition',
    phase: 'secondary',
    queries: COOKING_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  // Design & Technology
  {
    subject: 'design-technology',
    phase: 'primary',
    queries: DT_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  {
    subject: 'design-technology',
    phase: 'secondary',
    queries: DT_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.815,
  },
  // English (secondary includes KS4 set-text queries)
  { subject: 'english', phase: 'primary', queries: ENGLISH_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  {
    subject: 'english',
    phase: 'secondary',
    queries: [...ENGLISH_SECONDARY_ALL_QUERIES, ...ENGLISH_KS4_ALL_QUERIES],
    baselineMrr: 0.394,
  },
  // French
  { subject: 'french', phase: 'primary', queries: FRENCH_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  {
    subject: 'french',
    phase: 'secondary',
    queries: FRENCH_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.19,
  },
  // Geography (secondary includes KS4 fieldwork queries)
  {
    subject: 'geography',
    phase: 'primary',
    queries: GEOGRAPHY_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  {
    subject: 'geography',
    phase: 'secondary',
    queries: [...GEOGRAPHY_SECONDARY_ALL_QUERIES, ...GEOGRAPHY_KS4_ALL_QUERIES],
    baselineMrr: 0.759,
  },
  // German (secondary only)
  {
    subject: 'german',
    phase: 'secondary',
    queries: GERMAN_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.194,
  },
  // History (secondary includes KS4 historic environment queries)
  {
    subject: 'history',
    phase: 'primary',
    queries: HISTORY_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.667,
  },
  {
    subject: 'history',
    phase: 'secondary',
    queries: [...HISTORY_SECONDARY_ALL_QUERIES, ...HISTORY_KS4_ALL_QUERIES],
    baselineMrr: 0.95,
  },
  // Maths (secondary includes KS4 tier variant queries)
  { subject: 'maths', phase: 'primary', queries: MATHS_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  {
    subject: 'maths',
    phase: 'secondary',
    queries: [...MATHS_SECONDARY_ALL_QUERIES, ...MATHS_KS4_ALL_QUERIES],
    baselineMrr: 0.894,
  },
  // Music
  { subject: 'music', phase: 'primary', queries: MUSIC_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  {
    subject: 'music',
    phase: 'secondary',
    queries: MUSIC_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.722,
  },
  // Physical Education
  {
    subject: 'physical-education',
    phase: 'primary',
    queries: PE_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  {
    subject: 'physical-education',
    phase: 'secondary',
    queries: PE_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.356,
  },
  // Religious Education
  {
    subject: 'religious-education',
    phase: 'primary',
    queries: RE_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.0,
  },
  {
    subject: 'religious-education',
    phase: 'secondary',
    queries: RE_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.667,
  },
  // Science (secondary includes KS4 biology/chemistry/physics queries)
  {
    subject: 'science',
    phase: 'primary',
    queries: SCIENCE_PRIMARY_ALL_QUERIES,
    baselineMrr: 0.852,
  },
  {
    subject: 'science',
    phase: 'secondary',
    queries: [...SCIENCE_SECONDARY_ALL_QUERIES, ...SCIENCE_KS4_ALL_QUERIES],
    baselineMrr: 0.899,
  },
  // Spanish
  { subject: 'spanish', phase: 'primary', queries: SPANISH_PRIMARY_ALL_QUERIES, baselineMrr: 0.0 },
  {
    subject: 'spanish',
    phase: 'secondary',
    queries: SPANISH_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.294,
  },
] as const;
