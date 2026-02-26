/**
 * RSHE/PSHE concept synonyms (placeholder).
 *
 * Maps canonical RSHE/PSHE concepts to alternative terms for search expansion.
 *
 * ⚠️ SENSITIVITY NOTICE
 * This file contains terminology related to relationships, identity, health,
 * and personal development. All entries have been reviewed for accuracy,
 * age-appropriateness, and sensitivity.
 *
 * We have made best efforts to:
 * - Use inclusive language that represents all family structures and identities
 * - Use non-stigmatising terminology for mental health and wellbeing
 * - Use empowering, age-appropriate language for safety and consent
 * - Align with statutory RSHE guidance
 *
 * If you identify any inaccuracies, stigmatising language, or terms that
 * could cause offence, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 *
 * @remarks
 * [PLACEHOLDER-2026-01-16] No bulk data available. Based on expected curriculum concepts.
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * ⚠️ WHEN RSHE BULK DATA BECOMES AVAILABLE:
 * 1. Mine the bulk data using the standard process
 * 2. Compare mined vocabulary against these placeholder synonyms
 * 3. Expand entries based on actual curriculum content
 * 4. RE-RUN the full sensitivity review checklist
 * 5. Update the dates above
 */

export const rshePsheSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // RELATIONSHIPS — Inclusive of all family structures and relationship types
  // ═══════════════════════════════════════════════════════════════════════════

  /** Family — inclusive of diverse structures */
  family: ['families', 'family life', 'family structures'],

  /** Relationships — interpersonal connections */
  relationships: ['relationship', 'interpersonal', 'connections'],

  /** Friendship — peer relationships */
  friendship: ['friends', 'friendships', 'peer relationships'],

  /** Healthy relationships — positive connections */
  'healthy-relationships': ['healthy relationship', 'positive relationships'],

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH — Physical and mental, non-stigmatising language
  // ═══════════════════════════════════════════════════════════════════════════

  /** Mental health — non-stigmatising, inclusive terminology */
  'mental-health': ['emotional health', 'wellbeing', 'mental wellbeing', 'emotional wellbeing'],

  /** Physical health — body health */
  'physical-health': ['body health', 'healthy body', 'physical wellbeing'],

  /** Wellbeing — overall health */
  wellbeing: ['well-being', 'wellness', 'health and wellbeing'],

  /** Puberty — growing up */
  puberty: ['growing up', 'adolescence', 'body changes'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SAFETY — Age-appropriate, empowering language
  // ═══════════════════════════════════════════════════════════════════════════

  /** Safety — personal safety */
  safety: ['staying safe', 'personal safety', 'keeping safe'],

  /** Online safety — digital wellbeing */
  'online-safety': ['internet safety', 'digital safety', 'e-safety', 'online wellbeing'],

  /** Consent — permission and boundaries */
  consent: ['permission', 'boundaries', 'personal boundaries'],

  /** Safeguarding — protection */
  safeguarding: ['child protection', 'keeping children safe'],

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSONAL DEVELOPMENT — Inclusive, affirming language
  // ═══════════════════════════════════════════════════════════════════════════

  /** Identity — sense of self */
  identity: ['self-identity', 'who am i', 'sense of self'],

  /** Emotions — feelings */
  emotions: ['feelings', 'emotional', 'how we feel'],

  /** Resilience — coping */
  resilience: ['coping', 'resilient', 'coping strategies', 'bouncing back'],

  /** Self-esteem — self-worth */
  'self-esteem': ['self-worth', 'self-confidence', 'confidence'],

  /** Self-care — looking after yourself */
  'self-care': ['looking after yourself', 'personal care', 'taking care of yourself'],

  // ═══════════════════════════════════════════════════════════════════════════
  // BODY AND SELF — Affirming, inclusive language
  // ═══════════════════════════════════════════════════════════════════════════

  /** Body — our bodies */
  body: ['bodies', 'our bodies'],

  /** Healthy choices — decision making */
  'healthy-choices': ['healthy decisions', 'making good choices'],

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMUNITY AND CITIZENSHIP
  // ═══════════════════════════════════════════════════════════════════════════

  /** Community — belonging */
  community: ['communities', 'belonging', 'local community'],

  /** Respect — treating others well */
  respect: ['respectful', 'respecting others', 'mutual respect'],

  /** Diversity — difference */
  diversity: ['diverse', 'differences', 'celebrating difference'],
} as const;

export type RshePsheSynonyms = typeof rshePsheSynonyms;
