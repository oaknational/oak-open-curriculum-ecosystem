/**
 * The page's top navigation level: craft areas.
 *
 * A designer looking for a token knows what they are trying to do — pick a
 * colour, set type, space something out — long before they know how this
 * system is built. So the first cut is the craft, and the prefix families
 * (`--bg-*`, `--font-*`) sit beneath it. The three-tier model is still true
 * and still matters, but it is a fact ABOUT a token rather than a way in, so
 * it survives as an annotation on the rows that carry a restriction.
 *
 * A family belongs to exactly one area, which is why the mapping is a table
 * of names rather than a rule over them: `--label-*` is case grammar
 * (typography), `--key-*` is alignment (layout), `--control-*` is padding
 * (spacing). No pattern in the names themselves would place those three
 * correctly, and a wrong guess sends a reader to the wrong section.
 *
 * A family with no row here lands in `other`, and a test asserts the real
 * catalogue never uses it — so a family added upstream surfaces as a red
 * test rather than as a quietly mis-filed section.
 */

export type CraftArea =
  'colour' | 'typography' | 'sizing' | 'elevation' | 'motion' | 'layout' | 'components' | 'other';

export interface CraftAreaDescription {
  readonly id: CraftArea;
  readonly title: string;
  readonly note: string;
}

/** Areas in reading order — the order a designer meets them, not the order
 *  the system builds them. */
export const CRAFT_AREAS: readonly CraftAreaDescription[] = [
  {
    id: 'colour',
    title: 'Colour',
    note: 'The palette, and the roles that give it meaning: text, backgrounds, surfaces, decorative bands and state overlays.',
  },
  {
    id: 'typography',
    title: 'Typography',
    note: 'Faces, sizes, weights, line height and letter spacing, plus the composed slots that set a whole ramp at once.',
  },
  {
    id: 'sizing',
    title: 'Sizing and spacing',
    note: 'The spacing scale, control and icon sizes, gaps and insets — and the density knob an identity turns to scale them together.',
  },
  {
    id: 'elevation',
    title: 'Elevation and borders',
    note: 'Border widths and colours, corner radii, shadows, and the focus ring.',
  },
  {
    id: 'motion',
    title: 'Motion',
    note: 'Durations and easing. The full-motion faces collapse to instant under a reduced-motion preference.',
  },
  {
    id: 'layout',
    title: 'Layout',
    note: 'Page structure: stacking order, the canvas and main maps, and the flow and band regions an identity re-composes.',
  },
  {
    id: 'components',
    title: 'Components',
    note: 'Per-part decisions, composed from the roles above. The class library and the compiled React components consume the same ones.',
  },
  {
    id: 'other',
    title: 'Not yet placed',
    note: 'Families the craft map has no row for. If anything appears here, the map has fallen behind the design system.',
  },
];

/**
 * Which craft area each prefix family belongs to. Grouped in source by area
 * so the map reads as the taxonomy it is.
 */
const AREA_BY_FAMILY: Readonly<Record<string, CraftArea>> = {
  // Colour — the palette and every role that carries a colour decision.
  oak: 'colour',
  text: 'colour',
  bg: 'colour',
  surface: 'colour',
  color: 'colour',
  scrim: 'colour',
  state: 'colour',
  filter: 'colour',

  // Typography — faces, the ramp, and the case grammar that goes with it.
  font: 'typography',
  type: 'typography',
  leading: 'typography',
  weight: 'typography',
  tracking: 'typography',
  measure: 'typography',
  label: 'typography',

  // Sizing and spacing — everything measured in space.
  space: 'sizing',
  size: 'sizing',
  gap: 'sizing',
  inset: 'sizing',
  control: 'sizing',
  container: 'sizing',
  density: 'sizing',

  // Elevation and borders — the edges of things.
  border: 'elevation',
  radius: 'elevation',
  shadow: 'elevation',
  focus: 'elevation',

  // Motion.
  motion: 'motion',
  ease: 'motion',

  // Layout — page structure and stacking.
  layer: 'layout',
  main: 'layout',
  canvas: 'layout',
  flow: 'layout',
  key: 'layout',
  band: 'layout',

  // Components — tier-3 per-part tokens.
  btn: 'components',
  tag: 'components',
  card: 'components',
  quiz: 'components',
  input: 'components',
  check: 'components',
  banner: 'components',
  chip: 'components',
  select: 'components',
  field: 'components',
  textarea: 'components',
  radio: 'components',
  modal: 'components',
};

/** The craft area a prefix family belongs to. */
export function craftAreaOf(family: string): CraftArea {
  return AREA_BY_FAMILY[family] ?? 'other';
}

/** The id of a family's section, shared by the heading, the jump link and
 *  the table the heading names. */
export function sectionId(area: CraftArea, family: string): string {
  return `tokens-${area}-${family}`;
}
