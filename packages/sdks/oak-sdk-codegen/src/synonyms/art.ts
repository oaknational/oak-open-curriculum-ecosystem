/**
 * Art concept synonyms.
 *
 * Maps canonical art concepts to alternative terms for search expansion.
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from art bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy and cultural
 * sensitivity. If you identify any inaccuracies or terms that could cause
 * offence, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const artSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNIQUES AND PROCESSES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Composition - arrangement of elements */
  composition: ['arranging', 'layout', 'arrangement'],

  /** Perspective - creating depth */
  perspective: ['depth', 'vanishing point', 'foreshortening'],

  /** Shading - creating tone and depth */
  shading: ['tone', 'tonal work', 'light and dark'],

  /** Mark-making - expressive drawing */
  'mark-making': ['marks', 'drawing marks', 'expressive marks'],

  /** Sketching - quick drawing */
  sketch: ['sketching', 'sketches', 'rough drawing'],

  /** Frottage - rubbing technique */
  frottage: ['rubbing', 'texture rubbing'],

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIA AND MATERIALS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Watercolour - UK/US spelling */
  watercolour: ['watercolor', 'water colour', 'aquarelle'],

  /** Acrylic paint */
  acrylic: ['acrylic paint', 'acrylics'],

  /** Charcoal drawing */
  charcoal: ['charcoal drawing', 'charcoal sketching'],

  /** Collage - mixed media */
  collage: ['mixed media', 'assemblage', 'layering'],

  /** Printmaking - printing techniques */
  printmaking: ['printing', 'print-making', 'relief printing'],

  /** Ceramics - clay work */
  ceramics: ['pottery', 'clay work', 'ceramic'],

  /** Textiles - fabric art */
  textiles: ['fabric', 'textile art', 'fibre art', 'weaving'],

  /** Sculpture - 3D art */
  sculpture: ['3d art', 'three-dimensional art', 'sculptural'],

  /** Calligraphy - decorative writing */
  calligraphy: ['lettering', 'decorative writing'],

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEMENTS AND PRINCIPLES (FORMAL ELEMENTS)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Formal elements - art elements */
  'formal-elements': ['elements of art', 'art elements', 'visual elements'],

  /** Line - linear marks */
  line: ['lines', 'linear'],

  /** Shape and form */
  shape: ['shapes', 'form', 'forms'],

  /** Colour - singular/plural */
  colour: ['colours'],

  /** Texture - surface quality */
  texture: ['surface', 'tactile', 'surface quality'],

  /** Pattern - repetition */
  pattern: ['patterns', 'repetition'],

  /** Tone - light and dark */
  tone: ['tonal', 'value', 'light and dark'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GENRES AND SUBJECTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Portrait - depicting people */
  portrait: ['portraiture', 'self-portrait', 'portraits'],

  /** Landscape - scenery */
  landscape: ['landscapes', 'scenery'],

  /** Still life - arranged objects */
  'still-life': ['still life', 'nature morte'],

  /** Street art - public art */
  'street-art': ['street art', 'graffiti', 'murals', 'public art'],

  // ═══════════════════════════════════════════════════════════════════════════
  // DESIGN AND TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Typography - text design */
  typography: ['lettering', 'type design', 'letterform'],

  /** Graphic design */
  'graphic-design': ['graphic design', 'visual design'],

  /** Typeface - font design */
  typeface: ['font', 'type', 'letterforms'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 3D AND ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  /** 3D work - three-dimensional */
  '3d': ['three-dimensional', 'three dimensional', 'spatial'],

  /** Model - scale representation */
  model: ['models', 'maquette', 'prototype'],

  /** Architecture - building design */
  architecture: ['architectural', 'building design'],
} as const;

export type ArtSynonyms = typeof artSynonyms;
