/**
 * Religious Education concept synonyms.
 *
 * ⚠️ SENSITIVITY NOTICE
 * This file contains terminology related to religious figures, texts, places of worship, and beliefs.
 * All entries have been reviewed for accuracy and cultural sensitivity.
 *
 * We have made best efforts to represent all traditions fairly and accurately, use terminology
 * that members of each community would recognise, avoid conflating distinct concepts
 * (e.g., Torah ≠ Talmud), and ensure theological precision where appropriate.
 *
 * If you identify any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from religious-education bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 */

export const religiousEducationSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD RELIGIONS — Equal, respectful treatment of all traditions
  // ═══════════════════════════════════════════════════════════════════════════

  christianity: ['christian', 'christians', 'church of england', 'catholicism', 'protestantism'],
  islam: ['muslim', 'muslims', 'islamic'],
  judaism: ['jewish', 'jews', 'jew'],
  hinduism: ['hindu', 'hindus', 'hindu dharma'],
  buddhism: ['buddhist', 'buddhists'],
  sikhism: ['sikh', 'sikhs', 'sikhi'],
  humanism: ['humanist', 'humanists', 'non-religious worldview'],

  // ═══════════════════════════════════════════════════════════════════════════
  // RELIGIOUS CONCEPTS — Generic terms across traditions
  // ═══════════════════════════════════════════════════════════════════════════

  belief: ['beliefs', 'faith', 'believing', 'worldview'],
  worship: ['worshipping', 'prayer', 'praying', 'liturgy', 'devotion'],
  sacred: ['holy', 'divine', 'spiritual', 'reverent'],
  scripture: ['scriptures', 'holy book', 'holy books', 'sacred text', 'religious text'],
  pilgrimage: ['pilgrimages', 'holy journey', 'religious journey'],
  festival: ['festivals', 'religious celebration', 'holy day', 'religious festival'],
  ritual: ['rituals', 'rites', 'ceremony', 'religious practice'],
  covenant: ['solemn promise', 'agreement with god'],
  salvation: ['being saved', 'redemption'],
  afterlife: ['life after death', 'heaven', 'hell', 'resurrection', 'reincarnation'],
  creation: ['the creation', 'genesis'],
  sin: ['sins', 'wrongdoing', 'immorality', 'original sin'],
  suffering: ['pain', 'hardship', 'evil'],
  forgiveness: ['forgiving', 'reconciliation', 'mercy'],
  equality: ['equal treatment', 'fairness'],
  truth: ['facts', 'reality'],
  integrity: ['honesty', 'moral principles'],
  perseverance: ['not giving up', 'persistence'],
  submission: ['obedience', 'humility'],
  trust: ['faith', 'confidence'],
  prophet: ['prophets', 'messenger of god'],
  god: ['deity', 'divine being', 'allah', 'waheguru', 'brahman'],
  messiah: ['mashiach', 'messianic', 'promised saviour'],
  ethics: ['ethical', 'morality', 'moral', 'right and wrong'],
  deontology: ['duty-based ethics', 'kantian ethics'],
  utilitarianism: ['greatest good', 'consequentialism', 'greatest happiness principle'],
  'virtue-ethics': ['virtues', 'character ethics', 'eudaimonia', 'golden mean'],

  // ═══════════════════════════════════════════════════════════════════════════
  // RELIGIOUS FIGURES — Respectful, accurate terminology
  // ═══════════════════════════════════════════════════════════════════════════

  jesus: ['christ', 'jesus christ', 'son of god', 'saviour'],
  muhammad: ['mohammed', 'prophet muhammad', 'pbuh'],
  buddha: ['siddhartha gautama', 'gautama buddha'],
  guru: ['gurus', 'sikh gurus', 'ten gurus', 'guru nanak'],

  // ═══════════════════════════════════════════════════════════════════════════
  // PLACES OF WORSHIP — Separate entries per tradition (NOT conflated)
  // ═══════════════════════════════════════════════════════════════════════════

  church: ['churches', 'chapel', 'cathedral', 'minster', 'abbey'],
  mosque: ['mosques', 'masjid'],
  synagogue: ['synagogues', 'shul'],
  mandir: ['hindu temple', 'hindu mandir'],
  gurdwara: ['sikh temple', 'sikh gurdwara'],
  temple: ['temples', 'buddhist temple'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED TEXTS — Correct distinctions (NOT conflated)
  // ═══════════════════════════════════════════════════════════════════════════

  bible: ['biblical', 'new testament', 'old testament', 'gospel', 'gospels'],
  torah: ['pentateuch', 'five books of moses', 'chumash', 'hebrew bible'],
  talmud: ['rabbinic commentary', 'oral law'],
  tanakh: ['hebrew bible', 'jewish scriptures'],
  quran: ['koran', 'quranic'],
  'guru-granth-sahib': ['sikh scriptures', 'adi granth'],
  vedas: ['vedic texts', 'upanishads'],
  'bhagavad-gita': ['gita'],
  tripitaka: ['pali canon'],

  // ═══════════════════════════════════════════════════════════════════════════
  // FESTIVALS AND PRACTICES
  // ═══════════════════════════════════════════════════════════════════════════

  // Christian
  christmas: ['nativity', 'advent'],
  easter: ['lent', 'resurrection sunday'],

  // Islamic
  ramadan: ['fasting month', 'sawm'],
  'eid-al-fitr': ['eid ul fitr', 'end of ramadan'],
  adhan: ['call to prayer'],
  jummah: ['friday prayer'],

  // Jewish
  hanukkah: ['chanukah', 'festival of lights'],
  purim: ['feast of lots'],
  'rosh-hashanah': ['jewish new year'],
  'yom-kippur': ['day of atonement'],

  // Hindu
  diwali: ['deepavali', 'festival of lights'],
  puja: ['worship ritual'],
  karma: ['action and consequence'],
  samsara: ['cycle of rebirth', 'reincarnation'],
  moksha: ['liberation', 'release from samsara'],
  atman: ['soul', 'self'],
  dharma: ['duty', 'righteous conduct'],

  // Sikh
  langar: ['community kitchen', 'free kitchen'],
  seva: ['selfless service'],
  'ik-onkar': ['one god'],
  'mool-mantar': ['fundamental teaching'],
  dana: ['giving', 'generosity'],
} as const;

export type ReligiousEducationSynonyms = typeof religiousEducationSynonyms;
