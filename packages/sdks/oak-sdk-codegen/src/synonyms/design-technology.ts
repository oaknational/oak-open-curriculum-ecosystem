/**
 * Design & Technology concept synonyms.
 *
 * Maps canonical D&T concepts to alternative terms for search expansion.
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from design-technology bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy. If you identify
 * any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const designTechnologySynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // DESIGN PROCESS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Design - the process */
  design: ['designing', 'design process'],

  /** Prototype - test model */
  prototype: ['prototypes', 'prototyping', 'model'],

  /** Iteration - repeated improvement */
  iteration: ['iterative', 'iterate', 'design iteration'],

  /** Specification - design requirements */
  specification: ['specifications', 'design spec', 'design brief'],

  /** CAD - computer-aided design */
  cad: ['computer aided design', 'computer-aided design'],

  /** Evaluate - assess design */
  evaluating: ['evaluate', 'evaluation', 'assessing'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MATERIALS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Materials - general */
  materials: ['material', 'resources'],

  /** Wood - timber */
  wood: ['timber', 'wooden', 'hardwood', 'softwood'],

  /** Metal - metals */
  metal: ['metals', 'metallic'],

  /** Plastic - polymers */
  plastic: ['plastics', 'polymer', 'polymers'],

  /** Textiles - fabrics */
  textiles: ['fabrics', 'textile', 'cloth'],

  // ═══════════════════════════════════════════════════════════════════════════
  // STRUCTURES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Structure - general */
  structure: ['structures', 'structural'],

  /** Frame structure */
  'frame-structure': ['frame structures', 'framework'],

  /** Stability - structural strength */
  stability: ['stable', 'reinforcement'],

  /** Triangulation - structural technique */
  triangulation: ['triangular bracing'],

  /** Join - connecting materials */
  join: ['joining', 'joint', 'joints'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MECHANISMS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Mechanism - mechanical systems */
  mechanism: ['mechanisms', 'mechanical'],

  /** Lever - simple machine */
  lever: ['levers', 'leverage'],

  /** Linkage - connected levers */
  linkage: ['linkages', 'linked'],

  /** Pulley - lifting mechanism */
  pulley: ['pulleys'],

  /** Gear - rotating mechanism */
  gear: ['gears', 'cogs'],

  /** Cam - motion conversion */
  cam: ['cams', 'cam mechanism'],

  /** Pneumatics - air pressure */
  pneumatics: ['pneumatic', 'air pressure'],

  /** Pivot - rotation point */
  pivot: ['pivot point', 'fixed pivot', 'loose pivot'],

  /** Input - starting motion */
  input: ['inputs'],

  /** Output - resulting motion */
  output: ['outputs'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MOTION TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Linear motion - straight line */
  linear: ['linear motion', 'straight line movement'],

  /** Rotary motion - circular */
  rotary: ['rotary motion', 'circular motion', 'rotation'],

  /** Reciprocating motion - back and forth */
  reciprocating: ['reciprocating motion', 'back and forth'],

  /** Oscillating motion - swinging */
  oscillating: ['oscillating motion', 'swinging motion'],

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRONICS AND CONTROL
  // ═══════════════════════════════════════════════════════════════════════════

  /** Electronics - circuits */
  electronics: ['electronic', 'circuits', 'electrical'],

  /** Programming - coding */
  programming: ['coding', 'code', 'programmed'],

  /** Sensor - input device */
  sensor: ['sensors', 'input device'],

  /** Control systems */
  control: ['controlling', 'systems and control'],

  /** Automaton - mechanical toy */
  automaton: ['automata', 'mechanical toy'],

  // ═══════════════════════════════════════════════════════════════════════════
  // SUSTAINABILITY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Sustainability - eco-design */
  sustainability: ['sustainable', 'eco-friendly', 'environmental impact'],

  /** Circular economy - reduce, reuse, recycle */
  'circular-economy': ['recycling', 'reuse', 'sustainable design'],
} as const;

export type DesignTechnologySynonyms = typeof designTechnologySynonyms;
