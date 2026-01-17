/**
 * Physical Education concept synonyms.
 *
 * Maps canonical PE concepts to alternative terms for search expansion.
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from physical-education bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy. If you identify
 * any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const physicalEducationSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GENERAL PE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Physical Education - abbreviations */
  'physical-education': ['pe', 'p.e.', 'sport', 'sports'],

  /** Exercise - physical activity */
  exercise: ['physical activity', 'workout', 'training'],

  /** Fitness - conditioning */
  fitness: ['physical fitness', 'fit', 'conditioning'],

  /** Technique - method */
  technique: ['techniques', 'skill', 'skills'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SPORTS CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Invasion games - team sports */
  'invasion-games': ['invasion sports', 'team games'],

  /** Net and wall games - racket sports */
  'net-games': ['net and wall games', 'racket sports'],

  /** Striking and fielding - bat and ball */
  'striking-fielding': ['striking and fielding', 'bat and ball'],

  /** Athletics - track and field */
  athletics: ['track and field', 'athletic'],

  /** Gymnastics - gym */
  gymnastics: ['gymnastic', 'gym', 'gymnast'],

  /** Dance - movement */
  dance: ['dancing', 'movement', 'choreography'],

  /** Swimming - aquatics */
  swimming: ['swim', 'aquatics', 'water sports'],

  /** Orienteering - navigation activity */
  orienteering: ['navigation', 'map reading'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIFIC SPORTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Football - soccer */
  football: ['soccer'],

  /** Basketball */
  basketball: ['basket ball'],

  /** Netball */
  netball: ['net ball'],

  /** Rugby - union and league */
  rugby: ['rugby union', 'rugby league'],

  /** Tennis */
  tennis: ['lawn tennis'],

  /** Badminton */
  badminton: ['shuttlecock', 'shuttle'],

  /** Cricket - batting and bowling */
  cricket: ['bat and ball'],

  /** Rounders */
  rounders: ['rounder'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MOVEMENT AND SKILLS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Running - locomotion */
  running: ['run', 'sprinting', 'jogging'],

  /** Jumping - leaping */
  jump: ['jumping', 'leap', 'leaping'],

  /** Throwing - sending */
  throwing: ['throw', 'sending'],

  /** Catching - receiving */
  catching: ['catch', 'receiving'],

  /** Landing - finishing a jump */
  landing: ['land', 'touch down'],

  /** Take off - starting a jump */
  'take-off': ['take off', 'launching'],

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH AND FITNESS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Health - wellbeing */
  health: ['healthy', 'wellbeing', 'well-being'],

  /** Warm-up - preparation */
  'warm-up': ['warming up', 'warmup', 'warm up'],

  /** Cool-down - recovery */
  'cool-down': ['cooling down', 'cooldown', 'cool down'],

  /** Stamina - endurance */
  stamina: ['endurance', 'cardiovascular'],

  /** Strength - power */
  strength: ['muscular strength', 'power'],

  /** Flexibility - stretching */
  flexibility: ['stretching', 'suppleness'],

  /** Speed - moving fast */
  speed: ['fast', 'quick', 'accelerate'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MOTOR SKILLS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Coordination - motor skills */
  coordination: ['coordinated', 'motor skills'],

  /** Balance - stability */
  balance: ['balancing', 'stability'],

  /** Agility - quick movement */
  agility: ['agile', 'quick movement'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Team - group */
  team: ['teams', 'teammates', 'group'],

  /** Defending - stopping attackers */
  defending: ['defence', 'defense', 'defenders'],

  /** Attacking - scoring */
  attacking: ['attack', 'attackers', 'offense'],

  /** Score - points */
  score: ['scoring', 'points', 'goals'],

  /** Rules - game rules */
  rules: ['regulations', 'laws of the game'],

  /** Tactics - strategy */
  tactics: ['strategy', 'tactical', 'game plan'],

  /** Competition - competing */
  competition: ['competing', 'contest', 'race'],

  /** Relay - team race */
  relay: ['relay race', 'baton change'],

  /** Leadership - guiding team */
  leadership: ['leader', 'captain', 'leading'],

  /** Communication - team talk */
  communication: ['communicating', 'signalling'],
} as const;

export type PhysicalEducationSynonyms = typeof physicalEducationSynonyms;
