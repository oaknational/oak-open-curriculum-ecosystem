/**
 * Hard ground truth queries for Secondary English search.
 *
 * Tests the search system with challenging scenarios: naturalistic phrasing,
 * misspellings, synonyms, multi-concept queries, colloquial language.
 *
 * Merged from SECONDARY and KS4 hard queries.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Secondary English (KS3-4).
 *
 * Designed to challenge the search system with real-world query patterns.
 */
export const HARD_QUERIES_SECONDARY_ENGLISH: readonly GroundTruthQuery[] = [
  // ==========================================
  // SECONDARY Hard Queries
  // ==========================================

  // NATURALISTIC (SECONDARY)
  {
    query: 'teach students about gothic literature year 8',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request with year group specification.',
    expectedRelevance: {
      'diving-deeper-into-the-gothic-genre': 3,
      'frankenstein-and-the-gothic-context': 3,
      'gothic-vocabulary-in-jane-eyre': 2,
    },
  },

  // MISSPELLING (SECONDARY)
  {
    query: 'frankenstien monster creation',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common Frankenstein misspelling.',
    expectedRelevance: {
      'frankensteins-reaction-to-his-creation': 3,
      'frankenstein-and-the-gothic-context': 3,
      'frankensteins-regret': 2,
    },
  },

  // SYNONYM (SECONDARY)
  {
    query: 'detective stories mystery solving',
    category: 'synonym',
    priority: 'high',
    description: 'Detective = Sherlock Holmes style. Tests vocabulary bridging.',
    expectedRelevance: {
      'becoming-a-detective-like-sherlock-holmes': 3,
      'solving-the-speckled-band-mystery': 3,
      'solving-the-boscombe-valley-mystery': 2,
    },
  },

  // COLLOQUIAL (SECONDARY)
  {
    query: 'the shakespeare play about the island',
    category: 'colloquial',
    priority: 'medium',
    description: 'Informal reference to The Tempest.',
    expectedRelevance: {
      'consolidating-our-understanding-of-the-plot-of-the-tempest': 3,
      'prosperos-power-over-caliban': 2,
      'caliban-as-an-outsider': 2,
    },
  },

  // ==========================================
  // KS4 Hard Queries
  // ==========================================

  // NATURALISTIC (KS4)
  {
    query: 'how to teach persuasive writing to GCSE students',
    category: 'naturalistic',
    priority: 'high',
    description: 'Pedagogical intent + informal phrasing. Tests ELSER vocabulary bridging.',
    expectedRelevance: {
      'crafting-a-clear-point-of-view-in-non-fiction-writing': 3,
      'persuasive-opinion-pieces': 3,
      'crafting-a-voice-in-nonfiction-writing': 2,
    },
  },
  {
    query: 'lessons on analysing character in Shakespeare',
    category: 'naturalistic',
    priority: 'high',
    description: 'Generic Shakespeare character analysis request.',
    expectedRelevance: {
      'a-critical-analysis-of-lady-macbeth': 3,
      'assessing-an-argument-about-lady-macbeth': 2,
      'an-exploration-of-act-1-scenes-5-to-7': 2,
    },
  },

  // MISSPELLING (KS4)
  {
    query: 'shakespere macbeth analysis',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of Shakespeare. Tests fuzzy matching.',
    expectedRelevance: {
      'a-critical-analysis-of-lady-macbeth': 3,
      'an-exploration-of-act-1-scenes-1-4': 3,
      'assessing-an-argument-about-lady-macbeth': 2,
    },
  },
  {
    query: 'jekyll and hyde duality analysys',
    category: 'misspelling',
    priority: 'critical',
    description: 'Misspelling of analysis. Tests fuzzy + ELSER recovery.',
    expectedRelevance: {
      'chapter-10-henry-jekylls-full-statement-of-the-case': 3,
      'chapter-10-jekylls-confession': 3,
      'chapter-2-search-for-mr-hyde': 2,
    },
  },

  // SYNONYM (KS4)
  {
    query: 'comprehension skills reading',
    category: 'synonym',
    priority: 'high',
    description: 'Comprehension = reading analysis. Tests synonym handling.',
    expectedRelevance: {
      'making-effective-inferences': 3,
      'how-to-summarise': 3,
      'aiming-high-in-a-comparative-summary': 2,
    },
  },
  {
    query: 'verse analysis techniques',
    category: 'synonym',
    priority: 'high',
    description: 'Verse = poetry. Tests vocabulary bridging.',
    expectedRelevance: {
      'analysing-the-poem-ozymandias': 3,
      'analysing-exposure': 3,
      'developing-comparative-essay-writing-skills': 2,
    },
  },

  // MULTI-CONCEPT (KS4)
  {
    query: 'grammar and punctuation in essay writing',
    category: 'multi-concept',
    priority: 'medium',
    description: 'Cross-topic intersection. Tests concept combination.',
    expectedRelevance: {
      'persuasive-opinion-pieces': 3,
      'an-inspector-calls-annotating-essay-questions-and-writing-a-thesis-statement': 2,
      'developing-comparative-essay-writing-skills': 2,
    },
  },

  // COLLOQUIAL (KS4)
  {
    query: 'that poetry stuff about war and conflict',
    category: 'colloquial',
    priority: 'medium',
    description: 'Very informal phrasing. Tests noise filtering + concept extraction.',
    expectedRelevance: {
      'comparing-conflict-in-war-poems': 3,
      'comparing-power-and-conflict-war-poems': 3,
      'analysing-exposure': 2,
      'analysing-the-poem-bayonet-charge': 2,
    },
  },
] as const;
