/**
 * Citizenship concept synonyms.
 *
 * Maps canonical citizenship concepts to alternative terms for search expansion.
 *
 * ⚠️ SENSITIVITY NOTICE
 * This file contains terminology related to politics, identity, and society.
 * All entries have been reviewed for accuracy and sensitivity.
 *
 * We have made best efforts to:
 * - Represent all political perspectives fairly
 * - Use neutral, factual terminology
 * - Avoid partisan or biased language
 *
 * If you identify any inaccuracies, bias, or terms that could cause
 * offence, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from citizenship bulk data (secondary only).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 */

export const citizenshipSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // DEMOCRACY AND GOVERNMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /** Democracy - system of government */
  democracy: ['democratic', 'democratic system', 'democratic government'],

  /** Representative democracy */
  'representative-democracy': [
    'representative democracy',
    'indirect democracy',
    'parliamentary democracy',
  ],

  /** Direct democracy */
  'direct-democracy': ['direct democracy', 'people power'],

  /** Parliament - UK legislature */
  parliament: ['parliamentary', 'house of commons', 'house of lords', 'westminster'],

  /** Government - executive */
  government: ['governing', 'governance', 'the government'],

  /** Election - voting process */
  election: ['elections', 'electoral', 'general election'],

  /** Referendum - public vote */
  referendum: ['referendums', 'referenda', 'public vote', 'plebiscite'],

  /** Constitution - fundamental law */
  constitution: ['constitutional', 'rule of law'],

  // ═══════════════════════════════════════════════════════════════════════════
  // POLITICAL STRUCTURES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Legislative - law-making */
  legislative: ['legislature', 'law-making', 'legislation'],

  /** Executive - government branch */
  executive: ['cabinet', 'prime minister'],

  /** Judiciary - courts */
  judiciary: ['judicial', 'courts', 'judges', 'justice system'],

  /** Devolution - transfer of powers */
  devolution: ['devolved', 'devolved government', 'regional government'],

  /** Local government */
  'local-government': ['local government', 'local council', 'local authority'],

  // ═══════════════════════════════════════════════════════════════════════════
  // POLITICAL PARTICIPATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Voting - electoral participation */
  voting: ['vote', 'votes', 'ballot', 'suffrage'],

  /** Political party - organised group */
  'political-party': ['political parties', 'party politics', 'political organisation'],

  /** MP - member of parliament */
  mp: ['member of parliament', 'mps', 'members of parliament', 'representative'],

  /** Campaign - activism */
  campaign: ['campaigning', 'campaigns', 'activism', 'lobbying'],

  /** Active citizenship - participation */
  'active-citizenship': ['active citizen', 'civic participation', 'civic engagement'],

  /** First past the post - voting system */
  'first-past-the-post': ['first past the post', 'fptp', 'plurality voting'],

  /** Proportional representation */
  'proportional-representation': ['proportional representation', 'pr', 'proportional voting'],

  // ═══════════════════════════════════════════════════════════════════════════
  // LAW AND JUSTICE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Law - rules */
  law: ['laws', 'legal', 'legislation', 'statute'],

  /** Criminal law - crime */
  'criminal-law': ['criminal justice', 'crime law', 'criminal offence'],

  /** Civil law - disputes */
  'civil-law': ['civil justice', 'civil cases', 'civil dispute'],

  /** Justice system - courts */
  'justice-system': ['legal system', 'courts', 'judiciary'],

  /** Sentencing - punishment */
  sentencing: ['sentences', 'punishment', 'penalties'],

  /** Rights - entitlements */
  rights: ['human rights', 'civil rights', 'legal rights', 'fundamental rights'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIETY AND COMMUNITY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Community - local group */
  community: ['communities', 'local community', 'neighbourhood'],

  /** Society - people together */
  society: ['social', 'societal'],

  /** Citizen - member of state */
  citizen: ['citizens', 'citizenship', 'national'],

  /** Identity - who we are */
  identity: ['identities', 'national identity', 'british identity', 'sense of self'],

  /** Diversity - variety */
  diversity: ['diverse', 'multicultural', 'pluralism'],

  /** Equality - equal treatment */
  equality: ['equal rights', 'fairness', 'equal opportunities'],

  /** Discrimination - unfair treatment */
  discrimination: ['prejudice', 'bias', 'unfair treatment'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MIGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Migration - movement of people */
  migration: ['migrant', 'migrants', 'population movement'],

  /** Immigration - entering country */
  immigration: ['immigrant', 'immigrants', 'immigrating'],

  /** Emigration - leaving country */
  emigration: ['emigrant', 'emigrants', 'emigrating'],

  /** Refugee - seeking protection */
  refugee: ['refugees', 'asylum'],

  /** Asylum seeker - seeking protection */
  'asylum-seeker': ['asylum seeker', 'asylum seekers', 'refugee applicant'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIA AND DEMOCRACY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Free press - media freedom */
  'free-press': ['free press', 'press freedom', 'media freedom'],

  /** Censorship - restricting information */
  censorship: ['censor', 'censored', 'information control'],
} as const;

export type CitizenshipSynonyms = typeof citizenshipSynonyms;
