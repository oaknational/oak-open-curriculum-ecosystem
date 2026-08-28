import { CRAFT_AREAS, craftAreaOf, type CraftArea } from './craft-areas';
import type { CatalogueToken } from './token-catalogue';

/**
 * The catalogue as the page's outline: craft area, then prefix family.
 *
 * A family is gathered across TIERS here, and that is the point rather than
 * a side effect. `--border-solid-m` is a tier-1 scale and `--border-primary`
 * a tier-2 role, but a designer reaching for a border wants both in front of
 * them; splitting the family by how the system is layered served the system,
 * not the reader. The tier still travels with each token and is annotated on
 * the rows that carry a usage restriction.
 *
 * Within an area, families keep the order the kit declares them in, and an
 * area with no families does not appear at all — so this is derived from the
 * catalogue rather than curated alongside it.
 */

interface TokenFamily {
  readonly family: string;
  readonly tokens: readonly CatalogueToken[];
}

export interface CraftAreaGroup {
  readonly area: CraftArea;
  readonly title: string;
  readonly note: string;
  readonly families: readonly TokenFamily[];
}

function familiesIn(tokens: readonly CatalogueToken[], area: CraftArea): readonly TokenFamily[] {
  const families = new Map<string, CatalogueToken[]>();
  for (const token of tokens) {
    if (craftAreaOf(token.family) === area) {
      const bucket = families.get(token.family);
      if (bucket === undefined) {
        families.set(token.family, [token]);
      } else {
        bucket.push(token);
      }
    }
  }
  return [...families].map(([family, familyTokens]) => ({ family, tokens: familyTokens }));
}

/** Every craft area that has tokens, each with its families. */
export function groupByCraftArea(tokens: readonly CatalogueToken[]): readonly CraftAreaGroup[] {
  return CRAFT_AREAS.map(({ id, title, note }) => ({
    area: id,
    title,
    note,
    families: familiesIn(tokens, id),
  })).filter((group) => group.families.length > 0);
}
