/**
 * Science concept synonyms.
 *
 * Maps canonical science concepts to alternative terms.
 *
 * These are STRICT EQUIVALENCES only (Bucket A from vocabulary-mining.md).
 * Relationships and paraphrases belong in separate channels.
 *
 * @remarks
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples,
 * translations, and pedagogical explanations.
 *
 * [2026-01-23] Added strict equivalences for forces, state changes, and
 * oxidation. British English spelling is canonical.
 */

export const scienceSynonyms = {
  // ============================================================================
  // Forces (strict equivalences only)
  // ============================================================================

  /**
   * Generic forces terminology.
   *
   * @remarks
   * "gravity" is NOT included here — gravity IS a force (a specific type),
   * not a synonym for "forces" in general. See gravity entry below.
   */
  forces: ['force', 'newton', 'newtons'],

  /**
   * Gravity-specific equivalences.
   *
   * These are true equivalences: "gravity" ↔ "gravitational force" ↔ "force of gravity"
   * are interchangeable ways to describe the same phenomenon.
   */
  gravity: ['gravitational force', 'gravitational pull', 'force of gravity', 'gravitational'],

  /**
   * Friction equivalences.
   */
  friction: ['frictional force', 'frictional'],

  // ============================================================================
  // Electromagnetism (strict equivalences only, physics, not electronics or electrical engineering)
  // ============================================================================

  /**
   * Electricity equivalences.
   */
  electricity: ['electric', 'electron', 'current', 'charge', 'valence'],

  /**
   * Magnetism equivalences.
   */
  magnetism: ['magnetic', 'magnet', 'magnets'],

  /**
   * Electromagnetism - the unified field.
   *
   * @remarks
   * Electromagnetism is the unified theory of electricity and magnetism.
   * These are true equivalences at the physics level.
   */
  electromagnetism: ['electromagnetic', 'electromagnetic field', 'EM', 'EM field'],

  // ============================================================================
  // State changes (strict equivalences only)
  // ============================================================================

  'states-of-matter': ['solid', 'liquid', 'gas', 'plasma'],

  /**
   * Solid → Liquid transition.
   */
  melting: ['melt', 'liquefaction'],

  /**
   * Liquid → Solid transition.
   */
  freezing: ['freeze', 'solidification'],

  /**
   * Liquid → Gas transition.
   */
  evaporation: ['evaporate', 'vaporisation'],

  /**
   * Gas → Liquid transition.
   */
  condensation: ['condense', 'condensing'],

  /**
   * Solid → Gas transition (skipping liquid).
   */
  sublimation: ['sublimate', 'sublime'],

  /**
   * Gas → Solid transition (skipping liquid).
   */
  deposition: ['deposit', 'desublimation'],

  /**
   * Liquid → Plasma or Gas → Plasma transition.
   */
  ionisation: ['ionise', 'plasma formation'],

  // ============================================================================
  // Oxidation and corrosion (strict equivalences only)
  // ============================================================================

  /**
   * General oxidation terminology.
   */
  oxidation: ['oxidise', 'oxidising'],

  /**
   * Rusting is specifically iron oxidation.
   */
  rusting: ['rust', 'corrosion'],

  // ============================================================================
  // Biological processes
  // ============================================================================

  photosynthesis: ['chlorophyll', 'chloroplast'],
  respiration: ['aerobic respiration', 'anaerobic respiration'],
  cells: ['cell', 'cell theory', 'cell biology'],
  evolution: ['natural selection', 'adaptation'],

  // ============================================================================
  // Earth science
  // ============================================================================

  'rock-cycle': ['igneous', 'sedimentary', 'metamorphic'],

  // ============================================================================
  // Energy
  // ============================================================================

  energy: ['kinetic energy', 'potential energy', 'conservation of energy'],

  // ============================================================================
  // Mined entries [MINED-2025-12-26]
  // ============================================================================

  'artificial-selection': ['selective breeding'],
  pascal: ['newton per square metre', 'pa', 'n/m²'],
  biosphere: ['living world', 'zone of life'],
} as const;

export type ScienceSynonyms = typeof scienceSynonyms;
